import "./motion-thumb.scss";

// "GSAP, motion, 3d" thumbnail: an easing-curve diagram, the graph an
// ease visualiser draws, in ink on paper. At rest the three.js logo waits at
// the start of an ease-in-out curve, with onion-skin ghosts of it along the
// way like an animation's in-betweens; the GSAP wordmark labels it, and a
// timeline ruler runs underneath.
//
// Pointed at, the logo travels the curve: its x moves LINEARLY and its y with
// the curve's own ease, nested in two wrappers, so the path it traces is the
// curve that is drawn. The playhead rides the same x track, so it stays in
// sync without being timed separately. Everything is CSS transitions, which
// also means moving off plays it back in reverse.
//
// The curve is cubic-bezier(0.65, 0, 0.35, 1) (ease-in-out cubic), drawn in a
// 100 x 75 box (the frame's 4:3) from (14, 58.5) to (86, 13.5): control
// points at 14 + 0.65 x 72 and 14 + 0.35 x 72. The ghosts sit on the same ease
// at t = 0.25, 0.5 and 0.75. Change the curve and those move with it.

const CURVE = "M14 58.5 C60.8 58.5 39.2 13.5 86 13.5";
const TICKS = Array.from({ length: 13 }, (_, i) => 14 + i * 6);

function ThreeLogo() {
  return (
    <svg viewBox="0 0 256 259" aria-hidden="true">
      <path fill="currentColor" d="M.087 3.585C-.446 1.427 1.555-.5 3.691.116l62.23 17.916a2.94 2.94 0 0 1 1.578.455l122.73 35.334c.508.01 1.01.155 1.446.416l62.234 17.918c2.138.616 2.807 3.316 1.203 4.858l-187.8 180.649c-1.603 1.542-4.274.77-4.807-1.39L31.353 130.16a2.948 2.948 0 0 1-.098-.396Zm53.306 191.71l13.52 54.733l40.714-39.165l-54.234-15.568Zm41.938-43.284l-39.419 37.995l52.512 15.076l-13.093-53.071Zm5.851-.406l13.052 52.903l39.311-37.814l-52.363-15.089Zm-63.07-18.174l13.109 53.073l39.372-37.95l-52.481-15.123Zm103.704-26.278l-40.051 38.606l53.373 15.38l-13.322-53.986Zm5.612-1.373l13.322 53.984l40.161-38.631l-53.483-15.353ZM79.847 89.239l-40.137 38.64l53.471 15.407l-13.334-54.047Zm5.59-1.457l13.094 53.07l39.419-37.996l-52.512-15.074ZM22.385 69.759L35.71 123.71l40.108-38.612l-53.434-15.339Zm166.192-7.49l-39.419 37.995l52.512 15.076l-13.093-53.071Zm5.633-1.29l13.28 53.826l40.008-38.484l-53.288-15.342Zm-67.86-16.506L87.109 82.25l52.265 15.003l-13.023-52.78Zm5.601-1.419l13.112 53.134l39.43-38.007l-52.542-15.127ZM64.338 26.48L24.919 64.476L77.431 79.55L64.338 26.48Zm5.638-1.269l13.061 52.937l39.323-37.855l-52.384-15.082ZM6.894 7.05l13.323 53.935l40.022-38.577L6.894 7.05Z" />
    </svg>
  );
}

export function MotionThumb() {
  return (
    <span className="nsc-motion-thumb">
      {/* The diagram: dashed guide curve, keyframe diamonds, timeline ruler. */}
      <svg className="diagram" viewBox="0 0 100 75" preserveAspectRatio="none" aria-hidden="true">
        <path className="guide" d={CURVE} />
        <line className="ruler" x1="14" y1="66" x2="86" y2="66" />
        {TICKS.map((x, i) => <line key={x} className="tick" x1={x} y1="66" x2={x} y2={i % 3 === 0 ? 63.5 : 64.75} />)}
      </svg>

      {/* The same curve in solid ink, revealed left to right in step with
          the logo's x, so the line is drawn right behind it. */}
      <svg className="trace" viewBox="0 0 100 75" preserveAspectRatio="none" aria-hidden="true">
        <path d={CURVE} />
      </svg>

      <span className="keyframe start" />
      <span className="keyframe end" />

      <span className="ghost one"><ThreeLogo /></span>
      <span className="ghost two"><ThreeLogo /></span>
      <span className="ghost three"><ThreeLogo /></span>

      <svg className="wordmark" viewBox="0 7 24 10" aria-label="GSAP">
        <path fill="currentColor" d="M9.83 7.59c.817.005 1.437.238 1.842.692c.383.431.567 1.054.547 1.85l-.014.061a.16.16 0 0 1-.148.095h-1.659a.2.2 0 0 1-.199-.195q.002-.634-.39-.71l-.12-.011c-.342 0-.564.211-.57.579c-.007.41.225.783.885 1.423c.868.816 1.217 1.539 1.2 2.493c-.027 1.544-1.077 2.543-2.673 2.543c-.815 0-1.438-.219-1.853-.649c-.42-.437-.612-1.078-.572-1.906a.17.17 0 0 1 .049-.112a.16.16 0 0 1 .112-.045h1.716a.2.2 0 0 1 .069.017a.17.17 0 0 1 .083.098q.008.03.002.06c-.019.298.034.521.151.645a.4.4 0 0 0 .311.121c.317 0 .503-.225.51-.615c.006-.337-.102-.634-.682-1.232c-.751-.734-1.424-1.492-1.403-2.684a2.48 2.48 0 0 1 .774-1.781c.514-.482 1.216-.737 2.032-.737m-5.783.028c.747-.006 1.334.224 1.742.685c.432.487.651 1.221.652 2.182a.16.16 0 0 1-.161.158H4.479a.13.13 0 0 1-.084-.036a.13.13 0 0 1-.035-.085c-.014-.623-.188-.946-.532-.984l-.071-.004c-.69.001-1.097.938-1.313 1.458a5.5 5.5 0 0 0-.426 2.301c.015.366.074.88.42 1.093c.308.189.747.064 1.013-.146c.265-.209.479-.571.569-.901q.02-.07.001-.098q-.01-.011-.032-.015l-.504-.004a.18.18 0 0 1-.129-.06a.1.1 0 0 1-.025-.05a.1.1 0 0 1 0-.056l.316-1.374a.18.18 0 0 1 .157-.134v-.003h3.035l.021.001c.079.01.135.084.134.164v.004l-.316 1.371c-.017.078-.095.135-.184.135h-.381a.064.064 0 0 0-.061.046c-.352 1.194-.829 2.016-1.458 2.509c-.536.42-1.195.616-2.077.616c-.792 0-1.326-.255-1.779-.758c-.598-.666-.845-1.754-.695-3.067c.27-2.463 1.546-4.948 4.004-4.948m16.969.132c2.01 0 3.014.912 2.983 2.711c-.037 2.108-1.321 3.658-3.254 4.016q-.413.073-.833.068l-.934-.004a.06.06 0 0 0-.058.057q0 .015.008.029a.1.1 0 0 0 .022.021l.794.414q.098.053.076.164l-.207.933c-.017.078-.08.123-.171.123h-1.703a.2.2 0 0 1-.071-.015a.2.2 0 0 1-.058-.044a.12.12 0 0 1-.025-.107l1.896-8.241c.019-.086.1-.124.172-.124zm-3.743.012a.2.2 0 0 1 .051.033a.2.2 0 0 1 .034.052a.2.2 0 0 1 .011.059l-.011 8.213a.14.14 0 0 1-.003.058a.14.14 0 0 1-.081.091a.14.14 0 0 1-.064.013h-1.813a.16.16 0 0 1-.111-.045a.2.2 0 0 1-.033-.051a.2.2 0 0 1-.012-.06l.039-.797c.002-.087 0-.111-.051-.117l-.068-.002h-1.714c-.124 0-.133.011-.177.125l-.356.857q-.048.09-.192.09h-1.795c-.109 0-.187-.108-.146-.209l3.718-8.199c.025-.049.063-.123.149-.123h2.566q.03 0 .059.012M15.5 9.985c-.008-.032-.034-.029-.055.013a1 1 0 0 0-.04.093l-1.284 3.183l-.016.048q-.002.01-.001.019l.007.017a.04.04 0 0 0 .015.012a.04.04 0 0 0 .017.006l1.072.014c.119-.01.125-.016.137-.137c.002-.043.154-3.231.148-3.268m4.612-.403a.06.06 0 0 0-.04.017a.06.06 0 0 0-.018.04a.06.06 0 0 0 .03.051l.842.445c.042.023.043.063.029.132c-.007.031-.54 2.375-.539 2.377c.003.003.019.011.099.011h.036c.895-.036 1.383-1.094 1.401-2.121c.009-.555-.18-.896-.523-.946l-.071-.006z" />
      </svg>

      {/* x track (linear): carries the playhead and the y track. */}
      <span className="track-x">
        <span className="playhead" />
        {/* y track (eased): carries the logo. */}
        <span className="track-y">
          <span className="logo"><ThreeLogo /></span>
        </span>
      </span>
    </span>
  );
}
