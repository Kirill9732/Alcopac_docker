(function() {
  'use strict';

  if (window.lampac_migrate_plugin) return;
  window.lampac_migrate_plugin = true;

  var host = '{localhost}';

  // Track where we came from so we can return to the right controller
  var returnController = 'content';

  // -------------------------------------------------------------------------
  // i18n
  // -------------------------------------------------------------------------
  Lampa.Lang.add({
    migrate_title: {
      ru: 'Перенос данных',
      en: 'Data Migration',
      uk: 'Перенесення даних'
    },
    migrate_found: {
      ru: 'Перенос данных из старого Lampac',
      en: 'Migrate data from old Lampac',
      uk: 'Перенесення даних зі старого Lampac'
    },
    migrate_local: {
      ru: 'Перенести с этого сервера',
      en: 'Migrate from this server',
      uk: 'Перенести з цього сервера'
    },
    migrate_remote: {
      ru: 'Перенести с другого сервера',
      en: 'Migrate from another server',
      uk: 'Перенести з іншого сервера'
    },
    migrate_skip: {
      ru: 'Пропустить',
      en: 'Skip',
      uk: 'Пропустити'
    },
    migrate_enter_server: {
      ru: 'Адрес старого сервера',
      en: 'Old server address',
      uk: 'Адреса старого сервера'
    },
    migrate_enter_hint: {
      ru: 'Например: http://192.168.1.100:9118',
      en: 'Example: http://192.168.1.100:9118',
      uk: 'Наприклад: http://192.168.1.100:9118'
    },
    migrate_progress: {
      ru: 'Перенос данных...',
      en: 'Migrating data...',
      uk: 'Перенесення даних...'
    },
    migrate_success: {
      ru: 'Данные успешно перенесены!',
      en: 'Data migrated successfully!',
      uk: 'Дані успішно перенесено!'
    },
    migrate_success_detail: {
      ru: 'Закладки: {bookmarks}, Таймкоды: {timecodes}, Хранилище: {storage}',
      en: 'Bookmarks: {bookmarks}, Timecodes: {timecodes}, Storage: {storage}',
      uk: 'Закладки: {bookmarks}, Таймкоди: {timecodes}, Сховище: {storage}'
    },
    migrate_fail: {
      ru: 'Не удалось перенести данные',
      en: 'Migration failed',
      uk: 'Не вдалося перенести дані'
    },
    migrate_no_data: {
      ru: 'Старые данные не найдены',
      en: 'No old data found',
      uk: 'Старі дані не знайдено'
    },
    migrate_already: {
      ru: 'Данные уже были перенесены ранее',
      en: 'Data was already migrated',
      uk: 'Дані вже було перенесено раніше'
    },
    migrate_yes: {
      ru: 'Да',
      en: 'Yes',
      uk: 'Так'
    },
    migrate_no: {
      ru: 'Нет',
      en: 'No',
      uk: 'Ні'
    },
    migrate_enter_uid: {
      ru: 'Старый UID (lampac_unic_id)',
      en: 'Old UID (lampac_unic_id)',
      uk: 'Старий UID (lampac_unic_id)'
    },
    migrate_enter_uid_hint: {
      ru: 'lampac_unic_id со старого клиента (6-16 символов)',
      en: 'lampac_unic_id from old client (6-16 chars)',
      uk: 'lampac_unic_id зі старого клієнта (6-16 символів)'
    },
    migrate_checking: {
      ru: 'Проверка...',
      en: 'Checking...',
      uk: 'Перевірка...'
    }
  });

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()\[\]\\\/+^])/g, '\\$1') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : '';
  }

  function hasTGAuth() {
    return getCookie('lampac_token') !== '';
  }

  function getOldUID() {
    return Lampa.Storage.get('lampac_unic_id', '');
  }

  function getProfileID() {
    return Lampa.Storage.get('lampac_profile_id', '');
  }

  function apiUrl(path) {
    return host + path;
  }

  function goBack() {
    Lampa.Controller.toggle(returnController);
  }

  function jsonPost(url, body, onSuccess, onError) {
    $.ajax({
      url: url,
      type: 'POST',
      data: JSON.stringify(body),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      timeout: 60000,
      success: function(resp) {
        if (onSuccess) onSuccess(resp);
      },
      error: function(xhr) {
        var msg = '';
        try { msg = JSON.parse(xhr.responseText).error || ''; } catch(e) {}
        if (onError) onError(msg || 'network_error');
      }
    });
  }

  function jsonGet(url, onSuccess, onError) {
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      timeout: 30000,
      success: function(resp) {
        if (onSuccess) onSuccess(resp);
      },
      error: function() {
        if (onError) onError('network_error');
      }
    });
  }

  function boolLabel(val) {
    return val ? Lampa.Lang.translate('migrate_yes') : Lampa.Lang.translate('migrate_no');
  }

  function showResult(resp) {
    if (resp.success) {
      var detail = Lampa.Lang.translate('migrate_success_detail')
        .replace('{bookmarks}', boolLabel(resp.bookmarks))
        .replace('{timecodes}', boolLabel(resp.timecodes))
        .replace('{storage}', boolLabel(resp.storage));

      Lampa.Noty.show(Lampa.Lang.translate('migrate_success') + ' ' + detail);
      localStorage.setItem('lampac_migrate_done', '1');

      // Reload bookmarks from server
      Lampa.Listener.send('lampac', {name: 'bookmark_pullFromServer'});
    } else {
      var errKey = resp.error === 'already_migrated' ? 'migrate_already'
                 : resp.error === 'no_old_data' ? 'migrate_no_data'
                 : 'migrate_fail';
      Lampa.Noty.show(Lampa.Lang.translate(errKey));
    }
  }

  // -------------------------------------------------------------------------
  // Migration flows
  // -------------------------------------------------------------------------

  function doLocalMigrate(oldUID) {
    Lampa.Noty.show(Lampa.Lang.translate('migrate_progress'));

    jsonPost(apiUrl('/migrate/from-uid'), {
      old_uid: oldUID,
      profile_id: getProfileID()
    }, function(resp) {
      showResult(resp);
      goBack();
    }, function(err) {
      Lampa.Noty.show(Lampa.Lang.translate('migrate_fail') + ': ' + err);
      goBack();
    });
  }

  function doRemoteMigrate(oldServer, oldUID) {
    Lampa.Noty.show(Lampa.Lang.translate('migrate_progress'));

    jsonPost(apiUrl('/migrate/from-server'), {
      old_server: oldServer,
      old_uid: oldUID,
      profile_id: getProfileID()
    }, function(resp) {
      showResult(resp);
      goBack();
    }, function(err) {
      Lampa.Noty.show(Lampa.Lang.translate('migrate_fail') + ': ' + err);
      goBack();
    });
  }

  // -------------------------------------------------------------------------
  // UI: ask for old UID (if not in localStorage)
  // -------------------------------------------------------------------------

  function promptOldUID(callback) {
    var uid = getOldUID();
    if (uid) {
      callback(uid);
      return;
    }

    Lampa.Input.edit({
      title: Lampa.Lang.translate('migrate_enter_uid'),
      value: '',
      free: true,
      nosave: true
    }, function(newVal) {
      var val = (newVal || '').replace(/\s/g, '').toLowerCase();
      if (/^[a-z0-9]{6,16}$/.test(val)) {
        callback(val);
      } else {
        Lampa.Noty.show(Lampa.Lang.translate('migrate_enter_uid_hint'));
        goBack();
      }
    });
  }

  // -------------------------------------------------------------------------
  // UI: remote server input → then ask for UID
  // -------------------------------------------------------------------------

  function promptRemoteServer(oldUID) {
    Lampa.Input.edit({
      title: Lampa.Lang.translate('migrate_enter_server'),
      value: 'http://',
      free: true,
      nosave: true
    }, function(serverUrl) {
      serverUrl = (serverUrl || '').replace(/\s/g, '');
      if (!serverUrl || serverUrl === 'http://' || serverUrl === 'https://') {
        Lampa.Noty.show(Lampa.Lang.translate('migrate_enter_hint'));
        goBack();
        return;
      }

      Lampa.Noty.show(Lampa.Lang.translate('migrate_checking'));

      jsonGet(apiUrl('/migrate/check?old_uid=' + encodeURIComponent(oldUID) + '&old_server=' + encodeURIComponent(serverUrl)), function(resp) {
        if (resp.available) {
          doRemoteMigrate(serverUrl, oldUID);
        } else {
          var reason = resp.reason === 'already_migrated' ? 'migrate_already' : 'migrate_no_data';
          Lampa.Noty.show(Lampa.Lang.translate(reason));
          goBack();
        }
      }, function() {
        Lampa.Noty.show(Lampa.Lang.translate('migrate_fail'));
        goBack();
      });
    });
  }

  // -------------------------------------------------------------------------
  // Main dialog
  // -------------------------------------------------------------------------

  function showMigrateDialog(localAvailable, oldUID) {
    var items = [];

    if (localAvailable) {
      items.push({
        title: Lampa.Lang.translate('migrate_local'),
        migrate_local: true
      });
    }

    items.push({
      title: Lampa.Lang.translate('migrate_remote'),
      migrate_remote: true
    });

    items.push({
      title: Lampa.Lang.translate('migrate_skip'),
      migrate_skip: true
    });

    Lampa.Select.show({
      title: Lampa.Lang.translate('migrate_found'),
      items: items,
      onSelect: function(item) {
        if (item.migrate_local) {
          doLocalMigrate(oldUID);
        } else if (item.migrate_remote) {
          promptRemoteServer(oldUID);
        } else if (item.migrate_skip) {
          localStorage.setItem('lampac_migrate_skip', '1');
          goBack();
        }
      },
      onBack: function() {
        localStorage.setItem('lampac_migrate_skip', '1');
        goBack();
      }
    });
  }

  // -------------------------------------------------------------------------
  // Settings button for manual migration
  // -------------------------------------------------------------------------

  function addSettingsButton() {
    Lampa.SettingsApi.addParam({
      component: 'backup',
      param: {
        type: 'button'
      },
      field: {
        name: Lampa.Lang.translate('migrate_title')
      },
      onChange: function() {
        if (!hasTGAuth()) {
          Lampa.Noty.show('Telegram auth required');
          return;
        }

        // Remember we came from settings
        returnController = 'settings_component';

        promptOldUID(function(uid) {
          Lampa.Noty.show(Lampa.Lang.translate('migrate_checking'));

          jsonGet(apiUrl('/migrate/check?old_uid=' + encodeURIComponent(uid)), function(resp) {
            if (resp.available) {
              showMigrateDialog(resp.mode === 'local', uid);
            } else {
              // Still offer remote option
              showMigrateDialog(false, uid);
            }
          }, function() {
            // Can't check local — offer remote only
            showMigrateDialog(false, uid);
          });
        });
        // NO Controller.toggle here — let the dialogs manage it
      }
    });
  }

  // -------------------------------------------------------------------------
  // Auto-check on startup
  // -------------------------------------------------------------------------

  function autoCheck() {
    // Don't auto-check if already done/skipped
    if (localStorage.getItem('lampac_migrate_done') === '1') return;
    if (localStorage.getItem('lampac_migrate_skip') === '1') return;

    // Need TG auth
    if (!hasTGAuth()) return;

    // Need old UID in localStorage
    var oldUID = getOldUID();
    if (!oldUID) return;

    // Check if old data exists
    jsonGet(apiUrl('/migrate/check?old_uid=' + encodeURIComponent(oldUID)), function(resp) {
      if (resp.available) {
        returnController = 'content';
        setTimeout(function() {
          showMigrateDialog(resp.mode === 'local', oldUID);
        }, 2000);
      }
    }, function() {
      // Silently ignore errors on auto-check
    });
  }

  // -------------------------------------------------------------------------
  // Init
  // -------------------------------------------------------------------------

  function startPlugin() {
    addSettingsButton();

    if (window.appready) {
      autoCheck();
    } else {
      Lampa.Listener.follow('app', function(e) {
        if (e.type === 'ready') {
          setTimeout(autoCheck, 3000);
        }
      });
    }
  }

  if (window.appready) {
    startPlugin();
  } else {
    Lampa.Listener.follow('app', function(e) {
      if (e.type === 'ready') startPlugin();
    });
  }

})();
