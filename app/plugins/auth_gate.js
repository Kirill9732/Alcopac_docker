// auth_gate.js — fullscreen auth overlay at app startup for all platforms.
// Inlined into lampainit.js start() — runs after app:ready.

(function authGateRun() {
  // Comprehensive device fingerprint (FNV-1a of hardware + canvas + WebGL + audio).
  function quickFP() {
    try {
      var fp = [];
      fp.push(screen.width+'x'+screen.height+':'+screen.availWidth+'x'+screen.availHeight);
      fp.push(screen.colorDepth||0); fp.push(window.devicePixelRatio||1);
      fp.push(navigator.hardwareConcurrency||0); fp.push(navigator.deviceMemory||0);
      fp.push(navigator.maxTouchPoints||0); fp.push(navigator.platform||'');
      fp.push(navigator.language||''); fp.push(Math.tan(-1e300));
      try { fp.push(Intl.DateTimeFormat().resolvedOptions().timeZone||''); } catch(e){ fp.push(''); }
      try {
        var c = document.createElement('canvas'); c.width=200; c.height=50;
        var ctx = c.getContext('2d'); ctx.textBaseline='top'; ctx.font='14px Arial';
        ctx.fillStyle='#f60'; ctx.fillRect(125,1,62,20);
        ctx.fillStyle='#069'; ctx.fillText('Lampa,fp!',2,15);
        ctx.fillStyle='rgba(102,204,0,0.7)'; ctx.fillText('Lampa,fp!',4,17);
        fp.push(c.toDataURL().slice(-50));
      } catch(e){ fp.push('nc'); }
      try {
        var gl = document.createElement('canvas').getContext('webgl');
        if(gl){ var dbg=gl.getExtension('WEBGL_debug_renderer_info'); fp.push(dbg?gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL):'nr'); fp.push(gl.getParameter(gl.MAX_TEXTURE_SIZE)); }
        else fp.push('ng');
      } catch(e){ fp.push('ng'); }
      try { var ac=new(window.AudioContext||window.webkitAudioContext)(); fp.push(ac.sampleRate); fp.push(ac.destination.maxChannelCount); ac.close(); } catch(e){ fp.push('na'); }
      var h = 0x811c9dc5; var s = fp.join('|||');
      for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
      return (h >>> 0).toString(16);
    } catch(e) { return ''; }
  }
  var fp = quickFP();

  var uid = Lampa.Storage.get('lampac_unic_id', '');
  if (!uid) {
    // Try localStorage backup (Samsung/Tizen resilience)
    try {
      var backup = localStorage.getItem('lampac_uid_backup');
      if (backup) uid = backup;
    } catch(e){}
  }
  if (!uid) {
    uid = Lampa.Utils.uid(8).toLowerCase();
  }
  // Store in all locations for stability
  Lampa.Storage.set('lampac_unic_id', uid);
  try { localStorage.setItem('lampac_uid_backup', uid); } catch(e){}

  var url = '{localhost}/tg/auth/status?uid=' + encodeURIComponent(uid);
  if (fp) url += '&fp=' + encodeURIComponent(fp);

  var token = '';
  try {
    var m = document.cookie.match(/(?:^|;\s*)lampac_token=([^;]*)/);
    if (m) token = decodeURIComponent(m[1]);
  } catch(e) {}
  if (token) url += '&token=' + encodeURIComponent(token);

  // Full-screen overlay — covers everything, Lampa can't remove it.
  var overlay = document.createElement('div');
  overlay.id = 'auth-gate-overlay';
  overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:#1a1a1a; z-index:999999; display:flex; align-items:center; justify-content:center; font-family:sans-serif; color:#aaa;';
  overlay.innerHTML = '<div style="font-size:2em;">Проверка авторизации...</div>';
  document.body.appendChild(overlay);

  window.sync_disable = true;
  window.start_deep_link = {
    component: 'denypages',
    page: 1,
    url: ''
  };

  var net = new Lampa.Reguest();
  net.silent(url, function(result) {
    if (result && result.authorized) {
      // Bind device fingerprint for recovery after cache clear.
      if (result.token && fp) {
        try {
          var bx = new XMLHttpRequest();
          bx.open('GET', '{localhost}/tg/auth/bind-device?token=' + encodeURIComponent(result.token) + '&uid=' + encodeURIComponent(uid) + '&fp=' + encodeURIComponent(fp), true);
          bx.send();
        } catch(e){}
      }
      // Authorized — remove overlay, restore app
      overlay.remove();
      window.sync_disable = false;
      delete window.start_deep_link;
      return;
    }

    // Not authorized — show auth screen in overlay
    var code = (result && result.code) || '';
    var bot = (result && result.bot) || '';
    var myUid = Lampa.Storage.get('lampac_unic_id', '');

    overlay.innerHTML =
      '<div style="text-align:center; padding:2em; color:#fff;">' +
        '<div style="font-size:2.5em; font-weight:bold; margin-bottom:0.5em;">Авторизация</div>' +
        '<div style="font-size:1.4em; margin-bottom:1.5em; color:#ccc;">Отправьте этот код боту <b style="color:#fff;">' + bot + '</b></div>' +
        '<div style="font-size:4em; font-weight:bold; letter-spacing:0.15em; color:#4CAF50; margin-bottom:0.3em;">' + code + '</div>' +
        '<div style="font-size:0.9em; color:#666; margin-bottom:2em;">unic_id: ' + myUid + '</div>' +
        '<div id="auth-gate-status" style="font-size:1.1em; color:#888;">Ожидание авторизации...</div>' +
        '<div id="auth-gate-pass-btn" style="margin-top:2em; padding:0.7em 2em; background:#333; border-radius:8px; cursor:pointer; display:inline-block; font-size:1.1em; color:#fff;">Вход по паролю</div>' +
        '<div style="margin-top:2em; font-size:1em; color:#666; line-height:1.4;">Инструкция<br>{localhost}/e/acb</div>' +
      '</div>';

    // Password button
    var passBtn = document.getElementById('auth-gate-pass-btn');
    if (passBtn) {
      passBtn.onclick = function() {
        stopPolling();
        // Use Lampa's Input for keyboard/remote compatibility
        Lampa.Input.edit({
          free: true,
          title: 'Введите пароль',
          nosave: true,
          value: '',
          nomic: true
        }, function(val) {
          if (!val) return;

          var u = '{localhost}/testaccsdb';
          u = Lampa.Utils.addUrlComponent(u, 'account_email=' + encodeURIComponent(val));
          u = Lampa.Utils.addUrlComponent(u, 'uid=' + encodeURIComponent(myUid));

          var passNet = new Lampa.Reguest();
          passNet.silent(u, function(res) {
            if (res && res.success) {
              if (res.uid) {
                overlay.innerHTML =
                  '<div style="text-align:center; padding:2em; color:#fff;">' +
                    '<div style="font-size:2em; margin-bottom:1em;">Аккаунт зарегистрирован</div>' +
                    '<div style="font-size:1.3em; margin-bottom:1em;">Сохраните ваш персональный пароль</div>' +
                    '<div style="font-size:3em; font-weight:bold; color:red; margin-bottom:1em;">' + res.uid + '</div>' +
                    '<div style="font-size:1.1em; color:#ccc; margin-bottom:2em;">Используйте его для авторизации на других устройствах.</div>' +
                    '<div style="font-size:1.2em; color:cadetblue; font-weight:bold;">Перезагрузите страницу/приложение</div>' +
                  '</div>';
              } else {
                // Don't overwrite lampac_unic_id with password — keep existing device UID.
                localStorage.removeItem('activity');
                try { delete window.start_deep_link; } catch(e){}
                try { Lampa.Storage.set('start_deep_link', ''); } catch(e){}
                window.location.href = '/';
              }
            } else {
              var st = document.getElementById('auth-gate-status');
              if (st) { st.textContent = 'Неправильный пароль'; st.style.color = '#f44336'; }
              setTimeout(function() {
                if (st) { st.textContent = 'Ожидание авторизации...'; st.style.color = '#888'; }
              }, 3000);
            }
          }, function() {
            var st = document.getElementById('auth-gate-status');
            if (st) { st.textContent = 'Ошибка соединения'; st.style.color = '#f44336'; }
          });
        });
      };
    }

    startPolling();
  }, function() {
    // Network error — remove overlay, let user through
    overlay.remove();
    window.sync_disable = false;
    delete window.start_deep_link;
  });

  var pollTimer = null;

  function startPolling() {
    stopPolling();
    pollTimer = setInterval(function() {
      try {
        var myUid = Lampa.Storage.get('lampac_unic_id', '');
        var u = '{localhost}/tg/auth/status?uid=' + encodeURIComponent(myUid);
        var pxhr = new XMLHttpRequest();
        pxhr.open('GET', u, true);
        pxhr.onload = function() {
          if (pxhr.status === 200) {
            var r = JSON.parse(pxhr.responseText);
            if (r && r.authorized) {
              stopPolling();
              localStorage.removeItem('activity');
              try { delete window.start_deep_link; } catch(e){}
              try { Lampa.Storage.set('start_deep_link', ''); } catch(e){}
              window.location.href = '/';
            }
          }
        };
        pxhr.send();
      } catch(e) {}
    }, 3000);
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }
})();
