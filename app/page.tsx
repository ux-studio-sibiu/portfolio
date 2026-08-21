import { ShowcaseLinear, LinearProject } from "@/app/components/showcase-linear/showcase-linear";

// `slug` selects the detail component in ShowcaseLinear's DETAILS registry.
// Each one lives in app/components/projects/<slug>/ with its own stylesheet and
// is fetched only when the project is opened.
export default function Home() {
  return (
    <ShowcaseLinear>
      <LinearProject
        slug="advisor"
        title="Advisor"
        year="2018 —"
        role="Frontend engineer, Visma"
        stack="KendoUI, .NET MVC, jQuery, SignalR"
        summary="Accounting office management studio — SaaS for Nordic accounting firms and their clients, at 8,000 firms and 40,000 active users."
        points={
          <>
            <li>Long-standing contribution to the product, focused on advancing the UI system</li>
            <li>KendoUI components styled with the VUD design system and extended with significant custom behaviour</li>
            <li>Custom SPA framework layered over .NET MVC — only possible after a full refactor of the UI code</li>
            <li>Configurable dashboards: resizable, draggable, lazy-loading</li>
            <li>Dynamic grids with reorderable columns, persistent filtering and endless scroll</li>
            <li>Long-running tasks pushing live updates over SignalR</li>
          </>
        }
      />

      <LinearProject
        slug="clasa-zero"
        embed
        title="Clasa Zero"
        year="2026 —"
        role="Design & build"
        stack="Next.js, Zustand, Sanity"
        href="https://clasa-zero.vercel.app/game"
        summary="A STEM game for pre-school kids — randomly generated puzzles, tested on car trips with a six year old."
        points={
          <>
            <li>Randomly generated puzzles and answer sets, 10+ types: sequences, matching, counting, simple reading</li>
            <li>Settings persist to local storage; custom puzzles can be added in Sanity</li>
            <li>Next puzzle preloads so transitions never wait on the network</li>
            <li>Slide back to review previous puzzles and answers</li>
            <li>AI-generated graphics; in progress, still under user testing</li>
          </>
        }
      />

      <LinearProject
        slug="map"
        embed
        title="Map"
        year="2026"
        role="Design & build"
        stack="Vue, Nuxt, MapLibre, Sanity"
        href="https://vue-playground-mauve.vercel.app/map?curated&sort=year"
        summary="A map-based site for the centre of Sibiu, highlighting notable architecture and telling its story."
        points={
          <>
            <li>Vector .pmtiles self-hosted as a single static file, mounted with MapLibre</li>
            <li>Content managed in Sanity; geolocation with boundary awareness</li>
            <li>Feature flags via query string — this stripped-down build omits unfinished work</li>
            <li>Draft concept, shown here embedded</li>
          </>
        }
      />

      <LinearProject
        slug="zoom"
        embed
        title="Zoom"
        year="2026"
        role="Concept & build"
        stack="Vue, Nuxt, Zoomooz.js"
        href="https://vue-playground-mauve.vercel.app/zoom"
        summary="Zoom-based navigation for a presentation website, built on CSS transforms."
        points={
          <>
            <li>Navigation by CSS transform rather than by route change</li>
            <li>Iframe to parent-page messaging, so the embed can drive its host</li>
            <li>Draft concept, shown here embedded</li>
          </>
        }
      />

      <LinearProject
        slug="casedeschise"
        embed
        title="Casedeschise"
        year="2025 — 2026"
        role="Design & build"
        stack="Next.js, Sanity, Vercel"
        href="https://www.casedeschise.ro"
        summary="Website for the annual open house event, run with the local architects guild OAR across twin events in Sibiu and Valcea."
        points={
          <>
            <li>Registration per location: built-in form, email QR via Resend, built-in QR validator</li>
            <li>Organisers handle all content in Sanity; reports run off a Sanity dashboard</li>
            <li>Heavy architectural photography, tuned to stay inside the Sanity free plan</li>
            <li>Aggressive query caching — webhooks, revalidation and the Next cache</li>
            <li>Map views on the Google Maps API, analytics through Umami</li>
          </>
        }
      />

      <LinearProject
        slug="slow-days"
        embed
        title="Slow Days Outside"
        year="2026"
        role="Design & build"
        stack="Next.js, Sanity"
        href="https://slow-days-outside.vercel.app/"
        summary="A platform for kids activities — educators post events and manage signups and group communication."
        points={
          <>
            <li>Educators publish events and own their own listings</li>
            <li>Signup management per event, with group communication built in</li>
            <li>Custom signup forms rather than one fixed shape</li>
          </>
        }
      />

      <LinearProject
        slug="photography"
        embed
        title="Photography Portfolio"
        year="2026"
        role="Design & build"
        stack="Next.js, Sanity"
        href="https://photography-prototype.vercel.app"
        summary="Portfolio concept for a photography studio — minimal, restrained, and fully editable by the studio."
        points={
          <>
            <li>Minimal, restrained design that puts the photography first</li>
            <li>Availability calendar and contact form</li>
            <li>Full content flexibility — the studio controls every page</li>
          </>
        }
      />

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

      <LinearProject
        slug="four-in-one"
        title="4-in-1"
        year="2015"
        role="Concept & design, Mi-Pay"
        stack="Design concept"
        summary="Design concept for a micro-payment product, standardising the product structure across devices and clients."
        points={
          <>
            <li>One structure spanning devices and client brands</li>
            <li>Client branding carried by background media rather than by layout changes</li>
            <li>Notable clients: O2 Germany, Tesco, 3Roi, FooCall UK</li>
          </>
        }
      />
    </ShowcaseLinear>
  );
}
