import { ShowcaseLinear, LinearProject } from "@/app/components/showcase-linear/showcase-linear";
import advisorThumb from "@/app/assets/projects/advisor.jpg";
import clasaZeroThumb from "@/app/assets/projects/clasa-zero-2.jpg";
import mapThumb from "@/app/assets/projects/map.jpg";
import zoomThumb from "@/app/assets/projects/zoom.jpg";
import casedeschiseThumb from "@/app/assets/projects/case-deschise.jpg";
import photographyThumb from "@/app/assets/projects/photo.jpg";
import photographyThumbAlt from "@/app/assets/projects/photo-2.jpg";
import fourInOneThumb from "@/app/assets/projects/4in1-3.jpg";
import randomizeStudioThumb from "@/app/assets/projects/randomize-studio.jpg";
import { Highlight } from "@/app/components/highlight/highlight";

// `slug` selects the detail component in ShowcaseLinear's DETAILS registry.
// Each one lives in app/components/projects/<slug>/ with its own stylesheet and
// is fetched only when the project is opened.
//
// `className` lands on the entry in the index. "large" and "small" are the
// off-size thumbnails — set them per project by eye, drop the prop for the
// middle size. They are defined in band-projects.scss.
export default function Home() {
  return (
    <ShowcaseLinear>
      <LinearProject
        slug="advisor"
        className="xxl"
        thumb={advisorThumb}
        title="Accounting platform"
        year="2018 —"
        role="Enterprise SAAS for nordic markets, 8k firms and 40k active users"
        stack="git, .NET, vscode, jQuery, kendo ui, figma, snowplow, cypress, signalR"
        summary={<></>}
        points={
          <>
            <li><Highlight>long-standing contribution</Highlight> to the product</li>
            <li>styled components (KendoUI), inhouse design system, custom behaviour</li>
            <li><Highlight>custom SPA framework</Highlight>, .NET MVC</li>

            <li>complex UI with dense functionality</li>
            <li>configurable dashboards: resizable, draggable, lazy-loading</li>
            <li>multi-step flows with branching logic (reversible wizard)</li>
            <li>dynamic grids with reorderable columns, persistent filtering and <Highlight>endless scroll</Highlight></li>
            <li>live updates over SignalR for long-running tasks</li>
            <li>occasional keyboard focused flows</li>

            <li className="small-heading">Contributions</li>
            <li>difficult to evolve inherited code: ad-hoc implementations, inconsistent patterns, un-documented logic, significant scale</li>
            <li>implement <Highlight>refactoring</Highlight> strategies with version control, eventually covering all UI</li>
            <li>enforce consistency and constraints</li>
            <li>large data sets require optimizing for <Highlight>performance</Highlight>: async dropdowns, segmented with endless-scroll, server-side filtering</li>
            <li>bridge <Highlight>design intent and technical implementation</Highlight></li>
            <li>push back when UX is technically flawed and propose alternatives that scale</li>
          </>
        }
      />

      <LinearProject
        slug="casedeschise"
        thumb={casedeschiseThumb}
        embed
        title="Casedeschise"
        year="2025 — 2026"
        role="Design & build"
        stack="react, next.js, sanity, webhooks, google maps, resend, umami, vscode, github actions, vercel"
        href="https://www.casedeschise.ro"
        summary={<>website for annual 'open house' event, in collaboration with <Highlight>local architects guild 'OAR'</Highlight></>}
        points={
          <>
            <li>twin events in cities Sibiu and Valcea</li>
            <li>registration for each location : build-in form + email QR (Resend) + <Highlight>built-in QR validator</Highlight></li>
            <li>reports via dashbord in Sanity</li>
            <li><Highlight>organizers handle content</Highlight> in Sanity</li>
            <li>heavy media content: architectural photography</li>
            <li>focus on performance and optimization (uses sanity free plan)</li>
            <li>strenuous usage for 1-2 month around the event date</li>
            <li><Highlight>aggresive caching</Highlight> sanity queries - webhooks, revalidate, next cache</li>
            <li>analytics tracked via Umami</li>
            <li>map views with google maps api</li>
          </>
        }
      />

      <LinearProject
        slug="photography"
        className="medium"
        thumb={photographyThumb}
        thumbAlt={photographyThumbAlt}
        embed
        title="Photography Portfolio"
        year="2026"
        role="Design & build"
        stack="Next.js, React, TypeScript, Sanity, SCSS, Swiper"
        href="https://photography-prototype.vercel.app"
        summary={<>Portfolio concept for a photography studio — <Highlight>minimal, restrained</Highlight>, and fully editable by the studio.</>}
        points={
          <>
            <li>minimal, restrained design highlights photography</li>

            <li>high content flexibility, individaul gallery <Highlight>layouts are composed in Sanity Studio</Highlight> width weighted columns and relative widths keeps it responsive</li>
            
            <li>separate desktop and touch galleries — the desktop one zooms a card open with an in-card slideshow whose controls are portalled outside the transform so they stay crisp</li>
            <li>features <Highlight>availability calendar</Highlight> contact form, generate .pdf contracts from templates</li>
          </>
        }
      />

      <LinearProject
        group="experiments"
        slug="clasa-zero"
        className=""
        thumb={clasaZeroThumb}
        embed
        title="Clasa Zero"
        year="2026 —"
        role=""
        stack="react, next.js, zustand, sanity, github copilot, chat gpt, vscode"
        href="https://clasa-zero.vercel.app/game"
        summary={<>A STEM game for pre-school kids — <Highlight>randomly generated puzzles</Highlight>, tested on car trips with a six year old.</>}
        points={
          <>
            <li>Randomly generated puzzles and answer sets, <Highlight>10+ types</Highlight>: sequences, matching, counting, simple reading</li>
            <li>Settings persist to local storage; custom puzzles can be added in Sanity</li>
            <li>Next puzzle <Highlight>preloads</Highlight> so transitions never wait on the network</li>
            <li>Slide back to review previous puzzles and answers</li>
            <li>AI-generated graphics; in progress, still under user testing</li>
          </>
        }
      />

      <LinearProject
        slug="four-in-one"
        className="large"
        thumb={fourInOneThumb}
        title="4-in-1"
        year="2015"
        role="Concept & design, Mi-Pay"
        stack="Design concept"
        summary={<>Design concept for a micro-payment product, standardising the product structure <Highlight>across devices and clients</Highlight>.</>}
        points={
          <>
            <li>One structure spanning devices and client brands</li>
            <li>Client branding carried by <Highlight>background media</Highlight> rather than by layout changes</li>
            <li>Notable clients: <Highlight>O2 Germany, Tesco, 3Roi, FooCall UK</Highlight></li>
          </>
        }
      />

      <LinearProject
        group="experiments"
        slug="map"
        className="large"
        thumb={mapThumb}
        embed
        title="Map based web app"
        year="2026"
        role=""
        stack="vue, nuxt, MapLibre, sanity, vercel, git, github copilot, claude code"
        href="https://vue-playground-mauve.vercel.app/map?curated&sort=year"
        summary={<>Sibiu, Romania, city centre — highlight <Highlight>notable architecture</Highlight> and tell their story.</>}
        points={
          <>
            <li>Sibiu, Romania, city centre: <Highlight>highlights notable architecture and tell their story</Highlight></li>
            <li>content via sanity cms</li>
            <li>vector .pmtiles are self-hosted as a single static file, via MapLibre (open-source)</li>
            <li>geolocation with boundary awareness - when used on mobile</li>
            <li>draft concept, presented here in iframe</li>
          </>
        }
      />

      <LinearProject
        group="various"
        slug="zoom"
        className="small"
        thumb={zoomThumb}
        embed
        title="Zoom"
        year="2026"
        role="Concept & build"
        stack="vue, nuxt, vercel, git, github copilot, vscode"
        href="https://vue-playground-mauve.vercel.app/zoom"
        summary={<><Highlight>zoom based navigation</Highlight> for presentation website</>}
        points={
          <>
            <li>css-transform navigation using Zoomooz.js</li>
            <li>draft concept, presented here in iframe</li>
            <li><Highlight>iframe to parent page messaging</Highlight></li>
            <li>AI-assisted (github copilot), reviewed and refined</li>
          </>
        }
      />

      <LinearProject
        group="various"
        embed
        slug="paint"
        title="Paint"
        role="Canvas, UI"
        href="https://experiments-five-bice.vercel.app/paint-concept/"
        summary={<>MS Paint rebuilt in one file, bevels and all — a study in Windows 95 chrome with <Highlight>nothing but CSS borders</Highlight>.</>}
      />

      {/* The two oldest things here, both still running off the same static
          files they shipped with — served from the playground repo, which is
          where the portfolio they were built for now lives. */}
      <LinearProject
        group="various"
        embed
        slug="optimize-studio"
        title="Optimize Studio"
        year="2016"
        role="Interactions & effects"
        stack=".NET MVC, jQuery, Photoshop"
        href="https://ux-studio-sibiu.github.io/playground/projects/old-portfolio/index.html"
        summary={<>A collage of interaction, effect and technique studies from an earlier portfolio — modular, responsive, and <Highlight>obsessed with optimisation</Highlight>.</>}
      />

      <LinearProject
        group="various"
        embed
        slug="radio"
        title="Radio"
        year="2015"
        role="Audio & visuals"
        stack="jQuery, Bootstrap"
        href="https://ux-studio-sibiu.github.io/playground/projects/radio-prototype/index.html?curated"
        summary={<>Random audio paired with random visuals — <Highlight>instant party</Highlight>. Space toggles fullscreen, the red button opens the playlist.</>}
      />

      <LinearProject
        group="tools"
        embed
        slug="randomize-studio"
        thumb={randomizeStudioThumb}
        title="Randomize Studio"
        role="Typography"
        stack="Google Fonts"
        href="https://experiments-five-bice.vercel.app/font-experiments/"
        summary={<>A type-pairing playground: editable heading, subheading and body over a background image, with <Highlight>~40 fonts swapped live</Highlight>.</>}
      />

      <LinearProject
        group="tools"
        embed
        slug="background-experiments"
        title="Background Experiments"
        role="SVG, CSS"
        href="https://experiments-five-bice.vercel.app/background-experiments/"
        summary={<>A browser for <Highlight>86 tileable SVG patterns</Highlight>, with live controls for scale, opacity, colour tint and blend mode.</>}
      />

      <LinearProject
        group="tools"
        embed
        slug="fluid-hover"
        title="Fluid hover"
        role="WebGL"
        stack="three.js, GLSL"
        href="https://experiments-five-bice.vercel.app/effect/"
        summary={<>A shader that <Highlight>smears an image toward the cursor</Highlight> — faster motion, stronger displacement, chromatic aberration on the edges.</>}
      />

      <LinearProject
        group="tools"
        embed
        slug="static-background"
        title="Static background"
        role="Canvas, Motion"
        href="https://experiments-five-bice.vercel.app/static-background/"
        summary={<>The animated film-grain overlay that fades in behind navigation menus. Canvas 2D, no dependencies, <Highlight>about 5 KB</Highlight>.</>}
      />
    </ShowcaseLinear>
  );
}