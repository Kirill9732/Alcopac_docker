(function () {
  'use strict';

  if (window.lampac_theme_plugin || window.AlcopacThemeV5DemoLoaded) return;
  window.AlcopacThemeV5DemoLoaded = true;

  var STORAGE_KEY = 'lampac_theme';
  var STYLE_ID = 'lampac-theme-style';
  var ALL_CLASSES = ['neon--theme', 'aurora--theme', 'gold--theme', 'mono--theme', 'sunset--theme', 'glass--theme', 'appletv--theme', 'netflix--theme', 'custom--theme'];

  // ═══════════════════════════════════════════════════════════
  //  Theme CSS Generator
  // ═══════════════════════════════════════════════════════════
  function buildCSS(o) {
    var B = 'body.' + o.cls;
    return [

      // ─── Foundation ──────────────────────────────────────
      B + ' { background: ' + o.bg + ' !important; color: ' + o.text + '; }',
      B + '.black--style { background: ' + o.bgBlack + ' !important; }',

      // ─── Header ──────────────────────────────────────────
      B + ' .head__body {' +
      '  background: linear-gradient(180deg, ' + o.bgA95 + ' 0%, ' + o.bgA0 + ' 100%);' +
      '  padding-bottom: 2em;' +
      '}',
      B + ' .head__title { font-weight: 600; letter-spacing: 0.02em; }',
      B + ' .head__action.focus,' +
      B + ' .head__action.hover {' +
      '  background: ' + o.grad + '; color: ' + o.gradText + ';' +
      '}',
      B + ' .head__action.active::after {' +
      '  background-color: ' + o.accent + '; border-color: ' + o.bg + ';' +
      '}',

      // ─── Sidebar ─────────────────────────────────────────
      B + '.menu--open .wrap__left {' +
      '  background: ' + o.sidebarBg + ';' +
      '  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);' +
      '  border-right: 1px solid ' + o.accentA08 + ';' +
      '}',
      B + ' .menu__item { border-radius: 0.8em; margin: 0.15em 0.8em; transition: all 0.2s ease; }',
      B + ' .menu__item.focus,' +
      B + ' .menu__item.traverse,' +
      B + ' .menu__item.hover {' +
      '  background: ' + o.grad + '; color: ' + o.gradText + ';' +
      '  box-shadow: 0 4px 20px ' + o.accentA25 + ';' +
      '}',
      B + ' .menu__item.focus .menu__ico [stroke],' +
      B + ' .menu__item.traverse .menu__ico [stroke],' +
      B + ' .menu__item.hover .menu__ico [stroke] { stroke: ' + o.gradText + '; }',
      B + ' .menu__item.focus .menu__ico path[fill],' +
      B + ' .menu__item.focus .menu__ico rect[fill],' +
      B + ' .menu__item.focus .menu__ico circle[fill],' +
      B + ' .menu__item.traverse .menu__ico path[fill],' +
      B + ' .menu__item.traverse .menu__ico rect[fill],' +
      B + ' .menu__item.traverse .menu__ico circle[fill],' +
      B + ' .menu__item.hover .menu__ico path[fill],' +
      B + ' .menu__item.hover .menu__ico rect[fill],' +
      B + ' .menu__item.hover .menu__ico circle[fill] { fill: ' + o.gradText + '; }',
      B + ' .menu__text { font-weight: 500; letter-spacing: 0.01em; }',

      // ─── Category titles ─────────────────────────────────
      B + ' .items-line__head { margin-bottom: 0.4em; }',
      B + ' .items-line__title {' +
      '  font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase; font-size: 1.05em;' +
      '  background: linear-gradient(90deg, ' + o.text + ' 0%, ' + o.accentA70 + ' 100%);' +
      '  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;' +
      '}',

      // ─── Cards ───────────────────────────────────────────
      B + ' .card__img { background-color: ' + o.cardBg + '; border-radius: 1.1em; }',
      B + ' .card__view { transition: transform 0.25s ease, box-shadow 0.25s ease; }',
      B + ' .card.focus .card__view { transform: scale(1.05); z-index: 2; }',
      B + ' .card.focus .card__view::after,' +
      B + ' .card.hover .card__view::after {' +
      '  border-color: ' + o.accent + ';' +
      '  box-shadow: 0 0 20px ' + o.accentA35 + ', 0 8px 32px rgba(0,0,0,0.5);' +
      '  border-radius: 1.5em;' +
      '}',
      B + ' .card.hover .card__view::after {' +
      '  border-color: ' + o.accentA40 + '; box-shadow: 0 0 12px ' + o.accentA15 + ';' +
      '}',
      B + ' .card__title { font-weight: 500; }',
      B + ' .card__vote { color: ' + o.muted + '; }',
      B + ' .card__quality {' +
      '  background: ' + o.grad + ' !important; color: ' + o.gradText + ' !important; font-weight: 700;' +
      '}',
      B + ' .card__icons-inner {' +
      '  background: ' + o.bgA70 + '; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);' +
      '}',
      B + ' .card__promo {' +
      '  background: linear-gradient(to bottom, ' + o.bgA0 + ' 0%, ' + o.bgA92 + ' 100%);' +
      '}',

      // ─── Full detail page ────────────────────────────────
      // Fix: buttons hidden on landscape tablets/TV — ensure buttons never clipped.
      B + ' .full-start__body { height: auto !important; min-height: 20em; overflow: visible !important; }',
      B + ' .full-start { overflow: visible !important; }',
      B + ' .full-start__buttons { position: relative; z-index: 5; }',
      // Fix: cinematic layout (full-start-new) buttons pushed off-screen by long content.
      B + ' .full-start-new__body { overflow: visible !important; }',
      B + ' .full-start-new__buttons { flex-shrink: 0 !important; min-height: 2.5em; }',
      B + ' .full-start-new__buttons .full-start__button { flex-shrink: 0 !important; }',
      // Limit description height in cinematic mode so buttons always fit.
      B + ' .full-start-new .full-descr-text { max-height: 5em; overflow: hidden; }',
      // Ensure reactions don\'t push buttons off screen.
      B + ' .full-start-new .info__reactions { flex-wrap: nowrap; overflow: hidden; max-width: 100%; }',
      // Cinema description: limit to 3 lines so buttons stay visible on TV
      B + ' .cinema-descr { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }',
      B + ' .full-start__background.loaded { opacity: 0.55; }',
      B + ' .full-start__background.dim { opacity: 0.18; }',
      B + ' .full-start__title { font-weight: 700; letter-spacing: -0.01em; }',
      B + ' .full-start__title-original { color: ' + o.accentA50 + '; font-weight: 400; }',
      B + ' .full-start__tag { background: ' + o.accentA10 + '; border: 1px solid ' + o.accentA15 + '; border-radius: 0.5em; }',
      B + ' .full-start__tag.tag--quality {' +
      '  background: ' + o.grad + ' !important; color: ' + o.gradText + ' !important; border: none;' +
      '}',
      B + ' .full-start__button { border-color: rgba(255,255,255,0.2); border-radius: 0.6em; transition: all 0.2s ease; }',
      B + ' .full-start__button.focus {' +
      '  background: ' + o.grad + '; color: ' + o.gradText + '; border-color: transparent;' +
      '  box-shadow: 0 4px 20px ' + o.accentA30 + ';' +
      '}',
      B + ' .full-start__poster.focus img { box-shadow: 0 0 0 3px ' + o.accent + ', 0 0 30px ' + o.accentA30 + '; }',
      B + ' .full-start__img { border-radius: 1.1em; }',
      B + ' .full-start__rating { border-bottom-color: ' + o.accentA08 + '; }',
      B + ' .full-person.focus,' +
      B + ' .full-descr__tag.focus,' +
      B + ' .simple-button.focus { background: ' + o.grad + '; color: ' + o.gradText + '; }',

      // ─── Settings ────────────────────────────────────────
      B + ' .settings__content,' +
      B + ' .settings-input__content {' +
      '  background: ' + o.panelBg + ';' +
      '  backdrop-filter: blur(32px); -webkit-backdrop-filter: blur(32px);' +
      '  border-left: 1px solid ' + o.accentA06 + ';' +
      '}',
      B + ' .settings__title { font-weight: 700; letter-spacing: 0.02em; }',
      B + ' .settings-folder { border-radius: 0.8em; margin: 0.1em 0.5em; transition: all 0.2s ease; }',
      B + ' .settings-folder.focus { background: ' + o.accentA10 + '; }',
      B + ' .settings-folder.focus .settings-folder__icon { filter: none; }',
      B + ' .settings-param { border-radius: 0.6em; transition: background 0.2s ease; }',
      B + ' .settings-param.focus { background: ' + o.accentA10 + '; }',
      B + ' .settings-param-title > span { color: #fff; }',
      B + ' .settings-input__links { background-color: ' + o.accentA08 + '; }',

      // ─── Selectbox / Modal ───────────────────────────────
      B + ' .selectbox__content,' +
      B + ' .modal__content {' +
      '  background: ' + o.modalBg + ';' +
      '  backdrop-filter: blur(32px); -webkit-backdrop-filter: blur(32px);' +
      '  border: 1px solid ' + o.accentA08 + '; border-radius: 1.2em;' +
      '}',
      B + ' .selectbox-item { border-radius: 0.6em; margin: 0.1em 0.5em; transition: all 0.15s ease; }',
      B + ' .selectbox-item.focus,' +
      B + ' .selectbox-item.hover { background: ' + o.grad + '; color: ' + o.gradText + '; }',

      // ─── Search ──────────────────────────────────────────
      B + ' .search-source.active { background: ' + o.grad + '; color: ' + o.gradText + '; }',

      // ─── Player ──────────────────────────────────────────
      B + ' .player-panel .button.focus { background: ' + o.grad + '; color: ' + o.gradText + '; }',
      B + ' .time-line > div,' +
      B + ' .player-panel__position,' +
      B + ' .player-panel__position > div:after { background: ' + o.gradH + '; }',

      // ─── Torrents ────────────────────────────────────────
      B + ' .torrent-item__size,' +
      B + ' .torrent-item__exe,' +
      B + ' .torrent-item__viewed,' +
      B + ' .torrent-serial__size { background: ' + o.grad + '; color: ' + o.gradText + '; font-weight: 600; }',
      B + ' .torrent-serial { background-color: ' + o.accentA04 + '; }',
      B + ' .torrent-file.focus,' +
      B + ' .torrent-serial.focus { background-color: ' + o.accentA12 + '; }',
      B + ' .torrent-item.focus::after { border-color: ' + o.accent + '; }',

      // ─── Extensions ──────────────────────────────────────
      B + ' .extensions { background: ' + o.bg + '; }',
      B + ' .extensions__item,' +
      B + ' .extensions__block-add { background-color: ' + o.cardBg + '; border-radius: 1em; }',
      B + ' .extensions__item.focus::after,' +
      B + ' .extensions__block-add.focus::after { border-color: ' + o.accent + '; }',

      // ─── IPTV ────────────────────────────────────────────
      B + ' .iptv-list__item.focus,' +
      B + ' .iptv-menu__list-item.focus { background: ' + o.grad + '; color: ' + o.gradText + '; }',
      B + ' .iptv-channel { background-color: ' + o.cardBg + ' !important; }',
      B + ' .online-prestige.focus::after,' +
      B + ' .iptv-channel.focus::before,' +
      B + ' .iptv-channel.last--focus::before { border-color: ' + o.accent + ' !important; }',

      // ─── Markers ─────────────────────────────────────────
      B + ' .card__marker { background: ' + o.bgA70 + '; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }',
      B + ' .card__marker--look::before { background-color: ' + o.accent + '; }',
      B + ' .card__marker--viewed::before { background-color: ' + o.accent2 + '; }',

      // ─── Navigation bar ──────────────────────────────────
      B + ' .navigation-bar__body {' +
      '  background: ' + o.sidebarBg + '; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);' +
      '  border-top: 1px solid ' + o.accentA08 + ';' +
      '}',

      B + ' .broadcast__scan::after { border-top-color: ' + o.accent + '; }',

    ].join('\n');
  }

  // ═══════════════════════════════════════════════════════════
  //  Theme Definitions
  // ═══════════════════════════════════════════════════════════
  var THEMES = {
    neon: buildCSS({
      cls: 'neon--theme',
      bg: '#060b18', bgBlack: '#030610', text: '#e2e8f4', muted: '#8899bb',
      accent: '#00e5ff', accent2: '#7c4dff',
      grad: 'linear-gradient(135deg, #00e5ff, #7c4dff)',
      gradH: 'linear-gradient(90deg, #00e5ff, #7c4dff)',
      gradText: '#fff',
      cardBg: '#101828',
      sidebarBg: 'rgba(8,14,30,0.85)',
      panelBg: 'rgba(8,14,30,0.92)',
      modalBg: 'rgba(8,14,30,0.95)',
      bgA0: 'rgba(6,11,24,0)', bgA70: 'rgba(6,11,24,0.7)',
      bgA92: 'rgba(6,11,24,0.92)', bgA95: 'rgba(6,11,24,0.95)',
      accentA04: 'rgba(0,229,255,0.04)', accentA06: 'rgba(0,229,255,0.06)',
      accentA08: 'rgba(0,229,255,0.08)', accentA10: 'rgba(0,229,255,0.1)',
      accentA12: 'rgba(0,229,255,0.12)', accentA15: 'rgba(0,229,255,0.15)',
      accentA25: 'rgba(0,229,255,0.25)', accentA30: 'rgba(0,229,255,0.3)',
      accentA35: 'rgba(0,229,255,0.35)', accentA40: 'rgba(0,229,255,0.4)',
      accentA50: 'rgba(0,229,255,0.5)', accentA70: 'rgba(0,229,255,0.7)',
    }),
    aurora: buildCSS({
      cls: 'aurora--theme',
      bg: '#0d0618', bgBlack: '#060310', text: '#ece4f8', muted: '#9988bb',
      accent: '#c471ed', accent2: '#12c2e9',
      grad: 'linear-gradient(135deg, #c471ed, #f64f59)',
      gradH: 'linear-gradient(90deg, #12c2e9, #c471ed, #f64f59)',
      gradText: '#fff',
      cardBg: '#170d28',
      sidebarBg: 'rgba(13,6,24,0.85)',
      panelBg: 'rgba(13,6,24,0.92)',
      modalBg: 'rgba(13,6,24,0.95)',
      bgA0: 'rgba(13,6,24,0)', bgA70: 'rgba(13,6,24,0.7)',
      bgA92: 'rgba(13,6,24,0.92)', bgA95: 'rgba(13,6,24,0.95)',
      accentA04: 'rgba(196,113,237,0.04)', accentA06: 'rgba(196,113,237,0.06)',
      accentA08: 'rgba(196,113,237,0.08)', accentA10: 'rgba(196,113,237,0.1)',
      accentA12: 'rgba(196,113,237,0.12)', accentA15: 'rgba(196,113,237,0.15)',
      accentA25: 'rgba(196,113,237,0.25)', accentA30: 'rgba(196,113,237,0.3)',
      accentA35: 'rgba(196,113,237,0.35)', accentA40: 'rgba(196,113,237,0.4)',
      accentA50: 'rgba(196,113,237,0.5)', accentA70: 'rgba(196,113,237,0.7)',
    }),
    gold: buildCSS({
      cls: 'gold--theme',
      bg: '#110d08', bgBlack: '#0a0705', text: '#f0e8dc', muted: '#a89880',
      accent: '#d4a853', accent2: '#c47a30',
      grad: 'linear-gradient(135deg, #f6d365, #d4a853)',
      gradH: 'linear-gradient(90deg, #f6d365, #d4a853)',
      gradText: '#1a1208',
      cardBg: '#1e1710',
      sidebarBg: 'rgba(17,13,8,0.88)',
      panelBg: 'rgba(17,13,8,0.92)',
      modalBg: 'rgba(17,13,8,0.95)',
      bgA0: 'rgba(17,13,8,0)', bgA70: 'rgba(17,13,8,0.7)',
      bgA92: 'rgba(17,13,8,0.92)', bgA95: 'rgba(17,13,8,0.95)',
      accentA04: 'rgba(212,168,83,0.04)', accentA06: 'rgba(212,168,83,0.06)',
      accentA08: 'rgba(212,168,83,0.08)', accentA10: 'rgba(212,168,83,0.1)',
      accentA12: 'rgba(212,168,83,0.12)', accentA15: 'rgba(212,168,83,0.15)',
      accentA25: 'rgba(212,168,83,0.25)', accentA30: 'rgba(212,168,83,0.3)',
      accentA35: 'rgba(212,168,83,0.35)', accentA40: 'rgba(212,168,83,0.4)',
      accentA50: 'rgba(212,168,83,0.5)', accentA70: 'rgba(212,168,83,0.7)',
    }),
    mono: buildCSS({
      cls: 'mono--theme',
      bg: '#000000', bgBlack: '#000000', text: '#f0f0f0', muted: '#777777',
      accent: '#ffffff', accent2: '#888888',
      grad: '#ffffff',
      gradH: '#ffffff',
      gradText: '#000000',
      cardBg: '#111111',
      sidebarBg: 'rgba(0,0,0,0.9)',
      panelBg: 'rgba(8,8,8,0.95)',
      modalBg: 'rgba(8,8,8,0.97)',
      bgA0: 'rgba(0,0,0,0)', bgA70: 'rgba(0,0,0,0.7)',
      bgA92: 'rgba(0,0,0,0.92)', bgA95: 'rgba(0,0,0,0.95)',
      accentA04: 'rgba(255,255,255,0.04)', accentA06: 'rgba(255,255,255,0.06)',
      accentA08: 'rgba(255,255,255,0.08)', accentA10: 'rgba(255,255,255,0.1)',
      accentA12: 'rgba(255,255,255,0.12)', accentA15: 'rgba(255,255,255,0.15)',
      accentA25: 'rgba(255,255,255,0.25)', accentA30: 'rgba(255,255,255,0.3)',
      accentA35: 'rgba(255,255,255,0.35)', accentA40: 'rgba(255,255,255,0.4)',
      accentA50: 'rgba(255,255,255,0.5)', accentA70: 'rgba(255,255,255,0.7)',
    }),
    sunset: buildCSS({
      cls: 'sunset--theme',
      bg: '#140a0a', bgBlack: '#0a0505', text: '#f4e4e0', muted: '#bb8880',
      accent: '#ff6b35', accent2: '#e63946',
      grad: 'linear-gradient(135deg, #ff9a56, #e63946)',
      gradH: 'linear-gradient(90deg, #ffbe76, #ff6b35, #e63946)',
      gradText: '#fff',
      cardBg: '#241210',
      sidebarBg: 'rgba(20,10,10,0.88)',
      panelBg: 'rgba(20,10,10,0.92)',
      modalBg: 'rgba(20,10,10,0.95)',
      bgA0: 'rgba(20,10,10,0)', bgA70: 'rgba(20,10,10,0.7)',
      bgA92: 'rgba(20,10,10,0.92)', bgA95: 'rgba(20,10,10,0.95)',
      accentA04: 'rgba(255,107,53,0.04)', accentA06: 'rgba(255,107,53,0.06)',
      accentA08: 'rgba(255,107,53,0.08)', accentA10: 'rgba(255,107,53,0.1)',
      accentA12: 'rgba(255,107,53,0.12)', accentA15: 'rgba(255,107,53,0.15)',
      accentA25: 'rgba(255,107,53,0.25)', accentA30: 'rgba(255,107,53,0.3)',
      accentA35: 'rgba(255,107,53,0.35)', accentA40: 'rgba(255,107,53,0.4)',
      accentA50: 'rgba(255,107,53,0.5)', accentA70: 'rgba(255,107,53,0.7)',
    }),
    glass: buildCSS({
      cls: 'glass--theme',
      bg: '#08080c', bgBlack: '#040408', text: '#f5f5f7', muted: '#86868b',
      accent: '#c8deff', accent2: '#6e6e73',
      grad: 'linear-gradient(135deg, rgba(255,255,255,0.22), rgba(180,210,255,0.14))',
      gradH: 'linear-gradient(90deg, rgba(200,220,255,0.7), rgba(255,255,255,0.9))',
      gradText: '#fff',
      cardBg: 'rgba(255,255,255,0.05)',
      sidebarBg: 'rgba(255,255,255,0.06)',
      panelBg: 'rgba(255,255,255,0.07)',
      modalBg: 'rgba(255,255,255,0.08)',
      bgA0: 'rgba(8,8,12,0)', bgA70: 'rgba(8,8,12,0.7)',
      bgA92: 'rgba(8,8,12,0.92)', bgA95: 'rgba(8,8,12,0.95)',
      accentA04: 'rgba(200,222,255,0.04)', accentA06: 'rgba(200,222,255,0.06)',
      accentA08: 'rgba(200,222,255,0.1)', accentA10: 'rgba(200,222,255,0.12)',
      accentA12: 'rgba(200,222,255,0.15)', accentA15: 'rgba(200,222,255,0.18)',
      accentA25: 'rgba(200,222,255,0.25)', accentA30: 'rgba(200,222,255,0.3)',
      accentA35: 'rgba(200,222,255,0.35)', accentA40: 'rgba(200,222,255,0.4)',
      accentA50: 'rgba(200,222,255,0.5)', accentA70: 'rgba(200,222,255,0.7)',
    }) + '\n' + [
      // ─── Ambient light — gives glass something to refract ──
      'body.glass--theme::before {' +
      '  content: ""; position: fixed; inset: 0; z-index: -1; pointer-events: none;' +
      '  background:' +
      '    radial-gradient(ellipse 80% 60% at 15% 50%, rgba(80,130,255,0.12) 0%, transparent 60%),' +
      '    radial-gradient(ellipse 60% 80% at 85% 20%, rgba(180,100,255,0.09) 0%, transparent 55%),' +
      '    radial-gradient(ellipse 70% 50% at 50% 90%, rgba(80,200,255,0.08) 0%, transparent 50%);' +
      '}',

      // ─── Glass panels ──────────────────────────────────
      'body.glass--theme .settings__content,' +
      'body.glass--theme .settings-input__content,' +
      'body.glass--theme .selectbox__content,' +
      'body.glass--theme .modal__content {' +
      '  backdrop-filter: blur(56px) saturate(2) !important;' +
      '  -webkit-backdrop-filter: blur(56px) saturate(2) !important;' +
      '  border: 1px solid rgba(255,255,255,0.12) !important;' +
      '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(255,255,255,0.04), 0 24px 80px rgba(0,0,0,0.6);' +
      '}',
      'body.glass--theme.menu--open .wrap__left {' +
      '  backdrop-filter: blur(56px) saturate(2) !important;' +
      '  -webkit-backdrop-filter: blur(56px) saturate(2) !important;' +
      '  border-right: 1px solid rgba(255,255,255,0.12) !important;' +
      '  box-shadow: inset -1px 0 0 rgba(255,255,255,0.06), 6px 0 40px rgba(0,0,0,0.4);' +
      '}',

      // ─── Glass menu items ──────────────────────────────
      'body.glass--theme .menu__item { border-radius: 1em; border: 1px solid transparent; }',
      'body.glass--theme .menu__item.focus,' +
      'body.glass--theme .menu__item.traverse,' +
      'body.glass--theme .menu__item.hover {' +
      '  backdrop-filter: blur(24px) saturate(1.6); -webkit-backdrop-filter: blur(24px) saturate(1.6);' +
      '  border: 1px solid rgba(255,255,255,0.15) !important;' +
      '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 24px rgba(0,0,0,0.35) !important;' +
      '}',

      // ─── Glass buttons ─────────────────────────────────
      'body.glass--theme .full-start__button {' +
      '  border: 1px solid rgba(255,255,255,0.15) !important; border-radius: 0.8em;' +
      '  backdrop-filter: blur(20px) saturate(1.5); -webkit-backdrop-filter: blur(20px) saturate(1.5);' +
      '  background: rgba(255,255,255,0.07) !important;' +
      '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);' +
      '}',
      'body.glass--theme .full-start__button.focus {' +
      '  border-color: rgba(255,255,255,0.25) !important;' +
      '  backdrop-filter: blur(28px) saturate(2) !important; -webkit-backdrop-filter: blur(28px) saturate(2) !important;' +
      '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 8px 32px rgba(0,0,0,0.35) !important;' +
      '}',

      // ─── Glass cards ───────────────────────────────────
      'body.glass--theme .card__img {' +
      '  border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 4px 16px rgba(0,0,0,0.3);' +
      '}',
      'body.glass--theme .card.focus .card__view { transform: scale(1.06); }',
      'body.glass--theme .card.focus .card__view::after {' +
      '  border-color: rgba(255,255,255,0.3) !important;' +
      '  box-shadow: 0 0 30px rgba(200,222,255,0.2), 0 12px 48px rgba(0,0,0,0.5) !important;' +
      '  border-radius: 1.6em;' +
      '}',

      // ─── Glass select / settings items ─────────────────
      'body.glass--theme .selectbox-item.focus,' +
      'body.glass--theme .selectbox-item.hover {' +
      '  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);' +
      '  border: 1px solid rgba(255,255,255,0.12);' +
      '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.12);' +
      '}',
      'body.glass--theme .settings-folder.focus {' +
      '  border: 1px solid rgba(255,255,255,0.1);' +
      '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);' +
      '}',

      // ─── Glass navigation bar ──────────────────────────
      'body.glass--theme .navigation-bar__body {' +
      '  backdrop-filter: blur(56px) saturate(2) !important;' +
      '  -webkit-backdrop-filter: blur(56px) saturate(2) !important;' +
      '  border-top: 1px solid rgba(255,255,255,0.12) !important;' +
      '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 -8px 30px rgba(0,0,0,0.3);' +
      '}',

      // ─── Glass quality badges ──────────────────────────
      'body.glass--theme .card__quality {' +
      '  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);' +
      '  border: 1px solid rgba(255,255,255,0.15);' +
      '}',

      // ─── Glass extensions ──────────────────────────────
      'body.glass--theme .extensions__item,' +
      'body.glass--theme .extensions__block-add {' +
      '  border: 1px solid rgba(255,255,255,0.08);' +
      '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.2);' +
      '}',
    ].join('\n'),

    // ═══════════════════════════════════════════════════════════
    //  Apple TV — Premium Cinematic Theme
    // ═══════════════════════════════════════════════════════════
    appletv: buildCSS({
      cls: 'appletv--theme',
      bg: '#000000', bgBlack: '#000000', text: '#f5f5f7', muted: '#86868b',
      accent: '#e8e8ed', accent2: '#a1a1a6',
      grad: 'rgba(255,255,255,0.2)',
      gradH: 'rgba(255,255,255,0.25)',
      gradText: '#fff',
      cardBg: '#1c1c1e',
      sidebarBg: 'rgba(0,0,0,0.92)',
      panelBg: 'rgba(28,28,30,0.88)',
      modalBg: 'rgba(28,28,30,0.92)',
      bgA0: 'rgba(0,0,0,0)', bgA70: 'rgba(0,0,0,0.7)',
      bgA92: 'rgba(0,0,0,0.92)', bgA95: 'rgba(0,0,0,0.95)',
      accentA04: 'rgba(255,255,255,0.04)', accentA06: 'rgba(255,255,255,0.06)',
      accentA08: 'rgba(255,255,255,0.08)', accentA10: 'rgba(255,255,255,0.1)',
      accentA12: 'rgba(255,255,255,0.12)', accentA15: 'rgba(255,255,255,0.15)',
      accentA25: 'rgba(255,255,255,0.25)', accentA30: 'rgba(255,255,255,0.3)',
      accentA35: 'rgba(255,255,255,0.35)', accentA40: 'rgba(255,255,255,0.4)',
      accentA50: 'rgba(255,255,255,0.5)', accentA70: 'rgba(255,255,255,0.7)',
    }) + '\n' + [
      'var(--atv)', // marker comment stripped by join

      // ─── Animations ──────────────────────────────────────
      '@keyframes appleSlideUp {' +
      '  from { opacity: 0; transform: translateY(24px); }' +
      '  to   { opacity: 1; transform: translateY(0); }' +
      '}',
      '@keyframes appleFadeIn {' +
      '  from { opacity: 0; }' +
      '  to   { opacity: 1; }' +
      '}',

      // ═══════════════════════════════════════════════════════
      //  CINEMATIC FULL-START PAGE (applecation-style)
      // ═══════════════════════════════════════════════════════

      // Background: full-screen immersive, high opacity
      'body.appletv--theme .full-start__background.loaded {' +
      '  opacity: 0.85 !important; filter: none !important;' +
      '  object-fit: cover; width: 100%; height: 100%;' +
      '}',
      'body.appletv--theme .full-start__background.dim { opacity: 0.12 !important; }',

      // Hide poster — full-screen background replaces it
      'body.appletv--theme .full-start-new__left { display: none !important; }',
      'body.appletv--theme .full-start__poster { display: none !important; }',

      // Full-start-new: full viewport, content at bottom-left
      'body.appletv--theme .full-start-new {' +
      '  position: relative; min-height: 92vh; display: flex; align-items: flex-end;' +
      '}',

      // Bottom gradient — strong, covers lower 75%
      'body.appletv--theme .full-start-new::after {' +
      '  content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 75%; z-index: 0;' +
      '  pointer-events: none;' +
      '  background: linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0.2) 65%, transparent 100%);' +
      '}',
      // Left vignette
      'body.appletv--theme .full-start-new::before {' +
      '  content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none;' +
      '  background: linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 30%, transparent 60%);' +
      '}',

      // Body: left-aligned column layout
      'body.appletv--theme .full-start-new__body {' +
      '  position: relative; z-index: 1; width: 100%;' +
      '  padding: 0 2.5em 2em 2.5em !important;' +
      '  flex-direction: column !important; align-items: flex-start !important;' +
      '}',
      'body.appletv--theme .full-start-new__right {' +
      '  width: 100% !important; max-width: 50%;' +
      '}',

      // Head section
      'body.appletv--theme .full-start-new__head {' +
      '  animation: none !important; opacity: 1 !important; transform: none !important;' +
      '}',

      // Title: cinematic, large, left-aligned
      'body.appletv--theme .full-start-new__title {' +
      '  font-weight: 800 !important; font-size: 3.6em !important; letter-spacing: -0.02em !important;' +
      '  text-shadow: 0 4px 40px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.6);' +
      '  line-height: 1.0 !important; margin-bottom: 0.08em !important;' +
      '}',
      // Tagline
      'body.appletv--theme .full-start-new__tagline {' +
      '  color: rgba(255,255,255,0.55) !important; font-weight: 300 !important;' +
      '  font-style: italic; text-shadow: 0 1px 8px rgba(0,0,0,0.5);' +
      '}',

      // Rate line — compact badges
      'body.appletv--theme .full-start-new__rate-line {' +
      '  animation: none !important; opacity: 1 !important; transform: none !important;' +
      '  margin-top: 0.5em !important;' +
      '}',
      'body.appletv--theme .full-start__rate { text-shadow: 0 1px 6px rgba(0,0,0,0.6); }',
      'body.appletv--theme .full-start__pg,' +
      'body.appletv--theme .full-start__status {' +
      '  background: rgba(255,255,255,0.08) !important;' +
      '  border: 1px solid rgba(255,255,255,0.12) !important; border-radius: 0.4em;' +
      '  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);' +
      '}',

      // Details (duration, genre, quality)
      'body.appletv--theme .full-start-new__details {' +
      '  color: rgba(255,255,255,0.65) !important; font-size: 0.9em !important;' +
      '  text-shadow: 0 1px 4px rgba(0,0,0,0.4);' +
      '  animation: none !important; opacity: 1 !important; transform: none !important;' +
      '}',

      // Reactions
      'body.appletv--theme .full-start-new__reactions {' +
      '  animation: none !important; opacity: 1 !important; transform: none !important;' +
      '}',

      // Buttons — bottom row
      'body.appletv--theme .full-start-new__buttons {' +
      '  animation: none !important; opacity: 1 !important; transform: none !important;' +
      '  margin-top: 0.3em !important;' +
      '}',

      // Old layout compatibility
      'body.appletv--theme .full-start__title {' +
      '  font-weight: 800 !important; text-shadow: 0 4px 40px rgba(0,0,0,0.8);' +
      '}',

      // Cinema description (moved into full-start via JS)
      'body.appletv--theme .cinema-descr {' +
      '  color: rgba(255,255,255,0.75); font-weight: 300; font-size: 0.88em;' +
      '  line-height: 1.55; margin: 0.5em 0 0.3em; max-width: 85%;' +
      '  text-shadow: 0 1px 4px rgba(0,0,0,0.5);' +
      '  border-left: 2px solid rgba(255,255,255,0.2); padding-left: 0.8em;' +
      '  animation: none !important; opacity: 1 !important; transform: none !important;' +
      '}',
      // Quality badge
      'body.appletv--theme .cinema-quality-badge,' +
      'body.appletv--theme .cinema-time-badge,' +
      'body.appletv--theme .cinema-genre-badge {' +
      '  display: inline-flex; align-items: center; gap: 0.3em;' +
      '  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);' +
      '  border-radius: 0.5em; padding: 0.15em 0.5em; font-weight: 600;' +
      '  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);' +
      '  font-size: 0.85em; letter-spacing: 0.04em; color: #fff;' +
      '}',
      'body.appletv--theme .cinema-time-badge svg,' +
      'body.appletv--theme .cinema-genre-badge svg { width: 0.9em; height: 0.9em; opacity: 0.7; }',

      // Description section (below cinematic area)
      'body.appletv--theme .full-descr { animation: none !important; opacity: 1 !important; transform: none !important; }',
      'body.appletv--theme .full-descr__text {' +
      '  line-height: 1.6 !important; font-weight: 300 !important; color: rgba(245,245,247,0.85) !important;' +
      '}',
      'body.appletv--theme .full-descr__details { color: rgba(255,255,255,0.6) !important; }',
      'body.appletv--theme .full-descr__info-name { color: rgba(255,255,255,0.4) !important; }',

      // ─── Liquid glass buttons ─────────────────────────────
      'body.appletv--theme .full-start__button {' +
      '  background: rgba(255,255,255,0.1) !important; border: 1px solid rgba(255,255,255,0.18) !important;' +
      '  border-radius: 2em !important; backdrop-filter: blur(14px) saturate(1.25);' +
      '  -webkit-backdrop-filter: blur(14px) saturate(1.25);' +
      '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.12); transition: all 0.25s cubic-bezier(.16,1,.3,1);' +
      '}',
      'body.appletv--theme .full-start__button.focus {' +
      '  background: rgba(255,255,255,0.22) !important; border-color: rgba(255,255,255,0.35) !important;' +
      '  backdrop-filter: blur(20px) saturate(1.5) contrast(1.05) !important;' +
      '  -webkit-backdrop-filter: blur(20px) saturate(1.5) contrast(1.05) !important;' +
      '  box-shadow: 0 0 0 1px rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.25),' +
      '    0 8px 32px rgba(0,0,0,0.4) !important;' +
      '  transform: scale(1.05);' +
      '}',

      // ─── Glass menu items ─────────────────────────────────
      'body.appletv--theme .menu__item {' +
      '  border-radius: 1em; border: 1px solid transparent; transition: all 0.25s ease;' +
      '}',
      'body.appletv--theme .menu__item.focus,' +
      'body.appletv--theme .menu__item.traverse,' +
      'body.appletv--theme .menu__item.hover {' +
      '  background: rgba(255,255,255,0.12) !important;' +
      '  backdrop-filter: blur(14px) saturate(1.25) !important;' +
      '  -webkit-backdrop-filter: blur(14px) saturate(1.25) !important;' +
      '  border: 1px solid rgba(255,255,255,0.15) !important;' +
      '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 20px rgba(0,0,0,0.3) !important;' +
      '}',

      // ─── Glass panels ────────────────────────────────────
      'body.appletv--theme .settings__content,' +
      'body.appletv--theme .settings-input__content,' +
      'body.appletv--theme .selectbox__content,' +
      'body.appletv--theme .modal__content {' +
      '  backdrop-filter: blur(56px) saturate(2) !important;' +
      '  -webkit-backdrop-filter: blur(56px) saturate(2) !important;' +
      '  border: 1px solid rgba(255,255,255,0.1) !important;' +
      '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 24px 80px rgba(0,0,0,0.6);' +
      '  border-radius: 1.4em;' +
      '}',
      'body.appletv--theme.menu--open .wrap__left {' +
      '  backdrop-filter: blur(56px) saturate(2) !important;' +
      '  -webkit-backdrop-filter: blur(56px) saturate(2) !important;' +
      '  border-right: 1px solid rgba(255,255,255,0.1) !important;' +
      '  box-shadow: inset -1px 0 0 rgba(255,255,255,0.06), 6px 0 40px rgba(0,0,0,0.5);' +
      '}',

      // ─── Cards ────────────────────────────────────────────
      'body.appletv--theme .card__img {' +
      '  border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 4px 16px rgba(0,0,0,0.4);' +
      '}',
      'body.appletv--theme .card.focus .card__view { transform: scale(1.05); }',
      'body.appletv--theme .card.focus .card__view::after {' +
      '  border-color: rgba(255,255,255,0.25) !important;' +
      '  box-shadow: 0 0 20px rgba(255,255,255,0.1), 0 12px 40px rgba(0,0,0,0.5) !important;' +
      '  border-radius: 1.5em;' +
      '}',

      // ─── Episodes glass ──────────────────────────────────
      'body.appletv--theme .full-episode { transition: all 0.3s cubic-bezier(.16,1,.3,1); border-radius: 1em; }',
      'body.appletv--theme .full-episode.focus {' +
      '  transform: scale(1.03) translateY(-6px);' +
      '  background: rgba(255,255,255,0.08) !important;' +
      '  backdrop-filter: blur(14px) saturate(1.25); -webkit-backdrop-filter: blur(14px) saturate(1.25);' +
      '  border: 1px solid rgba(255,255,255,0.15);' +
      '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 40px rgba(0,0,0,0.4);' +
      '}',

      // ─── Persons glass ───────────────────────────────────
      'body.appletv--theme .full-person { transition: all 0.25s ease; border-radius: 1em; }',
      'body.appletv--theme .full-person.focus {' +
      '  background: rgba(255,255,255,0.1) !important;' +
      '  backdrop-filter: blur(14px) saturate(1.25); -webkit-backdrop-filter: blur(14px) saturate(1.25);' +
      '  border: 1px solid rgba(255,255,255,0.12);' +
      '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 24px rgba(0,0,0,0.3);' +
      '  transform: scale(1.04);' +
      '}',
      'body.appletv--theme .full-person__photo { border-radius: 50%; border: 2px solid rgba(255,255,255,0.15); }',
      'body.appletv--theme .full-person__name { font-weight: 600 !important; }',

      // ─── Typography overrides ─────────────────────────────
      'body.appletv--theme .items-line__title {' +
      '  font-weight: 600 !important; letter-spacing: 0.05em !important; text-transform: uppercase !important;' +
      '  font-size: 0.95em !important; color: rgba(255,255,255,0.6) !important;' +
      '  background: none !important; -webkit-text-fill-color: unset !important;' +
      '}',
      'body.appletv--theme .card__title { font-weight: 500 !important; letter-spacing: 0.01em; }',

      // ─── Select / settings glass ──────────────────────────
      'body.appletv--theme .selectbox-item.focus,' +
      'body.appletv--theme .selectbox-item.hover {' +
      '  background: rgba(255,255,255,0.12) !important;' +
      '  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);' +
      '  border: 1px solid rgba(255,255,255,0.1);' +
      '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.1);' +
      '}',
      'body.appletv--theme .settings-folder.focus {' +
      '  background: rgba(255,255,255,0.08) !important;' +
      '  border: 1px solid rgba(255,255,255,0.08);' +
      '}',

      // ─── Navigation bar glass ─────────────────────────────
      'body.appletv--theme .navigation-bar__body {' +
      '  backdrop-filter: blur(56px) saturate(2) !important;' +
      '  -webkit-backdrop-filter: blur(56px) saturate(2) !important;' +
      '  border-top: 1px solid rgba(255,255,255,0.1) !important;' +
      '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 -8px 30px rgba(0,0,0,0.4);' +
      '}',

      // ─── Quality badges ───────────────────────────────────
      'body.appletv--theme .card__quality {' +
      '  background: rgba(255,255,255,0.12) !important; color: #fff !important;' +
      '  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);' +
      '  border: 1px solid rgba(255,255,255,0.15); font-weight: 600;' +
      '}',
      'body.appletv--theme .full-start__tag.tag--quality,' +
      'body.appletv--theme .full-start__pg,' +
      'body.appletv--theme .full-start__status {' +
      '  background: rgba(255,255,255,0.12) !important; color: #fff !important;' +
      '  border: 1px solid rgba(255,255,255,0.18) !important; border-radius: 0.5em;' +
      '}',

      // ─── Extensions glass ─────────────────────────────────
      'body.appletv--theme .extensions__item,' +
      'body.appletv--theme .extensions__block-add {' +
      '  border: 1px solid rgba(255,255,255,0.06);' +
      '  box-shadow: 0 4px 16px rgba(0,0,0,0.3);' +
      '}',

      // ─── Header transparency ──────────────────────────────
      'body.appletv--theme .head__body {' +
      '  background: transparent !important;' +
      '}',

      // ─── Online prestige: progress bar & viewed badge ────
      // Timeline track — subtle glass background so length is visible
      'body.appletv--theme .online-prestige__timeline .time-line {' +
      '  background: rgba(255,255,255,0.08) !important;' +
      '  border-radius: 0.25em; overflow: hidden;' +
      '  border: 1px solid rgba(255,255,255,0.06);' +
      '}',
      // Progress bar fill — bright, visible on dark
      'body.appletv--theme .online-prestige__timeline .time-line > div {' +
      '  background: linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.7)) !important;' +
      '  border-radius: 0.25em;' +
      '  box-shadow: 0 0 6px rgba(255,255,255,0.15);' +
      '}',
      // Viewed badge — glass effect, visible on dark images
      'body.appletv--theme .online-prestige__viewed {' +
      '  background: rgba(255,255,255,0.15) !important;' +
      '  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);' +
      '  border: 1px solid rgba(255,255,255,0.2);' +
      '  box-shadow: 0 2px 8px rgba(0,0,0,0.4);' +
      '}',

    ].join('\n'),

    // ═══════════════════════════════════════════════════════════
    //  Netflix — Full Visual Overhaul
    // ═══════════════════════════════════════════════════════════
    netflix: buildCSS({
      cls: 'netflix--theme',
      bg: '#141414', bgBlack: '#0a0a0a', text: '#e5e5e5', muted: '#808080',
      accent: '#e50914', accent2: '#b81d24',
      grad: '#e50914',
      gradH: 'linear-gradient(90deg, #e50914, #b81d24)',
      gradText: '#fff',
      cardBg: '#181818',
      sidebarBg: 'rgba(20,20,20,0.95)',
      panelBg: 'rgba(20,20,20,0.97)',
      modalBg: 'rgba(20,20,20,0.98)',
      bgA0: 'rgba(20,20,20,0)', bgA70: 'rgba(20,20,20,0.7)',
      bgA92: 'rgba(20,20,20,0.92)', bgA95: 'rgba(20,20,20,0.95)',
      accentA04: 'rgba(229,9,20,0.04)', accentA06: 'rgba(229,9,20,0.06)',
      accentA08: 'rgba(229,9,20,0.08)', accentA10: 'rgba(229,9,20,0.1)',
      accentA12: 'rgba(229,9,20,0.12)', accentA15: 'rgba(229,9,20,0.15)',
      accentA25: 'rgba(229,9,20,0.25)', accentA30: 'rgba(229,9,20,0.3)',
      accentA35: 'rgba(229,9,20,0.35)', accentA40: 'rgba(229,9,20,0.4)',
      accentA50: 'rgba(229,9,20,0.5)', accentA70: 'rgba(229,9,20,0.7)',
    }) + '\n' + [

      // ═══════════════════════════════════════════════════════════
      //  CARD SYSTEM — Netflix-style complete overhaul
      // ═══════════════════════════════════════════════════════════

      // ─── Card base: clean, no decoration at rest ─────────────
      'body.netflix--theme .card {' +
      '  transition: z-index 0s 0.3s;' +  // delay z-index drop so card stays on top during scale-down
      '}',
      'body.netflix--theme .card.focus,' +
      'body.netflix--theme .card.hover {' +
      '  z-index: 10; transition: z-index 0s;' +
      '}',

      // Card image: tight radius, no background glow
      'body.netflix--theme .card__img {' +
      '  border-radius: 0.3em; background-color: #181818;' +
      '}',
      'body.netflix--theme .card__filter { border-radius: 0.3em; }',

      // Card view: Netflix spring animation
      'body.netflix--theme .card__view {' +
      '  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;' +
      '  margin-bottom: 0.4em; border-radius: 0.3em; overflow: visible;' +
      '}',

      // ─── Focus state: BIG scale + shadow lift ────────────────
      // Netflix scales ~1.3x on hover with a strong shadow
      'body.netflix--theme .card.focus .card__view {' +
      '  transform: scale(1.25) translateY(-0.8em); z-index: 10;' +
      '  box-shadow: 0 16px 48px rgba(0,0,0,0.9), 0 4px 12px rgba(0,0,0,0.7);' +
      '}',
      // Focus border: thin white, tight to image (not outside glow)
      'body.netflix--theme .card.focus .card__view::after,' +
      'body.netflix--theme .card.hover .card__view::after {' +
      '  top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;' +
      '  border: 2px solid rgba(255,255,255,0.7) !important;' +
      '  border-radius: 0.3em !important; box-shadow: none !important;' +
      '}',
      // Hover: lighter
      'body.netflix--theme .card.hover .card__view {' +
      '  transform: scale(1.08);' +
      '  box-shadow: 0 8px 24px rgba(0,0,0,0.6);' +
      '}',
      'body.netflix--theme .card.hover .card__view::after {' +
      '  border-color: rgba(255,255,255,0.3) !important;' +
      '}',

      // ─── Card title: hidden by default, appears on focus ─────
      'body.netflix--theme .card__title {' +
      '  font-weight: 600; font-size: 1em; color: #e5e5e5;' +
      '  line-height: 1.3; max-height: 2.6em; margin-top: 0.3em;' +
      '  opacity: 0.5; transition: opacity 0.3s ease;' +
      '}',
      'body.netflix--theme .card.focus .card__title {' +
      '  opacity: 1; color: #fff;' +
      '}',
      'body.netflix--theme .card__age {' +
      '  font-size: 0.8em; color: #808080; margin-top: 0.2em;' +
      '  opacity: 0.5; transition: opacity 0.3s ease;' +
      '}',
      'body.netflix--theme .card.focus .card__age { opacity: 1; }',

      // ─── Rating badge: Netflix green "Match" style ───────────
      'body.netflix--theme .card__vote {' +
      '  color: #46d369 !important; font-weight: 700; font-size: 1.1em !important;' +
      '  background: rgba(0,0,0,0.75) !important; border-radius: 0.2em;' +
      '  padding: 0.15em 0.4em !important; right: 0.5em !important; bottom: 0.5em !important;' +
      '}',

      // ─── Quality badge: compact Netflix-style ────────────────
      'body.netflix--theme .card__quality {' +
      '  background: transparent !important; color: #fff !important;' +
      '  font-weight: 800; font-size: 0.7em !important; letter-spacing: 0.08em;' +
      '  border: 1px solid rgba(255,255,255,0.5) !important; border-radius: 0.2em;' +
      '  padding: 0.2em 0.35em !important; left: 0.5em !important; bottom: 0.5em !important;' +
      '}',

      // ─── Type badge ──────────────────────────────────────────
      'body.netflix--theme .card__type {' +
      '  background: #e50914 !important; color: #fff !important;' +
      '  border-radius: 0.2em; left: 0.5em !important; top: 0.5em !important;' +
      '  font-size: 0.7em !important; font-weight: 700; padding: 0.2em 0.4em !important;' +
      '}',

      // ─── Card promo ──────────────────────────────────────────
      'body.netflix--theme .card__promo {' +
      '  background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.95) 100%) !important;' +
      '  border-radius: 0 0 0.3em 0.3em;' +
      '}',

      // ─── Card markers: Netflix red/green dots ────────────────
      'body.netflix--theme .card__marker {' +
      '  background: rgba(0,0,0,0.8) !important; border-radius: 0.2em; padding: 0.15em 0.5em !important;' +
      '}',
      'body.netflix--theme .card__marker--look::before { background-color: #e50914 !important; }',
      'body.netflix--theme .card__marker--viewed::before { background-color: #46d369 !important; }',
      'body.netflix--theme .card__marker--continued::before { background-color: #e50914 !important; }',

      // ─── Card icons ──────────────────────────────────────────
      'body.netflix--theme .card__icons-inner {' +
      '  background: rgba(0,0,0,0.7) !important; border-radius: 0.2em;' +
      '}',

      // ─── New episode badge ───────────────────────────────────
      'body.netflix--theme .card__new-episode > div {' +
      '  background-color: #e50914 !important; color: #fff !important;' +
      '  border-radius: 0.2em; font-weight: 700;' +
      '}',

      // ═══════════════════════════════════════════════════════════
      //  CATEGORY ROWS — tighter, Netflix-dense
      // ═══════════════════════════════════════════════════════════

      'body.netflix--theme .items-line { padding-bottom: 0.8em; }',
      'body.netflix--theme .items-line__head {' +
      '  margin-bottom: 0.4em; padding: 0 1.5em;' +
      '}',
      'body.netflix--theme .items-line__title {' +
      '  font-weight: 700 !important; font-size: 1.4em !important;' +
      '  letter-spacing: -0.01em !important; text-transform: none !important;' +
      '  color: #e5e5e5 !important;' +
      '  background: none !important; -webkit-text-fill-color: unset !important;' +
      '}',
      // "More" button
      'body.netflix--theme .items-line__more {' +
      '  background: transparent !important; color: #e5e5e5;' +
      '  font-size: 0.85em; font-weight: 600;' +
      '  border: 1px solid rgba(255,255,255,0.3); border-radius: 0.3em;' +
      '  transition: all 0.2s ease;' +
      '}',
      'body.netflix--theme .items-line__more.focus {' +
      '  background: #fff !important; color: #000 !important;' +
      '  border-color: #fff !important;' +
      '}',
      // Tighter min-height for rows
      'body.netflix--theme .items-line--type-cards { min-height: 20em; }',

      // ─── Scroll: Netflix edge fade ───────────────────────────
      'body.netflix--theme .scroll--mask .scroll__content {' +
      '  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%) !important;' +
      '  mask-image: linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%) !important;' +
      '}',

      // ─── Top row numbers: bold Netflix style ─────────────────
      'body.netflix--theme .items-line--type-top .items-cards .card::before {' +
      '  color: #1a1a1a !important;' +
      '  -webkit-text-stroke: 3px rgba(255,255,255,0.3) !important;' +
      '  font-weight: 900 !important;' +
      '}',

      // ═══════════════════════════════════════════════════════════
      //  HEADER — transparent to solid on scroll (Netflix style)
      // ═══════════════════════════════════════════════════════════

      'body.netflix--theme .head__body {' +
      '  background: linear-gradient(180deg, rgba(20,20,20,0.9) 0%, rgba(20,20,20,0) 100%) !important;' +
      '  padding-bottom: 3em;' +
      '}',
      'body.netflix--theme .head__title {' +
      '  font-weight: 700; color: #fff;' +
      '}',
      'body.netflix--theme .head__action.focus,' +
      'body.netflix--theme .head__action.hover {' +
      '  background: rgba(255,255,255,0.15) !important; color: #fff !important;' +
      '  box-shadow: none !important;' +
      '}',

      // ═══════════════════════════════════════════════════════════
      //  SIDEBAR — solid dark, no transparency tricks
      // ═══════════════════════════════════════════════════════════

      'body.netflix--theme.menu--open .wrap__left {' +
      '  background: #141414 !important; border-right: none !important;' +
      '  box-shadow: 4px 0 40px rgba(0,0,0,0.8) !important;' +
      '}',
      'body.netflix--theme .menu__item {' +
      '  border-radius: 0.3em; transition: all 0.15s ease;' +
      '}',
      'body.netflix--theme .menu__item.focus,' +
      'body.netflix--theme .menu__item.traverse,' +
      'body.netflix--theme .menu__item.hover {' +
      '  background: rgba(255,255,255,0.08) !important; color: #fff !important;' +
      '  box-shadow: none !important;' +
      '}',
      'body.netflix--theme .menu__text {' +
      '  font-weight: 500; letter-spacing: 0.02em;' +
      '}',

      // ═══════════════════════════════════════════════════════════
      //  SETTINGS / MODALS — solid dark panels
      // ═══════════════════════════════════════════════════════════

      'body.netflix--theme .settings__content,' +
      'body.netflix--theme .settings-input__content {' +
      '  background: #181818 !important; border-left: none !important;' +
      '  box-shadow: -4px 0 40px rgba(0,0,0,0.7);' +
      '}',
      'body.netflix--theme .settings__title { font-weight: 700; color: #fff; }',
      'body.netflix--theme .selectbox__content,' +
      'body.netflix--theme .modal__content {' +
      '  background: #1c1c1c !important; border: 1px solid rgba(255,255,255,0.06) !important;' +
      '  border-radius: 0.5em; box-shadow: 0 16px 60px rgba(0,0,0,0.8);' +
      '}',
      'body.netflix--theme .settings-folder { border-radius: 0.3em; }',
      'body.netflix--theme .settings-folder.focus {' +
      '  background: rgba(255,255,255,0.06) !important;' +
      '}',
      'body.netflix--theme .settings-param { border-radius: 0.3em; }',
      'body.netflix--theme .settings-param.focus {' +
      '  background: rgba(255,255,255,0.05) !important;' +
      '}',
      'body.netflix--theme .selectbox-item { border-radius: 0.3em; }',
      'body.netflix--theme .selectbox-item.focus,' +
      'body.netflix--theme .selectbox-item.hover {' +
      '  background: rgba(255,255,255,0.08) !important; color: #fff !important;' +
      '}',
      'body.netflix--theme .settings-input__links {' +
      '  background-color: rgba(255,255,255,0.06) !important;' +
      '}',

      // ═══════════════════════════════════════════════════════════
      //  FULL DETAIL PAGE — cinematic Netflix style
      // ═══════════════════════════════════════════════════════════

      'body.netflix--theme .full-start__background.loaded { opacity: 0.65 !important; filter: brightness(0.9) !important; }',
      'body.netflix--theme .full-start__background.dim { opacity: 0.12 !important; }',

      // Title: massive, tight leading
      'body.netflix--theme .full-start__title {' +
      '  font-weight: 900 !important; letter-spacing: -0.03em;' +
      '  text-shadow: 0 2px 20px rgba(0,0,0,0.7);' +
      '}',
      'body.netflix--theme .full-start__title-original { color: rgba(255,255,255,0.4) !important; }',
      'body.netflix--theme .full-start__img { border-radius: 0.3em; }',

      // Tags
      'body.netflix--theme .full-start__tag {' +
      '  background: rgba(255,255,255,0.06) !important;' +
      '  border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 0.3em;' +
      '}',
      'body.netflix--theme .full-start__tag.tag--quality {' +
      '  background: transparent !important; border: 1px solid rgba(255,255,255,0.5) !important;' +
      '  color: #fff !important; font-weight: 800;' +
      '}',

      // Buttons: Netflix Play (white) / More Info (gray)
      'body.netflix--theme .full-start__button {' +
      '  border-radius: 0.25em !important;' +
      '  border: none !important;' +
      '  background: rgba(109,109,110,0.7) !important; color: #fff !important;' +
      '  font-weight: 700 !important;' +
      '  transition: all 0.2s ease;' +
      '}',
      'body.netflix--theme .full-start__button.focus {' +
      '  background: #fff !important; color: #141414 !important;' +
      '  box-shadow: 0 0 0 0 transparent !important;' +
      '  transform: scale(1.03);' +
      '}',

      // Persons
      'body.netflix--theme .full-person.focus,' +
      'body.netflix--theme .full-descr__tag.focus,' +
      'body.netflix--theme .simple-button.focus {' +
      '  background: rgba(255,255,255,0.12) !important; color: #fff !important;' +
      '}',

      // Rating
      'body.netflix--theme .full-start__rating { border-bottom-color: rgba(255,255,255,0.06) !important; }',
      'body.netflix--theme .full-start__poster.focus img {' +
      '  box-shadow: 0 0 0 2px rgba(255,255,255,0.6), 0 0 20px rgba(0,0,0,0.5) !important;' +
      '}',

      // Description
      'body.netflix--theme .full-descr__text { color: rgba(255,255,255,0.8) !important; line-height: 1.6 !important; }',

      // ═══════════════════════════════════════════════════════════
      //  PLAYER
      // ═══════════════════════════════════════════════════════════

      'body.netflix--theme .player-panel .button.focus { background: #e50914 !important; color: #fff !important; }',
      'body.netflix--theme .time-line > div,' +
      'body.netflix--theme .player-panel__position,' +
      'body.netflix--theme .player-panel__position > div:after { background: #e50914 !important; }',

      // ═══════════════════════════════════════════════════════════
      //  TORRENTS
      // ═══════════════════════════════════════════════════════════

      'body.netflix--theme .torrent-item.focus::after { border-color: rgba(255,255,255,0.4) !important; }',
      'body.netflix--theme .torrent-item__size,' +
      'body.netflix--theme .torrent-item__exe,' +
      'body.netflix--theme .torrent-item__viewed,' +
      'body.netflix--theme .torrent-serial__size {' +
      '  background: rgba(255,255,255,0.1) !important; color: #e5e5e5 !important;' +
      '  font-weight: 600; border-radius: 0.2em;' +
      '}',
      'body.netflix--theme .torrent-serial { background-color: rgba(255,255,255,0.03) !important; }',
      'body.netflix--theme .torrent-file.focus,' +
      'body.netflix--theme .torrent-serial.focus { background-color: rgba(255,255,255,0.08) !important; }',

      // ═══════════════════════════════════════════════════════════
      //  EXTENSIONS
      // ═══════════════════════════════════════════════════════════

      'body.netflix--theme .extensions { background: #141414 !important; }',
      'body.netflix--theme .extensions__item,' +
      'body.netflix--theme .extensions__block-add {' +
      '  background-color: #181818 !important; border-radius: 0.3em;' +
      '  border: 1px solid rgba(255,255,255,0.04);' +
      '}',
      'body.netflix--theme .extensions__item.focus::after,' +
      'body.netflix--theme .extensions__block-add.focus::after {' +
      '  border-color: rgba(255,255,255,0.4) !important;' +
      '}',

      // ═══════════════════════════════════════════════════════════
      //  NAVIGATION BAR
      // ═══════════════════════════════════════════════════════════

      'body.netflix--theme .navigation-bar__body {' +
      '  background: #141414 !important; border-top: none !important;' +
      '  box-shadow: 0 -4px 20px rgba(0,0,0,0.6) !important;' +
      '}',

      // ═══════════════════════════════════════════════════════════
      //  IPTV
      // ═══════════════════════════════════════════════════════════

      'body.netflix--theme .iptv-list__item.focus,' +
      'body.netflix--theme .iptv-menu__list-item.focus {' +
      '  background: rgba(255,255,255,0.08) !important; color: #fff !important;' +
      '}',
      'body.netflix--theme .iptv-channel {' +
      '  background-color: #181818 !important; border-radius: 0.3em;' +
      '}',
      'body.netflix--theme .online-prestige.focus::after,' +
      'body.netflix--theme .iptv-channel.focus::before,' +
      'body.netflix--theme .iptv-channel.last--focus::before {' +
      '  border-color: rgba(255,255,255,0.4) !important;' +
      '}',

      // ═══════════════════════════════════════════════════════════
      //  ONLINE PRESTIGE — progress & viewed
      // ═══════════════════════════════════════════════════════════

      'body.netflix--theme .online-prestige__timeline .time-line {' +
      '  background: rgba(255,255,255,0.12) !important; border-radius: 0.15em;' +
      '}',
      'body.netflix--theme .online-prestige__timeline .time-line > div {' +
      '  background: #e50914 !important; border-radius: 0.15em;' +
      '}',
      'body.netflix--theme .online-prestige__viewed {' +
      '  background: rgba(229,9,20,0.2) !important;' +
      '  border: 1px solid rgba(229,9,20,0.4);' +
      '}',

      // ═══════════════════════════════════════════════════════════
      //  SEARCH
      // ═══════════════════════════════════════════════════════════

      'body.netflix--theme .search-source.active {' +
      '  background: rgba(255,255,255,0.1) !important; color: #fff !important;' +
      '  border: 1px solid rgba(255,255,255,0.2);' +
      '}',

      // ═══════════════════════════════════════════════════════════
      //  BROADCAST
      // ═══════════════════════════════════════════════════════════
      'body.netflix--theme .broadcast__scan::after { border-top-color: #e50914 !important; }',

      // ═══════════════════════════════════════════════════════════
      //  CATEGORY FULL (grid view)
      // ═══════════════════════════════════════════════════════════
      'body.netflix--theme .category-full .card { transition: transform 0.3s cubic-bezier(0.16,1,0.3,1); }',
      'body.netflix--theme .category-full .card.focus { z-index: 10; }',

    ].join('\n'),
  };

  // ═══════════════════════════════════════════════════════════
  //  Custom Theme Engine
  // ═══════════════════════════════════════════════════════════
  var CUSTOM_BG = {
    black: '#000000', charcoal: '#0c0c0c', navy: '#060b18',
    deepblue: '#08080c', purple: '#0d0618', brown: '#110d08', wine: '#140a0a',
  };
  var CUSTOM_ACCENT = {
    white: '#ffffff', cyan: '#00e5ff', blue: '#448aff', purple: '#b388ff',
    pink: '#ff80ab', red: '#ff5252', orange: '#ff6b35', yellow: '#ffd740',
    green: '#69f0ae', teal: '#64ffda', gold: '#d4a853',
  };

  function hexRgb(hex) {
    return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  }
  function cR(hex, a) { var c = hexRgb(hex); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  function buildCustomTheme() {
    var bgHex = CUSTOM_BG[Lampa.Storage.get('lampac_custom_bg', 'black')] || '#000000';
    var acHex = CUSTOM_ACCENT[Lampa.Storage.get('lampac_custom_accent', 'cyan')] || '#00e5ff';
    var ac2Hex = CUSTOM_ACCENT[Lampa.Storage.get('lampac_custom_accent2', 'purple')] || '#b388ff';
    var focusStyle = Lampa.Storage.get('lampac_custom_focus', 'gradient');
    var blurLvl = Lampa.Storage.get('lampac_custom_blur', 'medium');
    var cardFx = Lampa.Storage.get('lampac_custom_cards', 'both');

    var bR = hexRgb(bgHex), aR = hexRgb(acHex);
    var lum = (0.299 * aR[0] + 0.587 * aR[1] + 0.114 * aR[2]) / 255;
    var gradText = lum > 0.65 ? '#000' : '#fff';

    var grad, gradH;
    if (focusStyle === 'solid') {
      grad = acHex; gradH = acHex;
    } else if (focusStyle === 'glass') {
      grad = 'linear-gradient(135deg, rgba(255,255,255,0.22), ' + cR(acHex, 0.12) + ')';
      gradH = 'linear-gradient(90deg, ' + cR(acHex, 0.7) + ', rgba(255,255,255,0.9))';
      gradText = '#fff';
    } else {
      grad = 'linear-gradient(135deg, ' + acHex + ', ' + ac2Hex + ')';
      gradH = 'linear-gradient(90deg, ' + acHex + ', ' + ac2Hex + ')';
    }

    var muted = 'rgb(' + Math.round(aR[0] * 0.4 + 128) + ',' + Math.round(aR[1] * 0.4 + 128) + ',' + Math.round(aR[2] * 0.4 + 128) + ')';
    var cardBg = 'rgb(' + Math.min(bR[0] + 18, 42) + ',' + Math.min(bR[1] + 18, 42) + ',' + Math.min(bR[2] + 18, 42) + ')';
    var bgBlack = 'rgb(' + Math.max(bR[0] - 4, 0) + ',' + Math.max(bR[1] - 4, 0) + ',' + Math.max(bR[2] - 4, 0) + ')';

    var sidebarBg, panelBg, modalBg;
    if (focusStyle === 'glass') {
      sidebarBg = 'rgba(255,255,255,0.06)'; panelBg = 'rgba(255,255,255,0.07)'; modalBg = 'rgba(255,255,255,0.08)';
    } else {
      sidebarBg = cR(bgHex, 0.85); panelBg = cR(bgHex, 0.92); modalBg = cR(bgHex, 0.95);
    }

    var css = buildCSS({
      cls: 'custom--theme', bg: bgHex, bgBlack: bgBlack, text: '#f0f0f4', muted: muted,
      accent: acHex, accent2: ac2Hex, grad: grad, gradH: gradH, gradText: gradText,
      cardBg: cardBg, sidebarBg: sidebarBg, panelBg: panelBg, modalBg: modalBg,
      bgA0: cR(bgHex, 0), bgA70: cR(bgHex, 0.7), bgA92: cR(bgHex, 0.92), bgA95: cR(bgHex, 0.95),
      accentA04: cR(acHex, 0.04), accentA06: cR(acHex, 0.06), accentA08: cR(acHex, 0.08),
      accentA10: cR(acHex, 0.1), accentA12: cR(acHex, 0.12), accentA15: cR(acHex, 0.15),
      accentA25: cR(acHex, 0.25), accentA30: cR(acHex, 0.3), accentA35: cR(acHex, 0.35),
      accentA40: cR(acHex, 0.4), accentA50: cR(acHex, 0.5), accentA70: cR(acHex, 0.7),
    });

    var extra = [], C = 'body.custom--theme';
    var blurMap = { none: 0, light: 16, medium: 32, heavy: 56 };
    var blurPx = blurMap[blurLvl] || 32;

    if (blurPx > 0) {
      var sat = blurPx >= 48 ? ' saturate(2)' : blurPx >= 28 ? ' saturate(1.5)' : '';
      var bf = 'blur(' + blurPx + 'px)' + sat;
      extra.push(
        C + ' .settings__content,' + C + ' .settings-input__content,' +
        C + ' .selectbox__content,' + C + ' .modal__content {' +
        '  backdrop-filter: ' + bf + ' !important; -webkit-backdrop-filter: ' + bf + ' !important; }'
      );
      extra.push(C + '.menu--open .wrap__left { backdrop-filter: ' + bf + ' !important; -webkit-backdrop-filter: ' + bf + ' !important; }');
      extra.push(C + ' .navigation-bar__body { backdrop-filter: ' + bf + ' !important; -webkit-backdrop-filter: ' + bf + ' !important; }');
    }

    if (cardFx === 'scale' || cardFx === 'both') {
      extra.push(C + ' .card.focus .card__view { transform: scale(1.06); }');
    }
    if (cardFx === 'glow' || cardFx === 'both') {
      extra.push(C + ' .card.focus .card__view::after { box-shadow: 0 0 25px ' + cR(acHex, 0.3) + ', 0 10px 40px rgba(0,0,0,0.4) !important; }');
    }

    if (focusStyle === 'glass') {
      extra.push(
        C + '::before { content: ""; position: fixed; inset: 0; z-index: -1; pointer-events: none;' +
        '  background: radial-gradient(ellipse 80% 60% at 15% 50%, ' + cR(acHex, 0.1) + ' 0%, transparent 60%),' +
        '  radial-gradient(ellipse 60% 80% at 85% 20%, ' + cR(ac2Hex, 0.08) + ' 0%, transparent 55%),' +
        '  radial-gradient(ellipse 70% 50% at 50% 90%, ' + cR(acHex, 0.06) + ' 0%, transparent 50%); }'
      );
      extra.push(
        C + ' .settings__content,' + C + ' .selectbox__content,' + C + ' .modal__content {' +
        '  border: 1px solid rgba(255,255,255,0.12) !important;' +
        '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 20px 60px rgba(0,0,0,0.5); }'
      );
      extra.push(
        C + ' .menu__item.focus,' + C + ' .menu__item.traverse,' + C + ' .menu__item.hover {' +
        '  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);' +
        '  border: 1px solid rgba(255,255,255,0.15) !important;' +
        '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 24px rgba(0,0,0,0.35) !important; }'
      );
      extra.push(
        C + ' .full-start__button { border: 1px solid rgba(255,255,255,0.15) !important;' +
        '  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); background: rgba(255,255,255,0.07) !important; }'
      );
      extra.push(C + ' .card__img { border: 1px solid rgba(255,255,255,0.06); }');
    }

    return css + '\n' + extra.join('\n');
  }

  // ─── Theme Application ──────────────────────────────────
  function applyTheme(name) {
    var existing = document.getElementById(STYLE_ID);
    if (existing) existing.parentNode.removeChild(existing);
    // Also remove ::before pseudo-element (custom/glass ambient)
    var ambientEl = document.getElementById(STYLE_ID + '-ambient');
    if (ambientEl) ambientEl.parentNode.removeChild(ambientEl);
    ALL_CLASSES.forEach(function (c) { document.body.classList.remove(c); });

    var css = (name === 'custom') ? buildCustomTheme() : THEMES[name];
    if (css) {
      var style = document.createElement('style');
      style.id = STYLE_ID;
      style.type = 'text/css';
      style.textContent = css;
      document.head.appendChild(style);
      document.body.classList.add(name + '--theme');
    }
  }

  // ─── Settings Registration ──────────────────────────────
  // Global fix: ensure full-start buttons never hidden by overflow/height constraints.
  // Applied regardless of theme — fixes cinematic layout on TV/tablets/mobile.
  (function() {
    var fixId = 'lampac-fullstart-fix';
    if (!document.getElementById(fixId)) {
      var s = document.createElement('style');
      s.id = fixId;
      s.textContent = [
        '.full-start__body { height: auto !important; min-height: 15em; overflow: visible !important; }',
        '.full-start { overflow: visible !important; }',
        '.full-start-new__body { overflow: visible !important; }',
        '.full-start-new__buttons, .full-start__buttons { flex-shrink: 0 !important; position: relative; z-index: 5; }',
        // TV/large screens: constrain right column so buttons never leave viewport
        '@media (min-width: 601px) {',
        '  .full-start-new__right { max-height: calc(100vh - 3em) !important; overflow: hidden !important; }',
        '  .cinema-descr { display: -webkit-box !important; -webkit-line-clamp: 3 !important; -webkit-box-orient: vertical !important; overflow: hidden !important; flex-shrink: 1 !important; }',
        '}',
      ].join('\n');
      document.head.appendChild(s);
    }
  })();

  function startPlugin() {
    window.lampac_theme_plugin = true;
    window.lampa_settings = window.lampa_settings || {};
    window.lampa_settings.blur_poster = false;

    function showInfo(msg) {
      if (window.Lampa && Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show(msg);
      else console.log('[theme]', msg);
    }

    function getDeviceType() {
      var w = window.innerWidth || 1280;
      if (w <= 600) return 'mobile';
      var tvHint = document.body.classList.contains('tv') || document.body.classList.contains('tv--device');
      return tvHint ? 'tv' : 'desktop';
    }

    function applyThemeProfile(name) {
      if (name === 'manual') return;
      var p = {
        movie: {
          lampac_theme: 'appletv',
          lampac_screen_layout: 'cinematic',
          lampac_screen_compact_mode: 'normal',
          lampac_screen_bg_dim: 'medium',
          lampac_screen_button_size: 'large',
          lampac_screen_button_size_desktop: 'large',
          lampac_screen_button_size_mobile: 'large'
        },
        series: {
          lampac_theme: 'glass',
          lampac_screen_layout: 'default',
          lampac_screen_compact_mode: 'compact',
          lampac_screen_bg_dim: 'low',
          lampac_screen_button_size: 'normal',
          lampac_screen_button_size_desktop: 'normal',
          lampac_screen_button_size_mobile: 'normal'
        },
        kids: {
          lampac_theme: 'sunset',
          lampac_screen_layout: 'default',
          lampac_screen_compact_mode: 'normal',
          lampac_screen_bg_dim: 'none',
          lampac_screen_button_size: 'xl',
          lampac_screen_button_size_desktop: 'xl',
          lampac_screen_button_size_mobile: 'xl'
        }
      }[name];
      if (!p) return;
      Object.keys(p).forEach(function (k) { Lampa.Storage.set(k, p[k]); });
      applyTheme(Lampa.Storage.get(STORAGE_KEY, 'classic'));
      applyCardDisplay();
      applyScreenStyle();
      showInfo('Профиль применен: ' + name);
    }

    function handleToolsAction(action) {
      if (!action || action === 'none') return;
      try {
        var themeKeys = [
          'lampac_theme',
          'lampac_theme_profile',
          'lampac_theme_autotime',
          'lampac_theme_day',
          'lampac_theme_night',
          'lampac_custom_theme',
          'lampac_card_style',
          'lampac_card_badges',
          'lampac_card_text_mode',
          'lampac_card_grid',
          'lampac_screen_layout',
          'lampac_screen_mobile_layout',
          'lampac_screen_button_size_desktop',
          'lampac_screen_button_size_mobile',
          'lampac_screen_button_size',
          'lampac_screen_compact_mode',
          'lampac_screen_compact_meta',
          'lampac_screen_button_order',
          'lampac_screen_hide_extra_buttons',
          'lampac_screen_tv_mode',
          'lampac_screen_bg_dim',
          'lampac_screen_device_profiles',
          'lampac_screen_profile_mobile',
          'lampac_screen_profile_desktop',
          'lampac_screen_profile_tv',
          'lampac_screen_card_preset'
        ];

        function collectAllLampac() {
          var data = {};
          for (var i = 0; i < localStorage.length; i++) {
            var k = localStorage.key(i);
            if (k && k.indexOf('lampac_') === 0) data[k] = localStorage.getItem(k);
          }
          return data;
        }

        function collectProfileOnly() {
          var data = {};
          themeKeys.forEach(function (k) {
            var value = Lampa.Storage.get(k, null);
            if (value !== null && typeof value !== 'undefined') data[k] = value;
          });
          data.__meta = {
            exported_at: new Date().toISOString(),
            theme: Lampa.Storage.get('lampac_theme', 'classic'),
            profile: Lampa.Storage.get('lampac_theme_profile', 'default'),
            device_profiles: Lampa.Storage.get('lampac_screen_device_profiles', 'off')
          };
          return data;
        }

        function resetVisual() {
          var defaults = {
            lampac_theme: 'classic',
            lampac_theme_profile: 'default',
            lampac_theme_autotime: 'off',
            lampac_theme_day: 'classic',
            lampac_theme_night: 'appletv',
            lampac_card_style: 'default',
            lampac_card_badges: 'on',
            lampac_card_text_mode: 'default',
            lampac_card_grid: 'default',
            lampac_screen_layout: 'default',
            lampac_screen_mobile_layout: 'poster',
            lampac_screen_button_size: 'normal',
          lampac_screen_button_size_desktop: 'normal',
          lampac_screen_button_size_mobile: 'normal',
            lampac_screen_compact_mode: 'normal',
            lampac_screen_compact_meta: 'off',
            lampac_screen_button_order: 'online,torrent,trailer,book',
            lampac_screen_hide_extra_buttons: 'off',
            lampac_screen_tv_mode: 'off',
            lampac_screen_bg_dim: 'none',
            lampac_screen_device_profiles: 'off',
            lampac_screen_profile_mobile: 'normal',
            lampac_screen_profile_desktop: 'normal',
            lampac_screen_profile_tv: 'cinema',
            lampac_screen_card_preset: 'default'
          };
          Object.keys(defaults).forEach(function (k) { Lampa.Storage.set(k, defaults[k]); });
          applyTheme(Lampa.Storage.get(STORAGE_KEY, 'classic'));
          applyCardDisplay();
          applyScreenStyle();
          showInfo('Визуальные настройки сброшены');
        }

        function reapplyVisual() {
          applyTheme(Lampa.Storage.get(STORAGE_KEY, 'classic'));
          applyCardDisplay();
          applyScreenStyle();
          try {
            if (window.AlcopacTheme && typeof AlcopacTheme.reapply === 'function') AlcopacTheme.reapply();
          } catch (e) {}
          showInfo('Тема переприменена');
        }

        if (action === 'export') {
          var data = collectAllLampac();
          var json = JSON.stringify(data);
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(json).then(function () { showInfo('Настройки скопированы в буфер'); });
          } else {
            window.prompt('Скопируйте JSON настроек', json);
          }
        } else if (action === 'export_profile') {
          var profileJson = JSON.stringify(collectProfileOnly(), null, 2);
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(profileJson).then(function () { showInfo('Профиль скопирован в буфер'); });
          } else {
            window.prompt('Скопируйте JSON активного профиля', profileJson);
          }
        } else if (action === 'import') {
          var raw = window.prompt('Вставьте JSON настроек lampac');
          if (!raw) return;
          var parsed = JSON.parse(raw);
          Object.keys(parsed).forEach(function (k) {
            if (k.indexOf('lampac_') === 0) Lampa.Storage.set(k, parsed[k]);
          });
          reapplyVisual();
          showInfo('Импорт завершен');
        } else if (action === 'reset_visual') {
          resetVisual();
        } else if (action === 'reapply') {
          reapplyVisual();
        } else if (action === 'diagnostics') {
          var facade = window.AlcopacTheme || {};
          var list = [
            'Тема: ' + Lampa.Storage.get('lampac_theme', 'classic'),
            'Профиль темы: ' + Lampa.Storage.get('lampac_theme_profile', 'default'),
            'Экран: ' + Lampa.Storage.get('lampac_screen_layout', 'default'),
            'Mobile: ' + Lampa.Storage.get('lampac_screen_mobile_layout', 'poster'),
            'Кнопки TV/браузер: ' + Lampa.Storage.get('lampac_screen_button_size_desktop', Lampa.Storage.get('lampac_screen_button_size', 'normal')) + ' | Mobile: ' + Lampa.Storage.get('lampac_screen_button_size_mobile', Lampa.Storage.get('lampac_screen_button_size', 'normal')),
            'Компактный: ' + Lampa.Storage.get('lampac_screen_compact_mode', 'normal'),
            'Meta line: ' + Lampa.Storage.get('lampac_screen_compact_meta', 'off'),
            'Порядок кнопок: ' + Lampa.Storage.get('lampac_screen_button_order', 'online,torrent,trailer,book'),
            'Скрыть лишние: ' + Lampa.Storage.get('lampac_screen_hide_extra_buttons', 'off'),
            'Кнопка-папка: ' + Lampa.Storage.get('lampac_screen_buttons_folder', 'off'),
            'Легковесный режим: ' + Lampa.Storage.get('lampac_screen_tv_mode', 'off'),
            'Затемнение: ' + Lampa.Storage.get('lampac_screen_bg_dim', 'none'),
            'Профили устройств: ' + Lampa.Storage.get('lampac_screen_device_profiles', 'off'),
            'Mobile-профиль: ' + Lampa.Storage.get('lampac_screen_profile_mobile', 'normal'),
            'Desktop-профиль: ' + Lampa.Storage.get('lampac_screen_profile_desktop', 'normal'),
            'TV-профиль: ' + Lampa.Storage.get('lampac_screen_profile_tv', 'cinema'),
            'Facade: ' + (!!facade && !!facade.version ? facade.version : 'n/a'),
            'Device: ' + (facade.core && typeof facade.core.getDeviceType === 'function' ? facade.core.getDeviceType() : 'unknown')
          ];
          window.prompt('Диагностика', list.join('\\n'));
        }
      } catch (e) {
        showInfo('Ошибка действия: ' + e.message);
      } finally {
        Lampa.Storage.set('lampac_tools_action', 'none');
      }
    }

    function applyAutoThemeByTime() {
      if (Lampa.Storage.get('lampac_theme_autotime', 'off') !== 'on') return;
      var dayTheme = Lampa.Storage.get('lampac_theme_day', 'classic');
      var nightTheme = Lampa.Storage.get('lampac_theme_night', 'appletv');
      var hour = new Date().getHours();
      var target = (hour >= 7 && hour < 20) ? dayTheme : nightTheme;
      if (Lampa.Storage.get(STORAGE_KEY, 'classic') !== target) {
        Lampa.Storage.set(STORAGE_KEY, target);
        applyTheme(target);
      }
    }

    Lampa.Lang.add({
      lampac_theme_title: {
        ru: 'Оформление',
        en: 'Appearance',
        uk: 'Оформлення',
      },
      lampac_theme_select: {
        ru: 'Тема оформления',
        en: 'Theme',
        uk: 'Тема оформлення',
      },
      lampac_theme_select_descr: {
        ru: 'Выберите визуальную тему приложения',
        en: 'Choose the visual theme',
        uk: 'Виберіть візуальну тему',
      },
    });

    var ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

    Lampa.SettingsApi.addComponent({
      component: 'theme',
      icon: ICON,
      name: 'Сцены интерфейса',
    });

    // component theme_scene_appearance intentionally has no top-level entry;
    // it is opened from «Сцены интерфейса» only.

    if (window.Lampa && Lampa.Template && Lampa.Template.add) {
      Lampa.Template.add('settings_theme_scene_appearance', '<div></div>');
      Lampa.Template.add('settings_theme_scene_custom', '<div></div>');
      Lampa.Template.add('settings_theme_general', '<div></div>');
      Lampa.Template.add('settings_theme_schedule', '<div></div>');
      Lampa.Template.add('settings_theme_mobile', '<div></div>');
      Lampa.Template.add('settings_theme_custom', '<div></div>');
    }

    function openThemeSection(name) {
      if (!name || !window.Lampa || !Lampa.Settings || !Lampa.Settings.create) return;
      setTimeout(function () {
        Lampa.Settings.create(name, {
          onBack: function () {
            Lampa.Settings.create('theme_scene_appearance');
          }
        });
      }, 0);
    }

    function openSceneSection(name) {
      if (!name || !window.Lampa || !Lampa.Settings || !Lampa.Settings.create) return;
      setTimeout(function () {
        Lampa.Settings.create(name, {
          onBack: function () {
            Lampa.Settings.create('theme');
          }
        });
      }, 0);
    }

    function waitSceneUiClosed(done) {
      var tries = 0;
      function hasOpenSettingsUi() {
        return !!document.querySelector('.selectbox, .selectbox__content, .selectbox__body, .modal, .modal__content, .settings-input__content');
      }
      function check() {
        tries++;
        if (!hasOpenSettingsUi() || tries > 30) {
          setTimeout(function(){
            try { done && done(); } catch(e) {}
          }, 30);
          return;
        }
        setTimeout(check, 50);
      }
      setTimeout(check, 0);
    }

    function applyInterfaceSceneDeferred(name) {
      try {
        if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur();
      } catch(e) {}
      waitSceneUiClosed(function(){
        applyInterfaceScene(name);
      });
    }

    function applyInterfaceScene(name) {
      var scene = name || Lampa.Storage.get('lampac_interface_scene', 'classic');
      var map = {
        classic: {
          lampac_theme: 'classic',
          lampac_theme_profile: 'manual',
          lampac_theme_autotime: 'off',
          lampac_theme_day: 'classic',
          lampac_theme_night: 'appletv',
          lampac_screen_layout: 'default',
          lampac_screen_mobile_layout: 'poster',
          lampac_screen_compact_mode: 'normal',
          lampac_screen_compact_meta: 'off',
          lampac_screen_button_size: 'normal',
          lampac_screen_button_size_desktop: 'normal',
          lampac_screen_button_size_mobile: 'normal',
          lampac_screen_button_order: 'online,torrent,trailer,book',
          lampac_screen_hide_extra_buttons: 'off',
          lampac_screen_smart_order: 'on',
          lampac_screen_mobile_buttons_view: 'row',
          lampac_screen_title_logo: 'hide',
          lampac_screen_logo_size: 'small',
          lampac_screen_logo_us: 'hide',
          lampac_screen_tv_mode: 'off',
          lampac_screen_bg_dim: 'none',
          lampac_screen_watch_progress: 'off',
          lampac_screen_rating_style: 'compact',
          lampac_screen_ratings: 'show',
          lampac_screen_reactions: 'show',
          lampac_screen_tagline: 'show',
          lampac_screen_descr: 'show',
          lampac_screen_overlay_opacity: '86',
          lampac_screen_auto_contrast: 'off',
          lampac_screen_buttons_folder: 'off',
          lampac_screen_cinema_descr_size: 'medium',
          lampac_card_style: 'default',
          lampac_card_density: 'balance',
          lampac_card_focus_scale: 'normal',
          lampac_card_radius: 'medium',
          lampac_card_quality: 'show',
          lampac_card_vote: 'show',
          lampac_card_vote_style: 'default',
          lampac_card_title: 'show',
          lampac_card_title_size: 'normal',
          lampac_card_year: 'show',
          lampac_card_hide_viewed: 'off',
          lampac_card_no_poster: 'fallback'
        },
        androidtv: {
          lampac_theme: 'classic',
          lampac_theme_profile: 'manual',
          lampac_theme_autotime: 'off',
          lampac_theme_day: 'classic',
          lampac_theme_night: 'classic',
          lampac_screen_layout: 'cinematic',
          lampac_screen_mobile_layout: 'poster',
          lampac_screen_compact_mode: 'normal',
          lampac_screen_compact_meta: 'off',
          lampac_screen_button_size: 'normal',
          lampac_screen_button_size_desktop: 'normal',
          lampac_screen_button_size_mobile: 'large',
          lampac_screen_button_order: 'online,torrent,trailer,book',
          lampac_screen_hide_extra_buttons: 'off',
          lampac_screen_smart_order: 'on',
          lampac_screen_mobile_buttons_view: 'row',
          lampac_screen_title_logo: 'show',
          lampac_screen_logo_size: 'small',
          lampac_screen_logo_us: 'show',
          lampac_screen_tv_mode: 'off',
          lampac_screen_bg_dim: 'low',
          lampac_screen_watch_progress: 'on',
          lampac_screen_rating_style: 'logo',
          lampac_screen_ratings: 'show',
          lampac_screen_reactions: 'show',
          lampac_screen_tagline: 'show',
          lampac_screen_descr: 'show',
          lampac_screen_overlay_opacity: '86',
          lampac_screen_auto_contrast: 'off',
          lampac_screen_buttons_folder: 'off',
          lampac_screen_cinema_descr_size: 'medium',
          lampac_card_style: 'default',
          lampac_card_density: 'balance',
          lampac_card_focus_scale: 'soft',
          lampac_card_radius: 'medium',
          lampac_card_quality: 'show',
          lampac_card_vote: 'show',
          lampac_card_vote_style: 'default',
          lampac_card_title: 'show',
          lampac_card_title_size: 'normal',
          lampac_card_year: 'show'
        },

        appletv: {
          lampac_theme: 'appletv',
          lampac_theme_profile: 'manual',
          lampac_theme_autotime: 'off',
          lampac_theme_day: 'appletv',
          lampac_theme_night: 'appletv',
          lampac_screen_layout: 'cinematic',
          lampac_screen_mobile_layout: 'poster',
          lampac_screen_compact_mode: 'normal',
          lampac_screen_compact_meta: 'off',
          lampac_screen_button_size: 'normal',
          lampac_screen_button_size_desktop: 'normal',
          lampac_screen_button_size_mobile: 'large',
          lampac_screen_button_order: 'online,torrent,trailer,book',
          lampac_screen_hide_extra_buttons: 'off',
          lampac_screen_smart_order: 'on',
          lampac_screen_mobile_buttons_view: 'row',
          lampac_screen_title_logo: 'show',
          lampac_screen_logo_size: 'medium',
          lampac_screen_logo_us: 'show',
          lampac_screen_tv_mode: 'off',
          lampac_screen_bg_dim: 'medium',
          lampac_screen_watch_progress: 'on',
          lampac_screen_rating_style: 'logo',
          lampac_screen_ratings: 'show',
          lampac_screen_reactions: 'show',
          lampac_screen_tagline: 'show',
          lampac_screen_descr: 'show',
          lampac_screen_overlay_opacity: '94',
          lampac_screen_auto_contrast: 'on',
          lampac_screen_buttons_folder: 'off',
          lampac_screen_cinema_descr_size: 'medium',
          lampac_card_style: 'default',
          lampac_card_density: 'balance',
          lampac_card_focus_scale: 'soft',
          lampac_card_radius: 'large',
          lampac_card_quality: 'show',
          lampac_card_vote: 'show',
          lampac_card_vote_style: 'default',
          lampac_card_title: 'show',
          lampac_card_title_size: 'normal',
          lampac_card_year: 'show'
        },
        netflix: {
          lampac_theme: 'netflix',
          lampac_theme_profile: 'manual',
          lampac_theme_autotime: 'off',
          lampac_theme_day: 'netflix',
          lampac_theme_night: 'netflix',
          lampac_screen_layout: 'cinematic',
          lampac_screen_mobile_layout: 'poster',
          lampac_screen_compact_mode: 'normal',
          lampac_screen_compact_meta: 'off',
          lampac_screen_button_size: 'normal',
          lampac_screen_button_size_desktop: 'normal',
          lampac_screen_button_size_mobile: 'large',
          lampac_screen_button_order: 'online,torrent,trailer,book',
          lampac_screen_hide_extra_buttons: 'off',
          lampac_screen_smart_order: 'on',
          lampac_screen_mobile_buttons_view: 'row',
          lampac_screen_title_logo: 'show',
          lampac_screen_logo_size: 'medium',
          lampac_screen_logo_us: 'show',
          lampac_screen_tv_mode: 'off',
          lampac_screen_bg_dim: 'low',
          lampac_screen_watch_progress: 'on',
          lampac_screen_rating_style: 'compact',
          lampac_screen_ratings: 'show',
          lampac_screen_reactions: 'show',
          lampac_screen_tagline: 'show',
          lampac_screen_descr: 'show',
          lampac_screen_overlay_opacity: '90',
          lampac_screen_auto_contrast: 'off',
          lampac_screen_buttons_folder: 'off',
          lampac_screen_cinema_descr_size: 'medium',
          lampac_card_style: 'default',
          lampac_card_density: 'balance',
          lampac_card_focus_scale: 'soft',
          lampac_card_radius: 'small',
          lampac_card_quality: 'show',
          lampac_card_vote: 'show',
          lampac_card_vote_style: 'compact',
          lampac_card_title: 'show',
          lampac_card_title_size: 'normal',
          lampac_card_year: 'hide'
        },
        msx: {
          lampac_theme: 'classic',
          lampac_theme_profile: 'manual',
          lampac_theme_autotime: 'off',
          lampac_theme_day: 'classic',
          lampac_theme_night: 'classic',
          lampac_screen_layout: 'cinematic',
          lampac_screen_mobile_layout: 'poster',
          lampac_screen_compact_mode: 'compact',
          lampac_screen_compact_meta: 'off',
          lampac_screen_button_size: 'normal',
          lampac_screen_button_size_desktop: 'normal',
          lampac_screen_button_size_mobile: 'normal',
          lampac_screen_button_order: 'online,torrent,trailer,book',
          lampac_screen_hide_extra_buttons: 'off',
          lampac_screen_smart_order: 'on',
          lampac_screen_mobile_buttons_view: 'row',
          lampac_screen_title_logo: 'show',
          lampac_screen_logo_size: 'medium',
          lampac_screen_logo_us: 'hide',
          lampac_screen_tv_mode: 'on',
          lampac_screen_bg_dim: 'none',
          lampac_screen_watch_progress: 'off',
          lampac_screen_rating_style: 'compact',
          lampac_screen_ratings: 'hide',
          lampac_screen_reactions: 'show',
          lampac_screen_tagline: 'hide',
          lampac_screen_descr: 'show',
          lampac_screen_overlay_opacity: '82',
          lampac_screen_auto_contrast: 'off',
          lampac_screen_buttons_folder: 'off',
          lampac_screen_cinema_descr_size: 'medium',
          lampac_card_style: 'clean',
          lampac_card_density: 'compact',
          lampac_card_focus_scale: 'normal',
          lampac_card_radius: 'small',
          lampac_card_quality: 'hide',
          lampac_card_vote: 'hide',
          lampac_card_vote_style: 'compact',
          lampac_card_title: 'show',
          lampac_card_title_size: 'small',
          lampac_card_year: 'show'
        }
      }[scene] || null;
      if (scene === 'custom') {
        try { map = Lampa.Storage.get('lampac_interface_scene_custom', null); } catch(e) { map = null; }
      }
      Lampa.Storage.set('lampac_interface_scene', scene);
      if (!map) return;
      Object.keys(map).forEach(function (k) { Lampa.Storage.set(k, map[k]); });
      applyTheme(Lampa.Storage.get(STORAGE_KEY, 'classic'));
      applyCardDisplay();
      applyScreenStyle();
      setTimeout(function(){
        try {
          if (window.AlcopacTheme && AlcopacTheme.full && typeof AlcopacTheme.full.reorderSafe === 'function') {
            AlcopacTheme.full.reorderSafe();
          } else {
            promoteFolderButtons(true);
          }
        } catch(e){}
      }, 80);
    }

    Lampa.SettingsApi.addParam({
      component: 'theme',
      param: {
        name: 'lampac_interface_scene',
        type: 'select',
        values: {
          classic: 'Классика',
          androidtv: 'AndroidTV',
          appletv: 'AppleTV',
          netflix: 'Netflix',
          msx: 'MSX',
          custom: 'Моя сцена'
        },
        default: 'classic'
      },
      field: { name: 'Выбор сцены', description: 'Классика, AndroidTV, AppleTV, Netflix, MSX или Моя сцена' },
      onChange: function (v) { applyInterfaceSceneDeferred(v); }
    });

    Lampa.SettingsApi.addParam({
      component: 'theme',
      param: { name: 'lampac_open_scene_custom', type: 'button' },
      field: { name: 'Моя сцена', description: 'Сохранение, сброс и сцена по умолчанию' },
      onChange: function () { openSceneSection('theme_scene_custom'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_scene_custom',
      param: { type: 'title' },
      field: { name: 'Моя сцена' },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_scene_custom',
      param: { name: 'lampac_save_custom_scene', type: 'button' },
      field: { name: 'Сохранить как Моя сцена', description: 'Сохраняет текущие настройки оформления, экрана фильма и карточек в пользовательскую сцену' },
      onChange: function () {
        try {
          var keys = [
            'lampac_theme',
            'lampac_theme_profile',
            'lampac_theme_autotime',
            'lampac_theme_day',
            'lampac_theme_night',
            'lampac_screen_layout',
            'lampac_screen_mobile_layout',
            'lampac_screen_compact_mode',
            'lampac_screen_compact_meta',
            'lampac_screen_button_size_desktop',
            'lampac_screen_button_size_mobile',
            'lampac_screen_button_size',
            'lampac_screen_button_order',
            'lampac_screen_hide_extra_buttons',
            'lampac_screen_smart_order',
            'lampac_screen_mobile_buttons_view',
            'lampac_screen_title_logo',
            'lampac_screen_logo_size',
            'lampac_screen_logo_us',
            'lampac_screen_tv_mode',
            'lampac_screen_bg_dim',
            'lampac_screen_watch_progress',
            'lampac_screen_rating_style',
            'lampac_screen_ratings',
            'lampac_screen_reactions',
            'lampac_screen_tagline',
            'lampac_screen_descr',
            'lampac_screen_overlay_opacity',
            'lampac_screen_auto_contrast',
            'lampac_screen_buttons_folder',
            'lampac_card_style',
            'lampac_card_density',
            'lampac_card_focus_scale',
            'lampac_card_radius',
            'lampac_card_quality',
            'lampac_card_vote',
            'lampac_card_vote_style',
            'lampac_card_title',
            'lampac_card_title_size',
            'lampac_card_year',
            'lampac_card_hide_viewed',
            'lampac_card_no_poster'
          ];
          var data = {};
          keys.forEach(function(k){
            var val = Lampa.Storage.get(k, undefined);
            if (typeof val !== 'undefined') data[k] = val;
          });
          Lampa.Storage.set('lampac_interface_scene_custom', data);
          Lampa.Storage.set('lampac_interface_scene', 'custom');
          if (Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show('Моя сцена сохранена');
        } catch(e) {
          if (Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show('Не удалось сохранить сцену');
        }
      }
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_scene_custom',
      param: { name: 'lampac_delete_custom_scene', type: 'button' },
      field: { name: 'Сбросить Мою сцену', description: 'Удаляет сохранённую пользовательскую сцену' },
      onChange: function () {
        try {
          Lampa.Storage.set('lampac_interface_scene_custom', null);
          if (Lampa.Storage.get('lampac_interface_scene', 'classic') === 'custom') {
            Lampa.Storage.set('lampac_interface_scene', 'classic');
            applyInterfaceScene('classic');
          }
          if (Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show('Моя сцена сброшена');
        } catch(e) {}
      }
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_scene_custom',
      param: {
        name: 'lampac_interface_scene_default',
        type: 'select',
        values: {
          classic: 'Классика',
          androidtv: 'AndroidTV',
          appletv: 'AppleTV',
          netflix: 'Netflix',
          msx: 'MSX',
          custom: 'Моя сцена'
        },
        default: 'classic'
      },
      field: { name: 'Сцена по умолчанию', description: 'Применяется при первом запуске темы и после сброса текущей сцены' },
      onChange: function () {}
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_scene_custom',
      param: { name: 'lampac_apply_default_scene_now', type: 'button' },
      field: { name: 'Применить сцену по умолчанию', description: 'Сразу применяет сцену, выбранную как сцена по умолчанию' },
      onChange: function () {
        var scene = Lampa.Storage.get('lampac_interface_scene_default', 'classic');
        applyInterfaceSceneDeferred(scene);
        if (Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show('Сцена по умолчанию применена');
      }
    });

    Lampa.SettingsApi.addParam({
      component: 'theme',
      param: { type: 'title' },
      field: { name: '────────' },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme',
      param: { name: 'lampac_open_scene_appearance', type: 'button' },
      field: { name: 'Оформление', description: 'Тема, профили, расписание, мобильный фон и кастомная тема' },
      onChange: function () { openSceneSection('theme_scene_appearance'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme',
      param: { name: 'lampac_open_scene_screen', type: 'button' },
      field: { name: 'Экран фильма', description: 'Расположение, компактность, кнопки, логотип, визуал и профили' },
      onChange: function () { openSceneSection('theme_screen'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme',
      param: { name: 'lampac_open_scene_cards', type: 'button' },
      field: { name: 'Карточки', description: 'Вид карточек, бейджи, подписи, сетка и фокус' },
      onChange: function () { openSceneSection('theme_cards'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme',
      param: { name: 'lampac_open_scene_tools', type: 'button' },
      field: { name: 'Инструменты темы', description: 'Экспорт, импорт, переприменение и служебные действия' },
      onChange: function () { openSceneSection('theme_tools'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_scene_appearance',
      param: { type: 'title' },
      field: { name: 'Разделы настроек' },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_scene_appearance',
      param: { name: 'lampac_open_theme_general', type: 'button' },
      field: { name: 'Основное', description: 'Тема оформления и легковесный режим' },
      onChange: function () { openThemeSection('theme_general'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_scene_appearance',
      param: { name: 'lampac_open_theme_schedule', type: 'button' },
      field: { name: 'Профили и расписание', description: 'Профиль темы, авто-тема, день и ночь' },
      onChange: function () { openThemeSection('theme_schedule'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_scene_appearance',
      param: { name: 'lampac_open_theme_mobile', type: 'button' },
      field: { name: 'Мобильный фон', description: 'Фон мобильного экрана и его поведение' },
      onChange: function () { openThemeSection('theme_mobile'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_scene_appearance',
      param: { name: 'lampac_open_theme_custom', type: 'button' },
      field: { name: 'Своя тема', description: 'Цвета, фокус, размытие и карточки для кастомной темы' },
      onChange: function () { openThemeSection('theme_custom'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_general',
      param: {
        name: STORAGE_KEY,
        type: 'select',
        values: {
          classic: 'Классическая',
          neon: 'Неон',
          aurora: 'Аврора',
          gold: 'Золото',
          mono: 'Монохром',
          sunset: 'Закат',
          glass: 'Жидкое стекло',
          appletv: 'Apple TV',
          netflix: 'Netflix',
          custom: 'Своя тема',
        },
        default: 'classic',
      },
      field: {
        name: Lampa.Lang.translate('lampac_theme_select'),
        description: Lampa.Lang.translate('lampac_theme_select_descr'),
      },
      onChange: function (value) {
        try {
      var __alcopac_full_stage_style = document.getElementById('alcopac-full-stage-style');
      if (!__alcopac_full_stage_style) {
        __alcopac_full_stage_style = document.createElement('style');
        __alcopac_full_stage_style.id = 'alcopac-full-stage-style';
        __alcopac_full_stage_style.textContent = [
          '.alcopac-full-pending .full-start-new__title,',
          '.alcopac-full-pending .full-start__title,',
          '.alcopac-full-pending .full-start-new__details,',
          '.alcopac-full-pending .full-start__details,',
          '.alcopac-full-pending .full-start-new__buttons,',
          '.alcopac-full-pending .full-start__buttons,',
          '.alcopac-full-pending .full-start-new__rate-line,',
          '.alcopac-full-pending .full-start__rate-line,',
          '.alcopac-full-pending .full-start-new__tagline,',
          '.alcopac-full-pending .full-start__tagline,',
          '.alcopac-full-pending .full-start-new__desc,',
          '.alcopac-full-pending .full-start__desc {',
          '  opacity: 1 !important;',
          '  transition: none !important;',
          '}',
          '.full-start-new__title, .full-start__title, .full-start-new__details, .full-start__details,',
          '.full-start-new__buttons, .full-start__buttons, .full-start-new__rate-line, .full-start__rate-line,',
          '.full-start-new__tagline, .full-start__tagline, .full-start-new__desc, .full-start__desc {',
          '  transition: none !important;',
          '}',
          '.alcopac-buttons-pending .full-start-new__buttons,',
          '.alcopac-buttons-pending .full-start__buttons {',
          '  opacity: 0 !important;',
          '  pointer-events: none !important;',
          '}'
        ].join('\n');
        document.head.appendChild(__alcopac_full_stage_style);
      }
    } catch (e) {}

    if (!Lampa.Storage.get('lampac_screen_mobile_bg', '')) {
          Lampa.Storage.set('lampac_screen_mobile_bg', value === 'classic' ? 'poster' : 'black');
        }
        applyTheme(value);
        applyScreenStyle();
      },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_schedule',
      param: {
        name: 'lampac_theme_profile',
        type: 'select',
        values: { manual: 'Ручной', movie: 'Кино', series: 'Сериалы', kids: 'Детский' },
        default: 'manual',
      },
      field: {
        name: 'Профиль темы',
        description: 'Готовые наборы параметров',
      },
      onChange: applyThemeProfile,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_schedule',
      param: {
        name: 'lampac_theme_autotime',
        type: 'select',
        values: { off: 'Выключить', on: 'Включить' },
        default: 'off',
      },
      field: {
        name: 'Автотема по времени',
        description: 'Днем и ночью автоматически применяются разные темы',
      },
      onChange: function () {
        applyAutoThemeByTime();
      },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_schedule',
      param: {
        name: 'lampac_theme_day',
        type: 'select',
        values: {
          classic: 'Классическая', neon: 'Неон', aurora: 'Аврора', gold: 'Золото',
          mono: 'Монохром', sunset: 'Закат', glass: 'Жидкое стекло', appletv: 'Apple TV', netflix: 'Netflix', custom: 'Своя тема'
        },
        default: 'classic',
      },
      field: { name: 'Дневная тема', description: 'Используется с 07:00 до 19:59 при автотеме' },
      onChange: applyAutoThemeByTime,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_schedule',
      param: {
        name: 'lampac_theme_night',
        type: 'select',
        values: {
          classic: 'Классическая', neon: 'Неон', aurora: 'Аврора', gold: 'Золото',
          mono: 'Монохром', sunset: 'Закат', glass: 'Жидкое стекло', appletv: 'Apple TV', netflix: 'Netflix', custom: 'Своя тема'
        },
        default: 'appletv',
      },
      field: { name: 'Ночная тема', description: 'Используется с 20:00 до 06:59 при автотеме' },
      onChange: applyAutoThemeByTime,
    });

    // ─── Custom theme params ──────────────────────────────
    function refreshCustom() {
      if (Lampa.Storage.get(STORAGE_KEY, 'classic') === 'custom') applyTheme('custom');
    }

    Lampa.SettingsApi.addParam({
      component: 'theme_custom',
      param: {
        name: 'lampac_custom_bg',
        type: 'select',
        values: {
          black: 'Чёрный',
          charcoal: 'Графит',
          navy: 'Тёмно-синий',
          deepblue: 'Глубокий синий',
          purple: 'Тёмно-фиолетовый',
          brown: 'Тёмно-коричневый',
          wine: 'Бордовый',
        },
        default: 'black',
      },
      field: {
        name: 'Цвет фона',
        description: 'Для темы «Своя»',
      },
      onChange: refreshCustom,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_custom',
      param: {
        name: 'lampac_custom_accent',
        type: 'select',
        values: {
          cyan: 'Голубой',
          blue: 'Синий',
          purple: 'Фиолетовый',
          pink: 'Розовый',
          red: 'Красный',
          orange: 'Оранжевый',
          yellow: 'Жёлтый',
          green: 'Зелёный',
          teal: 'Бирюзовый',
          gold: 'Золотой',
          white: 'Белый',
        },
        default: 'cyan',
      },
      field: {
        name: 'Основной цвет',
        description: 'Акцентный цвет интерфейса',
      },
      onChange: refreshCustom,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_custom',
      param: {
        name: 'lampac_custom_accent2',
        type: 'select',
        values: {
          purple: 'Фиолетовый',
          cyan: 'Голубой',
          blue: 'Синий',
          pink: 'Розовый',
          red: 'Красный',
          orange: 'Оранжевый',
          yellow: 'Жёлтый',
          green: 'Зелёный',
          teal: 'Бирюзовый',
          gold: 'Золотой',
          white: 'Белый',
        },
        default: 'purple',
      },
      field: {
        name: 'Второй цвет',
        description: 'Для градиентов (режим «Градиент»)',
      },
      onChange: refreshCustom,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_custom',
      param: {
        name: 'lampac_custom_focus',
        type: 'select',
        values: {
          gradient: 'Градиент',
          solid: 'Сплошной',
          glass: 'Стекло',
        },
        default: 'gradient',
      },
      field: {
        name: 'Стиль фокуса',
        description: 'Тип подсветки активных элементов',
      },
      onChange: refreshCustom,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_custom',
      param: {
        name: 'lampac_custom_blur',
        type: 'select',
        values: {
          none: 'Нет',
          light: 'Лёгкое',
          medium: 'Среднее',
          heavy: 'Сильное',
        },
        default: 'medium',
      },
      field: {
        name: 'Размытие панелей',
        description: 'Интенсивность backdrop-blur',
      },
      onChange: refreshCustom,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_custom',
      param: {
        name: 'lampac_custom_cards',
        type: 'select',
        values: {
          both: 'Свечение + масштаб',
          glow: 'Только свечение',
          scale: 'Только масштаб',
          none: 'Без эффекта',
        },
        default: 'both',
      },
      field: {
        name: 'Эффект карточек',
        description: 'Анимация при фокусе на карточке',
      },
      onChange: refreshCustom,
    });

    // ═══════════════════════════════════════════════════════
    //  Card Display Customization
    // ═══════════════════════════════════════════════════════
    var CARD_STYLE_ID = 'lampac-card-display-style';

    function applyCardDisplay() {
      var existing = document.getElementById(CARD_STYLE_ID);
      if (existing) existing.parentNode.removeChild(existing);

      var rules = [];

      if (Lampa.Storage.get('lampac_card_quality', 'show') === 'hide') {
        rules.push('.card__quality { display: none !important; }');
      }
      if (Lampa.Storage.get('lampac_card_vote', 'show') === 'hide') {
        rules.push('.card__vote { display: none !important; }');
      }
      if (Lampa.Storage.get('lampac_card_title', 'show') === 'hide') {
        rules.push('.card__title { display: none !important; }');
      }
      if (Lampa.Storage.get('lampac_card_year', 'show') === 'hide') {
        rules.push('.card__age { display: none !important; }');
      } else if (Lampa.Storage.get('lampac_card_year', 'show') === 'focus') {
        rules.push('.card__age { opacity: 0; max-height: 0; overflow: hidden; transition: .18s ease; }');
        rules.push('.card.focus .card__age, .card.hover .card__age, .card.traverse .card__age { opacity: 1; max-height: 2em; }');
      }

      // Card corner radius
      var radiusMap = { small: '0.4em', medium: '1em', large: '1.6em', round: '2.2em' };
      var radius = radiusMap[Lampa.Storage.get('lampac_card_radius', 'medium')];
      if (radius) {
        rules.push('.card__img { border-radius: ' + radius + ' !important; }');
        rules.push('.card__view::after { border-radius: calc(' + radius + ' + 0.3em) !important; }');
      }

      // Title font size
      var titleSizeMap = { small: '0.82em', normal: '', large: '1.1em' };
      var titleSize = titleSizeMap[Lampa.Storage.get('lampac_card_title_size', 'normal')];
      if (titleSize) {
        rules.push('.card__title { font-size: ' + titleSize + ' !important; }');
      }

      // Grid density
      var density = Lampa.Storage.get('lampac_card_density', 'balance');
      if (density === 'compact') {
        rules.push('.items-line .card { margin-right: 0.28em !important; }');
        rules.push('.items-line .card .card__view { transform: scale(0.94); transform-origin: center top; }');
      } else if (density === 'large') {
        rules.push('.items-line .card { margin-right: 0.72em !important; }');
        rules.push('.items-line .card .card__view { transform: scale(1.04); transform-origin: center top; }');
      }

      // Focus scale
      var focusScaleMap = { soft: '1.03', normal: '1.06', strong: '1.09', xstrong: '1.12' };
      var focusScale = focusScaleMap[Lampa.Storage.get('lampac_card_focus_scale', 'normal')] || '1.06';
      rules.push('.card.focus .card__view { transform: scale(' + focusScale + ') !important; transition: transform .22s ease, box-shadow .22s ease; }');

      // Vote badge style
      var voteStyle = Lampa.Storage.get('lampac_card_vote_style', 'default');
      if (voteStyle === 'colored') {
        rules.push('.card__vote { padding: 0.2em 0.5em; border-radius: 0.4em; font-weight: 700; }');
        rules.push('.card__vote--good { background: rgba(76,175,80,0.85); color: #fff; }');
        rules.push('.card__vote--bad { background: rgba(244,67,54,0.85); color: #fff; }');
        rules.push('.card__vote--average { background: rgba(255,152,0,0.85); color: #fff; }');
        // Auto-color votes via JS will be handled separately
      } else if (voteStyle === 'pill') {
        rules.push('.card__vote {' +
          '  background: rgba(0,0,0,0.65); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);' +
          '  padding: 0.15em 0.5em; border-radius: 2em; font-weight: 600;' +
          '  border: 1px solid rgba(255,255,255,0.15);' +
          '}');
      }

      // Fallback poster
      if (Lampa.Storage.get('lampac_card_no_poster', 'fallback') === 'fallback') {
        rules.push('.card.lampac-card-fallback .card__img {' +
          "content:''; background: linear-gradient(135deg,#1a1f2b,#10141d) !important;" +
          '}');
      }

      if (rules.length) {
        var style = document.createElement('style');
        style.id = CARD_STYLE_ID;
        style.type = 'text/css';
        style.textContent = rules.join('\n');
        document.head.appendChild(style);
      }
      applyCardEnhancements();
    }

    function cardHasNoPoster(card) {
      var img = card && card.querySelector('.card__img');
      if (!img) return true;
      var src = img.currentSrc || img.src || '';
      if (!src) return true;
      return /img_broken\.svg|img_load\.svg/i.test(src);
    }

    function applyCardEnhancements() {
      var hideViewed = Lampa.Storage.get('lampac_card_hide_viewed', 'off') === 'on';
      var noPosterMode = Lampa.Storage.get('lampac_card_no_poster', 'fallback');
      var cards = document.querySelectorAll('.card');

      for (var i = 0; i < cards.length; i++) {
        var card = cards[i];
        card.classList.remove('lampac-card-fallback');
        card.style.display = '';

        if (hideViewed) {
          var viewed = card.querySelector('.icon--history, .card__marker--viewed, .card__marker--look');
          if (viewed) {
            card.style.display = 'none';
            continue;
          }
        }

        if (cardHasNoPoster(card)) {
          if (noPosterMode === 'hide') {
            card.style.display = 'none';
            continue;
          } else if (noPosterMode === 'fallback') {
            card.classList.add('lampac-card-fallback');
            var img = card.querySelector('.card__img');
            if (img) {
              img.src = './img/img_broken.svg';
            }
          }
        }

        var view = card.querySelector('.card__view');
        if (!view) continue;

      }
    }


    if (!Lampa.Storage.get('lampac_interface_scene', '')) {
      var initial_scene = Lampa.Storage.get('lampac_interface_scene_default', 'classic') || 'classic';
      Lampa.Storage.set('lampac_interface_scene', initial_scene);
      applyInterfaceScene(initial_scene);
    }

    // Migration: fix Netflix scene that had hide_extra_buttons='on' (caused missing buttons).
    if (Lampa.Storage.get('lampac_screen_hide_extra_buttons', 'off') === 'on') {
      Lampa.Storage.set('lampac_screen_hide_extra_buttons', 'off');
    }

    // ─── Card display settings component ─────────────────
    var CARD_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z"/></svg>';

    // component theme_cards intentionally has no top-level entry;
    // it is opened from «Сцены интерфейса» only.

    if (window.Lampa && Lampa.Template && Lampa.Template.add) {
      Lampa.Template.add('settings_theme_cards', '<div></div>');
      Lampa.Template.add('settings_theme_cards_badges', '<div></div>');
      Lampa.Template.add('settings_theme_cards_text', '<div></div>');
      Lampa.Template.add('settings_theme_cards_style', '<div></div>');
      Lampa.Template.add('settings_theme_cards_grid', '<div></div>');
    }

    function openCardSection(name) {
      if (!name || !window.Lampa || !Lampa.Settings || !Lampa.Settings.create) return;
      setTimeout(function () {
        Lampa.Settings.create(name, {
          onBack: function () {
            Lampa.Settings.create('theme_cards');
          }
        });
      }, 0);
    }

    Lampa.SettingsApi.addParam({
      component: 'theme_cards',
      param: { type: 'title' },
      field: { name: 'Разделы настроек' },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_cards',
      param: { name: 'lampac_open_cards_badges', type: 'button' },
      field: { name: 'Бейджи и статус', description: 'Качество, рейтинг, просмотренное' },
      onChange: function () { openCardSection('theme_cards_badges'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_cards',
      param: { name: 'lampac_open_cards_text', type: 'button' },
      field: { name: 'Текст и постеры', description: 'Название, размер текста, год, карточки без постера' },
      onChange: function () { openCardSection('theme_cards_text'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_cards',
      param: { name: 'lampac_open_cards_style', type: 'button' },
      field: { name: 'Стиль карточек', description: 'Скругление и внешний вид рейтинга' },
      onChange: function () { openCardSection('theme_cards_style'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_cards',
      param: { name: 'lampac_open_cards_grid', type: 'button' },
      field: { name: 'Сетка и фокус', description: 'Плотность сетки и увеличение карточек' },
      onChange: function () { openCardSection('theme_cards_grid'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_cards_badges',
      param: {
        name: 'lampac_card_quality',
        type: 'select',
        values: { show: 'Показывать', hide: 'Скрыть' },
        default: 'show',
      },
      field: { name: 'Бейдж качества', description: 'Значки 4K, HD на постере' },
      onChange: applyCardDisplay,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_cards_badges',
      param: {
        name: 'lampac_card_vote',
        type: 'select',
        values: { show: 'Показывать', hide: 'Скрыть' },
        default: 'show',
      },
      field: { name: 'Рейтинг', description: 'Оценка на постере' },
      onChange: applyCardDisplay,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_cards_style',
      param: {
        name: 'lampac_card_vote_style',
        type: 'select',
        values: { 'default': 'Стандартный', pill: 'Таблетка', colored: 'Цветной' },
        default: 'default',
      },
      field: { name: 'Стиль рейтинга', description: 'Внешний вид значка рейтинга' },
      onChange: applyCardDisplay,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_cards_text',
      param: {
        name: 'lampac_card_title',
        type: 'select',
        values: { show: 'Показывать', hide: 'Скрыть' },
        default: 'show',
      },
      field: { name: 'Название', description: 'Текст названия под карточкой' },
      onChange: applyCardDisplay,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_cards_text',
      param: {
        name: 'lampac_card_title_size',
        type: 'select',
        values: { small: 'Маленький', normal: 'Обычный', large: 'Большой' },
        default: 'normal',
      },
      field: { name: 'Размер названия', description: 'Размер шрифта названия' },
      onChange: applyCardDisplay,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_cards_style',
      param: {
        name: 'lampac_card_radius',
        type: 'select',
        values: { small: 'Малое', medium: 'Среднее', large: 'Большое', round: 'Максимальное' },
        default: 'medium',
      },
      field: { name: 'Скругление углов', description: 'Радиус скругления постера' },
      onChange: applyCardDisplay,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_cards_grid',
      param: {
        name: 'lampac_card_density',
        type: 'select',
        values: { compact: 'Компакт', balance: 'Баланс', large: 'Крупно' },
        default: 'balance',
      },
      field: { name: 'Плотность сетки', description: 'Визуальная плотность карточек в рядах' },
      onChange: applyCardDisplay,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_cards_grid',
      param: {
        name: 'lampac_card_focus_scale',
        type: 'select',
        values: { soft: 'Мягкий', normal: 'Нормальный', strong: 'Сильный', xstrong: 'Очень сильный' },
        default: 'normal',
      },
      field: { name: 'Увеличение при фокусе', description: 'Плавное увеличение карточки при наведении/фокусе' },
      onChange: applyCardDisplay,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_cards_text',
      param: {
        name: 'lampac_card_year',
        type: 'select',
        values: { show: 'Показывать', focus: 'Только при фокусе', hide: 'Скрыть' },
        default: 'show',
      },
      field: { name: 'Год выхода', description: 'Год под названием' },
      onChange: applyCardDisplay,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_cards_badges',
      param: {
        name: 'lampac_card_hide_viewed',
        type: 'select',
        values: { off: 'Выключить', on: 'Включить' },
        default: 'off',
      },
      field: { name: 'Скрыть просмотренные', description: 'Не показывать карточки с маркером просмотра' },
      onChange: applyCardDisplay,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_cards_text',
      param: {
        name: 'lampac_card_no_poster',
        type: 'select',
        values: { show: 'Показывать как есть', hide: 'Скрыть без постера', fallback: 'Подставлять fallback' },
        default: 'fallback',
      },
      field: { name: 'Карточки без постера', description: 'Скрытие или единая заглушка' },
      onChange: applyCardDisplay,
    });

    // ═══════════════════════════════════════════════════════
    //  Movie Screen Customization
    // ═══════════════════════════════════════════════════════
    var SCREEN_STYLE_ID = 'lampac-screen-style';

    (function ensureSplitButtonSizeDefaults(){
      var legacy = Lampa.Storage.get('lampac_screen_button_size', 'normal');
      if (!Lampa.Storage.get('lampac_screen_button_size_desktop')) Lampa.Storage.set('lampac_screen_button_size_desktop', legacy);
      if (!Lampa.Storage.get('lampac_screen_button_size_mobile')) Lampa.Storage.set('lampac_screen_button_size_mobile', legacy);
    })();

    function applyScreenStyle() {
      var existing = document.getElementById(SCREEN_STYLE_ID);
      if (existing) existing.parentNode.removeChild(existing);

      var rules = [];
      var layout = Lampa.Storage.get('lampac_screen_layout', 'default');
      var anim = Lampa.Storage.get('lampac_screen_anim', 'cascade');
      var showRatings = Lampa.Storage.get('lampac_screen_ratings', 'show');
      var showReactions = 'show';
      try { Lampa.Storage.set('lampac_screen_reactions', 'show'); } catch (e) {}
      try { Lampa.Storage.set('lampac_screen_reactions_count', 'show'); } catch (e) {}
      var showTagline = Lampa.Storage.get('lampac_screen_tagline', 'show');
      var ratingStyle = Lampa.Storage.get('lampac_screen_rating_style', 'logo');
      var showDescr = Lampa.Storage.get('lampac_screen_descr', 'show');
      var showTitleLogo = Lampa.Storage.get('lampac_screen_title_logo', 'show');
      if (showTitleLogo === true) showTitleLogo = 'show';
      if (showTitleLogo === false) showTitleLogo = 'hide';
      var logoAllowUS = Lampa.Storage.get('lampac_screen_logo_us', 'show');
      var logoSize = Lampa.Storage.get('lampac_screen_logo_size', 'medium');
      var logoDesktopSizeMap = { xs: '4.8em', small: '6.0em', medium: '7.2em', large: '8.8em', xl: '10.8em' };
      var logoMobileSizeMap = { xs: '3.2em', small: '4.0em', medium: '4.8em', large: '5.8em', xl: '7.0em' };
      var logoTvSizeMap = { xs: '5.6em', small: '7.0em', medium: '8.6em', large: '10.4em', xl: '12.6em' };
      var logoMaxHeight = logoDesktopSizeMap[logoSize] || logoDesktopSizeMap.medium;
      var logoMobileMaxHeight = logoMobileSizeMap[logoSize] || logoMobileSizeMap.medium;
      var logoTvMaxHeight = logoTvSizeMap[logoSize] || logoTvSizeMap.medium;
      var mobileMode = Lampa.Storage.get('lampac_screen_mobile_layout', 'poster');
      var deviceTypeForButtons = getDeviceType();
      var legacyButtonSize = Lampa.Storage.get('lampac_screen_button_size', 'normal');
      var buttonSizeMode = deviceTypeForButtons === 'mobile'
        ? Lampa.Storage.get('lampac_screen_button_size_mobile', legacyButtonSize)
        : Lampa.Storage.get('lampac_screen_button_size_desktop', legacyButtonSize);
      var compactScreen = Lampa.Storage.get('lampac_screen_compact_mode', 'normal');
      var compactMeta = Lampa.Storage.get('lampac_screen_compact_meta', 'off');
      var tvMode = Lampa.Storage.get('lampac_screen_tv_mode', 'off');
      var bgDim = Lampa.Storage.get('lampac_screen_bg_dim', 'none');
      var overlayOpacity = parseInt(Lampa.Storage.get('lampac_screen_overlay_opacity', '88'), 10);
      var mobileButtonsView = Lampa.Storage.get('lampac_screen_mobile_buttons_view', 'row');
      var autoContrast = Lampa.Storage.get('lampac_screen_auto_contrast', 'on');
      var deviceProfiles = Lampa.Storage.get('lampac_screen_device_profiles', 'off');
      var cardPreset = Lampa.Storage.get('lampac_screen_card_preset', 'default');
      var activeTheme = Lampa.Storage.get(STORAGE_KEY, 'classic');
      var storedMobileBg = Lampa.Storage.get('lampac_screen_mobile_bg', '');
      var mobileBgKey = storedMobileBg || (activeTheme === 'classic' ? 'poster' : 'black');
      var mobileBgMap = {
        black: '#000000',
        graphite: '#121418',
        navy: '#0b1420',
        brown: '#231a16',
        olive: '#1b231c',
        plum: '#211827'
      };
      var mobileBgColor = mobileBgKey === 'poster'
        ? 'var(--lampac-mobile-poster-bg, #18222c)'
        : (mobileBgMap[mobileBgKey] || '#000000');
      var mobileBgRgb = 'var(--lampac-mobile-poster-rgb, 24,34,44)';

      if (deviceProfiles === 'on') {
        var deviceType = getDeviceType();
        var profileName = Lampa.Storage.get('lampac_screen_profile_' + deviceType, 'normal');
        if (profileName === 'compact') {
          compactScreen = 'compact';
          buttonSizeMode = 'compact';
          if (deviceType === 'mobile') mobileMode = 'poster';
        } else if (profileName === 'cinema') {
          layout = 'cinematic';
          bgDim = 'medium';
          if (deviceType === 'mobile') mobileMode = 'bottom';
        } else if (profileName === 'kids') {
          buttonSizeMode = 'xl';
          compactScreen = 'normal';
          bgDim = 'none';
        }
      }
      if (!overlayOpacity || overlayOpacity < 45) overlayOpacity = 45;
      if (overlayOpacity > 98) overlayOpacity = 98;

      var buttonPresets = {
        compact: { d: '2.45em', dPad: '0.45em', dFont: '0.72em', m: '2.32em', mPad: '0.42em', mFont: '0.70em' },
        normal: { d: '3.2em', dPad: '0.90em', dFont: '0.85em', m: '3.00em', mPad: '0.78em', mFont: '0.82em' },
        large: { d: '4.05em', dPad: '1.18em', dFont: '1.02em', m: '3.75em', mPad: '1.00em', mFont: '0.94em' },
        xl: { d: '4.70em', dPad: '1.35em', dFont: '1.12em', m: '4.30em', mPad: '1.16em', mFont: '1.02em' }
      };
      var btn = buttonPresets[buttonSizeMode] || buttonPresets.normal;

      // ─── Cinematic layout (for non-appletv themes) ──────
      if (layout === 'cinematic') {
        rules.push('.full-start-new__left { display: none !important; }');
        rules.push('.full-start__poster { display: none !important; }');
        rules.push('.full-start-new {' +
          '  position: relative; min-height: 92vh; display: flex; align-items: flex-end; }');
        rules.push('.full-start__background.loaded { opacity: 0.85 !important; filter: none !important; }');
        rules.push('.full-start-new__body {' +
          '  position: relative; z-index: 1; width: 100%;' +
          '  padding: 0 2.5em 2em 2.5em !important;' +
          '  flex-direction: column !important; align-items: flex-start !important; }');
        rules.push('.full-start-new__right {' +
          '  width: 100% !important; max-width: 50%;' +
          '  max-height: calc(100vh - 4em) !important; overflow: hidden !important;' +
          '  display: flex !important; flex-direction: column !important;' +
          '}');
        // Ensure buttons are always visible — place them before description via order
        rules.push('.full-start-new__buttons { order: 5 !important; flex-shrink: 0 !important; }');
        rules.push('.full-start-new__logo { order: 1 !important; }');
        rules.push('.full-start-new__title { order: 1 !important; }');
        rules.push('.full-start-new__head { order: 2 !important; }');
        rules.push('.full-start-new__tagline { order: 2 !important; }');
        rules.push('.full-start-new__details { order: 3 !important; }');
        rules.push('.full-start-new__rate-line { order: 4 !important; }');
        rules.push('.full-start-new__reactions { order: 6 !important; }');
        rules.push('.cinema-descr { order: 7 !important; flex-shrink: 1 !important; overflow: hidden !important;' +
          '  display: -webkit-box !important; -webkit-line-clamp: 3 !important; -webkit-box-orient: vertical !important; }');
        rules.push('.full-start-new__title {' +
          '  font-size: 3.6em !important; font-weight: 800 !important;' +
          '  text-shadow: 0 4px 40px rgba(0,0,0,0.8); line-height: 1.0 !important; }');
        rules.push('.head__body { background: transparent !important; }');
      }

      // ─── Animations ─────────────────────────────────────
      if (anim === 'cascade') {
        rules.push('@keyframes screenSlideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }');
        rules.push('@keyframes screenFadeIn { from { opacity:0; } to { opacity:1; } }');
        rules.push('.full-start-new__head { animation: none !important; opacity: 1 !important; transform: none !important; }');
        rules.push('.full-start-new__rate-line { animation: none !important; opacity: 1 !important; transform: none !important; }');
        rules.push('.full-start-new__details { animation: none !important; opacity: 1 !important; transform: none !important; }');
        rules.push('.full-start-new__reactions { animation: none !important; opacity: 1 !important; transform: none !important; }');
        rules.push('.full-start-new__buttons { animation: none !important; opacity: 1 !important; transform: none !important; }');
        rules.push('.full-descr { animation: none !important; opacity: 1 !important; transform: none !important; }');
      } else if (anim === 'fade') {
        rules.push('@keyframes screenFadeIn { from { opacity:0; } to { opacity:1; } }');
        rules.push('.full-start-new__head, .full-start-new__rate-line,' +
          '.full-start-new__details, .full-start-new__reactions,' +
          '.full-start-new__buttons, .full-descr { animation: none !important; opacity: 1 !important; transform: none !important; }');
      }

      // ─── Hide elements ──────────────────────────────────
      if (showRatings === 'hide') {
        rules.push('.full-start-new__rate-line { display: none !important; }');
      }
      if (showReactions === 'hide') {
        rules.push('.full-start-new__reactions, .full-start__reactions { display: none !important; }');
      } else {
        rules.push('.full-start-new__reactions, .full-start__reactions { display: flex !important; }');
      }
      rules.push('.full-start-new__details, .full-start__details, .full-start-new__rate-line, .full-start__rate-line {' +
        '  display: flex !important; flex-wrap: wrap !important; align-items: center !important; justify-content: flex-start !important;' +
        '  gap: 0.42em !important; margin-left: 0 !important; padding-left: 0 !important;' +
        '}');
      rules.push('.full-start-new__reactions, .full-start__reactions {' +
        '  flex-wrap: wrap !important; align-items: center !important; justify-content: flex-start !important;' +
        '  gap: 0.42em !important; margin-left: 0 !important; padding-left: 0 !important;' +
        '}');
      rules.push('.full-start-new__details > *, .full-start__details > *, .full-start-new__rate-line > *, .full-start__rate-line > *, .full-start-new__reactions > *, .full-start__reactions > * {' +
        '  margin-left: 0 !important;' +
        '}');
      rules.push('.full-start-new__reactions > *, .full-start__reactions > * {' +
        '  display: inline-flex !important; align-items: center !important; justify-content: center !important; gap: 0.38em !important;' +
        '  min-height: 2em !important; padding: 0.28em 0.52em !important;' +
        '  background: rgba(255,255,255,0.06) !important; border: 1px solid rgba(255,255,255,0.1) !important;' +
        '  border-radius: 0.7em !important; box-shadow: inset 0 1px 0 rgba(255,255,255,0.06) !important;' +
        '  backdrop-filter: blur(16px) !important; -webkit-backdrop-filter: blur(16px) !important;' +
        '  font-size: 0.92em !important; line-height: 1 !important;' +
        '}');
      rules.push('.full-start-new__reactions > * img, .full-start__reactions > * img,' +
        ' .full-start-new__reactions > * svg, .full-start__reactions > * svg {' +
        '  width: 0.9em !important; height: 0.9em !important; flex: 0 0 auto !important;' +
        '}');
      rules.push('.full-start-new__reactions .alcopac-reaction-count, .full-start__reactions .alcopac-reaction-count {' +
        '  display: inline-flex; align-items: center; margin-left: 0 !important; font-size: 0.92em; font-weight: 700; opacity: 0.94;' +
        '}');
      rules.push('.full-start-new__reactions.alcopac-reaction-counts-hidden .alcopac-reaction-count, .full-start__reactions.alcopac-reaction-counts-hidden .alcopac-reaction-count { display: none !important; }');
      rules.push('.full-start-new__reactions.alcopac-reactions-hidden, .full-start__reactions.alcopac-reactions-hidden, .button--reaction.alcopac-reactions-hidden {' +
        '  display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;' +
        '}');
      if (showTagline === 'hide') {
        rules.push('.full-start-new__tagline { display: none !important; }');
      }
      if (showDescr === 'hide') {
        rules.push('.full-descr, .full-descr__text, .cinema-descr { display: none !important; }');
      }
      if (compactScreen === 'compact') {
        rules.push('.full-start-new__tagline { display: none !important; }');
        rules.push('.full-descr, .cinema-descr, .full-descr__text { display: none !important; }');
        rules.push('.full-start-new__right { row-gap: 0.2em !important; }');
        rules.push('.full-start-new__head, .full-start-new__details, .full-start-new__rate-line { margin-top: 0.25em !important; }');
      }
      if (compactMeta === 'on') {
        rules.push('.lampac-meta-line {' +
          '  margin-top: 0.35em !important; color: rgba(255,255,255,0.86); font-size: 0.92em;' +
          '  line-height: 1.35; white-space: normal; word-break: break-word;' +
          '}');
      }

      // ─── Rating style ───────────────────────────────────
      if (ratingStyle === 'default') {
        rules.push('.full-start__rate {' +
          '  background: rgba(255,255,255,0.06) !important;' +
          '  border: 1px solid rgba(255,255,255,0.1) !important;' +
          '  border-radius: 0.7em; padding: 0.28em 0.52em !important;' +
          '  display: inline-flex !important; align-items: center; gap: 0.38em;' +
          '  font-size: 0.92em !important; line-height: 1 !important;' +
          '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06); }');
        rules.push('.full-start__rate.hide { display: none !important; }');
        rules.push('.full-start__rate > div:first-child {' +
          '  color: #fff !important; font-weight: 700; font-size: 1em !important; line-height: 1; min-width: 2.1ch; text-align: center; }');
        rules.push('.full-start__rate .source--name,' +
          '.full-start__rate > div:last-child {' +
          '  color: #fff !important; font-weight: 700; font-size: 0.72em !important; letter-spacing: 0.03em; text-transform: uppercase; line-height: 1; }');
        rules.push('.full-start__rate.rate--tmdb .source--name, .full-start__rate.rate--tmdb > div:last-child { font-size: 0.72em !important; letter-spacing: 0.02em !important; }');
        rules.push('.full-start__pg, .full-start__status {' +
          '  background: rgba(255,255,255,0.06) !important;' +
          '  border: 1px solid rgba(255,255,255,0.1) !important;' +
          '  border-radius: 0.7em; padding: 0.28em 0.52em !important;' +
          '  font-weight: 600; font-size: 0.92em !important; line-height: 1; }');
      } else if (ratingStyle === 'colored' || ratingStyle === 'logo') {
        // Glass card base (match PG/status size)
        rules.push('.full-start__rate {' +
          '  background: rgba(255,255,255,0.06) !important;' +
          '  border: 1px solid rgba(255,255,255,0.1) !important;' +
          '  border-radius: 0.7em; padding: 0.3em 0.55em !important;' +
          '  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);' +
          '  display: inline-flex !important; align-items: center; gap: 0.35em;' +
          '  font-size: 0.9em; line-height: 1;' +
          '  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06); }');
        rules.push('.full-start__rate.hide { display: none !important; }');
        // Score — white, prominent
        rules.push('.full-start__rate > div:first-child {' +
          '  color: #fff !important; font-weight: 700; font-size: 1em; line-height: 1; }');

        if (ratingStyle === 'colored') {
          // Service name as colored text
          rules.push('.full-start__rate .source--name,' +
            '.full-start__rate > div:last-child {' +
            '  font-weight: 800; font-size: 0.7em; letter-spacing: 0.06em; text-transform: uppercase; }');
          rules.push('.full-start__rate.rate--imdb > div:last-child,' +
            '.full-start__rate.rate--imdb .source--name { color: #F5C518 !important; }');
          rules.push('.full-start__rate.rate--tmdb > div:last-child,' +
            '.full-start__rate.rate--tmdb .source--name { color: #01B4E4 !important; }');
          rules.push('.full-start__rate.rate--kp > div:last-child,' +
            '.full-start__rate.rate--kp .source--name { color: #FF6600 !important; }');
        } else {
          // Logo — restore original service logos
          rules.push('.full-start__rate .source--name,' +
            '.full-start__rate > div:last-child {' +
            '  font-weight: 900; font-size: 0.6em; letter-spacing: 0.06em;' +
            '  text-transform: uppercase; line-height: 1;' +
            '  padding: 0.2em 0.45em; border-radius: 0.35em; }');
          // IMDB — yellow badge with IMDb text icon
          rules.push('.full-start__rate.rate--imdb > div:last-child,' +
            '.full-start__rate.rate--imdb .source--name {' +
            '  font-size: 0 !important; padding: 0 !important;' +
            '  display: inline-block; width: 32px; height: 22px; min-width: 32px; border-radius: 4px;' +
            "  background: #F5C518 url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 24'%3E%3Ctext x='24' y='17.5' text-anchor='middle' font-family='Arial,Helvetica,sans-serif' font-weight='900' font-size='14' fill='%23000'%3EIMDb%3C/text%3E%3C/svg%3E\") no-repeat center;" +
            '  background-size: contain; }');
          // TMDB — green speech bubble logo
          rules.push('.full-start__rate.rate--tmdb > div:last-child,' +
            '.full-start__rate.rate--tmdb .source--name {' +
            '  font-size: 0 !important; padding: 0 !important;' +
            '  display: inline-block; width: 32px; height: 22px; min-width: 32px; border-radius: 4px;' +
            "  background: #0d253f url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 32'%3E%3Crect x='4' y='4' width='40' height='22' rx='4' fill='none' stroke='%2301b468' stroke-width='2.5'/%3E%3Cpolygon points='12,26 18,26 14,31' fill='%2301b468'/%3E%3Ctext x='24' y='19.5' text-anchor='middle' font-family='Arial,Helvetica,sans-serif' font-weight='800' font-size='11' fill='%2301b468'%3ETMDb%3C/text%3E%3C/svg%3E\") no-repeat center;" +
            '  background-size: contain; }');
          // KP — Kinopoisk K icon on orange
          rules.push('.full-start__rate.rate--kp > div:last-child,' +
            '.full-start__rate.rate--kp .source--name {' +
            '  font-size: 0 !important; padding: 0 !important;' +
            '  display: inline-block; width: 22px; height: 22px; min-width: 22px; border-radius: 4px;' +
            "  background: #FF6600 url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Crect width='7' height='20' rx='1' fill='%23fff'/%3E%3Cpolygon points='7,10 18,1 13,1 7,5.5' fill='%23fff'/%3E%3Cpolygon points='7,10 18,19 13,19 7,14.5' fill='%23fff'/%3E%3Cline x1='7' y1='10' x2='18' y2='5' stroke='%23fff' stroke-width='1.3' opacity='.55'/%3E%3Cline x1='7' y1='10' x2='18' y2='15' stroke='%23fff' stroke-width='1.3' opacity='.55'/%3E%3Cline x1='7' y1='10' x2='19' y2='10' stroke='%23fff' stroke-width='1.3' opacity='.55'/%3E%3C/svg%3E\") no-repeat center;" +
            '  background-size: 65%; }');
        }

        // PG and status badges
        rules.push('.full-start__pg, .full-start__status {' +
          '  background: rgba(255,255,255,0.06) !important;' +
          '  border: 1px solid rgba(255,255,255,0.1) !important;' +
          '  border-radius: 0.7em; padding: 0.3em 0.55em !important;' +
          '  backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);' +
          '  font-weight: 600; font-size: 0.9em; }');
      }

      // ─── Description styling ────────────────────────────
      // Disable full-screen gradient overlays
      rules.push('.full-start-new::before, .full-start-new::after { display: none !important; background: none !important; }');
      // Reactions on the movie screen are controlled by the screen visual settings.
      if (showReactions === 'hide') {
        rules.push('.full-start-new__reactions, .full-start__reactions, .button--reaction { display: none !important; }');
      } else {
        rules.push('.full-start-new__reactions, .full-start__reactions { display: flex !important; }');
        rules.push('.button--reaction { display: inline-flex !important; visibility: visible !important; opacity: 1 !important; }');
      }
      rules.push('.alcopac-force-hidden { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }');
      // Optionally hide play button if user wants it removed
      rules.push('.full-start__button.selector.button--play.hide, .full-start__button.button--play.hide, .button--play.hide { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; width: 0 !important; min-width: 0 !important; max-width: 0 !important; padding: 0 !important; margin: 0 !important; border: 0 !important; overflow: hidden !important; }');
      rules.push('body.lampac-poster-fs-open { overflow: hidden !important; }');
      // Title logo (if enabled)
      if (showTitleLogo === 'show') {
        rules.push('.full-start-new__logo {' +
          '  max-width: 92%; width: fit-content; margin: -0.2em 0 0.2em 0; min-height: 5.2em; }');
        rules.push('.full-start-new__logo img {' +
          '  width: auto !important; height: ' + logoMaxHeight + ' !important; max-height: none !important; max-width: min(100%, 32em) !important; display: block; object-fit: contain; }');
      }
      rules.push('.full-descr__text {' +
        '  line-height: 1.6 !important; font-weight: 300 !important;' +
        '  color: rgba(245,245,247,0.85) !important; font-size: 1.05em !important; }');
      if (showDescr !== 'hide') {
        rules.push('.full-descr, .full-descr__text { display: block !important; visibility: visible !important; opacity: 1 !important; }');
      }
      rules.push('.full-descr__details { color: rgba(255,255,255,0.6) !important; }');
      rules.push('.full-descr__info-name { color: rgba(255,255,255,0.4) !important; font-size: 0.85em !important; text-transform: uppercase; letter-spacing: 0.05em; }');
      // Cinema description (moved into full-start)
      rules.push('.cinema-descr {' +
        '  color: rgba(255,255,255,0.75); font-weight: 300; font-size: 0.88em;' +
        '  line-height: 1.55; margin: 0 0 0.25em; max-width: 85%;' +
        '  text-shadow: 0 1px 4px rgba(0,0,0,0.5);' +
        '  border-left: 2px solid rgba(255,255,255,0.2); padding-left: 0.8em; }');
      // Quality badge in details
      rules.push('.cinema-quality-badge, .cinema-time-badge, .cinema-genre-badge {' +
        '  display: inline-flex; align-items: center; gap: 0.3em;' +
        '  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);' +
        '  border-radius: 0.7em; min-height: 2em; padding: 0.28em 0.52em; font-weight: 600;' +
        '  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);' +
        '  font-size: 0.92em; line-height: 1; letter-spacing: 0.02em; color: #fff; }');
      rules.push('.cinema-time-badge svg, .cinema-genre-badge svg { width: 0.9em; height: 0.9em; opacity: 0.7; }');
      // Details (date/country) below title with gentle spacing
      rules.push('.full-start-new__head,' +
        ' .full-start-new__tagline,' +
        ' .full-start-new__details,' +
        ' .full-start-new__rate-line,' +
        ' .full-start-new__reactions {' +
        '  margin-top: 0.42em !important; margin-bottom: 0 !important; }');
      rules.push('.full-start-new__head, .full-start-new__tagline, .full-start-new__details, .full-start-new__rate-line, .full-start-new__reactions {' +
        '  width: 100% !important; box-sizing: border-box !important; padding-left: 0 !important;' +
        '}');
      rules.push('@media (min-width: 601px) {' +
        '  .full-start-new__reactions {' +
        '    position: static !important; display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: flex-start !important;' +
        '    gap: 0.28em !important; width: auto !important; max-width: none !important; z-index: auto !important;' +
        '    width: 100% !important; margin-top: 0.32em !important; padding-left: 0 !important;' +
        '  }' +
        '  .full-start-new__reactions > * { width: auto !important; min-width: 0 !important; justify-content: center !important; }' +
        '}');
      // Make head and tagline same font size
      rules.push('.full-start-new__head, .full-start-new__tagline { font-size: 1em !important; }');
      // Make details and rate-line same font size
      rules.push('.full-start-new__details, .full-start-new__rate-line, .full-start-new__reactions { font-size: 0.92em !important; }');
      // TV mode
      if (tvMode === 'on') {
        btn = {
          d: '4.05em',
          dPad: '1.2em',
          dFont: '1.02em',
          m: '3.9em',
          mPad: '1.08em',
          mFont: '0.98em'
        };
        rules.push('.full-start-new__logo img { height: ' + logoTvMaxHeight + ' !important; max-height: none !important; max-width: min(100%, 42em) !important; }');
        rules.push('.full-start-new__title { font-size: 4em !important; }');
      }
      // Background dimming
      if (bgDim !== 'none') {
        var dimMap = { low: 0.88, medium: 0.74, high: 0.6 };
        var brightness = dimMap[bgDim] || 0.88;
        rules.push('.full-start__background, .full-start__background.loaded {' +
          '  filter: brightness(' + brightness + ') !important;' +
          '}');
      }
      // Buttons size presets
      rules.push('.full-start-new {' +
        '  --lampac-btn-size: ' + btn.d + '; --lampac-btn-pad: ' + btn.dPad + '; --lampac-btn-font: ' + btn.dFont + ';' +
        '  --lampac-btn-size-mobile: ' + btn.m + '; --lampac-btn-pad-mobile: ' + btn.mPad + '; --lampac-btn-font-mobile: ' + btn.mFont + ';' +
        '}');
      rules.push('.full-start-new__buttons .full-start__button, .full-start-new__buttons .full-start-new__button, .full-start-new__buttons .selector, .full-start__buttons .full-start__button, .full-start__buttons .full-start-new__button, .full-start__buttons .selector {' +
        '  min-width: var(--lampac-btn-size, 3.2em) !important;' +
        '  height: var(--lampac-btn-size, 3.2em) !important;' +
        '  line-height: var(--lampac-btn-size, 3.2em) !important;' +
        '  padding: 0 var(--lampac-btn-pad, 0.9em) !important;' +
        '  border-radius: calc(var(--lampac-btn-size, 3.2em) * 0.42) !important;' +
        '  display: inline-flex !important; align-items: center !important; justify-content: center !important;' +
        '}');
      rules.push('.full-start-new__buttons .full-start__button > span, .full-start-new__buttons .full-start-new__button > span, .full-start-new__buttons .selector > span, .full-start__buttons .full-start__button > span, .full-start__buttons .full-start-new__button > span, .full-start__buttons .selector > span {' +
        '  font-size: var(--lampac-btn-font, 0.85em) !important; line-height: 1 !important;' +
        '}');
      rules.push('.full-start-new__buttons .full-start__button svg, .full-start-new__buttons .full-start-new__button svg, .full-start-new__buttons .selector svg, .full-start__buttons .full-start__button svg, .full-start__buttons .full-start-new__button svg, .full-start__buttons .selector svg {' +
        '  width: calc(var(--lampac-btn-font, 0.85em) * 1.35) !important; height: calc(var(--lampac-btn-font, 0.85em) * 1.35) !important;' +
        '}');
      rules.push('.lampac-watch-progress { width: 100%; height: 0.32em; border-radius: 999px; background: rgba(255,255,255,0.16); overflow: hidden; margin: 0.35em 0 0.15em; }');
      rules.push('.lampac-watch-progress__fill { height: 100%; background: linear-gradient(90deg,#28d17c,#53e3ff); }');
      if (showReactions === 'hide') {
        rules.push('.full-start-new__buttons, .full-start__buttons { margin-top: 0.22em !important; }');
        rules.push('.full-start-new__right { row-gap: 0.14em !important; }');
      } else {
        rules.push('.full-start-new__buttons, .full-start__buttons { margin-top: 0.45em !important; }');
      }
      if (cardPreset === 'series') {
        rules.push('.full-start-new__title { font-size: 2.85em !important; }');
        rules.push('.full-start-new__right { row-gap: 0.28em !important; }');
      } else if (cardPreset === 'kids') {
        rules.push('.full-start-new__title { font-size: 3.15em !important; }');
        rules.push('.full-start-new__buttons .full-start__button, .full-start-new__buttons .full-start-new__button, .full-start-new__buttons .selector, .full-start__buttons .full-start__button, .full-start__buttons .full-start-new__button, .full-start__buttons .selector { min-width: calc(var(--lampac-btn-size, 3.2em) + 0.25em) !important; height: calc(var(--lampac-btn-size, 3.2em) + 0.25em) !important; }');
      } else if (cardPreset === 'movie') {
        rules.push('.full-start-new__title { font-size: 3.3em !important; }');
      }

      // Mobile layout
      if (mobileMode === 'bottom') {
        rules.push('@media (max-width: 600px) {' +
          '  .full-start-new { min-height: 100vh !important; }' +
          '  .full-start-new::before, .full-start-new::after { display: none !important; }' +
          '  .full-start__background, .full-start__background.loaded {' +
          '    opacity: 0.9 !important; filter: none !important; display: block !important;' +
          '    position: fixed !important; inset: 0 !important; width: 100% !important; height: 100% !important; z-index: 0 !important;' +
          '  }' +
          '  .full-start-new__body {' +
          '    min-height: 100vh !important; align-items: stretch !important;' +
          '    padding: 0 !important; position: relative !important; z-index: 2 !important;' +
          '    background: transparent !important;' +
          '  }' +
          '  .full-start-new__left { display: none !important; }' +
          '  .full-start-new__right {' +
          '    width: 100% !important; max-width: none !important; min-height: 100vh !important;' +
          '    padding: 0.7em 1.1em 0.5em 1.1em !important; box-sizing: border-box !important;' +
          '    display: flex !important; flex-direction: column !important; justify-content: flex-end !important;' +
          '    position: relative !important;' +
          '  }' +
          '  .full-start-new__right > * { position: relative !important; z-index: 1 !important; }' +
          '  .full-start-new__title { font-size: 2.1em !important; line-height: 1.05 !important; margin-top: 0 !important; }' +
          '  .full-start-new__head,' +
          '  .full-start-new__tagline,' +
          '  .full-start-new__details,' +
          '  .full-start-new__rate-line {' +
          '    margin-top: 0.35em !important; }' +
          '  .full-start-new__rate-line { gap: 0.4em !important; }' +
          '  .full-start-new__buttons {' +
          '    display: flex !important; flex-wrap: nowrap !important; gap: 0.5em !important;' +
          '    overflow-x: auto !important; -webkit-overflow-scrolling: touch !important;' +
          '    padding: 0 !important; margin: 0.35em 0 0 0 !important; min-height: 0 !important; height: auto !important;' +
          '    align-items: center !important;' +
          '  }' +
          '  .full-start-new__buttons .full-start__button, .full-start-new__buttons .full-start-new__button, .full-start-new__buttons .selector, .full-start__buttons .full-start__button, .full-start__buttons .full-start-new__button, .full-start__buttons .selector {' +
          '    flex: 0 0 auto !important; min-width: var(--lampac-btn-size-mobile, 3.15em) !important; height: var(--lampac-btn-size-mobile, 3.15em) !important;' +
          '    border-radius: 0.9em !important; padding: 0 var(--lampac-btn-pad-mobile, 0.85em) !important;' +
          '  }' +
          '  .full-descr { display: block !important; }' +
          '  .cinema-descr { display: none !important; }' +
          '}');
      } else {
        rules.push('@media (max-width: 600px) {' +
          '  .full-start-new {' +
            '    min-height: auto !important; height: auto !important;' +
            '    background: ' + mobileBgColor + ' !important;' +
          '  }' +
          '  .full-start, .scroll__body, .scroll__content { background: ' + mobileBgColor + ' !important; }' +
          '  .head__body { background: ' + (mobileBgKey === 'poster' ? ('rgba(' + mobileBgRgb + ', 0.88)') : 'rgba(14,16,22,0.9)') + ' !important; backdrop-filter: blur(12px) !important; -webkit-backdrop-filter: blur(12px) !important; }' +
          '  .full-start-new::before, .full-start-new::after { display: none !important; }' +
          '  .full-start-new__left, .full-start__poster, .full-start__img, .full-start-new__img { display: none !important; }' +
          '  .full-start__background, .full-start__background.loaded, img.full-start__background { display: none !important; }' +
          '  .full-start-new__body {' +
            '    min-height: auto !important; height: auto !important; padding: 0 !important; position: relative !important;' +
            '    display: flex !important; flex-direction: column !important; background: ' + mobileBgColor + ' !important;' +
          '  }' +
          '  .full-start-new__body::after {' +
            '    content: ""; position: absolute; left: 0; right: 0; top: 50%; bottom: 0; pointer-events: none; z-index: 1;' +
          '    background: ' + (mobileBgKey === 'poster' ? ('linear-gradient(to bottom, rgba(' + mobileBgRgb + ',0) 0%, rgba(' + mobileBgRgb + ',0.62) 30%, rgba(' + mobileBgRgb + ',0.96) 100%)') : 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,.62) 30%, rgba(0,0,0,.95) 100%)') + ';' +
            '    backdrop-filter: blur(12px) !important; -webkit-backdrop-filter: blur(12px) !important;' +
          '  }' +
          '  .lampac-mobile-poster-card {' +
            '    width: calc(100% - 1.2em) !important; margin: 0.35em 0.6em 0 !important;' +
            '    aspect-ratio: 2 / 3 !important; border-radius: 1.35em !important; overflow: hidden !important;' +
            '    position: relative !important; box-shadow: 0 16px 40px rgba(0,0,0,.38) !important;' +
            '    background: rgba(255,255,255,.03) !important; flex: 0 0 auto !important;' +
            '    z-index: 2 !important;' +
          '  }' +
          '  .lampac-mobile-poster-card img {' +
            '    width: 100% !important; height: 100% !important; object-fit: cover !important; display: block !important;' +
            '    -webkit-mask-image: -webkit-linear-gradient(top, #fff 40%, rgba(255,255,255,0) 100%);' +
            '    -webkit-mask-image: linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0) 100%);' +
            '    mask-image: linear-gradient(to bottom, #fff 40%, rgba(255,255,255,0) 100%);' +
          '  }' +
          '  .lampac-mobile-poster-card::before {' +
          '    content: ""; position: absolute; left: 0; right: 0; bottom: -2px; height: 46%; pointer-events: none;' +
          '    background: linear-gradient(to top, rgba(0,0,0,.94) 0%, rgba(0,0,0,.52) 58%, rgba(0,0,0,0) 100%);' +
          '    filter: blur(14px); z-index: 1;' +
          '  }' +
          '  .lampac-mobile-poster-card::after {' +
            '    content: ""; position: absolute; inset: 0; pointer-events: none;' +
          '    background: linear-gradient(to bottom, rgba(7,10,12,0) 34%, rgba(7,10,12,.42) 62%, rgba(7,10,12,.9) 100%);' +
          '    box-shadow: inset 0 -45px 60px rgba(0,0,0,.55); z-index: 2;' +
          '  }' +
          '  .full-start-new__right {' +
            '    width: 100% !important; max-width: none !important; box-sizing: border-box !important;' +
            '    display: flex !important; flex-direction: column !important; justify-content: flex-start !important;' +
            '    row-gap: 0.22em !important; align-items: center !important; text-align: center !important;' +
            '    width: calc(100% - 1.2em) !important; margin: -27vh 0.6em 0 !important;' +
            '    padding: 0.65em 0.82em 0.72em 0.82em !important;' +
            '    border-radius: 1em !important;' +
            '    background: ' + (mobileBgKey === 'poster' ? ('linear-gradient(to bottom, rgba(' + mobileBgRgb + ',0.52), rgba(' + mobileBgRgb + ',0.82))') : 'linear-gradient(to bottom, rgba(0,0,0,.52), rgba(0,0,0,.78))') + ' !important;' +
            '    backdrop-filter: blur(10px) !important; -webkit-backdrop-filter: blur(10px) !important;' +
            '    z-index: 3 !important;' +
          '  }' +
          '  .full-start-new__right.lampac-mobile-right-on-poster {' +
            '    position: relative !important; left: auto !important; right: auto !important; bottom: auto !important;' +
            '    width: calc(100% - 1.2em) !important; padding: 0.85em 0.9em 0.85em 0.9em !important;' +
            '    border-radius: 1em !important;' +
            '    background: ' + (mobileBgKey === 'poster' ? ('linear-gradient(to bottom, rgba(' + mobileBgRgb + ',0.52), rgba(' + mobileBgRgb + ',0.82))') : 'linear-gradient(to bottom, rgba(0,0,0,.52), rgba(0,0,0,.78))') + ' !important;' +
            '    z-index: 3 !important;' +
          '  }' +
          '  .full-start-new__right .full-start-new__logo { margin: 0 auto 0.12em auto !important; min-height: 0 !important; }' +
          '  .full-start-new__right .full-start-new__logo img { height: ' + logoMobileMaxHeight + ' !important; max-height: none !important; max-width: min(100%, 20em) !important; }' +
          '  .full-start-new__right .full-start-new__title { margin: 0 auto 0.12em auto !important; }' +
          '  .full-start-new__right .full-start-new__buttons { justify-content: center !important; }' +
          '  .full-start-new__title { font-size: 2.1em !important; line-height: 1.06 !important; margin: 0 !important; }' +
          '  .full-start-new__head, .full-start-new__tagline, .full-start-new__details, .full-start-new__rate-line {' +
            '    margin-top: 0 !important; margin-bottom: 0 !important; line-height: 1.25 !important; }' +
          '  .full-start-new__buttons {' +
            '    display: flex !important; flex-wrap: nowrap !important; gap: 0.5em !important;' +
            '    overflow-x: auto !important; -webkit-overflow-scrolling: touch !important;' +
            '    padding: 0 !important; margin: 0.2em 0 0.12em 0 !important; min-height: 0 !important; height: auto !important;' +
          '  }' +
          '  .full-start-new__buttons .full-start__button, .full-start-new__buttons .full-start-new__button, .full-start-new__buttons .selector, .full-start__buttons .full-start__button, .full-start__buttons .full-start-new__button, .full-start__buttons .selector {' +
          '    flex: 0 0 auto !important; min-width: var(--lampac-btn-size-mobile, 3.15em) !important; height: var(--lampac-btn-size-mobile, 3.15em) !important;' +
          '    border-radius: 0.88em !important; padding: 0 var(--lampac-btn-pad-mobile, 0.85em) !important;' +
          '  }' +
          '  .full-descr { display: block !important; margin-top: -0.55em !important; padding-top: 0 !important; max-width: 100% !important; }' +
          '  .full-descr, .items-line { position: relative !important; z-index: 2 !important; }' +
          '  .cinema-descr { display: none !important; }' +
          '  .scroll__body > .items-line.layer--visible.layer--render:first-of-type {' +
          '    margin-top: -0.15em !important;' +
          '  }' +
          '  .scroll__body > .items-line.layer--visible.layer--render:first-of-type .items-line__head {' +
          '    margin-top: 0 !important; margin-bottom: 0.25em !important;' +
          '  }' +
          '}');
      }
      if (mobileButtonsView === 'grid') {
        rules.push('@media (max-width: 600px) {' +
          '  .full-start-new__buttons {' +
          '    display: grid !important; grid-template-columns: repeat(4, minmax(0, 1fr)) !important;' +
          '    gap: 0.45em !important; overflow: visible !important;' +
          '  }' +
          '  .full-start-new__buttons .full-start__button, .full-start-new__buttons .full-start-new__button, .full-start-new__buttons .selector, .full-start__buttons .full-start__button, .full-start__buttons .full-start-new__button, .full-start__buttons .selector {' +
          '    width: 100% !important; min-width: 0 !important;' +
          '  }' +
          '}');
      }
      if (autoContrast === 'on') {
        rules.push('.full-start-new.lampac-contrast-strong .full-start-new__title,' +
          '.full-start-new.lampac-contrast-strong .full-start-new__head,' +
          '.full-start-new.lampac-contrast-strong .full-start-new__tagline,' +
          '.full-start-new.lampac-contrast-strong .full-start-new__details {' +
          '  text-shadow: 0 2px 14px rgba(0,0,0,.9) !important;' +
          '}');
      }
      rules.push('.full-start-new__buttons { margin-top: 0.45em !important; }');

      // ─── Mobile landscape: navigation bar compact ─────
      rules.push('@media (orientation: landscape) and (max-height: 500px) {' +
        '  .navigation-bar { position: fixed !important; bottom: 0 !important; left: 0 !important; right: 0 !important; top: auto !important; z-index: 999 !important; }' +
        '  .navigation-bar__body {' +
        '    flex-direction: row !important; height: auto !important; width: 100% !important;' +
        '    padding: 0.3em 0 !important; gap: 0.2em !important;' +
        '  }' +
        '  .navigation-bar__item { flex: 1 !important; }' +
        '  .navigation-bar__item-icon { width: 1.3em !important; height: 1.3em !important; }' +
        '  .navigation-bar__item-text { font-size: 0.6em !important; }' +
        '  .wrap { padding-right: 0 !important; }' +
        '  .wrap__content { width: 100% !important; }' +
        '  body { padding-bottom: 3.5em !important; }' +
        '}');

      // ─── Mobile landscape: film detail page compact ───
      rules.push('@media (orientation: landscape) and (max-height: 500px) {' +
        '  .full-start-new { min-height: 100vh !important; }' +
        '  .full-start-new__title { font-size: 2.2em !important; }' +
        '  .full-start-new__right { max-width: 55% !important; }' +
        '  .cinema-descr { -webkit-line-clamp: 2 !important; }' +
        '}');

      if (rules.length) {
        var style = document.createElement('style');
        style.id = SCREEN_STYLE_ID;
        style.type = 'text/css';
        style.textContent = rules.join('\n');
        document.head.appendChild(style);
      }

      try { setTimeout(window.updateReactionCountsVisibility, 0); setTimeout(window.updateReactionCountsVisibility, 180); } catch (e) {}

      if (mobileMode !== 'poster') {
        restoreMobileInfoBlock();
        cleanupMobilePosterCard();
      }
    }


    var __lampacReactionCountsObserver = null;
    var __lampacReactionCountsTimer = null;

    function formatReactionCount(value) {
      var num = parseFloat(value);
      if (!isFinite(num)) return String(value || '');
      if (num >= 1000000) return (Math.round(num / 100000) / 10).toString().replace(/\.0$/, '') + 'M';
      if (num >= 1000) return (Math.round(num / 100) / 10).toString().replace(/\.0$/, '') + 'K';
      return String(Math.round(num));
    }

    function normalizeReactionEntry(key, entry, index) {
      if (entry === null || typeof entry === 'undefined') return null;
      var count = null;
      var name = key || '';
      var order = typeof index === 'number' ? index : 999;

      if (typeof entry === 'number' || typeof entry === 'string') {
        count = entry;
      } else if (typeof entry === 'object') {
        name = entry.type || entry.name || entry.code || entry.id || key || '';
        if (typeof entry.count !== 'undefined') count = entry.count;
        else if (typeof entry.value !== 'undefined') count = entry.value;
        else if (typeof entry.total !== 'undefined') count = entry.total;
        else if (typeof entry.votes !== 'undefined') count = entry.votes;
        else if (typeof entry.likes !== 'undefined') count = entry.likes;
        else if (typeof entry.number !== 'undefined') count = entry.number;
        if (typeof entry.index === 'number') order = entry.index;
        else if (typeof entry.order === 'number') order = entry.order;
      }

      if (count === null || count === '' || typeof count === 'undefined') return null;
      return { key: String(name || key || index || ''), count: count, order: order };
    }

    function getCardReactionEntries() {
      var activity = null;
      var card = null;
      try {
        activity = window.Lampa && Lampa.Activity && Lampa.Activity.active ? Lampa.Activity.active() : null;
        card = activity && activity.card;
      } catch (e) {}
      if (!card) return [];

      var source = card.reactions || card.reaction || card.likes || card.emotions || null;
      var list = [];

      if (Array.isArray(source)) {
        for (var i = 0; i < source.length; i++) {
          var item = normalizeReactionEntry('', source[i], i);
          if (item) list.push(item);
        }
      } else if (source && typeof source === 'object') {
        Object.keys(source).forEach(function (key, index) {
          var item = normalizeReactionEntry(key, source[key], index);
          if (item) list.push(item);
        });
      }

      var fallbackKeys = ['fire', 'like', 'think', 'shit', 'sleep'];
      if (!list.length) {
        fallbackKeys.forEach(function (key, index) {
          var item = normalizeReactionEntry(key, card[key + '_count'], index);
          if (!item) item = normalizeReactionEntry(key, card[key], index);
          if (item) list.push(item);
        });
      }

      list.sort(function (a, b) { return a.order - b.order; });
      return list;
    }

    function injectReactionCounts(root) {
      if (!root) return;
      var mode = 'show';
      if (mode === 'hide') {
        root.classList.add('alcopac-reactions-hidden');
        root.style.setProperty('display', 'none', 'important');
        root.style.setProperty('visibility', 'hidden', 'important');
        root.style.setProperty('opacity', '0', 'important');
        root.style.setProperty('pointer-events', 'none', 'important');
        root.style.setProperty('height', '0', 'important');
        root.style.setProperty('min-height', '0', 'important');
        root.style.setProperty('margin', '0', 'important');
        root.style.setProperty('padding', '0', 'important');
        root.style.setProperty('overflow', 'hidden', 'important');
        root.setAttribute('hidden', 'hidden');
        return;
      }

      root.classList.remove('alcopac-reactions-hidden');
      root.style.removeProperty('display');
      root.style.removeProperty('visibility');
      root.style.removeProperty('opacity');
      root.style.removeProperty('pointer-events');
      root.style.removeProperty('height');
      root.style.removeProperty('min-height');
      root.style.removeProperty('margin');
      root.style.removeProperty('padding');
      root.style.removeProperty('overflow');
      root.removeAttribute('hidden');
      var items = root.children || [];
      var entries = getCardReactionEntries();

      for (var i = 0; i < items.length; i++) {
        var itemRoot = items[i];
        if (!itemRoot || itemRoot.classList.contains('alcopac-reaction-count')) continue;

        var countEl = itemRoot.querySelector('.alcopac-reaction-count');
        var entry = entries[i] || null;

        if (!countEl && entry) {
          countEl = document.createElement('span');
          countEl.className = 'alcopac-reaction-count alcopac-reaction-count--injected';
          itemRoot.appendChild(countEl);
        }

        if (countEl && entry) {
          countEl.textContent = formatReactionCount(entry.count);
        }
      }

      root.classList.toggle('alcopac-reaction-counts-hidden', mode === 'hide');
    }

    function bindReactionCountsObserver() {
      if (__lampacReactionCountsObserver) {
        try { __lampacReactionCountsObserver.disconnect(); } catch (e) {}
        __lampacReactionCountsObserver = null;
      }

      var host = document.querySelector('.activity.activity--active') ||
        document.querySelector('.activity--active') ||
        document.body;
      if (!host) return;

      __lampacReactionCountsObserver = new MutationObserver(function () {
        clearTimeout(__lampacReactionCountsTimer);
        __lampacReactionCountsTimer = setTimeout(function () {
          try { window.updateReactionCountsVisibility(); } catch (e) {}
        }, 30);
      });

      __lampacReactionCountsObserver.observe(host, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    window.updateReactionCountsVisibility = function updateReactionCountsVisibility() {
      var mode = 'show';
      var fullRoots = document.querySelectorAll('.full-start-new, .full-start');
      for (var fr = 0; fr < fullRoots.length; fr++) {
        fullRoots[fr].classList.toggle('alcopac-reactions-off', mode === 'hide');
      }
      var reactionButtons = document.querySelectorAll('.button--reaction');
      for (var b = 0; b < reactionButtons.length; b++) {
        if (mode === 'hide') {
          reactionButtons[b].classList.add('alcopac-reactions-hidden');
          reactionButtons[b].style.setProperty('display', 'none', 'important');
          reactionButtons[b].style.setProperty('visibility', 'hidden', 'important');
          reactionButtons[b].style.setProperty('opacity', '0', 'important');
          reactionButtons[b].style.setProperty('pointer-events', 'none', 'important');
          reactionButtons[b].setAttribute('hidden', 'hidden');
        } else {
          reactionButtons[b].classList.remove('alcopac-reactions-hidden');
          reactionButtons[b].style.removeProperty('display');
          reactionButtons[b].style.removeProperty('visibility');
          reactionButtons[b].style.removeProperty('opacity');
          reactionButtons[b].style.removeProperty('pointer-events');
          reactionButtons[b].removeAttribute('hidden');
        }
      }
      var roots = document.querySelectorAll('.full-start-new__reactions, .full-start__reactions');
      for (var r = 0; r < roots.length; r++) {
        var root = roots[r];
        if (mode === 'hide') {
          root.classList.add('alcopac-reactions-hidden');
          root.style.setProperty('display', 'none', 'important');
          root.style.setProperty('visibility', 'hidden', 'important');
          root.style.setProperty('opacity', '0', 'important');
          root.style.setProperty('pointer-events', 'none', 'important');
          root.style.setProperty('height', '0', 'important');
          root.style.setProperty('min-height', '0', 'important');
          root.style.setProperty('margin', '0', 'important');
          root.style.setProperty('padding', '0', 'important');
          root.style.setProperty('overflow', 'hidden', 'important');
          root.setAttribute('hidden', 'hidden');
          continue;
        }

        root.classList.remove('alcopac-reactions-hidden');
        root.style.removeProperty('display');
        root.style.removeProperty('visibility');
        root.style.removeProperty('opacity');
        root.style.removeProperty('pointer-events');
        root.style.removeProperty('height');
        root.style.removeProperty('min-height');
        root.style.removeProperty('margin');
        root.style.removeProperty('padding');
        root.style.removeProperty('overflow');
        root.removeAttribute('hidden');
        var candidates = root.querySelectorAll('span, div, b, strong, small');
        for (var i = 0; i < candidates.length; i++) {
          var el = candidates[i];
          if (!el || !el.textContent) continue;
          if (el.querySelector && el.querySelector('svg, img')) continue;
          var txt = (el.textContent || '').trim();
          if (/^\d+([.,]\d+)?([kKmMКк])?$/.test(txt)) {
            el.classList.add('alcopac-reaction-count');
          }
        }
        injectReactionCounts(root);
        root.classList.toggle('alcopac-reaction-counts-hidden', mode === 'hide');
      }
    }

    try { bindReactionCountsObserver(); } catch (e) {}

    // ─── Screen settings component ─────────────────────
    var SCREEN_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12zm-5-7l-7 4V6l7 4z"/></svg>';

    // component theme_screen intentionally has no top-level entry;
    // it is opened from «Сцены интерфейса» only.

    // Templates for nested settings sections
    if (window.Lampa && Lampa.Template && Lampa.Template.add) {
      Lampa.Template.add('settings_theme_screen', '<div></div>');
      Lampa.Template.add('settings_theme_screen_layout', '<div></div>');
      Lampa.Template.add('settings_theme_screen_compact', '<div></div>');
      Lampa.Template.add('settings_theme_screen_buttons', '<div></div>');
      Lampa.Template.add('settings_theme_screen_logo', '<div></div>');
      Lampa.Template.add('settings_theme_screen_visual', '<div></div>');
      Lampa.Template.add('settings_theme_screen_profiles', '<div></div>');
    }

    function openScreenSection(name) {
      if (!name || !window.Lampa || !Lampa.Settings || !Lampa.Settings.create) return;
      setTimeout(function () {
        Lampa.Settings.create(name, {
          onBack: function () {
            Lampa.Settings.create('theme_screen');
          }
        });
      }, 0);
    }

    Lampa.SettingsApi.addParam({
      component: 'theme_screen',
      param: { type: 'title' },
      field: { name: 'Разделы настроек' },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen',
      param: { name: 'lampac_open_screen_layout', type: 'button' },
      field: { name: 'Расположение', description: 'Режим экрана, мобильный режим, анимация' },
      onChange: function () { openScreenSection('theme_screen_layout'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen',
      param: { name: 'lampac_open_screen_compact', type: 'button' },
      field: { name: 'Компактность', description: 'Компактный режим, метаданные, слоган, описание' },
      onChange: function () { openScreenSection('theme_screen_compact'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen',
      param: { name: 'lampac_open_screen_buttons', type: 'button' },
      field: { name: 'Кнопки', description: 'Размер, скрытие, порядок, мобильный вид' },
      onChange: function () { openScreenSection('theme_screen_buttons'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen',
      param: { name: 'lampac_open_screen_logo', type: 'button' },
      field: { name: 'Логотип', description: 'Лого вместо названия, размер, US fallback' },
      onChange: function () { openScreenSection('theme_screen_logo'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen',
      param: { name: 'lampac_open_screen_visual', type: 'button' },
      field: { name: 'Визуал', description: 'Оверлей, контраст, рейтинги, реакции, затемнение' },
      onChange: function () { openScreenSection('theme_screen_visual'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen',
      param: { name: 'lampac_open_screen_profiles', type: 'button' },
      field: { name: 'Профили', description: 'Раздельные профили mobile/desktop/tv' },
      onChange: function () { openScreenSection('theme_screen_profiles'); },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_layout',
      param: {
        name: 'lampac_screen_layout',
        type: 'select',
        values: { 'default': 'Стандартный', cinematic: 'Кинематограф' },
        default: 'default',
      },
      field: {
        name: 'Режим экрана',
        description: 'Кинематограф — полноэкранный фон, без постера, контент внизу',
      },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_layout',
      param: {
        name: 'lampac_screen_mobile_layout',
        type: 'select',
        values: { poster: 'Постер + инфо', bottom: 'Кинематограф (низ)' },
        default: 'poster',
      },
      field: {
        name: 'Мобильный режим',
        description: 'Постер + инфо: аккуратный вертикальный постер. Кинематограф: контент поверх фона внизу.',
      },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_compact',
      param: {
        name: 'lampac_screen_compact_mode',
        type: 'select',
        values: { normal: 'Обычный', compact: 'Компактный' },
        default: 'normal',
      },
      field: {
        name: 'Компактный экран фильма',
        description: 'Скрывает лишний текст и делает экран чище',
      },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_compact',
      param: {
        name: 'lampac_screen_compact_meta',
        type: 'select',
        values: { off: 'Выключить', on: 'Включить' },
        default: 'off',
      },
      field: {
        name: 'Компактная строка метаданных',
        description: 'Собирает год, жанр, длительность и качество в одну строку',
      },
      onChange: function () {
        applyScreenStyle();
        setTimeout(renderCompactMetaLine, 0);
      },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_compact',
      param: {
        name: 'lampac_screen_tagline',
        type: 'select',
        values: { show: 'Показывать', hide: 'Скрыть' },
        default: 'show',
      },
      field: { name: 'Слоган', description: 'Фраза-слоган под названием' },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_compact',
      param: {
        name: 'lampac_screen_descr',
        type: 'select',
        values: { show: 'Показывать', hide: 'Скрыть' },
        default: 'show',
      },
      field: { name: 'Описание', description: 'Блок с описанием под экраном' },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_buttons',
      param: {
        name: 'lampac_screen_button_size_desktop',
        type: 'select',
        values: { compact: 'Компактные', normal: 'Обычные', large: 'Крупные', xl: 'Очень крупные' },
        default: 'normal',
      },
      field: {
        name: 'Размер кнопок (TV / браузер)',
        description: 'Размер кнопок действий на экране фильма для телевизора и браузера',
      },
      onChange: function () {
        Lampa.Storage.set('lampac_screen_button_size', Lampa.Storage.get('lampac_screen_button_size_desktop', 'normal'));
        applyScreenStyle();
      },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_buttons',
      param: {
        name: 'lampac_screen_button_size_mobile',
        type: 'select',
        values: { compact: 'Компактные', normal: 'Обычные', large: 'Крупные', xl: 'Очень крупные' },
        default: 'normal',
      },
      field: {
        name: 'Размер кнопок (Mobile)',
        description: 'Размер кнопок действий на экране фильма для телефона и мобильного режима',
      },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_buttons',
      param: {
        name: 'lampac_screen_hide_extra_buttons',
        type: 'select',
        values: { off: 'Выключить', on: 'Включить' },
        default: 'off',
      },
      field: {
        name: 'Скрыть лишние кнопки',
        description: 'Убирает реакцию, трейлер и лишние сервисные кнопки',
      },
      onChange: function () {
        applyScreenStyle();
        setTimeout(function () { promoteFolderButtons(true); }, 0);
      },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_buttons',
      param: {
        name: 'lampac_screen_smart_order',
        type: 'select',
        values: { on: 'Включить', off: 'Выключить' },
        default: 'on',
      },
      field: {
        name: 'Умный порядок кнопок',
        description: 'Онлайн → Торрент → Трейлер → Избранное',
      },
      onChange: function () {
        applyScreenStyle();
        setTimeout(function () { promoteFolderButtons(true); }, 0);
      },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_buttons',
      param: {
        name: 'lampac_screen_button_order',
        type: 'select',
        values: {
          'online,torrent,trailer,book': 'Онлайн → Торрент → Трейлер → Избранное',
          'online,torrent,book,trailer': 'Онлайн → Торрент → Избранное → Трейлер',
          'torrent,online,trailer,book': 'Торрент → Онлайн → Трейлер → Избранное',
          'book,online,torrent,trailer': 'Избранное → Онлайн → Торрент → Трейлер'
        },
        default: 'online,torrent,trailer,book',
      },
      field: {
        name: 'Порядок кнопок',
        description: 'Приоритет кнопок на экране фильма',
      },
      onChange: function () {
        applyScreenStyle();
        setTimeout(function () { promoteFolderButtons(true); }, 0);
      },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_buttons',
      param: {
        name: 'lampac_screen_buttons_folder',
        type: 'select',
        values: { off: 'Выключить', on: 'Включить' },
        default: 'off',
      },
      field: {
        name: 'Кнопка-папка источников',
        description: 'Собирает Онлайн, Торрент, Трейлер и дополнительные кнопки просмотра в одну кнопку-папку',
      },
      onChange: function () {
        applyScreenStyle();
        setTimeout(function () { promoteFolderButtons(true); }, 0);
      },
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_buttons',
      param: {
        name: 'lampac_screen_mobile_buttons_view',
        type: 'select',
        values: { row: 'Ряд', grid: 'Сетка 2x2' },
        default: 'row',
      },
      field: {
        name: 'Мобильные кнопки',
        description: 'Режим отображения: горизонтальный ряд или сетка',
      },
      onChange: applyScreenStyle,
    });


    Lampa.SettingsApi.addParam({
      component: 'theme_screen_visual',
      param: {
        name: 'lampac_screen_overlay_opacity',
        type: 'select',
        values: { '55': '55%', '65': '65%', '75': '75%', '88': '88%', '96': '96%' },
        default: '88',
      },
      field: {
        name: 'Прозрачность оверлея',
        description: 'Нижняя черная панель на постере в мобильной версии',
      },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_visual',
      param: {
        name: 'lampac_screen_auto_contrast',
        type: 'select',
        values: { on: 'Включить', off: 'Выключить' },
        default: 'on',
      },
      field: {
        name: 'Автоконтраст текста',
        description: 'Усиливает читаемость текста на светлых постерах',
      },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_visual',
      param: {
        name: 'lampac_screen_rating_style',
        type: 'select',
        values: { 'default': 'Стандартный', colored: 'Цветной', logo: 'Лого' },
        default: 'logo',
      },
      field: {
        name: 'Стиль рейтингов',
        description: 'Внешний вид IMDB, TMDB, Кинопоиск',
      },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_visual',
      param: {
        name: 'lampac_screen_ratings',
        type: 'select',
        values: { show: 'Показывать', hide: 'Скрыть' },
        default: 'show',
      },
      field: { name: 'Рейтинги', description: 'Блок с оценками IMDB, TMDB, КП' },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_logo',
      param: {
        name: 'lampac_screen_title_logo',
        type: 'select',
        values: { show: 'Показывать', hide: 'Скрыть' },
        default: 'show',
      },
      field: { name: 'Логотип вместо названия', description: 'Если есть логотип — показывать вместо текста' },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_logo',
      param: {
        name: 'lampac_screen_logo_size',
        type: 'select',
        values: { xs: 'Очень маленький', small: 'Маленький', medium: 'Средний', large: 'Большой', xl: 'Очень большой' },
        default: 'medium',
      },
      field: { name: 'Размер логотипа', description: 'Размер логотипа на экране фильма' },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_logo',
      param: {
        name: 'lampac_screen_logo_us',
        type: 'select',
        values: { show: 'Разрешить', hide: 'Только RU' },
        default: 'show',
      },
      field: { name: 'US логотип', description: 'Если RU нет — использовать US/EN' },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_general',
      param: {
        name: 'lampac_screen_tv_mode',
        type: 'select',
        values: { off: 'Выключен', on: 'Включен' },
        default: 'off',
      },
      field: { name: 'Легковесный режим', description: 'Облегчает интерфейс для слабых ТВ и приставок' },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_visual',
      param: {
        name: 'lampac_screen_bg_dim',
        type: 'select',
        values: { none: 'Без затемнения', low: 'Легкое', medium: 'Среднее', high: 'Сильное' },
        default: 'none',
      },
      field: { name: 'Затемнение фона', description: 'Уменьшает яркость фонового постера/кадра' },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_mobile',
      param: {
        name: 'lampac_screen_mobile_bg',
        type: 'select',
        values: {
          poster: 'Под цвет постера',
          black: 'Черный',
          graphite: 'Графит',
          navy: 'Темно-синий',
          brown: 'Темно-коричневый',
          olive: 'Оливковый',
          plum: 'Темно-сливовый'
        },
        default: 'poster',
      },
      field: { name: 'Фон мобильного экрана', description: 'Фон мобильной карточки. Для классической темы по умолчанию используется цвет постера' },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_visual',
      param: {
        name: 'lampac_screen_watch_progress',
        type: 'select',
        values: { on: 'Включить', off: 'Выключить' },
        default: 'on',
      },
      field: { name: 'Прогресс просмотра', description: 'Показывать полосу досмотра в карточке' },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_profiles',
      param: {
        name: 'lampac_screen_profile_mobile',
        type: 'select',
        values: { normal: 'Обычный', compact: 'Компактный', cinema: 'Кинематограф', kids: 'Детский' },
        default: 'normal',
      },
      field: { name: 'Профиль Mobile', description: 'Набор настроек для телефона' },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_profiles',
      param: {
        name: 'lampac_screen_profile_desktop',
        type: 'select',
        values: { normal: 'Обычный', compact: 'Компактный', cinema: 'Кинематограф', kids: 'Детский' },
        default: 'normal',
      },
      field: { name: 'Профиль Desktop', description: 'Набор настроек для десктопа' },
      onChange: applyScreenStyle,
    });

    Lampa.SettingsApi.addParam({
      component: 'theme_screen_profiles',
      param: {
        name: 'lampac_screen_profile_tv',
        type: 'select',
        values: { normal: 'Обычный', compact: 'Компактный', cinema: 'Кинематограф', kids: 'Детский' },
        default: 'cinema',
      },
      field: { name: 'Профиль TV', description: 'Набор настроек для телевизора' },
      onChange: applyScreenStyle,
    });

    // component theme_tools intentionally has no top-level entry;
    // it is opened from «Сцены интерфейса» only.

    if (window.Lampa && Lampa.Template && Lampa.Template.add) {
      Lampa.Template.add('settings_theme_tools', '<div></div>');
    }

    Lampa.SettingsApi.addParam({
      component: 'theme_tools',
      param: {
        name: 'lampac_tools_action',
        type: 'select',
        values: { none: 'Выбрать действие', export: 'Экспорт настроек', import: 'Импорт настроек', diagnostics: 'Диагностика', export_profile: 'Экспорт активного профиля', reset_visual: 'Сбросить визуал', reapply: 'Переприменить тему' },
        default: 'none',
      },
      field: {
        name: 'Действие',
        description: 'Экспорт/импорт JSON и диагностика активных параметров',
      },
      onChange: handleToolsAction,
    });

    // ─── Move description into cinematic area ───────────
    function isCinematic() {
      var theme = Lampa.Storage.get(STORAGE_KEY, 'classic');
      var layout = Lampa.Storage.get('lampac_screen_layout', 'default');
      return theme === 'appletv' || layout === 'cinematic';
    }

    function moveDescrIntoCinema() {
      if (!isCinematic()) return;
      if (window.innerWidth <= 600) return;
      setTimeout(function () {
        var root = getActiveFullRoot();
        var descrText = root && root.querySelector('.full-descr__text');
        var right = root && (root.querySelector('.full-start-new__right') || root.querySelector('.full-start__right') || root.querySelector('.full-start-new__body') || root.querySelector('.full-start__body'));
        var buttons = root && (root.querySelector('.full-start-new__buttons') || root.querySelector('.full-start__buttons'));
        if (!right || !buttons) return;
        var activity = Lampa.Activity.active();
        var card = activity && activity.card;
        var cardId = String(card && card.id || '');
        var oldDescr = right.querySelector('.cinema-descr');
        if (oldDescr && oldDescr.getAttribute('data-card') !== cardId && oldDescr.parentNode) {
          oldDescr.parentNode.removeChild(oldDescr);
          oldDescr = null;
        }
        if (oldDescr && oldDescr.getAttribute('data-card') === cardId) return;

        var txt = '';
        if (descrText && descrText.textContent.trim()) txt = descrText.textContent.trim();
        if (!txt && card) {
          txt = (card.overview || card.description || card.plot || card.summary || '').trim();
        }

        if (txt) {
          var clone = document.createElement('div');
          clone.className = 'cinema-descr';
          clone.setAttribute('data-card', cardId);
          var maxLen = (getDeviceType() === 'tv') ? 180 : 300;
          if (txt.length > maxLen) txt = txt.substring(0, maxLen).replace(/\s+\S*$/, '') + '...';
          clone.textContent = txt;
          buttons.parentNode.insertBefore(clone, buttons);
        }

        // Style details badges (time, genre, quality)
        var details = root.querySelector('.full-start-new__details') || root.querySelector('.full-start__details');
        if (details && !details.querySelector('.cinema-time-badge')) {
          var spans = details.querySelectorAll('span');
          var clockSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
          var genreSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>';
          for (var i = 0; i < spans.length; i++) {
            var sp = spans[i];
            if (sp.className === 'full-start-new__split') continue;
            var txt = sp.textContent.trim();
            // Time (e.g. 01:47, 2:15)
            if (txt.match(/^\d{1,2}:\d{2}$/)) {
              var tb = document.createElement('span');
              tb.className = 'cinema-time-badge';
              tb.innerHTML = clockSvg + ' ' + txt;
              sp.textContent = '';
              sp.appendChild(tb);
            }
            // Genre (contains |)
            else if (txt.indexOf('|') !== -1) {
              var gb = document.createElement('span');
              gb.className = 'cinema-genre-badge';
              gb.innerHTML = genreSvg + ' ' + txt;
              sp.textContent = '';
              sp.appendChild(gb);
            }
            // Quality
            else if (txt.indexOf('Качество') !== -1 || txt.match(/^(4K|WEBDL|WEB-DL|HDRip|BDRip|CAMRip|TS|HD|BD)$/i)) {
              var text = txt.replace('Качество: ', '');
              var qb = document.createElement('span');
              qb.className = 'cinema-quality-badge';
              qb.textContent = text;
              sp.textContent = '';
              sp.appendChild(qb);
            }
          }
        }
      });
    }

    function placeDetailsAfterTagline() {
      var root = getActiveFullRoot();
      if (!root) return;
      var title = root.querySelector('.full-start-new__title');
      var tagline = root.querySelector('.full-start-new__tagline');
      var head = root.querySelector('.full-start-new__head');
      var details = root.querySelector('.full-start-new__details');
      if (!title || !details) return;
      var anchor = (tagline && tagline.parentNode === title.parentNode) ? tagline : title;
      if (!anchor || !anchor.parentNode) return;
      // Move head (year/country) under tagline/title
      if (head && head.parentNode === anchor.parentNode) {
        anchor.parentNode.insertBefore(head, anchor.nextSibling);
        anchor = head;
      }
      if (details.previousElementSibling === anchor) return;
      if (anchor && anchor.parentNode) {
        anchor.parentNode.insertBefore(details, anchor.nextSibling);
      }
    }

    function renderCompactMetaLine() {
      var root = getActiveFullRoot();
      if (!root) return;
      var right = root.querySelector('.full-start-new__right');
      if (!right) return;
      var head = right.querySelector('.full-start-new__head');
      var details = right.querySelector('.full-start-new__details');
      if (!head || !details) return;

      var enabled = Lampa.Storage.get('lampac_screen_compact_meta', 'off') === 'on';
      var oldLine = right.querySelector('.lampac-meta-line');

      if (!enabled) {
        if (oldLine && oldLine.parentNode) oldLine.parentNode.removeChild(oldLine);
        head.style.display = '';
        details.style.display = '';
        return;
      }

      var line = oldLine || document.createElement('div');
      line.className = 'lampac-meta-line';
      var headText = (head.textContent || '').replace(/\s+/g, ' ').trim();
      var detailsText = (details.textContent || '').replace(/\s+/g, ' ').trim();
      var joined = [headText, detailsText].filter(Boolean).join('  •  ');
      if (!joined) return;
      line.textContent = joined;

      if (!oldLine) {
        var anchor = right.querySelector('.full-start-new__tagline') || right.querySelector('.full-start-new__title') || head;
        if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(line, anchor.nextSibling);
      }

      head.style.display = 'none';
      details.style.display = 'none';
    }

    function applyTitleLogo() {
      var titleLogoSetting = Lampa.Storage.get('lampac_screen_title_logo', 'show');
      if (titleLogoSetting === true) titleLogoSetting = 'show';
      if (titleLogoSetting === false) titleLogoSetting = 'hide';
      var logoAllowUS = Lampa.Storage.get('lampac_screen_logo_us', 'show');
      var activity = Lampa.Activity.active();
      var card = activity && activity.card;
      if (!card) return;

      var root = getActiveFullRoot();
      if (!root) return;

      var title = root.querySelector('.full-start-new__title');
      if (!title) return;

      var logoContainer = root.querySelector('.full-start-new__logo');
      if (!logoContainer) {
        logoContainer = document.createElement('div');
        logoContainer.className = 'full-start-new__logo';
      }
      if (title.parentNode && logoContainer.parentNode !== title.parentNode) {
        title.parentNode.insertBefore(logoContainer, title);
      }

      var cardId = String(card.id || '');

      function showTitle() {
        try { title.style.removeProperty('display'); } catch (e) {}
        title.style.display = '';
      }

      function hideTitle() {
        try { title.style.setProperty('display', 'none', 'important'); } catch (e) {
          title.style.display = 'none';
        }
      }

      function clearLogo() {
        logoContainer.setAttribute('data-card', cardId);
        logoContainer.classList.remove('loaded');
        logoContainer.innerHTML = '';
        showTitle();
      }

      function clearLogoForce() {
        logoContainer.removeAttribute('data-card');
        logoContainer.classList.remove('loaded');
        logoContainer.innerHTML = '';
        showTitle();
      }

      function setLogo(url) {
        logoContainer.setAttribute('data-card', cardId);
        logoContainer.innerHTML = '<img src="' + url + '" class="loaded" />';
        logoContainer.classList.add('loaded');
        hideTitle();
      }

      if (titleLogoSetting !== 'show') {
        clearLogoForce();
        return;
      }

      if (logoContainer.getAttribute('data-card') === cardId && logoContainer.classList.contains('loaded')) {
        if (logoContainer.querySelector('img')) hideTitle();
        else showTitle();
        return;
      }

      var logos = card.images && card.images.logos;
      if (logos && logos.length) {
        var logo = logos.filter(function (l) { return l.iso_639_1 === 'ru'; })[0];
        if (!logo && logoAllowUS === 'show') {
          logo = logos.filter(function (l) { return l.iso_639_1 === 'en'; })[0] ||
            logos.filter(function (l) { return l.iso_639_1 === null; })[0] ||
            logos[0];
        }
        if (logo) {
          setLogo(Lampa.TMDB.image('original' + logo.file_path));
          return;
        }
      }

      if (!Lampa.TMDB || !Lampa.TMDB.api) return clearLogo();

      var type = card.name ? 'tv' : 'movie';
      function pickLogo(logosList) {
        if (!logosList || !logosList.length) return null;
        var ruLogo = logosList.filter(function (l) { return l.iso_639_1 === 'ru'; })[0];
        if (ruLogo) return ruLogo;
        if (logoAllowUS === 'show') {
          return logosList.filter(function (l) { return l.iso_639_1 === 'en'; })[0] ||
            logosList.filter(function (l) { return l.iso_639_1 === null; })[0] ||
            logosList[0];
        }
        return null;
      }

      function applyPickedLogo(picked, useW300) {
        if (!picked || !picked.file_path) return clearLogo();
        var currentActivity = Lampa.Activity.active();
        var currentCard = currentActivity && currentActivity.card;
        if (String(currentCard && currentCard.id || '') !== cardId) return;
        var filePath = picked.file_path;
        var imgUrl = useW300
          ? Lampa.TMDB.image('/t/p/w300' + filePath.replace('.svg', '.png'))
          : Lampa.TMDB.image('original' + filePath);
        setLogo(imgUrl);
      }

      try {
        var includeLang = logoAllowUS === 'show' ? 'ru,en,null' : 'ru,null';
        var url = Lampa.TMDB.api(type + '/' + card.id + '/images?api_key=' + Lampa.TMDB.key() + '&include_image_language=' + includeLang);
        if (window.$ && url) {
          $.get(url, function (resp) {
            var picked = pickLogo(resp && resp.logos ? resp.logos : []);
            applyPickedLogo(picked, true);
          }).fail(function () {
            clearLogo();
          });
          return;
        }
      } catch (e) {}

      var includeLang2 = logoAllowUS === 'show' ? 'ru,en,null' : 'ru,null';
      Lampa.TMDB.api(
        type + '/' + card.id + '/images?api_key=' + Lampa.TMDB.key() + '&include_image_language=' + includeLang2,
        function (resp) {
          var picked2 = pickLogo(resp && resp.logos ? resp.logos : []);
          applyPickedLogo(picked2, false);
        },
        function () {
          clearLogo();
        }
      );
    }

    function applyTitleLogoRetry() {
      var delays = [0, 120, 260, 500, 900, 1400];
      delays.forEach(function (delay) {
        setTimeout(function () {
          try { applyTitleLogo(); } catch (e) {}
        }, delay);
      });
    }

    function cleanupMobilePosterCard() {
      var root = getActiveFullRoot();
      var cardEl = root && root.querySelector('.lampac-mobile-poster-card');
      if (cardEl && cardEl.parentNode) cardEl.parentNode.removeChild(cardEl);
    }

    function restoreMobileInfoBlock() {
      var root = getActiveFullRoot();
      var anchor = root && root.querySelector('.lampac-mobile-right-anchor');
      var right = root && root.querySelector('.full-start-new__right');
      if (anchor && right && right.parentNode !== anchor.parentNode) {
        anchor.parentNode.insertBefore(right, anchor.nextSibling);
      }
      if (right) right.classList.remove('lampac-mobile-right-on-poster');
    }

    function buildMobilePosterCandidates(card, root) {
      var urls = [];
      var path = card && (card.poster_path || card.backdrop_path);
      var tmdb = window.Lampa && Lampa.TMDB && Lampa.TMDB.image;

      function pushUnique(url) {
        if (!url) return;
        if (urls.indexOf(url) === -1) urls.push(url);
      }

      function normalizePath(p) {
        if (!p) return '';
        if (/^https?:\/\//i.test(p)) return p;
        return p.charAt(0) === '/' ? p : ('/' + p);
      }

      var norm = normalizePath(path);
      if (/^https?:\/\//i.test(norm)) {
        pushUnique(norm);
      } else if (norm && tmdb) {
        // Different builds use different formats in Lampa.TMDB.image.
        pushUnique(Lampa.TMDB.image('w780' + norm));
        pushUnique(Lampa.TMDB.image('/t/p/w780' + norm));
        pushUnique(Lampa.TMDB.image('original' + norm));
        pushUnique(Lampa.TMDB.image('/t/p/original' + norm));
      }

      var domImg = root && (root.querySelector('img.full-start__background') || root.querySelector('.full-start-new__img') || root.querySelector('.full-start__img'));
      if (domImg && domImg.src) pushUnique(domImg.src);

      return urls;
    }

    function loadPosterWithFallback(img, urls, onFail) {
      if (!img || !urls || !urls.length) {
        if (onFail) onFail();
        return;
      }
      var index = 0;
      img.onerror = function () {
        index++;
        if (index >= urls.length) {
          img.onerror = null;
          if (onFail) onFail();
          return;
        }
        img.src = urls[index];
      };
      img.src = urls[index];
    }

    function normalizeMobilePosterColor(rgb) {
      if (!rgb || rgb.length < 3) return { rgb: '24,34,44', hex: '#18222c' };
      var r = Math.max(0, Math.min(255, Math.round(rgb[0] * 0.72)));
      var g = Math.max(0, Math.min(255, Math.round(rgb[1] * 0.72)));
      var b = Math.max(0, Math.min(255, Math.round(rgb[2] * 0.78)));
      var max = Math.max(r, g, b);
      if (max < 46) {
        var boost = 46 - max;
        r = Math.min(255, r + boost);
        g = Math.min(255, g + boost);
        b = Math.min(255, b + boost);
      }
      var rgbStr = [r, g, b].join(',');
      var hex = '#' + [r, g, b].map(function (n) {
        var h = n.toString(16);
        return h.length === 1 ? '0' + h : h;
      }).join('');
      return { rgb: rgbStr, hex: hex };
    }

    function setMobilePosterBgVars(color) {
      var root = document.documentElement;
      if (!root) return;
      var value = color || { rgb: '24,34,44', hex: '#18222c' };
      root.style.setProperty('--lampac-mobile-poster-rgb', value.rgb);
      root.style.setProperty('--lampac-mobile-poster-bg', value.hex);
    }

    function applyPosterBackgroundFromImage(img) {
      if (!img || !img.complete) {
        setMobilePosterBgVars();
        return;
      }

      try {
        if ((Lampa.Storage.get('lampac_screen_mobile_bg', '') || (Lampa.Storage.get(STORAGE_KEY, 'classic') === 'classic' ? 'poster' : 'black')) === 'poster') {
          applyPosterBackgroundFromImage(img);
        }
        var c = document.createElement('canvas');
        c.width = 18;
        c.height = 18;
        var x = c.getContext('2d', { willReadFrequently: true });
        x.drawImage(img, 0, 0, 18, 18);

        var data = x.getImageData(0, 6, 18, 10).data;
        var r = 0, g = 0, b = 0, count = 0;
        for (var i = 0; i < data.length; i += 4) {
          var alpha = data[i + 3];
          if (alpha < 40) continue;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }

        if (!count) {
          setMobilePosterBgVars();
          return;
        }

        setMobilePosterBgVars(normalizeMobilePosterColor([r / count, g / count, b / count]));
      } catch (e) {
        setMobilePosterBgVars();
      }
    }

    function renderMobilePosterCard() {
      if (window.innerWidth > 600) return;
      if (Lampa.Storage.get('lampac_screen_mobile_layout', 'poster') !== 'poster') {
        restoreMobileInfoBlock();
        cleanupMobilePosterCard();
        setMobilePosterBgVars();
        return;
      }

      var root = getActiveFullRoot();
      var body = root && root.querySelector('.full-start-new__body');
      var right = root && root.querySelector('.full-start-new__right');
      if (!root || !body || !right) return;

      var anchor = body.querySelector('.lampac-mobile-right-anchor');
      if (!anchor) {
        anchor = document.createElement('div');
        anchor.className = 'lampac-mobile-right-anchor';
        body.insertBefore(anchor, right);
      }

      var activity = Lampa.Activity.active();
      var card = activity && activity.card;
      var candidates = buildMobilePosterCandidates(card, root);
      if (!candidates.length) return;

      var posterCard = body.querySelector('.lampac-mobile-poster-card');
      if (!posterCard) {
        posterCard = document.createElement('div');
        posterCard.className = 'lampac-mobile-poster-card';
        posterCard.innerHTML = '<img alt="" />';
        body.insertBefore(posterCard, anchor.nextSibling);
      }

      if (right.parentNode !== body) body.appendChild(right);
      if (posterCard.nextSibling !== right) body.insertBefore(right, posterCard.nextSibling);
      right.classList.remove('lampac-mobile-right-on-poster');

      var img = posterCard.querySelector('img');
      if (!img) return;

      if (img.getAttribute('data-card') === String(card && card.id || '') && img.getAttribute('data-ok') === '1') return;
      img.setAttribute('data-card', String(card && card.id || ''));
      img.setAttribute('data-ok', '0');

      img.onload = function () {
        img.setAttribute('data-ok', '1');
        posterCard.style.display = '';
        applyPosterBackgroundFromImage(img);
        applyAutoContrast();
      };
      loadPosterWithFallback(img, candidates, function () {
        restoreMobileInfoBlock();
        posterCard.style.display = 'none';
        setMobilePosterBgVars();
      });
    }

    function applyAutoContrast() {
      if (Lampa.Storage.get('lampac_screen_auto_contrast', 'on') !== 'on') return;
      var root = getActiveFullRoot();
      if (!root) return;
      var img = root.querySelector('.lampac-mobile-poster-card img') || root.querySelector('img.full-start__background');
      if (!img || !img.complete) return;

      try {
        if ((Lampa.Storage.get('lampac_screen_mobile_bg', '') || (Lampa.Storage.get(STORAGE_KEY, 'classic') === 'classic' ? 'poster' : 'black')) === 'poster') {
          applyPosterBackgroundFromImage(img);
        }
        var c = document.createElement('canvas');
        c.width = 12;
        c.height = 12;
        var x = c.getContext('2d');
        x.drawImage(img, 0, 0, 12, 12);
        var data = x.getImageData(0, 0, 12, 12).data;
        var sum = 0;
        for (var i = 0; i < data.length; i += 4) {
          sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        }
        var avg = sum / (data.length / 4);
        if (avg > 150) root.classList.add('lampac-contrast-strong');
        else root.classList.remove('lampac-contrast-strong');
      } catch (e) {
        root.classList.add('lampac-contrast-strong');
      }
    }

    function hideEmptyBlocks() {
      var root = getActiveFullRoot();
      var details = root && root.querySelector('.full-start-new__details');
      if (details) {
        var spans = details.querySelectorAll('span');
        for (var i = 0; i < spans.length; i++) {
          var txt = (spans[i].textContent || '').replace(/\s+/g, ' ').trim();
          if (!txt || txt === '•' || txt === '|') spans[i].style.display = 'none';
        }
      }

      var lines = document.querySelectorAll('.items-line.layer--visible.layer--render');
      for (var j = 0; j < lines.length; j++) {
        var body = lines[j].querySelector('.items-line__body');
        if (!body) continue;
        var hasContent = body.children && body.children.length > 0;
        var txtBody = (body.textContent || '').replace(/\s+/g, ' ').trim();
        if (!hasContent && !txtBody) lines[j].style.display = 'none';
      }
    }

    function findMainButtons(root) {
      var buttons = root.querySelector('.full-start-new__buttons') || root.querySelector('.full-start__buttons');
      if (!buttons) return null;
      var all = Array.prototype.slice.call(buttons.querySelectorAll('.full-start__button, .selector'));
      function findByClass(sel) { return buttons.querySelector(sel); }
      function findByText(re) {
        for (var i = 0; i < all.length; i++) {
          if (re.test((all[i].textContent || '').trim())) return all[i];
        }
        return null;
      }
      return {
        container: buttons,
        online: findByClass('.view--online, .lampac--button') || findByText(/(онлайн|online|lampac)/i),
        torrent: findByClass('.view--torrent') || findByText(/(торрент|torrent)/i),
        trailer: findByClass('.view--trailer') || findByText(/(трейлер|trailer)/i)
      };
    }

    function renderWatchProgress() {
      if (Lampa.Storage.get('lampac_screen_watch_progress', 'on') !== 'on') return;
      var root = getActiveFullRoot();
      var right = root && root.querySelector('.full-start-new__right');
      if (!root || !right) return;
      var old = right.querySelector('.lampac-watch-progress');
      if (old && old.parentNode) old.parentNode.removeChild(old);

      var activity = Lampa.Activity.active();
      var card = activity && activity.card;
      var percent = 0;
      if (card) {
        if (typeof card.percent === 'number') percent = card.percent;
        else if (typeof card.progress === 'number') percent = card.progress;
        else if (card.timeline && typeof card.timeline.percent === 'number') percent = card.timeline.percent;
        else if (card.watched && card.time) percent = Math.round((card.watched / card.time) * 100);
      }
      percent = Math.max(0, Math.min(100, parseInt(percent || 0, 10)));
      if (percent <= 0) return;

      var bar = document.createElement('div');
      bar.className = 'lampac-watch-progress';
      bar.innerHTML = '<div class="lampac-watch-progress__fill" style="width:' + percent + '%"></div>';
      var target = right.querySelector('.full-start-new__buttons') || right.firstChild;
      if (target && target.parentNode) target.parentNode.insertBefore(bar, target);
    }

    function getActiveFullRoot() {
      return document.querySelector('.activity.activity--active .full-start-new') ||
        document.querySelector('.activity--active .full-start-new') ||
        document.querySelector('.activity.activity--active .full-start') ||
        document.querySelector('.activity--active .full-start') ||
        document.querySelector('.full-start') ||
        document.querySelector('.full-start-new');
    }

    function atTopOfMovieScreen() {
      var activeScroll = document.querySelector('.activity.activity--active .scroll--mask') ||
        document.querySelector('.activity.activity--active .scroll__mask') ||
        document.querySelector('.activity.activity--active .scroll__body') ||
        document.querySelector('.activity.activity--active .scroll__content') ||
        document.querySelector('.activity--active .scroll--mask') ||
        document.querySelector('.activity--active .scroll__mask') ||
        document.querySelector('.activity--active .scroll__body') ||
        document.querySelector('.activity--active .scroll__content');
      if (activeScroll && typeof activeScroll.scrollTop === 'number') {
        return activeScroll.scrollTop <= 2;
      }
      var docTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      return docTop <= 2;
    }

    function closeMobilePosterFullscreen() {
      var old = document.getElementById('lampac-mobile-poster-fullscreen');
      if (old && old.parentNode) old.parentNode.removeChild(old);
      document.body.classList.remove('lampac-poster-fs-open');
    }

    function openMobilePosterFullscreen() {
      closeMobilePosterFullscreen();
      var root = getActiveFullRoot();
      if (!root) return;
      var img = root.querySelector('.lampac-mobile-poster-card img') || root.querySelector('img.full-start__background') || root.querySelector('.full-start-new__img') || root.querySelector('.full-start__img');
      var src = img && (img.currentSrc || img.src);
      if (!src) return;

      var overlay = document.createElement('div');
      overlay.id = 'lampac-mobile-poster-fullscreen';
      overlay.style.cssText = [
        'position:fixed',
        'inset:0',
        'z-index:2147483647',
        'background:rgba(0,0,0,.96)',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'padding:0',
        'cursor:pointer'
      ].join(';');

      var poster = document.createElement('img');
      poster.src = src;
      poster.alt = '';
      poster.style.cssText = 'max-width:100vw; max-height:100vh; width:auto; height:auto; object-fit:contain; display:block;';
      overlay.appendChild(poster);

      var close = function () { closeMobilePosterFullscreen(); };
      overlay.addEventListener('click', close);
      overlay.addEventListener('touchend', close, { passive: true });
      document.body.appendChild(overlay);
      document.body.classList.add('lampac-poster-fs-open');
    }

    function setupMobilePosterSwipeOpen() {
      if (window.innerWidth > 600) return;
      if (window.__lampac_mobile_swipe_bound) return;

      var startY = 0;
      var startX = 0;
      var tracking = false;

      document.addEventListener('touchstart', function (e) {
        if (window.innerWidth > 600) return;
        if (!e.touches || !e.touches[0]) return;
        if (!atTopOfMovieScreen()) return;

        var root = getActiveFullRoot();
        if (!root) return;
        var target = e.target;
        if (!target) return;
        var inCurrentScreen = target.closest('.full-start-new');
        if (!inCurrentScreen || inCurrentScreen !== root) return;
        var inPoster = target.closest('.lampac-mobile-poster-card') || target.closest('.full-start-new__body');
        if (!inPoster) return;

        tracking = true;
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
      }, { passive: true });

      document.addEventListener('touchmove', function (e) {
        if (!tracking || window.innerWidth > 600) return;
        if (!e.touches || !e.touches[0]) return;
        var dy = e.touches[0].clientY - startY;
        var dx = Math.abs(e.touches[0].clientX - startX);
        if (dy > 70 && dx < 55) {
          tracking = false;
          openMobilePosterFullscreen();
        }
      }, { passive: true });

      document.addEventListener('touchend', function () { tracking = false; }, { passive: true });
      window.__lampac_mobile_swipe_bound = true;
    }


    function getButtonReadableTitle(el) {
      if (!el) return '';
      var txt = (el.textContent || el.innerText || '').replace(/\s+/g, ' ').trim();
      if (!txt) txt = el.getAttribute('title') || el.getAttribute('aria-label') || '';
      return txt || 'Источник';
    }

    function isServiceButtonEl(el) {
      if (!el) return false;
      return el.classList.contains('button--book') ||
        el.classList.contains('button--options') ||
        el.classList.contains('button--reaction');
    }

    function collectFolderSourceButtons(buttonsEl, includeHidden) {
      var items = [];
      if (!buttonsEl) return items;
      var all = buttonsEl.querySelectorAll('.full-start__button, .selector');
      for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if (!el) continue;
        if (!includeHidden && !el.offsetParent && el.style.display === 'none') continue;
        if (isServiceButtonEl(el)) continue;
        items.push(el);
      }
      return items;
    }

    function openButtonsFolderSelector(root, items) {
      if (!items || !items.length || !window.Lampa || !Lampa.Select || !Lampa.Select.show) return;
      var enabled = 'full_start';
      var list = items.map(function (el) {
        return { title: getButtonReadableTitle(el), _node: el };
      });
      Lampa.Select.show({
        title: 'Смотреть',
        items: list,
        onBack: function () {
          try { if (window.Lampa && Lampa.Controller && Lampa.Controller.toggle) Lampa.Controller.toggle(enabled); } catch (e) {}
        },
        onSelect: function (a) {
          var node = a && a._node;
          if (!node) return;
          try { if (window.Lampa && Lampa.Controller && Lampa.Controller.toggle) Lampa.Controller.toggle(enabled); } catch (e) {}
          try {
            if (window.$) $(node).trigger('hover:enter');
            else if (node.click) node.click();
          } catch (e) {
            try { if (node.click) node.click(); } catch (e2) {}
          }
        }
      });
    }

    function ensureButtonsFolder(root, buttonsEl, hideExtraButtons) {
      if (!root || !buttonsEl) return;
      var reactionsHidden = false;

      var allBtns = buttonsEl.querySelectorAll('.full-start__button, .selector');
      for (var i = 0; i < allBtns.length; i++) {
        allBtns[i].classList.remove('alcopac-folder-hidden');
        if (!(reactionsHidden && allBtns[i].classList.contains('button--reaction'))) {
          allBtns[i].style.display = '';
          allBtns[i].removeAttribute('hidden');
        }
      }

      var extraBtns = buttonsEl.querySelectorAll('.button--options, .button--reaction');
      for (var eb = 0; eb < extraBtns.length; eb++) {
        var shouldHideExtra = hideExtraButtons ||
          (reactionsHidden && extraBtns[eb].classList.contains('button--reaction'));
        if (shouldHideExtra) {
          extraBtns[eb].classList.add('alcopac-force-hidden');
          extraBtns[eb].style.display = 'none';
          extraBtns[eb].style.visibility = 'hidden';
          extraBtns[eb].style.opacity = '0';
          extraBtns[eb].setAttribute('hidden', 'hidden');
        } else {
          extraBtns[eb].classList.remove('alcopac-force-hidden');
          extraBtns[eb].style.display = '';
          extraBtns[eb].style.visibility = '';
          extraBtns[eb].style.opacity = '';
          extraBtns[eb].removeAttribute('hidden');
        }
      }

      try {
        if (window.Lampa && Lampa.Controller && Lampa.Controller.collectionSet && window.$) {
          Lampa.Controller.collectionSet($(buttonsEl));
        }
      } catch (e) {}
    }

    function promoteFolderButtons(force) {
      var root = document.querySelector('.activity.activity--active .full-start-new') ||
        document.querySelector('.activity--active .full-start-new') ||
        document.querySelector('.activity.activity--active .full-start') ||
        document.querySelector('.activity--active .full-start') ||
        document.querySelector('.full-start-new') ||
        document.querySelector('.full-start');
      if (!root) return;

      var hideExtraButtons = Lampa.Storage.get('lampac_screen_hide_extra_buttons', 'off') === 'on';
      var reactionsHidden = false;
      var smartOrder = Lampa.Storage.get('lampac_screen_smart_order', 'on') === 'on';
      var orderString = Lampa.Storage.get('lampac_screen_button_order', 'online,torrent,trailer,book');
      var orderTokens = orderString.split(',').map(function (x) { return x.trim(); }).filter(Boolean);

      var buttonsEl = root.querySelector('.full-start-new__buttons') || root.querySelector('.full-start__buttons');
      var container = root.querySelector('.buttons--container');
      if (!buttonsEl || !container) return;
      if (!force && buttonsEl.getAttribute('data-unfolded') === '1') return;

      if (window.__alcopac_buttons_apply_timer) {
        try { clearTimeout(window.__alcopac_buttons_apply_timer); } catch (e) {}
      }

      var applyOnce = function () {
        root = document.querySelector('.activity.activity--active .full-start-new') ||
          document.querySelector('.activity--active .full-start-new') ||
          document.querySelector('.activity.activity--active .full-start') ||
          document.querySelector('.activity--active .full-start') ||
          document.querySelector('.full-start-new') ||
          document.querySelector('.full-start');
        if (!root) return;

        buttonsEl = root.querySelector('.full-start-new__buttons') || root.querySelector('.full-start__buttons');
        container = root.querySelector('.buttons--container');
        if (!buttonsEl || !container) return;

        var buttons_container = $(buttonsEl);
        var prevVisibility = buttonsEl.style.visibility;
        buttonsEl.style.visibility = 'hidden';

        function getButtonsByText(re) {
          var found = $();
          buttons_container.find('.full-start__button, .selector').each(function () {
            if (re.test((this.textContent || '').trim())) found = found.add(this);
          });
          return found.first();
        }

        function getButtonMap() {
          var onlineBtn = buttons_container.find('.view--online, .lampac--button').first();
          if (!onlineBtn.length) onlineBtn = getButtonsByText(/(онлайн|online|lampac)/i);

          var torrentBtn = buttons_container.find('.view--torrent').first();
          if (!torrentBtn.length) torrentBtn = getButtonsByText(/(торрент|torrent)/i);

          var trailerBtn = buttons_container.find('.view--trailer').first();
          if (!trailerBtn.length) trailerBtn = getButtonsByText(/(трейлер|trailer)/i);

          var favBtn = buttons_container.find('.button--book').first();
          if (!favBtn.length) favBtn = getButtonsByText(/(избран|book)/i);

          return { online: onlineBtn, torrent: torrentBtn, trailer: trailerBtn, book: favBtn };
        }

        $(container).find('.full-start__button, .selector').each(function () {
          if (reactionsHidden && this.classList && this.classList.contains('button--reaction')) {
            this.classList.add('alcopac-force-hidden');
            this.style.display = 'none';
            this.style.visibility = 'hidden';
            this.style.opacity = '0';
            this.setAttribute('hidden', 'hidden');
            return;
          }
          this.classList.remove('hide');
          buttonsEl.appendChild(this);
        });

        if (hideExtraButtons) {
          buttons_container.find('.button--options').remove();
        }

        var map = getButtonMap();
        var onlineBtn = map.online;

        if (smartOrder) {
          var ordered = [];
          for (var t = 0; t < orderTokens.length; t++) {
            var key = orderTokens[t];
            if (key === 'trailer' && hideExtraButtons) continue;
            if (map[key] && map[key].length) ordered.push(map[key][0]);
          }

          for (var i = ordered.length - 1; i >= 0; i--) {
            if (ordered[i] && ordered[i].parentNode === buttonsEl) {
              buttonsEl.prepend(ordered[i]);
            }
          }
        }

        if (hideExtraButtons) {
          buttons_container.find('.view--trailer').show();
        }

        ensureButtonsFolder(root, buttonsEl, hideExtraButtons);
        buttons_container = $(buttonsEl);

        buttonsEl.setAttribute('data-unfolded', '1');

        try {
          if (window.Lampa && Lampa.Controller) {
            if (Lampa.Controller.toggle) Lampa.Controller.toggle('full_start');
            if (Lampa.Controller.collectionSet) Lampa.Controller.collectionSet(buttons_container);
          }
        } catch (e) {}

        requestAnimationFrame(function () {
          buttonsEl.style.visibility = prevVisibility || '';
          if (onlineBtn && onlineBtn.length) {
            try {
              if (window.Lampa && Lampa.Controller && Lampa.Controller.focus) {
                Lampa.Controller.focus(onlineBtn[0]);
              } else {
                onlineBtn.addClass('focus');
              }
            } catch (e) {}
          }
        });
      };

      applyOnce();
      window.__alcopac_buttons_apply_timer = setTimeout(function () {
        applyOnce();
      }, 80);
    }



    // ─── AlcopacTheme facade + Online module (v5 demo) ─────────────────
    var ONLINE_STYLE_ID = 'lampac-theme-online-style';

    function getThemeTokenMap() {
      return {
        neon: { accent: '#00e5ff', accent2: '#7c4dff', text: '#e2e8f4', muted: '#8899bb', cardBg: 'rgba(16,24,40,0.92)', cardBg2: 'rgba(8,14,30,0.92)', panelBg: 'rgba(8,14,30,0.88)', line: 'rgba(0,229,255,0.32)', glow: 'rgba(0,229,255,0.28)' },
        aurora: { accent: '#c471ed', accent2: '#12c2e9', text: '#ece4f8', muted: '#9988bb', cardBg: 'rgba(28,16,44,0.92)', cardBg2: 'rgba(16,10,28,0.92)', panelBg: 'rgba(20,10,34,0.88)', line: 'rgba(196,113,237,0.28)', glow: 'rgba(196,113,237,0.24)' },
        gold: { accent: '#f5c451', accent2: '#ffecb3', text: '#fff7e6', muted: '#d5bf88', cardBg: 'rgba(38,26,12,0.92)', cardBg2: 'rgba(22,14,6,0.92)', panelBg: 'rgba(26,18,8,0.88)', line: 'rgba(245,196,81,0.30)', glow: 'rgba(245,196,81,0.24)' },
        mono: { accent: '#ffffff', accent2: '#d0d0d0', text: '#f1f1f1', muted: '#bbbbbb', cardBg: 'rgba(28,28,28,0.94)', cardBg2: 'rgba(18,18,18,0.94)', panelBg: 'rgba(18,18,18,0.90)', line: 'rgba(255,255,255,0.18)', glow: 'rgba(255,255,255,0.16)' },
        sunset: { accent: '#ff7f50', accent2: '#ffd166', text: '#fff3eb', muted: '#f5b6a0', cardBg: 'rgba(48,20,18,0.92)', cardBg2: 'rgba(30,12,10,0.92)', panelBg: 'rgba(36,15,13,0.88)', line: 'rgba(255,127,80,0.24)', glow: 'rgba(255,127,80,0.24)' },
        glass: { accent: '#ffffff', accent2: '#9ecbff', text: '#f7fbff', muted: 'rgba(255,255,255,0.68)', cardBg: 'rgba(255,255,255,0.08)', cardBg2: 'rgba(255,255,255,0.05)', panelBg: 'rgba(255,255,255,0.10)', line: 'rgba(255,255,255,0.14)', glow: 'rgba(255,255,255,0.20)' },
        appletv: { accent: '#ffffff', accent2: '#9ecbff', text: '#f5f7fb', muted: 'rgba(255,255,255,0.72)', cardBg: 'rgba(255,255,255,0.07)', cardBg2: 'rgba(255,255,255,0.04)', panelBg: 'rgba(8,10,18,0.54)', line: 'rgba(255,255,255,0.12)', glow: 'rgba(255,255,255,0.20)' },
        custom: { accent: '#ffffff', accent2: '#9ecbff', text: '#f5f7fb', muted: 'rgba(255,255,255,0.72)', cardBg: 'rgba(255,255,255,0.07)', cardBg2: 'rgba(255,255,255,0.04)', panelBg: 'rgba(8,10,18,0.54)', line: 'rgba(255,255,255,0.12)', glow: 'rgba(255,255,255,0.20)' }
      };
    }

    function getActiveThemeName() { return Lampa.Storage.get(STORAGE_KEY, 'appletv'); }

    function getActiveThemeTokens() {
      var map = getThemeTokenMap();
      var themeName = getActiveThemeName();
      var t = map[themeName] || map.appletv;
      return { name: themeName, cls: themeName + '--theme', accent: t.accent, accent2: t.accent2, text: t.text, muted: t.muted, cardBg: t.cardBg, cardBg2: t.cardBg2, panelBg: t.panelBg, line: t.line, glow: t.glow, isGlass: themeName === 'glass' || themeName === 'appletv' || themeName === 'custom' };
    }

    function getOnlineSettings() {
      return {
        style: Lampa.Storage.get('lampac_online_style', 'wide'),
        quality: Lampa.Storage.get('lampac_online_show_quality', 'show'),
        timeline: Lampa.Storage.get('lampac_online_show_timeline', 'show'),
        watched: Lampa.Storage.get('lampac_online_watched_style', 'badge'),
        mobileCompact: Lampa.Storage.get('lampac_online_mobile_compact', 'on'),
        titleLines: Lampa.Storage.get('lampac_online_title_lines', '2'),
        focusBoost: Lampa.Storage.get('lampac_online_tv_focus_boost', 'on')
      };
    }

    function buildOnlineCssFromTheme() {
      var t = getActiveThemeTokens();
      var s = getOnlineSettings();
      var compact = s.style === 'compact';
      var poster = s.style === 'poster';
      var titleClamp = s.titleLines === '1' ? '1' : (s.titleLines === '3' ? '3' : '2');
      var focusScale = s.focusBoost === 'on' ? '1.025' : '1.0';
      var blur = t.isGlass ? 'blur(18px)' : 'blur(10px)';
      return [
        '.online-prestige{ position:relative; overflow:hidden; border-radius:1.2em; background:' + t.cardBg + '; border:1px solid ' + t.line + '; box-shadow:0 14px 38px rgba(0,0,0,.28); transition:transform .18s ease, box-shadow .18s ease, background .18s ease; }',
        '.online-prestige::before{ content:""; position:absolute; inset:0; pointer-events:none; background:linear-gradient(180deg, rgba(255,255,255,.06) 0%, rgba(255,255,255,0) 28%); opacity:' + (t.isGlass ? '1' : '.55') + '; }',
        '.online-prestige.focus,.online-prestige.hover{ transform:scale(' + focusScale + '); box-shadow:0 0 0 1px ' + t.line + ', 0 0 28px ' + t.glow + ', 0 14px 42px rgba(0,0,0,.38); }',
        '.online-prestige.focus::after,.online-prestige.hover::after{ border-color:' + t.accent + ' !important; box-shadow:0 0 0 1px ' + t.line + ', 0 0 22px ' + t.glow + '; border-radius:1.35em !important; }',
        '.online-prestige__img{ background:' + t.cardBg2 + '; border-radius:' + (poster ? '1.05em' : '0.95em') + '; overflow:hidden; border:1px solid rgba(255,255,255,.06); }',
        '.online-prestige__img img{ object-fit:cover; }',
        '.online-prestige__body{ color:' + t.text + '; }',
        '.online-prestige__title{ color:' + t.text + '; font-weight:600; letter-spacing:.01em; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:' + titleClamp + '; overflow:hidden; }',
        '.online-prestige__time,.online-prestige__info{ color:' + t.muted + '; }',
        '.online-prestige__quality{ color:' + t.accent + '; font-weight:700; padding:.12em .45em; border-radius:.55em; background:' + t.cardBg2 + '; border:1px solid ' + t.line + '; }',
        '.online-prestige__timeline .time-line{ background:rgba(255,255,255,.10); height:.32em; border-radius:999px; overflow:hidden; }',
        '.online-prestige__timeline .time-line > div{ background:linear-gradient(90deg, ' + t.accent2 + ', ' + t.accent + '); border-radius:999px; }',
        '.online-prestige__viewed{ background:' + t.panelBg + '; color:' + t.text + '; border:1px solid ' + t.line + '; backdrop-filter:' + blur + '; -webkit-backdrop-filter:' + blur + '; }',
        '.online-prestige--folder .online-prestige__folder{ color:' + t.text + '; opacity:.92; }',
        '.online-prestige-watched{ background:' + t.cardBg + '; border:1px solid ' + t.line + '; }',
        '.online-prestige-watched__icon{ color:' + t.accent + '; }',
        '.online-prestige-watched__body{ color:' + t.muted + '; }',
        '.online-empty{ background:' + t.cardBg + '; border:1px solid ' + t.line + '; border-radius:1.2em; backdrop-filter:' + blur + '; -webkit-backdrop-filter:' + blur + '; }',
        '.online-empty__button{ border-radius:.8em; background:' + t.cardBg2 + '; border:1px solid ' + t.line + '; color:' + t.text + '; }',
        '.online-empty__button.focus{ background:' + t.panelBg + '; color:' + t.text + '; box-shadow:0 0 0 1px ' + t.line + ', 0 0 18px ' + t.glow + '; }',
        (compact ? '.online-prestige--full{ padding:.75em !important; } .online-prestige__head{ margin-bottom:.25em !important; } .online-prestige__footer{ margin-top:.28em !important; } .online-prestige__img{ width:8.8em !important; min-width:8.8em !important; }' : ''),
        (poster ? '.online-prestige--full{ align-items:stretch !important; } .online-prestige__img{ width:7.2em !important; min-width:7.2em !important; height:10.6em !important; } .online-prestige__body{ padding-left:.15em; }' : ''),
        (s.quality === 'hide' ? '.online-prestige__quality{ display:none !important; }' : ''),
        (s.timeline === 'hide' ? '.online-prestige__timeline{ display:none !important; }' : ''),
        (s.watched === 'dim' ? '.online-prestige__viewed,.online-prestige-watched{ opacity:.82; }' : ''),
        (s.mobileCompact === 'on' ? '@media(max-width:600px){ .online-prestige{ border-radius:1em; } .online-prestige--full{ padding:.72em !important; } .online-prestige__img{ width:' + (poster ? '5.8em' : '8.2em') + ' !important; min-width:' + (poster ? '5.8em' : '8.2em') + ' !important; height:' + (poster ? '8.6em' : '5.6em') + ' !important; } .online-prestige__title{ font-size:1.02em !important; } .online-prestige__info{ font-size:.92em !important; } }' : '')
      ].join('\n');
    }

    function registerOnlineTemplates() {
      if (!(window.Lampa && Lampa.Template && Lampa.Template.add)) return;
      Lampa.Template.add('lampac_prestige_full', '<div class="online-prestige online-prestige--full selector"><div class="online-prestige__img"><img alt=""><div class="online-prestige__loader"></div></div><div class="online-prestige__body"><div class="online-prestige__head"><div class="online-prestige__title">{title}</div><div class="online-prestige__time">{time}</div></div><div class="online-prestige__timeline"></div><div class="online-prestige__footer"><div class="online-prestige__info">{info}</div><div class="online-prestige__quality">{quality}</div></div></div></div>');
      Lampa.Template.add('lampac_content_loading', '<div class="online-empty"><div class="broadcast__scan"><div></div></div><div class="online-empty__templates"><div class="online-empty-template selector"><div class="online-empty-template__ico"></div><div class="online-empty-template__body"></div></div><div class="online-empty-template"><div class="online-empty-template__ico"></div><div class="online-empty-template__body"></div></div><div class="online-empty-template"><div class="online-empty-template__ico"></div><div class="online-empty-template__body"></div></div></div></div>');
      Lampa.Template.add('lampac_does_not_answer', '<div class="online-empty"><div class="online-empty__title">#{lampac_balanser_dont_work}</div><div class="online-empty__time">#{lampac_balanser_timeout}</div><div class="online-empty__buttons"><div class="online-empty__button selector cancel">#{cancel}</div><div class="online-empty__button selector change">#{lampac_change_balanser}</div></div><div class="online-empty__templates"><div class="online-empty-template"><div class="online-empty-template__ico"></div><div class="online-empty-template__body"></div></div><div class="online-empty-template"><div class="online-empty-template__ico"></div><div class="online-empty-template__body"></div></div><div class="online-empty-template"><div class="online-empty-template__ico"></div><div class="online-empty-template__body"></div></div></div></div>');
      Lampa.Template.add('lampac_prestige_folder', '<div class="online-prestige online-prestige--folder selector"><div class="online-prestige__folder"><svg viewBox="0 0 128 112" fill="none" xmlns="http://www.w3.org/2000/svg"><rect y="20" width="128" height="92" rx="13" fill="white"></rect><path d="M29.9963 8H98.0037C96.0446 3.3021 91.4079 0 86 0H42C36.5921 0 31.9555 3.3021 29.9963 8Z" fill="white" fill-opacity="0.23"></path><rect x="11" y="8" width="106" height="76" rx="13" fill="white" fill-opacity="0.51"></rect></svg></div><div class="online-prestige__body"><div class="online-prestige__head"><div class="online-prestige__title">{title}</div><div class="online-prestige__time">{time}</div></div><div class="online-prestige__footer"><div class="online-prestige__info">{info}</div></div></div></div>');
      Lampa.Template.add('lampac_prestige_watched', '<div class="online-prestige online-prestige-watched selector"><div class="online-prestige-watched__icon"><svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10.5" cy="10.5" r="9" stroke="currentColor" stroke-width="3"/><path d="M14.8477 10.5628L8.20312 14.399L8.20313 6.72656L14.8477 10.5628Z" fill="currentColor"/></svg></div><div class="online-prestige-watched__body"></div></div>');
    }

    function applyOnlineTheme() {
      registerOnlineTemplates();
      var existing = document.getElementById(ONLINE_STYLE_ID);
      if (existing) existing.parentNode.removeChild(existing);
      var style = document.createElement('style');
      style.id = ONLINE_STYLE_ID;
      style.type = 'text/css';
      style.textContent = buildOnlineCssFromTheme();
      document.head.appendChild(style);
    }

    function registerOnlineSettings() {
      if (window.__lampac_online_settings_registered) return;
      window.__lampac_online_settings_registered = true;
      // Дубли online-настроек в разделе «Оформление» убраны.
      // Оставляем их только в обычных настройках самого плагина online.
    }


    function ensureFacade() {
      window.AlcopacTheme = window.AlcopacTheme || { version: '5.0.0-demo', core: {}, theme: {}, cards: {}, full: {}, online: {}, mobile: {}, tools: {}, settings: {}, reapply: function () { try { applyTheme(Lampa.Storage.get(STORAGE_KEY, 'appletv')); } catch (e) {} try { applyCardDisplay(); } catch (e) {} try { applyScreenStyle(); } catch (e) {} try { applyOnlineTheme(); } catch (e) {} } };
      var A = window.AlcopacTheme;
      A.core.STORAGE_KEY = STORAGE_KEY;
      A.core.STYLE_ID = STYLE_ID;
      A.core.ALL_CLASSES = ALL_CLASSES.slice();
      A.theme.apply = function (name) { applyTheme(name || Lampa.Storage.get(STORAGE_KEY, 'appletv')); applyOnlineTheme(); };
      A.theme.getActiveName = getActiveThemeName;
      A.theme.getActiveTokens = getActiveThemeTokens;
      A.cards.apply = applyCardDisplay;
      A.full.apply = applyScreenStyle;
      A.full.reorderButtons = function (force) { window.__alcopac_theme_full_controls_buttons = true; return promoteFolderButtons(force); };
      A.mobile.apply = function () { renderMobilePosterCard(); applyAutoContrast(); setupMobilePosterSwipeOpen(); };
      A.tools.handle = handleToolsAction;
      A.online.apply = applyOnlineTheme;
      A.online.registerTemplates = registerOnlineTemplates;
      A.online.getSettings = getOnlineSettings;
      A.settings.registerOnline = registerOnlineSettings;
    }

    var __baseApplyTheme = applyTheme;
    applyTheme = function (name) {
      __baseApplyTheme(name);
      try { applyOnlineTheme(); } catch (e) {}
    };

    ensureFacade();
    registerOnlineSettings();
    applyOnlineTheme();
    window.__alcopac_theme_full_controls_buttons = true;

    // Fix stale quality: hide cam/ts/tc for movies released >60 days ago
    var lowQuality = { 'cam': true, 'camrip': true, 'ts': true, 'tc': true };
    function fixQuality(e) {
      if (e.type !== 'complite') return;
      var activity = Lampa.Activity.active();
      var card = activity && activity.card;
      if (!card) return;
      var rq = (card.release_quality || '').toLowerCase().trim();
      if (!rq || !lowQuality[rq]) return;
      // Check if movie is released and old enough that cam/ts is clearly stale
      var rd = card.release_date || card.first_air_date || '';
      if (!rd || card.status !== 'Released') return;
      var releaseDate = new Date(rd);
      var daysSinceRelease = (Date.now() - releaseDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceRelease < 60) return;
      // Movie released >60 days ago but still shows cam/ts — remove stale quality
      setTimeout(function () {
        var details = document.querySelector('.full-start-new__details');
        if (!details) return;
        var spans = details.querySelectorAll('span');
        for (var i = 0; i < spans.length; i++) {
          var sp = spans[i];
          if (sp.className === 'full-start-new__split' || sp.className === 'cinema-time-badge' || sp.className === 'cinema-genre-badge') continue;
          var txt = sp.textContent.trim().toLowerCase();
          if (txt === rq || txt === 'качество: ' + rq) {
            // Remove quality span and preceding separator
            var prev = sp.previousElementSibling;
            if (prev && prev.className === 'full-start-new__split') {
              prev.style.display = 'none';
            }
            sp.style.display = 'none';
            break;
          }
        }
        // Also hide tag badge
        var tagQuality = document.querySelector('.tag--quality');
        if (tagQuality) tagQuality.style.display = 'none';
      }, 1200);
    }

    var __alcopac_full_stage_timer = null;
    var __alcopac_full_stage_timer2 = null;
    var __alcopac_full_stage_timer3 = null;

    function markFullPending(state) {
      var root = getActiveFullRoot();
      if (!root) return;
      root.classList.toggle('alcopac-full-pending', !!state);
    }

    function stableFullBundle() {
      try { promoteFolderButtons(true); } catch (e) {}
      try { applyTitleLogoRetry(); } catch (e) {}
      try { placeDetailsAfterTagline(); } catch (e) {}
      try { renderCompactMetaLine(); } catch (e) {}
      try { renderWatchProgress(); } catch (e) {}
      try { renderMobilePosterCard(); } catch (e) {}
      try { hideEmptyBlocks(); } catch (e) {}
      try { applyAutoContrast(); } catch (e) {}
      try { setupMobilePosterSwipeOpen(); } catch (e) {}
    }

    Lampa.Listener.follow('full', function (e) {
      if (e.type === 'complite') {
        try { moveDescrIntoCinema(); } catch (e) {}

        clearTimeout(__alcopac_full_stage_timer);
        clearTimeout(__alcopac_full_stage_timer2);
        clearTimeout(__alcopac_full_stage_timer3);

        markFullPending(false);
        stableFullBundle();

        __alcopac_full_stage_timer = setTimeout(function () {
          stableFullBundle();
        }, 24);

        __alcopac_full_stage_timer2 = setTimeout(function () {
          requestAnimationFrame(function () {
            stableFullBundle();
          });
        }, 72);
      }
      fixQuality(e);
    });

    Lampa.Listener.follow('activity', function (e) {
      if (!e || (e.type !== 'start' && e.type !== 'activity' && e.type !== 'after')) return;
      clearTimeout(__alcopac_full_stage_timer);
      clearTimeout(__alcopac_full_stage_timer2);
      clearTimeout(__alcopac_full_stage_timer3);
      __alcopac_full_stage_timer = setTimeout(function () {
        try { stableFullBundle(); } catch (e) {}
      }, 140);
      __alcopac_full_stage_timer2 = setTimeout(function () {
        try { stableFullBundle(); } catch (e) {}
      }, 320);
    });

    if (!Lampa.Storage.get('lampac_screen_mobile_bg', '')) {
      Lampa.Storage.set('lampac_screen_mobile_bg', Lampa.Storage.get(STORAGE_KEY, 'classic') === 'classic' ? 'poster' : 'black');
    }
    setMobilePosterBgVars();
    applyTheme(Lampa.Storage.get(STORAGE_KEY, 'classic'));
    applyAutoThemeByTime();
    if (!window.__lampac_auto_theme_timer) {
      window.__lampac_auto_theme_timer = setInterval(applyAutoThemeByTime, 5 * 60 * 1000);
    }
    applyCardDisplay();
    applyScreenStyle();
  }

  // ─── Bootstrap ──────────────────────────────────────────
  if (window.appready) {
    startPlugin();
  } else {
    Lampa.Listener.follow('app', function (e) {
      if (e.type === 'ready') startPlugin();
    });
  }
})();


(function(){
  'use strict';
  var HERO_STYLE_ID='alcopac-online-hero-style';
  function ensureStyle(id){var s=document.getElementById(id); if(!s){s=document.createElement('style'); s.id=id; document.head.appendChild(s);} return s;}
  function getTokens(){
    var fallback={text:'#f5f7fb', muted:'rgba(255,255,255,.72)', cardBg:'rgba(255,255,255,.07)', cardBg2:'rgba(255,255,255,.04)', panelBg:'rgba(8,10,18,.54)', line:'rgba(255,255,255,.12)', glow:'rgba(255,255,255,.2)', accent:'#fff', isGlass:true};
    try{
      if(window.AlcopacTheme && AlcopacTheme.theme && AlcopacTheme.theme.getActiveTokens){
        var t=AlcopacTheme.theme.getActiveTokens();
        if(t && typeof t === 'object'){
          return {
            text: t.text || fallback.text,
            muted: t.muted || fallback.muted,
            cardBg: t.cardBg || fallback.cardBg,
            cardBg2: t.cardBg2 || fallback.cardBg2,
            panelBg: t.panelBg || fallback.panelBg,
            line: t.line || fallback.line,
            glow: t.glow || fallback.glow,
            accent: t.accent || fallback.accent,
            isGlass: typeof t.isGlass === 'boolean' ? t.isGlass : fallback.isGlass
          };
        }
      }
    }catch(e){}
    return fallback;
  }
  function buildCss(){
    var t=getTokens();
    var blur=t.isGlass?'blur(18px)':'blur(10px)';
    return [
      '.lampac-online-hero{position:relative;overflow:hidden;border-radius:1.35em;padding:1.05em 1.15em 1.15em;background:linear-gradient(180deg,'+t.cardBg+' 0%,'+t.panelBg+' 100%);border:1px solid '+t.line+';box-shadow:0 16px 38px rgba(0,0,0,.26);backdrop-filter:'+blur+';-webkit-backdrop-filter:'+blur+';}',
      '.lampac-online-hero::before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(255,255,255,.08) 0%,rgba(255,255,255,0) 34%);}',
      '.lampac-online-hero__title,.lampac-online-hero .explorer__title,.lampac-online-hero .full-start-new__title,.lampac-online-hero h1,.lampac-online-hero h2{position:relative;color:'+t.text+' !important;font-weight:700 !important;letter-spacing:-.02em !important;line-height:1.05 !important;margin:0 0 .4em 0 !important;text-shadow:0 6px 20px rgba(0,0,0,.2);}',
      '.lampac-online-hero__meta,.lampac-online-hero .explorer__details,.lampac-online-hero .explorer__info,.lampac-online-hero .full-start-new__details,.lampac-online-hero .full-start__details{position:relative;display:flex;flex-wrap:wrap;gap:.42em .5em;align-items:center;margin:0 0 .7em 0;color:'+t.muted+' !important;}',
      '.lampac-online-hero__meta > span,.lampac-online-hero .explorer__details > span,.lampac-online-hero .explorer__info > span,.lampac-online-hero .full-start-new__details > span,.lampac-online-hero .full-start__details > span{display:inline-flex;align-items:center;min-height:2em;padding:.32em .7em;border-radius:999px;background:'+t.cardBg2+';border:1px solid '+t.line+';box-shadow:inset 0 1px 0 rgba(255,255,255,.05);}',
      '.lampac-online-hero__descr,.lampac-online-hero .explorer__description,.lampac-online-hero .explorer__desc,.lampac-online-hero .explorer__about,.lampac-online-hero .full-descr,.lampac-online-hero .full-descr__text,.lampac-online-hero .items-line__description{position:relative;margin-top:.2em;padding:.9em 1em;border-radius:1em;background:'+t.cardBg2+';border:1px solid '+t.line+';color:'+t.text+' !important;line-height:1.45 !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.05);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:7;overflow:hidden;}',
      '.lampac-online-hero .full-descr{padding:0;background:none;border:none;box-shadow:none;}',
      '.lampac-online-hero .full-descr__text{padding:0;border:none;background:none;box-shadow:none;display:block;-webkit-line-clamp:unset;overflow:visible;}',
      '.lampac-online-hero__poster,.lampac-online-hero img:first-child,.lampac-online-hero .card__view,.lampac-online-hero .poster,.lampac-online-hero .explorer__poster{border-radius:1em;overflow:hidden;box-shadow:0 12px 30px rgba(0,0,0,.28);}',
      '@media (max-width: 900px){.lampac-online-hero{padding:.9em 1em 1em;border-radius:1.1em}.lampac-online-hero__title,.lampac-online-hero .explorer__title,.lampac-online-hero .full-start-new__title,.lampac-online-hero h1,.lampac-online-hero h2{font-size:1.55em !important}.lampac-online-hero__descr,.lampac-online-hero .explorer__description,.lampac-online-hero .explorer__desc,.lampac-online-hero .explorer__about,.lampac-online-hero .full-descr,.lampac-online-hero .items-line__description{padding:.8em .88em;-webkit-line-clamp:6;}}'
    ].join('\n');

  }
  function findHeroRoot(ctx){
    ctx=ctx||document;
    var selectors=['.activity--lampac .explorer__files-head','.activity--lampac .files__head','.activity--lampac .explorer__head','.activity--lampac .torrent-list > .head','.activity--lampac .torrent-list .explorer__files-head'];
    for(var i=0;i<selectors.length;i++){var el=ctx.querySelector(selectors[i]); if(el) return el;}
    return null;
  }
  function markChildren(root){
    if(!root) return;
    var title=root.querySelector('.explorer__title, .full-start-new__title, .full-start__title, h1, h2');
    if(title) title.classList.add('lampac-online-hero__title');
    var meta=root.querySelector('.explorer__details, .explorer__info, .full-start-new__details, .full-start__details');
    if(meta) meta.classList.add('lampac-online-hero__meta');
    var descr=root.querySelector('.explorer__description, .explorer__desc, .explorer__about, .full-descr, .full-descr__text, .items-line__description');
    if(descr) descr.classList.add('lampac-online-hero__descr');
    var poster=root.querySelector('img, .card__view, .poster, .explorer__poster');
    if(poster) poster.classList.add('lampac-online-hero__poster');
  }
  function apply(){
    ensureStyle(HERO_STYLE_ID).textContent=buildCss();
    var root=findHeroRoot(document);
    if(root){root.classList.add('lampac-online-hero'); markChildren(root);}
  }
  function observe(){
    if(window.__alcopac_online_hero_observer) return;
    var mo=new MutationObserver(function(muts){
      for(var i=0;i<muts.length;i++){
        var m=muts[i]; if(!m.addedNodes) continue;
        for(var j=0;j<m.addedNodes.length;j++){
          var n=m.addedNodes[j]; if(!n || n.nodeType!==1) continue;
          if((n.matches && (n.matches('.activity--lampac')||n.matches('.explorer__files-head'))) || (n.querySelector && (n.querySelector('.activity--lampac')||n.querySelector('.explorer__files-head')))) { apply(); return; }
        }
      }
    });
    mo.observe(document.body||document.documentElement,{childList:true,subtree:true});
    window.__alcopac_online_hero_observer=mo;
  }
  var prevApplyTheme=window.applyTheme;
  try{
    if(window.AlcopacTheme){
      window.AlcopacTheme.online=window.AlcopacTheme.online||{};
      var prev=window.AlcopacTheme.online.apply;
      window.AlcopacTheme.online.apply=function(){ if(prev) try{prev();}catch(e){} apply(); };
    }
  }catch(e){}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){apply(); observe();});
  else {apply(); observe();}
  setTimeout(apply,300);
  setTimeout(apply,1200);
})();

;(function(){
  'use strict';
  if (window.__alcopac_online_screen_controls_patch) return;
  window.__alcopac_online_screen_controls_patch = true;

  var STYLE_ID = 'alcopac-online-screen-controls-style';

  function ensureStyle(id){
    var s=document.getElementById(id);
    if(!s){ s=document.createElement('style'); s.id=id; document.head.appendChild(s);} 
    return s;
  }

  function getThemeName(){
    try { return (window.Lampa && Lampa.Storage && Lampa.Storage.get('lampac_theme','appletv')) || 'appletv'; } catch(e) { return 'appletv'; }
  }

  function getTokens(){
    var map = {
      neon:   { accent:'#00e5ff', text:'#e2e8f4', muted:'#8899bb', cardBg:'rgba(16,24,40,0.92)', cardBg2:'rgba(8,14,30,0.92)', panelBg:'rgba(8,14,30,0.88)', line:'rgba(0,229,255,0.32)', glow:'rgba(0,229,255,0.28)' },
      aurora: { accent:'#c471ed', text:'#ece4f8', muted:'#9988bb', cardBg:'rgba(28,16,44,0.92)', cardBg2:'rgba(16,10,28,0.92)', panelBg:'rgba(20,10,34,0.88)', line:'rgba(196,113,237,0.28)', glow:'rgba(196,113,237,0.24)' },
      gold:   { accent:'#f5c451', text:'#fff7e6', muted:'#d5bf88', cardBg:'rgba(38,26,12,0.92)', cardBg2:'rgba(22,14,6,0.92)', panelBg:'rgba(26,18,8,0.88)', line:'rgba(245,196,81,0.30)', glow:'rgba(245,196,81,0.24)' },
      mono:   { accent:'#ffffff', text:'#f1f1f1', muted:'#bbbbbb', cardBg:'rgba(28,28,28,0.94)', cardBg2:'rgba(18,18,18,0.94)', panelBg:'rgba(18,18,18,0.90)', line:'rgba(255,255,255,0.18)', glow:'rgba(255,255,255,0.16)' },
      sunset: { accent:'#ff7f50', text:'#fff3eb', muted:'#f5b6a0', cardBg:'rgba(48,20,18,0.92)', cardBg2:'rgba(30,12,10,0.92)', panelBg:'rgba(36,15,13,0.88)', line:'rgba(255,127,80,0.24)', glow:'rgba(255,127,80,0.24)' },
      glass:  { accent:'#ffffff', text:'#f7fbff', muted:'rgba(255,255,255,0.68)', cardBg:'rgba(255,255,255,0.08)', cardBg2:'rgba(255,255,255,0.05)', panelBg:'rgba(255,255,255,0.10)', line:'rgba(255,255,255,0.14)', glow:'rgba(255,255,255,0.20)' },
      appletv:{ accent:'#ffffff', text:'#f5f7fb', muted:'rgba(255,255,255,0.72)', cardBg:'rgba(255,255,255,0.07)', cardBg2:'rgba(255,255,255,0.04)', panelBg:'rgba(8,10,18,0.54)', line:'rgba(255,255,255,0.12)', glow:'rgba(255,255,255,0.20)' },
      custom: { accent:'#ffffff', text:'#f5f7fb', muted:'rgba(255,255,255,0.72)', cardBg:'rgba(255,255,255,0.07)', cardBg2:'rgba(255,255,255,0.04)', panelBg:'rgba(8,10,18,0.54)', line:'rgba(255,255,255,0.12)', glow:'rgba(255,255,255,0.20)' }
    };
    return map[getThemeName()] || map.appletv;
  }

  function css(){
    var t=getTokens();
    var blur=(getThemeName()==='glass' || getThemeName()==='appletv' || getThemeName()==='custom') ? 'blur(18px) saturate(1.15)' : 'blur(10px)';
    return [
      '.activity.activity--lampac .lampac-online-shell-left{position:relative;padding:1.05em 1.1em 1.15em;border-radius:1.25em;background:linear-gradient(180deg,'+t.panelBg+' 0%,'+t.cardBg+' 100%);border:1px solid '+t.line+';box-shadow:0 16px 40px rgba(0,0,0,.26);backdrop-filter:'+blur+'; -webkit-backdrop-filter:'+blur+'; overflow:hidden;}',
      '.activity.activity--lampac .lampac-online-shell-left::before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(255,255,255,.08) 0%, rgba(255,255,255,0) 32%);}',
      '.activity.activity--lampac .lampac-online-shell-left .lampac-online-hero__title, .activity.activity--lampac .lampac-online-shell-left .explorer__title, .activity.activity--lampac .lampac-online-shell-left .full-start__title, .activity.activity--lampac .lampac-online-shell-left .full-start-new__title{position:relative;color:'+t.text+' !important;font-size:2.15em !important;font-weight:800 !important;letter-spacing:-.03em !important;line-height:1.04 !important;margin:.55em 0 .35em !important;text-shadow:0 8px 24px rgba(0,0,0,.2);}',
      '.activity.activity--lampac .lampac-online-shell-left .lampac-online-hero__meta, .activity.activity--lampac .lampac-online-shell-left .explorer__details, .activity.activity--lampac .lampac-online-shell-left .explorer__info, .activity.activity--lampac .lampac-online-shell-left .full-start__details, .activity.activity--lampac .lampac-online-shell-left .full-start-new__details{position:relative;display:flex;flex-wrap:wrap;gap:.42em .48em;margin:0 0 .8em 0;color:'+t.muted+' !important;}',
      '.activity.activity--lampac .lampac-online-shell-left .lampac-online-hero__meta > span, .activity.activity--lampac .lampac-online-shell-left .explorer__details > span, .activity.activity--lampac .lampac-online-shell-left .explorer__info > span, .activity.activity--lampac .lampac-online-shell-left .full-start__details > span, .activity.activity--lampac .lampac-online-shell-left .full-start-new__details > span{display:inline-flex;align-items:center;min-height:2em;padding:.28em .72em;border-radius:999px;background:'+t.cardBg2+';border:1px solid '+t.line+';box-shadow:inset 0 1px 0 rgba(255,255,255,.05);}',
      '.activity.activity--lampac .lampac-online-shell-left .lampac-online-hero__descr, .activity.activity--lampac .lampac-online-shell-left .explorer__description, .activity.activity--lampac .lampac-online-shell-left .explorer__desc, .activity.activity--lampac .lampac-online-shell-left .explorer__about, .activity.activity--lampac .lampac-online-shell-left .full-descr__text, .activity.activity--lampac .lampac-online-shell-left .items-line__description{position:relative;margin-top:.35em;padding:1em 1.05em;border-radius:1.05em;background:'+t.cardBg2+';border:1px solid '+t.line+';color:'+t.text+' !important;line-height:1.46 !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.05);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:7;overflow:hidden;}',
      '.activity.activity--lampac .lampac-online-shell-left .full-descr{margin:0;padding:0;background:none !important;border:none !important;box-shadow:none !important;}',
      '.activity.activity--lampac .lampac-online-shell-left img:first-child, .activity.activity--lampac .lampac-online-shell-left .lampac-online-hero__poster, .activity.activity--lampac .lampac-online-shell-left .explorer__poster{border-radius:1em !important;overflow:hidden;box-shadow:0 12px 30px rgba(0,0,0,.28);}',
      '.activity.activity--lampac .lampac-online-controls{display:flex;flex-wrap:wrap;gap:.8em 1em;align-items:center;margin:.2em 0 1em 0;padding:.3em 0;}',
      '.activity.activity--lampac .lampac-online-controls .selector, .activity.activity--lampac .lampac-online-controls .filter--search, .activity.activity--lampac .lampac-online-controls .filter--sort, .activity.activity--lampac .lampac-online-controls .search-source, .activity.activity--lampac .lampac-online-controls .simple-button, .activity.activity--lampac .lampac-online-controls [class*="filter"] .selector{border-radius:999px !important;background:'+t.cardBg2+' !important;border:1px solid '+t.line+' !important;box-shadow:0 10px 24px rgba(0,0,0,.14), inset 0 1px 0 rgba(255,255,255,.05);backdrop-filter:'+blur+';-webkit-backdrop-filter:'+blur+';color:'+t.text+' !important;}',
      '.activity.activity--lampac .lampac-online-controls .selector.focus, .activity.activity--lampac .lampac-online-controls .selector.hover, .activity.activity--lampac .lampac-online-controls .filter--search.focus, .activity.activity--lampac .lampac-online-controls .filter--sort.focus, .activity.activity--lampac .lampac-online-controls .search-source.active{background:'+t.cardBg+' !important;border-color:'+t.accent+' !important;box-shadow:0 0 0 2px '+t.glow+', 0 10px 24px rgba(0,0,0,.18) !important;color:'+t.text+' !important;}',
      '.activity.activity--lampac .lampac-online-controls .selector span, .activity.activity--lampac .lampac-online-controls .filter--sort span, .activity.activity--lampac .lampac-online-controls .filter--search span{color:'+t.text+' !important;font-weight:600;}',
      '.activity.activity--lampac .lampac-online-controls .search-source.active{background-image:none !important;}',
      '.activity.activity--lampac .lampac-online-controls .torrent-filter{display:flex;flex-wrap:wrap;gap:.8em 1em;align-items:center;width:100%;}',
      '.activity.activity--lampac .lampac-online-controls .filter--search.hide{display:none !important;}',
      '.activity.activity--lampac .lampac-online-controls .selector .search-source, .activity.activity--lampac .lampac-online-controls .selector .tag, .activity.activity--lampac .lampac-online-controls .selector [class*="chosen"], .activity.activity--lampac .lampac-online-controls .selector > span:last-child{padding:.18em .45em;border-radius:.55em;background:'+t.cardBg+';border:1px solid '+t.line+';}',
      '@media (max-width: 900px){.activity.activity--lampac .lampac-online-shell-left{padding:.85em .9em .95em;border-radius:1.08em}.activity.activity--lampac .lampac-online-shell-left .lampac-online-hero__title, .activity.activity--lampac .lampac-online-shell-left .explorer__title, .activity.activity--lampac .lampac-online-shell-left .full-start__title, .activity.activity--lampac .lampac-online-shell-left .full-start-new__title{font-size:1.55em !important}.activity.activity--lampac .lampac-online-shell-left .lampac-online-hero__descr, .activity.activity--lampac .lampac-online-shell-left .explorer__description, .activity.activity--lampac .lampac-online-shell-left .explorer__desc, .activity.activity--lampac .lampac-online-shell-left .explorer__about, .activity.activity--lampac .lampac-online-shell-left .full-descr__text, .activity.activity--lampac .lampac-online-shell-left .items-line__description{-webkit-line-clamp:6;}}'
    ].join('\n');
  }

  function pickLeftShell(ctx){
    ctx = ctx || document;
    var candidates = [
      '.activity--lampac .explorer__files-head > div:first-child',
      '.activity--lampac .files__head > div:first-child',
      '.activity--lampac .torrent-list > .explorer__files-head > div:first-child',
      '.activity--lampac .torrent-list > div:first-child'
    ];
    for(var i=0;i<candidates.length;i++){
      var el = ctx.querySelector(candidates[i]);
      if(el && /img|poster|card__view|explorer__title|full-start/.test((el.innerHTML||''))) return el;
    }
    var title = ctx.querySelector('.activity--lampac .explorer__title, .activity--lampac .full-start__title, .activity--lampac .full-start-new__title');
    if(!title) return null;
    var cur = title;
    for(var d=0; d<6 && cur; d++, cur=cur.parentElement){
      if(cur && cur.querySelector('img, .card__view, .explorer__poster') && cur.querySelector('.explorer__description, .explorer__desc, .full-descr__text, .items-line__description')) return cur;
    }
    return title.parentElement || null;
  }

  function pickControls(ctx){
    ctx = ctx || document;
    return ctx.querySelector('.activity--lampac .torrent-filter') || ctx.querySelector('.activity--lampac .explorer__files-head .filter') || ctx.querySelector('.activity--lampac .files__head .filter');
  }

  function markShell(root){
    if(!root) return;
    root.classList.add('lampac-online-shell-left');
    var title=root.querySelector('.explorer__title, .full-start__title, .full-start-new__title');
    if(title) title.classList.add('lampac-online-hero__title');
    var meta=root.querySelector('.explorer__details, .explorer__info, .full-start__details, .full-start-new__details');
    if(meta) meta.classList.add('lampac-online-hero__meta');
    var descr=root.querySelector('.explorer__description, .explorer__desc, .explorer__about, .full-descr__text, .items-line__description');
    if(descr) descr.classList.add('lampac-online-hero__descr');
    var poster=root.querySelector('img, .card__view, .explorer__poster');
    if(poster) poster.classList.add('lampac-online-hero__poster');
  }

  function markControls(el){
    if(!el) return;
    el.classList.add('lampac-online-controls');
    var tf = el.querySelector('.torrent-filter');
    if(tf) tf.classList.add('lampac-online-controls');
  }

  function apply(){
    ensureStyle(STYLE_ID).textContent = css();
    markShell(pickLeftShell(document));
    markControls(pickControls(document));
  }

  function observe(){
    if(window.__alcopac_online_screen_controls_observer) return;
    var mo = new MutationObserver(function(muts){
      for(var i=0;i<muts.length;i++){
        var m = muts[i]; if(!m.addedNodes) continue;
        for(var j=0;j<m.addedNodes.length;j++){
          var n = m.addedNodes[j];
          if(n && n.nodeType===1 && ((n.matches && (n.matches('.activity--lampac, .torrent-filter, .explorer__files-head, .files__head'))) || (n.querySelector && n.querySelector('.activity--lampac, .torrent-filter, .explorer__files-head, .files__head')))) {
            setTimeout(apply, 30);
            setTimeout(apply, 250);
            return;
          }
        }
      }
    });
    mo.observe(document.body || document.documentElement, {childList:true, subtree:true});
    window.__alcopac_online_screen_controls_observer = mo;
  }

  var oldApplyTheme = window.applyTheme;
  if(typeof oldApplyTheme === 'function' && !window.__alcopac_online_screen_controls_theme_hook){
    window.applyTheme = function(){
      var r = oldApplyTheme.apply(this, arguments);
      setTimeout(apply, 30);
      setTimeout(apply, 250);
      return r;
    };
    window.__alcopac_online_screen_controls_theme_hook = true;
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ apply(); observe(); });
  else { apply(); observe(); }
  setTimeout(apply, 400);
  setTimeout(apply, 1200);
})();



/* theme_v5_main_r2_fixed: safe facade augmentation */
(function(){
  'use strict';
  function storageGet(k, d){
    try { return window.Lampa && Lampa.Storage ? Lampa.Storage.get(k, d) : d; } catch(e){ return d; }
  }
  function call(fn){
    if (typeof fn === 'function') {
      try { return fn.apply(null, Array.prototype.slice.call(arguments, 1)); } catch(e){}
    }
  }
  function ensureFacade(){
    var A = window.AlcopacTheme = window.AlcopacTheme || {};
    A.version = '5.2.1-main-r2-fixed';
    A.core = A.core || {};
    A.theme = A.theme || {};
    A.settings = A.settings || {};
    A.cards = A.cards || {};
    A.full = A.full || {};
    A.mobile = A.mobile || {};
    A.tools = A.tools || {};
    A.hooks = A.hooks || {};
    A.online = A.online || {};
    A.profiles = A.profiles || {};

    A.core.flags = A.core.flags || {};
    A.core.flags.fullControlsButtons = true;
    window.__alcopac_theme_full_controls_buttons = true;

    A._bus = A._bus || {};
    A.hooks.on = A.hooks.on || function(name, fn){
      if (!name || typeof fn !== 'function') return function(){};
      A._bus[name] = A._bus[name] || [];
      A._bus[name].push(fn);
      return function(){ A.hooks.off(name, fn); };
    };
    A.hooks.off = A.hooks.off || function(name, fn){
      var list = A._bus[name] || [];
      A._bus[name] = list.filter(function(x){ return x !== fn; });
    };
    A.hooks.emit = A.hooks.emit || function(name, payload){
      (A._bus[name] || []).slice().forEach(function(fn){
        try { fn(payload); } catch(e){}
      });
    };

    A.core.getDeviceType = A.core.getDeviceType || function(){
      try {
        if (window.Lampa && Lampa.Platform) {
          if (Lampa.Platform.tv()) return 'tv';
          if (Lampa.Platform.mobile()) return 'mobile';
        }
      } catch(e){}
      return (window.innerWidth || 1920) <= 900 ? 'mobile' : 'desktop';
    };
    A.core.storageGet = A.core.storageGet || storageGet;
    A.core.storageSet = A.core.storageSet || function(k, v){
      try { if (window.Lampa && Lampa.Storage) Lampa.Storage.set(k, v); } catch(e){}
      return v;
    };

    A.theme.getName = A.theme.getName || function(){ return storageGet('lampac_theme', 'classic'); };
    A.theme.getActiveName = A.theme.getActiveName || A.theme.getName;
    A.theme.getActiveTokens = A.theme.getActiveTokens || function(){ return null; };
    A.theme.reapply = A.theme.reapply || function(){ return call(A.theme.apply, A.theme.getName()); };
    A.theme.applyProfile = A.theme.applyProfile || function(name){
      var profile = name || storageGet('lampac_theme_profile', 'default');
      A.hooks.emit('theme:profile', {name: profile});
      return profile;
    };

    A.cards.refresh = A.cards.refresh || function(){ return call(A.cards.apply); };
    A.full.findMainButtons = A.full.findMainButtons || function(){ return null; };
    A.full.refresh = A.full.refresh || function(){ return call(A.full.apply); };
    A.mobile.refresh = A.mobile.refresh || function(){ return call(A.mobile.apply); };
    A.online.registerTemplates = A.online.registerTemplates || function(){ return null; };
    A.online.getSettings = A.online.getSettings || function(){ return {}; };
    A.online.refresh = A.online.refresh || function(){ return call(A.online.apply); };
    A.tools.handle = A.tools.handle || function(action){ return action; };

    A.settings.keys = A.settings.keys || {
      theme: 'lampac_theme',
      themeProfile: 'lampac_theme_profile',
      screenLayout: 'lampac_screen_layout',
      cardsView: 'lampac_card_view',
      mobileProfile: 'lampac_screen_profile_mobile',
      desktopProfile: 'lampac_screen_profile_desktop',
      tvProfile: 'lampac_screen_profile_tv'
    };

    A.profiles.get = A.profiles.get || function(){
      var device = A.core.getDeviceType();
      return {
        device: device,
        theme: storageGet('lampac_theme', 'classic'),
        themeProfile: storageGet('lampac_theme_profile', 'default'),
        screenLayout: storageGet('lampac_screen_layout', 'default'),
        mobileProfile: storageGet('lampac_screen_profile_mobile', 'compact'),
        desktopProfile: storageGet('lampac_screen_profile_desktop', 'default'),
        tvProfile: storageGet('lampac_screen_profile_tv', 'cinema')
      };
    };
    A.profiles.applyDevice = A.profiles.applyDevice || function(){
      var device = A.core.getDeviceType();
      var value = storageGet('lampac_screen_profile_' + device, device === 'tv' ? 'cinema' : (device === 'mobile' ? 'compact' : 'default'));
      A.core.storageSet('lampac_screen_profile', value);
      A.hooks.emit('profiles:device', {device: device, profile: value});
      if (typeof A.reapply === 'function') A.reapply();
      return value;
    };
    A.profiles.applyQuick = A.profiles.applyQuick || function(name){
      var map = {
        normal: { 'lampac_screen_layout': 'default', 'lampac_screen_compact': false },
        compact: { 'lampac_screen_layout': 'default', 'lampac_screen_compact': true },
        cinema: { 'lampac_screen_layout': 'cinematic', 'lampac_screen_compact': false },
        kids: { 'lampac_theme_profile': 'kids', 'lampac_screen_layout': 'default', 'lampac_screen_compact': false, 'lampac_buttons_large': true }
      };
      var patch = map[name];
      if (!patch) return false;
      Object.keys(patch).forEach(function(key){ A.core.storageSet(key, patch[key]); });
      A.hooks.emit('profiles:quick', {name: name, patch: patch});
      if (typeof A.reapply === 'function') A.reapply();
      return true;
    };

    A.reapply = A.reapply || function(){
      call(A.theme.reapply);
      call(A.cards.refresh);
      call(A.full.refresh);
      call(A.mobile.refresh);
      call(A.online.refresh);
      A.hooks.emit('app:reapply', {theme: A.theme.getActiveName(), device: A.core.getDeviceType()});
    };

    A.init = A.init || function(){
      A.hooks.emit('app:init:after', {theme: A.theme.getActiveName()});
      return A;
    };
    return A;
  }

  function bindAutoReapply(){
    if (window.__alcopac_theme_main_r2_fixed_bound) return;
    window.__alcopac_theme_main_r2_fixed_bound = true;
    try {
      if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('full', function(e){
          if (!e || (e.type !== 'complite' && e.type !== 'activity')) return;
          setTimeout(function(){ ensureFacade().full.refresh(); }, 30);
          setTimeout(function(){ ensureFacade().mobile.refresh(); }, 120);
        });
        Lampa.Listener.follow('app', function(e){
          if (!e || (e.type !== 'ready' && e.type !== 'visible')) return;
          setTimeout(function(){ ensureFacade().theme.reapply(); }, 30);
          setTimeout(function(){ ensureFacade().cards.refresh(); }, 90);
          setTimeout(function(){ ensureFacade().online.refresh(); }, 160);
        });
      }
    } catch(e){}
  }

  ensureFacade();
  bindAutoReapply();
})();


/* ===== AlcopacTheme v5 main r4: full/profiles refinement ===== */
(function(){
  'use strict';
  if (!window.AlcopacTheme) return;
  var A = window.AlcopacTheme;

  function call(fn){
    if (typeof fn !== 'function') return;
    try { return fn.apply(null, Array.prototype.slice.call(arguments,1)); } catch(e){ console.error('[AlcopacTheme:r4]', e); }
  }

  A.full = A.full || {};
  A.profiles = A.profiles || {};
  A.settings = A.settings || {};
  A.hooks = A.hooks || { on:function(){}, emit:function(){} };

  A.full.refreshSoft = A.full.refreshSoft || function(){
    call(A.full.refresh);
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(function(){ call(A.full.refresh); });
    } else {
      setTimeout(function(){ call(A.full.refresh); }, 16);
    }
    return true;
  };

  A.full.refreshHard = A.full.refreshHard || function(){
    call(A.theme && A.theme.reapply);
    call(A.cards && A.cards.refresh);
    call(A.full && A.full.refresh);
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(function(){
        call(A.mobile && A.mobile.refresh);
        requestAnimationFrame(function(){
          call(A.full && A.full.refresh);
          call(A.online && A.online.refresh);
        });
      });
    } else {
      setTimeout(function(){ call(A.mobile && A.mobile.refresh); }, 30);
      setTimeout(function(){ call(A.full && A.full.refresh); call(A.online && A.online.refresh); }, 80);
    }
    if (A.hooks && typeof A.hooks.emit === 'function') A.hooks.emit('full:refreshHard', {});
    return true;
  };

  A.full.applyQuickPreset = A.full.applyQuickPreset || function(name){
    if (!window.Lampa || !Lampa.Storage) return false;
    var map = {
      normal: {
        lampac_screen_layout: 'default',
        lampac_screen_compact: false,
        lampac_screen_compact_meta: false,
        lampac_screen_large_buttons: false,
        lampac_screen_title_logo: 'hide',
        lampac_screen_cinema_desc: false
      },
      compact: {
        lampac_screen_layout: 'default',
        lampac_screen_compact: true,
        lampac_screen_compact_meta: true,
        lampac_screen_large_buttons: false,
        lampac_screen_title_logo: 'hide',
        lampac_screen_cinema_desc: false
      },
      cinema: {
        lampac_screen_layout: 'cinematic',
        lampac_screen_compact: false,
        lampac_screen_compact_meta: true,
        lampac_screen_large_buttons: true,
        lampac_screen_title_logo: 'show',
        lampac_screen_cinema_desc: true
      },
      kids: {
        lampac_theme_profile: 'kids',
        lampac_screen_layout: 'default',
        lampac_screen_compact: false,
        lampac_screen_compact_meta: false,
        lampac_screen_large_buttons: true,
        lampac_screen_title_logo: 'hide',
        lampac_screen_cinema_desc: false
      }
    };
    var patch = map[name];
    if (!patch) return false;
    Object.keys(patch).forEach(function(k){ Lampa.Storage.set(k, patch[k]); });
    A.full.refreshHard();
    return true;
  };

  A.profiles.describe = A.profiles.describe || function(){
    var p = call(A.profiles.get) || {};
    return {
      device: p.device || 'desktop',
      theme: p.theme || 'classic',
      themeProfile: p.themeProfile || 'default',
      screenLayout: p.screenLayout || 'default',
      mobileProfile: p.mobileProfile || 'compact',
      desktopProfile: p.desktopProfile || 'default',
      tvProfile: p.tvProfile || 'cinema'
    };
  };

  A.profiles.applyQuickAndRefresh = A.profiles.applyQuickAndRefresh || function(name){
    var ok = call(A.profiles.applyQuick, name);
    if (ok) A.full.refreshHard();
    return ok;
  };

  A.profiles.applyCurrentDeviceAndRefresh = A.profiles.applyCurrentDeviceAndRefresh || function(){
    var value = call(A.profiles.applyDevice);
    A.full.refreshHard();
    return value;
  };

  function registerExtraSettings(){
    if (window.__alcopac_theme_r5_settings) return;
    if (!window.Lampa || !Lampa.SettingsApi) return;
    window.__alcopac_theme_r5_settings = true;

    try {
      Lampa.SettingsApi.addParam({
        component: 'theme_tools',
        param: {
          name: 'refresh_full_screen',
          type: 'button'
        },
        field: { name: 'Обновить экран фильма', description: 'Пересобрать full-экран и кнопки без перезагрузки страницы' },
        onChange: function(){ A.full.refreshHard(); }
      });

      Lampa.SettingsApi.addParam({
        component: 'theme_tools',
        param: {
          name: 'diag_profile_state',
          type: 'button'
        },
        field: { name: 'Диагностика профиля', description: 'Показать активную тему, устройство и профили в уведомлении и консоли' },
        onChange: function(){
          var d = A.profiles.describe();
          try {
            if (window.Lampa && Lampa.Noty && Lampa.Noty.show) {
              Lampa.Noty.show('Theme: ' + d.theme + ' • Device: ' + d.device + ' • Layout: ' + d.screenLayout);
            }
          } catch(e){}
          try { console.log('[AlcopacTheme:r5:profiles]', d); } catch(e){}
        }
      });
    } catch(e){ console.error('[AlcopacTheme:r5] settings error', e); }
  }

  function bindExtraHooks(){
    if (window.__alcopac_theme_r5_hooks) return;
    window.__alcopac_theme_r5_hooks = true;
    try {
      if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('full', function(e){
          if (!e || (e.type !== 'complite' && e.type !== 'activity')) return;
          setTimeout(function(){ A.full.refreshSoft(); setTimeout(window.updateReactionCountsVisibility, 40); }, 30);
        });
      }
    } catch(e){}
  }

  registerExtraSettings();
  bindExtraHooks();
})();


/* ===== AlcopacTheme v5 main r6: stability queue + safe refresh ===== */
(function(){
  'use strict';
  if (!window.AlcopacTheme) return;
  var A = window.AlcopacTheme;
  A.version = '5.6.0-main-r6';
  A.core = A.core || {};
  var timers = A.core.__timers = A.core.__timers || {};

  A.core.schedule = A.core.schedule || function(key, fn, delay){
    if (!key || typeof fn !== 'function') return;
    if (timers[key]) clearTimeout(timers[key]);
    timers[key] = setTimeout(function(){
      timers[key] = null;
      try { fn(); } catch (e) { try { console.error('[AlcopacTheme:r6]', e); } catch(_){} }
    }, typeof delay === 'number' ? delay : 50);
  };

  A.core.flush = A.core.flush || function(prefix){
    Object.keys(timers).forEach(function(key){
      if (!prefix || key.indexOf(prefix) === 0) {
        if (timers[key]) clearTimeout(timers[key]);
        timers[key] = null;
      }
    });
  };

  function wrapScheduled(obj, method, key, delay){
    if (!obj || typeof obj[method] !== 'function') return;
    if (obj[method].__alcopac_r6_wrapped) return;
    var prev = obj[method];
    var wrapped = function(){
      var args = Array.prototype.slice.call(arguments);
      return A.core.schedule(key, function(){ prev.apply(obj, args); }, delay);
    };
    wrapped.__alcopac_r6_wrapped = true;
    wrapped.__alcopac_r6_prev = prev;
    obj[method] = wrapped;
  }

  wrapScheduled(A.full, 'refreshSoft', 'full:soft', 35);
  wrapScheduled(A.full, 'refreshHard', 'full:hard', 80);
  wrapScheduled(A.mobile, 'refresh', 'mobile:refresh', 120);
  wrapScheduled(A.online, 'refresh', 'online:refresh', 140);
  wrapScheduled(A.cards, 'refresh', 'cards:refresh', 60);
  wrapScheduled(A.theme, 'reapply', 'theme:reapply', 45);
  wrapScheduled(A, 'reapply', 'theme:global-reapply', 70);

  A.full.refreshBundle = A.full.refreshBundle || function(){
    A.core.flush('full:');
    A.full.refreshSoft(); setTimeout(window.updateReactionCountsVisibility, 40);
    A.core.schedule('full:bundle-hard', function(){
      if (A.full && typeof A.full.refreshHard === 'function') A.full.refreshHard();
    }, 180);
  };

  A.settings = A.settings || {};
  A.settings.describe = A.settings.describe || function(){
    var g = function(k, d){
      try { return window.Lampa && Lampa.Storage ? Lampa.Storage.get(k, d) : d; } catch(e) { return d; }
    };
    return {
      theme: g('lampac_theme', 'appletv'),
      profile: g('lampac_theme_profile', 'default'),
      screenLayout: g('lampac_screen_layout', 'default'),
      compactMode: g('lampac_screen_compact_mode', 'normal'),
      buttonSize: g('lampac_screen_button_size', 'normal'),
      deviceProfiles: g('lampac_screen_device_profiles', 'off'),
      mobileProfile: g('lampac_screen_profile_mobile', 'default'),
      desktopProfile: g('lampac_screen_profile_desktop', 'default'),
      tvProfile: g('lampac_screen_profile_tv', 'default')
    };
  };

  try {
    if (window.Lampa && Lampa.SettingsApi && !window.__alcopac_theme_r6_tools) {
      window.__alcopac_theme_r6_tools = true;
      Lampa.SettingsApi.addParam({
        component: 'theme_tools',
        param: { type: 'title' },
        field: { name: 'Стабильность и сервис' }
      });
      Lampa.SettingsApi.addParam({
        component: 'theme_tools',
        param: { name: 'refresh_full_bundle', type: 'button' },
        field: { name: 'Мягко обновить экран фильма', description: 'Безопасная последовательность soft → hard refresh для карточки фильма' },
        onChange: function(){ A.full.refreshBundle(); }
      });
      Lampa.SettingsApi.addParam({
        component: 'theme_tools',
        param: { name: 'diag_settings_state_r6', type: 'button' },
        field: { name: 'Диагностика настроек', description: 'Показать ключевые настройки темы и профилей в консоли' },
        onChange: function(){
          var d = A.settings.describe();
          try { console.log('[AlcopacTheme:r6:settings]', d); } catch(e){}
          try {
            if (window.Lampa && Lampa.Noty && Lampa.Noty.show) {
              Lampa.Noty.show('Theme: ' + d.theme + ' • Layout: ' + d.screenLayout + ' • Buttons: ' + d.buttonSize);
            }
          } catch(e){}
        }
      });
    }

    var __atFullButtonsTimer = null;
    var __atFullButtonsSig = '';

    function atButtonText(el){
      try { return ((el && el.textContent) || '').replace(/\s+/g,' ').trim(); } catch(e){ return ''; }
    }

    function atButtonSig(info){
      if (!info || !info.container) return 'no-buttons';
      try {
        var arr = Array.prototype.slice.call(info.container.querySelectorAll('.full-start__button, .selector'));
        return arr.map(function(el){
          var cls = (el.className || '').toString().replace(/\s+/g,'.');
          return atButtonText(el) + '|' + cls;
        }).join('||');
      } catch(e){ return 'sig-error'; }
    }

    A.full.getButtonsState = A.full.getButtonsState || function(){
      var info = null;
      try { info = A.full.findMainButtons ? A.full.findMainButtons(document) : null; } catch(e){}
      var state = {
        has: !!(info && info.container),
        online: atButtonText(info && info.online),
        torrent: atButtonText(info && info.torrent),
        trailer: atButtonText(info && info.trailer),
        signature: atButtonSig(info)
      };
      return state;
    };

    A.full.focusPrimary = A.full.focusPrimary || function(){
      try {
        var info = A.full.findMainButtons ? A.full.findMainButtons(document) : null;
        if (!info || !info.container) return false;
        var btn = info.online || info.torrent || info.trailer;
        if (!btn) return false;
        if (window.Lampa && Lampa.Controller) {
          var jq = window.$ ? $(info.container) : null;
          if (Lampa.Controller.toggle) Lampa.Controller.toggle('full_start');
          if (jq && Lampa.Controller.collectionSet) Lampa.Controller.collectionSet(jq);
          if (Lampa.Controller.focus) Lampa.Controller.focus(btn);
        }
        return true;
      } catch(e){ return false; }
    };

    A.full.reorderSafe = A.full.reorderSafe || function(){
      try {
        if (__atFullButtonsTimer) clearTimeout(__atFullButtonsTimer);
      } catch(e){}
      try { setButtonsPending(true); } catch(e){}
      __atFullButtonsTimer = setTimeout(function(){
        try {
          var before = A.full.getButtonsState();
          if (A.full.reorderButtons) A.full.reorderButtons(true);
          setTimeout(function(){
            try {
              var after = A.full.getButtonsState();
              __atFullButtonsSig = after.signature || __atFullButtonsSig;
              A.full.focusPrimary();
            } catch(e){}
            try { setButtonsPending(false); } catch(e){}
          }, 90);
        } catch(e){
          try { setButtonsPending(false); } catch(_e){}
        }
      }, 35);
    };

    A.full.refreshOrdered = A.full.refreshOrdered || function(){
      try { A.full.refreshBundle ? A.full.refreshBundle() : (A.full.refreshHard && A.full.refreshHard()); } catch(e){}
      setTimeout(function(){ try { A.full.reorderSafe(); } catch(e){} }, 50);
    };

    if (window.Lampa && Lampa.SettingsApi && !window.__alcopac_theme_r7_tools) {
      window.__alcopac_theme_r7_tools = true;
      Lampa.SettingsApi.addParam({
        component: 'theme_tools',
        param: { type: 'title' },
        field: { name: 'Кнопки экрана фильма' }
      });
      Lampa.SettingsApi.addParam({
        component: 'theme_tools',
        param: { name: 'refresh_full_ordered_r7', type: 'button' },
        field: { name: 'Стабилизировать кнопки фильма', description: 'Пересобрать порядок и вернуть фокус на основную кнопку' },
        onChange: function(){ A.full.refreshOrdered(); }
      });
      Lampa.SettingsApi.addParam({
        component: 'theme_tools',
        param: { name: 'diag_full_buttons_r7', type: 'button' },
        field: { name: 'Диагностика кнопок фильма', description: 'Показать состояние кнопок full-экрана в консоли' },
        onChange: function(){
          var s = A.full.getButtonsState();
          try { console.log('[AlcopacTheme:r7:full-buttons]', s); } catch(e){}
          try {
            if (window.Lampa && Lampa.Noty && Lampa.Noty.show) {
              Lampa.Noty.show('Buttons: ' + (s.online || s.torrent || s.trailer || 'не найдены'));
            }
          } catch(e){}
        }
      });
    }
  } catch(e) { try { console.error('[AlcopacTheme:r7]', e); } catch(_){} }
})();


/* ===== AlcopacTheme v5 main r8: simplify profiles section ===== */
(function(){
  'use strict';
  if (!window.AlcopacTheme) return;
  var A = window.AlcopacTheme;
  A.version = '5.8.0-main-r8';

  function ensureDeviceProfilesOn(){
    try {
      if (!window.Lampa || !Lampa.Storage) return;
      if (Lampa.Storage.get('lampac_screen_device_profiles', 'on') !== 'on') {
        Lampa.Storage.set('lampac_screen_device_profiles', 'on');
      }
    } catch(e){}
  }

  var originalDescribe = A.profiles && A.profiles.describe;
  if (A.profiles) {
    A.profiles.describe = function(){
      var d = typeof originalDescribe === 'function' ? originalDescribe() : {};
      d.deviceProfiles = 'on';
      return d;
    };
  }

  ensureDeviceProfilesOn();
  try {
    if (window.Lampa && Lampa.Listener) {
      Lampa.Listener.follow('app', function(e){
        if (e && e.type === 'ready') ensureDeviceProfilesOn();
      });
    }
  } catch(e){}
})();



/* ===== AlcopacTheme v5 main r10: comfortable settings ===== */
(function(){
  'use strict';
  if (!window.AlcopacTheme) return;
  var A = window.AlcopacTheme;
  A.version = '5.10.0-main-r10';

  function injectComfortSettingsCss(){
    try {
      var id = 'alcopac-theme-r10-settings-style';
      var ex = document.getElementById(id);
      if (ex) return ex;
      var style = document.createElement('style');
      style.id = id;
      style.textContent = [
        'body .settings-param, body .settings-folder{transition:background .12s ease, box-shadow .12s ease;}',
        'body .settings-param, body .settings-folder{border-radius:18px;}',
        'body .settings-param{padding-top:1.02em;padding-bottom:1.02em;}',
        'body .settings-folder{min-height:3.45em;}',
        'body .settings-param__name{font-weight:500;line-height:1.24;}',
        'body .settings-folder__name{font-weight:600;line-height:1.22;}',
        'body .settings-param__value{opacity:.9;}',
        'body .settings-param__descr{display:block !important;opacity:.72;line-height:1.28;margin-top:.28em;}',
        'body .settings-folder + .settings-folder, body .settings-param + .settings-param{margin-top:.42em;}',
        'body .settings-folder.focus, body .settings-param.focus{box-shadow:0 0 0 1px rgba(255,255,255,.06) inset;}',
        'body .settings-content .settings-param--static{opacity:.98;}',
        'body .settings-param[data-component="theme_tools"] .settings-param__value{opacity:.82;}',
        'body .settings-param[data-component="theme_screen_profiles"] .settings-param__value{opacity:.82;}',
        '@media (max-width: 900px){',
        '  body .settings-param{padding-top:.96em;padding-bottom:.96em;}',
        '  body .settings-folder{min-height:3.15em;}',
        '  body .settings-param__name, body .settings-folder__name{font-size:1em;}',
        '  body .settings-param__descr{font-size:.94em;}',
        '}'
      ].join('\n');
      document.head.appendChild(style);
      return style;
    } catch(e){}
  }

  function getSettingsRoot(){
    try { return document.querySelector('.settings, .settings__content, .settings-input__content'); }
    catch(e){ return null; }
  }

  function normalizeSettingsDom(){
    try {
      var root = getSettingsRoot();
      if (!root) return;
      var list = root.querySelectorAll('.settings-param, .settings-folder');
      for (var i=0;i<list.length;i++) {
        var el = list[i];
        var nm = el.querySelector('.settings-param__name, .settings-folder__name');
        if (nm && !nm.__atComfortNormalized) {
          var txt = (nm.textContent || '').replace(/\s{2,}/g,' ').trim();
          if (txt) nm.textContent = txt;
          nm.__atComfortNormalized = true;
        }
        var descr = el.querySelector('.settings-param__descr');
        if (descr) descr.style.display = '';
      }
    } catch(e){}
  }

  function bindComfortObserver(){
    try {
      if (A.__r10SettingsObserverBound) return;
      A.__r10SettingsObserverBound = true;
      var timer = null;

      function scheduleNormalize(){
        if (timer) clearTimeout(timer);
        timer = setTimeout(function(){ normalizeSettingsDom(); }, 60);
      }

      function attachForCurrentRoot(){
        try {
          var root = getSettingsRoot();
          if (A.__r10SettingsObserver) {
            try { A.__r10SettingsObserver.disconnect(); } catch(e){}
            A.__r10SettingsObserver = null;
          }
          if (!root) return;
          var mo = new MutationObserver(scheduleNormalize);
          mo.observe(root, { childList:true, subtree:true });
          A.__r10SettingsObserver = mo;
          scheduleNormalize();
        } catch(e){}
      }

      A.settings.refreshObserver = attachForCurrentRoot;
      attachForCurrentRoot();
      window.addEventListener('hashchange', function(){ setTimeout(attachForCurrentRoot, 90); });
      document.addEventListener('click', function(){ setTimeout(attachForCurrentRoot, 120); }, true);
    } catch(e){}
  }

  if (!A.settings) A.settings = {};
  A.settings.compactify = normalizeSettingsDom;
  A.settings.enableCompactVisuals = function(){ injectComfortSettingsCss(); normalizeSettingsDom(); bindComfortObserver(); };
  A.settings.enableComfortVisuals = A.settings.enableCompactVisuals;

  injectComfortSettingsCss();
  normalizeSettingsDom();
  bindComfortObserver();

  try {
    if (window.Lampa && Lampa.Listener) {
      Lampa.Listener.follow('app', function(e){
        if (e && e.type === 'ready') {
          injectComfortSettingsCss();
          normalizeSettingsDom();
        }
      });
    }
  } catch(e){}
})();

/* ===== R11: Section polish & comfortable settings grouping ===== */
(function(){
  'use strict';
  if (!window.AlcopacTheme) return;
  var A = window.AlcopacTheme;
  try { A.version = '5.11.0-r11'; } catch(e){}

  function injectR11Css(){
    if (document.getElementById('alcopac-theme-r11-section-polish')) return;
    var css = [
      'body.alcopac-theme-settings-comfort .settings{ --atg-gap: 10px; }',
      'body.alcopac-theme-settings-comfort .settings-folder, body.alcopac-theme-settings-comfort .settings-param{ position:relative; }',
      'body.alcopac-theme-settings-comfort .settings-folder{ margin: 6px 0; }',
      'body.alcopac-theme-settings-comfort .settings-param{ margin: 4px 0; }',
      'body.alcopac-theme-settings-comfort .settings-folder::before{ content:""; position:absolute; left:10px; right:10px; top:0; bottom:0; border-radius:16px; background:rgba(255,255,255,.03); pointer-events:none; }',
      'body.alcopac-theme-settings-comfort .settings-param::before{ content:""; position:absolute; left:10px; right:10px; top:2px; bottom:2px; border-radius:14px; background:rgba(255,255,255,.018); pointer-events:none; }',
      'body.alcopac-theme-settings-comfort .settings-folder.focus::before, body.alcopac-theme-settings-comfort .settings-param.focus::before{ background:rgba(255,255,255,.06); }',
      'body.alcopac-theme-settings-comfort .settings-folder + .settings-param, body.alcopac-theme-settings-comfort .settings-param + .settings-folder{ margin-top:8px; }',
      'body.alcopac-theme-settings-comfort .settings-param__name{ font-weight:600; letter-spacing:.01em; }',
      'body.alcopac-theme-settings-comfort .settings-param__descr, body.alcopac-theme-settings-comfort .settings-folder__descr{ opacity:.86; margin-top:4px; line-height:1.35; }',
      'body.alcopac-theme-settings-comfort .settings-param__value{ opacity:.95; }',
      'body.alcopac-theme-settings-comfort .settings-folder__name, body.alcopac-theme-settings-comfort .settings-param__name, body.alcopac-theme-settings-comfort .settings-param__value, body.alcopac-theme-settings-comfort .settings-param__descr, body.alcopac-theme-settings-comfort .settings-folder__descr{ position:relative; z-index:1; }',
      'body.alcopac-theme-settings-comfort .settings-folder__name{ font-weight:700; }',
      'body.alcopac-theme-settings-comfort .settings-folder__icon{ opacity:.92; }',
      'body.alcopac-theme-settings-comfort .settings-folder[data-atg-theme-block="1"]::before{ background:rgba(255,255,255,.045); box-shadow: inset 0 0 0 1px rgba(255,255,255,.04); }',
      'body.alcopac-theme-settings-comfort .settings-folder[data-atg-tools-block="1"]::before{ background:rgba(255,255,255,.028); box-shadow: inset 0 0 0 1px rgba(255,255,255,.03); }',
      'body.alcopac-theme-settings-comfort .settings-param[data-atg-service="1"]::before{ background:rgba(255,255,255,.025); }'
    ].join('\n');
    var s = document.createElement('style');
    s.id = 'alcopac-theme-r11-section-polish';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function textOf(el){
    try { return (el && (el.textContent || '') || '').replace(/\s+/g,' ').trim().toLowerCase(); } catch(e){ return ''; }
  }

  function markSections(){
    var root = document.querySelector('.settings') || document.querySelector('.settings-layer') || document.querySelector('[data-page="settings"]');
    if (!root) return false;
    document.body.classList.add('alcopac-theme-settings-comfort');
    var folders = root.querySelectorAll('.settings-folder');
    var params = root.querySelectorAll('.settings-param');
    folders.forEach(function(el){
      var txt = textOf(el);
      if (/оформление|экран фильма|карточки|инструменты темы|theme/i.test(txt)) el.setAttribute('data-atg-theme-block','1');
      else el.removeAttribute('data-atg-theme-block');
      if (/инструменты|диагностика|экспорт|импорт|сброс|обновить/i.test(txt)) el.setAttribute('data-atg-tools-block','1');
      else el.removeAttribute('data-atg-tools-block');
    });
    params.forEach(function(el){
      var txt = textOf(el);
      if (/диагностика|экспорт|импорт|сброс|обновить|переприменить/i.test(txt)) el.setAttribute('data-atg-service','1');
      else el.removeAttribute('data-atg-service');
    });
    return true;
  }

  function debounce(fn, wait){
    var t = 0;
    return function(){
      clearTimeout(t);
      t = setTimeout(fn, wait || 80);
    };
  }

  function bindR11Observer(){
    var deb = debounce(markSections, 70);
    function attach(){
      var root = document.querySelector('.settings') || document.querySelector('.settings-layer') || document.querySelector('[data-page="settings"]');
      if (A.__r11SettingsObserver) { try { A.__r11SettingsObserver.disconnect(); } catch(e){} A.__r11SettingsObserver = null; }
      if (!root) return;
      var mo = new MutationObserver(deb);
      mo.observe(root, { childList:true, subtree:true });
      A.__r11SettingsObserver = mo;
      deb();
    }
    attach();
    window.addEventListener('hashchange', function(){ setTimeout(attach, 100); });
    document.addEventListener('click', function(){ setTimeout(attach, 120); }, true);
  }

  if (!A.settings) A.settings = {};
  A.settings.polishSections = function(){ injectR11Css(); markSections(); };
  A.settings.enableSectionPolish = function(){ injectR11Css(); markSections(); bindR11Observer(); };

  injectR11Css();
  markSections();
  bindR11Observer();
})();


/* ===== AlcopacTheme v5 main r12: stable full render pipeline ===== */
(function(){
  'use strict';
  if (!window.AlcopacTheme) return;
  var A = window.AlcopacTheme;
  A.version = '5.12.0-main-r12';
  A.full = A.full || {};
  A.core = A.core || {};

  function raf2(fn){
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(function(){ requestAnimationFrame(fn); });
    } else {
      setTimeout(fn, 32);
    }
  }

  A.full.refreshStable = A.full.refreshStable || function(){
    try {
      var root = document.querySelector('.activity.activity--active .full-start-new') ||
        document.querySelector('.activity--active .full-start-new') ||
        document.querySelector('.activity.activity--active .full-start') ||
        document.querySelector('.activity--active .full-start') ||
        document.querySelector('.full-start-new') ||
        document.querySelector('.full-start');
      if (root) root.classList.remove('alcopac-full-pending');
    } catch(e){}
    if (A.core && typeof A.core.flush === 'function') A.core.flush('full:');
    if (A.full && typeof A.full.refreshSoft === 'function') A.full.refreshSoft(); setTimeout(window.updateReactionCountsVisibility, 40);
    raf2(function(){
      try { if (A.full && typeof A.full.reorderSafe === 'function') A.full.reorderSafe(); } catch(e){}
      try { if (A.full && typeof A.full.refreshSoft === 'function') A.full.refreshSoft(); setTimeout(window.updateReactionCountsVisibility, 40); } catch(e){}
    });
    return true;
  };

  A.full.refreshBundle = A.full.refreshStable;

  try {
    if (window.Lampa && Lampa.Listener && !window.__alcopac_theme_r12_full_hook) {
      window.__alcopac_theme_r12_full_hook = true;
      Lampa.Listener.follow('full', function(e){
        if (!e || (e.type !== 'complite' && e.type !== 'activity')) return;
        setTimeout(function(){
          try { A.full.refreshStable(); } catch(e){}
        }, 90);
      });
      Lampa.Listener.follow('activity', function(e){
        if (!e || (e.type !== 'start' && e.type !== 'activity' && e.type !== 'after')) return;
        setTimeout(function(){
          try { A.full.refreshStable(); } catch(e){}
        }, 120);
      });
    }
  } catch(e){}
})();


;(function(){
  'use strict';
  var A = window.AlcopacTheme = window.AlcopacTheme || {};
  A.version = '5.14.0-main-r14';
  A.full = A.full || {};

  function ensureStyle(){
    var id = 'alcopac-theme-r14-full-hero-polish';
    var s = document.getElementById(id);
    if (!s) {
      s = document.createElement('style');
      s.id = id;
      document.head.appendChild(s);
    }
    s.textContent = [
      '.full-start-new.alcopac-full-has-logo .full-start-new__logo{display:block; margin:0 0 .65em 0; line-height:0;}',
      '.full-start-new.alcopac-full-has-logo .full-start-new__logo img{display:block; width:auto; max-width:min(100%, 26em); object-fit:contain;}',
      'body.mobile .full-start-new.alcopac-full-has-logo .full-start-new__logo img{max-width:min(100%, 18em);}',
      '.full-start-new.alcopac-full-has-logo .full-start-new__title{display:none !important;}',
      '.full-start-new:not(.alcopac-full-has-logo) .full-start-new__title{display:block;}',
      '.full-start-new .full-start-new__title{margin-bottom:.28em;}',
      '.full-start-new .full-start-new__details{margin-top:.18em;}',
      '.full-start-new .full-start-new__buttons{margin-top:.85em;}',
      '.full-start-new.alcopac-reactions-off .full-start-new__buttons{margin-top:.18em !important;}',
      '.full-start-new.alcopac-reactions-off .full-start-new__reactions{display:none !important; margin-top:0 !important;}',
      '.full-start-new .full-start-new__descr{margin-top:.78em;}',
      '.full-start-new .full-start-new__right > .full-start-new__tagline{margin-top:.2em; margin-bottom:.28em;}',
      '.full-start-new.alcopac-full-has-compactmeta .full-start-new__head{margin-bottom:.15em;}',
      '.full-start-new .alcopac-compact-meta-line{margin-top:.38em; margin-bottom:.22em;}',
      '.full-start-new .alcopac-compact-meta-line:empty{display:none !important;}',
      '.full-start-new .full-start-new__logo:empty{display:none !important;}',
      '.full-start-new .full-start-new__right{contain:layout style;}',
      '.full-start-new.alcopac-full-hero-polished .full-start-new__buttons > *{transition:none !important; animation:none !important;}',
      '.full-start-new.alcopac-full-hero-polished .full-start-new__descr, .full-start-new.alcopac-full-hero-polished .full-start-new__title, .full-start-new.alcopac-full-hero-polished .full-start-new__details{transition:none !important; animation:none !important;}'
    ].join('\n');
  }

  function markHeroState(){
    try {
      var root = document.querySelector('.activity.activity--active .full-start-new') ||
        document.querySelector('.activity--active .full-start-new') ||
        document.querySelector('.activity.activity--active .full-start') ||
        document.querySelector('.activity--active .full-start') ||
        document.querySelector('.full-start-new') ||
        document.querySelector('.full-start');
      if (!root) return false;
      root.classList.add('alcopac-full-hero-polished');
      var logo = root.querySelector('.full-start-new__logo');
      var img = logo && logo.querySelector('img.loaded, img');
      var compact = root.querySelector('.alcopac-compact-meta-line');
      root.classList.toggle('alcopac-full-has-logo', !!img && !!img.getAttribute('src'));
      root.classList.toggle('alcopac-full-has-compactmeta', !!compact && !!compact.textContent.trim());
      return true;
    } catch(e){ return false; }
  }

  A.full.refreshHeroPolish = function(){
    ensureStyle();
    markHeroState();
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(markHeroState);
    } else {
      setTimeout(markHeroState, 16);
    }
    return true;
  };

  var prevSoft = A.full.refreshSoft;
  A.full.refreshSoft = function(){
    var r = typeof prevSoft === 'function' ? prevSoft.apply(this, arguments) : true;
    try { A.full.refreshHeroPolish(); } catch(e){}
    return r;
  };

  var prevHard = A.full.refreshHard;
  A.full.refreshHard = function(){
    var r = typeof prevHard === 'function' ? prevHard.apply(this, arguments) : true;
    try { A.full.refreshHeroPolish(); } catch(e){}
    return r;
  };

  var prevStable = A.full.refreshStable;
  A.full.refreshStable = function(){
    var r = typeof prevStable === 'function' ? prevStable.apply(this, arguments) : true;
    try { A.full.refreshHeroPolish(); } catch(e){}
    return r;
  };

  try {
    if (window.Lampa && Lampa.Listener && !window.__alcopac_theme_r14_full_hook) {
      window.__alcopac_theme_r14_full_hook = true;
      Lampa.Listener.follow('full', function(e){
        if (!e || (e.type !== 'complite' && e.type !== 'activity')) return;
        setTimeout(function(){
          try { A.full.refreshHeroPolish(); } catch(e){}
        }, 40);
      });
    }
  } catch(e){}

  try {
    if (window.Lampa && Lampa.SettingsApi && !window.__alcopac_theme_r14_tool) {
      window.__alcopac_theme_r14_tool = true;
      Lampa.SettingsApi.addParam({
        component: 'theme_tools',
        param: {
          name: 'Освежить хедер фильма',
          type: 'button'
        },
        field: {
          name: 'Освежить хедер фильма',
          description: 'Повторно применить логотип и выравнивание верхнего блока карточки'
        },
        onChange: function(){
          try { A.full.refreshHeroPolish(); } catch(e){}
        }
      });
    }
  } catch(e){}
})();


;(function(){
  try {
    var STYLE_ID = 'alcopac-tv-mobile-buttons-fix-style';
    if (!document.getElementById(STYLE_ID)) {
      var st = document.createElement('style');
      st.id = STYLE_ID;
      st.textContent = [
        'body.tv .full-start-new__buttons, body.tv .full-start__buttons, body.tv--device .full-start-new__buttons, body.tv--device .full-start__buttons{display:flex !important; visibility:visible !important; opacity:1 !important;}',
        '@media (max-width: 900px){.full-start-new__buttons, .full-start__buttons{display:flex !important; visibility:visible !important; opacity:1 !important;}}',
        'body.tv .full-start-new__buttons .full-start__button, body.tv .full-start-new__buttons .full-start-new__button, body.tv .full-start-new__buttons .selector, body.tv .full-start__buttons .full-start__button, body.tv .full-start__buttons .full-start-new__button, body.tv .full-start__buttons .selector, body.tv--device .full-start-new__buttons .full-start__button, body.tv--device .full-start-new__buttons .full-start-new__button, body.tv--device .full-start-new__buttons .selector, body.tv--device .full-start__buttons .full-start__button, body.tv--device .full-start__buttons .full-start-new__button, body.tv--device .full-start__buttons .selector{display:inline-flex !important; visibility:visible !important; opacity:1 !important;}',
        '@media (max-width: 900px){.full-start-new__buttons .full-start__button, .full-start-new__buttons .full-start-new__button, .full-start-new__buttons .selector, .full-start__buttons .full-start__button, .full-start__buttons .full-start-new__button, .full-start__buttons .selector{display:inline-flex !important; visibility:visible !important; opacity:1 !important;}}'
      ].join('');
      document.head.appendChild(st);
    }

    function needFix(){
      try {
        if (window.Lampa && Lampa.Platform){
          if (Lampa.Platform.tv && Lampa.Platform.tv()) return true;
          if (Lampa.Platform.mobile && Lampa.Platform.mobile()) return true;
        }
      } catch(e){}
      return window.innerWidth <= 900;
    }

  function fixButtons(){
      if (!needFix()) return;
      var root = document.querySelector('.activity.activity--active .full-start-new') ||
        document.querySelector('.activity--active .full-start-new') ||
        document.querySelector('.activity.activity--active .full-start') ||
        document.querySelector('.activity--active .full-start') ||
        document.querySelector('.full-start-new') ||
        document.querySelector('.full-start');
      if (!root) return;
      var buttonsEl = root.querySelector('.full-start-new__buttons') || root.querySelector('.full-start__buttons');
      if (!buttonsEl) return;
      buttonsEl.style.visibility = '';
      buttonsEl.style.opacity = '';
      buttonsEl.style.display = 'flex';
      buttonsEl.hidden = false;
      buttonsEl.removeAttribute('hidden');

      var hideExtra = false;
      var reactionsHidden = false;
      try { hideExtra = Lampa.Storage.get('lampac_screen_hide_extra_buttons', 'off') === 'on'; } catch(e) {}
      reactionsHidden = false;

      var items = buttonsEl.querySelectorAll('.full-start__button, .full-start-new__button, .selector');
      for (var i=0;i<items.length;i++){
        var el = items[i];
        var cls = el.classList;
        var shouldHide = false;
        if (hideExtra && (cls.contains('button--options') || cls.contains('button--reaction'))) shouldHide = true;
        if (reactionsHidden && cls.contains('button--reaction')) shouldHide = true;
        if (cls.contains('alcopac-force-hidden')) shouldHide = true;
        if (shouldHide){
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.opacity = '0';
          el.setAttribute('hidden', 'hidden');
        } else {
          el.style.display = 'inline-flex';
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          el.hidden = false;
          el.removeAttribute('hidden');
        }
      }
    }

    var run = function(){ setTimeout(fixButtons, 0); setTimeout(fixButtons, 60); setTimeout(fixButtons, 180); setTimeout(fixButtons, 360); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
    document.addEventListener('click', function(){ setTimeout(fixButtons, 50); }, true);
    try {
      if (window.Lampa && Lampa.Listener && Lampa.Listener.follow){
        Lampa.Listener.follow('full', function(){ run(); });
        Lampa.Listener.follow('activity', function(){ run(); });
      }
    } catch(e){}
    var mo = new MutationObserver(function(){ fixButtons(); });
    mo.observe(document.body, {childList:true, subtree:true});
  } catch(e) { console.error('[AlcopacTheme][tv-mobile-buttons-fix]', e); }
})();


/* --- gap fix for tv/mobile full buttons --- */
(function(){
  'use strict';
  function needFix(){
    try {
      if (window.Lampa && Lampa.Platform){
        if (Lampa.Platform.tv && Lampa.Platform.tv()) return true;
        if (Lampa.Platform.mobile && Lampa.Platform.mobile()) return true;
      }
    } catch(e){}
    return window.innerWidth <= 900;
  }
  function ensureStyle(){
    var id='alcopac-tv-mobile-buttons-gap-fix';
    var st=document.getElementById(id);
    if (!st){ st=document.createElement('style'); st.id=id; document.head.appendChild(st); }
    st.textContent = [
      'body.tv .full-start-new__buttons, body.tv .full-start__buttons, body.tv--device .full-start-new__buttons, body.tv--device .full-start__buttons, .full-start-new__buttons, .full-start__buttons{justify-content:flex-start !important; align-items:center !important; column-gap:.5em !important; row-gap:.5em !important;}',
      'body.tv .full-start-new__buttons > *, body.tv .full-start__buttons > *, body.tv--device .full-start-new__buttons > *, body.tv--device .full-start__buttons > *, .full-start-new__buttons > *, .full-start__buttons > *{margin-left:0 !important; margin-right:0 !important; flex:0 0 auto !important;}',
      'body.tv .full-start-new__buttons > *.alcopac-force-hidden, body.tv .full-start__buttons > *.alcopac-force-hidden, body.tv--device .full-start-new__buttons > *.alcopac-force-hidden, body.tv--device .full-start__buttons > *.alcopac-force-hidden, .full-start-new__buttons > *.alcopac-force-hidden, .full-start__buttons > *.alcopac-force-hidden{display:none !important; visibility:hidden !important; opacity:0 !important; width:0 !important; min-width:0 !important; margin:0 !important; padding:0 !important; border:0 !important; overflow:hidden !important;}',
      '@media (max-width: 900px){.full-start-new__buttons,.full-start__buttons{justify-content:flex-start !important; align-items:center !important; column-gap:.5em !important; row-gap:.5em !important;}.full-start-new__buttons > *, .full-start__buttons > *{margin-left:0 !important; margin-right:0 !important; flex:0 0 auto !important;}}'
    ].join('');
  }
  function fix(){
    if (!needFix()) return;
    var root=document.querySelector('.activity.activity--active .full-start-new') ||
      document.querySelector('.activity--active .full-start-new') ||
      document.querySelector('.activity.activity--active .full-start') ||
      document.querySelector('.activity--active .full-start') ||
      document.querySelector('.full-start-new') ||
      document.querySelector('.full-start');
    if (!root) return;
    var buttons=root.querySelector('.full-start-new__buttons') || root.querySelector('.full-start__buttons');
    if (!buttons) return;
    var reactionsHidden = false;
    reactionsHidden = false;
    buttons.style.display='flex';
    buttons.style.flexWrap='wrap';
    buttons.style.justifyContent='flex-start';
    buttons.style.alignItems='center';
    buttons.style.columnGap='.5em';
    buttons.style.rowGap='.5em';
    var items=buttons.children;
    for (var i=0;i<items.length;i++){
      var el=items[i];
      var cls = el.classList || {};
      var hide = el.classList.contains('alcopac-force-hidden') ||
        el.hidden ||
        el.getAttribute('hidden') === 'hidden' ||
        el.style.display === 'none' ||
        el.style.visibility === 'hidden' ||
        (reactionsHidden && cls.contains && cls.contains('button--reaction'));
      el.style.margin='0';
      el.style.marginLeft='0';
      el.style.marginRight='0';
      el.style.flex='0 0 auto';
      el.style.alignSelf='auto';
      el.style.maxWidth='';
      if (hide) {
        el.classList.add('alcopac-force-hidden');
        el.style.display='none';
        el.style.visibility='hidden';
        el.style.opacity='0';
        el.style.width='0';
        el.style.minWidth='0';
        el.style.maxWidth='0';
        el.style.padding='0';
        el.style.margin='0';
        el.style.border='0';
        el.style.overflow='hidden';
        el.style.flex='0 0 0';
        el.style.lineHeight='0';
      } else {
        el.classList.remove('alcopac-force-hidden');
        el.style.display='inline-flex';
        el.style.visibility='visible';
        el.style.opacity='1';
        el.style.width='';
        el.style.minWidth='';
        el.style.maxWidth='';
        el.style.padding='';
        el.style.border='';
        el.style.overflow='';
        el.style.flex='0 0 auto';
        el.style.lineHeight='';
      }
    }
  }
  var run=function(){ ensureStyle(); setTimeout(fix,0); setTimeout(fix,80); setTimeout(fix,220); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  document.addEventListener('click', function(){ setTimeout(fix,80); }, true);
  try { if (window.Lampa && Lampa.Listener && Lampa.Listener.follow){ Lampa.Listener.follow('full', function(){ run(); }); } } catch(e){}
})();


/* === AlcopacTheme: restore exact card focus after Back from full screen === */
(function(){
  'use strict';
  if (window.__alcopac_back_focus_theme_fix_v3) return;
  window.__alcopac_back_focus_theme_fix_v3 = true;

  var state = {
    selected: null,
    beforeFull: null,
    wasFull: false,
    restoreTimers: [],
    rememberTimer: 0
  };

  function clearRestoreTimers(){
    try { state.restoreTimers.forEach(function(t){ clearTimeout(t); }); } catch(e){}
    state.restoreTimers = [];
  }

  function clearRememberTimer(){
    try { clearTimeout(state.rememberTimer); } catch(e){}
    state.rememberTimer = 0;
  }

  function isVisible(el){
    try {
      if (!el || !document.contains(el)) return false;
      var r = el.getBoundingClientRect();
      return !!(r.width || r.height || el.getClientRects().length);
    } catch(e){ return false; }
  }

  function isFullOpen(){
    return !!document.querySelector('.activity.activity--active .full-start-new, .activity.activity--active .full-start, .activity--active .full-start-new, .activity--active .full-start');
  }

  function normalizeText(txt){
    return String(txt || '').replace(/\s+/g, ' ').trim();
  }

  function getCardTitle(card){
    try {
      var t = card.querySelector('.card__title, .card__name, .card__text, .card__label');
      return normalizeText(t ? t.textContent : card.textContent);
    } catch(e){ return ''; }
  }

  function getCardId(card){
    try {
      return normalizeText(
        card.getAttribute('data-id') ||
        card.getAttribute('data-card-id') ||
        card.getAttribute('data-key') ||
        (card.dataset && (card.dataset.id || card.dataset.cardId || card.dataset.key)) ||
        ''
      );
    } catch(e){ return ''; }
  }

  function getLineWrap(card){
    try { return card ? card.closest('.items-line') : null; } catch(e){ return null; }
  }

  function getLineBody(card){
    try {
      var wrap = getLineWrap(card);
      return wrap ? (wrap.querySelector('.items-line__body') || wrap) : null;
    } catch(e){ return null; }
  }

  function getLineCardsFromWrap(wrap){
    try {
      var root = wrap ? (wrap.querySelector('.items-line__body') || wrap) : null;
      return root ? Array.prototype.slice.call(root.querySelectorAll('.card')) : [];
    } catch(e){ return []; }
  }

  function getAllLineWraps(){
    try { return Array.prototype.slice.call(document.querySelectorAll('.items-line')); } catch(e){ return []; }
  }

  function getLineTitle(wrap){
    try {
      var t = wrap && wrap.querySelector('.items-line__title, .items-line__head, .items-line__name');
      return normalizeText(t ? t.textContent : '');
    } catch(e){ return ''; }
  }

  function currentFocusedCard(){
    try {
      var cards = Array.prototype.slice.call(document.querySelectorAll('.items-line .card.focus, .items-line .card.hover, .items-line .card.card--focus, .items-line .card.selector.focus'));
      if (!cards.length) return null;
      for (var i = cards.length - 1; i >= 0; i--) {
        if (isVisible(cards[i])) return cards[i];
      }
      return cards[cards.length - 1] || null;
    } catch(e){ return null; }
  }

  function buildSnapshot(card){
    try {
      if (!card || !document.contains(card)) return null;
      var wrap = getLineWrap(card);
      var cards = getLineCardsFromWrap(wrap);
      return {
        id: getCardId(card),
        title: getCardTitle(card),
        lineTitle: getLineTitle(wrap),
        lineIndex: getAllLineWraps().indexOf(wrap),
        indexInLine: cards.indexOf(card),
        ref: card
      };
    } catch(e){ return null; }
  }

  function rememberCard(card, hard){
    try {
      if (!card || isFullOpen()) return;
      var snap = buildSnapshot(card);
      if (!snap) return;
      state.selected = snap;
      if (hard) state.beforeFull = snap;
    } catch(e){}
  }

  function rememberFocusedDelayed(hard, delay){
    clearRememberTimer();
    state.rememberTimer = setTimeout(function(){
      if (isFullOpen()) return;
      var focused = currentFocusedCard();
      if (focused) rememberCard(focused, !!hard);
    }, typeof delay === 'number' ? delay : 35);
  }

  function findBySnapshot(snap){
    try {
      if (!snap) return null;
      if (snap.ref && document.contains(snap.ref) && isVisible(snap.ref)) return snap.ref;

      var wraps = getAllLineWraps();
      var wrap = null;

      if (snap.lineTitle) {
        for (var i = 0; i < wraps.length; i++) {
          if (getLineTitle(wraps[i]) === snap.lineTitle) { wrap = wraps[i]; break; }
        }
      }
      if (!wrap && snap.lineIndex > -1 && wraps[snap.lineIndex]) wrap = wraps[snap.lineIndex];

      var scopedCards = wrap ? getLineCardsFromWrap(wrap) : Array.prototype.slice.call(document.querySelectorAll('.items-line .card'));
      if (!scopedCards.length) return null;

      if (snap.id) {
        for (var j = 0; j < scopedCards.length; j++) {
          if (getCardId(scopedCards[j]) === snap.id) return scopedCards[j];
        }
      }
      if (snap.title) {
        for (var k = 0; k < scopedCards.length; k++) {
          if (getCardTitle(scopedCards[k]) === snap.title) return scopedCards[k];
        }
      }
      if (wrap && snap.indexInLine > -1) {
        var lineCards = getLineCardsFromWrap(wrap);
        if (lineCards[snap.indexInLine]) return lineCards[snap.indexInLine];
      }
      return null;
    } catch(e){ return null; }
  }

  function clearVisualFocus(){
    try {
      Array.prototype.slice.call(document.querySelectorAll('.items-line .card.focus, .items-line .card.hover, .items-line .card.card--focus')).forEach(function(card){
        if (!card || !card.classList) return;
        card.classList.remove('focus');
        card.classList.remove('hover');
        card.classList.remove('card--focus');
      });
    } catch(e){}
  }

  function setControllerCollection(card){
    try {
      if (!(window.Lampa && Lampa.Controller && window.$)) return;
      var wrap = getLineWrap(card);
      var cards = getLineCardsFromWrap(wrap);
      if (!cards.length) return;
      if (Lampa.Controller.toggle) {
        try { Lampa.Controller.toggle('content'); } catch(e){}
      }
      if (Lampa.Controller.collectionSet) {
        try { Lampa.Controller.collectionSet($(cards)); } catch(e){}
      }
    } catch(e){}
  }

  function restoreOnce(){
    if (isFullOpen()) return false;
    var snap = state.beforeFull || state.selected;
    var card = findBySnapshot(snap);
    if (!card) return false;

    clearVisualFocus();
    setControllerCollection(card);

    try { if (card.scrollIntoView) card.scrollIntoView({ block: 'nearest', inline: 'center' }); } catch(e){}

    try {
      if (window.$) {
        try { $(card).trigger('hover:focus'); } catch(e){}
        try { $(card).trigger('mouseenter'); } catch(e){}
      }
      if (window.Lampa && Lampa.Controller && Lampa.Controller.focus) {
        Lampa.Controller.focus(card);
      }
    } catch(e){}

    try {
      card.classList.add('focus');
      card.classList.add('hover');
    } catch(e){}

    rememberCard(card, false);
    return true;
  }

  function scheduleRestore(){
    clearRestoreTimers();
    [140, 320].forEach(function(delay){
      state.restoreTimers.push(setTimeout(function(){
        restoreOnce();
      }, delay));
    });
  }

  document.addEventListener('click', function(e){
    var card = e.target && e.target.closest ? e.target.closest('.items-line .card') : null;
    if (card && !isFullOpen()) rememberCard(card, true);
  }, true);

  document.addEventListener('keydown', function(e){
    var key = e && (e.keyCode || e.which || e.code || e.key);

    if (key === 13 || key === 'Enter' || key === 23) {
      var focused = currentFocusedCard();
      if (focused && !isFullOpen()) rememberCard(focused, true);
      return;
    }

    if (key === 37 || key === 39 || key === 38 || key === 40 ||
        key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
      clearRestoreTimers();
      rememberFocusedDelayed(false, 45);
    }
  }, true);

  try {
    if (window.Lampa && Lampa.Listener && Lampa.Listener.follow) {
      Lampa.Listener.follow('full', function(e){
        try {
          if (e && e.type === 'complite') {
            var focused = currentFocusedCard();
            if (focused && !isFullOpen()) rememberCard(focused, true);
          }
          if (e && (e.type === 'destroy' || e.type === 'close')) {
            setTimeout(function(){
              if (!isFullOpen()) scheduleRestore();
            }, 90);
          }
        } catch(err){}
      });

      Lampa.Listener.follow('activity', function(){
        setTimeout(function(){
          if (!isFullOpen() && state.beforeFull) scheduleRestore();
        }, 140);
      });
    }
  } catch(e){}
})();

/* ===== Hotfix: mobile hard centering for logo/meta/buttons ===== */
(function(){
  'use strict';
  function ensureMobileCenterStyle(){
    if (document.getElementById('lampac-mobile-hard-center-style')) return;
    var st = document.createElement('style');
    st.id = 'lampac-mobile-hard-center-style';
    st.textContent = [
      '@media (max-width: 820px){',
      '  body.mobile .full-start-new .full-start-new__right, body.mobile .full-start .full-start__right, .mobile .full-start-new .full-start-new__right, .mobile .full-start .full-start__right{width:100% !important; max-width:none !important; align-items:center !important; text-align:center !important;}',
      '  body.mobile .full-start-new .full-start-new__head, body.mobile .full-start-new .full-start-new__tagline, body.mobile .full-start-new .full-start-new__title, body.mobile .full-start-new .full-start-new__logo, body.mobile .full-start-new .full-start-new__details, body.mobile .full-start-new .full-start-new__rate-line, body.mobile .full-start-new .full-start-new__reactions, body.mobile .full-start-new .full-start-new__buttons, body.mobile .full-start-new .full-start-new__descr, body.mobile .full-start .full-start__head, body.mobile .full-start .full-start__title, body.mobile .full-start .full-start__details, body.mobile .full-start .full-start__rate-line, body.mobile .full-start .full-start__reactions, body.mobile .full-start .full-start__buttons, .mobile .full-start-new .full-start-new__head, .mobile .full-start-new .full-start-new__tagline, .mobile .full-start-new .full-start-new__title, .mobile .full-start-new .full-start-new__logo, .mobile .full-start-new .full-start-new__details, .mobile .full-start-new .full-start-new__rate-line, .mobile .full-start-new .full-start-new__reactions, .mobile .full-start-new .full-start-new__buttons, .mobile .full-start-new .full-start-new__descr, .mobile .full-start .full-start__head, .mobile .full-start .full-start__title, .mobile .full-start .full-start__details, .mobile .full-start .full-start__rate-line, .mobile .full-start .full-start__reactions, .mobile .full-start .full-start__buttons{text-align:center !important; margin-left:auto !important; margin-right:auto !important;}',
      '  body.mobile .full-start-new .full-start-new__details, body.mobile .full-start-new .full-start-new__rate-line, body.mobile .full-start-new .full-start-new__reactions, body.mobile .full-start-new .full-start-new__buttons, body.mobile .full-start .full-start__details, body.mobile .full-start .full-start__rate-line, body.mobile .full-start .full-start__reactions, body.mobile .full-start .full-start__buttons, .mobile .full-start-new .full-start-new__details, .mobile .full-start-new .full-start-new__rate-line, .mobile .full-start-new .full-start-new__reactions, .mobile .full-start-new .full-start-new__buttons, .mobile .full-start .full-start__details, .mobile .full-start .full-start__rate-line, .mobile .full-start .full-start__reactions, .mobile .full-start .full-start__buttons{display:flex !important; flex-wrap:wrap !important; justify-content:center !important; align-items:center !important; width:100% !important;}',
      '  body.mobile .full-start-new .full-start-new__logo, body.mobile .full-start .full-start__logo, .mobile .full-start-new .full-start-new__logo, .mobile .full-start .full-start__logo{display:flex !important; justify-content:center !important; align-items:center !important; width:100% !important; left:auto !important; right:auto !important;}',
      '  body.mobile .full-start-new .full-start-new__logo img, body.mobile .full-start .full-start__logo img, .mobile .full-start-new .full-start-new__logo img, .mobile .full-start .full-start__logo img{display:block !important; margin-left:auto !important; margin-right:auto !important; object-fit:contain !important;}',
      '  body.mobile .full-start-new .full-start-new__title, body.mobile .full-start .full-start__title, body.mobile .lampac-meta-line, .mobile .full-start-new .full-start-new__title, .mobile .full-start .full-start__title, .mobile .lampac-meta-line{width:100% !important; text-align:center !important;}',
      '  body.mobile .full-start-new .full-start-new__buttons, body.mobile .full-start .full-start__buttons, .mobile .full-start-new .full-start-new__buttons, .mobile .full-start .full-start__buttons{justify-content:center !important; margin-left:auto !important; margin-right:auto !important;}',
      '}',
    ].join('');
    document.head.appendChild(st);
  }
  function reflowMobileCenter(){
    if (!(document.body.classList.contains('mobile') || window.innerWidth <= 820)) return;
    var root = document.querySelector('.activity.activity--active .full-start-new, .activity--active .full-start-new, .full-start-new, .activity.activity--active .full-start, .activity--active .full-start, .full-start');
    if (!root) return;
    var right = root.querySelector('.full-start-new__right, .full-start__right');
    if (right){
      right.style.alignItems = 'center';
      right.style.textAlign = 'center';
      right.style.maxWidth = 'none';
      right.style.width = '100%';
    }
    var sels = ['.full-start-new__head','.full-start-new__tagline','.full-start-new__title','.full-start-new__logo','.full-start-new__details','.full-start-new__rate-line','.full-start-new__reactions','.full-start-new__buttons','.full-start__head','.full-start__title','.full-start__logo','.full-start__details','.full-start__rate-line','.full-start__reactions','.full-start__buttons','.lampac-meta-line'];
    sels.forEach(function(sel){
      root.querySelectorAll(sel).forEach(function(el){
        el.style.textAlign = 'center';
        el.style.marginLeft = 'auto';
        el.style.marginRight = 'auto';
      });
    });
    root.querySelectorAll('.full-start-new__details, .full-start-new__rate-line, .full-start-new__reactions, .full-start-new__buttons, .full-start__details, .full-start__rate-line, .full-start__reactions, .full-start__buttons').forEach(function(el){
      el.style.display = 'flex';
      el.style.flexWrap = 'wrap';
      el.style.justifyContent = 'center';
      el.style.alignItems = 'center';
      el.style.width = '100%';
    });
    root.querySelectorAll('.full-start-new__logo, .full-start__logo').forEach(function(el){
      el.style.display = 'flex';
      el.style.justifyContent = 'center';
      el.style.alignItems = 'center';
      el.style.width = '100%';
    });
    root.querySelectorAll('.full-start-new__logo img, .full-start__logo img').forEach(function(img){
      img.style.display = 'block';
      img.style.marginLeft = 'auto';
      img.style.marginRight = 'auto';
      img.style.objectFit = 'contain';
    });
  }
  ensureMobileCenterStyle();
  if (window.Lampa && Lampa.Listener && Lampa.Listener.follow){
    Lampa.Listener.follow('full', function(e){
      if (e.type === 'complite') {
        setTimeout(reflowMobileCenter, 0);
        setTimeout(reflowMobileCenter, 120);
        setTimeout(reflowMobileCenter, 400);
        setTimeout(reflowMobileCenter, 900);
      }
    });
  }
  document.addEventListener('readystatechange', function(){ if (document.readyState === 'complete') ensureMobileCenterStyle(); });
  window.addEventListener('resize', function(){ setTimeout(reflowMobileCenter, 50); }, {passive:true});
})();


/* --- mobile hard center patch for logo/rates/reactions/buttons --- */
(function(){
  'use strict';
  function isMobile(){
    try {
      if (window.Lampa && Lampa.Platform && typeof Lampa.Platform.mobile === 'function' && Lampa.Platform.mobile()) return true;
    } catch(e){}
    return window.innerWidth <= 600;
  }
  function ensureStyle(){
    var id='alcopac-mobile-hard-center-v2';
    var st=document.getElementById(id);
    if(!st){ st=document.createElement('style'); st.id=id; document.head.appendChild(st); }
    st.textContent=[
      '@media (max-width: 600px){',
      '  .full-start-new__right, .full-start__right { text-align:center !important; align-items:center !important; }',
      '  .full-start-new__logo, .full-start__logo, .full-start-new__title, .full-start__title, .full-start-new__head, .full-start__head, .full-start-new__tagline, .full-start__tagline, .full-start-new__details, .full-start__details { margin-left:auto !important; margin-right:auto !important; text-align:center !important; }',
      '  .full-start-new__logo, .full-start__logo { display:flex !important; justify-content:center !important; width:100% !important; }',
      '  .full-start-new__logo img, .full-start__logo img { display:block !important; margin-left:auto !important; margin-right:auto !important; }',
      '  .full-start-new__rate-line, .full-start__rate-line, .full-start-new__reactions, .full-start__reactions { display:flex !important; flex-wrap:wrap !important; justify-content:center !important; align-items:center !important; width:fit-content !important; max-width:100% !important; margin-left:auto !important; margin-right:auto !important; text-align:center !important; }',
      '  .full-start-new__rate-line > *, .full-start__rate-line > *, .full-start-new__reactions > *, .full-start__reactions > * { flex:0 0 auto !important; margin-left:0 !important; margin-right:0 !important; }',
      '  .full-start-new__buttons, .full-start__buttons { display:flex !important; flex-wrap:wrap !important; justify-content:center !important; align-items:center !important; align-content:center !important; width:fit-content !important; max-width:100% !important; margin-left:auto !important; margin-right:auto !important; text-align:center !important; overflow:visible !important; }',
      '  .full-start-new__buttons > *, .full-start__buttons > * { flex:0 0 auto !important; margin-left:0 !important; margin-right:0 !important; }',
      '}'
    ].join('');
  }
  function reflow(){
    if(!isMobile()) return;
    ensureStyle();
    var root=document.querySelector('.activity.activity--active .full-start-new, .activity.activity--active .full-start, .full-start-new, .full-start');
    if(!root) return;
    ['.full-start-new__logo','.full-start__logo','.full-start-new__title','.full-start__title','.full-start-new__head','.full-start__head','.full-start-new__tagline','.full-start__tagline','.full-start-new__details','.full-start__details'].forEach(function(sel){
      root.querySelectorAll(sel).forEach(function(el){
        el.style.textAlign='center';
        el.style.marginLeft='auto';
        el.style.marginRight='auto';
      });
    });
    root.querySelectorAll('.full-start-new__rate-line, .full-start__rate-line, .full-start-new__reactions, .full-start__reactions').forEach(function(el){
      el.style.display='flex';
      el.style.flexWrap='wrap';
      el.style.justifyContent='center';
      el.style.alignItems='center';
      el.style.width='fit-content';
      el.style.maxWidth='100%';
      el.style.marginLeft='auto';
      el.style.marginRight='auto';
      el.style.textAlign='center';
    });
    root.querySelectorAll('.full-start-new__buttons, .full-start__buttons').forEach(function(el){
      el.style.display='flex';
      el.style.flexWrap='wrap';
      el.style.justifyContent='center';
      el.style.alignItems='center';
      el.style.alignContent='center';
      el.style.width='fit-content';
      el.style.maxWidth='100%';
      el.style.marginLeft='auto';
      el.style.marginRight='auto';
      el.style.overflow='visible';
      el.style.textAlign='center';
    });
  }
  ensureStyle();
  if(document.readyState==='complete' || document.readyState==='interactive') setTimeout(reflow,0);
  document.addEventListener('readystatechange', function(){ if(document.readyState==='complete') setTimeout(reflow,0); });
  if(window.Lampa && Lampa.Listener && Lampa.Listener.follow){
    Lampa.Listener.follow('full', function(e){
      if(e.type==='complite'){
        setTimeout(reflow,0);
        setTimeout(reflow,120);
        setTimeout(reflow,350);
        setTimeout(reflow,800);
      }
    });
  }
  window.addEventListener('resize', function(){ setTimeout(reflow,50); }, {passive:true});
})();


/* --- mobile absolute center override v3 --- */
(function(){
  'use strict';
  function isMobile(){
    try {
      if (window.Lampa && Lampa.Platform && typeof Lampa.Platform.mobile === 'function' && Lampa.Platform.mobile()) return true;
    } catch(e){}
    return window.innerWidth <= 820 || document.body.classList.contains('mobile');
  }
  function ensureStyle(){
    var id='alcopac-mobile-center-v3';
    if(document.getElementById(id)) return;
    var st=document.createElement('style');
    st.id=id;
    st.textContent=[
      '@media (max-width: 820px){',
      '  .full-start-new__right, .full-start__right { width:100% !important; max-width:none !important; text-align:center !important; align-items:center !important; }',
      '  .full-start-new__head, .full-start__title, .full-start-new__title, .full-start__logo, .full-start-new__logo, .full-start-new__tagline, .full-start__tagline, .full-start-new__details, .full-start__details, .lampac-meta-line { width:auto !important; max-width:100% !important; text-align:center !important; margin-left:auto !important; margin-right:auto !important; }',
      '  .full-start-new__logo, .full-start__logo { display:flex !important; justify-content:center !important; }',
      '  .full-start-new__logo img, .full-start__logo img { display:block !important; margin-left:auto !important; margin-right:auto !important; }',
      '  .full-start-new__rate-line, .full-start__rate-line, .full-start-new__reactions, .full-start__reactions, .full-start-new__buttons, .full-start__buttons { position:static !important; left:auto !important; right:auto !important; transform:none !important; width:fit-content !important; max-width:calc(100% - 1.2em) !important; margin-left:auto !important; margin-right:auto !important; justify-content:center !important; align-items:center !important; align-content:center !important; text-align:center !important; }',
      '  .full-start-new__rate-line, .full-start__rate-line, .full-start-new__reactions, .full-start__reactions, .full-start-new__buttons, .full-start__buttons { display:flex !important; flex-wrap:wrap !important; }',
      '  .full-start-new__rate-line > *, .full-start__rate-line > *, .full-start-new__reactions > *, .full-start__reactions > *, .full-start-new__buttons > *, .full-start__buttons > * { flex:0 0 auto !important; margin-left:0 !important; margin-right:0 !important; }',
      '}'
    ].join('');
    document.head.appendChild(st);
  }
  function apply(){
    if(!isMobile()) return;
    ensureStyle();
    var root=document.querySelector('.activity.activity--active .full-start-new, .activity.activity--active .full-start, .full-start-new, .full-start');
    if(!root) return;
    var right=root.querySelector('.full-start-new__right, .full-start__right');
    if(right){
      right.style.width='100%';
      right.style.maxWidth='none';
      right.style.textAlign='center';
      right.style.alignItems='center';
    }
    root.querySelectorAll('.full-start-new__head, .full-start__head, .full-start-new__title, .full-start__title, .full-start-new__logo, .full-start__logo, .full-start-new__tagline, .full-start__tagline, .full-start-new__details, .full-start__details, .lampac-meta-line').forEach(function(el){
      el.style.textAlign='center';
      el.style.marginLeft='auto';
      el.style.marginRight='auto';
      el.style.width='auto';
      el.style.maxWidth='100%';
    });
    root.querySelectorAll('.full-start-new__rate-line, .full-start__rate-line, .full-start-new__reactions, .full-start__reactions, .full-start-new__buttons, .full-start__buttons').forEach(function(el){
      el.style.display='flex';
      el.style.flexWrap='wrap';
      el.style.justifyContent='center';
      el.style.alignItems='center';
      el.style.alignContent='center';
      el.style.position='static';
      el.style.left='auto';
      el.style.right='auto';
      el.style.transform='none';
      el.style.width='fit-content';
      el.style.maxWidth='calc(100% - 1.2em)';
      el.style.marginLeft='auto';
      el.style.marginRight='auto';
      el.style.textAlign='center';
    });
  }
  if(document.readyState==='complete' || document.readyState==='interactive') setTimeout(apply,0);
  document.addEventListener('readystatechange', function(){ if(document.readyState==='complete') setTimeout(apply,0); });
  if(window.Lampa && Lampa.Listener && Lampa.Listener.follow){
    Lampa.Listener.follow('full', function(e){
      if(e.type==='complite'){
        setTimeout(apply,0);
        setTimeout(apply,120);
        setTimeout(apply,350);
        setTimeout(apply,800);
      }
    });
  }
  window.addEventListener('resize', function(){ setTimeout(apply,50); }, {passive:true});
})();

;(function(){
  try{
    function mobileCenterFinal(){
      var mobile = (window.innerWidth <= 820) || document.body.classList.contains('mobile');
      if(!mobile) return;
      var root = document.querySelector('.activity.activity--active .full-start-new, .activity.activity--active .full-start, .full-start-new, .full-start');
      if(!root) return;
      root.querySelectorAll('.full-start-new__rate-line, .full-start__rate-line, .full-start-new__reactions, .full-start__reactions, .full-start-new__buttons, .full-start__buttons').forEach(function(el){
        el.style.setProperty('position','static','important');
        el.style.setProperty('left','auto','important');
        el.style.setProperty('right','auto','important');
        el.style.setProperty('transform','none','important');
        el.style.setProperty('width','fit-content','important');
        el.style.setProperty('max-width','calc(100% - 1.2em)','important');
        el.style.setProperty('margin-left','auto','important');
        el.style.setProperty('margin-right','auto','important');
        el.style.setProperty('justify-content','center','important');
        el.style.setProperty('align-items','center','important');
        el.style.setProperty('align-content','center','important');
        el.style.setProperty('text-align','center','important');
        el.style.setProperty('display','flex','important');
        el.style.setProperty('flex-wrap','wrap','important');
      });
      root.querySelectorAll('.full-start-new__logo, .full-start__logo, .full-start-new__title, .full-start__title, .full-start-new__head, .full-start__head, .full-start-new__tagline, .full-start__tagline, .full-start-new__details, .full-start__details, .lampac-meta-line').forEach(function(el){
        el.style.setProperty('margin-left','auto','important');
        el.style.setProperty('margin-right','auto','important');
        el.style.setProperty('text-align','center','important');
      });
    }
    if(document.readyState === 'complete' || document.readyState === 'interactive'){
      setTimeout(mobileCenterFinal, 0);
    }
    document.addEventListener('readystatechange', function(){
      if(document.readyState === 'complete') setTimeout(mobileCenterFinal, 0);
    });
    if(window.Lampa && Lampa.Listener && Lampa.Listener.follow){
      Lampa.Listener.follow('full', function(e){
        if(e && e.type === 'complite'){
          setTimeout(mobileCenterFinal, 0);
          setTimeout(mobileCenterFinal, 120);
          setTimeout(mobileCenterFinal, 350);
          setTimeout(mobileCenterFinal, 800);
        }
      });
    }
  }catch(e){}
})();
