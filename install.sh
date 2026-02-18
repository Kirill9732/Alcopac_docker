#!/usr/bin/env bash
set -euo pipefail

# ============================================================
#   Al(co)pac Docker — Установка / Обновление / Удаление
#
#   Использование:
#     ./install.sh              # интерактивное меню
#     ./install.sh install      # установка
#     ./install.sh update       # обновление (пересборка образа)
#     ./install.sh remove       # удаление контейнера и образа
# ============================================================

# ── цвета ──
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[0;33m'
CYAN='\033[0;36m'; MAGENTA='\033[0;35m'; BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'

log()  { echo -e "  ${GREEN}✓${NC} $*"; }
info() { echo -e "  ${CYAN}ℹ${NC} $*"; }
warn() { echo -e "  ${YELLOW}⚠${NC} $*"; }
err()  { echo -e "  ${RED}✗${NC} $*"; exit 1; }
step() { echo ""; echo -e "${BOLD}[$1/$TOTAL_STEPS] $2${NC}"; echo ""; }

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG_DIR="$ROOT_DIR/config"
NON_INTERACTIVE="${INSTALL_NONINTERACTIVE:-false}"
CONTAINER_NAME="go-lampa"
IMAGE_NAME="go-lampa"
ACTION=""
TORRSERVER_PORT=9080
INSTALL_TORR=false

# ── вспомогательные функции ──

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || err "Не найдено: $1"
}

# Проверить наличие команды, при отсутствии — предложить установить
ensure_cmd() {
  local cmd="$1" pkg="${2:-$1}"
  if command -v "$cmd" >/dev/null 2>&1; then
    return 0
  fi

  warn "${BOLD}${cmd}${NC} не найден."

  # Определяем пакетный менеджер
  local installer=""
  if command -v apt-get >/dev/null 2>&1; then
    installer="apt-get install -y"
  elif command -v dnf >/dev/null 2>&1; then
    installer="dnf install -y"
  elif command -v yum >/dev/null 2>&1; then
    installer="yum install -y"
  elif command -v apk >/dev/null 2>&1; then
    installer="apk add"
  fi

  if [ -z "$installer" ]; then
    err "Установите ${BOLD}${pkg}${NC} вручную и повторите."
  fi

  if [ "$(ask_yn "Установить ${pkg}?" "y")" = "true" ]; then
    info "Устанавливаю ${BOLD}${pkg}${NC}..."
    if [ "$(id -u)" -ne 0 ]; then
      sudo $installer "$pkg" || err "Не удалось установить ${pkg}"
    else
      $installer "$pkg" || err "Не удалось установить ${pkg}"
    fi
    log "${pkg} установлен"
  else
    err "${BOLD}${cmd}${NC} необходим для работы."
  fi
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

detect_compose() {
  COMPOSE_CMD=""
  if docker compose version >/dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
  elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE_CMD="docker-compose"
  else
    err "Не найден Docker Compose (ни plugin 'docker compose', ни бинарь 'docker-compose')."
  fi
}

banner() {
  local subtitle="${1:-Docker}"
  echo ""
  echo -e "${MAGENTA}${BOLD}"
  echo "    ╔═══════════════════════════════════════╗"
  echo "    ║                                       ║"
  echo "    ║   ▶  A L (C O) P A C                  ║"
  echo "    ║      ${subtitle}                          ║"
  echo "    ║                                       ║"
  echo "    ╚═══════════════════════════════════════╝"
  echo -e "${NC}"
}

is_container_running() {
  docker ps --filter "name=${CONTAINER_NAME}" --format '{{.Status}}' 2>/dev/null | grep -qi "up\|running"
}

is_container_exists() {
  docker ps -a --filter "name=${CONTAINER_NAME}" --format '{{.Names}}' 2>/dev/null | grep -q "^${CONTAINER_NAME}$"
}

get_port() {
  grep -o 'LAMPAC_GO_PORT=[0-9]*' "$ROOT_DIR/.env" 2>/dev/null | cut -d= -f2 || echo "18118"
}

# ============================================================
# Install
# ============================================================

do_install() {
  banner "Install                "

  TOTAL_STEPS=7

  # ─── Шаг 1: Проверка окружения ──────────────────────────

  step 1 "Проверка окружения"

  require_cmd docker
  ensure_cmd curl
  ensure_cmd jq

  detect_compose

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

  if is_container_exists; then
    warn "Контейнер ${BOLD}${CONTAINER_NAME}${NC} уже существует."
    warn "Используйте ${BOLD}update${NC} для обновления или ${BOLD}remove${NC} для удаления"
    exit 1
  fi

  # ─── Шаг 2: Интерактивная настройка ──────────────────────

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

  # TorrServer
  echo ""
  if [ "$(ask_yn "Установить TorrServer?" "n")" = "true" ]; then
    INSTALL_TORR=true
  fi

  # ─── Шаг 3: Подготовка файлов ──────────────────────────

  step 3 "Подготовка файлов"

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
  sed -i.bak "s/^LAMPAC_GO_PORT=.*/LAMPAC_GO_PORT=$LISTEN_PORT/" "$ROOT_DIR/.env" 2>/dev/null \
    || sed -i '' "s/^LAMPAC_GO_PORT=.*/LAMPAC_GO_PORT=$LISTEN_PORT/" "$ROOT_DIR/.env"
  rm -f "$ROOT_DIR/.env.bak"
  log "Порт: $LISTEN_PORT"

  # ─── Шаг 4: TorrServer ────────────────────────────────

  step 4 "TorrServer"

  if [ "$INSTALL_TORR" = "true" ]; then
    local torr_dir="$ROOT_DIR/app/torrserver"
    mkdir -p "$torr_dir"

    local torr_arch=""
    case "$TARGET_ARCH" in
      amd64) torr_arch="amd64" ;;
      arm64) torr_arch="arm64" ;;
    esac

    info "Скачиваю TorrServer..."
    if curl -fSL --progress-bar -o "${torr_dir}/TorrServer-linux" \
        "https://github.com/YouROK/TorrServer/releases/latest/download/TorrServer-linux-${torr_arch}" 2>/dev/null; then
      chmod 0755 "${torr_dir}/TorrServer-linux"

      # accs.db с паролем (если нет)
      if [ ! -f "$ROOT_DIR/torrserver/accs.db" ]; then
        local ts_passwd
        ts_passwd=$(head -c 8 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 10)
        echo "{\"ts\":\"${ts_passwd}\"}" > "$ROOT_DIR/torrserver/accs.db"
        chmod 0600 "$ROOT_DIR/torrserver/accs.db"
        log "TorrServer установлен (пароль: ${BOLD}${ts_passwd}${NC})"
      else
        log "TorrServer установлен (accs.db уже существует)"
      fi
    else
      warn "Не удалось скачать TorrServer"
      INSTALL_TORR=false
    fi
  else
    warn "Пропущено"
  fi

  # ─── Шаг 5: Конфигурация ────────────────────────────────

  step 5 "Конфигурация"

  CONF_TEMPLATE_URL="https://raw.githubusercontent.com/Kirill9732/Alcopac_docker/refs/heads/main/templates/init.json.example"

  info "Скачиваю шаблон конфигурации..."
  if ! curl -fsSL --connect-timeout 15 --max-time 60 -o "$CONFIG_DIR/init.json" "$CONF_TEMPLATE_URL" 2>/dev/null; then
    err "Не удалось скачать шаблон конфигурации с ${CONF_TEMPLATE_URL}"
  fi

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
    --argjson torr_enable "$INSTALL_TORR" \
    --argjson torr_port "$TORRSERVER_PORT" \
    '
    .listen.port = $port |
    .AdminAuth.password = $admin_passwd |
    .TelegramAuth.enable = $tg_enable |
    .TelegramAuth.bot_token = $tg_token |
    .TelegramAuth.admin_id = $tg_admin |
    .TelegramAuth.bot_name = $tg_name |
    .TorrServer.enable = $torr_enable |
    .TorrServer.port = $torr_port |
    .LampaWeb.initPlugins.torrserver = $torr_enable |
    (if $tg_enable then .TelegramBot = {"enable": true, "botToken": $tg_token, "admin_ids": [$tg_admin], "bot_name": $tg_name} else . end) |
    (if $collaps_token != "" then .Collaps.token = $collaps_token else . end) |
    (if $mirage_token != "" then .Mirage.token = $mirage_token else . end) |
    (if $videoseed_token != "" then .Videoseed.token = $videoseed_token else . end)
    ' "$CONFIG_DIR/init.json" > "$tmp_conf" && mv "$tmp_conf" "$CONFIG_DIR/init.json"

  log "Конфиг: ${BOLD}config/init.json${NC}"

  # admin_path
  ADMIN_PATH_FILE="$ROOT_DIR/database/tgauth/admin_path.txt"
  mkdir -p "$(dirname "$ADMIN_PATH_FILE")"
  if [ -f "$ADMIN_PATH_FILE" ] && [ -s "$ADMIN_PATH_FILE" ]; then
    ADMIN_PATH=$(cat "$ADMIN_PATH_FILE" | tr -d '[:space:]')
  else
    ADMIN_PATH="cp_$(head -c 8 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 10)"
    echo -n "$ADMIN_PATH" > "$ADMIN_PATH_FILE"
    chmod 0644 "$ADMIN_PATH_FILE"
  fi

  # current.conf
  if [ ! -f "$CONFIG_DIR/current.conf" ] && [ -f "$ROOT_DIR/templates/current.conf" ]; then
    cp "$ROOT_DIR/templates/current.conf" "$CONFIG_DIR/current.conf"
    log "Создан: ${BOLD}config/current.conf${NC}"
  else
    info "current.conf уже существует — не перезаписываю"
  fi

  # ─── Шаг 6: Права доступа ──────────────────────────────

  step 6 "Права доступа"

  chmod 0755 "$ROOT_DIR/app/lampac-go-amd64" "$ROOT_DIR/app/lampac-go-arm64"
  [ -d "$ROOT_DIR/app/bin" ] && find "$ROOT_DIR/app/bin" -type f -exec chmod 0755 {} \;
  [ -f "$ROOT_DIR/app/torrserver/TorrServer-linux" ] && chmod 0755 "$ROOT_DIR/app/torrserver/TorrServer-linux"

  chmod 0644 "$CONFIG_DIR/init.json"
  [ -f "$CONFIG_DIR/current.conf" ] && chmod 0644 "$CONFIG_DIR/current.conf"
  [ -f "$ROOT_DIR/.env" ] && chmod 0644 "$ROOT_DIR/.env"

  [ -f "$ROOT_DIR/cache/aeskey" ] && chmod 0600 "$ROOT_DIR/cache/aeskey"
  [ -f "$ROOT_DIR/torrserver/accs.db" ] && chmod 0600 "$ROOT_DIR/torrserver/accs.db"

  chmod 0755 "$ROOT_DIR/config" "$ROOT_DIR/cache" "$ROOT_DIR/database" \
             "$ROOT_DIR/data" "$ROOT_DIR/module" "$ROOT_DIR/torrserver"

  for d in wwwroot plugins module; do
    [ -d "$ROOT_DIR/app/$d" ] && {
      find "$ROOT_DIR/app/$d" -type d -exec chmod 0755 {} \;
      find "$ROOT_DIR/app/$d" -type f -exec chmod 0644 {} \;
    }
  done

  chmod 0755 "$ROOT_DIR/docker/entrypoint.sh"

  log "Права доступа выставлены"

  # ─── Шаг 7: Сборка и запуск ────────────────────────────

  step 7 "Сборка и запуск"

  info "Сборка Docker-образа..."
  cd "$ROOT_DIR"
  $COMPOSE_CMD build

  info "Запуск контейнера..."
  $COMPOSE_CMD up -d

  sleep 3

  # Проверка
  if is_container_running; then
    log "Контейнер ${BOLD}${CONTAINER_NAME}${NC} запущен"
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

  # ─── Результат ──────────────────────────────────────────

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
  echo -e "    Обновление:  ${DIM}./install.sh update${NC}"
  echo -e "    Удаление:    ${DIM}./install.sh remove${NC}"
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
  if [ "$INSTALL_TORR" = "true" ]; then
    echo -e "  ${BOLD}TorrServer${NC}"
    echo -e "    Порт:        ${BOLD}${TORRSERVER_PORT}${NC} (внутри контейнера)"
    echo -e "    Данные:      ${DIM}torrserver/accs.db${NC}"
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
}

# ============================================================
# Update
# ============================================================

do_update() {
  banner "Update                 "

  TOTAL_STEPS=5

  # ─── Шаг 1: Проверка ──────────────────────────────────

  step 1 "Проверка окружения"

  require_cmd docker
  ensure_cmd curl
  detect_compose

  docker info >/dev/null 2>&1 || err "Docker daemon недоступен."

  if ! is_container_exists; then
    err "Контейнер ${BOLD}${CONTAINER_NAME}${NC} не найден. Используйте ${BOLD}install${NC}."
  fi

  if [ ! -f "$ROOT_DIR/app/lampac-go-amd64" ] || [ ! -f "$ROOT_DIR/app/lampac-go-arm64" ]; then
    err "Не найдены бинарники app/lampac-go-amd64 и/или app/lampac-go-arm64."
  fi

  LISTEN_PORT=$(get_port)

  HOST_ARCH="$(uname -m)"
  case "$HOST_ARCH" in
    x86_64)       TARGET_ARCH="amd64" ;;
    aarch64|arm64) TARGET_ARCH="arm64" ;;
    *)            TARGET_ARCH="unknown" ;;
  esac

  if is_container_running; then
    log "Контейнер: ${GREEN}запущен${NC} (порт ${BOLD}${LISTEN_PORT}${NC})"
  else
    warn "Контейнер: ${YELLOW}остановлен${NC}"
  fi

  # Показать размеры бинарников
  local amd_size arm_size
  amd_size=$(stat -c%s "$ROOT_DIR/app/lampac-go-amd64" 2>/dev/null || stat -f%z "$ROOT_DIR/app/lampac-go-amd64" 2>/dev/null || echo "?")
  arm_size=$(stat -c%s "$ROOT_DIR/app/lampac-go-arm64" 2>/dev/null || stat -f%z "$ROOT_DIR/app/lampac-go-arm64" 2>/dev/null || echo "?")
  info "Бинарники: amd64=${BOLD}${amd_size}${NC} arm64=${BOLD}${arm_size}${NC}"

  # ─── Шаг 2: Обновление TorrServer ──────────────────────

  step 2 "TorrServer"

  local torr_arch=""
  case "$TARGET_ARCH" in
    amd64) torr_arch="amd64" ;;
    arm64) torr_arch="arm64" ;;
  esac

  if [ -f "$ROOT_DIR/app/torrserver/TorrServer-linux" ]; then
    info "Обновляю TorrServer..."
    if curl -fSL --progress-bar -o "$ROOT_DIR/app/torrserver/TorrServer-linux" \
        "https://github.com/YouROK/TorrServer/releases/latest/download/TorrServer-linux-${torr_arch}" 2>/dev/null; then
      chmod 0755 "$ROOT_DIR/app/torrserver/TorrServer-linux"
      log "TorrServer обновлён"
    else
      warn "Не удалось обновить TorrServer"
    fi
  else
    # TorrServer не установлен — предложить доустановить
    if [ "$(ask_yn "TorrServer не установлен. Установить?" "n")" = "true" ]; then
      mkdir -p "$ROOT_DIR/app/torrserver"
      info "Скачиваю TorrServer..."
      if curl -fSL --progress-bar -o "$ROOT_DIR/app/torrserver/TorrServer-linux" \
          "https://github.com/YouROK/TorrServer/releases/latest/download/TorrServer-linux-${torr_arch}" 2>/dev/null; then
        chmod 0755 "$ROOT_DIR/app/torrserver/TorrServer-linux"

        if [ ! -f "$ROOT_DIR/torrserver/accs.db" ]; then
          local ts_passwd
          ts_passwd=$(head -c 8 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 10)
          echo "{\"ts\":\"${ts_passwd}\"}" > "$ROOT_DIR/torrserver/accs.db"
          chmod 0600 "$ROOT_DIR/torrserver/accs.db"
        fi

        # Включить в конфиге
        if [ -f "$CONFIG_DIR/init.json" ] && command -v jq >/dev/null 2>&1; then
          local tmp_conf="$CONFIG_DIR/init.json.tmp"
          jq '.TorrServer.enable = true | .TorrServer.port = 9080 | .LampaWeb.initPlugins.torrserver = true' \
            "$CONFIG_DIR/init.json" > "$tmp_conf" && mv "$tmp_conf" "$CONFIG_DIR/init.json"
        fi

        log "TorrServer установлен"
      else
        warn "Не удалось скачать TorrServer"
      fi
    else
      info "TorrServer — пропускаю"
    fi
  fi

  # ─── Шаг 3: Остановка ──────────────────────────────────

  step 3 "Остановка контейнера"

  cd "$ROOT_DIR"
  $COMPOSE_CMD down 2>/dev/null || true
  log "Контейнер остановлен"

  # ─── Шаг 4: Пересборка ─────────────────────────────────

  step 4 "Пересборка образа"

  info "Сборка Docker-образа (без кэша)..."
  $COMPOSE_CMD build --no-cache

  log "Образ пересобран"

  # ─── Шаг 5: Запуск ──────────────────────────────────────

  step 5 "Запуск"

  $COMPOSE_CMD up -d
  sleep 3

  if is_container_running; then
    log "Контейнер ${BOLD}${CONTAINER_NAME}${NC} запущен"
  else
    warn "Контейнер не стартовал"
    $COMPOSE_CMD logs --tail 20 lampac-go 2>/dev/null || true
  fi

  # Health-check
  local_code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 \
    "http://127.0.0.1:${LISTEN_PORT}/healthz" 2>/dev/null || echo "000")
  [ "$local_code" = "200" ] && log "Health-check: ${GREEN}OK${NC}" || warn "Health-check: код $local_code"

  IP=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "YOUR_IP")

  echo ""
  echo -e "  ${GREEN}${BOLD}╔══════════════════════════════════════════╗${NC}"
  echo -e "  ${GREEN}${BOLD}║   ✓  Обновление завершено!               ║${NC}"
  echo -e "  ${GREEN}${BOLD}╚══════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "  URL:  ${BOLD}http://${IP}:${LISTEN_PORT}/${NC}"
  echo -e "  Логи: ${DIM}$COMPOSE_CMD logs -f lampac-go${NC}"
  echo ""
  echo -e "  ${DIM}Конфиги и данные (volumes) сохранены.${NC}"
  echo ""
}

# ============================================================
# Remove
# ============================================================

do_remove() {
  banner "Remove                 "

  require_cmd docker
  detect_compose

  if ! is_container_exists; then
    # Попробуем найти образ
    if ! docker images --format '{{.Repository}}' 2>/dev/null | grep -q "${IMAGE_NAME}"; then
      err "Контейнер и образ ${BOLD}${CONTAINER_NAME}${NC} не найдены."
    fi
  fi

  echo -e "  ${BOLD}Будет удалено:${NC}"
  echo -e "    • Docker-контейнер: ${BOLD}${CONTAINER_NAME}${NC}"
  echo -e "    • Docker-образ:     ${BOLD}${IMAGE_NAME}${NC}"
  echo ""

  # Проверяем volumes
  local has_data=false
  for d in "$ROOT_DIR/database" "$ROOT_DIR/cache" "$ROOT_DIR/config"; do
    if [ -d "$d" ] && [ -n "$(ls -A "$d" 2>/dev/null)" ]; then
      has_data=true
      break
    fi
  done

  if [ "$has_data" = "true" ]; then
    warn "Volumes с данными обнаружены (database/, cache/, config/)"
    echo -e "    ${DIM}Данные НЕ будут удалены (они хранятся в локальных директориях)${NC}"
    echo ""
  fi

  if [ -t 0 ] || [ -e /dev/tty ]; then
    printf "  ${RED}${BOLD}Продолжить? [y/N]:${NC} " >/dev/tty
    read -r confirm </dev/tty
    case "$confirm" in
      y|Y|yes|YES|да|Да) ;;
      *) info "Отменено."; exit 0 ;;
    esac
  fi
  echo ""

  # Спрашиваем про удаление данных
  PURGE_DATA=false
  if [ "$has_data" = "true" ]; then
    if [ -t 0 ] || [ -e /dev/tty ]; then
      printf "  ${CYAN}?${NC} Удалить также данные (database, cache, config)? ${DIM}[y/N]${NC}: " >/dev/tty
      read -r purge_ans </dev/tty
      case "$purge_ans" in
        [yY]|[yY][eE][sS]) PURGE_DATA=true ;;
      esac
    fi
  fi

  # 1. Остановка и удаление контейнера
  info "Останавливаю контейнер..."
  cd "$ROOT_DIR"
  $COMPOSE_CMD down 2>/dev/null || true
  log "Контейнер остановлен и удалён"

  # 2. Удаление образа
  info "Удаляю Docker-образ..."
  docker rmi "${IMAGE_NAME}:0.1" 2>/dev/null || true
  docker rmi "${IMAGE_NAME}" 2>/dev/null || true
  # Удаляем dangling images от этого проекта
  docker image prune -f 2>/dev/null || true
  log "Образ удалён"

  # 3. Данные
  if [ "$PURGE_DATA" = "true" ]; then
    info "Удаляю данные..."
    rm -rf "$ROOT_DIR/database" "$ROOT_DIR/cache" "$ROOT_DIR/config" \
           "$ROOT_DIR/data" "$ROOT_DIR/module" "$ROOT_DIR/torrserver"
    log "Данные удалены"
  else
    info "Данные сохранены в:"
    echo -e "    ${DIM}config/     — конфигурация${NC}"
    echo -e "    ${DIM}database/   — закладки, таймкоды, авторизация${NC}"
    echo -e "    ${DIM}cache/      — AES-ключ, кэш${NC}"
    echo -e "    ${DIM}module/     — manifest, JacRed${NC}"
    echo -e "    ${DIM}torrserver/ — TorrServer данные${NC}"
  fi

  echo ""
  echo -e "  ${GREEN}${BOLD}╔══════════════════════════════════════════╗${NC}"
  echo -e "  ${GREEN}${BOLD}║   ✓  Удаление завершено!                 ║${NC}"
  echo -e "  ${GREEN}${BOLD}╚══════════════════════════════════════════╝${NC}"
  echo ""

  if [ "$PURGE_DATA" != "true" ] && [ "$has_data" = "true" ]; then
    echo -e "  ${CYAN}Для переустановки:${NC}"
    echo -e "    1. ${BOLD}./install.sh install${NC}"
    echo -e "    ${DIM}Существующие данные будут подхвачены автоматически.${NC}"
    echo ""
  fi
}

# ============================================================
# Menu
# ============================================================

show_menu() {
  banner "Docker                 "

  require_cmd docker
  detect_compose

  echo -e "  ${BOLD}Статус:${NC}"
  if is_container_running; then
    LISTEN_PORT=$(get_port)
    IP=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "YOUR_IP")
    echo -e "    ${GREEN}●${NC} Запущен  ${BOLD}http://${IP}:${LISTEN_PORT}/${NC}"
  elif is_container_exists; then
    echo -e "    ${YELLOW}●${NC} Остановлен"
  else
    echo -e "    ${RED}●${NC} Не установлен"
  fi
  echo ""

  if is_container_exists; then
    echo -e "    ${BOLD}1)${NC} Обновить  — пересобрать образ с новыми бинарниками"
    echo -e "    ${BOLD}2)${NC} Удалить   — удалить контейнер и образ"
    echo -e "    ${BOLD}0)${NC} Отмена"
    echo ""

    if [ -t 0 ] || [ -e /dev/tty ]; then
      printf "    Выбор: " >/dev/tty
      read -r choice </dev/tty
    else
      choice="0"
    fi

    case "$choice" in
      1) do_update ;;
      2) do_remove ;;
      *) info "Отменено." ;;
    esac
  else
    echo -e "    ${BOLD}1)${NC} Установить  — полная установка в Docker"
    echo -e "    ${BOLD}0)${NC} Отмена"
    echo ""

    if [ -t 0 ] || [ -e /dev/tty ]; then
      printf "    Выбор: " >/dev/tty
      read -r choice </dev/tty
    else
      choice="1"
    fi

    case "$choice" in
      1) do_install ;;
      *) info "Отменено." ;;
    esac
  fi
}

# ============================================================
# Entry point
# ============================================================

# Parse first positional arg as action
for arg in "$@"; do
  case "$arg" in
    install|update|remove) ACTION="$arg" ;;
  esac
done

case "${ACTION:-}" in
  install) do_install ;;
  update)  do_update ;;
  remove)  do_remove ;;
  "")      show_menu ;;
  *)       err "Неизвестная команда: ${BOLD}${ACTION}${NC}. Используйте: install | update | remove" ;;
esac
