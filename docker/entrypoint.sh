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
  "$APP_DIR/torrserver"

# ── заполняем пустые volumes из _defaults ──
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

# custom plugins (user-uploaded via admin panel)
mkdir -p "$APP_DIR/plugins/custom"
if [ -d "$DEFAULTS_DIR/plugins/custom" ] && [ -z "$(ls -A "$APP_DIR/plugins/custom" 2>/dev/null)" ]; then
  echo "[entrypoint] Инициализация plugins/custom/ из defaults..."
  cp -a "$DEFAULTS_DIR/plugins/custom/." "$APP_DIR/plugins/custom/"
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
# lampac-go also has a built-in process manager that will auto-start
# TorrServer if it detects the binary but can't connect. This entrypoint
# launch is the primary path; the Go manager is the fallback.
TS_BIN="$APP_DIR/torrserver/TorrServer-linux"
TS_PORT="${TORRSERVER_PORT:-9080}"
TS_ACCS="$APP_DIR/torrserver/accs.db"
TS_LOG="$APP_DIR/torrserver/torrserver.log"

if [ -x "$TS_BIN" ]; then
  # Auto-generate accs.db with random password if missing (secure by default).
  if [ ! -f "$TS_ACCS" ]; then
    TS_PASS=$(head -c 16 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 16)
    echo "{\"ts\":\"${TS_PASS}\"}" > "$TS_ACCS"
    chmod 0600 "$TS_ACCS"
    echo "[entrypoint] Сгенерирован пароль TorrServer (accs.db)"
  fi

  echo "[entrypoint] Запуск TorrServer на порту ${TS_PORT}..."
  if [ -f "$TS_ACCS" ]; then
    "$TS_BIN" --port "$TS_PORT" --path "$APP_DIR/torrserver" --accs "$TS_ACCS" \
      > "$TS_LOG" 2>&1 &
  else
    "$TS_BIN" --port "$TS_PORT" --path "$APP_DIR/torrserver" \
      > "$TS_LOG" 2>&1 &
  fi
  TS_PID=$!
  echo "[entrypoint] TorrServer PID: $TS_PID"

  # Health check: wait up to 5 seconds for TorrServer to respond.
  TS_OK=0
  for i in 1 2 3 4 5; do
    sleep 1
    if kill -0 "$TS_PID" 2>/dev/null; then
      if curl -sf "http://127.0.0.1:${TS_PORT}/echo" >/dev/null 2>&1; then
        TS_OK=1
        echo "[entrypoint] ✓ TorrServer запущен (порт ${TS_PORT})"
        break
      fi
    else
      echo "[entrypoint] ✗ TorrServer процесс завершился (PID $TS_PID)"
      echo "[entrypoint] Последние строки лога:"
      tail -20 "$TS_LOG" 2>/dev/null || true
      break
    fi
  done
  if [ "$TS_OK" = "0" ] && kill -0 "$TS_PID" 2>/dev/null; then
    echo "[entrypoint] ⚠ TorrServer запущен но не отвечает на порту ${TS_PORT} (возможно долгая инициализация)"
  fi
else
  echo "[entrypoint] TorrServer бинарник не найден ($TS_BIN) — пропускаю"
  echo "[entrypoint] Для установки: скачайте TorrServer-linux в $APP_DIR/torrserver/"
fi

echo "[entrypoint] Запуск lampac-go..."
exec /usr/local/bin/lampac-go
