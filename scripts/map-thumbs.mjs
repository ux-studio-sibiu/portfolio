// Builds the two Romania map thumbnails (Rivers, Power Grid) as small inline
// SVGs, from the data the live maps draw — so the shapes are the maps' own, in
// the maps' own projection, cut to the section the thumbnail frame shows.
//
//   node scripts/map-thumbs.mjs [path to data-viz/romanian-maps]
//
// Reads only. Writes:
//   app/components/map-thumb/rivers-map.tsx       generated SVG body (rivers)
//   app/components/map-thumb/power-grid-map.tsx   generated SVG body (grid)
//   app/assets/projects/romanian-rivers-ground.webp   the satellite ground under the rivers
//
// Everything is worked out at 2x the frame (340 x 240 for a 170 x 120 frame),
// simplified to under half a pixel there, and rounded to whole pixels.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import sharp from "sharp";

const SRC = path.resolve(process.argv[2] ?? "../data-viz/romanian-maps");
const OUT = path.resolve("app/components/map-thumb");
const W = 340;
const H = 240;
const TOLERANCE = 0.45;

const load = (file, name) => {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(SRC, file), "utf8"), sandbox);
  return sandbox.window[name];
};

// --- Projection: the maps' own oblique stereographic, centred on Romania ------
const RAD = Math.PI / 180;
const LON0 = 25 * RAD;
const LAT0 = 46 * RAD;
const sin0 = Math.sin(LAT0);
const cos0 = Math.cos(LAT0);
const stereo = ([lon, lat]) => {
  const l = lon * RAD - LON0;
  const p = lat * RAD;
  const k = 2 / (1 + sin0 * Math.sin(p) + cos0 * Math.cos(p) * Math.cos(l));
  return [k * Math.cos(p) * Math.sin(l), -k * (cos0 * Math.sin(p) - sin0 * Math.cos(p) * Math.cos(l))];
};
const unstereo = ([x, y]) => {
  const yy = -y;
  const rho = Math.hypot(x, yy);
  if (rho < 1e-12) return [LON0 / RAD, LAT0 / RAD];
  const c = 2 * Math.atan(rho / 2);
  const lat = Math.asin(Math.cos(c) * sin0 + (yy * Math.sin(c) * cos0) / rho);
  const lon = LON0 + Math.atan2(x * Math.sin(c), rho * cos0 * Math.cos(c) - yy * sin0 * Math.sin(c));
  return [lon / RAD, lat / RAD];
};

// A section: centred on a lon/lat, `span` degrees of longitude across, at the
// frame's proportion. Returns lon/lat -> frame pixels, and back.
const section = (lon, lat, span) => {
  const [cx, cy] = stereo([lon, lat]);
  const [ax] = stereo([lon - span / 2, lat]);
  const [bx] = stereo([lon + span / 2, lat]);
  const scale = W / (bx - ax);
  const toPx = (ll) => {
    const [x, y] = stereo(ll);
    return [(x - cx) * scale + W / 2, (y - cy) * scale + H / 2];
  };
  const toLonLat = ([px, py]) => unstereo([(px - W / 2) / scale + cx, (py - H / 2) / scale + cy]);
  return { toPx, toLonLat };
};

// --- Geometry ------------------------------------------------------------------
const simplify = (pts, t = TOLERANCE) => {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  let far = 0;
  let at = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + b[0] * a[1] - b[1] * a[0]) / len;
    if (d > far) { far = d; at = i; }
  }
  if (far <= t) return [a, b];
  return simplify(pts.slice(0, at + 1), t).slice(0, -1).concat(simplify(pts.slice(at), t));
};

// The runs of a line that are on (or near) the frame, each keeping one point
// past the edge so it runs out of the frame rather than stopping short of it.
const MARGIN = 12;
const inside = ([x, y]) => x > -MARGIN && x < W + MARGIN && y > -MARGIN && y < H + MARGIN;
// With `withStart`, each run also says which point of the whole line it starts
// on — the rivers need it to know how far from the sea a run begins.
const clip = (pts, withStart = false) => {
  const runs = [];
  let run = null;
  let start = 0;
  pts.forEach((p, i) => {
    if (inside(p)) {
      if (!run) {
        start = Math.max(0, i - 1);
        run = i > 0 ? [pts[i - 1]] : [];
      }
      run.push(p);
    } else if (run) {
      run.push(p);
      runs.push({ run, start });
      run = null;
    }
  });
  if (run) runs.push({ run, start });
  const kept = runs.filter((r) => r.run.length > 1);
  return withStart ? kept : kept.map((r) => r.run);
};

// Whole pixels, written as one absolute move and then relative steps: the
// shortest way to say it, and why these paths are a few KB rather than tens.
const d = (pts, closed = false) => {
  const r = pts.map(([x, y]) => [Math.round(x), Math.round(y)]).filter((p, i, a) => i === 0 || p[0] !== a[i - 1][0] || p[1] !== a[i - 1][1]);
  if (r.length < 2) return "";
  let out = `M${r[0][0]} ${r[0][1]}l`;
  for (let i = 1; i < r.length; i++) {
    const dx = r[i][0] - r[i - 1][0];
    const dy = r[i][1] - r[i - 1][1];
    out += `${i > 1 && dx >= 0 ? " " : ""}${dx}${dy >= 0 ? " " : ""}${dy}`;
  }
  return closed ? `${out}z` : out;
};
const lines = (polylines) => polylines.flatMap((pts) => clip(pts).map((run) => d(simplify(run)))).filter(Boolean);
// A ring starts and ends on the same point, which leaves simplify() no line to
// measure against, so each half is simplified on its own.
const simplifyRing = (pts, t) => {
  const half = Math.floor(pts.length / 2);
  return simplify(pts.slice(0, half + 1), t).slice(0, -1).concat(simplify(pts.slice(half), t));
};
// A filled outline cut down to the frame (plus MARGIN), so a whole country is
// not written out to show a corner of it: each edge of the box in turn
// (Sutherland–Hodgman). The cut runs MARGIN outside the frame, so its own
// edges are never seen. Rings that miss the frame come back empty.
const clipRing = (pts) => {
  const edges = [
    [(p) => p[0] >= -MARGIN, (a, b) => cross(a, b, 0, -MARGIN)],
    [(p) => p[0] <= W + MARGIN, (a, b) => cross(a, b, 0, W + MARGIN)],
    [(p) => p[1] >= -MARGIN, (a, b) => cross(a, b, 1, -MARGIN)],
    [(p) => p[1] <= H + MARGIN, (a, b) => cross(a, b, 1, H + MARGIN)],
  ];
  let out = pts;
  for (const [keep, at] of edges) {
    const input = out;
    out = [];
    input.forEach((p, i) => {
      const prev = input[(i + input.length - 1) % input.length];
      if (keep(p)) {
        if (!keep(prev)) out.push(at(prev, p));
        out.push(p);
      } else if (keep(prev)) {
        out.push(at(prev, p));
      }
    });
    if (!out.length) return [];
  }
  return out.length > 2 ? [...out, out[0]] : [];
};
// Where the segment a-b crosses the line where coordinate `axis` equals `v`.
const cross = (a, b, axis, v) => {
  const t = (v - a[axis]) / (b[axis] - a[axis]);
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
};
const rings = (polys) => polys.map(clipRing).filter((pts) => pts.length).map((pts) => d(simplifyRing(pts, 0.6), true)).filter(Boolean);

const tsx = (name, comment, body) => `// GENERATED by scripts/map-thumbs.mjs — do not edit by hand, run the script.
// ${comment}
export function ${name}() {
  return (
    <>
${body}
    </>
  );
}
`;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c) => `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;

// --- Rivers --------------------------------------------------------------------
// The lower Olt and its neighbours, from the Jiu to the Vedea, down to the
// Danube — the section the earlier still thumbnail showed.
async function rivers() {
  const data = load("rivers/data/rivers.js", "RIVER_DATA");
  const { toPx, toLonLat } = section(24.98, 44.02, 2.4);
  const SIZES = data.stats.maxOrder;
  const small = hex("#1d3f8f");
  const mid = hex("#2f8cff");
  const large = hex("#b9f3ff");

  // The water, as the live map draws it (drawFlow in rivers/main.js): soft
  // pulses spaced by distance to the sea, one every SPACING km of it, all
  // moving SPEED km/s towards it. Every river shares the spacing and the speed,
  // so a pulse leaving a tributary carries on down the main river without a
  // jump. At this zoom the live map leaves the small rivers still; so does this.
  const SPACING = 22;
  const SPEED = 34;
  // 4 rather than 5 so the Vedea and its neighbours (size 4 in this section)
  // carry water too; at their size the pulses are fainter, as in the live map.
  const PULSE_MIN = 4;
  // Frame pixels per km, at the middle of the section.
  const pxPerKm = W / (2.4 * 111.32 * Math.cos(44.02 * RAD));
  const gap = +(SPACING * pxPerKm).toFixed(2);

  const bySize = new Map();
  for (const [size, , sea, flat] of data.chains) {
    const pts = [];
    for (let i = 0; i < flat.length; i += 2) pts.push(toPx([flat[i], flat[i + 1]]));
    // Length back from the downstream end, which is where the pulses are
    // counted from; a run's start sits that far plus `sea` from the sea.
    const back = new Float64Array(pts.length);
    for (let i = pts.length - 2; i >= 0; i--) back[i] = back[i + 1] + Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    const out = clip(pts, true).map(({ run, start }) => {
      const path = d(simplify(run));
      if (!path || size < PULSE_MIN) return path && `<path d="${path}" />`;
      // A dash pattern of round dots every `gap`, phased so a dot sits wherever
      // the distance to the sea is a whole number of gaps — see the CSS.
      const toSea = sea * pxPerKm + back[start];
      const offset = -(toSea % gap);
      return `<path d="${path}" style={{ strokeDashoffset: "calc(${offset.toFixed(2)}px + var(--pulse-t) * ${gap}px)" }} />`;
    }).filter(Boolean);
    if (!out.length) continue;
    bySize.set(size, [...(bySize.get(size) ?? []), ...out]);
  }

  // The maps' size ramp: colour small -> mid -> large, width growing faster than
  // linearly. Scaled for a 340px frame drawn at half that size.
  const style = (c) => {
    const t = Math.max(0, c - 1) / (SIZES - 1);
    const col = t < 0.5 ? mix(small, mid, t * 2) : mix(mid, large, t * 2 - 1);
    return { color: rgb(col), width: +(0.5 + 0.16 * c ** 1.4).toFixed(2), glow: c >= 6 };
  };

  let body = "";
  let pulses = "";
  for (let c = 1; c <= SIZES; c++) {
    const paths = bySize.get(c);
    if (!paths) continue;
    const { color, width, glow } = style(c);
    const group = paths.join("");
    if (!glow && c < PULSE_MIN) {
      body += `      <g className="river" stroke="${color}" strokeWidth={${width}} opacity={0.85}>${group}</g>\n`;
      continue;
    }
    // Defined once, then drawn as the river (with a glow on the big ones) and
    // again as the pulses — the same paths every time.
    body += `      <defs><g id="rt-s${c}">${group}</g></defs>\n`;
    if (glow) {
      body += `      <use href="#rt-s${c}" className="river" stroke="${color}" strokeWidth={${(width * 4).toFixed(2)}} opacity={0.06} />\n`;
      body += `      <use href="#rt-s${c}" className="river" stroke="${color}" strokeWidth={${(width * 2).toFixed(2)}} opacity={0.14} />\n`;
    }
    body += `      <use href="#rt-s${c}" className="river" stroke="${color}" strokeWidth={${width}} opacity={${glow ? 0.95 : 0.85}} />\n`;
    // No pale core on top, as the live map has none: the rivers brighten where
    // they overlap (plus-lighter in map-thumb.scss), and a white line down the
    // middle would leave the white pulses nothing to show against.
    if (c < PULSE_MIN) continue;

    // The pulse, as the live map's glow sprite: white in the middle, pale blue,
    // then the accent blue fading out — here three round dots on top of each
    // other, bigger and brighter on the bigger rivers (its 3 + 6t, 0.3 + 0.6t).
    const t = (c - 1) / (SIZES - 1);
    const size = (3 + 6 * t) * 1.6;
    const alpha = 0.3 + 0.6 * t;
    const layer = (colour, across, opacity) => `        <use href="#rt-s${c}" className="pulse" stroke="${colour}" strokeWidth={${(size * across).toFixed(2)}} opacity={${(alpha * opacity).toFixed(2)}} />\n`;
    pulses += layer("#5fd8ff", 1, 0.35) + layer("#c8f5ff", 0.5, 0.9) + layer("#fff", 0.26, 1);
  }
  // Round dots every `gap` along each river. --pulse-t runs 0 to -1 on hover,
  // moving every dot one gap downstream per loop (see map-thumb.scss).
  body += `      <g className="pulses" strokeDasharray="0 ${gap}" style={{ animationDuration: "${(SPACING / SPEED).toFixed(3)}s" }}>\n${pulses}      </g>\n`;
  fs.writeFileSync(path.join(OUT, "rivers-map.tsx"), tsx("RiversMap", "The lower Olt, Jiu and Vedea down to the Danube, from data-viz/romanian-maps/rivers.", body));

  // The ground: the satellite picture, bent into the projection pixel by pixel,
  // and dimmed and greyed outside Romania the way the live map does it.
  const terrain = data.terrain;
  const img = await sharp(path.join(SRC, "rivers", terrain.file)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const tw = img.info.width;
  const th = img.info.height;
  const sample = (lon, lat) => {
    const fx = ((lon - terrain.west) / (terrain.east - terrain.west)) * (tw - 1);
    const fy = ((terrain.north - lat) / (terrain.north - terrain.south)) * (th - 1);
    const x0 = Math.max(0, Math.min(tw - 2, Math.floor(fx)));
    const y0 = Math.max(0, Math.min(th - 2, Math.floor(fy)));
    const ax = fx - x0;
    const ay = fy - y0;
    const at = (x, y, ch) => img.data[(y * tw + x) * 3 + ch];
    return [0, 1, 2].map((ch) => at(x0, y0, ch) * (1 - ax) * (1 - ay) + at(x0 + 1, y0, ch) * ax * (1 - ay) + at(x0, y0 + 1, ch) * (1 - ax) * ay + at(x0 + 1, y0 + 1, ch) * ax * ay);
  };

  // Which pixels are Romania: the outline drawn as a mask, then read back.
  const outline = data.outline.map((ring) => ring.map(toPx));
  const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path fill="#fff" d="${outline.map((r) => d(r, true)).join("")}" /></svg>`;
  const mask = await sharp(Buffer.from(maskSvg)).flatten({ background: "#000" }).greyscale().raw().toBuffer();

  const px = Buffer.alloc(W * H * 3);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const [lon, lat] = toLonLat([x + 0.5, y + 0.5]);
      let [r, g, b] = sample(lon, lat);
      const inRomania = mask[y * W + x] / 255;
      // Outside: three quarters grey, then half as bright (--outside-grey, --outside-dim).
      const grey = 0.299 * r + 0.587 * g + 0.114 * b;
      const fade = (v) => (v + (grey - v) * 0.75) * 0.5;
      [r, g, b] = [r, g, b].map((v) => v * inRomania + fade(v) * (1 - inRomania));
      px.set([r, g, b].map((v) => Math.round(v)), (y * W + x) * 3);
    }
  }
  await sharp(px, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 70 }).toFile("app/assets/projects/romanian-rivers-ground.webp");
}

// --- Power grid ----------------------------------------------------------------
// The south-east: Bucharest out to the coast and the delta — the section the
// earlier still thumbnail showed, zoomed in a fifth so the moving power
// reads at the smaller frame size (5.3 degrees across, now 4.4).
function grid() {
  const data = load("electric-grid/data/grid.js", "GRID_DATA");
  const { toPx } = section(27.3, 44.85, 4.4);

  const neighbours = rings(data.neighbours.map((ring) => ring.map(toPx)));
  const outline = rings(data.outline.map((ring) => ring.map(toPx)));
  const lineGroup = (kv) => lines(data.lines.filter((l) => l.kv === kv).map((l) => l.c.map(toPx))).map((p) => `<path d="${p}" />`).join("");

  // Plants: area with capacity, as in the live map, one glow each. Grouped by
  // source so each group can take its own colour and its own pulse.
  const radius = (mw) => (mw ? 1.9 + 0.355 * Math.sqrt(mw) : 2.1) * 0.9;
  const sources = ["solar", "wind", "hydro", "gas", "coal", "nuclear", "other"];
  const plants = sources.map((source) => {
    const dots = data.plants
      .filter((p) => p[2] === source)
      .map(([lon, lat, , mw]) => [...toPx([lon, lat]), radius(mw)])
      .filter(([x, y, r]) => x > -r && x < W + r && y > -r && y < H + r)
      .map(([x, y, r]) => `<circle cx="${Math.round(x)}" cy="${Math.round(y)}" r="${+(r * 1.6).toFixed(1)}" />`)
      .join("");
    return dots ? `      <g className="plants ${source}" fill="url(#pg-${source})">${dots}</g>\n` : "";
  }).join("");

  const colours = { nuclear: "#ffe14d", hydro: "#29c8ff", wind: "#2ee88a", solar: "#ffa62b", coal: "#ff4d5e", gas: "#b77bff", other: "#9aa0b5" };
  const gradients = sources.map((s) => `<radialGradient id="pg-${s}"><stop offset="0" stopColor="#fff" /><stop offset="0.18" stopColor="${colours[s]}" /><stop offset="0.45" stopColor="${colours[s]}" stopOpacity={0.35} /><stop offset="1" stopColor="${colours[s]}" stopOpacity={0} /></radialGradient>`).join("");

  let body = "";
  body += `      <defs>${gradients}<g id="pg-kv220">${lineGroup(220)}</g><g id="pg-kv400">${lineGroup(400)}</g></defs>\n`;
  body += `      <rect width="${W}" height="${H}" fill="#0a0b1a" />\n`;
  body += `      <g fill="#0e0f22" stroke="#5a5f7a" strokeWidth={1.2} strokeDasharray="4 3">${neighbours.map((p) => `<path d="${p}" />`).join("")}</g>\n`;
  body += `      <g fill="#13142b" stroke="#fff" strokeWidth={1.4} strokeDasharray="4 3" opacity={0.95}>${outline.map((p) => `<path d="${p}" />`).join("")}</g>\n`;
  for (const [kv, color, width] of [[220, "#6f63ff", 1], [400, "#ff4fd8", 1.4]]) {
    body += `      <use href="#pg-kv${kv}" className="line" stroke="${color}" strokeWidth={${width * 3}} opacity={0.15} />\n`;
    body += `      <use href="#pg-kv${kv}" className="line" stroke="${color}" strokeWidth={${width}} opacity={0.95} />\n`;
    // The moving power: a glow in the line's colour, and a white bead on it,
    // both well wider than the line so they read at thumbnail size.
    body += `      <use href="#pg-kv${kv}" className="flow flow-glow" stroke="${color}" strokeWidth={${+(width * 5.5).toFixed(2)}} />\n`;
    body += `      <use href="#pg-kv${kv}" className="flow" strokeWidth={${+(width * 2.4).toFixed(2)}} />\n`;
  }
  body += plants;
  fs.writeFileSync(path.join(OUT, "power-grid-map.tsx"), tsx("PowerGridMap", "Bucharest to the coast and the delta, from data-viz/romanian-maps/electric-grid.", body));
}

fs.mkdirSync(OUT, { recursive: true });
await rivers();
grid();
for (const f of ["rivers-map.tsx", "power-grid-map.tsx"]) console.log(f, fs.statSync(path.join(OUT, f)).size, "bytes");
console.log("romanian-rivers-ground.webp", fs.statSync("app/assets/projects/romanian-rivers-ground.webp").size, "bytes");
