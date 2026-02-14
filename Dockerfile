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
        proxychains4 \
        nodejs \
    && (apt-get install -y --no-install-recommends chromium \
        || apt-get install -y --no-install-recommends chromium-browser \
        || true) \
    && rm -rf /var/lib/apt/lists/*

# yt-dlp runtime check expects `node` binary name.
RUN if [ ! -x /usr/bin/node ] && [ -x /usr/bin/nodejs ]; then ln -s /usr/bin/nodejs /usr/bin/node; fi

WORKDIR /opt/lampac

COPY app/lampac-go /usr/local/bin/lampac-go
COPY app/module /opt/lampac/module
COPY app/plugins /opt/lampac/plugins
COPY app/wwwroot /opt/lampac/wwwroot
COPY app/torrserver /opt/lampac/torrserver
COPY app/bin /opt/lampac/bin
COPY templates /opt/lampac/templates
COPY docker/entrypoint.sh /entrypoint.sh

RUN chmod +x /usr/local/bin/lampac-go /entrypoint.sh

# Ensure yt-dlp is executable for current container architecture.
# If bundled binary is incompatible, replace it with the proper upstream build.
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

ENV LAMPAC_GO_ADDR=0.0.0.0:18118 \
    LAMPAC_GO_REPO_ROOT=/opt/lampac \
    LAMPAC_GO_CACHE_DIR=/opt/lampac/cache \
    LAMPAC_GO_LOCAL_CORE=true \
    LAMPAC_GO_FALLBACK_ENABLE=false

EXPOSE 18118

ENTRYPOINT ["/entrypoint.sh"]
