(function () {
  'use strict';

  var Manifest = { api_host: '{localhost}' };

  // ─── Helpers ───────────────────────────────────────────────
  function account(url) {
    var token = Lampa.Storage.get('account_token', '');
    var uid   = Lampa.Storage.get('lampac_unic_id', '');
    var sep   = url.indexOf('?') >= 0 ? '&' : '?';
    return url + sep + 'token=' + encodeURIComponent(token) + '&uid=' + encodeURIComponent(uid);
  }

  function apiUrl(path) {
    return Manifest.api_host + account(path);
  }

  function escapeHtml(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

  // ─── CSS (injected once) ───────────────────────────────────
  var cssInjected = false;
  function injectCSS() {
    if (cssInjected) return;
    cssInjected = true;
    var style = document.createElement('style');
    style.textContent = [
      '.ytfeed-tabs { display:flex; gap:0.6em; padding:1em 1.5em 0.5em; flex-shrink:0; }',
      '.ytfeed-tab { display:flex; align-items:center; gap:0.4em; padding:0.4em 1em; border-radius:1em; ',
      '  background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.6); font-size:0.9em; white-space:nowrap; cursor:pointer; transition:all 0.2s; }',
      '.ytfeed-tab.focus { background:rgba(255,255,255,0.2); color:#fff; }',
      '.ytfeed-tab.active { background:#fff; color:#000; }',
      '.ytfeed-tab.active.focus { background:#e0e0e0; color:#000; }',
      '.ytfeed-tab svg { width:1.1em; height:1.1em; flex-shrink:0; }',
      '.ytfeed-empty { padding:2em 1.5em; opacity:0.45; font-size:1.1em; }',
      // Card channel label override
      '.ytfeed-channel { font-size:0.75em; opacity:0.6; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:100%; }',
    ].join('\n');
    document.head.appendChild(style);
  }

  // ─── SVG icons ─────────────────────────────────────────────
  var ICONS = {
    home:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
    subs:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/></svg>',
    lists:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>',
  };

  // ═══════════════════════════════════════════════════════════
  //  YouTube Feed Component
  // ═══════════════════════════════════════════════════════════
  function YouTubeFeed(object) {
    var network  = new Lampa.Reguest();
    var scroll   = new Lampa.Scroll({ mask: true, over: true });
    var html     = $('<div></div>');
    var head     = $('<div class="ytfeed-tabs"></div>');
    var body     = $('<div></div>');
    var last;
    var allCards = []; // flat list of all focusable items for Controller

    var TABS = [
      { id: 'home',   title: 'Главная',   icon: ICONS.home },
      { id: 'search', title: 'Поиск',     icon: ICONS.search },
      { id: 'subs',   title: 'Подписки',  icon: ICONS.subs },
      { id: 'lists',  title: 'Плейлисты', icon: ICONS.lists },
    ];

    var activeTab   = 'home';
    var lastSearch  = '';
    var tabButtons  = {};

    // ─── CREATE ──────────────────────────────────────────────
    this.create = function () {
      injectCSS();

      TABS.forEach(function (tab) {
        var btn = $('<div class="ytfeed-tab selector">' + tab.icon + '<span>' + tab.title + '</span></div>');
        if (tab.id === activeTab) btn.addClass('active');
        tabButtons[tab.id] = btn;

        btn.on('hover:focus', function () {
          btn.addClass('focus');
        });
        btn.on('hover:hover', function () {
          btn.addClass('focus');
        });
        btn.on('hover:exit hover:blur', function () {
          btn.removeClass('focus');
        });
        btn.on('hover:enter', function () {
          switchTab(tab.id);
        });

        head.append(btn);
      });

      html.append(head);
      html.append(scroll.render());
      scroll.minus(head);
      scroll.append(body);

      // Register controllers for keyboard / remote navigation
      Lampa.Controller.add('head', {
        toggle: function () {
          Lampa.Controller.collectionSet(head);
          Lampa.Controller.collectionFocus(false, head);
        },
        left: function () {
          if (Navigator.canmove('left')) Navigator.move('left');
          else Lampa.Controller.toggle('menu');
        },
        right: function () {
          Navigator.move('right');
        },
        up: function () {},
        down: function () {
          Lampa.Controller.toggle('content');
        },
        back: function () {
          Lampa.Activity.backward();
        }
      });

      Lampa.Controller.add('content', {
        toggle: function () {
          Lampa.Controller.collectionSet(scroll.render());
          Lampa.Controller.collectionFocus(last || false, scroll.render());
        },
        left: function () {
          if (Navigator.canmove('left')) Navigator.move('left');
          else Lampa.Controller.toggle('menu');
        },
        right: function () {
          Navigator.move('right');
        },
        up: function () {
          if (Navigator.canmove('up')) Navigator.move('up');
          else Lampa.Controller.toggle('head');
        },
        down: function () {
          if (Navigator.canmove('down')) Navigator.move('down');
        },
        back: function () {
          Lampa.Activity.backward();
        }
      });

      this.activity.loader(true);
      loadHome();

      return this.render();
    };

    // ─── TAB SWITCHING ───────────────────────────────────────
    function switchTab(id) {
      if (id === activeTab && id !== 'search') return;
      activeTab = id;

      // Update tab active state
      head.find('.ytfeed-tab').removeClass('active');
      if (tabButtons[id]) tabButtons[id].addClass('active');

      if (id === 'home')   loadHome();
      if (id === 'search') openSearch();
      if (id === 'subs')   loadSubscriptions();
      if (id === 'lists')  loadPlaylists();
    }

    // ─── RESET BODY ──────────────────────────────────────────
    function resetBody() {
      body.empty();
      allCards = [];
      network.clear();
    }

    // ─── HOME TAB ────────────────────────────────────────────
    function loadHome() {
      resetBody();
      object.activity.loader(true);

      network.silent(apiUrl('/lite/youtube/feed'), function (data) {
        object.activity.loader(false);

        var categories = data.categories || [];
        if (!categories.length) {
          showEmpty('Нет данных');
          return;
        }

        categories.forEach(function (cat) {
          var results = cat.results || [];
          if (!results.length) return;
          buildRow(cat.title, results);
        });

        activateContent();
      }, function () {
        object.activity.loader(false);
        showEmpty('Ошибка загрузки');
      });
    }

    // ─── SEARCH TAB ──────────────────────────────────────────
    function openSearch() {
      Lampa.Input.edit({
        title: 'Поиск YouTube',
        value: lastSearch,
        free: true,
        nosave: true
      }, function (value) {
        Lampa.Controller.toggle('content');

        if (value && value.trim()) {
          lastSearch = value.trim();
          doSearch(lastSearch);
        }
      });
    }

    function doSearch(query) {
      resetBody();
      object.activity.loader(true);

      var path = '/lite/youtube/feed?search=' + encodeURIComponent(query);
      network.silent(apiUrl(path), function (data) {
        object.activity.loader(false);

        var categories = data.categories || [];
        var results = [];
        categories.forEach(function (cat) {
          results = results.concat(cat.results || []);
        });

        if (!results.length) {
          showEmpty('Ничего не найдено по запросу «' + query + '»');
          return;
        }

        buildGrid('Результаты: ' + query, results);
        activateContent();
      }, function () {
        object.activity.loader(false);
        showEmpty('Ошибка поиска');
      });
    }

    // ─── SUBSCRIPTIONS TAB ───────────────────────────────────
    function loadSubscriptions() {
      resetBody();
      object.activity.loader(true);

      network.silent(apiUrl('/lite/youtube/feed/subscriptions'), function (data) {
        object.activity.loader(false);

        var list = data.results || [];
        if (!list.length) {
          showEmpty(data.msg || 'Нет данных. Подключите YouTube через /youtube_auth в боте.');
          return;
        }

        buildGrid('Подписки', list);
        activateContent();
      }, function () {
        object.activity.loader(false);
        showEmpty('Ошибка загрузки подписок');
      });
    }

    // ─── PLAYLISTS TAB ───────────────────────────────────────
    function loadPlaylists() {
      resetBody();
      object.activity.loader(true);

      network.silent(apiUrl('/lite/youtube/feed/playlists'), function (data) {
        object.activity.loader(false);

        var pls = data.results || [];
        if (!pls.length) {
          showEmpty(data.msg || 'Нет плейлистов. Подключите YouTube через /youtube_auth в боте.');
          return;
        }

        buildPlaylistGrid(pls);
        activateContent();
      }, function () {
        object.activity.loader(false);
        showEmpty('Ошибка загрузки плейлистов');
      });
    }

    function loadPlaylistItems(playlistId, title) {
      resetBody();
      object.activity.loader(true);

      var path = '/lite/youtube/feed/playlist?playlist_id=' + encodeURIComponent(playlistId) + '&title=' + encodeURIComponent(title);
      network.silent(apiUrl(path), function (data) {
        object.activity.loader(false);

        var cats = data.categories || [];
        var results = [];
        cats.forEach(function (cat) {
          results = results.concat(cat.results || []);
        });

        if (!results.length) {
          showEmpty('В плейлисте нет видео');
          return;
        }

        buildGrid(title, results);
        activateContent();
      }, function () {
        object.activity.loader(false);
        showEmpty('Ошибка загрузки плейлиста');
      });
    }

    // ─── BUILD CATEGORY SECTION (title + card grid) ─────────
    function buildRow(title, rowItems) {
      buildGrid(title, rowItems);
    }

    function buildGrid(title, gridItems) {
      if (title) {
        body.append(
          $('<div class="items-line__head" style="padding-top:0.3em;">' +
              '<div class="items-line__title">' + escapeHtml(title) + '</div>' +
            '</div>')
        );
      }

      var grid = $('<div class="category-full"></div>');
      gridItems.forEach(function (item) {
        var card = makeVideoCard(item);
        grid.append(card);
        allCards.push(card);
      });

      body.append(grid);
    }

    // ─── BUILD PLAYLIST GRID ─────────────────────────────────
    function buildPlaylistGrid(playlists) {
      var grid = $('<div class="category-full"></div>');

      playlists.forEach(function (pl) {
        var card = makePlaylistCard(pl);
        grid.append(card);
        allCards.push(card);
      });

      body.append(grid);
    }

    // ─── VIDEO CARD ──────────────────────────────────────────
    function makeVideoCard(item) {
      var card = Lampa.Template.get('card', { title: item.title || '' });
      card.addClass('card--collection');

      card.find('.card__img').attr('src', item.img || item.thumbnail || '');

      // Channel name in card__age slot
      var age = card.find('.card__age');
      if (item.channel) {
        age.text(item.channel).addClass('ytfeed-channel');
      } else {
        age.remove();
      }

      // Duration badge
      if (item.duration) {
        card.find('.card__view').append(
          '<div class="card__type">' + escapeHtml(item.duration) + '</div>'
        );
      }

      card.on('hover:focus', function () {
        last = card[0];
        scroll.update(card, true);
      });

      card.on('hover:enter', function () {
        openVideo(item);
      });

      return card;
    }

    // ─── PLAYLIST CARD ───────────────────────────────────────
    function makePlaylistCard(pl) {
      var card = Lampa.Template.get('card', { title: pl.title || '' });
      card.addClass('card--collection');

      card.find('.card__img').attr('src', pl.img || pl.thumbnail || '');
      card.find('.card__age').remove();

      if (pl.item_count) {
        card.find('.card__view').append(
          '<div class="card__type">' + escapeHtml(String(pl.item_count)) + ' видео</div>'
        );
      }

      card.on('hover:focus', function () {
        last = card[0];
        scroll.update(card, true);
      });

      card.on('hover:enter', function () {
        loadPlaylistItems(pl.playlist_id || '', pl.title || '');
      });

      return card;
    }

    // ─── PLAY VIDEO ──────────────────────────────────────────
    function openVideo(item) {
      var videoID = item.video_id || '';
      if (!videoID && item.url) {
        var m = item.url.match(/videoID=([^&]+)/);
        if (m) videoID = m[1];
      }
      if (!videoID) return;

      var videoTitle = item.title || '';
      var litePath = '/lite/youtube?videoID=' + encodeURIComponent(videoID) + '&title=' + encodeURIComponent(videoTitle);
      var xhr;

      Lampa.Loading.start(function () {
        if (xhr) xhr.abort();
      });

      xhr = $.ajax({
        url: apiUrl(litePath),
        timeout: 120000,
        dataType: 'json',
        success: function (data) {
          Lampa.Loading.stop();
          if (data && data.method === 'play') {
            Lampa.Player.play(data);
          } else if (data && data.error) {
            Lampa.Noty.show(data.error);
          } else {
            Lampa.Noty.show('Не удалось получить ссылку на видео');
          }
        },
        error: function (jqXHR) {
          Lampa.Loading.stop();
          var msg = 'Ошибка загрузки видео';
          if (jqXHR && jqXHR.status === 0) msg = 'Таймаут — сервер не ответил';
          Lampa.Noty.show(msg);
        }
      });
    }

    // ─── EMPTY STATE ─────────────────────────────────────────
    function showEmpty(text) {
      body.append($('<div class="ytfeed-empty"></div>').text(text));
    }

    // ─── ACTIVATE NAVIGATION ─────────────────────────────────
    function activateContent() {
      scroll.update(body);
      if (allCards.length) {
        last = allCards[0][0];
        Lampa.Controller.enable('content');
      }
    }

    // ─── LIFECYCLE ───────────────────────────────────────────
    this.start   = function () { Lampa.Controller.toggle('content'); };
    this.pause   = function () {};
    this.stop    = function () {};
    this.render  = function () { return html; };
    this.destroy = function () {
      network.clear();
      scroll.destroy();
      body.remove();
    };
  }

  // ═══════════════════════════════════════════════════════════
  //  Registration
  // ═══════════════════════════════════════════════════════════
  Lampa.Component.add('youtube_feed', YouTubeFeed);

  // ═══════════════════════════════════════════════════════════
  //  Sidebar Menu Button
  // ═══════════════════════════════════════════════════════════
  function addMenuButton() {
    if ($('.menu__item[data-action="youtube_feed"]').length) return;

    var button = $(
      '<li class="menu__item selector" data-action="youtube_feed">' +
        '<div class="menu__ico">' +
          '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
            '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="currentColor"/>' +
          '</svg>' +
        '</div>' +
        '<div class="menu__text">YouTube</div>' +
      '</li>'
    );

    button.on('hover:enter', function () {
      Lampa.Activity.push({
        url: '',
        title: 'YouTube',
        component: 'youtube_feed',
        page: 1
      });
    });

    var settings = $('.menu .menu__list .menu__item[data-action="settings"]');
    if (settings.length) {
      settings.before(button);
    } else {
      $('.menu .menu__list').eq(0).append(button);
    }
  }

  addMenuButton();

  if (window.appready) {
    addMenuButton();
  } else {
    Lampa.Listener.follow('app', function (e) {
      if (e.type === 'ready') addMenuButton();
    });
  }
})();
