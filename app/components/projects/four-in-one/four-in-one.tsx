import Image from "next/image";
import concept from "@/app/assets/projects/4in1.jpg";
import "./four-in-one.scss";

// Detail body for the 4-in-1 concept — the concept board plus the client roster.
export default function FourInOne() {
  return (
    <div className="nsc-project-four-in-one">
      <p className="lede">A design concept for a micro-payment product, standardising the product structure across devices and across clients.</p>

      <figure className="shot">
        <Image src={concept} alt="4-in-1 concept board, one structure across four contexts" sizes="100vw" placeholder="blur" />
        <figcaption>Concept board — 2015</figcaption>
      </figure>

      <p>The move that made it work was pushing client branding into background media instead of into the layout. One structure could then carry any client without forking the front end for each.</p>

      <ul className="clients">
        <li>O2 Germany</li>
        <li>Tesco</li>
        <li>3Roi</li>
        <li>FooCall UK</li>
      </ul>
    </div>
  );
}
