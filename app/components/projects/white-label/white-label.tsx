import Image from "next/image";
import roi from "@/app/assets/projects/3roi.jpg";
import foocall from "@/app/assets/projects/foocall.jpg";
import vodafone from "@/app/assets/projects/vodafone.jpg";
import "./white-label.scss";

// Detail body for White Label — an image gallery, since the whole point of the
// project was one structure wearing several client skins.
export default function WhiteLabel() {
  return (
    <div className="nsc-project-white-label">
      <p className="lede">One UI structure, re-skinned per client from their own design guide.</p>

      <p>Custom SPA built with jQuery over .NET MVC: responsive, mobile-first, and across the browser matrix the clients demanded at the time. The structure never forked — only the design guide changed.</p>

      <div className="gallery">
        <figure className="shot">
          <Image src={roi} alt="3Roi payment flow, client-skinned" sizes="(min-width: 768px) 33vw, 100vw" placeholder="blur" />
          <figcaption>3Roi</figcaption>
        </figure>
        <figure className="shot">
          <Image src={foocall} alt="FooCall UK payment flow, client-skinned" sizes="(min-width: 768px) 33vw, 100vw" placeholder="blur" />
          <figcaption>FooCall UK</figcaption>
        </figure>
        <figure className="shot">
          <Image src={vodafone} alt="Vodafone payment flow, client-skinned" sizes="(min-width: 768px) 33vw, 100vw" placeholder="blur" />
          <figcaption>Vodafone</figcaption>
        </figure>
      </div>

      <p className="note">Screens recovered from the old portfolio archive, 2016.</p>
    </div>
  );
}
