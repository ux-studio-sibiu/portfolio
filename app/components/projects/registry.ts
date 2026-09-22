import dynamic from "next/dynamic";

// Detail bodies, one component per project, each with its own stylesheet. Keyed
// by the `slug` on <LinearProject> and wrapped in next/dynamic, so a project's
// chunk — its CSS, and any images or iframes it contains — is fetched the first
// time that project is opened, never on first paint of the index.
//
// Adding a project: create the folder here, add the line below, and give the
// <LinearProject> a matching `slug`.
export const DETAILS: Record<string, React.ComponentType> = {
  advisor: dynamic(() => import("./advisor/advisor")),
  "clasa-zero": dynamic(() => import("./clasa-zero/clasa-zero")),
  zoom: dynamic(() => import("./zoom/zoom")),
  photography: dynamic(() => import("./photography/photography")),
  map: dynamic(() => import("./map/map")),
  casedeschise: dynamic(() => import("./casedeschise/casedeschise")),
  "four-in-one": dynamic(() => import("./four-in-one/four-in-one")),

  // Experiments. Same registry, same lazy chunk per entry — they open into the
  // same detail pane as a project does, and only the index entry differs.
  "texture-studio": dynamic(() => import("./experiments/texture-studio")),
  "fluid-hover": dynamic(() => import("./experiments/fluid-hover")),
  "randomize-studio": dynamic(() => import("./experiments/randomize-studio")),
  paint: dynamic(() => import("./experiments/paint")),
  "static-background": dynamic(() => import("./experiments/static-background")),
  "optimize-studio": dynamic(() => import("./experiments/optimize-studio")),
  radio: dynamic(() => import("./experiments/radio")),
};
