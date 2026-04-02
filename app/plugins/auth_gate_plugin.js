// auth_gate_plugin.js — standalone Lampa plugin for auth gate.
// Loaded as a regular plugin via plugins_add — works on Android/TV/Web.
(function(){
  'use strict';

  var LS_KEY = 'lampac_unic_id';
  var ORIGIN = '{localhost}';

  var _cachedUID = '';
  function getUID(){
    if(_cachedUID) return _cachedUID;
    // 1. Try Lampa.Storage
    try {
      var v = Lampa.Storage.get(LS_KEY, '');
      if(v){ _cachedUID = v; ensureUIDStored(v); return v; }
    } catch(e){}
    // 2. Try raw localStorage (Samsung/Tizen fallback)
    try {
      var raw = localStorage.getItem(LS_KEY);
      if(raw){
        try { var parsed = JSON.parse(raw); if(typeof parsed==='string' && parsed){ _cachedUID = parsed; ensureUIDStored(parsed); return parsed; } }
        catch(e){ if(typeof raw==='string' && raw){ _cachedUID = raw; ensureUIDStored(raw); return raw; } }
      }
    } catch(e){}
    // 3. Try dedicated backup key (Samsung double-safety)
    try {
      var backup = localStorage.getItem('lampac_uid_backup');
      if(backup){ _cachedUID = backup; ensureUIDStored(backup); return backup; }
    } catch(e){}
    // 4. Generate new
    var uid = Math.random().toString(36).substr(2,8);
    _cachedUID = uid;
    ensureUIDStored(uid);
    return uid;
  }
  function ensureUIDStored(uid){
    try { Lampa.Storage.set(LS_KEY, uid); } catch(e){}
    try { localStorage.setItem(LS_KEY, JSON.stringify(uid)); } catch(e){}
    try { localStorage.setItem('lampac_uid_backup', uid); } catch(e){}
  }

  function getCookie(name){
    try {
      var m = document.cookie.match(new RegExp('(?:^|;\\s*)'+name+'=([^;]*)'));
      return m ? decodeURIComponent(m[1]) : '';
    } catch(e){ return ''; }
  }

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

  function run(){
    var uid = getUID();
    var fp = quickFP();
    var url = ORIGIN + '/tg/auth/status?uid=' + encodeURIComponent(uid);
    if(fp) url += '&fp=' + encodeURIComponent(fp);
    var token = getCookie('lampac_token');
    if(token) url += '&token=' + encodeURIComponent(token);

    // Full-screen overlay — blocks everything.
    var ov = document.createElement('div');
    ov.id = 'auth-gate-overlay';
    ov.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#1a1a1a;z-index:999999;display:flex;align-items:center;justify-content:center;font-family:sans-serif;color:#aaa;';
    ov.innerHTML = '<div style="font-size:2em;">Проверка авторизации...</div>';
    document.body.appendChild(ov);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.timeout = 8000;
    xhr.onload = function(){
      if(xhr.status === 200){
        try {
          var r = JSON.parse(xhr.responseText);
          if(r && r.authorized){
            // Bind device fingerprint for recovery.
            if(r.token && fp){
              try {
                var bx = new XMLHttpRequest();
                bx.open('GET', ORIGIN+'/tg/auth/bind-device?token='+encodeURIComponent(r.token)+'&uid='+encodeURIComponent(uid)+'&fp='+encodeURIComponent(fp), true);
                bx.send();
              } catch(e){}
            }
            ov.remove(); return;
          }
          showAuth(r.code || '', r.bot || '');
        } catch(e){ ov.remove(); }
      } else { ov.remove(); }
    };
    xhr.onerror = function(){ ov.remove(); };
    xhr.ontimeout = function(){ ov.remove(); };
    xhr.send();
  }

  function showAuth(code, bot){
    var uid = getUID();
    var ov = document.getElementById('auth-gate-overlay');
    if(!ov) return;

    ov.innerHTML =
      '<div style="text-align:center;padding:2em;color:#fff;">' +
        '<div style="font-size:2.5em;font-weight:bold;margin-bottom:0.5em;">Авторизация</div>' +
        '<div style="font-size:1.4em;margin-bottom:1.5em;color:#ccc;">Отправьте этот код боту <b style="color:#fff;">' + bot + '</b></div>' +
        '<div style="font-size:4em;font-weight:bold;letter-spacing:0.15em;color:#4CAF50;margin-bottom:0.3em;">' + code + '</div>' +
        '<div style="font-size:0.9em;color:#666;margin-bottom:2em;">ID: ' + uid + '</div>' +
        '<div id="ag-status" style="font-size:1.1em;color:#888;">Ожидание авторизации...</div>' +
        '<div id="ag-pass" style="margin-top:2em;padding:0.7em 2em;background:#333;border-radius:8px;cursor:pointer;display:inline-block;font-size:1.1em;color:#fff;">Вход по паролю</div>' +
      '</div>';

    // Password fallback
    var passBtn = document.getElementById('ag-pass');
    if(passBtn){
      passBtn.addEventListener('click', function(){
        Lampa.Input.edit({
          free: true,
          title: 'Введите пароль',
          nosave: true,
          value: '',
          nomic: true
        }, function(val){
          if(!val) return;
          var pu = ORIGIN + '/testaccsdb?account_email=' + encodeURIComponent(val) + '&uid=' + encodeURIComponent(uid);
          var px = new XMLHttpRequest();
          px.open('GET', pu, true);
          px.onload = function(){
            try {
              var res = JSON.parse(px.responseText);
              if(res && res.success){
                if(res.uid){
                  ov.innerHTML =
                    '<div style="text-align:center;padding:2em;color:#fff;">' +
                      '<div style="font-size:2em;margin-bottom:1em;">Аккаунт зарегистрирован</div>' +
                      '<div style="font-size:3em;font-weight:bold;color:red;margin-bottom:1em;">' + res.uid + '</div>' +
                      '<div style="color:#ccc;">Сохраните пароль. Перезагрузите приложение.</div>' +
                    '</div>';
                } else {
                  // Don't overwrite lampac_unic_id with password — keep existing device UID.
                  try { localStorage.removeItem('activity'); } catch(e){}
                  try { delete window.start_deep_link; } catch(e){}
                  try { Lampa.Storage.set('start_deep_link', ''); } catch(e){}
                  window.location.reload();
                }
              } else {
                var st = document.getElementById('ag-status');
                if(st){ st.textContent = 'Неправильный пароль'; st.style.color = '#f44336'; }
                setTimeout(function(){ if(st){ st.textContent = 'Ожидание авторизации...'; st.style.color = '#888'; } }, 3000);
              }
            } catch(e){}
          };
          px.send();
        });
      });
    }

    // Poll every 3s for TG auth
    setInterval(function(){
      try {
        var myUid = getUID();
        var pu2 = ORIGIN + '/tg/auth/status?uid=' + encodeURIComponent(myUid);
        var px2 = new XMLHttpRequest();
        px2.open('GET', pu2, true);
        px2.onload = function(){
          if(px2.status === 200){
            try {
              var r2 = JSON.parse(px2.responseText);
              if(r2 && r2.authorized){
                try { localStorage.removeItem('activity'); } catch(e){}
                try { delete window.start_deep_link; } catch(e){}
                try { Lampa.Storage.set('start_deep_link', ''); } catch(e){}
                window.location.reload();
              }
            } catch(e){}
          }
        };
        px2.send();
      } catch(e){}
    }, 3000);
  }

  // Run immediately when script loads — don't wait for app:ready
  // because plugin scripts load AFTER app:ready.
  if(document.body){
    run();
  } else {
    document.addEventListener('DOMContentLoaded', run);
  }
})();
