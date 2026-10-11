/**
 * Daten für die Rahmen-Panes: die Parent-Spalte (links) und die Statuszeile
 * des markierten Eintrags. Rein und ohne `astro:content` — per `node --test`
 * prüfbar (deshalb der Import mit Dateiendung).
 */
import { type EntryKind, ROOT } from "./tree.ts";

export interface ParentEntry {
  name: string;
  kind: EntryKind;
  href: string;
  /** Der Ordner, in dem sich die mittlere Spalte gerade befindet */
  active: boolean;
}

export interface Status {
  name: string;
  note: string;
  size: string;
  date: string;
  perms: string;
  /** Position in der Liste, z. B. `3/6` */
  pos: string;
}

/** Was `statusOf()` von einem EntryVM braucht. */
export interface StatusSource {
  name: string;
  kind: EntryKind;
  note: string;
  size: string;
  date: string;
  selected: boolean;
}

/** Parent von `~`: `/home` mit dem einen Benutzerverzeichnis. */
export function homeParent(): ParentEntry[] {
  return [{ name: "max/", kind: "dir", href: "/", active: true }];
}

/** Parent von `~/projects/` bzw. `~/blog/`: der Root-Baum, aktueller Ordner markiert. */
export function rootParent(activeHref: string): ParentEntry[] {
  if (!ROOT.some((entry) => entry.href === activeHref)) {
    throw new Error(`Unknown tree entry: ${activeHref}`);
  }
  return ROOT.map(({ name, kind, href }) => ({ name, kind, href, active: href === activeHref }));
}

export function permsOf(kind: EntryKind): string {
  return kind === "dir" ? "drwxr-xr-x" : "-rw-r--r--";
}

/** Statuszeile für den selektierten Eintrag (ohne Auswahl: der erste). */
export function statusOf(entries: StatusSource[]): Status {
  const index = Math.max(
    0,
    entries.findIndex((entry) => entry.selected),
  );
  const entry = entries[index];
  if (!entry) throw new Error("Status needs at least one entry");
  return {
    name: entry.name,
    note: entry.note,
    size: entry.size,
    date: entry.date,
    perms: permsOf(entry.kind),
    pos: `${index + 1}/${entries.length}`,
  };
}
