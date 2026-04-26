// backup_sync_key.js — adds a "Backup sync key" field to Lampa settings.
// When set, all devices using the same key share one backup file
// (via Lampa.Storage.set('lampac_unic_id', key) — backup.js then sends
// ?uid=<key> to /storage/get|set, which the server uses to resolve the
// backup directory). Works on Android/Tizen/Web because it relies only on
// Lampa.Storage, not on raw localStorage.
(function () {
  'use strict';

  if (window.lampac_backup_sync_key_plugin) return;
  window.lampac_backup_sync_key_plugin = true;

  var KEY_STORE = 'lampac_backup_sync_key';
  var UID_STORE = 'lampac_unic_id';

  function applyKey(value) {
    value = (value || '').toString().trim();
    if (!value) return;
    try { Lampa.Storage.set(UID_STORE, value); } catch (e) {}
    try { localStorage.setItem('lampac_uid_backup', value); } catch (e) {}
  }

  function ensureOnBoot() {
    var saved = '';
    try { saved = (Lampa.Storage.get(KEY_STORE, '') || '').toString().trim(); } catch (e) {}
    // Initialize the storage slot explicitly so Lampa's settings page never
    // renders "undefined" for an unset key.
    try { Lampa.Storage.set(KEY_STORE, saved); } catch (e) {}
    if (saved) applyKey(saved);
  }

  function addSettings() {
    if (!Lampa.SettingsApi) return;

    Lampa.Lang.add({
      lampac_backup_sync_key: {
        ru: 'Ключ синхронизации бекапа',
        en: 'Backup sync key',
        uk: 'Ключ синхронізації бекапу',
        zh: '备份同步密钥'
      },
      lampac_backup_sync_key_descr: {
        ru: 'Любая строка. Устройства с одинаковым ключом делят один бекап. Пусто — бекап только на этом устройстве.',
        en: 'Any string. Devices sharing the same key share one backup. Empty — per-device only.',
        uk: 'Будь-який рядок. Пристрої з однаковим ключем поділяють один бекап. Порожньо — тільки на цьому пристрої.',
        zh: '任意字符串。共享同一密钥的设备共享一个备份。'
      },
      lampac_backup_sync_key_empty: {
        ru: 'Не задан',
        en: 'Not set',
        uk: 'Не задано',
        zh: '未设置'
      }
    });

    function placeholderText() {
      return Lampa.Lang.translate('lampac_backup_sync_key_empty');
    }

    function refreshDisplay(item) {
      try {
        var saved = (Lampa.Storage.get(KEY_STORE, '') || '').toString().trim();
        var $value = item.find('.settings-param__value');
        if (!$value.length) return;
        if (!saved) $value.text(placeholderText());
      } catch (e) {}
    }

    Lampa.SettingsApi.addParam({
      component: 'backup',
      param: {
        name: KEY_STORE,
        type: 'input',
        values: '',
        default: ''
      },
      field: {
        name: Lampa.Lang.translate('lampac_backup_sync_key'),
        description: Lampa.Lang.translate('lampac_backup_sync_key_descr')
      },
      onRender: function (item) {
        // Lampa renders raw stored value; for empty/unset it ends up as the
        // string "undefined". Replace it with a localized placeholder.
        refreshDisplay(item);
      },
      onChange: function (val) {
        val = (val || '').toString().trim();
        try { Lampa.Storage.set(KEY_STORE, val); } catch (e) {}
        if (val) {
          applyKey(val);
          try { Lampa.Noty.show('Ключ синхронизации применён. Перезапустите приложение, если используете автозагрузку бекапа.'); } catch (e) {}
        }
      }
    });
  }

  function init() {
    ensureOnBoot();
    addSettings();
  }

  if (window.appready) init();
  else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') init(); });
})();
