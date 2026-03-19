# Nginx-конфигурация для `pastodel.ru`

Ниже пример рабочей конфигурации для размещения статической Astro-сборки на Ubuntu с Nginx на сервере, где может быть несколько сайтов.

Предполагается, что сайт развернут в:

```bash
/var/www/pastodel
```

## 1. Default catch-all для всех неизвестных хостов

Такой конфиг нужен, чтобы IP сервера или чужие `Host`-заголовки не открывали Pastodel по умолчанию.

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    return 444;
}
```

## 2. Конфиг Pastodel

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name pastodel.ru www.pastodel.ru 85.239.63.149;

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

IP можно оставить временно, пока домен не переключен на сервер. После обновления DNS его лучше убрать из `server_name`, чтобы сайт открывался только по домену.

## Подключение конфига

1. Создайте default-конфиг:

```bash
sudo nano /etc/nginx/sites-available/default-catchall
```

2. Вставьте в него `default_server` из раздела выше.

3. Создайте конфиг сайта:

```bash
sudo nano /etc/nginx/sites-available/pastodel.ru
```

4. Вставьте конфиг сайта выше.

5. Создайте симлинки:

```bash
sudo ln -s /etc/nginx/sites-available/default-catchall /etc/nginx/sites-enabled/default-catchall
sudo ln -s /etc/nginx/sites-available/pastodel.ru /etc/nginx/sites-enabled/pastodel.ru
```

6. Если активен стандартный `default`, удалите его:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
```

7. Проверьте конфигурацию:

```bash
sudo nginx -t
```

8. Перезагрузите Nginx:

```bash
sudo systemctl reload nginx
```

## HTTPS

После публикации DNS-записей можно выпустить сертификат Let’s Encrypt:

```bash
sudo certbot --nginx -d pastodel.ru -d www.pastodel.ru
```

После этого Nginx автоматически добавит HTTPS-конфигурацию и редирект с HTTP, если выбран соответствующий сценарий в Certbot.
