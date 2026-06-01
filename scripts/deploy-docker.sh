#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

LARAVEL_DOMAIN="${LARAVEL_DOMAIN:-dentograph.iandev.my.id}"
FASTAPI_DOMAIN="${FASTAPI_DOMAIN:-api.dentograph.iandev.my.id}"
STOP_HOST_NGINX="${STOP_HOST_NGINX:-false}"

if [ "$(id -u)" -eq 0 ]; then
  SUDO=""
else
  SUDO="sudo"
fi

log() {
  printf '\n[%s] %s\n' "$(date '+%H:%M:%S')" "$*"
}

warn() {
  printf '\n[WARN] %s\n' "$*" >&2
}

set_env() {
  local file="$1"
  local key="$2"
  local value="$3"
  local escaped
  escaped="$(printf '%s' "$value" | sed -e 's/[&|]/\\&/g')"

  if grep -q "^${key}=" "$file"; then
    sed -i "s|^${key}=.*|${key}=${escaped}|" "$file"
  else
    printf '%s=%s\n' "$key" "$value" >> "$file"
  fi
}

get_env() {
  local file="$1"
  local key="$2"
  grep -E "^${key}=" "$file" | tail -n 1 | cut -d '=' -f 2- | tr -d '\r' | sed -e 's/^"//' -e 's/"$//'
}

random_secret() {
  openssl rand -hex 24
}

ensure_host_tools() {
  if ! command -v curl >/dev/null 2>&1 || ! command -v openssl >/dev/null 2>&1 || ! command -v ss >/dev/null 2>&1; then
    log "Install host tools"
    $SUDO apt-get update
    $SUDO apt-get install -y ca-certificates curl openssl iproute2
  fi
}

ensure_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    log "Install Docker Engine"
    curl -fsSL https://get.docker.com | $SUDO sh
  fi

  if docker info >/dev/null 2>&1; then
    DOCKER=(docker)
  else
    DOCKER=($SUDO docker)
  fi

  "${DOCKER[@]}" compose version >/dev/null
}

prepare_env_files() {
  if [ ! -f .env.docker ]; then
    cp .env.docker.example .env.docker
  fi

  if [ ! -f .env.fastapi.docker ]; then
    cp .env.fastapi.docker.example .env.fastapi.docker
  fi

  local app_key db_password db_root_password db_database db_username
  app_key="$(get_env .env.docker APP_KEY || true)"
  if [ -z "$app_key" ] || [ "$app_key" = "base64:CHANGE_ME_GENERATE_WITH_SCRIPT" ]; then
    set_env .env.docker APP_KEY "base64:$(openssl rand -base64 32)"
  fi

  db_password="$(get_env .env.docker DB_PASSWORD || true)"
  if [ -z "$db_password" ] || [ "$db_password" = "change_me" ]; then
    db_password="$(random_secret)"
    set_env .env.docker DB_PASSWORD "$db_password"
    set_env .env.docker MYSQL_PASSWORD "$db_password"
  fi

  db_root_password="$(get_env .env.docker MYSQL_ROOT_PASSWORD || true)"
  if [ -z "$db_root_password" ] || [ "$db_root_password" = "change_root" ]; then
    set_env .env.docker MYSQL_ROOT_PASSWORD "$(random_secret)"
  fi

  db_database="$(get_env .env.docker DB_DATABASE)"
  db_username="$(get_env .env.docker DB_USERNAME)"
  db_password="$(get_env .env.docker DB_PASSWORD)"

  set_env .env.docker APP_URL "https://${LARAVEL_DOMAIN}"
  set_env .env.docker DB_CONNECTION mysql
  set_env .env.docker DB_HOST mariadb
  set_env .env.docker DB_PORT 3306
  set_env .env.docker MYSQL_DATABASE "$db_database"
  set_env .env.docker MYSQL_USER "$db_username"
  set_env .env.docker MYSQL_PASSWORD "$db_password"
  set_env .env.docker AI_SERVICE_URL http://fastapi:8001
  set_env .env.docker AI_EMBEDDING_SERVICE_URL http://fastapi:8001
  set_env .env.docker AI_LLM_SERVICE_URL http://fastapi:8001

  set_env .env.fastapi.docker AI_SERVICE_HOST 0.0.0.0
  set_env .env.fastapi.docker AI_SERVICE_PORT 8001
  set_env .env.fastapi.docker DB_HOST mariadb
  set_env .env.fastapi.docker DB_PORT 3306
  set_env .env.fastapi.docker DB_DATABASE "$db_database"
  set_env .env.fastapi.docker DB_USERNAME "$db_username"
  set_env .env.fastapi.docker DB_PASSWORD "$db_password"
  set_env .env.fastapi.docker OLLAMA_BASE_URL http://host.docker.internal:11435
  set_env .env.fastapi.docker YOLO_MODEL_PATH /app/models/best22.pt
  set_env .env.fastapi.docker VIT_MODEL_PATH /app/models/best_kelainangigi.pth
}

check_dns() {
  local public_ip resolved domain
  public_ip="$(curl -fsS --max-time 5 https://api.ipify.org || true)"
  for domain in "$LARAVEL_DOMAIN" "$FASTAPI_DOMAIN"; do
    resolved="$(getent ahostsv4 "$domain" 2>/dev/null | awk '{print $1}' | sort -u | tr '\n' ' ' || true)"
    if [ -z "$resolved" ]; then
      warn "DNS belum resolve: ${domain}"
    elif [ -n "$public_ip" ] && ! printf '%s' "$resolved" | grep -q "$public_ip"; then
      warn "DNS ${domain} resolve ke [${resolved}], bukan IP VPS ${public_ip}"
    fi
  done
}

check_models_and_ollama() {
  mkdir -p dentograph-yolo/models

  if [ ! -f dentograph-yolo/models/best22.pt ]; then
    warn "Model belum ada: dentograph-yolo/models/best22.pt"
  fi

  if [ ! -f dentograph-yolo/models/best_kelainangigi.pth ]; then
    warn "Model belum ada: dentograph-yolo/models/best_kelainangigi.pth"
  fi

  if ! curl -fsS --max-time 5 http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then
    warn "Ollama host belum terdeteksi di http://127.0.0.1:11434"
  fi
}

compose_caddy_running() {
  "${DOCKER[@]}" compose --env-file .env.docker ps --services --filter status=running 2>/dev/null | grep -qx caddy
}

ports_busy() {
  ss -ltnp 2>/dev/null | grep -E ':(80|443)\s' >/dev/null 2>&1
}

free_http_ports_or_exit() {
  if ports_busy && ! compose_caddy_running; then
    if [ "$STOP_HOST_NGINX" = "true" ]; then
      log "Stop host web server on ports 80/443"
      $SUDO systemctl disable --now nginx >/dev/null 2>&1 || true
      $SUDO systemctl disable --now apache2 >/dev/null 2>&1 || true
      $SUDO systemctl disable --now caddy >/dev/null 2>&1 || true
      sleep 2
    fi
  fi

  if ports_busy && ! compose_caddy_running; then
    ss -ltnp | grep -E ':(80|443)\s' || true
    printf '\nPort 80/443 masih dipakai. Jalankan ulang dengan:\n  STOP_HOST_NGINX=true bash scripts/deploy-docker.sh\n' >&2
    exit 1
  fi
}

deploy_stack() {
  log "Build Docker images"
  "${DOCKER[@]}" compose --env-file .env.docker build

  log "Start services"
  "${DOCKER[@]}" compose --env-file .env.docker up -d

  log "Run Laravel migrations"
  "${DOCKER[@]}" compose --env-file .env.docker exec -T laravel-app php artisan migrate --force

  log "Cache Laravel production config"
  "${DOCKER[@]}" compose --env-file .env.docker exec -T laravel-app php artisan optimize:clear
  "${DOCKER[@]}" compose --env-file .env.docker exec -T laravel-app php artisan config:cache
  "${DOCKER[@]}" compose --env-file .env.docker exec -T laravel-app php artisan event:cache || true
  "${DOCKER[@]}" compose --env-file .env.docker exec -T laravel-app php artisan view:cache || true

  "${DOCKER[@]}" compose --env-file .env.docker ps
}

verify_stack() {
  log "Verify local containers"
  "${DOCKER[@]}" compose --env-file .env.docker exec -T fastapi curl -fsS http://127.0.0.1:8001/health >/dev/null
  "${DOCKER[@]}" compose --env-file .env.docker exec -T laravel-app php artisan about --only=environment >/dev/null

  log "Verify HTTPS domains"
  curl -fsS --retry 8 --retry-delay 5 "https://${LARAVEL_DOMAIN}/up" || warn "Laravel HTTPS check belum sukses"
  curl -fsS --retry 8 --retry-delay 5 "https://${FASTAPI_DOMAIN}/health" || warn "FastAPI HTTPS check belum sukses"
}

main() {
  ensure_host_tools
  ensure_docker
  prepare_env_files
  check_dns
  check_models_and_ollama
  free_http_ports_or_exit
  deploy_stack
  verify_stack

  log "Done"
  printf 'Laravel: https://%s\nFastAPI: https://%s/health\n' "$LARAVEL_DOMAIN" "$FASTAPI_DOMAIN"
}

main "$@"
