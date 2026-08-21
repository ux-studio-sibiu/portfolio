import { ShowcaseLinear, LinearProject } from "@/app/components/showcase-linear/showcase-linear";

export default function Home() {
  return (
    <ShowcaseLinear>
      <LinearProject
        title="Advisor"
        year="2018 —"
        role="Frontend engineer, Visma"
        stack="KendoUI, .NET MVC, jQuery, SignalR, Cypress"
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
      >
        <p>Accounting office management studio, sold as SaaS to Nordic accounting firms and their clients — 8,000 firms and 40,000 active users.</p>
        <p>The UI system is KendoUI over .NET MVC, with a custom SPA framework and the Visma Unified Design token set on top. Base components are styled to VUD and then extended well past it: intricate comboboxes with chained async loading and inline add, async chained inputs, multi-step wizards with branching and reversible logic, validation on both client and server.</p>
        <p>The work was mostly archaeology. Inherited code with ad-hoc implementations, inconsistent patterns and undocumented logic, at a scale where nothing could be rewritten in one go — so refactoring ran incrementally under version control until it covered the UI. Large data sets forced async dropdowns, segmented endless scroll and server-side filtering. A steady part of the job was bridging design intent and technical reality, and pushing back when a proposed flow would not scale.</p>
      </LinearProject>

      <LinearProject
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
      >
        <p>Website for the annual open house event, built with the local architects guild OAR and running twin events in Sibiu and Valcea.</p>
        <p>Organisers own the content in Sanity — listings, forms, map views and registrations — with reports coming off a dashboard there rather than out of a spreadsheet. Registration is per location, issuing a QR by email through Resend and validating it at the door with a built-in scanner.</p>
        <p>The constraint that shaped everything: heavy architectural photography on the Sanity free plan, under strenuous load for the one or two months around the event. Queries are cached aggressively and invalidated by webhook, so the traffic spike lands on the cache and not the API.</p>
      </LinearProject>

      <LinearProject
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
      >
        <p>An admin dashboard for fraud screening, tracking customers, orders and transactions across the payment platform.</p>
        <p>Built as a single-page app on .NET Core and Angular 2. Search and filtering run live against the database, and the filter state lives in the query string — which sounds like a detail until you are investigating a customer case and need to hand the exact view to a colleague as a link.</p>
      </LinearProject>

      <LinearProject
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
      >
        <p>The first implementation of the 4-in-1 concept: a mobile-optimised payment service for O2 Germany that merged the desktop and mobile customer experiences.</p>
        <p>Collapsing two front ends into one improved the customer journey and, just as usefully, the development and test story. The catch was the support matrix — O2 required IE7, and the service shipped in German.</p>
      </LinearProject>

      <LinearProject
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
      >
        <p>A white-label implementation of the micro-payment concept — one UI structure, re-skinned per client from their own design guide.</p>
        <p>Custom SPA built with jQuery over .NET MVC, responsive and mobile-first, across the browser matrix the clients demanded at the time.</p>
      </LinearProject>

      <LinearProject
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
      >
        <p>A design concept for a micro-payment product, standardising the product structure across devices and across clients.</p>
        <p>The move that made it work was pushing client branding into background media instead of into the layout — so the same structure could carry O2 Germany, Tesco, 3Roi and FooCall UK without forking the front end for each.</p>
      </LinearProject>
    </ShowcaseLinear>
  );
}
