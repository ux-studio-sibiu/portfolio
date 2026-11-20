"use client";

import { useEffect, useRef } from "react";
import gropius from "@/app/assets/projects/walter-gropius-1919.jpg";
import { watchLook } from "@/app/components/thumb-look/thumb-look";
import "./particles-thumb.scss";

// Interactive particles' thumbnail: the effect itself, drawn on a plain 2D
// canvas, without three.js. The photo becomes a few thousand dark particles on
// paper, drifting in depth; the pointer leaves a fading trail that pushes them
// aside. Clicking the frame opens the real three.js page in the detail pane.
//
// It follows the effect's own maths — effects-collection/interactive-particles,
// the vertex shader and TouchTexture in interactive-particles.js — with the
// page's look (dark particles on white, a wide trail). Change one, change the
// other. What differs: the grid is coarser, the depth is a faked perspective
// rather than a camera, and the assemble animation is left out.
//
// It drifts at full speed while pointed at (or lit from its name in the copy),
// and at SETTINGS.idle of that the rest of the time — 0 keeps it still at rest,
// and an idle drift only runs while the frame is on screen. The trail plays
// out after the pointer leaves. With reduced motion the drift stays still and
// only a touch moves anything, as in the original.

// The effect's options, tuned for the thumbnail: a coarse grid of fewer, larger
// particles. Size, scatter, depth and push are measured in grid pixels, as in
// the effect's own panel, so its values carry over one for one at the same grid.
const SETTINGS = {
  grid: 75, // longest side of the particle grid
  threshold: 66, // pixels lighter than 255 - this get no particle
  brightness: -15, // added to the photo before it is sampled, -100 to 100
  contrast: 0.9, // the photo's contrast around mid-grey: 1 as it is, above 1 harder
  size: 1.4, // diameter in grid pixels, before brightness and noise scale it
  variation: 0.35, // how much brightness and noise vary the size: 0 none, 1 the original
  random: 0.8, // scatter from the pixel, in grid pixels
  depth: 3.4, // drift towards and away from the camera
  speed: 1.45, // speed of the noise while pointed at; 0 freezes it
  idle: 1, // the drift when NOT pointed at, as a share of speed: 0 still at rest
  echo: 1.5, // how far particles lag behind the frame as it slides in; 0 none
  echoEase: 0.2, // how quickly the echo follows the frame each frame: low = a long, lazy trail
  echoBase: 0.5, // how much every particle lags, near or far
  echoSpread: 1, // how much more the nearer particles lag: high = the cloud stretches out
  touchRadius: 0.37, // size of the pointer's trail dot, as a share of the image
  touchTrail: 1.9, // seconds a trail point takes to fade
  touchPush: 13, // how far a touched particle is pushed, in grid pixels
};
const TOUCH_SIZE = 64;
// How far past the frame the canvas reaches, on each side, as a share of the
// frame: room for pushed particles to fly out instead of being cut at its edge.
// Matches the inset in particles-thumb.scss.
const SPILL = 0.4;

// A fixed random number per seed, as the shader's random().
const random = (n: number) => {
  const x = Math.sin(n) * 43758.5453123;
  return x - Math.floor(x);
};

// 2D simplex noise, the shader's snoise() term for term. Written out with no
// arrays, as it runs twice per particle per frame — a few thousand particles
// would otherwise make tens of thousands of small allocations a frame.
const mod289 = (x: number) => x - Math.floor(x / 289) * 289;
const permute = (x: number) => mod289((x * 34 + 1) * x);
const C0 = 0.211324865405187;
const C1 = 0.366025403784439;
const C2 = -0.577350269189626;
const C3 = 0.024390243902439;
// One corner's share: its falloff times its gradient's pull, from the hashed p.
const corner = (p: number, x: number, y: number) => {
  let m = Math.max(0.5 - (x * x + y * y), 0);
  if (m === 0) return 0;
  m *= m;
  m *= m;
  const g = 2 * (p * C3 - Math.floor(p * C3)) - 1;
  const h = Math.abs(g) - 0.5;
  const a0 = g - Math.floor(g + 0.5);
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  return m * (a0 * x + h * y);
};
function snoise(vx: number, vy: number) {
  const s = (vx + vy) * C1;
  const ix = Math.floor(vx + s);
  const iy = Math.floor(vy + s);
  const t = (ix + iy) * C0;
  const x0 = vx - ix + t;
  const y0 = vy - iy + t;
  const i1x = x0 > y0 ? 1 : 0;
  const i1y = 1 - i1x;
  const mx = mod289(ix);
  const my = mod289(iy);
  return 130 * (
    corner(permute(permute(my) + mx), x0, y0)
    + corner(permute(permute(my + i1y) + mx + i1x), x0 + C0 - i1x, y0 + C0 - i1y)
    + corner(permute(permute(my + 1) + mx + 1), x0 + C2, y0 + C2)
  );
}

const easeOutSine = (t: number) => Math.sin((t * Math.PI) / 2);

// shade: the particle's own pixel, 0-255 — the panel's "colour" tone, which on a
// black-and-white photo is its grey.
type Particle = { x: number; y: number; seed: number; angle: number; grey: number; shade: number; dx: number; dy: number; rnd: number };

export function ParticlesThumb() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const host = el.closest<HTMLElement>(".entry-thumb") ?? el;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");

    // The trail: soft white dots on a small black canvas, read back each frame.
    const touch = document.createElement("canvas");
    touch.width = touch.height = TOUCH_SIZE;
    const tctx = touch.getContext("2d", { willReadFrequently: true })!;
    let trail: { x: number; y: number; age: number; force: number }[] = [];

    let particles: Particle[] = [];
    let gw = 0;
    let gh = 0;
    let time = 0;
    // The frame's own movement on screen (it slides in as the page scrolls),
    // smoothed, in CSS px per frame: the particles lag behind it by this much,
    // the nearer ones more, and catch up as it settles — see SETTINGS.echo.
    // Sideways only: that is the way the frame arrives.
    let moveX = 0;
    let lastLeft: number | null = null;
    let looking = false;
    let raf = 0;
    let last = 0;
    let cancelled = false;

    // The frame is drawn by writing pixels, not by stamping a dot image: a few
    // thousand drawImage calls cost about 18ms a frame at 2x, the same dots
    // written into a buffer about 2. `shade` is the frame in greys (255 paper),
    // turned into the canvas's pixels once per frame.
    let image: ImageData | null = null;
    let pixels: Uint32Array | null = null;
    let shade: Uint8Array | null = null;

    // The image down to the grid, keeping only the dark pixels (the page's
    // inverted threshold): brightness below 255 - SETTINGS.threshold.
    const build = (img: HTMLImageElement) => {
      const scale = SETTINGS.grid / Math.max(img.width, img.height);
      gw = Math.round(img.width * scale);
      gh = Math.round(img.height * scale);
      const c = document.createElement("canvas");
      c.width = gw;
      c.height = gh;
      const g = c.getContext("2d", { willReadFrequently: true })!;
      g.drawImage(img, 0, 0, gw, gh);
      const data = g.getImageData(0, 0, gw, gh).data;
      particles = [];
      for (let i = 0; i < gw * gh; i++) {
        const raw = data[i * 4] * 0.21 + data[i * 4 + 1] * 0.72 + data[i * 4 + 2] * 0.07;
        // The photo's own brightness and contrast, before anything is decided:
        // contrast around mid-grey, then brightness added, clamped to 0-255.
        const brightness = Math.min(255, Math.max(0, (raw - 128) * SETTINGS.contrast + 128 + SETTINGS.brightness));
        if (brightness >= 255 - SETTINGS.threshold) continue;
        const x = i % gw;
        const y = Math.floor(i / gw);
        const seed = i;
        particles.push({
          x,
          y,
          seed,
          angle: random(seed) * Math.PI * 2,
          // Size follows darkness when inverted, as the shader's mix(grey, 1 - grey).
          grey: 1 - brightness / 255,
          shade: Math.round(brightness),
          dx: random(seed) - 0.5,
          dy: random(x + seed) - 0.5,
          rnd: random(seed),
        });
      }
    };

    // At 1x on every screen: the dots are soft round marks, and 2x would hold
    // four times the pixels — on a canvas already 1.8 times the frame each way.
    const resize = () => {
      el.width = Math.max(1, Math.round(el.clientWidth));
      el.height = Math.max(1, Math.round(el.clientHeight));
      image = ctx.createImageData(el.width, el.height);
      pixels = new Uint32Array(image.data.buffer);
      shade = new Uint8Array(el.width * el.height);
    };

    // One round dot into `shade`, in its own grey, laid over whatever is under
    // it — later dots cover earlier ones, as blended particles do in the
    // original. (Letting the darkest win instead turned every overlap black and
    // lost the greys.) The rim, a pixel wide, is half the dot over what is
    // under it, so the edge is not stepped.
    const stamp = (sx: number, sy: number, radius: number, tone: number) => {
      if (!shade) return;
      const w = el.width;
      const h = el.height;
      const rim = radius + 0.8;
      const r2 = radius * radius;
      const rim2 = rim * rim;
      const x0 = Math.max(0, Math.floor(sx - rim));
      const x1 = Math.min(w - 1, Math.ceil(sx + rim));
      const y0 = Math.max(0, Math.floor(sy - rim));
      const y1 = Math.min(h - 1, Math.ceil(sy + rim));
      for (let y = y0; y <= y1; y++) {
        const dy = y + 0.5 - sy;
        for (let x = x0; x <= x1; x++) {
          const dx = x + 0.5 - sx;
          const d2 = dx * dx + dy * dy;
          if (d2 > rim2) continue;
          const i = y * w + x;
          shade[i] = d2 <= r2 ? tone : (shade[i] + tone) >> 1;
        }
      }
    };

    // Grid pixels to canvas pixels: the grid fills 1 / 1.1 of the FRAME's
    // height, as the original's camera framing does — the frame being the
    // middle of the canvas, which reaches SPILL past it on every side.
    const layout = () => {
      const fw = el.width / (1 + 2 * SPILL);
      const fh = el.height / (1 + 2 * SPILL);
      const k = Math.min(fw / (gw * 1.1), fh / (gh * 1.1));
      return { k, cx: el.width / 2, cy: el.height / 2 };
    };

    const updateTrail = (dt: number) => {
      tctx.fillStyle = "#000";
      tctx.fillRect(0, 0, TOUCH_SIZE, TOUCH_SIZE);
      for (const p of trail) p.age += dt;
      trail = trail.filter((p) => p.age < SETTINGS.touchTrail);
      const grow = SETTINGS.touchTrail * 0.3;
      for (const p of trail) {
        const life = p.age < grow ? easeOutSine(p.age / grow) : easeOutSine(1 - (p.age - grow) / (SETTINGS.touchTrail - grow));
        const r = TOUCH_SIZE * SETTINGS.touchRadius * life * p.force;
        if (r <= 0) continue;
        const x = p.x * TOUCH_SIZE;
        const y = p.y * TOUCH_SIZE;
        const grad = tctx.createRadialGradient(x, y, r * 0.25, x, y, r);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.2)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        tctx.fillStyle = grad;
        tctx.beginPath();
        tctx.arc(x, y, r, 0, Math.PI * 2);
        tctx.fill();
      }
    };

    const draw = () => {
      if (!gw || !image || !pixels || !shade) return;
      const { k, cx, cy } = layout();
      // The camera sits where the grid fills 1 / 1.1 of a 50-degree view; a
      // particle nearer to it is drawn further out and bigger.
      const camera = (gh * 1.1) / 2 / Math.tan((25 * Math.PI) / 180);
      const touchData = trail.length ? tctx.getImageData(0, 0, TOUCH_SIZE, TOUCH_SIZE).data : null;
      shade.fill(255);
      for (const p of particles) {
        const rndz = p.rnd + snoise(p.seed * 0.1, time * 0.1);
        // Echo: pushed against the frame's movement, more for the nearer
        // particles (rndz runs from about -1 to 2), so the cloud trails it.
        const lag = (SETTINGS.echoBase + SETTINGS.echoSpread * Math.max(rndz, 0)) / k;
        let x = p.x + p.dx * SETTINGS.random - moveX * SETTINGS.echo * lag;
        let y = p.y + p.dy * SETTINGS.random;
        let z = rndz * (p.rnd * 2 * SETTINGS.depth);
        if (touchData) {
          const tx = Math.min(TOUCH_SIZE - 1, Math.floor(((p.x + 0.5) / gw) * TOUCH_SIZE));
          const ty = Math.min(TOUCH_SIZE - 1, Math.floor(((p.y + 0.5) / gh) * TOUCH_SIZE));
          const t = touchData[(ty * TOUCH_SIZE + tx) * 4] / 255;
          if (t > 0) {
            z += t * SETTINGS.touchPush * rndz;
            x += Math.cos(p.angle) * t * SETTINGS.touchPush * rndz;
            y += Math.sin(p.angle) * t * SETTINGS.touchPush * rndz;
          }
        }
        const persp = camera / Math.max(camera - z, 1);
        const varied = (snoise(time * 0.5, p.seed * 0.5) + 2) * Math.max(p.grey, 0.2);
        // As the shader: variation 0 every particle is SIZE, 1 the full spread.
        const size = SETTINGS.size * Math.max(1 + (varied - 1) * SETTINGS.variation, 0) * persp * k;
        const sx = cx + (x - gw / 2) * persp * k;
        const sy = cy + (y - gh / 2) * persp * k;
        stamp(sx, sy, size / 2, p.shade);
      }
      // Greys to pixels, as black ink at an opacity of 255 - grey: on the white
      // page that is the same grey, and where there is no particle the canvas
      // is clear — it reaches past the frame, and must not paint a white box
      // over whatever is around it.
      for (let i = 0; i < shade.length; i++) {
        pixels[i] = ((255 - shade[i]) << 24) >>> 0;
      }
      ctx.putImageData(image, 0, 0);
    };

    // Drifting when not pointed at too (SETTINGS.idle above 0) — only while the
    // frame is on screen, and never with reduced motion.
    let visible = false;
    const idling = () => SETTINGS.idle > 0 && visible && !still.matches;

    const frame = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      if (!still.matches) time += dt * SETTINGS.speed * (looking ? 1 : SETTINGS.idle);
      updateTrail(dt);
      // How far the frame moved since the last frame, eased so the echo builds
      // up and dies away rather than jumping with every scroll step.
      if (!still.matches && SETTINGS.echo > 0) {
        const left = host.getBoundingClientRect().left;
        if (lastLeft !== null) moveX += (left - lastLeft - moveX) * SETTINGS.echoEase;
        lastLeft = left;
      }
      draw();
      // Runs while pointed at, while a trail is still fading, or while idling
      // on screen; otherwise it stops, and the last frame stays up.
      const echoing = Math.abs(moveX) > 0.02;
      raf = looking || trail.length || idling() || echoing ? requestAnimationFrame(frame) : 0;
      if (!raf) { last = 0; lastLeft = null; moveX = 0; }
    };
    const start = () => { if (!raf) raf = requestAnimationFrame(frame); };

    // Where the pointer is on the image, 0 to 1 from the top-left — the inverse
    // of the drawing's mapping at zero depth. A fast move pushes harder.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !gw) return;
      const rect = el.getBoundingClientRect();
      const dpr = el.width / rect.width;
      const { k, cx, cy } = layout();
      const gx = ((e.clientX - rect.left) * dpr - cx) / k + gw / 2;
      const gy = ((e.clientY - rect.top) * dpr - cy) / k + gh / 2;
      const u = gx / gw;
      const v = gy / gh;
      const prev = trail[trail.length - 1];
      const force = prev ? Math.min(((prev.x - u) ** 2 + (prev.y - v) ** 2) * 10000, 1) : 0;
      trail.push({ x: u, y: v, age: 0, force });
      start();
    };
    const look = () => { looking = true; start(); };
    const away = () => { looking = false; };

    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      build(img);
      resize();
      draw();
    };
    img.src = gropius.src;

    const ro = new ResizeObserver(() => { resize(); draw(); });
    // On screen or not, for the idle drift: it starts as the frame scrolls in
    // and the loop lets itself stop once it is out.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (idling()) start();
    });
    ro.observe(el);
    io.observe(el);
    // Scrolling moves the frame, so it wakes the loop for the echo even when
    // the drift is off; the loop stops itself once the movement settles.
    const onScroll = () => { if (visible && !still.matches && SETTINGS.echo > 0) start(); };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    host.addEventListener("pointermove", onMove);
    const unwatch = watchLook(el, look, away);

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("scroll", onScroll, { capture: true });
      host.removeEventListener("pointermove", onMove);
      unwatch();
    };
  }, []);

  return (
    <span className="nsc-particles-thumb">
      <canvas ref={canvas} aria-hidden="true" />
    </span>
  );
}
