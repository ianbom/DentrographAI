# Docker Deployment

Target VPS: Debian tanpa Docker Desktop. Stack Docker ini menjalankan Laravel, FastAPI, MariaDB, Caddy HTTPS, dan proxy kecil untuk Ollama host.

## Prasyarat DNS

Pastikan A record mengarah ke IP VPS:

- `dentograph.iandev.my.id`
- `api.dentograph.iandev.my.id`

Caddy tidak bisa membuat sertifikat HTTPS jika DNS belum mengarah ke VPS.

## Prasyarat Ollama

Ollama tetap berjalan di VPS host, bukan container. Script memakai `ollama-proxy` untuk meneruskan request dari container ke:

```bash
http://127.0.0.1:11434
```

Model yang dibutuhkan:

```bash
ollama pull bge-m3:567m
ollama pull llama3.1:8b-instruct-q8_0
```

## Model FastAPI

Taruh file model di VPS:

```text
dentograph-yolo/models/best22.pt
dentograph-yolo/models/best_kelainangigi.pth
```

File model tidak ikut image Docker agar build tidak berat.

## Deploy

Di VPS:

```bash
cd /var/www/DentrographAI
cp .env.docker.example .env.docker
cp .env.fastapi.docker.example .env.fastapi.docker
nano .env.docker
nano .env.fastapi.docker
mkdir -p dentograph-yolo/models
bash scripts/deploy-docker.sh
```

Jika port 80/443 masih dipakai Nginx/Apache/Caddy host, jalankan:

```bash
STOP_HOST_NGINX=true bash scripts/deploy-docker.sh
```

Script akan:

- install Docker Engine jika belum ada
- generate `APP_KEY` dan password database jika masih default
- sinkronkan credential DB Laravel dan FastAPI
- build image Laravel dan FastAPI
- start Caddy HTTPS, MariaDB, Laravel, worker queue, FastAPI, Ollama proxy
- menjalankan `php artisan migrate --force`
- cache config Laravel produksi
- cek `https://dentograph.iandev.my.id/up`
- cek `https://api.dentograph.iandev.my.id/health`

## Perintah Operasional

```bash
docker compose --env-file .env.docker ps
docker compose --env-file .env.docker logs -f caddy
docker compose --env-file .env.docker logs -f laravel-app
docker compose --env-file .env.docker logs -f fastapi
docker compose --env-file .env.docker exec laravel-app php artisan migrate --force
docker compose --env-file .env.docker restart laravel-app fastapi laravel-worker
```

## URL Produksi

- Laravel: `https://dentograph.iandev.my.id`
- FastAPI health: `https://api.dentograph.iandev.my.id/health`
