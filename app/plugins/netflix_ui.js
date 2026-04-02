(function () {
  'use strict';

  if (window.__netflixUILoaded) return;
  window.__netflixUILoaded = true;

  var STYLE_ID = 'netflix-ui-style';
  var HERO_CLASS = 'netflix-hero';
  var N = 'body.netflix--ui';
  var TMDB_KEY = '4ef0d7355d9ffb5151e987764708ce96';

  // ═══════════════════════════════════════════════════════════════
  //  Logo fetcher — gets title logos from TMDB official API
  // ═══════════════════════════════════════════════════════════════
  var logoCache = {};  // id -> { path, width, height } or null
  var logoPending = {}; // id -> [callbacks]

  function fetchLogo(id, type, callback) {
    if (!id) return callback(null);
    var cacheKey = type + '/' + id;

    // Cache hit
    if (cacheKey in logoCache) return callback(logoCache[cacheKey]);

    // Already fetching — queue callback
    if (logoPending[cacheKey]) {
      logoPending[cacheKey].push(callback);
      return;
    }

    logoPending[cacheKey] = [callback];

    var url = 'https://api.themoviedb.org/3/' + type + '/' + id +
      '/images?api_key=' + TMDB_KEY + '&include_image_language=ru,en,null';

    fetch(url).then(function (r) { return r.json(); }).then(function (data) {
      var logo = null;
      if (data.logos && data.logos.length) {
        // Prefer Russian, then English, then any
        var ru = data.logos.filter(function (l) { return l.iso_639_1 === 'ru'; });
        var en = data.logos.filter(function (l) { return l.iso_639_1 === 'en'; });
        var picked = ru[0] || en[0] || data.logos[0];
        if (picked && picked.file_path) {
          logo = {
            path: picked.file_path,
            width: picked.width,
            height: picked.height
          };
        }
      }
      logoCache[cacheKey] = logo;
      var cbs = logoPending[cacheKey] || [];
      delete logoPending[cacheKey];
      for (var i = 0; i < cbs.length; i++) cbs[i](logo);
    }).catch(function () {
      logoCache[cacheKey] = null;
      var cbs = logoPending[cacheKey] || [];
      delete logoPending[cacheKey];
      for (var i = 0; i < cbs.length; i++) cbs[i](null);
    });
  }

  function logoImgUrl(logoPath) {
    return Lampa.TMDB.image('t/p/w300' + logoPath);
  }

  // ═══════════════════════════════════════════════════════════════
  //  CSS
  // ═══════════════════════════════════════════════════════════════
  function injectStyles() {
    // Remove old version to ensure we're last (override theme.js)
    var old = document.getElementById(STYLE_ID);
    if (old) old.remove();

    // Load Google Font
    if (!document.getElementById('netflix-ui-font')) {
      var link = document.createElement('link');
      link.id = 'netflix-ui-font';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
      document.head.appendChild(link);
    }

    var css = [
      // ── Global + Font ──
      N + ' {',
      '  background: #141414 !important; color: #e5e5e5 !important;',
      '  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;',
      '}',
      N + ' * { font-family: inherit !important; }',
      N + '.black--style { background: #0a0a0a !important; }',

      // ── Header — transparent gradient ──
      N + ' .head__body {',
      '  background: linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%) !important;',
      '  padding-bottom: 2em !important;',
      '}',
      N + ' .head__title {',
      '  color: #fff !important; font-weight: 800 !important;',
      '  font-size: 1.4em !important; letter-spacing: -0.02em !important;',
      '}',
      N + ' .head__action.focus,' + N + ' .head__action.hover {',
      '  background: rgba(255,255,255,0.12) !important; color: #fff !important;',
      '}',

      // ═══════════════════════════════════════════════════════════
      //  HERO BANNER — large cinematic billboard
      // ═══════════════════════════════════════════════════════════
      '.' + HERO_CLASS + ' {',
      '  position: relative; width: 100%; min-height: 30em; max-height: 75vh;',
      '  overflow: hidden; display: flex; align-items: flex-end;',
      '  margin-bottom: -1em; z-index: 0;',
      '}',
      '.' + HERO_CLASS + '__bg {',
      '  position: absolute; inset: -5% 0 0 0; z-index: 0;',
      '  background-size: cover; background-position: center 15%;',
      '  transition: opacity 1.2s ease, transform 10s ease-out;',
      '  will-change: opacity, transform;',
      '}',
      '.' + HERO_CLASS + '__bg--active { opacity: 1 !important; transform: scale(1.04) !important; }',
      '.' + HERO_CLASS + '__bg--fade { opacity: 0; }',
      '.' + HERO_CLASS + '__vignette {',
      '  position: absolute; inset: 0; z-index: 1; pointer-events: none;',
      '  background:',
      '    linear-gradient(0deg, #141414 0%, rgba(20,20,20,0.98) 6%, rgba(20,20,20,0.6) 22%, rgba(20,20,20,0.05) 50%, transparent 60%),',
      '    linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 28%, transparent 55%);',
      '}',
      '.' + HERO_CLASS + '__content {',
      '  position: relative; z-index: 2; padding: 0 4% 3em;',
      '  max-width: 44%; min-width: 280px;',
      '}',
      '.' + HERO_CLASS + '__content > * {',
      '  opacity: 0; transform: translateY(1.2em);',
      '  animation: nfxFadeUp 0.6s ease forwards;',
      '}',
      '.' + HERO_CLASS + '__content > *:nth-child(2) { animation-delay: 0.12s; }',
      '.' + HERO_CLASS + '__content > *:nth-child(3) { animation-delay: 0.24s; }',
      '.' + HERO_CLASS + '__content > *:nth-child(4) { animation-delay: 0.36s; }',
      '.' + HERO_CLASS + '__content > *:nth-child(5) { animation-delay: 0.48s; }',
      '.' + HERO_CLASS + '__content > *:nth-child(6) { animation-delay: 0.60s; }',
      '.' + HERO_CLASS + '__content > *:nth-child(7) { animation-delay: 0.72s; }',
      // "N" label
      '.' + HERO_CLASS + '__label {',
      '  font-size: 0.95em; font-weight: 800; letter-spacing: 0.18em;',
      '  text-transform: uppercase; margin-bottom: 0.3em;',
      '  display: flex; align-items: center; gap: 0.5em; color: #fff;',
      '}',
      '.' + HERO_CLASS + '__label svg { width: 1.4em; height: 1.4em; }',
      '.' + HERO_CLASS + '__label-type { color: rgba(255,255,255,0.6); }',
      // Title
      '.' + HERO_CLASS + '__title {',
      '  font-size: 3.2em; font-weight: 900; letter-spacing: -0.03em;',
      '  line-height: 1.05; margin-bottom: 0.3em; color: #fff;',
      '  text-shadow: 0 4px 20px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.9);',
      '}',
      // Hero logo image (replaces text title)
      '.' + HERO_CLASS + '__title-logo {',
      '  max-width: 70%; max-height: 5em; object-fit: contain;',
      '  object-position: left bottom; display: block;',
      '  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.8));',
      '  margin-bottom: 0.4em;',
      '}',
      // Meta
      '.' + HERO_CLASS + '__meta {',
      '  display: flex; align-items: center; gap: 0.6em; flex-wrap: wrap;',
      '  margin-bottom: 0.4em; font-size: 0.95em;',
      '}',
      '.' + HERO_CLASS + '__match { color: #46d369; font-weight: 700; }',
      '.' + HERO_CLASS + '__year { color: rgba(255,255,255,0.75); }',
      '.' + HERO_CLASS + '__badge {',
      '  border: 1px solid rgba(255,255,255,0.4); border-radius: 3px;',
      '  padding: 0.02em 0.4em; font-size: 0.8em; font-weight: 700; color: #fff;',
      '}',
      // Genres + cast
      '.' + HERO_CLASS + '__genres {',
      '  font-size: 0.85em; color: rgba(255,255,255,0.55); margin-bottom: 0.3em;',
      '}',
      // Overview
      '.' + HERO_CLASS + '__overview {',
      '  font-size: 1em; line-height: 1.5; color: rgba(255,255,255,0.85);',
      '  margin-bottom: 1em;',
      '  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;',
      '  overflow: hidden; text-shadow: 0 2px 8px rgba(0,0,0,0.8);',
      '}',
      // Buttons
      '.' + HERO_CLASS + '__buttons { display: flex; gap: 0.6em; }',
      '.' + HERO_CLASS + '__btn {',
      '  display: inline-flex; align-items: center; gap: 0.4em;',
      '  padding: 0.45em 1.4em; border-radius: 4px;',
      '  font-size: 1.05em; font-weight: 700; cursor: pointer;',
      '  border: none; transition: all 0.2s ease;',
      '}',
      '.' + HERO_CLASS + '__btn--play { background: #fff; color: #141414; }',
      '.' + HERO_CLASS + '__btn--play.focus { background: rgba(255,255,255,0.75); transform: scale(1.05); }',
      '.' + HERO_CLASS + '__btn--info { background: rgba(109,109,110,0.7); color: #fff; }',
      '.' + HERO_CLASS + '__btn--info.focus { background: rgba(109,109,110,0.5); transform: scale(1.05); }',
      '.' + HERO_CLASS + '__btn svg { width: 1.15em; height: 1.15em; fill: currentColor; }',
      // Indicators
      '.' + HERO_CLASS + '__indicators {',
      '  position: absolute; right: 4%; bottom: 3em; z-index: 3;',
      '  display: flex; gap: 3px;',
      '}',
      '.' + HERO_CLASS + '__dot {',
      '  width: 12px; height: 2px; background: rgba(255,255,255,0.3);',
      '  transition: all 0.4s ease; cursor: pointer;',
      '}',
      '.' + HERO_CLASS + '__dot--on { background: #fff; width: 24px; }',

      // ═══════════════════════════════════════════════════════════
      //  CARDS — LANDSCAPE with backdrop images + title overlay
      // ═══════════════════════════════════════════════════════════

      // Make cards wider (landscape 16:9)
      N + ' .card {',
      '  width: 18.5em !important;',       // wider than default 12.75em
      '  transition: z-index 0s 0.3s !important;',
      '  margin-bottom: 0.5em !important; padding-bottom: 0 !important;',
      '}',
      N + ' .card.focus,' + N + ' .card.hover {',
      '  z-index: 12 !important; transition: z-index 0s !important;',
      '}',
      // Aspect ratio: override card__view padding-bottom from 150% (portrait) to 56.25% (16:9 landscape)
      N + ' .card__view {',
      '  padding-bottom: 56.25% !important;',
      '  margin-bottom: 0 !important; border-radius: 4px !important;',
      '  overflow: hidden !important;',
      '  transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease !important;',
      '}',
      N + ' .card__img {',
      '  border-radius: 4px !important;',
      '  background-color: #2a2a2a !important;',
      '  object-fit: cover !important;',
      '  object-position: center 20% !important;',   // slightly above center for faces
      '}',
      N + ' .card__filter { border-radius: 4px !important; }',

      // Focus — scale + lift + shadow
      N + ' .card.focus .card__view {',
      '  transform: scale(1.15) !important;',
      '  box-shadow: 0 12px 36px rgba(0,0,0,0.9), 0 0 50px rgba(0,0,0,0.4) !important;',
      '  overflow: visible !important;',
      '}',
      N + ' .card.hover .card__view {',
      '  transform: scale(1.05) !important;',
      '  box-shadow: 0 6px 20px rgba(0,0,0,0.6) !important;',
      '}',
      // Focus border
      N + ' .card.focus .card__view::after {',
      '  content: "" !important; position: absolute !important;',
      '  inset: 0 !important; border: 2px solid rgba(255,255,255,0.9) !important;',
      '  border-radius: 4px !important; pointer-events: none !important; z-index: 5 !important;',
      '}',
      N + ' .card.focus::after { display: none !important; }',

      // ── Title overlay on card (bottom gradient + text/logo) ──
      '.nfx-card-overlay {',
      '  position: absolute; bottom: 0; left: 0; right: 0; z-index: 3;',
      '  padding: 2.5em 0.6em 0.5em; pointer-events: none;',
      '  background: linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 45%, transparent 100%);',
      '  border-radius: 0 0 4px 4px;',
      '}',
      // Logo image on card
      '.nfx-card-overlay__logo {',
      '  max-width: 80%; max-height: 2.5em; object-fit: contain;',
      '  object-position: left bottom; display: block;',
      '  filter: drop-shadow(0 1px 3px rgba(0,0,0,0.8));',
      '  margin-bottom: 0.15em;',
      '}',
      '.nfx-card-overlay__title {',
      '  font-size: 0.9em; font-weight: 700; color: #fff;',
      '  text-shadow: 0 1px 4px rgba(0,0,0,0.8);',
      '  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;',
      '  line-height: 1.3;',
      '}',
      '.nfx-card-overlay__meta {',
      '  font-size: 0.6em; color: rgba(255,255,255,0.6); margin-top: 0.15em;',
      '  display: flex; align-items: center; gap: 0.4em;',
      '}',
      '.nfx-card-overlay__match { color: #46d369; font-weight: 700; }',

      // ── "LAMPAC" logo badge on cards (like Netflix logo) ──
      '.nfx-card-logo {',
      '  position: absolute; top: 0.4em; left: 0.4em; z-index: 4;',
      '  font-size: 0.45em; font-weight: 900; letter-spacing: 0.12em;',
      '  color: rgba(255,255,255,0.85); text-transform: uppercase;',
      '  background: rgba(229,9,20,0.9); padding: 0.15em 0.4em;',
      '  border-radius: 2px; line-height: 1;',
      '}',

      // ── Hide default card text/age/promo below ──
      N + ' .card .card__title { display: none !important; }',
      N + ' .card .card__age { display: none !important; }',
      N + ' .card .card__promo { display: none !important; }',
      N + ' .card .card__description { display: none !important; }',

      // ── VOTE badge — top right ──
      N + ' .card__vote {',
      '  opacity: 0 !important; transition: opacity 0.2s !important;',
      '  color: #46d369 !important; font-weight: 700 !important; font-size: 0.85em !important;',
      '  background: rgba(0,0,0,0.85) !important; border-radius: 3px !important;',
      '  padding: 0.1em 0.3em !important;',
      '}',
      N + ' .card.focus .card__vote { opacity: 1 !important; }',

      // ── Quality badge ──
      N + ' .card__quality {',
      '  background: rgba(0,0,0,0.7) !important; color: #fff !important;',
      '  font-weight: 700 !important; font-size: 0.55em !important;',
      '  border: 1px solid rgba(255,255,255,0.4) !important; border-radius: 3px !important;',
      '  padding: 0.08em 0.3em !important;',
      '}',

      // ── Type badge — red ──
      N + ' .card__type {',
      '  background: #e50914 !important; color: #fff !important;',
      '  border-radius: 3px !important; font-size: 0.55em !important;',
      '  font-weight: 700 !important; padding: 0.08em 0.35em !important;',
      '}',

      // ── View markers ──
      N + ' .card__marker { background: rgba(0,0,0,0.85) !important; border-radius: 3px !important; }',
      N + ' .card__marker--look::before { background-color: #e50914 !important; }',
      N + ' .card__marker--viewed::before { background-color: #46d369 !important; }',

      // ═══════════════════════════════════════════════════════════
      //  CATEGORY ROWS — compact Netflix layout
      // ═══════════════════════════════════════════════════════════
      N + '.netflix--theme .items-line,' + N + ' .items-line {',
      '  padding-top: 22px !important; padding-bottom: 4px !important;',
      '  margin-bottom: 0 !important; position: relative; z-index: 2;',
      '}',
      N + '.netflix--theme .items-line__head,' + N + ' .items-line__head {',
      '  margin-bottom: 10px !important;',
      '  padding: 0 4% !important;',
      '  align-items: baseline !important;',
      '  min-height: 36px !important;',
      '  display: flex !important;',
      '}',
      N + '.netflix--theme .items-line__title,' + N + ' .items-line__title {',
      '  font-weight: 800 !important; font-size: 24px !important;',
      '  letter-spacing: -0.3px !important; text-transform: none !important;',
      '  color: #e5e5e5 !important; background: none !important;',
      '  -webkit-text-fill-color: #e5e5e5 !important;',
      '  background-clip: unset !important; -webkit-background-clip: unset !important;',
      '  background-image: none !important;',
      '  line-height: 1.3 !important;',
      '  transition: color 0.25s ease !important;',
      '  position: relative !important;',
      '  text-rendering: optimizeLegibility !important;',
      '  -webkit-font-smoothing: antialiased !important;',
      '  padding: 2px 0 !important;',
      '}',
      // Hover — title brightens + "Explore all >" appears
      N + ' .items-line:hover .items-line__title,' + N + ' .items-line__title.focus {',
      '  color: #fff !important;',
      '}',
      // "See all" link — Netflix teal, slides in with arrow
      N + ' .items-line__more {',
      '  background: transparent !important; border: none !important;',
      '  color: #54b9c5 !important; font-size: 0.85em !important; font-weight: 600 !important;',
      '  opacity: 0 !important; transition: opacity 0.3s ease, transform 0.3s ease !important;',
      '  transform: translateX(-0.5em) !important;',
      '  letter-spacing: 0 !important;',
      '}',
      N + ' .items-line:hover .items-line__more,' + N + ' .items-line__more.focus {',
      '  opacity: 1 !important; transform: translateX(0) !important;',
      '}',
      // Remove icons/avatars but keep text inside full-person
      N + ' .items-line__title::before { display: none !important; }',
      N + ' .items-line__title .items-line__text-icon { display: none !important; }',
      // full-person contains title text — show it inline, hide only photo/image
      N + ' .items-line__title .full-person {',
      '  display: inline !important; background: none !important;',
      '  padding: 0 !important; margin: 0 !important;',
      '  width: auto !important; height: auto !important;',
      '  min-width: 0 !important; min-height: 0 !important;',
      '}',
      N + ' .items-line__title .full-person__photo {',
      '  display: none !important;',
      '}',
      N + ' .items-line__title .full-person__name {',
      '  display: inline !important; font-size: inherit !important;',
      '  color: inherit !important; font-weight: inherit !important;',
      '}',
      N + ' .items-line__title img { display: none !important; }',
      N + ' .items-line__title svg:not(.nfx-keep) { display: none !important; }',
      N + ' .items-line--type-cards { min-height: auto !important; }',
      N + ' .items-cards { padding-left: 4% !important; gap: 0.3em !important; }',

      // ═══════════════════════════════════════════════════════════
      //  SIDEBAR
      // ═══════════════════════════════════════════════════════════
      N + '.menu--open .wrap__left {',
      '  background: rgba(20,20,20,0.97) !important; border-right: none !important;',
      '  box-shadow: 4px 0 50px rgba(0,0,0,0.8) !important;',
      '}',
      N + ' .menu__item { border-radius: 4px !important; }',
      N + ' .menu__item.focus,' + N + ' .menu__item.traverse,' + N + ' .menu__item.hover {',
      '  background: rgba(255,255,255,0.08) !important; color: #fff !important;',
      '  box-shadow: none !important;',
      '}',

      // ═══════════════════════════════════════════════════════════
      //  SETTINGS / MODALS
      // ═══════════════════════════════════════════════════════════
      N + ' .settings__content,' + N + ' .settings-input__content {',
      '  background: #181818 !important; border-left: none !important;',
      '}',
      N + ' .selectbox__content,' + N + ' .modal__content {',
      '  background: #1c1c1c !important; border: 1px solid rgba(255,255,255,0.06) !important;',
      '  border-radius: 8px !important; box-shadow: 0 20px 60px rgba(0,0,0,0.8) !important;',
      '}',
      N + ' .settings-folder.focus { background: rgba(255,255,255,0.06) !important; }',
      N + ' .settings-param.focus { background: rgba(255,255,255,0.05) !important; }',
      N + ' .selectbox-item.focus,' + N + ' .selectbox-item.hover {',
      '  background: rgba(255,255,255,0.08) !important; color: #fff !important;',
      '}',

      // ═══════════════════════════════════════════════════════════
      //  FULL DETAIL PAGE
      // ═══════════════════════════════════════════════════════════
      N + ' .full-start__background.loaded { opacity: 0.5 !important; }',
      N + ' .full-start__title { font-weight: 900 !important; letter-spacing: -0.02em !important; }',
      N + ' .full-start__button {',
      '  border-radius: 4px !important; border: none !important;',
      '  background: rgba(109,109,110,0.7) !important; color: #fff !important;',
      '  font-weight: 700 !important; transition: all 0.2s !important;',
      '}',
      N + ' .full-start__button.focus { background: #fff !important; color: #141414 !important; }',
      N + ' .full-start__img { border-radius: 6px !important; }',

      // ═══════════════════════════════════════════════════════════
      //  PLAYER
      // ═══════════════════════════════════════════════════════════
      N + ' .player-panel .button.focus { background: #e50914 !important; color: #fff !important; }',
      N + ' .time-line > div,' + N + ' .player-panel__position,' + N + ' .player-panel__position > div:after {',
      '  background: #e50914 !important;',
      '}',

      // ═══════════════════════════════════════════════════════════
      //  MISC — torrents, extensions, nav, search, iptv, online
      // ═══════════════════════════════════════════════════════════
      N + ' .torrent-item__size,' + N + ' .torrent-item__exe,' + N + ' .torrent-item__viewed,' + N + ' .torrent-serial__size {',
      '  background: rgba(255,255,255,0.08) !important; color: #e5e5e5 !important;',
      '}',
      N + ' .torrent-item.focus::after { border-color: rgba(255,255,255,0.3) !important; }',
      N + ' .extensions { background: #141414 !important; }',
      N + ' .extensions__item,' + N + ' .extensions__block-add {',
      '  background-color: #181818 !important; border-radius: 6px !important;',
      '}',
      N + ' .navigation-bar__body { background: #141414 !important; border-top: none !important; }',
      N + ' .search-source.active { background: rgba(255,255,255,0.1) !important; color: #fff !important; }',
      N + ' .iptv-channel { background-color: #181818 !important; }',
      N + ' .iptv-list__item.focus,' + N + ' .iptv-menu__list-item.focus {',
      '  background: rgba(255,255,255,0.08) !important; color: #fff !important;',
      '}',
      N + ' .online-prestige__timeline .time-line { background: rgba(255,255,255,0.1) !important; }',
      N + ' .online-prestige__timeline .time-line > div { background: #e50914 !important; }',

      // Top 10 numbers
      N + ' .items-line--type-top .items-cards .card::before {',
      '  color: transparent !important;',
      '  -webkit-text-stroke: 3px rgba(255,255,255,0.2) !important;',
      '  font-weight: 900 !important;',
      '  text-shadow: 0 0 40px rgba(229,9,20,0.3) !important;',
      '}',

      // ═══════════════════════════════════════════════════════════
      //  MOBILE RESPONSIVE (≤600px)
      // ═══════════════════════════════════════════════════════════
      '@media (max-width: 600px) {',

      // Hero banner — mobile fullscreen style
      '  .' + HERO_CLASS + ' {',
      '    min-height: 56vh !important; max-height: 65vh !important;',
      '  }',
      '  .' + HERO_CLASS + '__content {',
      '    max-width: 92% !important; min-width: 0 !important; padding: 0 4% 1.5em !important;',
      '  }',
      '  .' + HERO_CLASS + '__title {',
      '    font-size: 1.6em !important; margin-bottom: 0.15em !important;',
      '  }',
      '  .' + HERO_CLASS + '__title-logo {',
      '    max-width: 60% !important; max-height: 2.5em !important;',
      '  }',
      '  .' + HERO_CLASS + '__overview {',
      '    font-size: 0.78em !important; -webkit-line-clamp: 2 !important; margin-bottom: 0.5em !important;',
      '    line-height: 1.35 !important;',
      '  }',
      '  .' + HERO_CLASS + '__meta { font-size: 0.75em !important; margin-bottom: 0.2em !important; }',
      '  .' + HERO_CLASS + '__genres { font-size: 0.7em !important; margin-bottom: 0.15em !important; }',
      '  .' + HERO_CLASS + '__label { font-size: 0.65em !important; margin-bottom: 0.15em !important; }',
      '  .' + HERO_CLASS + '__label svg { width: 1em !important; height: 1em !important; }',
      '  .' + HERO_CLASS + '__btn { font-size: 0.8em !important; padding: 0.3em 0.9em !important; }',
      '  .' + HERO_CLASS + '__buttons { gap: 0.4em !important; }',
      '  .' + HERO_CLASS + '__indicators { bottom: 1.5em !important; right: 4% !important; }',
      '  .' + HERO_CLASS + '__vignette {',
      '    background:',
      '      linear-gradient(0deg, #141414 0%, rgba(20,20,20,0.98) 10%, rgba(20,20,20,0.7) 35%, rgba(20,20,20,0.1) 60%, transparent 70%),',
      '      linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, transparent 70%) !important;',
      '  }',

      // Cards — keep portrait on mobile (undo landscape override)
      '  ' + N + ' .card {',
      '    width: 11.4em !important;',
      '    margin-bottom: 0.3em !important;',
      '  }',
      '  ' + N + ' .card__view {',
      '    padding-bottom: 150% !important;',
      '    border-radius: 6px !important;',
      '  }',
      '  ' + N + ' .card__img {',
      '    border-radius: 6px !important;',
      '    object-position: center !important;',
      '  }',
      '  ' + N + ' .card.focus .card__view {',
      '    transform: scale(1.08) !important;',
      '  }',
      '  ' + N + ' .card.focus .card__view::after {',
      '    border-radius: 6px !important;',
      '  }',
      '  ' + N + ' .card__filter { border-radius: 6px !important; }',

      // Hide overlay on mobile portrait cards (too small for text)
      '  .nfx-card-overlay { display: none !important; }',
      '  .nfx-card-logo { display: none !important; }',
      // Restore default card title/age on mobile
      '  ' + N + ' .card .card__title { display: block !important; }',
      '  ' + N + ' .card .card__age { display: block !important; }',

      // Category rows — tighter spacing
      '  ' + N + ' .items-line__title {',
      '    font-size: 18px !important; padding: 0 4% !important;',
      '  }',
      '  ' + N + ' .items-line__head {',
      '    min-height: 28px !important; margin-bottom: 6px !important;',
      '  }',
      '  ' + N + ' .items-cards { padding-left: 4% !important; gap: 0.2em !important; }',

      '}',

      // ── Landscape phone (short + wide) ──
      '@media (max-width: 900px) and (max-height: 500px) and (orientation: landscape) {',
      '  .' + HERO_CLASS + ' { min-height: 70vh !important; max-height: 85vh !important; }',
      '  .' + HERO_CLASS + '__content { max-width: 55% !important; padding: 0 3% 1.5em !important; }',
      '  .' + HERO_CLASS + '__title { font-size: 1.6em !important; }',
      '  .' + HERO_CLASS + '__overview { -webkit-line-clamp: 2 !important; font-size: 0.78em !important; }',
      '}',

      // ── Animations ──
      '@keyframes nfxFadeUp {',
      '  from { opacity: 0; transform: translateY(1.2em); }',
      '  to { opacity: 1; transform: translateY(0); }',
      '}',

      ''
    ].join('\n');

    var el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = css;
    // Append to end of body to ensure we override theme.js styles
    document.body.appendChild(el);
  }

  // ═══════════════════════════════════════════════════════════════
  //  Genre helper
  // ═══════════════════════════════════════════════════════════════
  var GENRE_MAP = {
    28:'Боевик',12:'Приключения',16:'Мультфильм',35:'Комедия',
    80:'Криминал',99:'Документальный',18:'Драма',10751:'Семейный',
    14:'Фэнтези',36:'История',27:'Ужасы',10402:'Музыка',
    9648:'Детектив',10749:'Мелодрама',878:'Фантастика',
    10770:'Телефильм',53:'Триллер',10752:'Военный',37:'Вестерн',
    10759:'Боевик',10762:'Детский',10765:'Фантастика',10767:'Ток-шоу'
  };

  function getGenreNames(item) {
    var names = [];
    if (item.genres && item.genres.length) {
      for (var i = 0; i < item.genres.length; i++) {
        if (item.genres[i].name) names.push(item.genres[i].name);
      }
    } else if (item.genre_ids && item.genre_ids.length) {
      for (var j = 0; j < item.genre_ids.length; j++) {
        if (GENRE_MAP[item.genre_ids[j]]) names.push(GENRE_MAP[item.genre_ids[j]]);
      }
    }
    return names;
  }

  // ═══════════════════════════════════════════════════════════════
  //  Switch card images from poster to backdrop (landscape)
  // ═══════════════════════════════════════════════════════════════
  function switchCardToBackdrop(cardEl) {
    if (cardEl.getAttribute('data-nfx-switched')) return;
    cardEl.setAttribute('data-nfx-switched', '1');

    // On mobile, keep poster images (portrait cards)
    if (isMobile()) return;

    var data = extractCardData(cardEl);
    if (!data) return;

    // Replace poster with backdrop image
    var imgEl = cardEl.querySelector('.card__img');
    if (imgEl && data.backdrop_path) {
      var backdropUrl = Lampa.TMDB.image('t/p/w500' + data.backdrop_path);
      if (imgEl.tagName === 'IMG') {
        imgEl.src = backdropUrl;
        imgEl.style.objectFit = 'cover';
        imgEl.style.objectPosition = 'center';
      } else {
        imgEl.style.backgroundImage = 'url(' + backdropUrl + ')';
        imgEl.style.backgroundSize = 'cover';
        imgEl.style.backgroundPosition = 'center';
      }
    }

    // Add title overlay on card
    var view = cardEl.querySelector('.card__view');
    if (!view || view.querySelector('.nfx-card-overlay')) return;

    var title = data.title || data.name || '';
    if (!title) {
      var titleEl = cardEl.querySelector('.card__title');
      if (titleEl) title = titleEl.textContent.trim();
    }

    var vote = data.vote_average ? parseFloat(data.vote_average) : 0;
    var year = '';
    if (data.release_date) year = data.release_date.substring(0, 4);
    else if (data.first_air_date) year = data.first_air_date.substring(0, 4);

    // Overlay with logo/title + meta
    var overlay = document.createElement('div');
    overlay.className = 'nfx-card-overlay';

    // Build meta line
    var metaParts = [];
    if (vote > 0) metaParts.push('<span class="nfx-card-overlay__match">' + Math.round(vote * 10) + '%</span>');
    if (year) metaParts.push('<span>' + year + '</span>');
    var genreNames = getGenreNames(data);
    if (genreNames.length) metaParts.push('<span>' + escapeHtml(genreNames.slice(0, 2).join(', ')) + '</span>');
    var metaHtml = metaParts.length ? '<div class="nfx-card-overlay__meta">' + metaParts.join('<span style="opacity:0.4"> · </span>') + '</div>' : '';

    // Start with text title, then try to replace with logo
    var titleHtml = title ? '<div class="nfx-card-overlay__title">' + escapeHtml(title) + '</div>' : '';
    overlay.innerHTML = titleHtml + metaHtml;
    view.appendChild(overlay);

    // Fetch logo asynchronously and replace text title if found
    var tmdbType = data.name ? 'tv' : 'movie';
    fetchLogo(data.id, tmdbType, function (logo) {
      if (!logo) return;
      var titleDiv = overlay.querySelector('.nfx-card-overlay__title');
      if (titleDiv) {
        var img = document.createElement('img');
        img.className = 'nfx-card-overlay__logo';
        img.src = logoImgUrl(logo.path);
        img.alt = title;
        img.loading = 'lazy';
        img.onerror = function () { img.style.display = 'none'; };
        titleDiv.replaceWith(img);
      }
    });

    // Add small "LAMPAC" logo badge (like Netflix logo on cards)
    var logo = document.createElement('div');
    logo.className = 'nfx-card-logo';
    logo.textContent = 'ALCOPAC';
    view.appendChild(logo);
  }

  function processCards(container) {
    if (!container) return;
    var cards = container.querySelectorAll('.card');
    for (var i = 0; i < cards.length; i++) {
      switchCardToBackdrop(cards[i]);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  HERO BANNER — auto-rotating billboard
  // ═══════════════════════════════════════════════════════════════
  var heroItems = [];
  var heroIndex = 0;
  var heroTimer = null;
  var heroElement = null;

  function buildHero(items) {
    if (!items || !items.length) return null;

    heroItems = [];
    for (var i = 0; i < items.length && heroItems.length < 5; i++) {
      if (items[i] && items[i].backdrop_path) heroItems.push(items[i]);
    }
    if (!heroItems.length) return null;
    heroIndex = 0;

    var div = document.createElement('div');
    div.className = HERO_CLASS;

    // Backdrop layers for crossfade
    var bgHtml = '';
    for (var b = 0; b < heroItems.length; b++) {
      var bgUrl = Lampa.TMDB.image('t/p/w1280' + heroItems[b].backdrop_path);
      bgHtml += '<div class="' + HERO_CLASS + '__bg' +
        (b === 0 ? ' ' + HERO_CLASS + '__bg--active' : ' ' + HERO_CLASS + '__bg--fade') +
        '" style="background-image:url(' + bgUrl + ')" data-idx="' + b + '"></div>';
    }

    // Indicators
    var indHtml = '';
    if (heroItems.length > 1) {
      indHtml = '<div class="' + HERO_CLASS + '__indicators">';
      for (var d = 0; d < heroItems.length; d++) {
        indHtml += '<div class="' + HERO_CLASS + '__dot' + (d === 0 ? ' ' + HERO_CLASS + '__dot--on' : '') + '" data-idx="' + d + '"></div>';
      }
      indHtml += '</div>';
    }

    div.innerHTML = bgHtml +
      '<div class="' + HERO_CLASS + '__vignette"></div>' +
      '<div class="' + HERO_CLASS + '__content">' + buildHeroContent(heroItems[0]) + '</div>' +
      indHtml;

    setupHeroClicks(div, heroItems[0]);
    // Load logo for hero title
    var heroContent = div.querySelector('.' + HERO_CLASS + '__content');
    if (heroContent) loadHeroLogo(heroContent);
    if (heroItems.length > 1) startHeroRotation(div);

    return div;
  }

  function buildHeroContent(item) {
    var title = item.title || item.name || item.original_title || '';
    var year = '';
    var dateStr = item.release_date || item.first_air_date || '';
    if (dateStr) year = dateStr.substring(0, 4);

    var vote = item.vote_average ? parseFloat(item.vote_average).toFixed(1) : '';
    var match = vote ? Math.round(parseFloat(vote) * 10) + '%' : '';
    var overview = item.overview || '';
    var genreNames = getGenreNames(item);

    var html = '';

    // Label: N + ORIGINAL FILM/SERIES
    var type = item.name ? 'СЕРИАЛ' : 'ФИЛЬМ';
    html += '<div class="' + HERO_CLASS + '__label">' +
      '<svg viewBox="0 0 111 30"><path d="M105.06 14.28L111 30c-1.75-.25-3.5-.5-5.25-.5L102.5 20.5l-3.25 8.75c-1.75.25-3.5.5-5.25.75l5.75-14.5L94.5.25c1.75.25 3.5.5 5.25.75l3.25 8.25L106.25.5c1.75-.25 3.5-.5 5.25-.75l-6.44 14.53zM90 0c-1.5 0-3 .25-4.5.5V30c1.5.25 3 .5 4.5.5V0zM80.25.75c-4.5-1-9 1.5-9 6.75 0 8.75 11.25 6.25 11.25 12.25 0 2.75-2.5 4-5 3.75-2-.25-3.75-1-5.5-2l-1 4.5c1.75.75 3.75 1.25 5.75 1.25 5 0 9.5-2.25 9.5-7.75 0-9-11.25-6.5-11.25-12.25 0-2.25 2-3.75 4.25-3.5 1.75.25 3.25.75 4.75 1.75L85.5 1c-1.5-.5-3.25-1-5.25-.75V.75zM63 .5c-5.5 0-9.5 4.5-9.5 14.75S57.5 29.75 63 29.75c5.5 0 9.5-4.5 9.5-14.75S68.5.5 63 .5zm0 4.25c3 0 4.5 4 4.5 10.5S66 25.5 63 25.5s-4.5-4-4.5-10.5S60 4.75 63 4.75zM46 .5c-1.5 0-3 .25-4.5.5v24.75l-8.5-25C31.5.5 30 .25 28.5 0v30c1.5.25 3 .5 4.5.5V5.5L41.5 30c1.5.25 3 .5 4.5.5V.5z" fill="#e50914"/></svg>' +
      '<span class="' + HERO_CLASS + '__label-type">' + type + '</span></div>';

    // Title — will be replaced by logo if available
    html += '<div class="' + HERO_CLASS + '__title" data-tmdb-id="' + item.id + '" data-tmdb-type="' + (item.name ? 'tv' : 'movie') + '">' + escapeHtml(title) + '</div>';

    // Meta
    var metaParts = [];
    if (match) metaParts.push('<span class="' + HERO_CLASS + '__match">' + match + ' совпадение</span>');
    if (year) metaParts.push('<span class="' + HERO_CLASS + '__year">' + year + '</span>');
    metaParts.push('<span class="' + HERO_CLASS + '__badge">16+</span>');
    html += '<div class="' + HERO_CLASS + '__meta">' + metaParts.join('') + '</div>';

    // Genres
    if (genreNames.length) {
      html += '<div class="' + HERO_CLASS + '__genres">' + escapeHtml(genreNames.slice(0, 4).join(' · ')) + '</div>';
    }

    // Overview
    if (overview) {
      html += '<div class="' + HERO_CLASS + '__overview">' + escapeHtml(overview) + '</div>';
    }

    // Buttons
    html += '<div class="' + HERO_CLASS + '__buttons">' +
      '<div class="' + HERO_CLASS + '__btn ' + HERO_CLASS + '__btn--play selector" tabindex="0">' +
        '<svg viewBox="0 0 24 24"><path d="M6 4l15 8-15 8z"/></svg>' +
        '<span>Смотреть</span></div>' +
      '<div class="' + HERO_CLASS + '__btn ' + HERO_CLASS + '__btn--info selector" tabindex="0">' +
        '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="8" r="1"/></svg>' +
        '<span>Подробнее</span></div>' +
    '</div>';

    return html;
  }

  function loadHeroLogo(contentEl) {
    var titleDiv = contentEl.querySelector('.' + HERO_CLASS + '__title');
    if (!titleDiv) return;
    var tmdbId = titleDiv.getAttribute('data-tmdb-id');
    var tmdbType = titleDiv.getAttribute('data-tmdb-type') || 'movie';
    if (!tmdbId) return;

    fetchLogo(parseInt(tmdbId), tmdbType, function (logo) {
      if (!logo) return;
      // Check if title div still exists (might have been rotated away)
      if (!titleDiv.parentElement) return;
      var img = document.createElement('img');
      img.className = HERO_CLASS + '__title-logo';
      img.src = logoImgUrl(logo.path);
      img.alt = titleDiv.textContent;
      img.onerror = function () { img.style.display = 'none'; titleDiv.style.display = ''; };
      titleDiv.style.display = 'none';
      titleDiv.parentElement.insertBefore(img, titleDiv);
    });
  }

  function setupHeroClicks(heroDiv, item) {
    function openCard() {
      var cur = heroItems[heroIndex] || item;
      Lampa.Activity.push({
        url: '', component: 'full', id: cur.id,
        method: cur.name ? 'tv' : 'movie', card: cur,
      });
    }
    var play = heroDiv.querySelector('.' + HERO_CLASS + '__btn--play');
    var info = heroDiv.querySelector('.' + HERO_CLASS + '__btn--info');
    if (play) { play.addEventListener('click', openCard); $(play).on('hover:enter', openCard); }
    if (info) { info.addEventListener('click', openCard); $(info).on('hover:enter', openCard); }
    heroDiv.addEventListener('click', function (e) {
      if (!e.target.closest('.' + HERO_CLASS + '__btn') && !e.target.closest('.' + HERO_CLASS + '__dot')) openCard();
    });
    $(heroDiv).on('hover:enter', openCard);
  }

  function startHeroRotation(heroDiv) {
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = setInterval(function () {
      rotateHero(heroDiv, (heroIndex + 1) % heroItems.length);
    }, 7000);
  }

  function rotateHero(heroDiv, idx) {
    if (idx === heroIndex) return;
    heroIndex = idx;

    // Crossfade bgs
    var bgs = heroDiv.querySelectorAll('.' + HERO_CLASS + '__bg');
    for (var i = 0; i < bgs.length; i++) {
      var n = parseInt(bgs[i].getAttribute('data-idx'));
      bgs[i].classList.toggle(HERO_CLASS + '__bg--active', n === idx);
      bgs[i].classList.toggle(HERO_CLASS + '__bg--fade', n !== idx);
    }
    // Indicators
    var dots = heroDiv.querySelectorAll('.' + HERO_CLASS + '__dot');
    for (var j = 0; j < dots.length; j++) {
      dots[j].classList.toggle(HERO_CLASS + '__dot--on', j === idx);
    }
    // Content crossfade
    var content = heroDiv.querySelector('.' + HERO_CLASS + '__content');
    if (content) {
      content.style.opacity = '0';
      content.style.transform = 'translateY(0.8em)';
      setTimeout(function () {
        content.innerHTML = buildHeroContent(heroItems[idx]);
        content.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
        setupHeroClicks(heroDiv, heroItems[idx]);
        loadHeroLogo(content);
      }, 350);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  Hero insertion — inside scroll body
  // ═══════════════════════════════════════════════════════════════
  function tryInsertHero(container) {
    if (!container || document.querySelector('.' + HERO_CLASS)) return;

    var firstLine = container.querySelector('.items-line');
    if (!firstLine) return;

    var cards = firstLine.querySelectorAll('.card');
    var items = [];
    for (var i = 0; i < cards.length && items.length < 6; i++) {
      var d = extractCardData(cards[i]);
      if (d && d.backdrop_path) items.push(d);
    }
    if (!items.length) return;

    var hero = buildHero(items);
    if (!hero) return;
    heroElement = hero;

    // Insert inside scroll body so hero scrolls with content
    var scrollBody = container.querySelector('.scroll__body');
    if (!scrollBody) scrollBody = container.querySelector('.scroll__content');
    if (!scrollBody) scrollBody = container;

    var firstChild = scrollBody.querySelector('.items-line') || scrollBody.firstChild;
    if (firstChild) scrollBody.insertBefore(hero, firstChild);
    else scrollBody.appendChild(hero);
  }

  function onActivity(e) {
    if (!e || !e.object) return;
    var component = e.component || (e.object && e.object.component);
    if (component !== 'main') return;

    setTimeout(function () {
      var render;
      try { render = e.object.activity ? e.object.activity.render() : null; } catch (err) { return; }
      if (!render || !render.length) return;

      var body = render.find('.activity__body')[0] || render[0];
      if (!body) return;

      processCards(body);
      tryInsertHero(body);
    }, 500);
  }

  function extractCardData(cardEl) {
    if (cardEl.card_data && cardEl.card_data.id) return cardEl.card_data;
    try {
      var $card = $(cardEl);
      var d = $card.data('card') || $card.data('json');
      if (d && d.id) return d;
    } catch (err) {}
    return null;
  }

  // ═══════════════════════════════════════════════════════════════
  //  MutationObserver
  // ═══════════════════════════════════════════════════════════════
  function observeCards() {
    if (!window.MutationObserver) return;
    new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var added = mutations[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (node.nodeType !== 1) continue;
          if (node.classList && node.classList.contains('card')) {
            switchCardToBackdrop(node);
          } else if (node.querySelectorAll) {
            var cards = node.querySelectorAll('.card');
            for (var k = 0; k < cards.length; k++) switchCardToBackdrop(cards[k]);
          }
        }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  // ═══════════════════════════════════════════════════════════════
  //  Utility
  // ═══════════════════════════════════════════════════════════════
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ═══════════════════════════════════════════════════════════════
  //  Init
  // ═══════════════════════════════════════════════════════════════
  function isMobile() {
    return window.innerWidth < 768 || (window.innerWidth < 1024 && 'ontouchstart' in window);
  }

  function startPlugin() {
    var theme = Lampa.Storage.get('lampac_theme', 'classic');
    if (theme !== 'netflix') return;

    // Mobile: apply Netflix UI but with responsive adjustments (CSS below handles it)

    document.body.classList.add('netflix--ui');
    injectStyles();
    // Re-inject after 1s to ensure we override theme.js (loads later)
    setTimeout(function () { injectStyles(); }, 1000);
    setTimeout(function () { injectStyles(); }, 3000);
    observeCards();
    processCards(document.body);

    setTimeout(function () {
      var actBody = document.querySelector('.activity--active .activity__body') ||
                    document.querySelector('.activity__body');
      if (actBody) {
        processCards(actBody);
        tryInsertHero(actBody);
      }
    }, 600);

    Lampa.Listener.follow('activity', function (e) {
      if (e.type === 'start' || e.type === 'activity') {
        var oldHero = document.querySelector('.' + HERO_CLASS);
        if (oldHero) oldHero.remove();
        if (heroTimer) { clearInterval(heroTimer); heroTimer = null; }
        onActivity(e);
      }
    });

    Lampa.Listener.follow('full', function (e) {
      if (e.type === 'complite') {
        try {
          var render = e.object.activity.render();
          if (render && render.length) processCards(render[0]);
        } catch (err) {}
      }
    });

    Lampa.Storage.listener.follow('change', function (e) {
      if (e.name === 'lampac_theme') {
        if (e.value === 'netflix') {
          document.body.classList.add('netflix--ui');
          injectStyles();
        } else {
          document.body.classList.remove('netflix--ui');
          var s = document.getElementById(STYLE_ID);
          if (s) s.remove();
          var h = document.querySelector('.' + HERO_CLASS);
          if (h) h.remove();
          if (heroTimer) { clearInterval(heroTimer); heroTimer = null; }
        }
      }
    });
  }

  if (window.appready) startPlugin();
  else {
    Lampa.Listener.follow('app', function (e) {
      if (e.type === 'ready') startPlugin();
    });
  }
})();
