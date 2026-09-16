import { ShowcaseLinear, LinearProject } from "@/app/components/showcase-linear/showcase-linear";
import advisorThumb from "@/app/assets/projects/advisor.jpg";
import clasaZeroThumb from "@/app/assets/projects/clasa-zero.jpg";
import mapThumb from "@/app/assets/projects/map.jpg";
import zoomThumb from "@/app/assets/projects/zoom.jpg";
import casedeschiseThumb from "@/app/assets/projects/case-deschise.jpg";
import slowDaysThumb from "@/app/assets/projects/slow-days.jpg";
import photographyThumb from "@/app/assets/projects/photo.jpg";
import photographyThumbAlt from "@/app/assets/projects/photo-2.jpg";
import fourInOneThumb from "@/app/assets/projects/multidevice.jpg";

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
            <li>long-standing contribution to the product</li>
            <li>styled components (KendoUI), inhouse design system, custom behaviour</li>
            <li>custom SPA framework, .NET MVC</li>

            <li>complex UI with dense functionality</li>
            <li>configurable dashboards: resizable, draggable, lazy-loading</li>
            <li>multi-step flows with branching logic (reversible wizard)</li>
            <li>dynamic grids with reorderable columns, persistent filtering and <span className="highlight-on-scroll">endless scroll</span></li>
            <li>live updates over SignalR for long-running tasks</li>
            <li>occasional keyboard focused flows</li>

            <li className="small-heading">Contributions</li>
            <li>difficult to evolve inherited code: ad-hoc implementations, inconsistent patterns, un-documented logic, significant scale</li>
            <li>implement <span className="highlight-on-scroll">refactoring</span> strategies with version control, eventually covering all UI</li>
            <li>enforce consistency and constraints</li>
            <li>large data sets require optimizing for <span className="highlight-on-scroll">performance</span>: async dropdowns, segmented with endless-scroll, server-side filtering</li>
            <li>bridge design intent and technical implementation</li>
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
        summary={<>website for annual 'open house' event, in collaboration with local architects guild 'OAR'</>}
        points={
          <>
            <li>twin events in cities Sibiu and Valcea</li>

            <li className="small-heading">Stack</li>
            <li>react, next.js, sanity, webhooks, google maps, resend, umami, vscode, github actions, vercel</li>

            <li>registration for each location : build-in form + email QR (Resend) + built-in QR validator</li>
            <li>reports via dashbord in Sanity</li>
            <li>organizers handle content in Sanity</li>
            <li>heavy media content: architectural photography</li>
            <li>focus on performance and optimization (uses sanity free plan)</li>
            <li>strenuous usage for 1-2 month around the event date</li>
            <li>aggresive caching sanity queries - webhooks, revalidate, next cache</li>
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
        stack="Next.js, Sanity"
        href="https://photography-prototype.vercel.app"
        summary={<>Portfolio concept for a photography studio — <span className="highlight-on-scroll">minimal, restrained</span>, and fully editable by the studio.</>}
        points={
          <>
            <li>Minimal, restrained design that puts the photography first</li>
            <li><span className="highlight-on-scroll">Availability calendar</span> and contact form</li>
            <li>Full content flexibility — the studio controls every page</li>
          </>
        }
      />

      <LinearProject
        group="experiments"
        slug="clasa-zero"
        className="small"
        thumb={clasaZeroThumb}
        embed
        title="Clasa Zero"
        year="2026 —"
        role="Design & build"
        stack="react, next.js, zustand, sanity, github copilot, chat gpt, vscode"
        href="https://clasa-zero.vercel.app/game"
        summary={<>A STEM game for pre-school kids — <span className="highlight-on-scroll">randomly generated puzzles</span>, tested on car trips with a six year old.</>}
        points={
          <>
            <li>Randomly generated puzzles and answer sets, <span className="highlight-on-scroll">10+ types</span>: sequences, matching, counting, simple reading</li>
            <li>Settings persist to local storage; custom puzzles can be added in Sanity</li>
            <li>Next puzzle <span className="highlight-on-scroll">preloads</span> so transitions never wait on the network</li>
            <li>Slide back to review previous puzzles and answers</li>
            <li>AI-generated graphics; in progress, still under user testing</li>
          </>
        }
      />

      <LinearProject
        slug="four-in-one"
        thumb={fourInOneThumb}
        title="4-in-1"
        year="2015"
        role="Concept & design, Mi-Pay"
        stack="Design concept"
        summary={<>Design concept for a micro-payment product, standardising the product structure <span className="highlight-on-scroll">across devices and clients</span>.</>}
        points={
          <>
            <li>One structure spanning devices and client brands</li>
            <li>Client branding carried by <span className="highlight-on-scroll">background media</span> rather than by layout changes</li>
            <li>Notable clients: <span className="highlight-on-scroll">O2 Germany, Tesco, 3Roi, FooCall UK</span></li>
          </>
        }
      />

      <LinearProject
        group="experiments"
        slug="map"
        className="large"
        thumb={mapThumb}
        embed
        title="Map"
        year="2026"
        role="Design & build"
        stack="vue, nuxt, MapLibre, sanity, vercel, git, github copilot, vscode"
        href="https://vue-playground-mauve.vercel.app/map?curated&sort=year"
        summary={<>A map-based site for the centre of Sibiu, highlighting <span className="highlight-on-scroll">notable architecture</span> and telling its story.</>}
        points={
          <>
            <li>Vector .pmtiles self-hosted as a <span className="highlight-on-scroll">single static file</span>, mounted with MapLibre</li>
            <li>Content managed in Sanity; geolocation with boundary awareness</li>
            <li>Feature flags via query string — this stripped-down build omits unfinished work</li>
            <li>Draft concept, shown here embedded</li>
          </>
        }
      />

      <LinearProject
        group="experiments"
        slug="zoom"
        className="small"
        thumb={zoomThumb}
        embed
        title="Zoom"
        year="2026"
        role="Concept & build"
        stack="vue, nuxt, vercel, git, github copilot, vscode"
        href="https://vue-playground-mauve.vercel.app/zoom"
        summary={<>Zoom-based navigation for a presentation website, <span className="highlight-on-scroll">built on CSS transforms</span>.</>}
        points={
          <>
            <li>Navigation by CSS transform rather than by route change</li>
            <li><span className="highlight-on-scroll">Iframe to parent-page messaging</span>, so the embed can drive its host</li>
            <li>Draft concept, shown here embedded</li>
          </>
        }
      />

      <LinearProject
        group="experiments"
        embed
        slug="paint"
        title="Paint"
        role="Canvas, UI"
        href="https://experiments-five-bice.vercel.app/paint-concept/"
        summary={<>MS Paint rebuilt in one file, bevels and all — a study in Windows 95 chrome with <span className="highlight-on-scroll">nothing but CSS borders</span>.</>}
      />

      {/* Temporarily out of the list.
      <LinearProject
        slug="slow-days"
        thumb={slowDaysThumb}
        embed
        title="Slow Days Outside"
        year="2026"
        role="Design & build"
        stack="Next.js, Sanity"
        href="https://slow-days-outside.vercel.app/"
        summary={<>A platform for kids activities — <span className="highlight-on-scroll">educators post events</span> and manage signups and group communication.</>}
        points={
          <>
            <li>Educators publish events and own their own listings</li>
            <li>Signup management per event, with <span className="highlight-on-scroll">group communication</span> built in</li>
            <li>Custom signup forms rather than one fixed shape</li>
          </>
        }
      />
      */}

      {/* Temporarily out of the list — no live site to embed yet.
      <LinearProject
        slug="mipay-admin"
        title="Mi-Pay Admin"
        year="2017"
        role="Frontend developer, Mi-Pay"
        stack=".NET Core, Angular 2"
        summary="Admin dashboard for fraud screening, tracking customers, orders and transactions."
        points={
          <>
            <li>Live search and live filtering across database entries</li>
            <li>Filter state persists in the query string, so a case can be shared by URL</li>
            <li>Client-scoped access control for users</li>
          </>
        }
      />
      */}

      {/* Temporarily out of the list — no live site to embed yet.
      <LinearProject
        slug="multidevice"
        title="MultiDevice"
        year="2016"
        role="Frontend developer, Mi-Pay"
        stack="jQuery, .NET MVC"
        summary="Mobile-optimised payment service for O2 Germany, merging the desktop and mobile customer experiences into one."
        points={
          <>
            <li>One implementation for both experiences, which also simplified dev and test</li>
            <li>Supported IE7, as the client required</li>
            <li>Localised for the German market</li>
          </>
        }
      />
      */}

      {/* Temporarily out of the list — no live site to embed yet.
      <LinearProject
        slug="white-label"
        title="White Label"
        year="2016"
        role="Frontend developer, Mi-Pay"
        stack="jQuery, .NET MVC"
        summary="White-label implementation of the micro-payment concept, one UI structure carrying each client's design guide."
        points={
          <>
            <li>Custom SPA implementation with jQuery over .NET MVC</li>
            <li>Standard UI structure plus a per-client design guide</li>
            <li>Responsive, mobile-first, cross-browser</li>
          </>
        }
      />
      */}

      {/* Experiments. Declared alongside the projects because they are the same
          kind of thing to the shell — `experiment` is what sends them to the
          other band, and `href` is both the frame in the index and the embed in
          the detail pane. Each is a folder of plain HTML in the
          effects-collection repo, served at /<folder>/. */}

      <LinearProject
        group="tools"
        embed
        slug="randomize-studio"
        title="Randomize Studio"
        role="Typography"
        stack="Google Fonts"
        href="https://experiments-five-bice.vercel.app/font-experiments/"
        summary={<>A type-pairing playground: editable heading, subheading and body over a background image, with <span className="highlight-on-scroll">~40 fonts swapped live</span>.</>}
      />

      <LinearProject
        group="tools"
        embed
        slug="background-experiments"
        title="Background Experiments"
        role="SVG, CSS"
        href="https://experiments-five-bice.vercel.app/background-experiments/"
        summary={<>A browser for <span className="highlight-on-scroll">86 tileable SVG patterns</span>, with live controls for scale, opacity, colour tint and blend mode.</>}
      />

      <LinearProject
        group="tools"
        embed
        slug="fluid-hover"
        title="Fluid hover"
        role="WebGL"
        stack="three.js, GLSL"
        href="https://experiments-five-bice.vercel.app/effect/"
        summary={<>A shader that <span className="highlight-on-scroll">smears an image toward the cursor</span> — faster motion, stronger displacement, chromatic aberration on the edges.</>}
      />

      <LinearProject
        group="tools"
        embed
        slug="static-background"
        title="Static background"
        role="Canvas, Motion"
        href="https://experiments-five-bice.vercel.app/static-background/"
        summary={<>The animated film-grain overlay that fades in behind navigation menus. Canvas 2D, no dependencies, <span className="highlight-on-scroll">about 5 KB</span>.</>}
      />
    </ShowcaseLinear>
  );
}