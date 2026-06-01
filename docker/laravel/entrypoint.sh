#!/usr/bin/env sh
set -eu

cd /var/www/html

mkdir -p \
  storage/app/public \
  storage/framework/cache/data \
  storage/framework/sessions \
  storage/framework/testing \
  storage/framework/views \
  storage/logs \
  bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache

if [ ! -L public/storage ]; then
  php artisan storage:link >/dev/null 2>&1 || true
fi

if [ "${RUN_LARAVEL_OPTIMIZE:-false}" = "true" ]; then
  php artisan config:cache
  php artisan event:cache || true
  php artisan view:cache || true
fi

exec "$@"
