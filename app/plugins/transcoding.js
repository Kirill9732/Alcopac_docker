(function () {
    var API_BASE = '{localhost}';

    var activeJob = null;
    var heartbeatTimer = null;
    var cachedCaps = null;

    function account(url) {
        url = url + '';
        if (url.indexOf('account_email=') == -1) {
            var email = Lampa.Storage.get('account_email');
            if (email) url = Lampa.Utils.addUrlComponent(url, 'account_email=' + encodeURIComponent(email));
        }
        if (url.indexOf('uid=') == -1) {
            var uid = Lampa.Storage.get('lampac_unic_id', '');
            if (uid) url = Lampa.Utils.addUrlComponent(url, 'uid=' + encodeURIComponent(uid));
        }
        if (url.indexOf('token=') == -1) {
            var token = '{token}';
            if (token != '') url = Lampa.Utils.addUrlComponent(url, 'token={token}');
        }
        return url;
    }

    function log() {
        try {
            var args = Array.prototype.slice.call(arguments);
            args.unshift('Transcoder');
            console.log.apply(console, args);
        } catch (err) { /* noop */ }
    }

    function resolveMediaUrl(data) {
        if (data && data.url) return data.url;
        return '';
    }

    // ------------------------------------------------------------------
    // Client capability detection — what can THIS player decode natively?
    // Cached per-session in Lampa.Storage.
    // ------------------------------------------------------------------

    function canMSE(mime) {
        try {
            if (window.MediaSource && MediaSource.isTypeSupported) {
                return MediaSource.isTypeSupported(mime);
            }
        } catch (e) { /* noop */ }
        return false;
    }

    function canVideo(mime) {
        try {
            var v = document.createElement('video');
            var r = v.canPlayType(mime);
            return r === 'probably' || r === 'maybe';
        } catch (e) { /* noop */ }
        return false;
    }

    function detectPlatform() {
        try {
            if (window.Lampa && Lampa.Platform) {
                if (typeof Lampa.Platform.get === 'function') {
                    var p = Lampa.Platform.get();
                    if (p) return p;
                }
                if (Lampa.Platform.screen) return 'tv';
            }
            var ua = (navigator.userAgent || '').toLowerCase();
            if (ua.indexOf('android') >= 0) return 'android';
            if (ua.indexOf('tizen') >= 0) return 'tizen';
            if (ua.indexOf('web0s') >= 0 || ua.indexOf('webos') >= 0) return 'webos';
            if (ua.indexOf('smart-tv') >= 0) return 'smart-tv';
        } catch (e) { /* noop */ }
        return 'browser';
    }

    function detectClientCaps() {
        if (cachedCaps) return cachedCaps;

        var stored = null;
        try {
            stored = Lampa.Storage.get('transcoding_caps_v1', null);
        } catch (e) { /* noop */ }
        if (stored && stored.detectedAt && (Date.now() - stored.detectedAt < 60 * 60 * 1000)) {
            cachedCaps = stored;
            return cachedCaps;
        }

        var platform = detectPlatform();

        // Native players (Android / Tizen / webOS / Smart TVs) generally
        // decode MKV and virtually every codec on the disc via hardware.
        // Browser (hls.js) must rely on MSE isTypeSupported.
        var native = platform === 'android' || platform === 'tv' ||
                     platform === 'tizen' || platform === 'webos' ||
                     platform === 'smart-tv' || platform === 'android-tv';

        var caps = {
            lang: Lampa.Storage.get('language', 'ru') || 'ru',
            platform: platform,
            canPlayMKV: native || canVideo('video/x-matroska'),

            canPlayH264: native || canMSE('video/mp4; codecs="avc1.640029"') || canVideo('video/mp4; codecs="avc1.42E01E"'),
            canPlayHEVC: native || canMSE('video/mp4; codecs="hvc1.1.6.L93.B0"') || canVideo('video/mp4; codecs="hev1.1.6.L93.B0"'),
            canPlayHEVC10: native, // browsers rarely support HEVC main10
            canPlayAV1: canMSE('video/mp4; codecs="av01.0.05M.08"') || canVideo('video/mp4; codecs="av01.0.05M.08"'),
            canPlayVP9: native || canMSE('video/mp4; codecs="vp09.00.10.08"') || canVideo('video/webm; codecs="vp9"'),

            canPlayAAC:    native || canMSE('audio/mp4; codecs="mp4a.40.2"') || canVideo('audio/mp4; codecs="mp4a.40.2"'),
            canPlayAC3:    native || canMSE('audio/mp4; codecs="ac-3"') || canVideo('audio/mp4; codecs="ac-3"'),
            canPlayEAC3:   native || canMSE('audio/mp4; codecs="ec-3"') || canVideo('audio/mp4; codecs="ec-3"'),
            canPlayDTS:    native, // browsers don't do DTS
            canPlayTrueHD: native, // browsers don't do TrueHD
            canPlayFLAC:   native || canMSE('audio/mp4; codecs="flac"'),
            canPlayOpus:   native || canMSE('audio/webm; codecs="opus"') || canVideo('audio/ogg; codecs="opus"'),
            canPlayMP3:    native || canVideo('audio/mpeg'),

            detectedAt: Date.now()
        };

        try {
            Lampa.Storage.set('transcoding_caps_v1', caps);
        } catch (e) { /* noop */ }

        log('detected client caps', caps);
        cachedCaps = caps;
        return caps;
    }

    // ------------------------------------------------------------------
    // Source detection
    // ------------------------------------------------------------------

    function isMkvSource(data) {
        var url = resolveMediaUrl(data);
        if (!url) return false;
        return /\.(mkv|avi|flv|m2ts|ts|wmv|mpg|mpeg|vob)($|\?|#)/i.test(url) ||
               /\/lite\/pidtor\//i.test(url) ||
               /\/ts\/stream\//i.test(url);
    }

    // ------------------------------------------------------------------
    // Subtitles loading — same as before
    // ------------------------------------------------------------------

    function loadSubtitles(url) {
        var net = new Lampa.Reguest();
        net.native(account(url), function (response) {
            try {
                var subs = typeof response === 'string' ? JSON.parse(response) : response;
                if (Array.isArray(subs) && subs.length > 0) {
                    log('subtitles loaded', subs.length);
                    Lampa.Player.subtitles(subs);
                }
            } catch (e) { log('subtitles parse error', e); }
        }, function () { /* silent */ }, null, {
            dataType: 'text',
            timeout: 1000 * 15
        });
    }

    // ------------------------------------------------------------------
    // Start transcoding (single server call with caps)
    // ------------------------------------------------------------------

    function startTranscoding(data, onReady) {
        stopHeartbeat();
        ensureJobStopped(true);

        var caps = detectClientCaps();
        var payload = {
            src: resolveMediaUrl(data),
            live: false,
            subtitles: true,
            client: caps
        };

        var net = new Lampa.Reguest();
        net.native(account(API_BASE + '/transcoding/start'), function (response) {
            var json = typeof response === 'string' ? JSON.parse(response) : response;
            if (!json || !json.streamId) {
                log('invalid start response, playing original url', response);
                onReady(null);
                return;
            }

            log('transcoding started', json.mode || 'unknown', json.streamId);

            // Native / direct modes: server says "just play the original".
            if (json.mode === 'native' || json.mode === 'direct') {
                log('native playback, skipping transcoding', json.mode);
                onReady({ nativeUrl: json.originalUrl || resolveMediaUrl(data) });
                return;
            }

            if (!json.playlistUrl) {
                log('no playlist url from server, playing original');
                onReady(null);
                return;
            }

            activeJob = {
                streamId: json.streamId,
                playlistUrl: json.playlistUrl,
                mode: json.mode
            };

            onReady({
                playlistUrl: json.playlistUrl,
                timeout: (json.hls_timeout_seconds || 60) * 1000,
                subtitlesUrl: json.subtitlesUrl,
                warning: json.warning
            });
        }, function (error) {
            // NEVER fatal — fall through to original URL and let the player try.
            log('start error, falling back to original url', error);
            onReady(null);
        }, JSON.stringify(payload), {
            dataType: 'json',
            type: 'POST',
            timeout: 1000 * 20,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    function sendHeartbeat() {
        if (!activeJob) return;

        // Include current playback position so the server can protect
        // still-needed segments from its cleanup loop.
        var url = API_BASE + '/transcoding/' + activeJob.streamId + '/heartbeat';
        try {
            var pos = 0;
            if (Lampa.PlayerVideo && typeof Lampa.PlayerVideo.video === 'function') {
                var v = Lampa.PlayerVideo.video();
                if (v && typeof v.currentTime === 'number') pos = v.currentTime;
            }
            if (pos > 0) {
                url += (url.indexOf('?') >= 0 ? '&' : '?') + 'pos=' + encodeURIComponent(pos.toFixed(1));
            }
        } catch (e) { /* noop */ }

        var net = new Lampa.Reguest();
        net.native(account(url),
            function () { /* ok */ },
            function () { /* silent */ },
            null, { dataType: 'text', timeout: 1000 * 10 });
    }

    function stopHeartbeat() {
        if (heartbeatTimer) {
            clearInterval(heartbeatTimer);
            heartbeatTimer = null;
        }
    }

    function ensureJobStopped(sendRemote) {
        if (!activeJob) return;
        var job = activeJob;
        activeJob = null;
        stopHeartbeat();
        if (sendRemote) {
            var net = new Lampa.Reguest();
            net.native(account(API_BASE + '/transcoding/' + job.streamId + '/stop'),
                function () { /* ok */ },
                function () { /* silent */ },
                null, { dataType: 'text', timeout: 1000 * 10 });
        }
    }

    // ------------------------------------------------------------------
    // Player event handlers
    // ------------------------------------------------------------------

    function handlePlayerStart(e) {
        if (!isMkvSource(e.data) || e.data.transcoding || /\/transcoding\//i.test(e.data.url)) return;

        e.abort();
        e.data.url = e.data.url.replace(/&(preload|stat|m3u)/g, '&play');

        log('intercept mkv playback', e.data.url);

        startTranscoding(e.data, function (result) {
            var playback = e.data || {};

            // Server unreachable → play the original URL as-is.  The player
            // will either handle it (native decoders often do) or surface
            // its own error — far better UX than our fatal notification.
            if (!result) {
                playback.transcoding = false;
                Lampa.Player.play(playback);
                return;
            }

            // Native mode — server decided we don't need to touch it.
            if (result.nativeUrl) {
                playback.url = result.nativeUrl;
                playback.transcoding = false;
                Lampa.Player.play(playback);
                return;
            }

            playback.transcoding = true;
            playback.ffprobe = null;
            playback.url = result.playlistUrl;
            playback.hls_manifest_timeout = result.timeout;
            Lampa.Player.play(playback);

            if (result.subtitlesUrl) {
                loadSubtitles(result.subtitlesUrl);
            }
        });
    }

    function handlePlayerDestroy() { ensureJobStopped(true); }

    function handleVideoPause() {
        if (!activeJob) return;
        stopHeartbeat();
        heartbeatTimer = setInterval(sendHeartbeat, 1000 * 10);
    }

    function handleVideoPlay() {
        if (!activeJob) return;
        stopHeartbeat();
    }

    if (!window.lampac_transcoding_plugin) {
        window.lampac_transcoding_plugin = true;

        Lampa.Player.listener.follow('create', handlePlayerStart);
        Lampa.Player.listener.follow('destroy', handlePlayerDestroy);
        Lampa.PlayerVideo.listener.follow('pause', handleVideoPause);
        Lampa.PlayerVideo.listener.follow('play', handleVideoPlay);
    }
})();
