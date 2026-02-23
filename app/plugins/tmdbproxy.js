(function () {
    'use strict';

    var proxyMode = '{tmdb_proxy_mode}';
    if (proxyMode === 'disabled') return;

    var proxyBase = '{tmdb_proxy_base}';

    var unic_id = Lampa.Storage.get('lampac_unic_id', '');
    if (!unic_id) {
      unic_id = Lampa.Utils.uid(8).toLowerCase();
      Lampa.Storage.set('lampac_unic_id', unic_id);
    }

    function account(url){
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

    function applyProxy() {
      Lampa.Storage.set('proxy_tmdb', true);

      Lampa.TMDB.image = function (url) {
        return proxyBase + '/tmdb/img/' + account(url);
      };

      Lampa.TMDB.api = function (url) {
        return proxyBase + '/tmdb/api/3/' + account(url);
      };
    }

    // Apply immediately
    applyProxy();

    // Re-apply after delay to override Lampa's built-in TMDBProxy.init()
    // which runs asynchronously after geo-detection and overwrites our functions
    setTimeout(applyProxy, 2000);
    setTimeout(applyProxy, 5000);

    // Also re-apply when Lampa app is fully ready
    if (Lampa.Listener) {
      Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') {
          setTimeout(applyProxy, 500);
        }
      });
    }

    Lampa.Settings.listener.follow('open', function (e) {
      if (e.name == 'tmdb') {
        e.body.find('[data-parent="proxy"]').remove();
        e.body.find('[data-name="proxy_tmdb"]').remove();
        e.body.find('[data-name="proxy_tmdb_auto"]').remove();
      }
    });

})();
