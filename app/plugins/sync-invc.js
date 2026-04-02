// ═══════════════════════════════════════════════════════════════
//  Plugin Sync — cross-device synchronization of user-installed plugins
//  Uses existing storage API + NWS broadcast via sync.js hooks
// ═══════════════════════════════════════════════════════════════

var sync_invc = {
  import_keys: ['sync_plugins']
};

(function() {
  'use strict';

  // ── Constants ─────────────────────────────────────────────
  var TOGGLES_KEY    = 'lampac_psync_toggles';   // {url: bool} per-plugin on/off
  var KNOWN_KEY      = 'lampac_psync_known';      // [url, ...] previously seen from server
  var MASTER_KEY     = 'lampac_psync_master';      // master on/off toggle
  var SERVER_PREFIX  = '{localhost}/';              // replaced by Go handler at serve time

  // ── Helpers ───────────────────────────────────────────────
  function jsonParse(raw, fallback) {
    if (raw == null || raw === '') return fallback;
    try { var v = JSON.parse(raw); return v != null ? v : fallback; } catch(e) { return fallback; }
  }

  function getToggles() {
    return jsonParse(localStorage.getItem(TOGGLES_KEY), {});
  }
  function setToggles(obj) {
    localStorage.setItem(TOGGLES_KEY, JSON.stringify(obj));
  }

  function getKnown() {
    return jsonParse(localStorage.getItem(KNOWN_KEY), []);
  }
  function setKnown(arr) {
    localStorage.setItem(KNOWN_KEY, JSON.stringify(arr));
  }

  function masterEnabled() {
    return typeof Lampa !== 'undefined' && Lampa.Storage
      ? Lampa.Storage.get(MASTER_KEY, true) : false;
  }

  function isServerPlugin(url) {
    if (!url) return false;
    // Server plugins have URLs like http://host:port/plugin.js
    // SERVER_PREFIX is replaced by Go handler with the request host,
    // but client may use localhost vs 127.0.0.1 vs actual hostname.
    // Strategy: plugin is "server" if its URL host:port matches ANY known server origin.
    try {
      var pu = new URL(url);
      var su = new URL(SERVER_PREFIX);
      // Same port = same server (covers localhost vs 127.0.0.1 vs hostname)
      if (pu.port === su.port && (pu.hostname === su.hostname ||
          pu.hostname === 'localhost' || pu.hostname === '127.0.0.1' ||
          su.hostname === 'localhost' || su.hostname === '127.0.0.1')) {
        return true;
      }
      // Also check window.location origin
      if (pu.origin === location.origin) return true;
    } catch(e) {}
    return false;
  }

  /** All user-installed plugins (not admin/server-injected). */
  function getUserPlugins() {
    if (typeof Lampa === 'undefined' || !Lampa.Plugins) return [];
    return Lampa.Plugins.get().filter(function(p) {
      return p && p.url && !isServerPlugin(p.url);
    });
  }

  /** User plugins that are enabled for sync. */
  function getSyncedList() {
    if (!masterEnabled()) return [];
    var toggles = getToggles();
    return getUserPlugins().filter(function(p) {
      return toggles[p.url] !== false; // default = synced
    });
  }


  // ═══════════════════════════════════════════════════════════
  //  Export — send synced plugin list to server
  // ═══════════════════════════════════════════════════════════
  sync_invc.goExport = function(path, value) {
    if (path === 'sync_plugins' && masterEnabled()) {
      value.sync_plugins = JSON.stringify(getSyncedList());
    }
    return value;
  };


  // ═══════════════════════════════════════════════════════════
  //  Import — merge remote plugin list with local
  // ═══════════════════════════════════════════════════════════
  // NB: importСompleted uses Cyrillic С (U+0421) — must match sync.js line 91
  sync_invc.import\u0421ompleted = function(path) {
    if (path !== 'sync_plugins' || !masterEnabled()) return;

    window._psync_importing = true;
    try {
      var raw = Lampa.Storage.get('sync_plugins', '');
      if (!raw) { window._psync_importing = false; return; }

      var remote = jsonParse(raw, null);
      if (!Array.isArray(remote)) { window._psync_importing = false; return; }

      var local    = getUserPlugins();
      var localMap = {};
      local.forEach(function(p) { localMap[p.url] = true; });

      var remoteMap = {};
      remote.forEach(function(p) { if (p && p.url) remoteMap[p.url] = p; });

      // Known set — URLs previously received from server.
      // Only delete a local plugin if it was known from server but now absent.
      var known    = getKnown();
      var knownSet = {};
      known.forEach(function(u) { knownSet[u] = true; });

      var toggles = getToggles();
      var added   = 0;
      var removed = 0;

      // Add plugins from remote that are missing locally
      remote.forEach(function(p) {
        if (p && p.url && !localMap[p.url]) {
          Lampa.Plugins.add(p);
          toggles[p.url] = true;
          added++;
        }
      });

      // Remove plugins that were previously synced (known + toggle on) but now gone from remote
      local.forEach(function(p) {
        if (knownSet[p.url] && toggles[p.url] !== false && !remoteMap[p.url]) {
          Lampa.Plugins.remove(p);
          delete toggles[p.url];
          removed++;
        }
      });

      if (added || removed) {
        Lampa.Plugins.save();
        setToggles(toggles);

        // One-time reload to activate new plugins
        if (!sessionStorage.getItem('lampac_psync_reload')) {
          sessionStorage.setItem('lampac_psync_reload', '1');
          setKnown(Object.keys(remoteMap));
          window._psync_importing = false;
          location.reload();
          return;
        }
        sessionStorage.removeItem('lampac_psync_reload');
      }

      // Update known set with current remote URLs
      setKnown(Object.keys(remoteMap));

    } catch(e) {
      console.log('PluginSync', 'import error', e && e.message);
    }
    window._psync_importing = false;
  };


  // ═══════════════════════════════════════════════════════════
  //  Watcher — detect local plugin changes, trigger export
  // ═══════════════════════════════════════════════════════════
  function startWatcher() {
    Lampa.Storage.listener.follow('change', function(e) {
      if (e.name === 'plugins' && masterEnabled() && !window._psync_importing) {
        clearTimeout(window._psync_timer);
        window._psync_timer = setTimeout(function() {
          var list = getSyncedList();
          if (list.length > 0 || getUserPlugins().length === 0) {
            Lampa.Storage.set('sync_plugins', JSON.stringify(list));
          }
        }, 500);
      }
    });
  }


  // ═══════════════════════════════════════════════════════════
  //  Settings UI — master toggle + per-plugin manager
  // ═══════════════════════════════════════════════════════════
  function initSettings() {
    if (typeof Lampa === 'undefined' || !Lampa.SettingsApi) return;

    Lampa.Lang.add({
      psync_title:       { ru: 'Синхронизация плагинов', en: 'Plugin Sync', uk: 'Синхронізація плагінів' },
      psync_enable:      { ru: 'Синхронизация плагинов', en: 'Plugin Sync',  uk: 'Синхронізація плагінів' },
      psync_enable_desc: {
        ru: 'Автоматически синхронизировать пользовательские плагины между всеми устройствами',
        en: 'Automatically sync user plugins across all devices',
        uk: 'Автоматично синхронізувати плагіни між усіма пристроями'
      },
      psync_manage:      { ru: 'Управление синхронизацией', en: 'Manage sync', uk: 'Керування синхронізацією' },
      psync_manage_desc: {
        ru: 'Выбрать какие плагины синхронизировать',
        en: 'Choose which plugins to sync',
        uk: 'Обрати які плагіни синхронізувати'
      },
      psync_now:         { ru: 'Синхронизировать сейчас', en: 'Sync now', uk: 'Синхронізувати зараз' },
      psync_now_desc:    {
        ru: 'Принудительная отправка списка плагинов на сервер',
        en: 'Force push plugin list to server',
        uk: 'Примусово відправити список плагінів на сервер'
      },
      psync_no_plugins:  { ru: 'Нет пользовательских плагинов', en: 'No user plugins', uk: 'Немає плагінів' },
      psync_synced:      { ru: 'синхронизируется', en: 'synced', uk: 'синхронізується' },
      psync_not_synced:  { ru: 'не синхронизируется', en: 'not synced', uk: 'не синхронізується' },
      psync_pushed:      { ru: 'Плагины отправлены на сервер', en: 'Plugins pushed to server', uk: 'Плагіни відправлено на сервер' }
    });

    // Master toggle
    Lampa.SettingsApi.addParam({
      component: 'more',
      param: {
        name: MASTER_KEY,
        type: 'trigger',
        default: true
      },
      field: {
        name: Lampa.Lang.translate('psync_enable'),
        description: Lampa.Lang.translate('psync_enable_desc')
      }
    });

    // Per-plugin manager
    Lampa.SettingsApi.addParam({
      component: 'more',
      param: {
        name: 'lampac_psync_manage',
        type: 'button'
      },
      field: {
        name: Lampa.Lang.translate('psync_manage'),
        description: Lampa.Lang.translate('psync_manage_desc')
      },
      onChange: function() { showPluginManager(); }
    });

    // Manual sync button
    Lampa.SettingsApi.addParam({
      component: 'more',
      param: {
        name: 'lampac_psync_now',
        type: 'button'
      },
      field: {
        name: Lampa.Lang.translate('psync_now'),
        description: Lampa.Lang.translate('psync_now_desc')
      },
      onChange: function() {
        Lampa.Storage.set('sync_plugins', JSON.stringify(getSyncedList()));
        Lampa.Noty.show(Lampa.Lang.translate('psync_pushed'));
      }
    });
  }

  function showPluginManager() {
    var plugins = getUserPlugins();
    var toggles = getToggles();

    if (!plugins.length) {
      Lampa.Noty.show(Lampa.Lang.translate('psync_no_plugins'));
      return;
    }

    var items = plugins.map(function(p) {
      var on = toggles[p.url] !== false;
      return {
        title: (p.name || p.url.split('/').pop() || p.url) + (on ? ' ✓' : ' ✗'),
        plugin: p,
        enabled: on
      };
    });

    Lampa.Select.show({
      title: Lampa.Lang.translate('psync_manage'),
      items: items,
      onSelect: function(item) {
        var newState = !item.enabled;
        toggles[item.plugin.url] = newState;
        setToggles(toggles);

        // Trigger export with updated list
        Lampa.Storage.set('sync_plugins', JSON.stringify(getSyncedList()));

        var label = item.plugin.name || item.plugin.url.split('/').pop() || item.plugin.url;
        Lampa.Noty.show(label + ': ' + Lampa.Lang.translate(newState ? 'psync_synced' : 'psync_not_synced'));

        // Re-open with updated state
        showPluginManager();
      },
      onBack: function() {
        Lampa.Controller.toggle('settings_component');
      }
    });
  }


  // ═══════════════════════════════════════════════════════════
  //  Init
  // ═══════════════════════════════════════════════════════════
  // Register watcher immediately — Lampa.Storage is available
  // inside sync.js IIFE where this code is injected.
  if (typeof Lampa !== 'undefined' && Lampa.Storage && Lampa.Storage.listener) {
    startWatcher();
  }

  // Settings UI needs full Lampa init (SettingsApi, Lang, etc.)
  function waitForReady(fn) {
    if (window.appready) return fn();
    if (typeof Lampa !== 'undefined' && Lampa.Listener) {
      Lampa.Listener.follow('app', function(e) { if (e.type === 'ready') fn(); });
    } else {
      // Fallback: poll for appready
      var iv = setInterval(function() {
        if (window.appready) { clearInterval(iv); fn(); }
      }, 300);
    }
  }
  waitForReady(initSettings);
})();
