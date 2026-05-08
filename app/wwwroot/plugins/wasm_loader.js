/*!
 * lampac-go WASM client runtime
 *
 * Loads every "client" / "both" plugin advertised by /wasm/index.json,
 * instantiates each .wasm with a small JS-bridge that exposes Lampa's
 * runtime APIs (Storage, Activity, Listener, Noty, …), and lets the guest
 * register lifecycle hooks via `lampac_export_*` functions.
 *
 * Plugin contract (host imports — module name "lampac_client"):
 *
 *   host_log(level, ptr, len)              same as server-side
 *   host_storage_get(key_ptr,key_len) → packed (ptr,len) of UTF-8 value
 *   host_storage_set(key_ptr,key_len, val_ptr, val_len)
 *   host_listener_emit(event_ptr,event_len, data_ptr,data_len)
 *   host_noty(msg_ptr,msg_len)             toast notification
 *   host_activity_push(json_ptr,json_len)  push a Lampa.Activity
 *
 * Plugin guest exports:
 *
 *   alloc(size)            // host writes here
 *   abi_version()
 *   on_load()              // called once after instantiate
 *   on_event(...)          // optional; receives Lampa events the host forwards
 */
(function () {
    if (typeof Lampa === 'undefined') return;
    if (window.__lampacWasmLoaderRan) return;
    window.__lampacWasmLoaderRan = true;

    var BASE = (function () {
        // Try to inherit the lampac host from the same origin Lampa was loaded
        // from. Falls back to "" (relative) which works for inline pages.
        try {
            var s = document.querySelector('script[src*="/lampainit.js"]');
            if (s && s.src) {
                var u = new URL(s.src);
                return u.protocol + '//' + u.host;
            }
        } catch (_) {}
        return '';
    })();

    function log(level, msg) {
        if (typeof console === 'undefined') return;
        var lvl = ['debug', 'info', 'warn', 'error'][level] || 'info';
        try { console[lvl]('[wasm-loader]', msg); } catch (_) {}
    }

    function readString(memory, ptr, len) {
        if (!ptr || !len) return '';
        return new TextDecoder('utf-8').decode(new Uint8Array(memory.buffer, ptr, len));
    }

    function packPtrLen(ptr, len) {
        // JS BigInt because we can't use 64-bit ints natively. Wazero's i64
        // result becomes BigInt on the JS side too — we mirror that.
        return (BigInt(ptr) << 32n) | BigInt(len);
    }

    // Build a closure-bound runtime per plugin. Each plugin sees its own
    // host imports so plugin A can't read plugin B's storage namespace.
    function makeImports(plugin) {
        var memCache = { mem: null };
        var allocFn = null; // populated after instantiate
        var ns = 'wasm_plugin_' + plugin.id;

        function writeBack(bytes) {
            if (!bytes || !bytes.length) return 0n;
            if (!allocFn || !memCache.mem) return 0n;
            var ptr = allocFn(bytes.length);
            new Uint8Array(memCache.mem.buffer, ptr, bytes.length).set(bytes);
            return packPtrLen(ptr, bytes.length);
        }

        var lampac_client = {
            host_log: function (level, ptr, len) {
                log(level, '[' + plugin.id + '] ' + readString(memCache.mem, ptr, len));
            },
            host_storage_get: function (keyPtr, keyLen) {
                var key = readString(memCache.mem, keyPtr, keyLen);
                var v;
                try { v = Lampa.Storage.get(ns + ':' + key, ''); } catch (_) { v = ''; }
                if (typeof v !== 'string') v = JSON.stringify(v);
                if (!v) return 0n;
                return writeBack(new TextEncoder().encode(v));
            },
            host_storage_set: function (keyPtr, keyLen, valPtr, valLen) {
                var key = readString(memCache.mem, keyPtr, keyLen);
                var val = readString(memCache.mem, valPtr, valLen);
                try { Lampa.Storage.set(ns + ':' + key, val); } catch (_) {}
            },
            host_listener_emit: function (evPtr, evLen, dPtr, dLen) {
                var event = readString(memCache.mem, evPtr, evLen);
                var data = readString(memCache.mem, dPtr, dLen);
                var parsed = data;
                try { parsed = JSON.parse(data); } catch (_) {}
                try { Lampa.Listener.send(event, parsed); } catch (_) {}
            },
            host_noty: function (mPtr, mLen) {
                var msg = readString(memCache.mem, mPtr, mLen);
                try { Lampa.Noty.show(msg); } catch (_) {}
            },
            host_activity_push: function (jPtr, jLen) {
                var raw = readString(memCache.mem, jPtr, jLen);
                try { Lampa.Activity.push(JSON.parse(raw)); } catch (e) { log(2, 'activity_push parse: ' + e); }
            }
        };

        return {
            imports: { lampac_client: lampac_client },
            attach: function (instance) {
                memCache.mem = instance.exports.memory;
                allocFn = instance.exports.alloc;
            }
        };
    }

    function makeWasi() {
        // Minimal WASI shim — TinyGo's `-target wasi` plugins call a few of
        // these even when they don't really use them. We reject everything
        // by default and fulfil only what's been observed in real plugins.
        var noop = function () { return 0; };
        var unsupported = function () { return 52; }; // ENOSYS
        return {
            wasi_snapshot_preview1: {
                proc_exit: function (code) {
                    log(2, 'wasi exit code=' + code);
                },
                fd_write: function (fd, iovsPtr, iovsLen, nwrittenPtr) {
                    return 0; // pretend success; host_log handles real output
                },
                fd_close: noop,
                fd_seek: function () { return 70; }, // ESPIPE
                fd_fdstat_get: noop,
                fd_prestat_get: function () { return 8; }, // EBADF
                fd_prestat_dir_name: unsupported,
                environ_get: noop,
                environ_sizes_get: function (n, b) { return 0; },
                random_get: function (ptr, len) {
                    var view = new Uint8Array(plugin_memory && plugin_memory.buffer, ptr, len);
                    crypto.getRandomValues(view);
                    return 0;
                },
                clock_time_get: function (id, prec, ptrPtr) { return 0; },
                args_get: noop,
                args_sizes_get: function () { return 0; },
                path_open: unsupported,
                path_filestat_get: unsupported,
                fd_read: unsupported,
                poll_oneoff: unsupported
            }
        };
    }

    function loadPlugin(plugin) {
        var url = BASE + plugin.wasm_url;
        var bridge = makeImports(plugin);
        var wasi = makeWasi();
        var imports = Object.assign({}, wasi, bridge.imports);

        return fetch(url)
            .then(function (r) {
                if (!r.ok) throw new Error('fetch ' + url + ' → ' + r.status);
                return WebAssembly.instantiateStreaming
                    ? WebAssembly.instantiateStreaming(r, imports)
                    : r.arrayBuffer().then(function (buf) { return WebAssembly.instantiate(buf, imports); });
            })
            .then(function (mod) {
                var inst = mod.instance;
                bridge.attach(inst);
                if (typeof inst.exports._initialize === 'function') {
                    try { inst.exports._initialize(); } catch (e) { log(3, plugin.id + ' _initialize: ' + e); }
                }
                if (typeof inst.exports.on_load === 'function') {
                    try { inst.exports.on_load(); } catch (e) { log(3, plugin.id + ' on_load: ' + e); }
                }
                log(1, 'loaded ' + plugin.id + ' (' + plugin.version + ')');

                // Hook up event forwarding only if guest opted in.
                if (typeof inst.exports.on_event === 'function' && Lampa && Lampa.Listener) {
                    Lampa.Listener.follow('full', function (e) {
                        try {
                            var enc = new TextEncoder().encode(JSON.stringify({ type: e.type, data: e }));
                            var ptr = inst.exports.alloc(enc.length);
                            new Uint8Array(inst.exports.memory.buffer, ptr, enc.length).set(enc);
                            inst.exports.on_event(ptr, enc.length);
                        } catch (_) {}
                    });
                }
            })
            .catch(function (e) { log(3, plugin.id + ': ' + e.message); });
    }

    function bootstrap() {
        fetch(BASE + '/wasm/index.json', { credentials: 'omit' })
            .then(function (r) { return r.ok ? r.json() : { plugins: [] }; })
            .then(function (j) {
                var plugins = (j && j.plugins) || [];
                plugins.forEach(loadPlugin);
            })
            .catch(function () {});
    }

    if (Lampa && Lampa.Listener && Lampa.Listener.send) {
        // Run after Lampa fully boots so Storage/Listener/etc. are ready.
        if (typeof Lampa.Listener.follow === 'function') {
            Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') bootstrap(); });
        } else {
            bootstrap();
        }
    } else {
        // Older Lampa without Listener — just go.
        bootstrap();
    }
})();
