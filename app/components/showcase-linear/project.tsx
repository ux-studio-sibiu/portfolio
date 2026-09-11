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
  // Embeds fill the detail pane edge to edge; everything else gets padding.
  embed?: boolean;
  href?: string;
  // Which band this belongs to. Projects and experiments are one list with one
  // detail pane behind them — they differ in how the entry is laid out, not in
  // what happens when it is opened.
  experiment?: boolean;
};

// Declaration only. ShowcaseLinear reads these props off its children to build
// the projects band and the detail pane, so this renders nothing itself.
export function LinearProject(_props: ProjectProps) {
  return null;
}
