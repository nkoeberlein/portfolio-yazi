/**
 * Builds EntryVMs from Content Collections — for directory listings and for
 * sibling lists on file pages (one shared builder per collection).
 * The opened file (`opened`) does not receive a preview template: its document
 * already occupies the preview pane, and keynav.ts restores it upon return.
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

/** Featured entries first, then newest first. */
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
            d.repo
              ? `<p class="pv-p">↳ <a href="${esc(d.repo)}">github — ${esc(entry.id)}</a></p>`
              : "",
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
  const vms = await Promise.all(sorted.map((entry) => postVM(entry, entry.id === target, opened)));
  // The RSS feed is itself an entry of the blog directory.
  vms.push({
    name: "feed.xml",
    kind: "file",
    href: "/blog/feed.xml",
    note: "subscribe via RSS",
    size: "—",
    date: "",
    selected: false,
    previewTitle: "preview — feed.xml",
    previewHTML: [
      heading("RSS feed"),
      kv([["url:", "/blog/feed.xml"]]),
      p("Every post in this directory, as an RSS 2.0 feed — point your reader at this file."),
      keyHint([["⏎", "open the feed"]]),
    ].join(""),
  });
  return vms;
}

type LegalEntry = CollectionEntry<"legal">;

/** Alphabetical order: imprint before privacy. */
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
