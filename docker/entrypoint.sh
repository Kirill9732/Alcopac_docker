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
  cp -a "$DEFAULTS_DIR/module/." "$APP_DIR/module/"
fi

# torrserver (accs.db и т.д.)
if [ -d "$DEFAULTS_DIR/torrserver" ] && [ -z "$(ls -A "$APP_DIR/torrserver" 2>/dev/null)" ]; then
  echo "[entrypoint] Инициализация torrserver/ из defaults..."
  cp -a "$DEFAULTS_DIR/torrserver/." "$APP_DIR/torrserver/"
fi

# Обновление TorrServer бинарника из defaults (при обновлении образа)
if [ -x "$DEFAULTS_DIR/torrserver/TorrServer-linux" ]; then
  if [ ! -x "$APP_DIR/torrserver/TorrServer-linux" ] || \
     [ "$DEFAULTS_DIR/torrserver/TorrServer-linux" -nt "$APP_DIR/torrserver/TorrServer-linux" ]; then
    echo "[entrypoint] Обновляю TorrServer бинарник из defaults..."
    cp "$DEFAULTS_DIR/torrserver/TorrServer-linux" "$APP_DIR/torrserver/TorrServer-linux"
    chmod 0755 "$APP_DIR/torrserver/TorrServer-linux"
  fi
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

# config.toml (primary TOML config — created if missing)
if [ ! -f "$CONFIG_DIR/config.toml" ] && [ -f "$DEFAULTS_DIR/config.toml" ]; then
  echo "[entrypoint] Создаю config/config.toml из шаблона..."
  cp "$DEFAULTS_DIR/config.toml" "$CONFIG_DIR/config.toml"
fi

# ── права на приватные файлы ──
chmod 0600 "$APP_DIR/cache/aeskey" 2>/dev/null || true
chmod 0600 "$APP_DIR/torrserver/accs.db" 2>/dev/null || true
chmod 0600 "$APP_DIR/database/tgauth/tokens.json" 2>/dev/null || true

# ── TorrServer (фоновый процесс) ──
TS_BIN="$APP_DIR/torrserver/TorrServer-linux"
TS_PORT="${TORRSERVER_PORT:-9080}"

if [ -x "$TS_BIN" ]; then
  echo "[entrypoint] Запуск TorrServer на порту ${TS_PORT}..."
  "$TS_BIN" --port "$TS_PORT" --path "$APP_DIR/torrserver" &
  TS_PID=$!
  echo "[entrypoint] TorrServer PID: $TS_PID"
else
  echo "[entrypoint] TorrServer не найден — пропускаю"
fi

echo "[entrypoint] Запуск lampac-go..."
exec /usr/local/bin/lampac-go
