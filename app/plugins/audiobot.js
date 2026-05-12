// Audiobot music plugin for Lampa.
//
// Registers a "Музыка" entry in the side menu. Tracks come from audiobot.in
// (VK audio mirror) via lampac-go endpoints:
//   GET /audiobot/charts                  — daily chart
//   GET /audiobot/search?q=X&page=N       — text search
//   GET /audiobot/artist/{id}             — artist discography
//   GET /audiobot/play?audio=BLOB         — 302 → real CDN URL
//
// Architecture
// ------------
// • FloatingPlayer  singleton mounted in <body>, owns the <audio> element +
//   queue + control bar. Survives activity destroy → music keeps playing
//   while the user browses films, the side menu, etc. Click the bar's
//   title to jump back into the music activity.
// • MusicActivity   the audiobot tab UI; just a thin client of the player.
//
// Server-side decryption keeps the AES password out of the client; the
// plugin only ever holds the encrypted blob and lets <audio> follow the
// /audiobot/play redirect.
(function () {
  'use strict';

  // ---------------------------------------------------------------------
  // Origin + HTTP
  // ---------------------------------------------------------------------
  function resolveBase() {
    try {
      var scripts = document.getElementsByTagName('script');
      for (var i = scripts.length - 1; i >= 0; i--) {
        var src = scripts[i].src || '';
        var m = src.match(/^(https?:\/\/[^\/]+)\/audiobot\.js/);
        if (m) return m[1];
      }
    } catch (e) {}
    return location.origin;
  }
  var BASE = resolveBase();

  function api(path) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', BASE + path, true);
      xhr.timeout = 25000;
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
          try { resolve(JSON.parse(xhr.responseText)); }
          catch (e) { reject(new Error('parse: ' + e.message)); }
        } else {
          reject(new Error('HTTP ' + xhr.status));
        }
      };
      xhr.onerror = function () { reject(new Error('network error')); };
      xhr.ontimeout = function () { reject(new Error('timeout')); };
      xhr.send();
    });
  }
  function streamURL(blob) { return BASE + '/audiobot/play?audio=' + encodeURIComponent(blob); }

  // ---------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------
  function fmtDuration(sec) {
    sec = parseInt(sec || 0, 10);
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }
  function escHTML(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  function jumpToMusic() {
    if (window.Lampa && Lampa.Activity) {
      Lampa.Activity.push({ url: '', title: 'Музыка', component: 'audiobot_music', page: 1 });
    }
  }
  function jumpToArtist(artistID, name) {
    if (!artistID || !window.Lampa || !Lampa.Activity) return;
    Lampa.Activity.push({
      url: '/audiobot/artist/' + encodeURIComponent(artistID),
      title: name || 'Артист',
      component: 'audiobot_artist',
      artist_id: artistID,
      artist_name: name || '',
      page: 1,
    });
  }
  function jumpToBookmarks() {
    if (!window.Lampa || !Lampa.Activity) return;
    Lampa.Activity.push({ url: '', title: 'Избранное', component: 'audiobot_bookmarks', page: 1 });
  }
  function jumpToHistory() {
    if (!window.Lampa || !Lampa.Activity) return;
    Lampa.Activity.push({ url: '', title: 'История', component: 'audiobot_history', page: 1 });
  }
  function jumpToAlbum(album) {
    if (!album || !album.id || !window.Lampa || !Lampa.Activity) return;
    var kind = album.kind === 'playlist' ? 'playlist' : 'album';
    Lampa.Activity.push({
      url: '/audiobot/album/' + kind + '/' + encodeURIComponent(album.id),
      title: album.title || 'Альбом',
      component: 'audiobot_album',
      album_kind: kind,
      album_id: album.id,
      album_title: album.title || '',
      album_artist: album.artist || '',
      album_cover: album.cover || '',
      page: 1,
    });
  }

  // ---------------------------------------------------------------------
  // Bookmarks cache (in-memory set of starred track IDs)
  // ---------------------------------------------------------------------
  // Refreshed on demand from /audiobot/bookmarks. Activities subscribe via
  // onChange to repaint the ★ icon when the user toggles a bookmark in
  // another view.
  var Bookmarks = (function () {
    var ids = {};
    var listeners = [];
    function notify() { listeners.forEach(function (fn) { try { fn(); } catch (e) {} }); }

    function refresh() {
      return api('/audiobot/bookmarks').then(function (r) {
        ids = {};
        (r.tracks || []).forEach(function (t) { ids[t.id] = true; });
        notify();
        return r.tracks || [];
      }).catch(function () { return []; });
    }
    function has(id) { return !!ids[id]; }
    function add(track) {
      ids[track.id] = true;
      notify();
      return fetch(BASE + '/audiobot/bookmarks/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: track.id, title: track.title || '', artist: track.artist || '',
          artist_id: track.artist_id || '', cover: track.cover || '',
          duration: track.duration || 0, audio: track.audio,
        }),
      }).catch(function () { /* best-effort; UI already toggled */ });
    }
    function remove(id) {
      delete ids[id];
      notify();
      return fetch(BASE + '/audiobot/bookmarks/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id }),
      }).catch(function () {});
    }
    return {
      refresh: refresh, has: has, add: add, remove: remove,
      onChange: function (fn) { listeners.push(fn); },
      offChange: function (fn) { listeners = listeners.filter(function (x) { return x !== fn; }); },
    };
  })();

  // ---------------------------------------------------------------------
  // Lyrics service (lrclib via /audiobot/lyrics)
  // ---------------------------------------------------------------------
  // Owns the synced/plain lyrics for the *currently loaded* track. The
  // floating-player panel subscribes via onChange to repaint when a new
  // track loads. Per-track caching lives on the server (lrclib responses
  // never change), so the client just keeps the result for the active
  // track and drops it on the next load.
  var Lyrics = (function () {
    var current = { trackId: null, synced: [], plain: '', found: false, loading: false };
    var listeners = [];
    function notify() { listeners.forEach(function (fn) { try { fn(current); } catch (e) {} }); }

    function load(track) {
      if (!track) {
        current = { trackId: null, synced: [], plain: '', found: false, loading: false };
        notify();
        return;
      }
      if (current.trackId === track.id && !current.loading) {
        notify();
        return;
      }
      current = { trackId: track.id, synced: [], plain: '', found: false, loading: true };
      notify();
      var path = '/audiobot/lyrics?artist=' + encodeURIComponent(track.artist || '') +
                 '&track=' + encodeURIComponent(track.title || '') +
                 (track.duration ? '&duration=' + encodeURIComponent(track.duration) : '');
      api(path).then(function (r) {
        // Guard against stale responses if the user skipped tracks fast.
        if (current.trackId !== track.id) return;
        current = {
          trackId: track.id,
          synced: r.synced || [],
          plain: r.plain || '',
          found: !!r.found,
          loading: false,
        };
        notify();
      }).catch(function () {
        if (current.trackId !== track.id) return;
        current.loading = false;
        notify();
      });
    }

    // Returns the index of the synced line whose timestamp is the latest
    // <= currentTime. Linear scan from a hint for typical forward-playback;
    // falls back to a full scan after seek.
    function activeLine(time, hint) {
      var lines = current.synced;
      if (!lines.length) return -1;
      var i = (hint != null && hint >= 0 && hint < lines.length) ? hint : 0;
      // Walk forward while the next line is also <= time.
      while (i + 1 < lines.length && lines[i + 1].time <= time) i++;
      // Walk back if we somehow seeked behind.
      while (i > 0 && lines[i].time > time) i--;
      if (lines[i].time > time) return -1;
      return i;
    }

    return {
      load: load,
      get: function () { return current; },
      activeLine: activeLine,
      onChange: function (fn) { listeners.push(fn); },
      offChange: function (fn) { listeners = listeners.filter(function (x) { return x !== fn; }); },
    };
  })();

  // ---------------------------------------------------------------------
  // Floating player (singleton in <body>)
  // ---------------------------------------------------------------------
  // Persists across Lampa navigation. The audio element + control bar live
  // outside any activity so destroy() / activity switches don't interrupt
  // playback. The bar is hidden when the queue is empty and slides in when
  // the user starts listening.
  //
  // Modes:
  //  • shuffle  — playAt() / next() pick a non-repeating random index
  //  • repeat   — 'none' (default), 'one' (replay current), 'all' (loop queue)
  //  • volume   — stored 0..1, persisted to localStorage
  //
  // History: every successful playAt records the track to /audiobot/history/add
  // so the user gets a cross-session recently-played list.
  var Player = (function () {
    var audioEl = null;
    var bar = null;          // jQuery
    var lyricsPanel = null;  // jQuery — drop-up panel attached to bar
    var queue = [];          // current play order
    var origQueue = [];      // pre-shuffle order (for toggling shuffle off)
    var pos = -1;
    var listeners = [];

    var shuffleOn = false;
    var repeatMode = 'none'; // 'none' | 'one' | 'all'
    var lyricsOpen = false;
    var lyricsHintIdx = 0;
    var volume = (function () {
      try {
        var v = parseFloat(localStorage.getItem('audiobot_volume'));
        return isFinite(v) ? Math.max(0, Math.min(1, v)) : 1;
      } catch (e) { return 1; }
    })();

    function shuffleArray(arr) {
      arr = arr.slice();
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
      }
      return arr;
    }

    function recordHistory(track) {
      if (!track) return;
      try {
        fetch(BASE + '/audiobot/history/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: track.id, title: track.title || '', artist: track.artist || '',
            artist_id: track.artist_id || '', cover: track.cover || '',
            duration: track.duration || 0, audio: track.audio,
          }),
        }).catch(function () {});
      } catch (e) {}
    }

    function ensureAudio() {
      if (audioEl) return audioEl;
      audioEl = document.createElement('audio');
      audioEl.style.display = 'none';
      audioEl.crossOrigin = 'anonymous';
      audioEl.volume = volume;
      audioEl.addEventListener('ended', function () { onEnded(); });
      audioEl.addEventListener('error', function () {
        if (window.Lampa && Lampa.Noty) Lampa.Noty.show('Ошибка воспроизведения');
        renderBar();
      });
      audioEl.addEventListener('play', renderBar);
      audioEl.addEventListener('pause', renderBar);
      audioEl.addEventListener('timeupdate', onTimeUpdate);
      audioEl.addEventListener('loadedmetadata', renderProgress);
      audioEl.addEventListener('volumechange', renderVolume);
      document.body.appendChild(audioEl);
      return audioEl;
    }

    function ensureBar() {
      if (bar) return bar;
      bar = $(
        '<div class="audiobot-fp" style="display:none">' +
        '  <div class="audiobot-fp__cover"></div>' +
        '  <div class="audiobot-fp__main">' +
        '    <div class="audiobot-fp__meta selector">' +
        '      <div class="audiobot-fp__title"></div>' +
        '      <div class="audiobot-fp__artist"></div>' +
        '    </div>' +
        '    <div class="audiobot-fp__times">' +
        '      <span class="audiobot-fp__t-cur">0:00</span>' +
        '      <div class="audiobot-fp__progress selector" data-act="seek" tabindex="0">' +
        '        <div class="audiobot-fp__progress-fill"></div>' +
        '        <div class="audiobot-fp__progress-thumb"></div>' +
        '      </div>' +
        '      <span class="audiobot-fp__t-tot">0:00</span>' +
        '    </div>' +
        '  </div>' +
        '  <div class="audiobot-fp__ctrls">' +
        '    <button class="audiobot-fp__btn selector" data-act="shuffle" title="Перемешать">🔀</button>' +
        '    <button class="audiobot-fp__btn selector" data-act="prev" title="Предыдущий">⏮</button>' +
        '    <button class="audiobot-fp__btn selector" data-act="play" title="Воспроизведение">▶</button>' +
        '    <button class="audiobot-fp__btn selector" data-act="next" title="Следующий">⏭</button>' +
        '    <button class="audiobot-fp__btn selector" data-act="repeat" title="Повтор">🔁</button>' +
        '    <button class="audiobot-fp__btn selector" data-act="lyrics" title="Текст">📜</button>' +
        '    <div class="audiobot-fp__vol selector" data-act="volume" tabindex="0" title="Громкость">' +
        '      <span class="audiobot-fp__vol-icon">🔊</span>' +
        '      <div class="audiobot-fp__vol-track"><div class="audiobot-fp__vol-fill"></div></div>' +
        '    </div>' +
        '    <button class="audiobot-fp__btn selector" data-act="close" title="Остановить">✕</button>' +
        '  </div>' +
        '</div>'
      );
      lyricsPanel = $(
        '<div class="audiobot-lyrics" style="display:none">' +
        '  <div class="audiobot-lyrics__head">' +
        '    <div class="audiobot-lyrics__title">Текст песни</div>' +
        '    <div class="audiobot-lyrics__source"></div>' +
        '  </div>' +
        '  <div class="audiobot-lyrics__body"></div>' +
        '</div>'
      );

      bar.find('[data-act="play"]').on('hover:enter click', toggle);
      bar.find('[data-act="prev"]').on('hover:enter click', prev);
      bar.find('[data-act="next"]').on('hover:enter click', next);
      bar.find('[data-act="close"]').on('hover:enter click', close);
      bar.find('[data-act="shuffle"]').on('hover:enter click', toggleShuffle);
      bar.find('[data-act="repeat"]').on('hover:enter click', cycleRepeat);
      bar.find('[data-act="lyrics"]').on('hover:enter click', toggleLyrics);
      bar.find('.audiobot-fp__meta').on('hover:enter click', jumpToMusic);

      bar.find('[data-act="seek"]').on('click', function (e) {
        var $el = $(this);
        var rect = $el[0].getBoundingClientRect();
        var x = (e.originalEvent && e.originalEvent.clientX) || e.clientX || rect.left;
        var pct = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
        seekFraction(pct);
      });
      // TV remote — hover:enter on the progress bar nudges +5%.
      bar.find('[data-act="seek"]').on('hover:enter', function () {
        if (!audioEl || !audioEl.duration) return;
        seekFraction(Math.min(1, (audioEl.currentTime / audioEl.duration) + 0.05));
      });

      bar.find('[data-act="volume"]').on('click', function (e) {
        var $track = $(this).find('.audiobot-fp__vol-track');
        var rect = $track[0].getBoundingClientRect();
        var x = (e.originalEvent && e.originalEvent.clientX) || e.clientX || rect.left;
        var pct = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
        setVolume(pct);
      });
      // TV remote — hover:enter cycles 100→75→50→25→0→100.
      bar.find('[data-act="volume"]').on('hover:enter', function () {
        var v = audioEl ? audioEl.volume : volume;
        var step = v <= 0 ? 1 : Math.max(0, Math.round((v - 0.25) * 100) / 100);
        setVolume(step);
      });

      $('body').append(bar);
      $('body').append(lyricsPanel);

      Lyrics.onChange(renderLyrics);
      return bar;
    }

    function fmtTime(sec) {
      sec = Math.max(0, Math.floor(sec || 0));
      var m = Math.floor(sec / 60), s = sec % 60;
      return m + ':' + (s < 10 ? '0' : '') + s;
    }

    function renderBar() {
      ensureBar();
      var t = queue[pos] || null;
      if (!t || !audioEl) {
        bar.hide();
        if (lyricsPanel) lyricsPanel.hide();
        return;
      }
      bar.show();
      bar.find('.audiobot-fp__title').text(t.title || t.id || '');
      bar.find('.audiobot-fp__artist').text(t.artist || '');
      bar.find('.audiobot-fp__cover').css('background-image', t.cover ? "url('" + t.cover + "')" : 'none');
      bar.find('[data-act="play"]').text(audioEl.paused ? '▶' : '⏸');
      bar.find('[data-act="shuffle"]').toggleClass('audiobot-fp__btn--on', shuffleOn);
      var rIcon = repeatMode === 'one' ? '🔂' : '🔁';
      bar.find('[data-act="repeat"]')
        .text(rIcon)
        .toggleClass('audiobot-fp__btn--on', repeatMode !== 'none');
      bar.find('[data-act="lyrics"]').toggleClass('audiobot-fp__btn--on', lyricsOpen);
      renderVolume();
    }

    function renderProgress() {
      if (!bar || !audioEl) return;
      var d = audioEl.duration || 0;
      var c = audioEl.currentTime || 0;
      var pct = d > 0 ? (c / d * 100) : 0;
      bar.find('.audiobot-fp__progress-fill').css('width', pct + '%');
      bar.find('.audiobot-fp__progress-thumb').css('left', pct + '%');
      bar.find('.audiobot-fp__t-cur').text(fmtTime(c));
      bar.find('.audiobot-fp__t-tot').text(fmtTime(d));
    }

    function renderVolume() {
      if (!bar || !audioEl) return;
      var v = audioEl.volume;
      bar.find('.audiobot-fp__vol-fill').css('width', (v * 100) + '%');
      var icon = v <= 0.01 ? '🔇' : (v < 0.5 ? '🔉' : '🔊');
      bar.find('.audiobot-fp__vol-icon').text(icon);
    }

    function onTimeUpdate() {
      renderProgress();
      if (lyricsOpen) syncLyricsScroll();
    }

    function renderLyrics(state) {
      if (!lyricsPanel) return;
      lyricsHintIdx = 0;
      var $body = lyricsPanel.find('.audiobot-lyrics__body');
      var $src = lyricsPanel.find('.audiobot-lyrics__source');
      $body.empty();
      if (!state || !state.trackId) {
        $src.text('');
        $body.html('<div class="audiobot-lyrics__msg">Включите трек, чтобы увидеть текст.</div>');
        return;
      }
      if (state.loading) {
        $src.text('lrclib…');
        $body.html('<div class="audiobot-lyrics__msg">Загрузка текста…</div>');
        return;
      }
      if (!state.found) {
        $src.text('lrclib');
        $body.html('<div class="audiobot-lyrics__msg">Текст не найден на lrclib.net.</div>');
        return;
      }
      $src.text('lrclib · ' + (state.synced.length ? 'синхр.' : 'обычный'));
      if (state.synced.length) {
        state.synced.forEach(function (line, i) {
          $body.append($('<div class="audiobot-lyrics__line" data-idx="' + i + '"></div>').text(line.text || ' '));
        });
      } else {
        state.plain.split('\n').forEach(function (l) {
          $body.append($('<div class="audiobot-lyrics__line audiobot-lyrics__line--plain"></div>').text(l || ' '));
        });
      }
    }

    function syncLyricsScroll() {
      if (!lyricsPanel || !audioEl) return;
      var state = Lyrics.get();
      if (!state.synced.length) return;
      var idx = Lyrics.activeLine(audioEl.currentTime, lyricsHintIdx);
      lyricsHintIdx = idx >= 0 ? idx : 0;
      var $lines = lyricsPanel.find('.audiobot-lyrics__line');
      $lines.removeClass('audiobot-lyrics__line--active');
      if (idx < 0) return;
      var $cur = $lines.eq(idx).addClass('audiobot-lyrics__line--active');
      // Center the active line in the body (best-effort — no smooth on TV).
      var $body = lyricsPanel.find('.audiobot-lyrics__body');
      if ($cur.length && $body.length) {
        var bodyRect = $body[0].getBoundingClientRect();
        var lineRect = $cur[0].getBoundingClientRect();
        var off = (lineRect.top - bodyRect.top) - (bodyRect.height / 2 - lineRect.height / 2);
        $body[0].scrollTop += off;
      }
    }

    function notify(event) {
      for (var i = 0; i < listeners.length; i++) {
        try { listeners[i](event); } catch (e) {}
      }
    }

    function enqueue(tracks, startAt) {
      tracks = (tracks || []).slice();
      origQueue = tracks;
      if (shuffleOn && tracks.length > 1) {
        // Move the requested start track to position 0, shuffle the rest.
        var start = startAt || 0;
        var head = tracks[start];
        var rest = tracks.slice(0, start).concat(tracks.slice(start + 1));
        queue = [head].concat(shuffleArray(rest));
        pos = -1;
        playAt(0);
      } else {
        queue = tracks;
        pos = -1;
        playAt(startAt || 0);
      }
    }

    function playAt(i) {
      if (i < 0 || i >= queue.length) return;
      pos = i;
      var t = queue[i];
      var a = ensureAudio();
      a.src = streamURL(t.audio);
      a.play().catch(function () {});
      ensureBar();
      renderBar();
      Lyrics.load(t);
      recordHistory(t);
      notify({ type: 'change', track: t, index: i });
    }

    function onEnded() {
      if (repeatMode === 'one') {
        if (audioEl) {
          audioEl.currentTime = 0;
          audioEl.play().catch(function () {});
        }
        return;
      }
      if (pos + 1 < queue.length) { playAt(pos + 1); return; }
      if (repeatMode === 'all' && queue.length) { playAt(0); return; }
      // queue exhausted — keep last track loaded but paused
      renderBar();
    }

    function next() {
      if (pos + 1 < queue.length) { playAt(pos + 1); return; }
      if (repeatMode === 'all' && queue.length) playAt(0);
    }
    function prev() {
      if (audioEl && audioEl.currentTime > 3) {
        // first press: rewind to start; second press in <3s: previous track
        audioEl.currentTime = 0;
        return;
      }
      if (pos > 0) playAt(pos - 1);
    }
    function toggle() {
      if (!audioEl) return;
      if (audioEl.paused) audioEl.play().catch(function () {}); else audioEl.pause();
    }
    function close() {
      if (audioEl) {
        try { audioEl.pause(); audioEl.src = ''; } catch (e) {}
      }
      queue = []; origQueue = []; pos = -1;
      lyricsOpen = false;
      if (lyricsPanel) lyricsPanel.hide();
      Lyrics.load(null);
      renderBar();
      notify({ type: 'close' });
    }

    function seekFraction(pct) {
      if (!audioEl || !audioEl.duration) return;
      audioEl.currentTime = audioEl.duration * pct;
      renderProgress();
      if (lyricsOpen) {
        lyricsHintIdx = 0;
        syncLyricsScroll();
      }
    }

    function setVolume(v) {
      v = Math.max(0, Math.min(1, v));
      volume = v;
      if (audioEl) audioEl.volume = v;
      try { localStorage.setItem('audiobot_volume', String(v)); } catch (e) {}
      renderVolume();
    }

    function toggleShuffle() {
      shuffleOn = !shuffleOn;
      var cur = queue[pos] || null;
      if (shuffleOn) {
        // Re-shuffle around the current track so playback doesn't jump.
        if (cur && origQueue.length > 1) {
          var others = origQueue.filter(function (t) { return !cur || t.id !== cur.id; });
          queue = [cur].concat(shuffleArray(others));
          pos = 0;
        }
      } else {
        // Restore original order, find current track's natural position.
        if (cur) {
          queue = origQueue.slice();
          pos = -1;
          for (var i = 0; i < queue.length; i++) {
            if (queue[i].id === cur.id) { pos = i; break; }
          }
        }
      }
      renderBar();
      notify({ type: 'mode', shuffle: shuffleOn });
    }

    function cycleRepeat() {
      repeatMode = repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none';
      renderBar();
      notify({ type: 'mode', repeat: repeatMode });
    }

    function toggleLyrics() {
      lyricsOpen = !lyricsOpen;
      if (lyricsPanel) {
        lyricsPanel.toggle(lyricsOpen);
        if (lyricsOpen) syncLyricsScroll();
      }
      renderBar();
    }

    function currentTrack() { return queue[pos] || null; }
    function currentIndex() { return pos; }
    function isPlaying() { return audioEl && !audioEl.paused; }

    return {
      enqueue: enqueue,
      playAt: playAt,
      next: next, prev: prev, toggle: toggle, close: close,
      seekFraction: seekFraction,
      setVolume: setVolume,
      getVolume: function () { return volume; },
      toggleShuffle: toggleShuffle,
      cycleRepeat: cycleRepeat,
      getShuffle: function () { return shuffleOn; },
      getRepeat: function () { return repeatMode; },
      toggleLyrics: toggleLyrics,
      currentTrack: currentTrack,
      currentIndex: currentIndex,
      isPlaying: isPlaying,
      onChange: function (fn) { listeners.push(fn); },
      offChange: function (fn) {
        listeners = listeners.filter(function (x) { return x !== fn; });
      },
    };
  })();

  // ---------------------------------------------------------------------
  // Track-list rendering (shared between MusicActivity and ArtistActivity)
  // ---------------------------------------------------------------------
  // Renders an array of tracks into `$container` as a focusable list. The
  // artist sub-element is a separate selector — pressing OK on the title
  // plays the track, on the artist navigates to the artist's discography.
  function renderTrackList($container, tracks) {
    $container.empty();
    if (!tracks || !tracks.length) {
      $container.html('<div class="audiobot-empty">Ничего не найдено.</div>');
      return;
    }
    tracks.forEach(function (t, i) {
      var hasArtistID = !!t.artist_id;
      var artistHTML = hasArtistID
        ? '<span class="audiobot-card__artist-link selector" data-artist-id="' + escHTML(t.artist_id) + '">' + escHTML(t.artist || '') + '</span>'
        : escHTML(t.artist || '');
      var starred = Bookmarks.has(t.id);
      var card = $(
        '<div class="audiobot-card" data-id="' + escHTML(t.id) + '">' +
        '  <div class="audiobot-card__cover" style="background-image:url(\'' + escHTML(t.cover || '') + '\')"></div>' +
        '  <div class="audiobot-card__info">' +
        '    <div class="audiobot-card__title selector">' + escHTML(t.title || t.id) + '</div>' +
        '    <div class="audiobot-card__artist">' + artistHTML + '</div>' +
        '  </div>' +
        '  <div class="audiobot-card__duration">' + fmtDuration(t.duration) + '</div>' +
        '  <button class="audiobot-card__star selector' + (starred ? ' audiobot-card__star--on' : '') + '" data-act="bookmark">' + (starred ? '★' : '☆') + '</button>' +
        '</div>'
      );
      card.find('.audiobot-card__title').on('hover:enter', function () {
        Player.enqueue(tracks, i);
      });
      if (hasArtistID) {
        card.find('.audiobot-card__artist-link').on('hover:enter click', function (e) {
          if (e && e.stopPropagation) e.stopPropagation();
          jumpToArtist(t.artist_id, t.artist);
        });
      }
      card.find('.audiobot-card__star').on('hover:enter click', function (e) {
        if (e && e.stopPropagation) e.stopPropagation();
        if (Bookmarks.has(t.id)) Bookmarks.remove(t.id);
        else Bookmarks.add(t);
      });
      $container.append(card);
    });
  }

  function highlightActiveCards($container) {
    var cur = Player.currentTrack();
    $container.find('.audiobot-card').each(function () {
      var $c = $(this);
      $c.toggleClass('audiobot-card--playing', !!(cur && $c.attr('data-id') === cur.id));
    });
  }

  function refreshStarsIn($container) {
    $container.find('.audiobot-card').each(function () {
      var $c = $(this);
      var id = $c.attr('data-id');
      var $btn = $c.find('.audiobot-card__star');
      var on = Bookmarks.has(id);
      $btn.text(on ? '★' : '☆').toggleClass('audiobot-card__star--on', on);
    });
  }

  // ---------------------------------------------------------------------
  // Music Activity (search + charts)
  // ---------------------------------------------------------------------
  function MusicActivity() {
    var html = $(
      '<div class="audiobot">' +
      '  <div class="audiobot__head">' +
      '    <button class="audiobot__btn audiobot__btn--search selector" data-action="search">' +
      '      <span class="audiobot__btn-icon">🔍</span>' +
      '      <span class="audiobot__btn-label">Поиск музыки…</span>' +
      '    </button>' +
      '    <button class="audiobot__btn selector" data-action="charts">Главная</button>' +
      '    <button class="audiobot__btn selector" data-action="top">Топ</button>' +
      '    <button class="audiobot__btn selector" data-action="favs">★ Избранное</button>' +
      '    <button class="audiobot__btn selector" data-action="hist">⏱ История</button>' +
      '  </div>' +
      '  <div class="audiobot__status" style="display:none"></div>' +
      '  <div class="audiobot__albums" style="display:none">' +
      '    <div class="audiobot__albums-title">Альбомы и плейлисты</div>' +
      '    <div class="audiobot__albums-grid"></div>' +
      '  </div>' +
      '  <div class="audiobot__list scroll" data-mask="true"></div>' +
      '</div>'
    );

    var $list = html.find('.audiobot__list');
    var $status = html.find('.audiobot__status');
    var $searchBtn = html.find('[data-action="search"] .audiobot__btn-label');
    var $albumsBlock = html.find('.audiobot__albums');
    var $albumsGrid = html.find('.audiobot__albums-grid');
    var lastQuery = '';
    var lastTracks = [];
    var changeListener = null;
    var bookmarkListener = null;

    function showStatus(msg, isError) {
      if (!msg) return $status.hide();
      $status.text(msg).css('color', isError ? '#ff7878' : 'rgba(255,255,255,.65)').show();
    }

    function renderList(tracks) {
      lastTracks = tracks || [];
      renderTrackList($list, lastTracks);
      highlightActiveCards($list);
      if (window.Lampa && Lampa.Controller) {
        Lampa.Controller.collectionSet(html);
        Lampa.Controller.collectionFocus(false, html);
      }
    }
    function highlightActive() { highlightActiveCards($list); }

    function load(path, label) {
      showStatus('Загрузка ' + label + '…');
      api(path).then(function (r) {
        showStatus('');
        renderList(r.tracks || []);
      }).catch(function (e) {
        showStatus(label + ' не загружен: ' + e.message + ' [' + BASE + path + ']', true);
      });
    }

    function renderAlbums(albums) {
      $albumsGrid.empty();
      if (!albums || !albums.length) {
        $albumsBlock.hide();
        return;
      }
      albums.forEach(function (al) {
        var tile = $(
          '<div class="audiobot-album selector" data-id="' + escHTML(al.id) + '" data-kind="' + escHTML(al.kind || 'album') + '">' +
          '  <div class="audiobot-album__cover" style="background-image:url(\'' + escHTML(al.cover || '') + '\')"></div>' +
          '  <div class="audiobot-album__info">' +
          '    <div class="audiobot-album__title">' + escHTML(al.title || '') + '</div>' +
          '    <div class="audiobot-album__artist">' + escHTML(al.artist || '') + '</div>' +
          '  </div>' +
          '</div>'
        );
        tile.on('hover:enter click', function () { jumpToAlbum(al); });
        $albumsGrid.append(tile);
      });
      $albumsBlock.show();
    }

    function loadAlbums() {
      api('/audiobot/albums_chart').then(function (r) {
        renderAlbums(r.albums || []);
      }).catch(function () { /* non-fatal */ });
    }

    function setSearchLabel(q) {
      if (q) $searchBtn.text('🔍 ' + q).removeClass('audiobot__btn-label--placeholder');
      else $searchBtn.text('Поиск музыки…').addClass('audiobot__btn-label--placeholder');
    }

    function runSearch(q) {
      lastQuery = q;
      setSearchLabel(q);
      load('/audiobot/search?q=' + encodeURIComponent(q), 'поиск «' + q + '»');
    }

    var searchOpen = false;
    function openSearch() {
      if (searchOpen) return;
      if (!window.Lampa || !Lampa.Input) {
        // Fallback for non-Lampa environments — native prompt.
        var v = window.prompt('Поиск музыки', lastQuery || '');
        if (v && v.trim()) runSearch(v.trim());
        return;
      }
      searchOpen = true;
      var fired = false;
      Lampa.Input.edit({
        title: 'Поиск музыки',
        value: lastQuery,
        free: true,
        nosave: true,
      }, function (value) {
        if (fired) return;
        fired = true;
        // Defer until Lampa.Input fully unwinds its controller stack —
        // otherwise our collectionFocus collides with the closing dialog
        // and the dialog reopens on the same key event.
        setTimeout(function () {
          searchOpen = false;
          var v = (value || '').trim();
          if (v) runSearch(v);
          else if (window.Lampa && Lampa.Controller) {
            try { Lampa.Controller.toggle('content'); } catch (e) {}
          }
        }, 0);
      });
    }

    // Use only `hover:enter` for the search button — Lampa emits both
    // `hover:enter` and `click` for a single TV-remote OK press, which would
    // call openSearch twice. The other buttons re-render the list, so a
    // double call is harmless there; keep `click` for desktop mice.
    html.find('[data-action="search"]').on('hover:enter', openSearch);
    html.find('[data-action="charts"]').on('hover:enter click', function () {
      lastQuery = '';
      setSearchLabel('');
      $albumsBlock.show();
      load('/audiobot/charts', 'главная');
    });
    html.find('[data-action="top"]').on('hover:enter click', function () {
      lastQuery = '';
      setSearchLabel('');
      $albumsBlock.hide();
      load('/audiobot/tracks_chart', 'топ');
    });
    html.find('[data-action="favs"]').on('hover:enter click', jumpToBookmarks);
    html.find('[data-action="hist"]').on('hover:enter click', jumpToHistory);

    // Lampa Activity contract ------------------------------------------
    this.create = function () { return this.render(); };

    this.start = function () {
      if (window.Lampa && Lampa.Controller) {
        Lampa.Controller.add('content', {
          toggle: function () {
            Lampa.Controller.collectionSet(html);
            Lampa.Controller.collectionFocus(false, html);
          },
          left: function () { Lampa.Controller.toggle('menu'); },
          up: function () { if (window.Navigator) Navigator.move('up'); },
          down: function () { if (window.Navigator) Navigator.move('down'); },
          right: function () { if (window.Navigator) Navigator.move('right'); },
          back: function () { Lampa.Activity.backward(); },
        });
        Lampa.Controller.toggle('content');
      }
      // Refresh bookmark cache, then load charts.
      Bookmarks.refresh().then(function () { load('/audiobot/charts', 'чарт'); });
      loadAlbums();

      // Track-changed → re-highlight playing card.
      changeListener = function () { highlightActive(); };
      Player.onChange(changeListener);
      bookmarkListener = function () { refreshStarsIn($list); };
      Bookmarks.onChange(bookmarkListener);
    };

    this.render = function () { return html; };

    this.back = function () {
      if (window.Lampa && Lampa.Activity) Lampa.Activity.backward();
    };

    this.pause = function () {};
    this.stop = function () {};
    this.destroy = function () {
      if (changeListener) Player.offChange(changeListener);
      if (bookmarkListener) Bookmarks.offChange(bookmarkListener);
      // NOTE: do NOT stop the audio here — the floating player intentionally
      // outlives the activity so music keeps playing while the user browses
      // other Lampa pages. User can press the ✕ on the bar to stop.
      html.remove();
      $list = $status = $searchBtn = null;
    };
  }

  // ---------------------------------------------------------------------
  // Artist Activity (discography page)
  // ---------------------------------------------------------------------
  function ArtistActivity(payload) {
    var artistID = (payload && payload.artist_id) || '';
    var artistName = (payload && payload.artist_name) || 'Артист';

    var html = $(
      '<div class="audiobot">' +
      '  <div class="audiobot__head">' +
      '    <div class="audiobot__title">' + escHTML(artistName) + '</div>' +
      '    <div style="flex:1"></div>' +
      '    <button class="audiobot__btn selector" data-action="play-all">▶ Слушать всё</button>' +
      '  </div>' +
      '  <div class="audiobot__status" style="display:none"></div>' +
      '  <div class="audiobot__list scroll" data-mask="true"></div>' +
      '</div>'
    );

    var $list = html.find('.audiobot__list');
    var $status = html.find('.audiobot__status');
    var lastTracks = [];
    var changeListener = null;
    var bookmarkListener = null;

    function showStatus(msg, isError) {
      if (!msg) return $status.hide();
      $status.text(msg).css('color', isError ? '#ff7878' : 'rgba(255,255,255,.65)').show();
    }

    function load() {
      showStatus('Загрузка дискографии…');
      Promise.all([
        Bookmarks.refresh(),
        api('/audiobot/artist/' + encodeURIComponent(artistID)),
      ]).then(function (results) {
        showStatus('');
        lastTracks = results[1].tracks || [];
        renderTrackList($list, lastTracks);
        highlightActiveCards($list);
        if (window.Lampa && Lampa.Controller) {
          Lampa.Controller.collectionSet(html);
          Lampa.Controller.collectionFocus(false, html);
        }
      }).catch(function (e) {
        showStatus('Не удалось загрузить артиста: ' + e.message, true);
      });
    }

    html.find('[data-action="play-all"]').on('hover:enter click', function () {
      if (lastTracks.length) Player.enqueue(lastTracks, 0);
    });

    this.create = function () { return this.render(); };

    this.start = function () {
      if (window.Lampa && Lampa.Controller) {
        Lampa.Controller.add('content', {
          toggle: function () {
            Lampa.Controller.collectionSet(html);
            Lampa.Controller.collectionFocus(false, html);
          },
          left: function () { Lampa.Controller.toggle('menu'); },
          up: function () { if (window.Navigator) Navigator.move('up'); },
          down: function () { if (window.Navigator) Navigator.move('down'); },
          right: function () { if (window.Navigator) Navigator.move('right'); },
          back: function () { Lampa.Activity.backward(); },
        });
        Lampa.Controller.toggle('content');
      }
      load();
      changeListener = function () { highlightActiveCards($list); };
      Player.onChange(changeListener);
      bookmarkListener = function () { refreshStarsIn($list); };
      Bookmarks.onChange(bookmarkListener);
    };

    this.render = function () { return html; };
    this.back = function () { if (window.Lampa && Lampa.Activity) Lampa.Activity.backward(); };
    this.pause = function () {};
    this.stop = function () {};
    this.destroy = function () {
      if (changeListener) Player.offChange(changeListener);
      if (bookmarkListener) Bookmarks.offChange(bookmarkListener);
      html.remove();
      $list = $status = null;
    };
  }

  // ---------------------------------------------------------------------
  // Bookmarks Activity (★ favourites view)
  // ---------------------------------------------------------------------
  function BookmarksActivity() {
    var html = $(
      '<div class="audiobot">' +
      '  <div class="audiobot__head">' +
      '    <div class="audiobot__title">★ Избранное</div>' +
      '    <div style="flex:1"></div>' +
      '    <button class="audiobot__btn selector" data-action="play-all">▶ Слушать всё</button>' +
      '    <button class="audiobot__btn selector" data-action="refresh">↻ Обновить</button>' +
      '  </div>' +
      '  <div class="audiobot__status" style="display:none"></div>' +
      '  <div class="audiobot__list scroll" data-mask="true"></div>' +
      '</div>'
    );

    var $list = html.find('.audiobot__list');
    var $status = html.find('.audiobot__status');
    var lastTracks = [];
    var changeListener = null;
    var bookmarkListener = null;

    function showStatus(msg, isError) {
      if (!msg) return $status.hide();
      $status.text(msg).css('color', isError ? '#ff7878' : 'rgba(255,255,255,.65)').show();
    }

    function load() {
      showStatus('Загрузка избранного…');
      Bookmarks.refresh().then(function (tracks) {
        showStatus('');
        lastTracks = tracks || [];
        renderTrackList($list, lastTracks);
        highlightActiveCards($list);
        if (window.Lampa && Lampa.Controller) {
          Lampa.Controller.collectionSet(html);
          Lampa.Controller.collectionFocus(false, html);
        }
      }).catch(function (e) {
        showStatus('Не удалось загрузить избранное: ' + e.message, true);
      });
    }

    html.find('[data-action="play-all"]').on('hover:enter click', function () {
      if (lastTracks.length) Player.enqueue(lastTracks, 0);
    });
    html.find('[data-action="refresh"]').on('hover:enter click', load);

    this.create = function () { return this.render(); };

    this.start = function () {
      if (window.Lampa && Lampa.Controller) {
        Lampa.Controller.add('content', {
          toggle: function () {
            Lampa.Controller.collectionSet(html);
            Lampa.Controller.collectionFocus(false, html);
          },
          left: function () { Lampa.Controller.toggle('menu'); },
          up: function () { if (window.Navigator) Navigator.move('up'); },
          down: function () { if (window.Navigator) Navigator.move('down'); },
          right: function () { if (window.Navigator) Navigator.move('right'); },
          back: function () { Lampa.Activity.backward(); },
        });
        Lampa.Controller.toggle('content');
      }
      load();
      changeListener = function () { highlightActiveCards($list); };
      Player.onChange(changeListener);
      // When user un-stars an item from this view, drop it from the list
      // so the view stays consistent — also handles toggles from other tabs.
      bookmarkListener = function () {
        lastTracks = lastTracks.filter(function (t) { return Bookmarks.has(t.id); });
        renderTrackList($list, lastTracks);
        highlightActiveCards($list);
      };
      Bookmarks.onChange(bookmarkListener);
    };

    this.render = function () { return html; };
    this.back = function () { if (window.Lampa && Lampa.Activity) Lampa.Activity.backward(); };
    this.pause = function () {};
    this.stop = function () {};
    this.destroy = function () {
      if (changeListener) Player.offChange(changeListener);
      if (bookmarkListener) Bookmarks.offChange(bookmarkListener);
      html.remove();
      $list = $status = null;
    };
  }

  // ---------------------------------------------------------------------
  // History Activity (recently played)
  // ---------------------------------------------------------------------
  // Mirrors BookmarksActivity but reads /audiobot/history. Adds a "Очистить"
  // button — history entries are auto-trimmed server-side to 200 most-recent,
  // but users sometimes want a clean slate (shared device, hand-off, etc.).
  function HistoryActivity() {
    var html = $(
      '<div class="audiobot">' +
      '  <div class="audiobot__head">' +
      '    <div class="audiobot__title">⏱ История</div>' +
      '    <div style="flex:1"></div>' +
      '    <button class="audiobot__btn selector" data-action="play-all">▶ Слушать всё</button>' +
      '    <button class="audiobot__btn selector" data-action="refresh">↻ Обновить</button>' +
      '    <button class="audiobot__btn audiobot__btn--danger selector" data-action="clear">🗑 Очистить</button>' +
      '  </div>' +
      '  <div class="audiobot__status" style="display:none"></div>' +
      '  <div class="audiobot__list scroll" data-mask="true"></div>' +
      '</div>'
    );

    var $list = html.find('.audiobot__list');
    var $status = html.find('.audiobot__status');
    var lastTracks = [];
    var changeListener = null;
    var bookmarkListener = null;

    function showStatus(msg, isError) {
      if (!msg) return $status.hide();
      $status.text(msg).css('color', isError ? '#ff7878' : 'rgba(255,255,255,.65)').show();
    }

    function load() {
      showStatus('Загрузка истории…');
      Promise.all([
        Bookmarks.refresh(),
        api('/audiobot/history'),
      ]).then(function (results) {
        showStatus('');
        lastTracks = results[1].tracks || [];
        renderTrackList($list, lastTracks);
        highlightActiveCards($list);
        if (window.Lampa && Lampa.Controller) {
          Lampa.Controller.collectionSet(html);
          Lampa.Controller.collectionFocus(false, html);
        }
      }).catch(function (e) {
        showStatus('Не удалось загрузить историю: ' + e.message, true);
      });
    }

    function clearAll() {
      // Single-click clear with a Noty confirm-style is overkill here — the
      // server trims to 200 anyway, and nothing important is lost. Fire and
      // re-render. If users complain, swap to Lampa.Modal confirm.
      fetch(BASE + '/audiobot/history/clear', { method: 'POST' })
        .then(function () { load(); })
        .catch(function () {});
    }

    html.find('[data-action="play-all"]').on('hover:enter click', function () {
      if (lastTracks.length) Player.enqueue(lastTracks, 0);
    });
    html.find('[data-action="refresh"]').on('hover:enter click', load);
    html.find('[data-action="clear"]').on('hover:enter click', clearAll);

    this.create = function () { return this.render(); };

    this.start = function () {
      if (window.Lampa && Lampa.Controller) {
        Lampa.Controller.add('content', {
          toggle: function () {
            Lampa.Controller.collectionSet(html);
            Lampa.Controller.collectionFocus(false, html);
          },
          left: function () { Lampa.Controller.toggle('menu'); },
          up: function () { if (window.Navigator) Navigator.move('up'); },
          down: function () { if (window.Navigator) Navigator.move('down'); },
          right: function () { if (window.Navigator) Navigator.move('right'); },
          back: function () { Lampa.Activity.backward(); },
        });
        Lampa.Controller.toggle('content');
      }
      load();
      changeListener = function () { highlightActiveCards($list); };
      Player.onChange(changeListener);
      bookmarkListener = function () { refreshStarsIn($list); };
      Bookmarks.onChange(bookmarkListener);
    };

    this.render = function () { return html; };
    this.back = function () { if (window.Lampa && Lampa.Activity) Lampa.Activity.backward(); };
    this.pause = function () {};
    this.stop = function () {};
    this.destroy = function () {
      if (changeListener) Player.offChange(changeListener);
      if (bookmarkListener) Bookmarks.offChange(bookmarkListener);
      html.remove();
      $list = $status = null;
    };
  }

  // ---------------------------------------------------------------------
  // Album Activity (one album/playlist page)
  // ---------------------------------------------------------------------
  function AlbumActivity(payload) {
    var kind = (payload && payload.album_kind) || 'album';
    var albumID = (payload && payload.album_id) || '';
    var albumTitle = (payload && payload.album_title) || 'Альбом';
    var albumArtist = (payload && payload.album_artist) || '';
    var albumCover = (payload && payload.album_cover) || '';

    var html = $(
      '<div class="audiobot">' +
      '  <div class="audiobot__album-head">' +
      '    <div class="audiobot__album-cover" style="background-image:url(\'' + escHTML(albumCover) + '\')"></div>' +
      '    <div class="audiobot__album-info">' +
      '      <div class="audiobot__album-kind">' + (kind === 'playlist' ? 'Плейлист' : 'Альбом') + '</div>' +
      '      <div class="audiobot__title">' + escHTML(albumTitle) + '</div>' +
      '      <div class="audiobot__album-artist">' + escHTML(albumArtist) + '</div>' +
      '      <div class="audiobot__album-actions">' +
      '        <button class="audiobot__btn selector" data-action="play-all">▶ Слушать всё</button>' +
      '        <button class="audiobot__btn selector" data-action="shuffle-all">🔀 Перемешать</button>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '  <div class="audiobot__status" style="display:none"></div>' +
      '  <div class="audiobot__list scroll" data-mask="true"></div>' +
      '</div>'
    );

    var $list = html.find('.audiobot__list');
    var $status = html.find('.audiobot__status');
    var lastTracks = [];
    var changeListener = null;
    var bookmarkListener = null;

    function showStatus(msg, isError) {
      if (!msg) return $status.hide();
      $status.text(msg).css('color', isError ? '#ff7878' : 'rgba(255,255,255,.65)').show();
    }

    function load() {
      showStatus('Загрузка альбома…');
      Promise.all([
        Bookmarks.refresh(),
        api('/audiobot/album/' + encodeURIComponent(kind) + '/' + encodeURIComponent(albumID)),
      ]).then(function (results) {
        var r = results[1] || {};
        showStatus('');
        lastTracks = r.tracks || [];
        // Refine the header from server-resolved metadata if we had only a
        // partial preview (e.g. user opened the album from a deep link).
        if (r.title) html.find('.audiobot__title').text(r.title);
        if (r.cover) html.find('.audiobot__album-cover').css('background-image', "url('" + r.cover + "')");
        renderTrackList($list, lastTracks);
        highlightActiveCards($list);
        if (window.Lampa && Lampa.Controller) {
          Lampa.Controller.collectionSet(html);
          Lampa.Controller.collectionFocus(false, html);
        }
      }).catch(function (e) {
        showStatus('Не удалось загрузить альбом: ' + e.message, true);
      });
    }

    html.find('[data-action="play-all"]').on('hover:enter click', function () {
      if (lastTracks.length) Player.enqueue(lastTracks, 0);
    });
    html.find('[data-action="shuffle-all"]').on('hover:enter click', function () {
      if (!lastTracks.length) return;
      // Force shuffle on for this batch — toggle if it was off.
      if (!Player.getShuffle()) Player.toggleShuffle();
      Player.enqueue(lastTracks, 0);
    });

    this.create = function () { return this.render(); };

    this.start = function () {
      if (window.Lampa && Lampa.Controller) {
        Lampa.Controller.add('content', {
          toggle: function () {
            Lampa.Controller.collectionSet(html);
            Lampa.Controller.collectionFocus(false, html);
          },
          left: function () { Lampa.Controller.toggle('menu'); },
          up: function () { if (window.Navigator) Navigator.move('up'); },
          down: function () { if (window.Navigator) Navigator.move('down'); },
          right: function () { if (window.Navigator) Navigator.move('right'); },
          back: function () { Lampa.Activity.backward(); },
        });
        Lampa.Controller.toggle('content');
      }
      load();
      changeListener = function () { highlightActiveCards($list); };
      Player.onChange(changeListener);
      bookmarkListener = function () { refreshStarsIn($list); };
      Bookmarks.onChange(bookmarkListener);
    };

    this.render = function () { return html; };
    this.back = function () { if (window.Lampa && Lampa.Activity) Lampa.Activity.backward(); };
    this.pause = function () {};
    this.stop = function () {};
    this.destroy = function () {
      if (changeListener) Player.offChange(changeListener);
      if (bookmarkListener) Bookmarks.offChange(bookmarkListener);
      html.remove();
      $list = $status = null;
    };
  }

  // ---------------------------------------------------------------------
  // Styles
  // ---------------------------------------------------------------------
  var css =
    '.audiobot{padding:1.5em;color:#fff}' +
    '.audiobot__head{display:flex;gap:.6em;margin-bottom:1em;flex-wrap:wrap;align-items:center}' +
    '.audiobot__btn{background:#3a76d4;color:#fff;border:none;padding:.6em 1.2em;border-radius:.4em;cursor:pointer;font-size:1em}' +
    '.audiobot__btn.focus{background:#5e91e0}' +
    '.audiobot__btn--search{flex:1;min-width:240px;display:flex;align-items:center;gap:.5em;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);text-align:left;justify-content:flex-start}' +
    '.audiobot__btn--search.focus{background:rgba(58,118,212,.25);border-color:#3a76d4}' +
    '.audiobot__btn-icon{flex-shrink:0;opacity:.7}' +
    '.audiobot__btn-label{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.audiobot__btn-label--placeholder{color:rgba(255,255,255,.55)}' +
    '.audiobot__status{padding:.5em 1em;background:rgba(255,255,255,.06);border-radius:.3em;margin-bottom:.8em;font-size:.92em;word-break:break-all}' +
    '.audiobot__list{display:flex;flex-direction:column;gap:.4em;max-height:60vh;overflow-y:auto;padding-bottom:6em}' +
    '.audiobot-card{display:flex;align-items:center;gap:1em;padding:.6em;background:rgba(255,255,255,.04);border-radius:.4em;border:1px solid transparent;transition:border-color .15s,background .15s;cursor:pointer}' +
    '.audiobot-card.focus{border-color:#3a76d4;background:rgba(58,118,212,.18)}' +
    '.audiobot-card--playing{border-color:#39c46a;background:rgba(57,196,106,.12)}' +
    '.audiobot-card__cover{width:54px;height:54px;background:#222 center/cover no-repeat;border-radius:.3em;flex-shrink:0}' +
    '.audiobot-card__info{flex:1;min-width:0;overflow:hidden}' +
    '.audiobot-card__title{font-size:1em;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.audiobot-card__artist{font-size:.85em;color:rgba(255,255,255,.65);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.audiobot-card__artist-link{cursor:pointer;padding:0 4px;border-radius:.2em;border-bottom:1px dashed rgba(255,255,255,.35)}' +
    '.audiobot-card__artist-link.focus{color:#9bc1ff;border-bottom-color:#3a76d4}' +
    '.audiobot__title{font-size:1.4em;font-weight:700}' +
    '.audiobot-card__duration{font-size:.85em;color:rgba(255,255,255,.55);font-family:monospace}' +
    '.audiobot-card__star{background:none;border:1px solid transparent;color:rgba(255,255,255,.4);font-size:1.3em;width:36px;height:36px;border-radius:.3em;cursor:pointer;flex-shrink:0;line-height:1}' +
    '.audiobot-card__star:hover{color:#ffd866}' +
    '.audiobot-card__star--on{color:#ffd866}' +
    '.audiobot-card__star.focus{border-color:#ffd866;background:rgba(255,216,102,.1)}' +
    '.audiobot-empty{text-align:center;padding:3em 1em;color:rgba(255,255,255,.55)}' +
    /* Floating player (in body, persists across activities) */
    '.audiobot-fp{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:linear-gradient(0deg,rgba(0,0,0,.92),rgba(20,20,28,.88));backdrop-filter:blur(14px);border-top:1px solid rgba(255,255,255,.1);color:#fff;display:flex;align-items:center;gap:1em;padding:.7em 1.2em;box-shadow:0 -8px 24px rgba(0,0,0,.5);animation:audiobot-fp-in .25s ease}' +
    '@keyframes audiobot-fp-in{from{transform:translateY(100%)}to{transform:translateY(0)}}' +
    '.audiobot-fp__cover{width:44px;height:44px;background:#222 center/cover no-repeat;border-radius:.3em;flex-shrink:0}' +
    '.audiobot-fp__main{flex:1;min-width:0}' +
    '.audiobot-fp__meta{cursor:pointer;padding:2px 6px;margin:-2px -6px;border-radius:.3em;border:1px solid transparent}' +
    '.audiobot-fp__meta.focus{border-color:#3a76d4;background:rgba(58,118,212,.15)}' +
    '.audiobot-fp__title{font-size:.95em;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.audiobot-fp__artist{font-size:.8em;color:rgba(255,255,255,.65);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.audiobot-fp__times{display:flex;align-items:center;gap:.6em;margin-top:6px}' +
    '.audiobot-fp__t-cur,.audiobot-fp__t-tot{font-size:.75em;color:rgba(255,255,255,.6);font-family:monospace;min-width:34px}' +
    '.audiobot-fp__t-tot{text-align:right}' +
    '.audiobot-fp__progress{position:relative;flex:1;height:6px;background:rgba(255,255,255,.1);border-radius:3px;overflow:visible;cursor:pointer;border:1px solid transparent}' +
    '.audiobot-fp__progress.focus{border-color:#3a76d4;box-shadow:0 0 0 2px rgba(58,118,212,.25)}' +
    '.audiobot-fp__progress-fill{height:100%;background:#3a76d4;width:0;border-radius:3px;transition:width .15s linear}' +
    '.audiobot-fp__progress-thumb{position:absolute;top:50%;left:0;width:12px;height:12px;background:#3a76d4;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 4px rgba(0,0,0,.6);pointer-events:none}' +
    '.audiobot-fp__ctrls{display:flex;align-items:center;gap:.3em;flex-shrink:0}' +
    '.audiobot-fp__btn{background:rgba(255,255,255,.08);border:1px solid transparent;color:#fff;font-size:1.1em;padding:.4em .7em;border-radius:.3em;cursor:pointer;min-width:38px}' +
    '.audiobot-fp__btn.focus{border-color:#3a76d4;background:rgba(58,118,212,.25)}' +
    '.audiobot-fp__btn--on{background:rgba(58,118,212,.35);color:#fff}' +
    '.audiobot-fp__vol{display:flex;align-items:center;gap:.3em;padding:.3em .5em;border-radius:.3em;border:1px solid transparent;cursor:pointer;min-width:90px}' +
    '.audiobot-fp__vol.focus{border-color:#3a76d4;background:rgba(58,118,212,.18)}' +
    '.audiobot-fp__vol-icon{font-size:1em;flex-shrink:0}' +
    '.audiobot-fp__vol-track{flex:1;height:4px;background:rgba(255,255,255,.15);border-radius:2px;overflow:hidden}' +
    '.audiobot-fp__vol-fill{height:100%;background:#3a76d4;width:100%;transition:width .12s linear}' +
    /* Lyrics panel (drop-up over the floating player) */
    '.audiobot-lyrics{position:fixed;left:5vw;right:5vw;bottom:90px;max-height:55vh;z-index:9998;background:linear-gradient(180deg,rgba(20,22,32,.97),rgba(10,12,18,.97));backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.1);border-radius:.6em;display:flex;flex-direction:column;box-shadow:0 -10px 30px rgba(0,0,0,.55);animation:audiobot-fp-in .2s ease}' +
    '.audiobot-lyrics__head{padding:.7em 1.2em;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:baseline;gap:1em}' +
    '.audiobot-lyrics__title{font-size:1.05em;font-weight:600;color:#fff}' +
    '.audiobot-lyrics__source{font-size:.78em;color:rgba(255,255,255,.5)}' +
    '.audiobot-lyrics__body{flex:1;overflow-y:auto;padding:1em 1.5em 2em;text-align:center;color:rgba(255,255,255,.5);font-size:1.05em;line-height:1.6}' +
    '.audiobot-lyrics__line{padding:.18em 0;transition:color .25s,font-size .25s}' +
    '.audiobot-lyrics__line--active{color:#fff;font-weight:700;font-size:1.18em}' +
    '.audiobot-lyrics__line--plain{color:rgba(255,255,255,.78)}' +
    '.audiobot-lyrics__msg{padding:2em 1em;color:rgba(255,255,255,.5)}' +
    /* Albums chart block on Music activity */
    '.audiobot__albums{margin-bottom:1em}' +
    '.audiobot__albums-title{font-size:.95em;color:rgba(255,255,255,.7);margin:.4em 0 .6em}' +
    '.audiobot__albums-grid{display:flex;gap:.6em;overflow-x:auto;padding-bottom:.4em}' +
    '.audiobot-album{flex:0 0 200px;background:rgba(255,255,255,.04);border:1px solid transparent;border-radius:.5em;overflow:hidden;cursor:pointer;transition:border-color .15s,background .15s}' +
    '.audiobot-album.focus{border-color:#3a76d4;background:rgba(58,118,212,.18)}' +
    '.audiobot-album__cover{width:100%;height:100px;background:#222 center/cover no-repeat}' +
    '.audiobot-album__info{padding:.5em .7em}' +
    '.audiobot-album__title{font-size:.92em;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.audiobot-album__artist{font-size:.78em;color:rgba(255,255,255,.6);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:.1em}' +
    /* Album activity header */
    '.audiobot__album-head{display:flex;gap:1.4em;margin-bottom:1.2em;align-items:center}' +
    '.audiobot__album-cover{width:160px;height:160px;background:#222 center/cover no-repeat;border-radius:.5em;flex-shrink:0}' +
    '.audiobot__album-info{flex:1;min-width:0}' +
    '.audiobot__album-kind{font-size:.78em;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.06em;margin-bottom:.3em}' +
    '.audiobot__album-artist{font-size:1em;color:rgba(255,255,255,.7);margin-top:.3em}' +
    '.audiobot__album-actions{display:flex;gap:.5em;margin-top:1em;flex-wrap:wrap}' +
    '.audiobot__btn--danger{background:#a23b3b}' +
    '.audiobot__btn--danger.focus{background:#c95151}';

  function injectStyle() {
    if (document.getElementById('audiobot-style')) return;
    var s = document.createElement('style');
    s.id = 'audiobot-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  // ---------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------
  function startPlugin() {
    if (!window.Lampa || !Lampa.Component || !Lampa.Activity) {
      return setTimeout(startPlugin, 300);
    }
    injectStyle();
    Lampa.Component.add('audiobot_music', MusicActivity);
    Lampa.Component.add('audiobot_artist', ArtistActivity);
    Lampa.Component.add('audiobot_bookmarks', BookmarksActivity);
    Lampa.Component.add('audiobot_history', HistoryActivity);
    Lampa.Component.add('audiobot_album', AlbumActivity);

    function addMenuItem() {
      try {
        if ($('.menu .menu__item[data-action="audiobot"]').length) return;
        var icon =
          '<svg height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg" fill="currentColor">' +
          '<path d="M12 3v9.55A4 4 0 1 0 14 16V7h4V3z"/></svg>';
        var item = $(
          '<li class="menu__item selector" data-action="audiobot">' +
          '  <div class="menu__ico">' + icon + '</div>' +
          '  <div class="menu__text">Музыка</div>' +
          '</li>'
        );
        item.on('hover:enter', jumpToMusic);
        $('.menu .menu__list').eq(0).append(item);
      } catch (e) {
        console.error('audiobot: addMenuItem failed', e);
      }
    }

    if (window.appready) addMenuItem();
    else if (Lampa.Listener) Lampa.Listener.follow('app', function (e) {
      if (e.type === 'ready') addMenuItem();
    });
    else setTimeout(addMenuItem, 1000);

    // Expose Player for debug + future B/C/D/F integration.
    window.audiobotPlayer = Player;
  }

  startPlugin();
})();
