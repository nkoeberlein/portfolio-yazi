/**
 * Der öffentliche Dateibaum des Portfolios.
 *
 * Jede Route wird durch genau EINEN Eintrag aus diesem Baum repräsentiert:
 * das ist die Single Source of Truth für Seitenlisten, Breadcrumbs und
 * die Root-Ansicht `~/`. Ordner in echten Verzeichnissen zusammenfassen
 * mit `directory()` (siehe unten).
 */

export type EntryKind = "dir" | "file";

export interface Entry {
  /** Dateiname inkl. Extension bzw. Ordnername inkl. `/` */
  name: string;
  kind: EntryKind;
  /** Statische Route, zu der der Eintrag gehört (deep-linkable) */
  href: string;
  /** Einspaltige Beschreibung für die Listen-Pane */
  note: string;
}

/** Die „Heimat-Verzeichnisse" des Baums, in Yazi-Anordnung (Ordner zuerst). */
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

/** Sucht einen Eintrag des Baums anhand der Route (z. B. "/cv/").
 * Wirft bei Unbekanntem — Tippfehler in Seiten sollen beim Build knallen. */
export function findEntry(href: string): Entry {
  const hit = ROOT.find((entry) => entry.href === href);
  if (!hit) throw new Error(`Unknown tree entry: ${href}`);
  return hit;
}
