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
  "slow-days": dynamic(() => import("./slow-days/slow-days")),
  photography: dynamic(() => import("./photography/photography")),
  map: dynamic(() => import("./map/map")),
  casedeschise: dynamic(() => import("./casedeschise/casedeschise")),
  "mipay-admin": dynamic(() => import("./mipay-admin/mipay-admin")),
  multidevice: dynamic(() => import("./multidevice/multidevice")),
  "white-label": dynamic(() => import("./white-label/white-label")),
  "four-in-one": dynamic(() => import("./four-in-one/four-in-one")),
};
