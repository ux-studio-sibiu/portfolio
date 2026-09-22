import Image from "next/image";
import concept from "@/app/assets/projects/4in1-3.jpg";
import foocall from "@/app/assets/projects/4in1-1.jpg";
import o2 from "@/app/assets/projects/4in1-2.jpg";
import "./four-in-one.scss";

// Detail body for the white-label concept. Two columns like the Advisor body:
// the copy on the left, the pictures stacked on the right, each column scrolling
// on its own. The concept board first, then the same structure shipped under two
// clients' brands — which is the argument the concept makes.
//
// The copy column is the same three devices an entry in the index carries — the
// mono meta line, the stack pills, the square-marked points — rather than prose
// of its own. The pane renders nothing but this body, so the meta has to be here
// or it is nowhere.
export default function FourInOne() {
  return (
    <div className="nsc-project-four-in-one">
      <div className="project-columns">
        <div className="project-copy">
          <p className="label project-meta">concept, design, dev, 2017</p>

          <ul className="entry-tech-stack">
            <li className="pill">Design concept</li>
            <li className="pill">.net</li>
            <li className="pill">jquery</li>
            <li className="pill">sammy.js</li>
            <li className="pill">bootstrap</li>
            <li className="pill">photoshop</li>
          </ul>

          <ul className="project-points">
            <li>the established micro-payment service used by multiple clients had accumulated fragmented designs, increasingly reflecting in the codebase</li>
            <li>proposed design concept decouples client branding from the functional UI</li>
            <li>now client branding is carried by background media with a fixed UI structure</li>
            <li>as a result the dev and support teams had shorter delivery cycles and lower operational overhead</li>
            <li>several clients were migrated to this concept, and was a starting point for all new ones. Clients include: O2 Germany, Tesco, 3Roi, FooCall UK</li>
          </ul>
        </div>

        <div className="project-shots">
          <figure className="shot">
            <Image src={concept} alt="The same payment UI skinned for O2, StarHub, Cube² Telecom and a fourth client" sizes="(min-width: 1024px) 60vw, 100vw" placeholder="blur" />
            <figcaption>Concept board — client branding is carried by background media with a fixed UI structure</figcaption>
          </figure>

          <figure className="shot">
            <Image src={foocall} alt="FooCall top-up on tablet, phone and laptop" sizes="(min-width: 1024px) 60vw, 100vw" placeholder="blur" />
            <figcaption>FooCall UK — the fixed UI structure is served by a proto-design-system </figcaption>
          </figure>

          <figure className="shot">
            <Image src={o2} alt="O2 and StarHub payment screens on laptop, tablet and phone" sizes="(min-width: 1024px) 60vw, 100vw" placeholder="blur" />
            <figcaption>O2 / StarHub — payment with eNETS</figcaption>
          </figure>

          {/* Last, after the stills. Muted and looping, so it reads as a moving
              picture rather than something to be played: there is no sound and
              nothing to seek to. `preload="metadata"` keeps it to a few KB until
              the pane is actually opened — the whole body is loaded on demand
              anyway, but the file is the heaviest thing in it by far.
              
              Served from /public rather than imported beside the stills: the
              bundler has no loader for video and refuses the import outright
              ("Unknown module type"). Next does not process video anyway, so an
              import would only have bought a hashed filename. */}
          <figure className="shot">
            <video src="/video/fnt.mp4" autoPlay muted loop playsInline preload="metadata" />
            <figcaption>FooCall — flow in motion</figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
