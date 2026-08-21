import { ProjectShowcase, Project } from "@/app/components/project-showcase/project-showcase";

export default function V2() {
  return (
    <ProjectShowcase>
      <Project title="Advisor" year="2018 —" role="Frontend engineer, Visma" stack="KendoUI, .NET MVC, jQuery, SignalR">
        <p>Accounting office management studio, sold as SaaS to Nordic accounting firms and their clients — 8,000 firms and 40,000 active users.</p>
        <p>The UI system is KendoUI over .NET MVC, with a custom SPA framework and the Visma Unified Design token set on top. Base components are styled to VUD and then extended well past it: comboboxes with chained async loading and inline add, multi-step wizards with branching and reversible logic, validation on both client and server.</p>
        <p>The work was mostly archaeology — inherited code at a scale where nothing could be rewritten in one go, so refactoring ran incrementally under version control until it covered the UI.</p>
      </Project>

      <Project title="Casedeschise" year="2025 — 2026" role="Design & build" stack="Next.js, Sanity, Vercel" href="https://www.casedeschise.ro">
        <p>Website for the annual open house event, built with the local architects guild OAR and running twin events in Sibiu and Valcea.</p>
        <p>Organisers own the content in Sanity — listings, forms, map views and registrations. Registration is per location, issuing a QR by email through Resend and validating it at the door with a built-in scanner.</p>
        <p>The constraint that shaped everything: heavy architectural photography on the Sanity free plan, under strenuous load for the one or two months around the event. Queries are cached aggressively and invalidated by webhook.</p>
      </Project>

      <Project title="Mi-Pay Admin" year="2017" role="Frontend developer, Mi-Pay" stack=".NET Core, Angular 2">
        <p>An admin dashboard for fraud screening, tracking customers, orders and transactions across the payment platform.</p>
        <p>Search and filtering run live against the database, and the filter state lives in the query string — which sounds like a detail until you are investigating a customer case and need to hand the exact view to a colleague as a link.</p>
      </Project>

      <Project title="MultiDevice" year="2016" role="Frontend developer, Mi-Pay" stack="jQuery, .NET MVC">
        <p>The first implementation of the 4-in-1 concept: a mobile-optimised payment service for O2 Germany that merged the desktop and mobile customer experiences.</p>
        <p>Collapsing two front ends into one improved the customer journey and, just as usefully, the development and test story. The catch was the support matrix — O2 required IE7, and the service shipped in German.</p>
      </Project>

      <Project title="White Label" year="2016" role="Frontend developer, Mi-Pay" stack="jQuery, .NET MVC">
        <p>A white-label implementation of the micro-payment concept — one UI structure, re-skinned per client from their own design guide.</p>
        <p>Custom SPA built with jQuery over .NET MVC, responsive and mobile-first, across the browser matrix the clients demanded at the time.</p>
      </Project>

      <Project title="4-in-1" year="2015" role="Concept & design, Mi-Pay" stack="Design concept">
        <p>A design concept for a micro-payment product, standardising the product structure across devices and across clients.</p>
        <p>The move that made it work was pushing client branding into background media instead of into the layout — so the same structure could carry O2 Germany, Tesco, 3Roi and FooCall UK without forking the front end for each.</p>
      </Project>
    </ProjectShowcase>
  );
}
