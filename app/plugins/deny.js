var network = new Lampa.Reguest();
var api = Lampa.Utils.protocol() + Lampa.Manifest.cub_domain + '/api/';

// Comprehensive device fingerprint (FNV-1a of hardware + canvas + WebGL + audio signals).
// Survives cache clear / app reinstall — based on hardware, not storage.
function quickFP() {
  try {
    var fp = [];
    // 1. Screen
    fp.push(screen.width+'x'+screen.height+':'+screen.availWidth+'x'+screen.availHeight);
    fp.push(screen.colorDepth||0);
    fp.push(window.devicePixelRatio||1);
    // 2. Hardware
    fp.push(navigator.hardwareConcurrency||0);
    fp.push(navigator.deviceMemory||0);
    fp.push(navigator.maxTouchPoints||0);
    // 3. Platform/locale
    fp.push(navigator.platform||'');
    fp.push(navigator.language||'');
    try { fp.push(Intl.DateTimeFormat().resolvedOptions().timeZone||''); } catch(e){ fp.push(''); }
    // 4. Math quirk
    fp.push(Math.tan(-1e300));
    // 5. Canvas fingerprint
    try {
      var c = document.createElement('canvas'); c.width=200; c.height=50;
      var ctx = c.getContext('2d');
      ctx.textBaseline='top'; ctx.font='14px Arial';
      ctx.fillStyle='#f60'; ctx.fillRect(125,1,62,20);
      ctx.fillStyle='#069'; ctx.fillText('Lampa,fp!',2,15);
      ctx.fillStyle='rgba(102,204,0,0.7)'; ctx.fillText('Lampa,fp!',4,17);
      fp.push(c.toDataURL().slice(-50));
    } catch(e){ fp.push('nc'); }
    // 6. WebGL
    try {
      var gl = document.createElement('canvas').getContext('webgl');
      if(gl){
        var dbg = gl.getExtension('WEBGL_debug_renderer_info');
        fp.push(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'nr');
        fp.push(gl.getParameter(gl.MAX_TEXTURE_SIZE));
      } else fp.push('ng');
    } catch(e){ fp.push('ng'); }
    // 7. Audio
    try {
      var ac = new (window.AudioContext||window.webkitAudioContext)();
      fp.push(ac.sampleRate); fp.push(ac.destination.maxChannelCount);
      ac.close();
    } catch(e){ fp.push('na'); }
    // Hash
    var h = 0x811c9dc5;
    var s = fp.join('|||');
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
    return (h >>> 0).toString(16);
  } catch(e) { return ''; }
}
var deny_fp = quickFP();

// Stabilize UID across restarts (Samsung/Tizen fix).
(function() {
  var uid = Lampa.Storage.get('lampac_unic_id', '');
  if (!uid) {
    try { var backup = localStorage.getItem('lampac_uid_backup'); if (backup) uid = backup; } catch(e){}
  }
  if (!uid) {
    uid = Lampa.Utils.uid(8).toLowerCase();
  }
  Lampa.Storage.set('lampac_unic_id', uid);
  try { localStorage.setItem('lampac_uid_backup', uid); } catch(e){}
})();

// Bind device fingerprint after successful auth.
function denyBindDevice(token) {
  if (!token || !deny_fp) return;
  try {
    var uid = Lampa.Storage.get('lampac_unic_id', '');
    var bx = new XMLHttpRequest();
    bx.open('GET', '{localhost}/tg/auth/bind-device?token=' + encodeURIComponent(token) + '&uid=' + encodeURIComponent(uid) + '&fp=' + encodeURIComponent(deny_fp), true);
    bx.send();
  } catch(e){}
}

function addDevice(message) {
  var enter_cub = false;

  var displayModal = function displayModal() {
    var html = Lampa.Template.get('account_add_device');

    if (!enter_cub) {

      if (message) {
        html.find('.about').html(message + '<br><br>unic_id: ' + Lampa.Storage.get('lampac_unic_id', ''));
      } else {
        html.find('.about').html('{cubMesage}');
      }

      html.find('.simple-button').remove();
      html.find('.account-add-device__qr').remove();

      var foot = $('<div class="modal__footer"></div>');
      var button_cub = $('<div class="simple-button selector" style="margin: 0.5em;">Аккаунт в CUB</div>');
      var button_cod = $('<div class="simple-button selector" style="margin: 0.5em;">Вход по паролю</div>');

      foot.append(button_cod);
      foot.append(button_cub);

      html.append($('<div>Либо используйте пароль/аккаунт для авторизации</div>'));
      html.append(foot);
	  
	  html.append('<div style="margin-top: 3em; font-size: 1.4em; line-height: 1.3; font-weight: 300;">Инструкция<br>{localhost}/e/acb</div>');
	  
      button_cub.on('hover:enter', function() {
        enter_cub = true;
        Lampa.Modal.close();
        displayModal();
      });

      button_cod.on('hover:enter', function() {
        Lampa.Modal.close();
        Lampa.Input.edit({
          free: true,
          title: Lampa.Lang.translate('Введите пароль'),
          nosave: true,
          value: '',
          //layout: 'nums',
          nomic: true
        }, function(new_value) {
          displayModal();

          var code = new_value;

          if (new_value) {
            Lampa.Loading.start(function() {
              network.clear();
              Lampa.Loading.stop();
            });
            network.clear();

            var u = '{localhost}/testaccsdb';
            u = Lampa.Utils.addUrlComponent(u, 'account_email=' + encodeURIComponent(code));
			
            var uid = Lampa.Storage.get('lampac_unic_id', '');
            if (uid) u = Lampa.Utils.addUrlComponent(u, 'uid=' + encodeURIComponent(uid));

            network.silent(u, function(result) {
              Lampa.Loading.stop();
              if (result.success) {
                if (result.uid) {
                  Lampa.Modal.close();
                  const loadingElement = document.getElementById("loading-element");
                  if (loadingElement) {
                    loadingElement.textContent = "Аккаунт зарегистрирован";
                    loadingElement.style.color = "antiquewhite";
                  }
                  var pwait = document.createElement("div");
					  pwait.style.fontSize = "xx-large";
					  pwait.style.marginTop = "2em";
					  pwait.style.padding = "2em";
					  pwait.innerHTML = 'Сохраните ваш персональный пароль <span style="color: red;">'+result.uid+'</span> для будущих авторизаций на текущем устройстве, а так же для авторизации на других устройствах, все ваши закладки и синхронизация между устройствами происходит через персональный пароль <span style="color: red;">'+result.uid+'</span><br><br><br><br>После сохранения пароля в надежном месте <b style="color: cadetblue;">перезагрузите страницу/приложение</b>';
                  document.body.appendChild(pwait);
                } else {
                  // Don't overwrite lampac_unic_id with password — keep existing device UID.
                  localStorage.removeItem('activity');
                  try { delete window.start_deep_link; } catch(e){}
                  try { Lampa.Storage.set('start_deep_link', ''); } catch(e){}
                  window.location.href = '/';
                }
              } else {
                Lampa.Noty.show(Lampa.Lang.translate('Неправильный пароль'));
              }
            }, function() {
              Lampa.Loading.stop();
              Lampa.Noty.show(Lampa.Lang.translate('account_code_error'));
            }, {
              code: code
            });
          } else {
            Lampa.Noty.show(Lampa.Lang.translate('account_code_wrong'));
          }
        });
      });

    } else {
      html.find('.simple-button').on('hover:enter', function() {
        Lampa.Modal.close();
        Lampa.Input.edit({
          free: true,
          title: Lampa.Lang.translate('account_code_enter'),
          nosave: true,
          value: '',
          layout: 'nums',
          nomic: true
        }, function(new_value) {
          displayModal();

          var code = parseInt(new_value);

          if (new_value && new_value.length == 6 && !isNaN(code)) {
            Lampa.Loading.start(function() {
              network.clear();
              Lampa.Loading.stop();
            });
            network.clear();
            network.silent(api + 'device/add', function(result) {
              Lampa.Loading.stop();
              Lampa.Storage.set('account', result, true);
              Lampa.Storage.set('account_email', result.email, true);
              localStorage.removeItem('activity');
              try { delete window.start_deep_link; } catch(e){}
              try { Lampa.Storage.set('start_deep_link', ''); } catch(e){}
              window.location.href = '/';
            }, function() {
              Lampa.Loading.stop();
              Lampa.Noty.show(Lampa.Lang.translate('account_code_error'));
            }, {
              code: code
            });
          } else {
            Lampa.Noty.show(Lampa.Lang.translate('account_code_wrong'));
          }
        });
      });
    }


    Lampa.Modal.open({
      title: '',
      html: html,
      size: 'full',
      onBack: function onBack() {
        Lampa.Modal.close();
        displayModal();
      }
    });
  };
  displayModal();
}

function checkAutch() {
  var url = '{localhost}/testaccsdb';

  var email = Lampa.Storage.get('account_email');
  if (email) url = Lampa.Utils.addUrlComponent(url, 'account_email=' + encodeURIComponent(email));

  var uid = Lampa.Storage.get('lampac_unic_id', '');
  if (uid) url = Lampa.Utils.addUrlComponent(url, 'uid=' + encodeURIComponent(uid));

  var token = '{token}';
  if (token) url = Lampa.Utils.addUrlComponent(url, 'token={token}');

  network.silent(url, function(res) {
    if (!res.accsdb) {
      // Already authorized — bind device fingerprint if possible.
      var tok = '';
      try { var m = document.cookie.match(/(?:^|;\s*)lampac_token=([^;]*)/); if (m) tok = decodeURIComponent(m[1]); } catch(e){}
      if (tok) denyBindDevice(tok);
    }
    if (res.accsdb) {

      // Web browser users → redirect to /tg/auth (custom styled page)
      // TV/Android apps → show built-in denypages component
      var isApp = typeof AndroidJS !== 'undefined' || typeof webOS !== 'undefined' || typeof tizen !== 'undefined' || navigator.userAgent.indexOf('Tizen') >= 0 || navigator.userAgent.indexOf('Web0S') >= 0;
      if (!isApp && !res.denymsg) {
        window.location.href = '/tg/auth';
        return;
      }

      window.start_deep_link = {
        component: 'denypages',
        page: 1,
        url: ''
      };

      if (res.newuid) {
        unic_id = Lampa.Utils.uid(8).toLowerCase();
        Lampa.Storage.set('lampac_unic_id', unic_id);
      }

      window.sync_disable = true;
      document.getElementById("app").style.display = "none";
      var pwait = document.createElement("div");
		  pwait.id = "loading-element";
		  pwait.style.fontSize = "xxx-large";
		  pwait.style.textAlign = "center";
		  pwait.style.marginTop = "2em";
		  pwait.innerHTML = res.denymsg || "please wait";
		  document.body.appendChild(pwait);

      if (!res.denymsg) {
        setTimeout(function() {
          addDevice(res.msg);
        }, 5000);
      }
    } else {
      network.clear();
      network = null;
    }
  }, function() {
    //setTimeout(checkAutch, 1000 * 3);
  });
}

checkAutch();