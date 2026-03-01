(function () {
  'use strict';

  var protocol = '{external_protocol}';
  if (!protocol) return;

  Lampa.Listener.follow('torrent_file', function (data) {
    if (data.type !== 'onlong') return;

    data.menu.push({
      title: 'Запустить внешний плеер',
      onSelect: function () {
        var url = data.element.url.replace('&preload', '&play');
        window.location.assign(protocol + url);
      }
    });
  });
})();
