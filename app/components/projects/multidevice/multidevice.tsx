import Image from "next/image";
import shot from "@/app/assets/projects/multidevice.jpg";
import "./multidevice.scss";

// Detail body for MultiDevice — a single wide screenshot plus the support story.
export default function MultiDevice() {
  return (
    <div className="nsc-project-multidevice">
      <p className="lede">Mobile-optimised payment service for O2 Germany, merging the desktop and mobile customer experiences into one.</p>

      <figure className="shot">
        <Image src={shot} alt="MultiDevice payment service for O2 Germany" sizes="100vw" placeholder="blur" priority={false} />
        <figcaption>MultiDevice, O2 Germany — 2016</figcaption>
      </figure>

      <p>The first implementation of the 4-in-1 concept. Collapsing two front ends into one improved the customer journey and, just as usefully, the development and test story: one codebase to build, one to verify.</p>
      <p>The catch was the support matrix. O2 required IE7, and the service shipped in German — so every layout decision had to survive a browser nine years older than the design.</p>
    </div>
  );
}
