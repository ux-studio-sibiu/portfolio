import "./radio-thumb.scss";

// Radio's thumbnail, assembled from the prototype's own two assets rather than
// run as a live frame: the set is Content/img/tv.png and the picture in it is
// Content/img/static.gif, both lifted straight out of the 2015 project.
//
// Why not the iframe every other entry uses: the page behind it loads jQuery,
// Bootstrap and a YouTube player, and paints a TV that is already a picture of
// a TV. Two files say the same thing at ~350 KB and no script at all — and the
// screen keeps moving, which is the whole of what the live frame was for.
//
// The screen is a HOLE in the png, not a white rectangle, so the gif simply
// sits behind it and shows through. Both rects below are measured off the alpha
// channel rather than guessed, and both are quoted against the set's INK rather
// than the png's canvas, because the ink is what the cell is cut to:
//
//   ink     the opaque bounds of the set — 298 x 205 at (0, 1) in a 300 x 210
//           canvas, so there is a hair of transparent air on three sides
//   screen  the transparent region NOT connected to the border, which comes to
//           7.383% / 9.756% / 65.436% / 70.732% of the ink
//
// Replace the png and both want measuring again.
//
// No frame of its own, unlike the three beside it: see .frame-cell.tv in
// band-experiments.scss. A television is already an object; a screenshot needs
// a rule around it to become one.
export function RadioThumb() {
  return (
    <span className="nsc-radio-thumb">
      {/* Plain <img>, not next/image: the optimiser takes an animated gif and
          hands back a still of its first frame. */}
      <img className="screen" src="/radio/static.gif" alt="" aria-hidden="true" />
      <img className="set" src="/radio/tv.png" alt="" aria-hidden="true" />
    </span>
  );
}
