import Image from "next/image";
import concept from "@/app/assets/projects/4in1-3.jpg";
import foocall from "@/app/assets/projects/4in1-1.jpg";
import o2 from "@/app/assets/projects/4in1-2.jpg";
import "./four-in-one.scss";

// Detail body for the 4-in-1 concept. Two columns like the Advisor body: the
// copy on the left, the pictures stacked on the right, each column scrolling on
// its own. The concept board first, then the same structure shipped under two
// clients' brands — which is the argument the concept makes.
export default function FourInOne() {
  return (
    <div className="nsc-project-four-in-one">
      <div className="project-columns">
        <div className="project-copy">
          <p className="lede">A design concept for a micro-payment product, standardising the product structure across devices and across clients.</p>

          <p>The move that made it work was pushing client branding into background media instead of into the layout. One structure could then carry any client without forking the front end for each.</p>

          <p>Same steps, same fields, same flow: what changes per client is colour, logo and the photograph behind it all. A new client is a design guide applied to something already built, rather than a second front end to keep alive beside the first.</p>

          <ul className="clients">
            <li>O2 Germany</li>
            <li>Tesco</li>
            <li>3Roi</li>
            <li>FooCall UK</li>
          </ul>
        </div>

        <div className="project-shots">
          <figure className="shot">
            <Image src={concept} alt="The same payment UI skinned for O2, StarHub, Cube² Telecom and a fourth client" sizes="(min-width: 1024px) 60vw, 100vw" placeholder="blur" />
            <figcaption>Concept board — one structure, four client skins, 2015</figcaption>
          </figure>

          <figure className="shot">
            <Image src={foocall} alt="FooCall top-up on tablet, phone and laptop" sizes="(min-width: 1024px) 60vw, 100vw" placeholder="blur" />
            <figcaption>FooCall UK — top-up, across three contexts</figcaption>
          </figure>

          <figure className="shot">
            <Image src={o2} alt="O2 and StarHub payment screens on laptop, tablet and phone" sizes="(min-width: 1024px) 60vw, 100vw" placeholder="blur" />
            <figcaption>O2 / StarHub — payment with eNETS</figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
