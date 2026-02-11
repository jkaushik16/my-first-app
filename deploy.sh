#!/usr/bin/env bash
set -euo pipefail

SRC_DIR="$(pwd)"
DEST_DIR="/var/www/first"

if [[ $EUID -ne 0 ]]; then
  echo "This script must be run as root (sudo) so it can write to $DEST_DIR and reload nginx." >&2
  exit 1
fi

rsync -a --delete "$SRC_DIR/" "$DEST_DIR/"
systemctl reload nginx
