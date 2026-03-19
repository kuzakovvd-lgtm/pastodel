#!/usr/bin/env bash

set -euo pipefail
umask 022

APP_DIR="${APP_DIR:-/opt/pastodel}"
WEB_ROOT="${WEB_ROOT:-/var/www/pastodel}"
ARCHIVE_PATH="${ARCHIVE_PATH:-/tmp/pastodel-deploy.tgz}"

cleanup_macos_junk() {
  local target
  for target in "$@"; do
    [ -d "$target" ] || continue
    find "$target" -type f \( -name '._*' -o -name '.DS_Store' \) -delete
  done
}

mkdir -p "$APP_DIR" "$WEB_ROOT"

tar -xzf "$ARCHIVE_PATH" -C "$APP_DIR"

cleanup_macos_junk "$APP_DIR" "$WEB_ROOT"

cd "$APP_DIR"
npm run build

if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete --exclude '.DS_Store' --exclude '._*' dist/ "$WEB_ROOT/"
else
  find "$WEB_ROOT" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
  cp -a dist/. "$WEB_ROOT/"
  cleanup_macos_junk "$WEB_ROOT"
fi

cleanup_macos_junk "$APP_DIR/dist" "$WEB_ROOT"
find "$WEB_ROOT" -type d -exec chmod 755 {} +
find "$WEB_ROOT" -type f -exec chmod 644 {} +

nginx -t
systemctl reload nginx

echo "Deploy complete"
