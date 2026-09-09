import type { StaticImageData } from "next/image";

export type ProjectProps = {
  title: string;
  year: string;
  role: string;
  stack?: string;
  summary?: React.ReactNode;
  points?: React.ReactNode;
  // Selects the detail component in app/components/projects/registry.ts.
  slug: string;
  // Thumbnail for the index. Without one the block stays a flat placeholder.
  thumb?: StaticImageData;
  // Embeds fill the detail pane edge to edge; everything else gets padding.
  embed?: boolean;
  href?: string;
};

// Declaration only. ShowcaseLinear reads these props off its children to build
// the projects band and the detail pane, so this renders nothing itself.
export function LinearProject(_props: ProjectProps) {
  return null;
}
