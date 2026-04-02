(function () {
  'use strict';

  if (window.lampac_cdn_direct_plugin) return;
  window.lampac_cdn_direct_plugin = true;

  // Current edge_hash for CDN auth (Accepts-Controls header).
  // Updated by polling the server's edge_hash endpoint.
  var edgeHash = '';
  var edgeHashUrl = '';
  var pollTimer = null;
  var hlsPatched = false;

  // CDN hostnames that need edge_hash headers.
  var CDN_HOSTS = ['stream-balancer-allo', 'stloadi.live'];

  // ── Resolve via hidden iframe, then play through Shaka ──
  function resolveViaIframe(iframeUrl) {
    console.log('[cdn_direct] starting iframe resolve...');

    // Open iframe (user sees CDN player initially)
    openIframePlayer(iframeUrl);

    // Poll /lite/alloha/resolved for the m3u8 URL that iframe's /bnsi/movies/ captured
    var attempts = 0;
    var pollResolve = setInterval(function () {
      attempts++;
      if (attempts > 30) { // 15 seconds max
        clearInterval(pollResolve);
        console.log('[cdn_direct] resolve timeout — keeping iframe player');
        return;
      }
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/lite/alloha/resolved', false);
        xhr.timeout = 2000;
        xhr.send();
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          if (data.url) {
            clearInterval(pollResolve);
            console.log('[cdn_direct] resolved m3u8:', data.url.substring(0, 80));

            // Close iframe overlay
            var overlay = document.getElementById('cdn-direct-overlay');
            if (overlay) overlay.remove();

            // Start Lampa/Shaka player with the resolved URL
            if (typeof Lampa !== 'undefined' && Lampa.Player) {
              Lampa.Player.play({
                title: 'Alloha',
                url: data.url
              });
            }
          }
        }
      } catch (e) {}
    }, 500);
  }

  // ── Open native CDN player in fullscreen iframe overlay ──
  function openIframePlayer(iframeUrl) {
    // Remove existing overlay if any.
    var existing = document.getElementById('cdn-direct-overlay');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'cdn-direct-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:999999;background:#000;';

    var iframe = document.createElement('iframe');
    iframe.src = iframeUrl;
    iframe.style.cssText = 'width:100%;height:100%;border:none;';
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('allow', 'autoplay; fullscreen; encrypted-media');

    // Close button
    var closeBtn = document.createElement('div');
    closeBtn.textContent = '\u2190';
    closeBtn.style.cssText = 'position:absolute;top:10px;left:15px;z-index:1000000;color:#fff;font-size:28px;cursor:pointer;background:rgba(0,0,0,0.5);padding:5px 15px;border-radius:5px;';
    closeBtn.onclick = function () {
      overlay.remove();
      // Restore Lampa UI
      if (typeof Lampa !== 'undefined') {
        try { Lampa.Player.destroy(); } catch (e) {}
        try { Lampa.Controller.toggle('content'); } catch (e) {}
      }
    };

    // ESC key to close
    var onKey = function (e) {
      if (e.keyCode === 27 || e.keyCode === 8) { // ESC or Backspace
        closeBtn.onclick();
        document.removeEventListener('keydown', onKey);
      }
    };
    document.addEventListener('keydown', onKey);

    overlay.appendChild(iframe);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    console.log('[cdn_direct] iframe player opened');
  }

  function isCDNUrl(url) {
    for (var i = 0; i < CDN_HOSTS.length; i++) {
      if (url.indexOf(CDN_HOSTS[i]) >= 0) return true;
    }
    return false;
  }

  var shakaPatched = false;

  // ── Patch Shaka player to inject CDN auth headers ──────
  function patchShaka() {
    if (typeof shaka === 'undefined' || !shaka.Player || shakaPatched) return;
    shakaPatched = true;

    // Patch attach() — called right after new shaka.Player() before load().
    var origAttach = shaka.Player.prototype.attach;
    shaka.Player.prototype.attach = function () {
      var player = this;
      var result = origAttach.apply(this, arguments);

      // Register request filter after attach (networkingEngine is available).
      // Use Promise.resolve to ensure attach() completes first.
      Promise.resolve(result).then(function () {
        var net = player.getNetworkingEngine();
        if (net && !player.__cdnDirectFilter) {
          player.__cdnDirectFilter = true;
          net.registerRequestFilter(function (type, request) {
            var uri = request.uris && request.uris[0] || '';
            if (edgeHash && isCDNUrl(uri)) {
              // Only Accepts-Controls is in CDN's Access-Control-Allow-Headers.
              // Do NOT send pc_hash — it's not CORS-allowed and triggers preflight rejection.
              request.headers['Accepts-Controls'] = edgeHash;
              console.log('[cdn_direct] injected hash for:', uri.substring(0, 60));
            }
          });
          console.log('[cdn_direct] Shaka requestFilter registered');
        }
      });

      return result;
    };
    console.log('[cdn_direct] Shaka patched');
  }

  // ── Patch HLS.js to inject CDN auth headers ──────
  function patchHls() {
    if (typeof Hls === 'undefined' || hlsPatched) return;
    hlsPatched = true;

    var origAttach = Hls.prototype.attachMedia;
    Hls.prototype.attachMedia = function (media) {
      var hls = this;

      // Inject xhrSetup to add CDN auth headers on cross-origin segment requests.
      var prevSetup = hls.config.xhrSetup;
      hls.config.xhrSetup = function (xhr, url) {
        if (prevSetup) prevSetup(xhr, url);

        if (edgeHash && isCDNUrl(url)) {
          try {
            // Only Accepts-Controls is CORS-allowed by CDN.
            xhr.setRequestHeader('Accepts-Controls', edgeHash);
          } catch (e) {
            console.warn('[cdn_direct] header injection failed:', e.message);
          }
        }
      };

      return origAttach.call(this, media);
    };
  }

  // ── Auto-detect edge_hash_url from server ─────────
  function autoDetectEdgeHashUrl() {
    if (edgeHashUrl) return;
    // Try common mirage/alloha endpoints
    var candidates = ['/lite/mirage/edge_hash', '/lite/alloha/edge_hash'];
    for (var i = 0; i < candidates.length; i++) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', candidates[i], false);
        xhr.timeout = 2000;
        xhr.send();
        if (xhr.status === 200) {
          var data = JSON.parse(xhr.responseText);
          // Set URL even if hash is empty — polling will pick it up later.
          edgeHashUrl = candidates[i];
          if (data.hash) {
            edgeHash = data.hash;
            console.log('[cdn_direct] auto-detected edge_hash from', edgeHashUrl, ':', edgeHash.substring(0, 8));
          } else {
            console.log('[cdn_direct] edge_hash endpoint found at', edgeHashUrl, '(hash empty, will poll)');
          }
          return;
        }
      } catch (e) {}
    }
  }

  // ── Poll edge_hash from server ───────────────────
  function startPolling() {
    stopPolling();
    if (!edgeHashUrl) autoDetectEdgeHashUrl();
    if (!edgeHashUrl) return;

    function poll() {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', edgeHashUrl, true);
        xhr.timeout = 5000;
        xhr.onload = function () {
          if (xhr.status === 200) {
            try {
              var data = JSON.parse(xhr.responseText);
              if (data.hash) {
                edgeHash = data.hash;
              }
            } catch (e) {}
          }
        };
        xhr.send();
      } catch (e) {}
    }

    poll(); // Initial fetch
    pollTimer = setInterval(poll, 25000); // Every 25s (edge_hash TTL is ~120s)
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  // ── Hook into Lampa player events ────────────────
  // Listen for online.js responses that include cdn_headers/edge_hash_url
  // and activate direct CDN streaming mode.

  // Intercept Lampa.Player.play to capture cdn_headers from the play element.
  if (typeof Lampa !== 'undefined' && Lampa.Player) {
    Lampa.Player.listener.follow('start', function () {
      patchHls();
      patchShaka();
      // Ensure edge_hash polling is running when playback starts.
      if (!edgeHashUrl) autoDetectEdgeHashUrl();
      startPolling();
    });

    Lampa.Player.listener.follow('destroy', function () {
      stopPolling();
    });
  }

  // Hook into network responses to capture cdn_headers from /lite/mirage/video
  // or /lite/alloha/video endpoints.
  var origXHROpen = XMLHttpRequest.prototype.open;
  var origXHRSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this.__cdnDirectUrl = url;
    return origXHROpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function () {
    var xhr = this;
    var url = xhr.__cdnDirectUrl || '';

    // Watch for /lite/mirage/video or /lite/alloha/video responses
    if (url.indexOf('/lite/mirage/video') >= 0 || url.indexOf('/lite/alloha/video') >= 0) {
      var origOnLoad = xhr.onload;
      xhr.onload = function () {
        try {
          if (xhr.status === 200 && xhr.responseText) {
            var data = JSON.parse(xhr.responseText);

            // IFRAME-RESOLVE MODE: open hidden iframe to resolve via CDN player,
            // then intercept the m3u8 URL and play through Shaka/native player.
            if (data.iframe) {
              console.log('[cdn_direct] iframe-resolve mode:', data.iframe);
              resolveViaIframe(data.iframe);
              // Prevent online.js from starting immediately — we'll start player
              // when m3u8 URL is captured from iframe.
              Object.defineProperty(xhr, 'responseText', {value: '{}'});
              Object.defineProperty(xhr, 'response', {value: '{}'});
            }

            if (data.cdn_headers) {
              edgeHash = data.cdn_headers['Accepts-Controls'] || data.cdn_headers.pc_hash || '';
            }
            if (data.edge_hash_url) {
              edgeHashUrl = data.edge_hash_url;
              startPolling();
            }
          }
        } catch (e) {}

        if (origOnLoad) origOnLoad.apply(this, arguments);
      };
    }

    return origXHRSend.apply(this, arguments);
  };

  // Also intercept fetch() — Lampa may use fetch instead of XHR.
  if (window.fetch) {
    var origFetch = window.fetch;
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : (input && input.url || '');
      var result = origFetch.apply(this, arguments);

      if (url.indexOf('/lite/mirage/video') >= 0 || url.indexOf('/lite/alloha/video') >= 0) {
        result.then(function (resp) {
          return resp.clone().json().then(function (data) {
            if (data.iframe) {
              console.log('[cdn_direct] fetch intercepted iframe:', data.iframe);
              resolveViaIframe(data.iframe);
            }
            if (data.cdn_headers) {
              edgeHash = data.cdn_headers['Accepts-Controls'] || data.cdn_headers.pc_hash || '';
            }
            if (data.edge_hash_url) {
              edgeHashUrl = data.edge_hash_url;
              startPolling();
            }
          });
        }).catch(function () {});
      }

      return result;
    };
  }

  // Initial patches (in case Hls/Shaka are already loaded).
  patchHls();
  patchShaka();

  // Retry patching after a delay — Shaka/Hls may load after this plugin.
  setTimeout(function () {
    patchHls();
    patchShaka();
  }, 3000);
  setTimeout(function () {
    patchHls();
    patchShaka();
  }, 8000);

  console.log('[cdn_direct] plugin loaded');
})();
