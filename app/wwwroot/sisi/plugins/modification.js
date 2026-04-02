(function () {
    'use strict';

    var network = new Lampa.Reguest();
    function sourceTitle(title) {
      return Lampa.Utils.capitalizeFirstLetter(title.split('.')[0]);
    }
    function play(element) {
      var controller_enabled = Lampa.Controller.enabled().name;
      console.log(controller_enabled);
      if (element.json) {
        Lampa.Loading.start(function () {
          network.clear();
          Lampa.Loading.stop();
        });
		
        network["native"](Api$1.account(element.video + '&json=true'), function (ql) 
		{
          var qualitys = ql.qualitys ? ql.qualitys : ql;
		  
          Lampa.Loading.stop();
          for (var i in qualitys) {
            qualitys[i] = Api$1.account(qualitys[i]);
          }
          var video = {
            title: element.name,
            url: Api$1.account(qualitys[Lampa.Arrays.getKeys(qualitys)[0]]),
            quality: qualitys
          };
          Lampa.Player.play(video);
          Lampa.Player.playlist([video]);
          Lampa.Player.callback(function () {
            Lampa.Controller.toggle(controller_enabled);
          });
        }, function () {
          Lampa.Noty.show(Lampa.Lang.translate('torrent_parser_nofiles'));
        });
      } 
	  else 
	  {
        var qualitys = element.qualitys ? (element.qualitys.qualitys ? element.qualitys.qualitys : element.qualitys) : null;
		  
        if (qualitys) 
		{
          for (var i in qualitys) {
            qualitys[i] = Api$1.account(qualitys[i]);
          }
        }
        var video = {
          title: element.name,
          url: Api$1.account(element.video),
          quality: qualitys
        };
        Lampa.Player.play(video);
        Lampa.Player.playlist([video]);
        Lampa.Player.callback(function () {
          Lampa.Controller.toggle(controller_enabled);
        });
      }
    }
    function fixCards(json) {
      json.forEach(function (m) {
        m.background_image = m.picture;
        m.poster = m.picture;
        m.img = m.picture;
        m.name = Lampa.Utils.capitalizeFirstLetter(m.name).replace(/\&(.*?);/g, '');
      });
    }
    var Utils = {
      sourceTitle: sourceTitle,
      play: play,
      fixCards: fixCards
    };

    var api_url = '{localhost}';
    var menu;
    function Api() {
      var network = new Lampa.Reguest();
      this.menu = function (success, error) {
        if (menu) return success(menu);
        network.silent(this.account(api_url), function (data) {
          menu = data.channels;
          success(menu);
        }, error);
      };
      this.view = function (params, success, error) {
        var u = Lampa.Utils.addUrlComponent(params.url, 'pg=' + (params.page || 1));
        network.silent(this.account(u), function (data) {
          if (data.list) {
            Utils.fixCards(data.list);
            success(data);
          } else {
            error();
          }
        }, error);
      };
      this.account = function (u) {
        var unic_id = Lampa.Storage.get('sisi_uid', 'none');
        if (u.indexOf('box_mac=') == -1) u = Lampa.Utils.addUrlComponent(u, 'box_mac=' + unic_id);else u = u.replace(/box_mac=[^&]+/, 'box_mac=' + unic_id);
        return u;
      };
      this.main = function (params, oncomplite, error) {
        var _this = this;
        var catParam = params.category || '';
        var load = function load() {
          var status = new Lampa.Status(menu.length);
          status.onComplite = function (data) {
            var items = [];
            menu.forEach(function (m) {
              if (data[m.playlist_url] && data[m.playlist_url].results.length) items.push(data[m.playlist_url]);
            });
            if (items.length) oncomplite(items);else error();
          };
          menu.forEach(function (m) {
            var url = m.playlist_url;
            if (catParam) url += (url.indexOf('?') >= 0 ? '&' : '?') + 'cat=' + encodeURIComponent(catParam);
            var emptyResult = { title: Utils.sourceTitle(m.title), results: [], url: m.playlist_url };
            network.silent(_this.account(url), function (json) {
              if (json.list) {
                json.title = Utils.sourceTitle(m.title);
                json.results = json.list;
                json.url = m.playlist_url;
                if (json.results) Utils.fixCards(json.results);
                delete json.list;
                status.append(m.playlist_url, json);
              } else {
                if (catParam) status.append(m.playlist_url, emptyResult);
                else status.error();
              }
            }, function () {
              if (catParam) status.append(m.playlist_url, emptyResult);
              else status.error();
            });
          });
        };
        if (menu) load();else {
          this.menu(load, error);
        }
      };
      this.categories = function (oncomplite) {
        if (Api._cachedCategories) return oncomplite(Api._cachedCategories);
        network.silent(host + '/sisi/categories', function (data) {
          Api._cachedCategories = data;
          oncomplite(data);
        }, function () { oncomplite([]); });
      };
      this.search = function (params, oncomplite) {
        var _this2 = this;
        var status = new Lampa.Status(menu.length);
        status.onComplite = function (data) {
          var items = [];
          menu.forEach(function (m) {
            if (data[m.playlist_url] && data[m.playlist_url].results.length) items.push(data[m.playlist_url]);
          });
          oncomplite(items);
        };
        menu.forEach(function (m) {
          network.silent(_this2.account(m.playlist_url + '?search=' + encodeURIComponent(params.query)), function (json) {
            if (json.list) {
              json.title = Utils.sourceTitle(m.title);
              json.results = json.list;
              json.url = m.playlist_url;
              if (json.results) Utils.fixCards(json.results);
              delete json.list;
              status.append(m.playlist_url, json);
            } else {
              status.error();
            }
          }, status.error.bind(status));
        });
      };
      this.clear = function () {
        network.clear();
      };
    }
    var Api$1 = new Api();

    function Start(object) {
      var scroll = new Lampa.Scroll({
        mask: true,
        over: true,
        scroll_by_item: true,
        end_ratio: 1.5
      });
      var items = [];
      var html = document.createElement('div');
      var active = 0;
      var selectedCategory = object.category || '';
      this.create = function () {
        this.activity.loader(true);
        Api$1.main(object, this.build.bind(this), this.empty.bind(this));
      };
      this.filter = function () {
        var _self = this;
        Api$1.categories(function (cats) {
          if (!cats || !cats.length) return;
          var filterItems = [{ title: 'Все', key: '' }].concat(cats.map(function (c) {
            return { title: c.title, key: c.key, selected: c.key === selectedCategory };
          }));
          Lampa.Select.show({
            title: 'Категория',
            items: filterItems,
            onBack: function () { Lampa.Controller.toggle('content'); },
            onSelect: function (a) {
              Lampa.Activity.push({
                url: '',
                title: a.title === 'Все' ? '' : a.title,
                component: 'start',
                page: 1,
                category: a.key
              });
            }
          });
        });
      };
      this.empty = function () {
        var empty = new Lampa.Empty();
        html.appendChild(empty.render(true));
        this.start = empty.start;
        this.activity.loader(false);
        this.activity.toggle();
      };
      this.build = function (data) {
        var _this = this;
        scroll.minus();
        scroll.onWheel = function (step) {
          if (!Lampa.Controller.own(_this)) _this.start();
          if (step > 0) _this.down();else if (active > 0) _this.up();
        };
        data.forEach(this.append.bind(this));
        html.appendChild(scroll.render(true));
        Lampa.Layer.update(html);
        Lampa.Layer.visible(html);
        this.activity.loader(false);
        this.activity.toggle();
      };
      this.append = function (element) {
        if (element.ready) return;
        element.ready = true;
        var item = new Lampa.InteractionLine(element, {
          url: element.url,
          object: object,
          card_collection: true,
          card_events: {
            onMenu: function onMenu() {}
          }
        });
        item.create();
        item.onDown = this.down.bind(this);
        item.onUp = this.up.bind(this);
        item.onBack = this.back.bind(this);
        item.onSelect = function (card, card_data) {
          Utils.play(card_data);
        };
        item.onMore = function () {};
        items.push(item);
        scroll.append(item.render(true));
      };
      this.back = function () {
        Lampa.Activity.backward();
      };
      this.down = function () {
        active++;
        active = Math.min(active, items.length - 1);
        scroll.update(items[active].render(true));
        items[active].toggle();
      };
      this.up = function () {
        active--;
        if (active < 0) {
          active = 0;
          Lampa.Controller.toggle('head');
        } else {
          items[active].toggle();
          scroll.update(items[active].render(true));
        }
      };
      this.start = function () {
        var _this2 = this;
        Lampa.Controller.add('content', {
          link: this,
          toggle: function toggle() {
            if (_this2.activity.canRefresh()) return false;
            if (items.length) items[active].toggle();
          },
          update: function update() {},
          left: function left() {
            if (Navigator.canmove('left')) Navigator.move('left');else Lampa.Controller.toggle('menu');
          },
          right: function right() {
            if (Navigator.canmove('right')) Navigator.move('right');
            else _this2.filter();
          },
          up: function up() {
            if (Navigator.canmove('up')) Navigator.move('up');else Lampa.Controller.toggle('head');
          },
          down: function down() {
            if (Navigator.canmove('down')) Navigator.move('down');
          },
          back: this.back
        });
        Lampa.Controller.toggle('content');
      };
      this.refresh = function () {
        this.activity.needRefresh();
      };
      this.pause = function () {};
      this.stop = function () {};
      this.render = function (js) {
        return js ? html : $(html);
      };
      this.destroy = function () {
        Lampa.Arrays.destroy(items);
        scroll.destroy();
        html.remove();
        items = [];
      };
    }

    function View(object) {
      var network = new Lampa.Reguest();
      var scroll = new Lampa.Scroll({
        mask: true,
        over: true,
        step: 250,
        end_ratio: 2
      });
      var items = [];
      var html = document.createElement('div');
      var body = document.createElement('div');
      var last;
      var waitload;
      var active = 0;
      var menu;
      this.create = function () {
        this.activity.loader(true);
        Api$1.view(object, this.build.bind(this), this.empty.bind(this));
      };
      this.empty = function () {
        var empty = new Lampa.Empty();
        html.appendChild(empty.render(true));
        this.start = empty.start;
        this.activity.loader(false);
        this.activity.toggle();
      };
      this.filter = function () {
        var _this = this;
        if (menu) {
          var _items = menu.filter(function (m) {
            return !m.search_on;
          });
          if (!_items.length) return;
          Lampa.Select.show({
            title: 'Фильтр',
            items: _items,
            onBack: function onBack() {
              Lampa.Controller.toggle('content');
            },
            onSelect: function onSelect(a) {
              menu.forEach(function (m) {
                m.selected = m == a ? true : false;
              });
              if (a.submenu) {
                Lampa.Select.show({
                  title: a.title,
                  items: a.submenu,
                  onBack: function onBack() {
                    _this.filter();
                  },
                  onSelect: function onSelect(b) {
                    Lampa.Activity.push({
                      title: object.title,
                      url: b.playlist_url,
                      component: 'view',
                      page: 1
                    });
                  }
                });
              } else {
                _this.filter();
              }
            }
          });
        }
      };
      this.next = function () {
        var _this2 = this;
        if (waitload) return;
        if (object.page !== 0) {
          waitload = true;
          object.page++;
          Api$1.view(object, function (result) {
            _this2.append(result, true);
            waitload = false;
            _this2.limit();
          }, function () {
            waitload = false;
          });
        }
      };
      this.append = function (data, append) {
        data.list.forEach(function (element) {
          var card = new Lampa.Card(element, {
            card_collection: true
          });
          card.create();
          card.onFocus = function (target) {
            last = target;
            active = items.indexOf(card);
            scroll.update(card.render(true));
            Lampa.Background.change(element.picture);
          };
          card.onEnter = function () {
            Utils.play(element);
          };
          body.appendChild(card.render(true));
          items.push(card);
          if (append) Lampa.Controller.collectionAppend(card.render(true));
        });
      };
      this.limit = function () {
        var limit_view = 12;
        var lilit_collection = 36;
        var colection = items.slice(Math.max(0, active - limit_view), active + limit_view);
        items.forEach(function (item) {
          if (colection.indexOf(item) == -1) {
            item.render(true).classList.remove('layer--render');
          } else {
            item.render(true).classList.add('layer--render');
          }
        });
        Navigator.setCollection(items.slice(Math.max(0, active - lilit_collection), active + lilit_collection).map(function (c) {
          return c.render(true);
        }));
        Navigator.focused(last);
        Lampa.Layer.visible(scroll.render(true));
      };
      this.build = function (data) {
        var _this3 = this;
        if (data.list.length) {
          menu = data.menu;
          menu.forEach(function (m) {
            var spl = m.title.split(':');
            m.title = spl[0].trim();
            if (spl[1]) m.subtitle = Lampa.Utils.capitalizeFirstLetter(spl[1].trim().replace(/all/i, 'Любой'));
            if (m.submenu) {
              m.submenu.forEach(function (s) {
                s.title = Lampa.Utils.capitalizeFirstLetter(s.title.trim().replace(/all/i, 'Любой'));
              });
            }
          });
          body.classList.add('category-full');
          scroll.minus();
          scroll.onEnd = this.next.bind(this);
          scroll.onScroll = this.limit.bind(this);
          scroll.onWheel = function (step) {
            if (!Lampa.Controller.own(_this3)) _this3.start();
            if (step > 0) Navigator.move('down');else Navigator.move('up');
          };
          this.append(data);
          scroll.append(body);
          html.appendChild(scroll.render(true));
          this.limit();
          this.activity.loader(false);
          this.activity.toggle();
        } else {
          html.appendChild(scroll.render(true));
          this.empty();
        }
      };
      this.start = function () {
        var _this4 = this;
        Lampa.Controller.add('content', {
          link: this,
          toggle: function toggle() {
            if (_this4.activity.canRefresh()) return false;
            Lampa.Controller.collectionSet(scroll.render(true));
            Lampa.Controller.collectionFocus(last || false, scroll.render(true));
          },
          left: function left() {
            if (Navigator.canmove('left')) Navigator.move('left');else Lampa.Controller.toggle('menu');
          },
          right: function right() {
            if (Navigator.canmove('right')) Navigator.move('right');else _this4.filter();
          },
          up: function up() {
            if (Navigator.canmove('up')) Navigator.move('up');else Lampa.Controller.toggle('head');
          },
          down: function down() {
            if (Navigator.canmove('down')) Navigator.move('down');
          },
          back: function back() {
            Lampa.Activity.backward();
          }
        });
        Lampa.Controller.toggle('content');
      };
      this.refresh = function () {
        this.activity.needRefresh();
      };
      this.pause = function () {};
      this.stop = function () {};
      this.render = function (js) {
        return js ? html : $(html);
      };
      this.destroy = function () {
        network.clear();
        Lampa.Arrays.destroy(items);
        scroll.destroy();
        html.remove();
        body.remove();
        items = [];
      };
    }

    var Search = {
      title: '',
      search: function search(params, oncomplite) {
        Api$1.search(params, oncomplite);
      },
      onCancel: function onCancel() {
        Api$1.clear();
      },
      params: {
        align_left: true,
        card_events: {
          onMenu: function onMenu() {}
        }
      },
      onMore: function onMore(params, close) {
        close();
        var url = Lampa.Utils.addUrlComponent(params.data.url, 'search=' + encodeURIComponent(params.query));
        Lampa.Activity.push({
          url: url,
          title: 'Поиск - ' + params.query,
          component: 'view',
          page: 2
        });
      },
      onSelect: function onSelect(params, close) {
        Utils.play(params.element);
      },
      onAppend: function onAppend(card) {
        card.render().addClass('card--collection');
      }
    };

    function clearInterface() {
      $('.menu .menu__list:eq(0)').empty();
      $('.head .notice--icon').remove();
      $('.head .open--premium').remove();
      $('.menu .menu__list:eq(1) li:eq(1)').remove();
    }
    function clearSettings() {
      var components = ['parser', 'server', 'tmdb', 'plugins', 'account'];
      var params = ['light_version', 'card_interfice_type', 'card_interfice_poster', 'start_page', 'source', 'card_quality', 'card_episodes'];
      var titles = ['card_interfice_type'];
      Lampa.Settings.listener.follow('open', function (e) {
        titles.forEach(function (t) {
          var param = $('[data-name="' + t + '"]', e.body).prev();
          if (param.length && param.hasClass('settings-param-title')) param.remove();
        });
        $(components.map(function (c) {
          return '[data-component="' + c + '"]';
        }).join(','), e.body).remove();
        $(params.map(function (c) {
          return '[data-name="' + c + '"]';
        }).join(','), e.body).remove();
      });
    }
    function createMenu() {
      var menu_container = $('.menu .menu__list:eq(0)');
      var button = $("<li class=\"menu__item selector\">\n        <div class=\"menu__ico\">\n            <svg version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 512 512\" xml:space=\"preserve\">\n                <path fill=\"currentColor\" d=\"M475.425,200.225L262.092,4.669c-6.951-6.359-17.641-6.204-24.397,0.35L36.213,200.574\n                c-3.449,3.348-5.399,7.953-5.399,12.758v280.889c0,9.819,7.958,17.778,17.778,17.778h148.148c9.819,0,17.778-7.959,17.778-17.778\n                v-130.37h82.963v130.37c0,9.819,7.958,17.778,17.778,17.778h148.148c9.819,0,17.778-7.953,17.778-17.778V213.333\n                C481.185,208.349,479.099,203.597,475.425,200.225z M445.629,476.444H333.037v-130.37c0-9.819-7.959-17.778-17.778-17.778H196.741\n                c-9.819,0-17.778,7.959-17.778,17.778v130.37H66.37V220.853L250.424,42.216l195.206,178.939V476.444z\"></path>\n            </svg>\n        </div>\n        <div class=\"menu__text\">\u0413\u043B\u0430\u0432\u043D\u0430\u044F</div>\n    </li>");
      button.on('hover:enter', function () {
        Lampa.Activity.push({
          url: '',
          title: '',
          component: 'start',
          page: 1
        });
      });
      menu_container.append(button);
      Api$1.menu(function (data) {
        data.forEach(function (channel) {
          var title = Utils.sourceTitle(channel.title);
          var button = $("<li class=\"menu__item selector\">\n                <div class=\"menu__ico\">\n                    <img src=\"./img/icons/settings/more.svg\">\n                </div>\n                <div class=\"menu__text\">" + title + "</div>\n            </li>");
          button.on('hover:enter', function () {
            Lampa.Activity.push({
              url: channel.playlist_url,
              title: title,
              component: 'view',
              page: 1
            });
          });
          menu_container.append(button);
        });
      });
    }
    function showCategoryFilter() {
      Api$1.categories(function (cats) {
        if (!cats || !cats.length) return;
        var filterItems = [{ title: 'Все', key: '' }].concat(cats.map(function (c) {
          return { title: c.title, key: c.key };
        }));
        Lampa.Select.show({
          title: 'Категория',
          items: filterItems,
          onBack: function () { Lampa.Controller.toggle('content'); },
          onSelect: function (a) {
            Lampa.Activity.push({
              url: '',
              title: a.title === 'Все' ? '' : a.title,
              component: 'start',
              page: 1,
              category: a.key
            });
          }
        });
      });
    }
    function addFilter() {
      var activi;
      var button = $("<div class=\"head__action head__settings selector\">\n        <svg height=\"36\" viewBox=\"0 0 38 36\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n            <rect x=\"1.5\" y=\"1.5\" width=\"35\" height=\"33\" rx=\"1.5\" stroke=\"currentColor\" stroke-width=\"3\"></rect>\n            <rect x=\"7\" y=\"8\" width=\"24\" height=\"3\" rx=\"1.5\" fill=\"currentColor\"></rect>\n            <rect x=\"7\" y=\"16\" width=\"24\" height=\"3\" rx=\"1.5\" fill=\"currentColor\"></rect>\n            <rect x=\"7\" y=\"25\" width=\"24\" height=\"3\" rx=\"1.5\" fill=\"currentColor\"></rect>\n            <circle cx=\"13.5\" cy=\"17.5\" r=\"3.5\" fill=\"currentColor\"></circle>\n            <circle cx=\"23.5\" cy=\"26.5\" r=\"3.5\" fill=\"currentColor\"></circle>\n            <circle cx=\"21.5\" cy=\"9.5\" r=\"3.5\" fill=\"currentColor\"></circle>\n        </svg>\n    </div>");
      // In sisi mode the filter is always visible — show immediately.
      function onFilterClick() {
        var cur = Lampa.Activity.active();
        if (cur) {
          var comp = cur.activity ? cur.activity.component : null;
          var target = comp && typeof comp === 'function' ? comp() : comp;
          if (target && typeof target.filter === 'function') {
            target.filter();
          } else {
            showCategoryFilter();
          }
        }
      }
      button.on('hover:enter', onFilterClick);
      button.on('click', onFilterClick);
      $('.head .open--search').after(button);
      Lampa.Listener.follow('activity', function (e) {
        if (e.type == 'start') activi = e.object;
      });
    }
    function addId() {
      $('.head .head__actions').before($("\n        <div style=\"background: rgb(255,255,255,0.3); padding: 0.4em; border-radius: 0.3em; line-height: 1; font-size: 1.3em;\">\u0412\u0430\u0448 ID: " + Lampa.Storage.get('sisi_uid', '') + "</div>\n    "));
    }
    function start() {
      if (!Lampa.Storage.get('sisi_uid', '')) {
        Lampa.Storage.set('sisi_uid', Lampa.Utils.uid(6));
      }
      clearInterface();
      clearSettings();
      createMenu();
      addFilter();
      addId();
      delete Lampa.Api.sources.tmdb;
      delete Lampa.Api.sources.cub;
      Lampa.Search.addSource(Search);
      Lampa.Component.add('start', Start);
      Lampa.Component.add('view', View);
    }
    Lampa.Listener.follow('app', function (e) {
      if (e.type == 'ready') start();
    });
    if (window.appready) start();

})();
