# Web player optional assets

The Lampac web player (Svelte) looks for several optional assets in this
directory. Without them, the player falls back to synthetic substitutes —
everything keeps working, but audio fidelity / codec coverage is reduced.

Drop real files here to upgrade quality.

---

## `hrtf-irc.wav` — HRTF impulse response

**Purpose:** virtual surround for headphones. Fetched lazily when the
user enables *Настройки → Объёмный звук в наушниках (HRTF)*.

**Fallback:** the player synthesizes a 5-source ITD+ILD impulse in
[`HRTFSurround.ts`](../../../../player/src/lib/engine/audio/HRTFSurround.ts)
when this file is missing. Perfectly usable, but not as convincing as a
measured HRIR.

**Recommended format:**
- 2 channels (stereo)
- 48 kHz (the browser's `AudioContext.sampleRate` is usually 48 kHz on
  desktop; 44.1 kHz also works — shaka uses `decodeAudioData` which
  resamples automatically)
- 16- or 24-bit PCM
- 80–200 ms long
- ≤ 200 KB

**Public-domain HRIR sources** you can convolve down to a single stereo
impulse:

- [MIT KEMAR](http://sound.media.mit.edu/resources/KEMAR.html) — free for
  research use, public domain
- [CIPIC HRTF Database](https://www.ece.ucdavis.edu/cipic/spatial-sound/hrtf-data/) —
  45 subjects, Creative Commons
- [SADIE II Database](https://www.york.ac.uk/sadie-project/database.html) —
  high-resolution, Creative Commons

A 60°-spread stereo mix of the `kemar/elev0/H0e{000,030,330}a.wav` files
gives a decent out-of-head effect in ~30 lines of sox.

---

## `dav1d.wasm` / `libde265.wasm` — software codec fallbacks

**Purpose:** decode AV1 / HEVC on browsers that don't support them
natively (e.g. older Firefox, some Smart TV browsers).

**Status:** SCAFFOLD ONLY. The current
[`WasmCodecLoader.ts`](../../../../player/src/lib/engine/codec/WasmCodecLoader.ts)
can fetch these files but does not yet wire them into a playback
pipeline — full integration would require a separate canvas-render path
bypassing shaka's MediaSource usage.

If you're experimenting: drop a `dav1d.wasm` built via
[`dav1d-wasm`](https://github.com/gpac/node-dav1d-wasm) here; the loader
logs its byte size to the console when the player starts with
`enableWasmCodecs` turned on.
