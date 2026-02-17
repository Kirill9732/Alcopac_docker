#!/usr/bin/env bash
set -euo pipefail

# ============================================================
#   Al(co)pac Docker — Интерактивный установщик
#   Создаёт полный конфиг, настраивает директории и volumes,
#   собирает и запускает контейнер.
# ============================================================

# ── цвета ──
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[0;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'

log()  { echo -e "  ${GREEN}✓${NC} $*"; }
info() { echo -e "  ${CYAN}ℹ${NC} $*"; }
warn() { echo -e "  ${YELLOW}⚠${NC} $*"; }
err()  { echo -e "  ${RED}✗${NC} $*"; exit 1; }
step() { echo ""; echo -e "${BOLD}[$1/6] $2${NC}"; echo ""; }

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_DIR="$ROOT_DIR/config"
NON_INTERACTIVE="${INSTALL_NONINTERACTIVE:-false}"

# ── вспомогательные функции ──

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || err "Не найдено: $1"
}

ask() {
  local prompt="$1" default="${2:-}"
  local reply
  if [ "$NON_INTERACTIVE" = "true" ] || [ ! -t 0 ]; then
    echo "${default}"
    return 0
  fi
  if [ -n "$default" ]; then
    printf "  ${CYAN}?${NC} %s [${DIM}%s${NC}]: " "$prompt" "$default" >&2
  else
    printf "  ${CYAN}?${NC} %s: " "$prompt" >&2
  fi
  read -r reply < /dev/tty
  echo "${reply:-$default}"
}

ask_yn() {
  local prompt="$1" default="${2:-n}"
  local reply
  if [ "$NON_INTERACTIVE" = "true" ] || [ ! -t 0 ]; then
    reply="$default"
  else
    if [ "$default" = "y" ]; then
      printf "  ${CYAN}?${NC} %s [Y/n]: " "$prompt" >&2
    else
      printf "  ${CYAN}?${NC} %s [y/N]: " "$prompt" >&2
    fi
    read -r reply < /dev/tty
  fi
  reply="$(printf '%s' "${reply:-$default}" | tr '[:upper:]' '[:lower:]')"
  case "$reply" in y|yes|д|да) echo "true" ;; *) echo "false" ;; esac
}

json_escape() {
  printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'
}

json_str() {
  if [ -z "$1" ]; then printf '""'; else printf '"%s"' "$(json_escape "$1")"; fi
}

# ─── Шаг 1: Проверка окружения ────────────────────────────────

step 1 "Проверка окружения"

require_cmd docker
require_cmd curl
require_cmd jq

COMPOSE_CMD=""
if docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
else
  err "Не найден Docker Compose (ни plugin 'docker compose', ни бинарь 'docker-compose')."
fi

docker info >/dev/null 2>&1 || err "Docker daemon недоступен. Запустите Docker и повторите."

HOST_ARCH="$(uname -m)"
case "$HOST_ARCH" in
  x86_64)       TARGET_ARCH="amd64" ;;
  aarch64|arm64) TARGET_ARCH="arm64" ;;
  *)            TARGET_ARCH="unknown" ;;
esac

log "Docker: OK  |  Compose: $COMPOSE_CMD"
log "Архитектура: $HOST_ARCH ($TARGET_ARCH)"
if [ "$NON_INTERACTIVE" = "true" ] || [ ! -t 0 ]; then
  info "Режим без TTY: использую значения по умолчанию (или из env)"
fi

if [ "$TARGET_ARCH" = "unknown" ]; then
  warn "Неизвестная архитектура. Dockerfile поддерживает amd64/arm64."
fi

if [ ! -f "$ROOT_DIR/app/lampac-go-amd64" ] || [ ! -f "$ROOT_DIR/app/lampac-go-arm64" ]; then
  err "Не найдены бинарники app/lampac-go-amd64 и/или app/lampac-go-arm64. Проверьте комплект."
fi

# ─── Шаг 2: Интерактивная настройка ──────────────────────────

step 2 "Настройка"

LISTEN_PORT=$(ask "Порт lampac-go" "18118")

# Telegram
TG_ENABLE=$(ask_yn "Включить Telegram бот / авторизацию" "n")
TG_BOT_TOKEN=""
TG_ADMIN_ID="0"
TG_BOT_NAME=""

if [ "$TG_ENABLE" = "true" ]; then
  TG_BOT_TOKEN=$(ask "Telegram bot token" "")
  TG_ADMIN_ID=$(ask "Telegram admin ID" "0")
  TG_BOT_NAME=$(ask "Telegram bot username (без @, можно пусто)" "")
  # Валидация admin_id
  if ! echo "$TG_ADMIN_ID" | grep -qE '^[0-9]+$'; then
    warn "Admin ID должен быть числом. Использую 0."
    TG_ADMIN_ID="0"
  fi
fi

# Пароль админки (если TG не включён)
ADMIN_PASSWD=""
if [ "$TG_ENABLE" = "false" ]; then
  ADMIN_PASSWD=$(ask "Пароль администратора (для админ-панели)" "$(head -c 12 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 12)")
fi

# Токены
echo ""
info "Токены балансеров (Enter = пусто)"
VIDEOSEED_TOKEN=$(ask "  Videoseed token" "")
COLLAPS_TOKEN=$(ask "  Collaps token" "")
MIRAGE_TOKEN=$(ask "  Mirage token" "")

# ─── Шаг 3: Создание директорий и .env ──────────────────────

step 3 "Подготовка файлов"

# Создаём все директории для volumes
mkdir -p \
  "$CONFIG_DIR" \
  "$ROOT_DIR/cache" \
  "$ROOT_DIR/database" \
  "$ROOT_DIR/data" \
  "$ROOT_DIR/module" \
  "$ROOT_DIR/torrserver"

log "Директории созданы"

# .env
if [ ! -f "$ROOT_DIR/.env" ]; then
  cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
fi
# Обновляем порт в .env
sed -i.bak "s/^LAMPAC_GO_PORT=.*/LAMPAC_GO_PORT=$LISTEN_PORT/" "$ROOT_DIR/.env" 2>/dev/null \
  || sed -i '' "s/^LAMPAC_GO_PORT=.*/LAMPAC_GO_PORT=$LISTEN_PORT/" "$ROOT_DIR/.env"
rm -f "$ROOT_DIR/.env.bak"
log "Порт: $LISTEN_PORT"

# ─── Шаг 4: Генерация init.json (токены + TG) ───────────────

step 4 "Конфигурация"

CONF_TEMPLATE_URL="https://raw.githubusercontent.com/Kirill9732/Alcopac_docker/refs/heads/main/templates/init.json.example"

info "Скачиваю шаблон конфигурации..."
if ! curl -fsSL --connect-timeout 15 --max-time 60 -o "$CONFIG_DIR/init.json" "$CONF_TEMPLATE_URL" 2>/dev/null; then
  err "Не удалось скачать шаблон конфигурации с ${CONF_TEMPLATE_URL}"
fi

# Подстановка динамических значений через jq
tmp_conf="$CONFIG_DIR/init.json.tmp"

jq \
  --argjson port "$LISTEN_PORT" \
  --arg admin_passwd "$(json_escape "$ADMIN_PASSWD")" \
  --argjson tg_enable "$TG_ENABLE" \
  --arg tg_token "$(json_escape "$TG_BOT_TOKEN")" \
  --argjson tg_admin "$TG_ADMIN_ID" \
  --arg tg_name "$(json_escape "$TG_BOT_NAME")" \
  --arg collaps_token "$(json_escape "$COLLAPS_TOKEN")" \
  --arg mirage_token "$(json_escape "$MIRAGE_TOKEN")" \
  --arg videoseed_token "$(json_escape "$VIDEOSEED_TOKEN")" \
  '
  .listen.port = $port |
  .AdminAuth.password = $admin_passwd |
  .TelegramAuth.enable = $tg_enable |
  .TelegramAuth.bot_token = $tg_token |
  .TelegramAuth.admin_id = $tg_admin |
  .TelegramAuth.bot_name = $tg_name |
  (if $tg_enable then .TelegramBot = {"enable": true, "botToken": $tg_token, "admin_ids": [$tg_admin], "bot_name": $tg_name} else . end) |
  (if $collaps_token != "" then .Collaps.token = $collaps_token else . end) |
  (if $mirage_token != "" then .Mirage.token = $mirage_token else . end) |
  (if $videoseed_token != "" then .Videoseed.token = $videoseed_token else . end)
  ' "$CONFIG_DIR/init.json" > "$tmp_conf" && mv "$tmp_conf" "$CONFIG_DIR/init.json"

log "Конфиг: ${BOLD}config/init.json${NC}"

# Генерация admin_path (секретный путь к админ-панели)
ADMIN_PATH_FILE="$ROOT_DIR/database/tgauth/admin_path.txt"
mkdir -p "$(dirname "$ADMIN_PATH_FILE")"
if [ -f "$ADMIN_PATH_FILE" ] && [ -s "$ADMIN_PATH_FILE" ]; then
  ADMIN_PATH=$(cat "$ADMIN_PATH_FILE" | tr -d '[:space:]')
else
  ADMIN_PATH="cp_$(head -c 8 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 10)"
  echo -n "$ADMIN_PATH" > "$ADMIN_PATH_FILE"
  chmod 0644 "$ADMIN_PATH_FILE"
fi

# current.conf из шаблона если нет
if [ ! -f "$CONFIG_DIR/current.conf" ] && [ -f "$ROOT_DIR/templates/current.conf" ]; then
  cp "$ROOT_DIR/templates/current.conf" "$CONFIG_DIR/current.conf"
  log "Создан: ${BOLD}config/current.conf${NC}"
else
  info "current.conf уже существует — не перезаписываю"
fi

# ─── Шаг 5: Права доступа ──────────────────────────────────

step 5 "Права доступа"

# Бинарники
chmod 0755 "$ROOT_DIR/app/lampac-go-amd64" "$ROOT_DIR/app/lampac-go-arm64"
[ -d "$ROOT_DIR/app/bin" ] && find "$ROOT_DIR/app/bin" -type f -exec chmod 0755 {} \;

# Конфиги
chmod 0644 "$CONFIG_DIR/init.json"
[ -f "$CONFIG_DIR/current.conf" ] && chmod 0644 "$CONFIG_DIR/current.conf"
[ -f "$ROOT_DIR/.env" ] && chmod 0644 "$ROOT_DIR/.env"

# Приватные файлы
[ -f "$ROOT_DIR/cache/aeskey" ] && chmod 0600 "$ROOT_DIR/cache/aeskey"
[ -f "$ROOT_DIR/torrserver/accs.db" ] && chmod 0600 "$ROOT_DIR/torrserver/accs.db"

# Директории для volumes
chmod 0755 "$ROOT_DIR/config" "$ROOT_DIR/cache" "$ROOT_DIR/database" \
           "$ROOT_DIR/data" "$ROOT_DIR/module" "$ROOT_DIR/torrserver"

# Веб-файлы (read-only)
for d in wwwroot plugins module; do
  [ -d "$ROOT_DIR/app/$d" ] && {
    find "$ROOT_DIR/app/$d" -type d -exec chmod 0755 {} \;
    find "$ROOT_DIR/app/$d" -type f -exec chmod 0644 {} \;
  }
done

# Entrypoint
chmod 0755 "$ROOT_DIR/docker/entrypoint.sh"

log "Права доступа выставлены"

# ─── Шаг 6: Сборка и запуск ─────────────────────────────────

step 6 "Сборка и запуск"

info "Сборка Docker-образа..."
cd "$ROOT_DIR"
$COMPOSE_CMD build

info "Запуск контейнера..."
$COMPOSE_CMD up -d

sleep 3

# Проверка
if $COMPOSE_CMD ps --format '{{.Status}}' 2>/dev/null | grep -qi "up\|running"; then
  log "Контейнер ${BOLD}go-lampa${NC} запущен"
elif docker ps --filter name=go-lampa --format '{{.Status}}' | grep -qi "up"; then
  log "Контейнер ${BOLD}go-lampa${NC} запущен"
else
  warn "Контейнер не стартовал. Проверьте логи:"
  echo "  $COMPOSE_CMD logs -f lampac-go"
fi

# Health-check
local_code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 \
  "http://127.0.0.1:${LISTEN_PORT}/healthz" 2>/dev/null || echo "000")

if [ "$local_code" = "200" ]; then
  log "Health-check: ${GREEN}OK${NC}"
else
  warn "Health-check: код $local_code (контейнеру может потребоваться больше времени)"
fi

# ─── Результат ───────────────────────────────────────────────

IP=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "YOUR_IP")

echo ""
echo -e "  ${GREEN}${BOLD}╔══════════════════════════════════════════╗${NC}"
echo -e "  ${GREEN}${BOLD}║   ✓  Установка завершена!                ║${NC}"
echo -e "  ${GREEN}${BOLD}╚══════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BOLD}Сервер${NC}"
echo -e "    Адрес:       ${BOLD}http://${IP}:${LISTEN_PORT}/${NC}"
echo -e "    Конфиг:      ${DIM}config/init.json${NC}"
echo ""
echo -e "  ${BOLD}Управление${NC}"
echo -e "    Логи:        ${DIM}$COMPOSE_CMD logs -f lampac-go${NC}"
echo -e "    Перезапуск:  ${DIM}$COMPOSE_CMD restart${NC}"
echo -e "    Остановка:   ${DIM}$COMPOSE_CMD down${NC}"
echo -e "    Обновление:  ${DIM}$COMPOSE_CMD down && $COMPOSE_CMD up -d --build${NC}"
echo ""
if [ -n "$ADMIN_PASSWD" ] || [ "$TG_ENABLE" = "true" ]; then
echo -e "  ${BOLD}Админ-панель${NC}"
echo -e "    URL:         ${BOLD}http://${IP}:${LISTEN_PORT}/${ADMIN_PATH}${NC}"
if [ -n "$ADMIN_PASSWD" ]; then
echo -e "    Пароль:      ${BOLD}${ADMIN_PASSWD}${NC}"
echo -e "    ${DIM}(2FA будет настроена при первом входе)${NC}"
fi
echo ""
fi
echo -e "  ${BOLD}Persistent данные (сохраняются при перезапуске):${NC}"
echo -e "    config/      — конфигурация (init.json, current.conf)"
echo -e "    database/    — закладки, таймкоды, storage, tgauth"
echo -e "    cache/       — AES-ключ, кэш изображений"
echo -e "    torrserver/  — TorrServer данные (accs.db)"
echo -e "    module/      — manifest, JacRed"
echo -e "    data/        — дополнительные данные"
echo ""
