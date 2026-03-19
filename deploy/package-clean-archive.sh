#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ARCHIVE_PATH="${1:-/tmp/pastodel-deploy.tgz}"
STAGE_DIR="$(mktemp -d /tmp/pastodel-stage.XXXXXX)"

cleanup() {
  rm -rf "$STAGE_DIR"
}

trap cleanup EXIT

rsync -a \
  --delete \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  --exclude 'dist/' \
  --exclude '.astro/' \
  --exclude 'ssl/' \
  --exclude '.DS_Store' \
  --exclude '._*' \
  "$ROOT_DIR/" "$STAGE_DIR/"

find "$STAGE_DIR" -type f \( -name '.DS_Store' -o -name '._*' \) -delete

if command -v xattr >/dev/null 2>&1; then
  xattr -rc "$STAGE_DIR" 2>/dev/null || true
fi

mkdir -p "$(dirname "$ARCHIVE_PATH")"
rm -f "$ARCHIVE_PATH"

COPYFILE_DISABLE=1 COPY_EXTENDED_ATTRIBUTES_DISABLE=1 \
tar --format ustar \
  --exclude '.DS_Store' \
  --exclude '._*' \
  -czf "$ARCHIVE_PATH" \
  -C "$STAGE_DIR" .

echo "Created clean archive: $ARCHIVE_PATH"
