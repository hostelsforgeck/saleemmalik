// Plain-JS port of settings.ts (interfaces stripped, values unchanged).

/**
 * Overrides applied when the mobile media query matches. Single source of truth
 * so the headless preview and the page agree.
 *
 * PORTFOLIO CHANGE: the framing is deliberately IDENTICAL to desktop. centerX,
 * centerY, cameraRoll, distance and fov are all inherited from
 * defaultHeroSettings(), so the black hole sits off the right edge and cropped,
 * exactly as it does on a wide screen.
 *
 * Two upstream mobile behaviours are dropped on purpose:
 *   - it recentred the ring (centerX/centerY 0), which put it under the quote copy;
 *   - it set centerFade 1, and centeredCopyFade() returns 0 at the vertical
 *     centre, so on a 250px-tall card that blanked the ring itself.
 *
 * Only the input model differs: touch devices never fire pointermove, so the
 * pointer parallax is swapped for a slow autonomous drift.
 */
export function mobileHeroLayout() {
  return {
    mouseYaw: 0,
    // 0.16 rad over a 40s period = ~0.9 deg/s, about a third of the previous
    // rate. The stars take the full sweep (they are at infinity) while the hole
    // sits on the rotation axis, so this rate is set by how fast the starfield
    // should drift, not by how far the hole moves.
    autoYaw: 0.16,
  };
}

/** Shared deterministic production defaults for the browser renderer. */
export function defaultHeroSettings() {
  return {
    cameraY: 0.16,
    distance: 13.5,
    diskRadius: 9,
    fov: 3,
    centerX: 0.8,
    centerY: 0.3,
    cameraRoll: -0.27,
    mouseYaw: 0.15,
    // Autonomous camera drift, used where there is no cursor. 0 = pointer only.
    // Constant angular speed works out to autoYaw * 4 / autoYawPeriod rad/s -
    // that rate is what the background stars sweep at, so keep it low.
    autoYaw: 0,
    autoYawPeriod: 40,
    centerFade: 0,
    bloom: { strength: 1, threshold: 0, knee: 0.18, radius: 1.5 },
    disk: {
      brightness: 0.75,
      speed: 0.75,
      stretch: 5.75,
      detail: 3.44,
      turbulence: 4.46,
      density: 1.38,
      doppler: 1.21,
      cloudScale: 20,
      cloudSpeed: 0.3,
      cloudStrength: 0.2,
      spare0: 0.43,
      spare1: -0.25,
      spare2: -0.67,
      spare3: 0.69,
    },
    stars: { brightness: 1, density: 1, contrast: 13, warmth: 0.5, twinkle: 0 },
  };
}
