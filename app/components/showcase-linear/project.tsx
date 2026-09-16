import type { StaticImageData } from "next/image";

export type ProjectProps = {
  title: string;
  // Experiments carry no date, so this is optional — everything else reads it
  // as "print it if it is there".
  year?: string;
  role: string;
  stack?: string;
  summary?: React.ReactNode;
  points?: React.ReactNode;
  // Selects the detail component in app/components/projects/registry.ts.
  slug: string;
  // Thumbnail for the index. Without one the block stays a flat placeholder.
  thumb?: StaticImageData;
  // A second thumbnail, shown beside the first. For a project where one frame
  // does not say enough on its own; both open the same detail.
  thumbAlt?: StaticImageData;
  // Embeds fill the detail pane edge to edge; everything else gets padding.
  embed?: boolean;
  href?: string;
  // Which band this belongs to. Everything is one list with one detail pane
  // behind it — the groups differ in how an entry is laid out, not in what
  // happens when it is opened. No group means the projects band.
  group?: "experiments" | "tools";
  // Put on the entry's root, next to .scroll-entry. "large" and "small" are the
  // off-size thumbnails in band-projects.scss; anything else you add there is
  // reachable the same way.
  className?: string;
};

// Declaration only. ShowcaseLinear reads these props off its children to build
// the projects band and the detail pane, so this renders nothing itself.
export function LinearProject(_props: ProjectProps) {
  return null;
}
