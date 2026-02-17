#!/usr/bin/env sh
set -eu

APP_DIR="/opt/lampac"
CONFIG_DIR="$APP_DIR/config"
DEFAULTS_DIR="$APP_DIR/_defaults"

# ── создаём все рабочие директории ──
mkdir -p \
  "$CONFIG_DIR" \
  "$APP_DIR/cache" \
  "$APP_DIR/database/bookmark" \
  "$APP_DIR/database/timecode" \
  "$APP_DIR/database/storage" \
  "$APP_DIR/database/sisi/bookmarks" \
  "$APP_DIR/database/sisi/history" \
  "$APP_DIR/database/tgauth" \
  "$APP_DIR/data" \
  "$APP_DIR/module" \
  "$APP_DIR/torrserver"

# ── заполняем пустые volumes из _defaults ──
# module (manifest.json, JacRed.conf)
if [ -d "$DEFAULTS_DIR/module" ] && [ -z "$(ls -A "$APP_DIR/module" 2>/dev/null)" ]; then
  echo "[entrypoint] Инициализация module/ из defaults..."
  cp -a "$DEFAULTS_DIR/module/"* "$APP_DIR/module/"
fi

# torrserver (accs.db и т.д.)
if [ -d "$DEFAULTS_DIR/torrserver" ] && [ -z "$(ls -A "$APP_DIR/torrserver" 2>/dev/null)" ]; then
  echo "[entrypoint] Инициализация torrserver/ из defaults..."
  cp -a "$DEFAULTS_DIR/torrserver/"* "$APP_DIR/torrserver/"
fi

# ── конфигурация ──
if [ ! -f "$CONFIG_DIR/current.conf" ] && [ -f "$DEFAULTS_DIR/templates/current.conf" ]; then
  echo "[entrypoint] Создаю config/current.conf из шаблона..."
  cp "$DEFAULTS_DIR/templates/current.conf" "$CONFIG_DIR/current.conf"
fi

if [ ! -f "$CONFIG_DIR/init.json" ] && [ -f "$DEFAULTS_DIR/templates/init.json.example" ]; then
  echo "[entrypoint] Создаю config/init.json из шаблона..."
  cp "$DEFAULTS_DIR/templates/init.json.example" "$CONFIG_DIR/init.json"
fi

# ── права на приватные файлы ──
chmod 0600 "$APP_DIR/cache/aeskey" 2>/dev/null || true
chmod 0600 "$APP_DIR/torrserver/accs.db" 2>/dev/null || true
chmod 0600 "$APP_DIR/database/tgauth/tokens.json" 2>/dev/null || true

echo "[entrypoint] Запуск lampac-go..."
exec /usr/local/bin/lampac-go
