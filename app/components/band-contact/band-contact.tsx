import "./band-contact.scss";

// Contact — the last band, and the one the fixed column falls back to at the
// bottom of the scroll (its top never reaches the trigger line, so the showcase
// hands it the title on reaching the end).
//
// Laid out like the card: the name, then the ways to reach it, then where and
// when. The details are the real ones from the CV rather than placeholders.
export function BandContact() {
  return (
    <section className="band nsc-band-contact" data-section="Contact">
      <div className="band-content">
        <h2 className="band-heading band-title-large">Contact</h2>

        <p className="contact-name reveal">Turcanu <span className="name-given">Razvan</span></p>

        <a className="contact-mail reveal" href="mailto:arh.turcanu.razvan@gmail.com">arh.turcanu.razvan@gmail.com</a>
        <a className="contact-phone reveal" href="tel:+40748546788">0748 546 788</a>

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

        <div className="contact-foot reveal">
          <span>Sibiu, Romania</span>
          <span>&copy; 2026</span>
        </div>
      </div>
    </section>
  );
}
