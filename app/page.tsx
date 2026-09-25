import { ShowcaseLinear, LinearProject } from "@/app/components/showcase-linear/showcase-linear";
import advisorThumb from "@/app/assets/projects/advisor.jpg";
import clasaZeroThumb from "@/app/assets/projects/clasa-zero-2.jpg";
import mapThumb from "@/app/assets/projects/map.jpg";
import zoomThumb from "@/app/assets/projects/zoom.jpg";
import casedeschiseThumb from "@/app/assets/projects/case-deschise.jpg";
import photographyThumb from "@/app/assets/projects/photo.jpg";
import photographyThumbAlt from "@/app/assets/projects/photo-2.jpg";
import fourInOneThumb from "@/app/assets/projects/4in1-3.jpg";
import optimizeThumb from "@/app/assets/projects/optimize.jpg";
import textureStudioThumb from "@/app/assets/projects/texture-studio.jpg";
import { Highlight } from "@/app/components/highlight/highlight";
import { RadioThumb } from "@/app/components/radio-thumb/radio-thumb";
import { RandomizeThumb } from "@/app/components/randomize-thumb/randomize-thumb";
import { StaticThumb } from "@/app/components/static-thumb/static-thumb";
import { FluidThumb } from "@/app/components/fluid-thumb/fluid-thumb";

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
        role=""
        stack="git, .NET, jQuery, kendo ui, figma, snowplow, cypress, signalR"
        summary={<></>}
        points={
          <>

            <li className="small-heading">Notable project features:</li>

            <li>accounting SaaS for nordic markets, 40k active users</li>
            <li><Highlight>complex UI with dense functionality</Highlight>, occasional keyboard focused UI</li>
            <li>styled components (KendoUI), in-house design system, custom behaviour</li>
            <li>configurable dashboards: resizable, draggable, lazy-loading</li>
            <li>multi-step flows with branching logic (reversible wizard)</li>
            <li>dynamic grids: reorderable columns, persistent filtering, endless scroll</li>
            <li>live updates over SignalR for long-running tasks</li>

            <li className="small-heading">My contributions:</li>

            <li><Highlight>long-standing contribution</Highlight> to product development and maintenance, knowledge sharing and documentation</li>
            <li>implemented an in-house ajax library and modernized the existing .NET MVC into a <Highlight>custom SPA</Highlight></li>
            <li><Highlight>led modernization effort</Highlight> on the UI to reduce complexity, remodel ux, addopt design system, centralize components, improve dx</li>
            <li>complemented AI development by setting up <Highlight>skills, .md instructions</Highlight> and documenting existing <Highlight>confirmed patterns</Highlight></li>
                    
            
          </>
        }
      />

      <LinearProject
        slug="casedeschise"
        thumb={casedeschiseThumb}
        embed
        title="casedeschise.ro"
        year="2025 — 2026"
        role="Event website: design, dev, cms, analytics"
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
        role="concept, design, dev"
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
        embed
        slug="clasa-zero"
        className=""
        thumb={clasaZeroThumb}
        title="Kids STEM puzzles"
        year="2026 —"
        role=""
        stack="react, next.js, zustand, sanity, github copilot, vscode"
        href="https://clasa-zero.vercel.app/game"
        points={
          <>
            
            <li>this iframe demo <Highlight>highlights the correct answer</Highlight></li>

            <li>randomly generated puzzles and possible answers, ai generated graphics</li>
            <li>10+ puzzle types: sequences, matching, counting, simple reading</li>
            {/* <li>persist settings with <Highlight>local storage</Highlight></li> */}
            <li>custom puzzles can be added on <Highlight>sanity</Highlight> cms</li>

            <li>in progress — user testing with help from my 6 year old</li>
            {/* <li><Highlight>next.js</Highlight> with <Highlight>zustand</Highlight> for state management</li> */}
            {/* <li>focus on performance and optimization: smooth transitions, preload next puzzle</li> */}
            <li>slide back to review previous puzzles and answers</li>
          </>
        }
      />

      <LinearProject
        slug="four-in-one"
        className="large"
        thumb={fourInOneThumb}
        title="White-label product"
        year="2015"
        role="concept, design, dev, 2017"
        stack="Design concept, .net, jquery, sammy.js , bootstrap, photoshop"
        summary={<>Design concept for a micro-payment product, standardising the product structure <Highlight>across devices and clients</Highlight>.</>}
        points={
          <>

            <li>the established micro-payment service used by multiple clients had accumulated fragmented designs, increasingly reflecting in the codebase. </li>
            
            <li>proposed design concept <Highlight>decouples client branding from the functional UI</Highlight></li>
            <li>now client branding is carried by background media with a fixed UI structure</li>
            <li>as a result the dev and support teams had <Highlight>shorter delivery cycles</Highlight> and lower operational overhead</li>

            <li>several clients were migrated to this concept, and was a starting point for all new ones. Clients include: <Highlight>O2 Germany, Tesco, 3Roi, FooCall UK</Highlight></li>
          
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
        summary={<></>}
        points={
          <>
            <li>Sibiu, ro, city centre: <Highlight>highlights notable architecture and tell their story</Highlight></li>
            <li>content via sanity cms</li>
            <li>vector .pmtiles hosted as a static file, via MapLibre (open-source)</li>
            <li>geolocation with boundary awareness - when used on mobile</li>
            <li>draft concept, presented here in iframe</li>
          </>
        }
      />

      <LinearProject
        group="various"
        embed
        slug="paint"
        className="wide"
        title="Paint"
        year="2016"
        role="click to view"
        href="https://experiments-five-bice.vercel.app/paint-concept/"
        summary={<>Win95  MS Paint rebuilt with claude and css</>}
      />

      <LinearProject
        group="various"
        slug="zoom"
        className="small"
        thumb={zoomThumb}
        embed
        title="Zoom"
        year="2015"
        role="click to view"
        stack=""
        href="https://vue-playground-mauve.vercel.app/zoom"
        summary={<>Navigation concept for a presentation website</>}
        points={
          <>
            <li>css-transform navigation using Zoomooz.js</li>
            <li>draft concept, presented here in iframe</li>
            <li><Highlight>iframe to parent page messaging</Highlight></li>
            <li>AI-assisted (github copilot), reviewed and refined</li>
          </>
        }
      />


      {/* The two oldest things here, both still running off the same static
          files they shipped with — served from the playground repo, which is
          where the portfolio they were built for now lives. */}
      <LinearProject
        group="various"
        embed
        slug="optimize-studio"
        thumb={optimizeThumb}
        title="Optimize Studio"
        year="2016"
        role="click to view"
        stack=".NET MVC, jQuery, Photoshop"
        href="https://ux-studio-sibiu.github.io/playground/projects/old-portfolio/index.html"
        summary={<>Small collage of ui interactions, effects and techniques</>}
      />

      <LinearProject
        group="various"
        embed
        slug="radio"
        className="tv"
        thumbNode={<RadioThumb />}
        title="Instant dance party"
        year="2014"
        role="click to view"
        stack="jQuery, Bootstrap"
        href="https://ux-studio-sibiu.github.io/playground/projects/radio-prototype/index.html?curated"
        summary={<>Plays random music and visuals</>}
      />

      <LinearProject
        group="tools"
        embed
        slug="randomize-studio"
        thumbNode={<RandomizeThumb />}
        title="Randomize Studio"
        role="click to view"
        stack="Google Fonts"
        href="https://experiments-five-bice.vercel.app/randomize-studio/"
        summary={<>Generate random combinations of typography, color, layout and effects.</>}
      />

      <LinearProject
        group="tools"
        embed
        slug="texture-studio"
        thumb={textureStudioThumb}
        thumbLabel
        title="Texture Studio"
        role="click to view"
        href="https://experiments-five-bice.vercel.app/background-experiments/"
        summary={<>Try out svg overlays and blending modes over images</>}
      />

      <LinearProject
        group="tools"
        embed
        slug="fluid-hover"
        thumbNode={<FluidThumb />}
        title="Fluid hover"
        role="click to view"
        stack=""
        href="https://experiments-five-bice.vercel.app/effect/"
        summary={<> Model a mouse driven visual effect using webGL </>}
      />

      <LinearProject
        group="tools"
        embed
        slug="static-background"
        thumbNode={<StaticThumb />}
        thumbLabel
        title="Static background"
        role="click to view"
        href="https://experiments-five-bice.vercel.app/static-background/"
        summary={<>Generate animated film-grain overlays</>}
      />
    </ShowcaseLinear>
  );
}