FROM debian:bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        tzdata \
        ffmpeg \
        curl \
        wget \
        unzip \
        rsync \
        jq \
        proxychains4 \
        nodejs \
    && (apt-get install -y --no-install-recommends chromium \
        || apt-get install -y --no-install-recommends chromium-browser \
        || true) \
    && rm -rf /var/lib/apt/lists/*

# yt-dlp runtime check expects `node` binary name.
RUN if [ ! -x /usr/bin/node ] && [ -x /usr/bin/nodejs ]; then ln -s /usr/bin/nodejs /usr/bin/node; fi

WORKDIR /opt/lampac

# ── бинарники ──
COPY app/lampac-go-amd64 /tmp/lampac-go-amd64
COPY app/lampac-go-arm64 /tmp/lampac-go-arm64

RUN set -eux; \
    ARCH="$(dpkg --print-architecture)"; \
    case "$ARCH" in \
      amd64) cp /tmp/lampac-go-amd64 /usr/local/bin/lampac-go ;; \
      arm64) cp /tmp/lampac-go-arm64 /usr/local/bin/lampac-go ;; \
      *) echo "Unsupported architecture: $ARCH"; exit 1 ;; \
    esac; \
    chmod +x /usr/local/bin/lampac-go; \
    rm -f /tmp/lampac-go-amd64 /tmp/lampac-go-arm64

# ── yt-dlp ──
RUN set -eux; \
    mkdir -p /opt/lampac/bin; \
    YT_BIN="/opt/lampac/bin/yt-dlp"; \
    if [ ! -x "$YT_BIN" ] || ! "$YT_BIN" --version >/dev/null 2>&1; then \
      ARCH="$(dpkg --print-architecture)"; \
      case "$ARCH" in \
        amd64) YT_URL="https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux" ;; \
        arm64) YT_URL="https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux_aarch64" ;; \
        *) YT_URL="https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux" ;; \
      esac; \
      wget -qO "$YT_BIN" "$YT_URL"; \
      chmod +x "$YT_BIN"; \
    fi; \
    ln -sf "$YT_BIN" /usr/local/bin/yt-dlp; \
    yt-dlp --version

# ── defaults: файлы, которые volume может перекрыть ──
# При первом запуске entrypoint.sh скопирует их в пустые volumes
COPY app/module   /opt/lampac/_defaults/module
COPY app/plugins  /opt/lampac/_defaults/plugins
COPY app/wwwroot  /opt/lampac/_defaults/wwwroot
COPY app/torrserver /opt/lampac/_defaults/torrserver
COPY app/bin      /opt/lampac/_defaults/bin
COPY templates    /opt/lampac/_defaults/templates
COPY app/config.toml /opt/lampac/_defaults/config.toml

# ── статичные файлы (не перекрываются volumes) ──
COPY app/plugins  /opt/lampac/plugins
COPY app/wwwroot  /opt/lampac/wwwroot
COPY app/bin      /opt/lampac/bin

# ── entrypoint ──
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# ── создаём директории для volumes ──
RUN mkdir -p /opt/lampac/config \
             /opt/lampac/cache \
             /opt/lampac/database \
             /opt/lampac/data \
             /opt/lampac/module \
             /opt/lampac/torrserver

ENV LAMPAC_GO_ADDR=0.0.0.0:18118 \
    LAMPAC_GO_REPO_ROOT=/opt/lampac \
    LAMPAC_GO_CACHE_DIR=/opt/lampac/cache \
    LAMPAC_GO_LOCAL_CORE=true \
    LAMPAC_GO_FALLBACK_ENABLE=false

EXPOSE 18118

ENTRYPOINT ["/entrypoint.sh"]
