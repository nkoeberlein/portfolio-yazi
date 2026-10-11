/**
 * Baut EntryVMs aus den Content Collections — für Ordner-Listings und für
 * die Geschwisterlisten auf File-Seiten (ein Shared Builder pro Collection).
 * Die geöffnete Datei (`opened`) bekommt kein Preview-Template: ihr Dokument
 * steht bereits im Preview-Pane, keynav.ts stellt es bei Rückkehr wieder her.
 */
import type { CollectionEntry } from "astro:content";
import type { EntryVM } from "../components/FileList.astro";
import { dateOf, esc, sizeOf } from "./format";
import { coverFor } from "./images";
import { heading, keyHint, kv, p } from "./preview";

const SHORT = 42;

export function truncateNote(text: string): string {
  const clean = text.replaceAll(/\s+/g, " ").trim();
  return clean.length > SHORT ? `${clean.slice(0, SHORT - 1).trimEnd()}…` : clean;
}

/** featured zuerst, danach neueste zuerst */
const projectOrder = (a: CollectionEntry<"projects">, b: CollectionEntry<"projects">): number =>
  Number(b.data.featured) - Number(a.data.featured) ||
  b.data.updated.getTime() - a.data.updated.getTime();

const postOrder = (a: CollectionEntry<"blog">, b: CollectionEntry<"blog">): number =>
  b.data.published.getTime() - a.data.published.getTime();

type ProjectEntry = CollectionEntry<"projects">;

async function projectVM(entry: ProjectEntry, selected: boolean, opened = false): Promise<EntryVM> {
  const d = entry.data;
  return {
    name: `${entry.id}.md`,
    kind: "file",
    href: `/projects/${entry.id}/`,
    note: truncateNote(d.summary),
    size: sizeOf(entry.body),
    date: dateOf(d.updated),
    selected,
    previewTitle: `preview — ${entry.id}.md`,
    previewHTML:
      selected && opened
        ? ""
        : [
            await coverFor(d.cover, d.coverAlt),
            heading(d.title),
            kv([
              ["period:", `${d.period} · ${d.role}`],
              ["stack:", d.stack.join(", ")],
            ]),
            p(d.summary),
            d.repo ? `<p class="pv-p">↳ <a href="${d.repo}">github — ${esc(entry.id)}</a></p>` : "",
            keyHint([["⏎", "open the file"]]),
          ].join(""),
  };
}

export async function projectVMs(
  projects: ProjectEntry[],
  selectedId?: string,
  opened = false,
): Promise<EntryVM[]> {
  const sorted = [...projects].sort(projectOrder);
  const target = selectedId ?? sorted[0]?.id;
  return Promise.all(sorted.map((entry) => projectVM(entry, entry.id === target, opened)));
}

type PostEntry = CollectionEntry<"blog">;

async function postVM(entry: PostEntry, selected: boolean, opened = false): Promise<EntryVM> {
  const d = entry.data;
  return {
    name: `${entry.id}.md`,
    kind: "file",
    href: `/blog/${entry.id}/`,
    note: truncateNote(d.summary),
    size: sizeOf(entry.body),
    date: dateOf(d.published),
    selected,
    previewTitle: `preview — ${entry.id}.md`,
    previewHTML:
      selected && opened
        ? ""
        : [
            await coverFor(d.cover, d.coverAlt),
            heading(d.title),
            kv([["date:", `${dateOf(d.published)} · ${d.tags.join(", ")}`]]),
            p(d.summary),
            keyHint([["⏎", "read the post"]]),
          ].join(""),
  };
}

export async function postVMs(
  posts: PostEntry[],
  selectedId?: string,
  opened = false,
): Promise<EntryVM[]> {
  const sorted = [...posts].sort(postOrder);
  const target = selectedId ?? sorted[0]?.id;
  return Promise.all(sorted.map((entry) => postVM(entry, entry.id === target, opened)));
}

type LegalEntry = CollectionEntry<"legal">;

/** alphabetisch: imprint vor privacy */
export function legalVMs(legal: LegalEntry[], selectedId?: string, opened = false): EntryVM[] {
  const sorted = [...legal].sort((a, b) => a.id.localeCompare(b.id));
  const target = selectedId ?? sorted[0]?.id;
  return sorted.map((entry) => {
    const d = entry.data;
    const selected = entry.id === target;
    return {
      name: `${entry.id}.md`,
      kind: "file",
      href: `/legal/${entry.id}/`,
      note: truncateNote(d.summary),
      size: sizeOf(entry.body),
      date: dateOf(d.updated),
      selected,
      previewTitle: `preview — ${entry.id}.md`,
      previewHTML:
        selected && opened
          ? ""
          : [
              heading(d.title),
              kv([["updated:", dateOf(d.updated)]]),
              p(d.summary),
              keyHint([["⏎", "open the file"]]),
            ].join(""),
    };
  });
}
