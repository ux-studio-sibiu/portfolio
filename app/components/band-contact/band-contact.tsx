import "./band-contact.scss";

// Contact — the last band, and the one the fixed column falls back to at the
// bottom of the scroll (its top never reaches the trigger line, so the showcase
// hands it the title on reaching the end).
//
// Laid out like the card: the name, then the ways to reach it, then where and
// when. The details are the real ones from the CV rather than placeholders.
//
// The details are a spec row, exactly the device Core technologies opens the
// page with: a name set bold over a mono line of what belongs to it, with a rule
// under the pair. Nothing is redefined here — .spec-row, .spec-name and
// .spec-note are the shared classes out of globals — so the last band and the
// first are set the same way.
//
// They were display type before, the name at 3.5rem and the address at 3rem. A
// contact card reads as a card rather than as a poster.
export function BandContact() {
  return (
    <section className="band nsc-band-contact" data-section="Contact">
      <div className="band-content">
        <h2 className="band-heading band-title-large">Contact</h2>

        <ul className="spec-list contact-list reveal">
          <li className="spec-row">
            <h2 className="spec-name">Țurcanu Răzvan</h2>
            <p className="spec-note">based in Sibiu, Romania, EU</p>
          </li>

          {/* A row each, and only the mono line in them — the name is the one
              thing here that wants setting at size. Still the real links: the
              styling came down, what they do did not. */}
          <li className="spec-row">
            <h2 className="spec-name">Email</h2>
            <p className="spec-note">
              <a href="mailto:arh.turcanu.razvan@gmail.com">arh.turcanu.razvan@gmail.com</a>
            </p>
          </li>
          <li className="spec-row">
            <h2 className="spec-name">Phone</h2>
            <p className="spec-note">
              <a href="tel:+40748546788">+40 748 546 788</a>
            </p>
          </li>
        </ul>

        <div className="contact-links reveal">
          <a href="https://github.com/razvanturcanu" target="_blank" rel="noreferrer noopener">GitHub</a>

          {/* `download` names the saved file rather than leaving it as the path.
              The PDF itself lives in /public, so it is served as-is. */}
          <a className="contact-cv" href="/cv/resume-turcanu-razvan.pdf" download="turcanu-razvan-cv.pdf">
            <svg className="pdf-icon" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3.5 1.5h6l3 3v10h-9z" />
              <path d="M9.5 1.5v3h3" />
            </svg>
            Download CV
          </a>
        </div>

      </div>
    </section>
  );
}
