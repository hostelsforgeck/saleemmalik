// Headless verification: builds the exact same effects/targets/render chain the
// browser uses (pipeline.js + settings.js + the generated WGSL) and renders one
// frame to a PNG. Proves the flattened shaders compile and every binding is set.
//
//   node verify-render.mjs

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import * as vgpu from "vgpu/node";

import {
  createEffects,
  createTargets,
  prewarm,
  renderChain,
  setBakeUniforms,
  setBindings,
  setPostUniforms,
  setShadeUniforms,
} from "./pipeline.js";
import { defaultHeroSettings, mobileHeroLayout } from "./settings.js";

// node verify-render.mjs [width] [height] [mobile]
const WIDTH = Number(process.argv[2]) || 640;
const HEIGHT = Number(process.argv[3]) || 360;
const MOBILE = process.argv[4] === "mobile";

const gpu = await vgpu.init();
try {
  const settings = defaultHeroSettings();
  if (MOBILE) {
    // Mirror the mobile branch in renderer.js so the preview matches the page.
    Object.assign(settings, mobileHeroLayout());
  }
  console.log(`preset      : ${MOBILE ? "mobile" : "desktop"}`);
  const effects = createEffects(vgpu, gpu);
  const targets = createTargets(vgpu, gpu, [WIDTH, HEIGHT]);
  const output = vgpu.target(gpu, { size: [WIDTH, HEIGHT] });

  setBindings(effects, targets);
  setPostUniforms(effects, targets, settings);
  await prewarm(effects, targets, output);

  setBakeUniforms(effects, targets, settings);
  // 5th arg: scene yaw, so the autoYaw drift extremes can be checked for clipping.
  const sceneYaw = Number(process.argv[5]) || 0;
  console.log(`sceneYaw    : ${sceneYaw}`);
  setShadeUniforms(effects, targets, settings, 2.0, sceneYaw);

  vgpu.frame(gpu, (frame) => renderChain(frame, effects, targets, output, true));

  const pixels = await output.read();

  // Summarise the frame so the check is objective, not just "it didn't throw".
  let lit = 0;
  let max = 0;
  let minAlpha = 255;
  let maxAlpha = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const luma = Math.max(pixels[i], pixels[i + 1], pixels[i + 2]);
    if (luma > 8) lit++;
    if (luma > max) max = luma;
    const a = pixels[i + 3];
    if (a < minAlpha) minAlpha = a;
    if (a > maxAlpha) maxAlpha = a;
  }
  const total = (pixels.length / 4) | 0;
  console.log(`resolution  : ${WIDTH}x${HEIGHT}`);
  console.log(`lit pixels  : ${lit}/${total} (${((lit / total) * 100).toFixed(1)}%)`);
  console.log(`peak channel: ${max}`);
  console.log(`alpha range : ${minAlpha}..${maxAlpha} (needs a low min for the card to show through)`);

  // Composite over the real card colour so the PNG shows what the page shows.
  // Source is premultiplied: result = rgb + (1 - a) * backdrop.
  const CARD_BG = [0x12, 0x12, 0x12];
  const composited = Buffer.alloc(pixels.length);
  for (let i = 0; i < pixels.length; i += 4) {
    const a = pixels[i + 3] / 255;
    for (let c = 0; c < 3; c++) {
      composited[i + c] = Math.min(255, Math.round(pixels[i + c] + (1 - a) * CARD_BG[c]));
    }
    composited[i + 3] = 255;
  }

  const png = new PNG({ width: WIDTH, height: HEIGHT });
  png.data.set(composited);
  const name = `./verify-${MOBILE ? "mobile" : "desktop"}-${WIDTH}x${HEIGHT}.png`;
  const out = fileURLToPath(new URL(name, import.meta.url));
  writeFileSync(out, PNG.sync.write(png));
  console.log(`wrote ${out}`);

  if (lit === 0) {
    console.error("FAIL: frame is entirely black - nothing rendered.");
    process.exitCode = 1;
  }
} finally {
  gpu.dispose(); // stops Dawn's polling so the process exits
}
