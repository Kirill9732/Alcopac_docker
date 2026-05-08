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
        python3-pip \
    && (apt-get install -y --no-install-recommends chromium \
        || apt-get install -y --no-install-recommends chromium-browser \
        || true) \
    && rm -rf /var/lib/apt/lists/*

# yt-dlp runtime check expects `node` binary name.
RUN if [ ! -x /usr/bin/node ] && [ -x /usr/bin/nodejs ]; then ln -s /usr/bin/nodejs /usr/bin/node; fi

# ── pip-пакеты для YouTube (yt-dlp plugins) ──
RUN pip install --no-cache-dir --break-system-packages \
        yt-dlp-ejs \
        bgutil-ytdlp-pot-provider \
    || true

WORKDIR /opt/lampac

# ── бинарники (proxycore + TorrServer встроены) ──
COPY app/lampac-go-amd64 /tmp/lampac-go-amd64
COPY app/lampac-go-arm64 /tmp/lampac-go-arm64

RUN set -eux; \
    ARCH="$(dpkg --print-architecture)"; \
    cp "/tmp/lampac-go-${ARCH}" /usr/local/bin/lampac-go; \
    chmod +x /usr/local/bin/lampac-go; \
    rm -f /tmp/lampac-go-*

# ── yt-dlp ──
# Download is wrapped with retries + curl (better behaviour than wget under
# QEMU emulation, where the arm64 build often hits "exit 4" on wget).
# If GitHub release download genuinely fails (network outage), we don't fail
# the whole image — yt-dlp is a runtime tool and entrypoint.sh re-attempts
# the download on first start. This keeps multi-arch builds resilient.
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
      ok=0; \
      for i in 1 2 3 4 5; do \
        if curl -fsSL --connect-timeout 30 --retry 3 --retry-delay 5 -o "$YT_BIN" "$YT_URL"; then \
          ok=1; break; \
        fi; \
        echo "yt-dlp download attempt $i failed, retrying..."; \
        sleep $((i * 5)); \
      done; \
      if [ "$ok" = 1 ]; then \
        chmod +x "$YT_BIN"; \
      else \
        echo "yt-dlp download FAILED — entrypoint.sh will retry on first start"; \
        rm -f "$YT_BIN"; \
      fi; \
    fi; \
    ln -sf "$YT_BIN" /usr/local/bin/yt-dlp; \
    "$YT_BIN" --version 2>/dev/null || echo "yt-dlp pending — first-start download will fix"

# ── defaults: файлы, которые volume может перекрыть ──
# При первом запуске entrypoint.sh скопирует их в пустые volumes
COPY app/plugins  /opt/lampac/_defaults/plugins
COPY app/wwwroot  /opt/lampac/_defaults/wwwroot
COPY app/bin      /opt/lampac/_defaults/bin
COPY templates    /opt/lampac/_defaults/templates
COPY app/config.toml /opt/lampac/_defaults/config.toml

# torrserver is optional — copy only if present in build context
COPY app/torrserve[r] /opt/lampac/_defaults/torrserver

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
             /opt/lampac/torrserver

ENV LAMPAC_GO_ADDR=0.0.0.0:18118 \
    LAMPAC_GO_REPO_ROOT=/opt/lampac \
    LAMPAC_GO_CACHE_DIR=/opt/lampac/cache \
    LAMPAC_GO_LOCAL_CORE=true \
    LAMPAC_GO_FALLBACK_ENABLE=false

EXPOSE 18118

ENTRYPOINT ["/entrypoint.sh"]
