// Plain-JS port of renderer.ts. Browser lifecycle for the baked black-hole
// pipeline, with types stripped and the React host removed.
//
// Adaptations for the portfolio (everything else is unchanged):
//   * `vgpu` is a static import - the whole bundle is already loaded lazily by
//     quote-visual.js, so a second dynamic import would buy nothing.
//   * `onError` lets the caller fall back to the moon instead of letting a
//     mid-flight GPU failure throw inside a requestAnimationFrame callback.

import * as vgpuApi from "vgpu";

import {
  createEffects,
  createTargets,
  destroyTargets,
  prewarm,
  renderChain,
  setBakeUniforms,
  setBindings,
  setPostUniforms,
  setShadeUniforms,
} from "./pipeline.js";
import { defaultHeroSettings, mobileHeroLayout } from "./settings.js";

const SCENE_YAW_TAU_S = 0.325;
const MAX_FRAME_DT_S = 0.1;
const TARGET_FPS = 60;
const FRAME_PACING_EPSILON_MS = 2;
const MIN_FRAME_INTERVAL_MS = 1000 / TARGET_FPS - FRAME_PACING_EPSILON_MS;
const MOBILE_QUERY = "(max-width: 767px)";

// Frame-time watchdog. Device specs are a poor proxy for "can this GPU carry 12
// fullscreen passes", so measure instead of guessing: if the median frame time
// stays worse than ~30fps across two consecutive windows, report it so the host
// can fall back. Two windows are required so one unrelated hitch (a late script,
// a layout pass) cannot demote a perfectly capable device.
const WATCHDOG_WARMUP_FRAMES = 45;
const WATCHDOG_WINDOW = 60;
const WATCHDOG_SLOW_FRAME_MS = 34;
const WATCHDOG_STRIKES = 2;

export function createRenderer({ canvas, onError, onSlow, interactionElement }) {
  const settings = defaultHeroSettings();
  const desktopLayout = {
    centerX: settings.centerX,
    centerY: settings.centerY,
    cameraRoll: settings.cameraRoll,
    mouseYaw: settings.mouseYaw,
    autoYaw: settings.autoYaw,
    centerFade: settings.centerFade,
    distance: settings.distance,
    fov: settings.fov,
  };
  const mobileQuery = window.matchMedia(MOBILE_QUERY);
  const applyResponsiveLayout = () => {
    Object.assign(
      settings,
      mobileQuery.matches ? mobileHeroLayout() : desktopLayout
    );
  };
  applyResponsiveLayout();
  const bloomScale = Math.min(Math.max(window.devicePixelRatio, 1), 2) / 2;
  settings.bloom.radius *= bloomScale;
  settings.bloom.strength *= bloomScale;

  let disposed = false;

  let api;
  let gpu;
  let surface;
  let effects;
  let targets;
  let loop;
  let observer;
  let intersection;
  let documentVisible = typeof document === "undefined" ? true : !document.hidden;
  let canvasIntersecting = true;

  let started = false;
  let animationTime = 0;
  let lastFrameAt;
  let resizeFrame = 0;
  let pendingSize;
  let forceBake = true;
  let pointerXNormalized = 0;
  let currentSceneYaw = 0;
  let lastYawAt;

  const onLayoutChange = () => {
    applyResponsiveLayout();
    forceBake = true;
  };
  mobileQuery.addEventListener("change", onLayoutChange);

  // Upstream tracked the pointer across the whole window because this was a
  // full-page hero. Here it is one card, so parallax is scoped to that element:
  // it only responds while the cursor is over the card, and eases back to
  // centre the moment it leaves.
  const pointerTarget = interactionElement || canvas;

  const onPointerMove = (event) => {
    if (event.pointerType !== "mouse") return;
    const rect = pointerTarget.getBoundingClientRect();
    if (rect.width <= 0) return;
    const offset = (event.clientX - rect.left) / rect.width;
    pointerXNormalized = Math.min(1, Math.max(-1, offset * 2 - 1));
  };

  const recenterPointer = () => {
    pointerXNormalized = 0;
  };
  const onVisibilityChange = () => {
    if (document.hidden) recenterPointer();
    documentVisible = !document.hidden;
    reconcileLoop();
  };

  function reconcileLoop() {
    if (!started || !gpu || !api) return;
    const shouldRun = !disposed && documentVisible && canvasIntersecting;
    if (shouldRun === Boolean(loop)) return;
    if (shouldRun) {
      lastFrameAt = undefined;
      lastYawAt = undefined;
      loop = startPacedLoop(api, gpu);
    } else {
      loop?.stop();
      loop = undefined;
    }
  }

  function startPacedLoop(vgpu, activeGpu) {
    let stopped = false;
    let lastPresentedAt;
    const tick = (timestamp) => {
      if (stopped) return;
      if (
        lastPresentedAt === undefined ||
        timestamp - lastPresentedAt >= MIN_FRAME_INTERVAL_MS
      ) {
        // Undefined on the first frame of a (re)started loop, so the gap while
        // the card was scrolled away is never counted as a slow frame.
        const previousPresentedAt = lastPresentedAt;
        lastPresentedAt = timestamp;
        try {
          vgpu.frame(activeGpu, renderFrame);
        } catch (error) {
          stopped = true;
          handleFailure(error);
          return;
        }
        if (previousPresentedAt !== undefined) {
          sampleFrameTime(timestamp - previousPresentedAt);
        }
      }
      if (!stopped) frameHandle = requestAnimationFrame(tick);
    };
    let frameHandle = requestAnimationFrame(tick);
    return {
      stop() {
        stopped = true;
        cancelAnimationFrame(frameHandle);
      },
    };
  }

  let watchdogWarmup = WATCHDOG_WARMUP_FRAMES;
  let watchdogSamples = [];
  let watchdogStrikes = 0;
  let watchdogFired = false;

  const sampleFrameTime = (deltaMs) => {
    if (!onSlow || watchdogFired) return;
    // Early frames include pipeline warmup and first-use texture uploads.
    if (watchdogWarmup > 0) {
      watchdogWarmup--;
      return;
    }
    watchdogSamples.push(deltaMs);
    if (watchdogSamples.length < WATCHDOG_WINDOW) return;

    // Median, not mean: one 400ms stall should not condemn the device.
    const sorted = watchdogSamples.slice().sort((a, b) => a - b);
    const median = sorted[sorted.length >> 1];
    watchdogSamples.length = 0;

    watchdogStrikes = median > WATCHDOG_SLOW_FRAME_MS ? watchdogStrikes + 1 : 0;
    if (watchdogStrikes < WATCHDOG_STRIKES) return;
    watchdogFired = true;
    onSlow(median);
  };

  const advanceAnimationTime = (now) => {
    animationTime +=
      lastFrameAt === undefined ? 0 : Math.max(0, (now - lastFrameAt) / 1000);
    lastFrameAt = now;
    return animationTime;
  };

  const renderFrame = (frame) => {
    if (disposed || !effects || !targets || !surface) return;
    const now = clockMs();
    const runBake = forceBake;
    forceBake = false;
    if (runBake) setBakeUniforms(effects, targets, settings);
    setShadeUniforms(
      effects,
      targets,
      settings,
      advanceAnimationTime(now),
      advanceSceneYaw(now)
    );
    renderChain(frame, effects, targets, surface, runBake);
  };

  const advanceSceneYaw = (now) => {
    // Touch devices never fire pointermove, so parallax alone leaves the camera
    // frozen. Drift it slowly through the same yaw the pointer would drive.
    if (settings.autoYaw > 0) {
      lastYawAt = now;
      const period = Math.max(1, settings.autoYawPeriod || 26);
      // Triangle wave rather than sin(). A sine's velocity is a cosine: it
      // stalls at each extreme and rushes through the middle, which reads as
      // "slow then fast". This ramps linearly, so the drift holds a single
      // constant angular speed the whole way across.
      const phase = (animationTime / period + 0.25) % 1;
      currentSceneYaw = (1 - Math.abs(4 * phase - 2)) * settings.autoYaw;
      return currentSceneYaw;
    }
    if (settings.mouseYaw <= 0) {
      currentSceneYaw = 0;
      lastYawAt = now;
      return 0;
    }
    const dt =
      lastYawAt === undefined
        ? 0
        : Math.min(Math.max((now - lastYawAt) / 1000, 0), MAX_FRAME_DT_S);
    lastYawAt = now;
    const target = pointerXNormalized * Math.max(0, settings.mouseYaw);
    currentSceneYaw +=
      (target - currentSceneYaw) * (1 - Math.exp(-dt / SCENE_YAW_TAU_S));
    return currentSceneYaw;
  };

  const applyResize = () => {
    resizeFrame = 0;
    const size = pendingSize;
    pendingSize = undefined;
    if (disposed || !size || !gpu || !api || !effects || !targets || !surface)
      return;
    try {
      const previousTargets = targets;
      const nextTargets = createTargets(api, gpu, [
        Math.max(1, Math.round(size.width)),
        Math.max(1, Math.round(size.height)),
      ]);
      try {
        setBindings(effects, nextTargets);
        setPostUniforms(effects, nextTargets, settings);
      } catch (error) {
        destroyTargets(nextTargets);
        throw error;
      }
      targets = nextTargets;
      destroyTargets(previousTargets);
      forceBake = true;
    } catch (error) {
      handleFailure(error);
    }
  };

  const resize = (size) => {
    if (disposed || size.width <= 0 || size.height <= 0) return;
    pendingSize = size;
    if (!resizeFrame) resizeFrame = requestAnimationFrame(applyResize);
  };

  const measure = () => {
    resize({ width: canvas.clientWidth, height: canvas.clientHeight });
  };

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    loop?.stop();
    loop = undefined;
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    observer?.disconnect();
    intersection?.disconnect();
    if (typeof window !== "undefined") {
      mobileQuery.removeEventListener("change", onLayoutChange);
      pointerTarget.removeEventListener("pointermove", onPointerMove);
      pointerTarget.removeEventListener("pointerleave", recenterPointer);
      window.removeEventListener("blur", recenterPointer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    }
    gpu?.dispose();
  };

  const initialize = async () => {
    const vgpu = vgpuApi;
    const { init } = vgpu;
    if (disposed) return;
    const nextGpu = await init();
    if (disposed) {
      nextGpu.dispose();
      return;
    }
    gpu = nextGpu;
    api = vgpu;
    // premultiplied: the composite emits alpha so the card's themed background
    // shows through instead of a black rectangle.
    surface = vgpu.surface(gpu, canvas, { dpr: 1, alphaMode: "premultiplied" });
    effects = createEffects(vgpu, gpu);
    targets = createTargets(vgpu, gpu, surface.size);
    setBindings(effects, targets);
    setPostUniforms(effects, targets, settings);
    await prewarm(effects, targets, surface);
    if (disposed) return;
    observer =
      typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measure);
    observer?.observe(canvas);
    pointerTarget.addEventListener("pointermove", onPointerMove, { passive: true });
    pointerTarget.addEventListener("pointerleave", recenterPointer, { passive: true });
    window.addEventListener("blur", recenterPointer);
    document.addEventListener("visibilitychange", onVisibilityChange);
    if (typeof IntersectionObserver !== "undefined") {
      intersection = new IntersectionObserver(
        (entries) => {
          canvasIntersecting =
            entries[entries.length - 1]?.isIntersecting ?? canvasIntersecting;
          reconcileLoop();
        },
        { threshold: 0 }
      );
      intersection.observe(canvas);
    }
    measure();
    started = true;
    documentVisible = !document.hidden;
    reconcileLoop();
  };

  function handleFailure(error) {
    dispose();
    if (onError) {
      onError(error);
      return;
    }
    throw error;
  }

  const ready = initialize().catch((error) => {
    if (disposed) return;
    handleFailure(error);
    if (onError) return;
    throw error;
  });

  return { ready, dispose };
}

function clockMs() {
  return typeof performance === "undefined" ? Date.now() : performance.now();
}
