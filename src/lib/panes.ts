/**
 * Data builders for surrounding panes: the parent column (left) and the status line
 * of the highlighted entry. Pure and independent of `astro:content` — testable via
 * `node --test` (hence the file extension in imports).
 */
import { SITE } from "../site.config.ts";
import { type EntryKind, ROOT } from "./tree.ts";

export interface ParentEntry {
  name: string;
  kind: EntryKind;
  href: string;
  /** The folder currently opened in the middle column */
  active: boolean;
}

export interface Status {
  name: string;
  note: string;
  size: string;
  date: string;
  perms: string;
  /** List position, e.g. `3/6` */
  pos: string;
}

/** Fields required by `statusOf()` from an EntryVM. */
export interface StatusSource {
  name: string;
  kind: EntryKind;
  note: string;
  size: string;
  date: string;
  selected: boolean;
}

/** Parent of `~`: `/home` containing the user directory. */
export function homeParent(): ParentEntry[] {
  return [{ name: `${SITE.user}/`, kind: "dir", href: "/", active: true }];
}

/** Parent of `~/projects/` or `~/blog/`: the root tree with active folder highlighted. */
export function rootParent(activeHref: string): ParentEntry[] {
  if (!ROOT.some((entry) => entry.href === activeHref)) {
    throw new Error(`Unknown tree entry: ${activeHref}`);
  }
  return ROOT.map(({ name, kind, href }) => ({ name, kind, href, active: href === activeHref }));
}

export function permsOf(kind: EntryKind): string {
  return kind === "dir" ? "drwxr-xr-x" : "-rw-r--r--";
}

/** Status line for the highlighted entry (defaults to the first entry if none selected). */
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
