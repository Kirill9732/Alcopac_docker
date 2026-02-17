(function () {
    'use strict';

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

    Lampa.Storage.set('proxy_tmdb', true);

    Lampa.TMDB.image = function (url) {
      return '{localhost}/tmdb/img/' + account(url);
    };

    Lampa.TMDB.api = function (url) {
      return '{localhost}/tmdb/api/3/' + account(url);
    };

    Lampa.Settings.listener.follow('open', function (e) {
      if (e.name == 'tmdb') {
        e.body.find('[data-parent="proxy"]').remove();
        e.body.find('[data-name="proxy_tmdb"]').remove();
        e.body.find('[data-name="proxy_tmdb_auto"]').remove();
      }
    });

})();