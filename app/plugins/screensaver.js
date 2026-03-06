(function () {
  'use strict';

  // ---- Duplicate guard ----
  if (window._aerialScreensaver) return;
  window._aerialScreensaver = true;

  var VIDEOS_URL = 'https://raw.githubusercontent.com/kolian72/Aerial/refs/heads/master/videos.json';

  // Route Apple CDN videos through our proxy to avoid ERR_CERT_AUTHORITY_INVALID.
  function proxyVideoURL(src) {
    if (!src) return src;
    var base = window.location.origin || '';
    return base + '/proxy/' + encodeURIComponent(src) + '?pl=screensaver';
  }

  // ---- State ----
  var allVideos = [];
  var videosLoaded = false;
  var active = false;
  var idleTimer = null;
  var playerPlaying = false;

  var container = null;
  var videoEl = null;
  var infoEl = null;
  var clockEl = null;
  var clockTimer = null;
  var poiInterval = null;
  var styleTag = null;

  // ---- Helpers ----
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function getSetting(key, def) {
    return Lampa.Storage.get('screensaver_' + key, def);
  }

  // Lampa trigger stores boolean true/false, but can also be string 'true'/'false'.
  function isEnabled() {
    var v = getSetting('enabled', true);
    return v === true || v === 'true';
  }

  function getTimeout() {
    return parseInt(getSetting('timeout', '5')) || 5;
  }

  function getQuality() {
    return getSetting('quality', 'H2641080p');
  }

  function getCategory() {
    return getSetting('category', 'all');
  }

  // ---- CSS ----
  var CSS = [
    '#aerial-screensaver {',
    '  position: fixed; top: 0; left: 0;',
    '  width: 100vw; height: 100vh;',
    '  z-index: 999999; background: #000;',
    '  opacity: 0; transition: opacity 1.5s ease;',
    '}',
    '#aerial-screensaver.show { opacity: 1; }',
    '#aerial-screensaver video {',
    '  width: 100%; height: 100%; object-fit: cover;',
    '}',
    '#aerial-info {',
    '  position: absolute; bottom: 8vh; left: 4vw;',
    '  max-width: 55vw;',
    '  color: #fff; font-size: 1.5em; font-weight: 300;',
    '  text-shadow: 0 1px 8px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.4);',
    '  opacity: 0; transition: opacity 1.2s ease;',
    '  letter-spacing: 0.02em;',
    '  font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;',
    '}',
    '#aerial-info.visible { opacity: 1; }',
    '#aerial-clock {',
    '  position: absolute; bottom: 8vh; right: 4vw;',
    '  color: rgba(255,255,255,0.75); font-size: 2.8em; font-weight: 200;',
    '  text-shadow: 0 1px 8px rgba(0,0,0,0.9);',
    '  font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;',
    '  letter-spacing: 0.05em;',
    '}'
  ].join('\n');

  // ---- Settings ----
  var iconSVG = '<svg viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M405.1 78.5C365.4 38.8 312.7 16 256 16S146.6 38.8 106.9 78.5 64 183.2 64 240c0 69.5 34.7 134.5 92.8 173.3l12.3 8.2V464h48v-42.5h78V464h48v-42.5l12.3-8.2C413.3 374.5 448 309.5 448 240c0-56.7-22.8-109.4-42.9-161.5zM256 400c-88.2 0-160-71.8-160-160S167.8 80 256 80s160 71.8 160 160-71.8 160-160 160zm0-288c-70.6 0-128 57.4-128 128s57.4 128 128 128 128-57.4 128-128-57.4-128-128-128zm64 144h-48v48h-32v-48h-48v-32h48v-48h32v48h48v32z"/><circle cx="256" cy="240" r="80" opacity="0.3"/></svg>';

  Lampa.Lang.add({
    screensaver_title: {
      ru: 'Заставка',
      uk: 'Заставка',
      en: 'Screensaver'
    },
    screensaver_enable: {
      ru: 'Заставка Apple TV',
      uk: 'Заставка Apple TV',
      en: 'Apple TV Screensaver'
    },
    screensaver_enable_descr: {
      ru: 'Аэросъёмки Земли как заставка при бездействии',
      uk: 'Аерозйомки Землi як заставка при бездiяльностi',
      en: 'Aerial views of Earth as idle screensaver'
    },
    screensaver_timeout_name: {
      ru: 'Таймаут',
      uk: 'Таймаут',
      en: 'Timeout'
    },
    screensaver_timeout_descr: {
      ru: 'Время бездействия до запуска',
      uk: 'Час бездiяльностi до запуску',
      en: 'Idle time before activation'
    },
    screensaver_quality_name: {
      ru: 'Качество',
      uk: 'Якiсть',
      en: 'Quality'
    },
    screensaver_quality_descr: {
      ru: '4K HEVC для мощных устройств',
      uk: '4K HEVC для потужних пристроїв',
      en: '4K HEVC for powerful devices'
    },
    screensaver_category_name: {
      ru: 'Категория',
      uk: 'Категорiя',
      en: 'Category'
    },
    screensaver_cat_all: {
      ru: 'Все',
      uk: 'Всi',
      en: 'All'
    },
    screensaver_cat_landscape: {
      ru: 'Пейзажи',
      uk: 'Пейзажi',
      en: 'Landscapes'
    },
    screensaver_cat_cityscape: {
      ru: 'Города',
      uk: 'Мiста',
      en: 'Cities'
    },
    screensaver_cat_space: {
      ru: 'Космос',
      uk: 'Космос',
      en: 'Space'
    },
    screensaver_cat_underwater: {
      ru: 'Подводный мир',
      uk: 'Пiдводний свiт',
      en: 'Underwater'
    }
  });

  Lampa.SettingsApi.addComponent({
    component: 'screensaver',
    icon: iconSVG,
    name: Lampa.Lang.translate('screensaver_title')
  });

  Lampa.SettingsApi.addParam({
    component: 'screensaver',
    param: {
      name: 'screensaver_enabled',
      type: 'trigger',
      default: true
    },
    field: {
      name: Lampa.Lang.translate('screensaver_enable'),
      description: Lampa.Lang.translate('screensaver_enable_descr')
    },
    onChange: function (val) {
      if (val === 'false' || val === false) stopIdle();
      else resetIdle();
    }
  });

  Lampa.SettingsApi.addParam({
    component: 'screensaver',
    param: {
      name: 'screensaver_timeout',
      type: 'select',
      values: {
        '2': '2 min',
        '3': '3 min',
        '5': '5 min',
        '10': '10 min',
        '15': '15 min',
        '20': '20 min'
      },
      default: '5'
    },
    field: {
      name: Lampa.Lang.translate('screensaver_timeout_name'),
      description: Lampa.Lang.translate('screensaver_timeout_descr')
    }
  });

  Lampa.SettingsApi.addParam({
    component: 'screensaver',
    param: {
      name: 'screensaver_quality',
      type: 'select',
      values: {
        'H2641080p': '1080p H.264',
        'H2651080p': '1080p HEVC',
        'H2654k':    '4K HEVC'
      },
      default: 'H2641080p'
    },
    field: {
      name: Lampa.Lang.translate('screensaver_quality_name'),
      description: Lampa.Lang.translate('screensaver_quality_descr')
    }
  });

  Lampa.SettingsApi.addParam({
    component: 'screensaver',
    param: {
      name: 'screensaver_category',
      type: 'select',
      values: {
        'all':        Lampa.Lang.translate('screensaver_cat_all'),
        'landscape':  Lampa.Lang.translate('screensaver_cat_landscape'),
        'cityscape':  Lampa.Lang.translate('screensaver_cat_cityscape'),
        'space':      Lampa.Lang.translate('screensaver_cat_space'),
        'underwater': Lampa.Lang.translate('screensaver_cat_underwater')
      },
      default: 'all'
    },
    field: {
      name: Lampa.Lang.translate('screensaver_category_name')
    }
  });

  // ---- Data loading ----
  function loadVideos(cb) {
    if (videosLoaded) return cb(allVideos);
    try {
      $.getJSON(VIDEOS_URL, function (data) {
        if (Array.isArray(data) && data.length) {
          allVideos = data;
          videosLoaded = true;
        }
        cb(allVideos);
      }).fail(function () {
        cb([]);
      });
    } catch (e) {
      cb([]);
    }
  }

  // ---- Idle detection ----
  function resetIdle() {
    if (active) return;
    clearTimeout(idleTimer);
    if (!isEnabled()) return;

    var ms = getTimeout() * 60 * 1000;
    idleTimer = setTimeout(function () {
      if (playerPlaying) { resetIdle(); return; }
      try {
        if (Lampa.Player && Lampa.Player.runing) { resetIdle(); return; }
      } catch (e) {}
      startScreensaver();
    }, ms);
  }

  function stopIdle() {
    clearTimeout(idleTimer);
  }

  // Debounce for mousemove — avoid resetting timer on every pixel.
  var activityDebounce = null;
  function onUserActivity() {
    if (active) return;
    if (activityDebounce) return;
    activityDebounce = setTimeout(function () {
      activityDebounce = null;
    }, 2000);
    resetIdle();
  }

  // ---- Screensaver lifecycle ----
  function startScreensaver() {
    if (active) return;
    loadVideos(function (list) {
      if (!list.length) { resetIdle(); return; }
      active = true;
      createOverlay();
      playNext(list);
    });
  }

  function stopScreensaver() {
    if (!active) return;
    active = false;
    destroyOverlay();
    resetIdle();
  }

  // ---- Overlay DOM ----
  function createOverlay() {
    // Inject CSS.
    styleTag = document.createElement('style');
    styleTag.textContent = CSS;
    document.head.appendChild(styleTag);

    // Build DOM.
    container = document.createElement('div');
    container.id = 'aerial-screensaver';

    videoEl = document.createElement('video');
    videoEl.autoplay = true;
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.setAttribute('playsinline', '');
    videoEl.setAttribute('webkit-playsinline', '');

    infoEl = document.createElement('div');
    infoEl.id = 'aerial-info';

    clockEl = document.createElement('div');
    clockEl.id = 'aerial-clock';

    container.appendChild(videoEl);
    container.appendChild(infoEl);
    container.appendChild(clockEl);
    document.body.appendChild(container);

    // Clock.
    updateClock();
    clockTimer = setInterval(updateClock, 30000);

    // Fade in.
    setTimeout(function () {
      if (container) container.classList.add('show');
    }, 50);

    // Dismiss on any key (capture phase to prevent Lampa from handling it).
    document.addEventListener('keydown', onDismissKey, true);
    container.addEventListener('click', stopScreensaver);
    container.addEventListener('touchstart', stopScreensaver);
  }

  function destroyOverlay() {
    document.removeEventListener('keydown', onDismissKey, true);
    clearTimeout(loadTimeout);
    clearTimeout(infoHideTimer);
    clearInterval(clockTimer);
    clearInterval(poiInterval);

    if (videoEl) {
      videoEl.pause();
      videoEl.removeAttribute('src');
      try { videoEl.load(); } catch (e) {}
      videoEl = null;
    }

    if (container) {
      container.classList.remove('show');
      var c = container;
      setTimeout(function () {
        if (c && c.parentNode) c.parentNode.removeChild(c);
      }, 400);
      container = null;
    }
    infoEl = null;
    clockEl = null;

    if (styleTag && styleTag.parentNode) {
      styleTag.parentNode.removeChild(styleTag);
      styleTag = null;
    }
  }

  function onDismissKey(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    stopScreensaver();
  }

  function updateClock() {
    if (!clockEl) return;
    var now = new Date();
    clockEl.textContent = pad2(now.getHours()) + ':' + pad2(now.getMinutes());
  }

  // ---- Video playback ----
  var loadTimeout = null;
  var failedIds = {};

  function playNext(list) {
    if (!active || !videoEl) return;

    var cat = getCategory();
    var filtered = cat === 'all' ? list : list.filter(function (v) { return v.type === cat; });
    if (!filtered.length) filtered = list;

    // Skip videos that already failed in this session.
    var available = filtered.filter(function (v) { return !failedIds[v.id]; });
    if (!available.length) available = filtered; // all failed — reset

    var chosen = available[Math.floor(Math.random() * available.length)];
    var quality = getQuality();
    var src = chosen.src && (chosen.src[quality] || chosen.src['H2641080p']);

    if (!src) {
      failedIds[chosen.id] = true;
      setTimeout(function () { playNext(list); }, 1000);
      return;
    }

    // Show name immediately and keep it visible until video starts.
    showInfo(chosen.name || chosen.accessibilityLabel || '', true);

    // Clear previous handlers and timeout.
    clearTimeout(loadTimeout);
    videoEl.oncanplay = null;
    videoEl.onended = null;
    videoEl.onerror = null;

    // Set up handlers BEFORE setting src.
    videoEl.oncanplay = function () {
      clearTimeout(loadTimeout);
      videoEl.oncanplay = null; // fire once
      videoEl.play().catch(function () {});
      setupPOI(chosen);
    };

    videoEl.onended = function () {
      playNext(list);
    };

    videoEl.onerror = function () {
      clearTimeout(loadTimeout);
      failedIds[chosen.id] = true;
      setTimeout(function () { playNext(list); }, 2000);
    };

    // Timeout: if video doesn't start within 20s, try next.
    loadTimeout = setTimeout(function () {
      if (!active || !videoEl) return;
      failedIds[chosen.id] = true;
      videoEl.oncanplay = null;
      videoEl.pause();
      videoEl.removeAttribute('src');
      try { videoEl.load(); } catch (e) {}
      playNext(list);
    }, 20000);

    videoEl.src = proxyVideoURL(src);
    videoEl.load();
  }

  // ---- Points of Interest overlay ----
  function setupPOI(data) {
    clearInterval(poiInterval);
    if (!infoEl) return;

    var poi = data.pointsOfInterest || {};
    var keys = [];
    for (var k in poi) {
      if (poi.hasOwnProperty(k)) keys.push(Number(k));
    }
    keys.sort(function (a, b) { return a - b; });

    // Video name was already shown by playNext; just transition to POI.
    if (!keys.length) return;

    var lastShown = '';
    poiInterval = setInterval(function () {
      if (!active || !videoEl) { clearInterval(poiInterval); return; }

      var t = videoEl.currentTime;
      var label = '';
      for (var i = keys.length - 1; i >= 0; i--) {
        if (t >= keys[i]) {
          label = poi[String(keys[i])] || poi[keys[i]];
          break;
        }
      }

      if (label && label !== lastShown) {
        lastShown = label;
        showInfo(label);
      }
    }, 1000);
  }

  var infoHideTimer = null;

  // persistent=true keeps text visible until next showInfo call (used during loading).
  function showInfo(text, persistent) {
    if (!infoEl) return;
    clearTimeout(infoHideTimer);
    infoEl.classList.remove('visible');
    setTimeout(function () {
      if (!infoEl) return;
      infoEl.textContent = text;
      infoEl.classList.add('visible');
      if (!persistent) {
        infoHideTimer = setTimeout(function () {
          if (!infoEl) return;
          infoEl.classList.remove('visible');
        }, 7000);
      }
    }, 400);
  }

  // ---- Player state tracking ----
  try {
    Lampa.Listener.follow('player', function (e) {
      if (e.type === 'start' || e.type === 'play') {
        playerPlaying = true;
        stopIdle(); // no screensaver during playback
      }
      if (e.type === 'destroy' || e.type === 'end') {
        playerPlaying = false;
        resetIdle();
      }
    });
  } catch (e) {}

  // ---- Init ----
  function init() {
    // Track user activity for idle detection.
    var events = ['keydown', 'mousemove', 'click', 'touchstart', 'wheel'];
    for (var i = 0; i < events.length; i++) {
      document.addEventListener(events[i], onUserActivity, true);
    }

    resetIdle();

    // Preload videos list in background.
    loadVideos(function () {});
  }

  if (window.appready) {
    init();
  } else {
    Lampa.Listener.follow('app', function (e) {
      if (e.type === 'ready') init();
    });
  }
})();
