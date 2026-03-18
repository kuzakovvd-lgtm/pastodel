# Nginx-конфигурация для `pastodel.ru`

Ниже пример рабочего server block для размещения статической Astro-сборки на Ubuntu с Nginx.

Предполагается, что сайт развернут в:

```bash
/var/www/pastodel/dist
```

## Пример server block

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name pastodel.ru www.pastodel.ru;

    root /var/www/pastodel/dist;
    index index.html;

    access_log /var/log/nginx/pastodel.access.log;
    error_log /var/log/nginx/pastodel.error.log warn;

    gzip on;
    gzip_comp_level 5;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        application/xml
        application/rss+xml
        image/svg+xml;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }

    location = /favicon.svg {
        access_log off;
        log_not_found off;
        try_files $uri =404;
    }

    location = /robots.txt {
        access_log off;
        log_not_found off;
        try_files $uri =404;
    }

    location ~* \.(?:css|js|mjs|json|svg|ico|jpg|jpeg|png|gif|webp|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}
```

## Подключение конфига

1. Создайте файл:

```bash
sudo nano /etc/nginx/sites-available/pastodel.ru
```

2. Вставьте конфиг выше.

3. Создайте симлинк:

```bash
sudo ln -s /etc/nginx/sites-available/pastodel.ru /etc/nginx/sites-enabled/pastodel.ru
```

4. Проверьте конфигурацию:

```bash
sudo nginx -t
```

5. Перезагрузите Nginx:

```bash
sudo systemctl reload nginx
```

## HTTPS

После публикации DNS-записей можно выпустить сертификат Let’s Encrypt:

```bash
sudo certbot --nginx -d pastodel.ru -d www.pastodel.ru
```

После этого Nginx автоматически добавит HTTPS-конфигурацию и редирект с HTTP, если выбран соответствующий сценарий в Certbot.
