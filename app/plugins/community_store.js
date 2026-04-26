(function(){
'use strict';
if(window.__community_store_loaded) return;
window.__community_store_loaded = true;

var STORE_HOST = '{localhost}';

// --- CSS ---
var css = '\
.cs-page { padding: 1.5em; position: relative; }\
.cs-header { display: flex; align-items: center; gap: 0.8em; margin-bottom: 1.2em; }\
.cs-header-icon { font-size: 1.8em; }\
.cs-header-title { font-size: 1.4em; font-weight: 700; color: #fff; }\
.cs-header-count { font-size: 0.85em; color: rgba(255,255,255,0.35); margin-left: 0.3em; }\
.cs-filters { display: flex; gap: 0.5em; flex-wrap: wrap; margin-bottom: 1.2em; }\
.cs-chip { padding: 0.4em 1em; border-radius: 2em; font-size: 0.85em; font-weight: 600; \
  background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.08); \
  cursor: pointer; transition: all 0.25s; white-space: nowrap; }\
.cs-chip.focus, .cs-chip.hover { background: rgba(255,255,255,0.15); color: #fff; border-color: rgba(255,255,255,0.2); \
  box-shadow: 0 0 12px rgba(255,255,255,0.08); }\
.cs-chip.cs-chip--active { background: linear-gradient(135deg, #06b6d4, #0d9488); color: #fff; border-color: transparent; }\
.cs-chip.cs-chip--active.focus, .cs-chip.cs-chip--active.hover { box-shadow: 0 0 20px rgba(6,182,212,0.35); }\
.cs-list { display: flex; flex-direction: column; gap: 0.6em; }\
.cs-card { display: flex; align-items: center; padding: 1em 1.2em; \
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); \
  border-radius: 1em; transition: all 0.25s; cursor: pointer; gap: 1em; }\
.cs-card.focus, .cs-card.hover { background: rgba(6,182,212,0.08); border-color: rgba(6,182,212,0.25); \
  box-shadow: 0 0 24px rgba(6,182,212,0.12); transform: scale(1.01); }\
.cs-card-icon { width: 2.8em; height: 2.8em; border-radius: 0.7em; flex-shrink: 0; \
  background: linear-gradient(135deg, rgba(6,182,212,0.15), rgba(13,148,136,0.1)); \
  display: flex; align-items: center; justify-content: center; font-size: 1.3em; }\
.cs-card-body { flex: 1; min-width: 0; }\
.cs-card-name { font-size: 1.05em; font-weight: 700; color: #fff; margin-bottom: 0.15em; }\
.cs-card-desc { font-size: 0.8em; color: rgba(255,255,255,0.4); line-height: 1.4; \
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }\
.cs-card-meta { font-size: 0.72em; color: rgba(255,255,255,0.25); margin-top: 0.3em; }\
.cs-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.3em; flex-shrink: 0; }\
.cs-badge { padding: 0.25em 0.7em; border-radius: 1em; font-size: 0.72em; font-weight: 700; white-space: nowrap; }\
.cs-badge--installed { background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.2); }\
.cs-badge--update { background: rgba(250,204,21,0.15); color: #facc15; border: 1px solid rgba(250,204,21,0.2); }\
.cs-badge--cat { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.35); }\
.cs-ver { font-size: 0.7em; color: rgba(255,255,255,0.2); }\
.cs-empty { text-align: center; padding: 3em 1em; color: rgba(255,255,255,0.25); }\
.cs-empty-icon { font-size: 3em; margin-bottom: 0.3em; opacity: 0.3; }\
.cs-loading { text-align: center; padding: 4em 1em; color: rgba(255,255,255,0.3); font-size: 1em; }\
';

function injectCSS(){
  if(document.getElementById('community-store-css')) return;
  var s = document.createElement('style');
  s.id = 'community-store-css';
  s.textContent = css;
  document.head.appendChild(s);
}

// --- Category icon map ---
var catIcons = {
  theme: '\uD83C\uDFA8',
  player: '\u25B6\uFE0F',
  utility: '\uD83D\uDD27',
  menu: '\uD83D\uDCCB',
  video: '\uD83C\uDFAC',
  tv: '\uD83D\uDCFA',
  anime: '\uD83C\uDDEF\uD83C\uDDF5',
  'default': '\uD83E\uDDE9'
};

function catIcon(cat){ return catIcons[cat] || catIcons['default']; }

function esc(s){ return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : ''; }

// --- Component ---
function CommunityStoreComponent(object){
  var scroll = new Lampa.Scroll({mask: true, over: true});
  var items = [];
  var catalog = [];
  var activeFilter = '';
  var network = new Lampa.Reguest();

  // Источники (балансеры) уже встроены в lampac-go и управляются разделом
  // «Online». Дублирующие community-плагины с категорией balancer только
  // путают пользователя, поэтому скрываем их из магазина.
  function filterCatalog(list){
    return (list || []).filter(function(p){
      return p && p.category !== 'balancer';
    });
  }

  this.create = function(){
    injectCSS();
    this.activity.loader(true);
    scroll.minus();

    network.silent(STORE_HOST + '/api/community-plugins', function(data){
      catalog = filterCatalog(data.catalog || data.plugins);
      renderPage();
      this.activity.loader(false);
      this.activity.toggle();
    }.bind(this), function(err){
      catalog = [];
      renderPage();
      this.activity.loader(false);
      this.activity.toggle();
    }.bind(this));
  };

  function renderPage(){
    scroll.clear();
    items = [];

    var page = document.createElement('div');
    page.className = 'cs-page';

    // Header
    var hdr = document.createElement('div');
    hdr.className = 'cs-header';
    hdr.innerHTML = '<span class="cs-header-icon">\uD83E\uDDE9</span>' +
      '<span class="cs-header-title">\u041C\u0430\u0433\u0430\u0437\u0438\u043D \u043F\u043B\u0430\u0433\u0438\u043D\u043E\u0432</span>' +
      '<span class="cs-header-count">' + catalog.length + '</span>';
    page.appendChild(hdr);

    // Filters
    var cats = {};
    catalog.forEach(function(p){ if(p.category) cats[p.category] = 1; });
    var catKeys = Object.keys(cats).sort();

    if(catKeys.length > 0){
      var filters = document.createElement('div');
      filters.className = 'cs-filters';

      var allChip = createChip('\u0412\u0441\u0435', '', !activeFilter);
      filters.appendChild(allChip);
      items.push(allChip);

      catKeys.forEach(function(c){
        var chip = createChip(catIcon(c) + ' ' + c, c, activeFilter === c);
        filters.appendChild(chip);
        items.push(chip);
      });

      page.appendChild(filters);
    }

    // Cards
    var list = document.createElement('div');
    list.className = 'cs-list';

    var filtered = catalog.filter(function(p){
      return !activeFilter || p.category === activeFilter;
    });

    if(filtered.length === 0){
      list.innerHTML = '<div class="cs-empty"><div class="cs-empty-icon">\uD83D\uDD0D</div>' +
        (catalog.length === 0 ? '\u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u043F\u0443\u0441\u0442 \u0438\u043B\u0438 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D' : '\u041D\u0435\u0442 \u043F\u043B\u0430\u0433\u0438\u043D\u043E\u0432 \u0432 \u044D\u0442\u043E\u0439 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438') +
        '</div>';
    } else {
      filtered.forEach(function(p){
        var card = createCard(p);
        list.appendChild(card);
        items.push(card);
      });
    }

    page.appendChild(list);
    scroll.append(page);
  }

  function createChip(label, cat, active){
    var el = document.createElement('div');
    el.className = 'cs-chip selector' + (active ? ' cs-chip--active' : '');
    el.textContent = label;
    el.addEventListener('hover:enter', function(){
      activeFilter = cat;
      renderPage();
      setTimeout(function(){ focusFirst(); }, 50);
    });
    return el;
  }

  function createCard(plugin){
    var el = document.createElement('div');
    el.className = 'cs-card selector';

    var icon = catIcon(plugin.category);
    var meta = [];
    if(plugin.author) meta.push(esc(plugin.author));
    if(plugin.version) meta.push('v' + esc(plugin.version));
    if(plugin.category) meta.push(esc(plugin.category));

    var rightHTML = '';
    if(plugin.installed && plugin.update_available){
      rightHTML = '<span class="cs-badge cs-badge--update">\u2B06 \u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C</span>' +
        '<span class="cs-ver">' + esc(plugin.installed_version) + ' \u2192 ' + esc(plugin.version) + '</span>';
    } else if(plugin.installed){
      rightHTML = '<span class="cs-badge cs-badge--installed">\u2714 \u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D</span>';
    }

    el.innerHTML = '<div class="cs-card-icon">' + icon + '</div>' +
      '<div class="cs-card-body">' +
        '<div class="cs-card-name">' + esc(plugin.display_name || plugin.name) + '</div>' +
        (plugin.description ? '<div class="cs-card-desc">' + esc(plugin.description) + '</div>' : '') +
        '<div class="cs-card-meta">' + meta.join(' \u00B7 ') + '</div>' +
      '</div>' +
      '<div class="cs-card-right">' + rightHTML + '</div>';

    el.addEventListener('hover:enter', function(){
      cardAction(plugin);
    });

    return el;
  }

  function cardAction(plugin){
    var actions = [];

    if(plugin.installed && plugin.update_available){
      actions.push({ title: '\u2B06 \u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C', action: 'update' });
      actions.push({ title: '\u2716 \u0423\u0434\u0430\u043B\u0438\u0442\u044C', action: 'uninstall' });
    } else if(plugin.installed){
      actions.push({ title: '\u2716 \u0423\u0434\u0430\u043B\u0438\u0442\u044C', action: 'uninstall' });
    } else {
      actions.push({ title: '\u2B07 \u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C', action: 'install' });
    }

    if(plugin.homepage){
      actions.push({ title: '\uD83C\uDF10 \u0421\u0430\u0439\u0442', action: 'homepage' });
    }

    actions.push({ title: '\u2190 \u041D\u0430\u0437\u0430\u0434', action: 'back' });

    Lampa.Select.show({
      title: plugin.display_name || plugin.name,
      items: actions,
      onSelect: function(a){
        if(a.action === 'homepage'){
          if(typeof Lampa.Utils.openURL === 'function') Lampa.Utils.openURL(plugin.homepage);
          return;
        }
        if(a.action === 'back') return;

        // install / uninstall / update
        Lampa.Noty.show('\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...');

        $.ajax({
          url: STORE_HOST + '/api/community-plugins',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ action: a.action, name: plugin.name }),
          success: function(d){
            if(d.ok || d.status === 'ok'){
              Lampa.Noty.show(a.action === 'uninstall' ? '\u0423\u0434\u0430\u043B\u0451\u043D' : a.action === 'update' ? '\u041E\u0431\u043D\u043E\u0432\u043B\u0451\u043D' : '\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D');
              refreshCatalog();
            } else {
              Lampa.Noty.show(d.error || '\u041E\u0448\u0438\u0431\u043A\u0430', false);
            }
          },
          error: function(){
            Lampa.Noty.show('\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430', false);
          }
        });
      },
      onBack: function(){}
    });
  }

  function refreshCatalog(){
    network.silent(STORE_HOST + '/api/community-plugins', function(data){
      catalog = filterCatalog(data.catalog || data.plugins);
      renderPage();
      setTimeout(function(){ focusFirst(); }, 50);
    }, function(){});
  }

  function focusFirst(){
    var first = scroll.render().find('.selector').eq(0);
    if(first.length) Lampa.Controller.collectionFocus(first[0], scroll.render()[0]);
  }

  this.start = function(){
    Lampa.Controller.add('content', {
      toggle: function(){
        Lampa.Controller.collectionSet(scroll.render()[0]);
        Lampa.Controller.collectionFocus(false, scroll.render()[0]);
      },
      left: function(){
        if(Lampa.Activity.canGoBack()) Lampa.Activity.backward();
        else Lampa.Controller.toggle('menu');
      },
      right: function(){
        Navigator.move('right');
      },
      up: function(){
        Navigator.move('up');
      },
      down: function(){
        Navigator.move('down');
      },
      back: function(){
        Lampa.Activity.backward();
      }
    });
    Lampa.Controller.toggle('content');
  };

  this.pause = function(){};
  this.stop = function(){};
  this.render = function(){ return scroll.render(); };
  this.destroy = function(){
    network.clear();
    scroll.destroy();
  };
}

// --- Register component ---
Lampa.Component.add('community_store', CommunityStoreComponent);

// --- Menu item ---
function addMenuItem(){
  var ico = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-2 .9-2 2v3.8h1.5c1.52 0 2.75 1.23 2.75 2.75S5.02 16.3 3.5 16.3H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.52 1.23-2.75 2.75-2.75s2.75 1.23 2.75 2.75V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z" fill="currentColor"/>' +
    '</svg>';

  var btn = $('<li class="menu__item selector">' +
    '<div class="menu__ico">' + ico + '</div>' +
    '<div class="menu__text">\u041F\u043B\u0430\u0433\u0438\u043D\u044B</div>' +
    '</li>');

  btn.on('hover:enter', function(){
    Lampa.Activity.push({
      url: '',
      title: '\u041F\u043B\u0430\u0433\u0438\u043D\u044B',
      component: 'community_store',
      page: 1
    });
  });

  // Insert before the last item in the first menu list (settings)
  var list = $('.menu .menu__list').eq(0);
  if(list.length){
    var settingsItem = list.find('[data-action="settings"]');
    if(settingsItem.length){
      settingsItem.before(btn);
    } else {
      list.append(btn);
    }
  }
}

// --- Init ---
if(window.appready){
  addMenuItem();
} else {
  Lampa.Listener.follow('app', function(e){
    if(e.type === 'ready') addMenuItem();
  });
}

})();
