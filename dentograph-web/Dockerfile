# syntax=docker/dockerfile:1.7

FROM composer:2 AS vendor
WORKDIR /app
COPY dentograph-web/composer.json dentograph-web/composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --no-scripts \
    --no-autoloader
COPY dentograph-web/ ./
RUN composer dump-autoload --optimize --classmap-authoritative --no-dev

FROM node:22-bookworm-slim AS node

FROM php:8.4-cli-bookworm AS assets
WORKDIR /app
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        libcurl4-openssl-dev \
        libonig-dev \
        libzip-dev \
        unzip \
    && docker-php-ext-install -j"$(nproc)" curl mbstring zip \
    && ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \
    && rm -rf /var/lib/apt/lists/*
COPY dentograph-web/package.json dentograph-web/package-lock.json dentograph-web/.npmrc ./
RUN npm ci
COPY dentograph-web/ ./
COPY --from=vendor /app/vendor ./vendor
RUN php artisan package:discover --ansi || true
RUN npm run build

FROM php:8.4-fpm-bookworm AS app
WORKDIR /var/www/html

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        default-mysql-client \
        libfreetype6-dev \
        libicu-dev \
        libjpeg62-turbo-dev \
        libonig-dev \
        libpng-dev \
        libzip-dev \
        unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        gd \
        intl \
        mbstring \
        opcache \
        pcntl \
        pdo_mysql \
        zip \
    && rm -rf /var/lib/apt/lists/*

COPY docker/laravel/entrypoint.sh /usr/local/bin/laravel-entrypoint
RUN chmod +x /usr/local/bin/laravel-entrypoint

COPY dentograph-web/ ./
COPY --from=vendor /app/vendor ./vendor
COPY --from=assets /app/public/build ./public/build

RUN php artisan package:discover --ansi || true \
    && mkdir -p storage/app/public storage/framework/cache/data storage/framework/sessions storage/framework/testing storage/framework/views storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

ENV APP_ENV=production
EXPOSE 9000
ENTRYPOINT ["laravel-entrypoint"]
CMD ["php-fpm"]

FROM nginx:1.27-alpine AS nginx
WORKDIR /var/www/html
COPY docker/laravel/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=app /var/www/html/public ./public
