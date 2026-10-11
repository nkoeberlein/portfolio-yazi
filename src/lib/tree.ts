/**
 * The public file tree of the portfolio.
 *
 * Every route is represented by exactly ONE entry in this tree:
 * it acts as the single source of truth for page listings, breadcrumbs,
 * and the root view `~/`.
 */

export type EntryKind = "dir" | "file";

export interface Entry {
  /** Filename including extension or folder name including trailing `/` */
  name: string;
  kind: EntryKind;
  /** Static route corresponding to the entry (deep-linkable) */
  href: string;
  /** One-column brief note for the listing pane */
  note: string;
}

/** Root entries in Yazi ordering (folders first). */
export const ROOT: Entry[] = [
  { name: "projects/", kind: "dir", href: "/projects/", note: "selected work" },
  { name: "blog/", kind: "dir", href: "/blog/", note: "articles & notes" },
  { name: "pictures/", kind: "dir", href: "/pictures/", note: "images & doodles" },
  { name: "diagrams/", kind: "dir", href: "/diagrams/", note: "mermaid examples" },
  { name: "legal/", kind: "dir", href: "/legal/", note: "imprint & privacy" },
  { name: "welcome.txt", kind: "file", href: "/welcome/", note: "start here" },
  { name: "about.md", kind: "file", href: "/about/", note: "hi there" },
  { name: "now.md", kind: "file", href: "/now/", note: "what I'm doing now" },
  { name: "cv.md", kind: "file", href: "/cv/", note: "resume" },
  { name: "skills.md", kind: "file", href: "/skills/", note: "toolbox" },
  { name: "contact.md", kind: "file", href: "/contact/", note: "reach me" },
];

/**
 * Finds an entry in the tree by its route (e.g. "/cv/").
 * Throws on unknown routes to fail the build early on typos.
 */
export function findEntry(href: string): Entry {
  const hit = ROOT.find((entry) => entry.href === href);
  if (!hit) throw new Error(`Unknown tree entry: ${href}`);
  return hit;
}
