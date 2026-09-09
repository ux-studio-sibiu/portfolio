import "./band-contact.scss";

// Contact — the last band, and the one the fixed column falls back to at the
// bottom of the scroll (its top never reaches the trigger line, so the showcase
// hands it the title on reaching the end).
export function BandContact() {
  return (
    <section className="band nsc-band-contact" data-section="Contact">
      <div className="band-content">
        <p className="contact-label reveal"><span className="highlight-on-scroll">Available for work</span></p>
        <a className="contact-mail reveal" href="mailto:hello@example.com">hello@example.com</a>
        <div className="contact-foot reveal">
          <span>Sibiu, Romania</span>
          <span>GitHub</span>
          <span>LinkedIn</span>
          <span>&copy; 2026</span>
        </div>
      </div>
    </section>
  );
}
