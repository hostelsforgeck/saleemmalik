// ===== QUOTE CARD VISUAL =====
//
// Picks what renders behind the QUOTE card, and loads ONLY that visual.
// Neither is eager: three.js/TweenMax/moon.webp (~783KB) are fetched only on
// the moon path, and the WebGPU bundle (~72KB gzipped) only on the black-hole
// path.
//
// Selection happens in three stages, cheapest first:
//   1. hard gates      - no WebGPU at all
//   2. adapter probe   - a real, non-software GPU must exist
//   3. frame watchdog  - the renderer measures itself and demotes if it cannot
//                        hold ~30fps, the only honest test of whether a device
//                        is "black-hole good"
//
// Debugging: append ?quote-visual=blackhole (or =moon, or =reset to clear a
// cached demotion). The decision and its reason are on window.__quoteVisual.
const QUOTE_VISUAL_CONFIG = {
  // 'auto'      - decide per device (default)
  // 'blackhole' - force the WebGPU black hole
  // 'moon'      - force the three.js moon
  mode: 'auto',

  // Cache MEASURED demotions only (see rememberDemotion).
  remember: true
};

(function () {
  const container = document.getElementById('moon-canvas');
  if (!container) return;

  // v3: ONLY the frame watchdog may write here - a real, measured result.
  //
  // History, because both earlier versions caused the same visible bug:
  //   v1 cached the cheap capability probe forever, pinning devices to the moon
  //      long after the selection rules changed.
  //   v2 stopped caching the probe, but still cached renderer start-up errors.
  //      A start-up error is just as likely to be a JS bug as a weak GPU, so a
  //      single transient exception pinned the device to the moon for a week.
  // Bumping the key also discards any bogus entries written by v1/v2.
  const STORAGE_KEY = 'quote-visual:v3';
  const REMEMBER_TTL_MS = 7 * 24 * 60 * 60 * 1000; // re-test after a week
  const ADAPTER_PROBE_TIMEOUT_MS = 2000;

  const THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/99/three.min.js';
  const TWEEN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/2.0.2/TweenMax.min.js';

  // Injected <script src> resolves against the DOCUMENT url...
  const MOON_URL = './assets/js/index/moon.js';

  // ...but dynamic import() inside an external classic script resolves against
  // THIS SCRIPT's url, not the document's. Build an absolute url from the
  // script's own src so the sibling bundle is found from any page depth.
  const scriptSrc = document.currentScript && document.currentScript.src;
  const BLACKHOLE_URL = scriptSrc
    ? scriptSrc.replace(/[^/?#]*(?:[?#].*)?$/, 'blackhole.bundle.js')
    : './blackhole.bundle.js';

  let settled = false; // whichever visual wins, only one may start

  // ---------------------------------------------------------------- storage

  function clearRemembered() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) { /* nothing to clear */ }
  }

  // Only a demotion is ever stored, and only for a week. The capability probe
  // is cheap and its answer can change (driver update, browser flag, new
  // hardware), so it is re-run on every load rather than cached.
  function readRememberedDemotion() {
    if (!QUOTE_VISUAL_CONFIG.remember) return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const entry = JSON.parse(raw);
      if (!entry || entry.mode !== 'moon') return null;
      if (!entry.at || Date.now() - entry.at > REMEMBER_TTL_MS) {
        clearRemembered();
        return null;
      }
      return entry;
    } catch (error) {
      return null; // private mode, or unparseable - just re-decide
    }
  }

  function rememberDemotion(reason) {
    if (!QUOTE_VISUAL_CONFIG.remember) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ mode: 'moon', at: Date.now(), reason: reason })
      );
    } catch (error) { /* not fatal - simply re-decided next load */ }
  }


  function urlOverride() {
    try {
      const value = new URLSearchParams(window.location.search).get('quote-visual');
      if (value === 'reset') {
        clearRemembered();
        return null;
      }
      return value === 'moon' || value === 'blackhole' ? value : null;
    } catch (error) {
      return null;
    }
  }

  // ------------------------------------------------------------ moon path

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      const el = document.createElement('script');
      el.src = src;
      el.async = false; // preserve execution order across sequential injections
      el.onload = resolve;
      el.onerror = function () {
        reject(new Error('Failed to load ' + src));
      };
      document.head.appendChild(el);
    });
  }

  function startMoon() {
    if (settled) return Promise.resolve();
    settled = true;
    container.classList.remove('quote-visual--blackhole');
    const stars = document.getElementById('stars');
    if (stars) {
      stars.style.display = '';
      // createStars() in index.html skips itself while the black hole owns the
      // card, so on a demotion the container can still be empty. Rebuild it -
      // the class is already removed above, so it will not skip this time.
      if (!stars.childElementCount && typeof window.createStars === 'function') {
        window.createStars();
      }
    }
    return loadScript(THREE_URL)
      .then(function () { return loadScript(TWEEN_URL); })
      .then(function () { return loadScript(MOON_URL); });
  }

  // ------------------------------------------------------- black-hole path

  function startBlackHole() {
    if (settled) return Promise.resolve();
    settled = true;

    // The black hole fills the card edge to edge, so it opts out of the
    // moon's 1.7x scale, float animation and glow overlay.
    container.classList.add('quote-visual--blackhole');

    // The renderer draws its own starfield, so the card's twinkling DOM stars
    // would double up - and they are visible through the transparent canvas.
    const stars = document.getElementById('stars');
    if (stars) stars.style.display = 'none';

    // Parallax follows the cursor only within the card. The container itself is
    // pointer-events:none, so the card is what actually receives the events.
    const card = container.closest('.newsletter-card') || container;

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const cleanup = function () {
      canvas.remove();
      container.classList.remove('quote-visual--blackhole');
      if (stars) stars.style.display = '';
    };

    let renderer;

    // Fired by the renderer's own frame-time watchdog: this device has WebGPU
    // but cannot actually drive the pipeline. This IS a measured result, so it
    // is worth remembering.
    const handleSlow = function (medianMs) {
      const reason = 'measured ' + medianMs.toFixed(1) + 'ms/frame';
      console.warn('[quote-visual] ' + reason + '; switching to the moon.');
      rememberDemotion(reason);
      if (renderer) renderer.dispose();
      cleanup();
      settled = false;
      startMoon();
    };

    return import(BLACKHOLE_URL)
      .then(function (mod) {
        return new Promise(function (resolve, reject) {
          renderer = mod.createRenderer({
            canvas: canvas,
            interactionElement: card,
            onError: reject,
            onSlow: handleSlow
          });
          renderer.ready.then(function () { resolve(renderer); }, reject);
        });
      })
      .catch(function (error) {
        cleanup();
        settled = false;
        throw error;
      });
  }

  // -------------------------------------------------------------- selection

  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise(function (_, reject) {
        setTimeout(function () { reject(new Error('probe timed out')); }, ms);
      })
    ]);
  }

  function detectCapableVisual() {
    if (!navigator.gpu) {
      return Promise.resolve({ choice: 'moon', reason: 'no navigator.gpu' });
    }

    // Coarse device-class gates. Deliberately conservative: these only catch
    // clearly underpowered hardware, because specs predict shader throughput
    // badly. The real test is the frame watchdog once it is running.
    if (navigator.deviceMemory && navigator.deviceMemory < 2) {
      return Promise.resolve({ choice: 'moon', reason: 'deviceMemory < 2GB' });
    }
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
      return Promise.resolve({ choice: 'moon', reason: '<= 2 CPU cores' });
    }

    // NOTE: connection.saveData / effectiveType are deliberately NOT used to
    // pick the moon. The black hole is ~10x SMALLER over the wire (72KB vs
    // 783KB), so demoting on a slow or metered connection would be backwards.

    // A software/fallback adapter can technically run WebGPU but would crawl
    // through 12 fullscreen passes.
    return withTimeout(
      navigator.gpu.requestAdapter({ powerPreference: 'high-performance' }),
      ADAPTER_PROBE_TIMEOUT_MS
    )
      .then(function (adapter) {
        if (!adapter) return { choice: 'moon', reason: 'no GPU adapter' };
        if (adapter.isFallbackAdapter) {
          return { choice: 'moon', reason: 'software fallback adapter' };
        }
        return { choice: 'blackhole', reason: 'capable GPU' };
      })
      .catch(function (error) {
        return { choice: 'moon', reason: 'adapter probe failed: ' + error.message };
      });
  }

  function run(choice, reason) {
    window.__quoteVisual = { choice: choice, reason: reason };
    if (choice === 'moon') {
      // Surfaced deliberately: "why am I not seeing the black hole" should be
      // answerable from the console without reading this file.
      console.info('[quote-visual] moon - ' + reason);
      return startMoon();
    }
    return startBlackHole().catch(function (error) {
      const why = 'renderer failed to start: ' + error.message;
      // Deliberately NOT remembered. A start-up failure is as likely to be a
      // code bug as a device limitation, and caching it would outlive the fix.
      // Retrying costs one failed dynamic import per load, and it self-heals.
      console.warn('[quote-visual] ' + why + '; using moon (not cached).');
      window.__quoteVisual = { choice: 'moon', reason: why };
      startMoon();
    });
  }

  const override = urlOverride();
  const forced = override || QUOTE_VISUAL_CONFIG.mode;
  if (forced === 'moon' || forced === 'blackhole') {
    run(forced, override ? 'forced via ?quote-visual' : 'forced via config');
    return;
  }

  const demotion = readRememberedDemotion();
  if (demotion) {
    run('moon', 'remembered demotion (' + demotion.reason + ')');
    return;
  }

  detectCapableVisual().then(function (result) {
    run(result.choice, result.reason);
  });
})();
