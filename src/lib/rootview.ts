/**
 * Root view `~/`: builds EntryVMs from the root tree and the five collections.
 * Used by index.astro (tree mode) and the leaf pages welcome/about/now/cv/skills/contact
 * (opened mode: the opened file does not need a template).
 */
import { getCollection } from "astro:content";
import type { EntryVM } from "../components/FileList.astro";
import { SITE } from "../site.config";
import { diagramVMs } from "./diagrams";
import { fetchHTML } from "./fetch";
import { dateOf } from "./format";
import { legalVMs, postVMs, projectVMs } from "./listing";
import { pictureVMs } from "./pictures";
import { bullets, heading, keyHint, listing, p } from "./preview";
import { ROOT } from "./tree";

// Sample sizes/dates for static root metadata (simulated filesystem).
const ROOT_META: Record<string, { size: string; date: string }> = {
  "welcome.txt": { size: "0.6K", date: "2026-10-11" },
  "about.md": { size: "1.1K", date: "2026-10-11" },
  "now.md": { size: "0.9K", date: "2026-10-11" },
  "cv.md": { size: "2.4K", date: "2026-09-28" },
  "skills.md": { size: "1.6K", date: "2026-10-02" },
  "contact.md": { size: "0.7K", date: "2026-10-11" },
};

interface Counts {
  projects: number;
  posts: number;
}

/** Homepage bio (also featured on `/welcome/`), derived from `site.config.ts`. */
export function welcomeFetch(counts: Counts): string {
  return fetchHTML({
    user: SITE.user,
    host: SITE.host,
    rows: [
      ["role", SITE.role],
      ["location", SITE.location],
      ["os", "Astro, static"],
      ["shell", "yazi-style TUI"],
      ["stack", SITE.stack.join(", ")],
      ["uptime", SITE.uptime],
      ["projects", String(counts.projects)],
      ["posts", String(counts.posts)],
      ["flavor", SITE.flavor],
    ],
  });
}

/** File previews for `~/`; directories display their file listing instead. */
function filePreviews(counts: Counts): Map<string, { title: string; html: string }> {
  return new Map([
    [
      "welcome.txt",
      {
        title: "preview — welcome.txt",
        html:
          welcomeFetch(counts) +
          keyHint([
            ["↑/↓", "move"],
            ["→", "open"],
            ["?", "all keys"],
          ]),
      },
    ],
    [
      "about.md",
      {
        title: "preview — about.md",
        html:
          heading(`hi, I'm ${SITE.name}`) +
          p(
            `${SITE.role} in ${SITE.location.split(",")[0]}. Ten years of making distributed systems boring: queueing arithmetic instead of heroics, paved roads instead of platforms nobody uses.`,
          ) +
          bullets([
            "platform & infrastructure — tooling that deletes work",
            "observability — p99 budgets, not average dashboards",
            "this site is a TUI: j/k to move, Enter to open",
          ]),
      },
    ],
    [
      "now.md",
      {
        title: "preview — now.md",
        html:
          heading("what I'm doing now") +
          bullets([
            "shipping loadsmith 2.0 — replay from object storage",
            "learning: eBPF for request tracing",
            "reading: “Designing Data-Intensive Applications”, again",
          ]) +
          keyHint([["⏎", "open now.md"]]),
      },
    ],
    [
      "cv.md",
      {
        title: "preview — cv.md",
        html:
          heading("resume, in one pane") +
          p(
            `${SITE.role} at Nordwind Systems (${SITE.location.split(",")[0]}) since 2022. Before: Feldpfad GmbH, Kanal&Co.`,
          ) +
          bullets([
            "platform & release automation",
            "distributed systems in Go & Rust",
            "10y experience, MSc CS",
          ]) +
          keyHint([["⏎", "open cv.md"]]),
      },
    ],
    [
      "skills.md",
      {
        title: "preview — skills.md",
        html:
          heading("toolbox") +
          p(
            `${SITE.stack.join(", ")} · Kubernetes, Terraform, Postgres — the soft skills documented where they matter.`,
          ) +
          keyHint([["⏎", "open skills.md"]]),
      },
    ],
    [
      "contact.md",
      {
        title: "preview — contact.md",
        html:
          heading("reach me") +
          bullets([
            SITE.email,
            SITE.github.replace(/^https?:\/\//, ""),
            "replies < 24h, Berlin time",
          ]) +
          keyHint([["⏎", "open contact.md"]]),
      },
    ],
  ]);
}

/** File names and newest timestamp per directory — used for directory previews and date column. */
async function directories(): Promise<Map<string, { names: string[]; newest: Date | undefined }>> {
  const [projects, posts, pictures, legal, diagrams] = await Promise.all([
    getCollection("projects"),
    getCollection("blog"),
    getCollection("pictures"),
    getCollection("legal"),
    getCollection("diagrams"),
  ]);
  const newest = (dates: (Date | undefined)[]): Date | undefined => {
    const valid = dates.filter((d): d is Date => d instanceof Date && !Number.isNaN(d.getTime()));
    return valid.length > 0 ? new Date(Math.max(...valid.map((d) => d.getTime()))) : undefined;
  };
  const names = (vms: EntryVM[]): string[] => vms.map((vm) => vm.name);

  return new Map([
    [
      "projects/",
      {
        names: names(await projectVMs(projects)),
        newest: newest(projects.map((entry) => entry.data.updated)),
      },
    ],
    [
      "blog/",
      {
        names: names(await postVMs(posts)),
        newest: newest(posts.map((entry) => entry.data.published)),
      },
    ],
    [
      "pictures/",
      {
        names: names(await pictureVMs(pictures)),
        newest: newest(pictures.map((entry) => entry.data.taken)),
      },
    ],
    [
      "diagrams/",
      {
        names: names(diagramVMs(diagrams)),
        newest: newest(diagrams.map((entry) => entry.data.updated)),
      },
    ],
    [
      "legal/",
      {
        names: names(legalVMs(legal)),
        newest: newest(legal.map((entry) => entry.data.updated)),
      },
    ],
  ]);
}

export async function rootVMs(
  selectedHref: string,
  opened = false,
): Promise<{ entries: EntryVM[]; counts: Counts }> {
  const dirs = await directories();
  const counts: Counts = {
    projects: dirs.get("projects/")?.names.length ?? 0,
    posts: dirs.get("blog/")?.names.length ?? 0,
  };
  const files = filePreviews(counts);

  const entries: EntryVM[] = ROOT.map((entry) => {
    const dir = dirs.get(entry.name);
    const preview = dir
      ? { title: `preview — ${entry.name}`, html: listing(dir.names) }
      : files.get(entry.name);
    if (!preview) throw new Error(`Missing root preview for ${entry.name}`);
    const meta = dir ? { size: "—", date: dateOf(dir.newest) } : ROOT_META[entry.name];
    if (!meta) throw new Error(`Missing root meta for ${entry.name}`);
    const selected = entry.href === selectedHref;
    return {
      ...entry,
      size: meta.size,
      date: meta.date,
      selected,
      previewTitle: preview.title,
      previewHTML: selected && opened ? "" : preview.html,
    };
  });

  return { entries, counts };
}
