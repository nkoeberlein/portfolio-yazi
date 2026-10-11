/**
 * EntryVMs für `~/diagrams/`: Mermaid-Beispieldateien als Einträge, die Preview
 * zeigt das gerenderte Diagramm. Ein fehlerhaftes Beispiel wirft und stoppt den Build.
 */
import type { CollectionEntry } from "astro:content";
import type { EntryVM } from "../components/FileList.astro";
import { dateOf, sizeOf } from "./format";
import { truncateNote } from "./listing";
import { mermaidFigure } from "./mermaid";
import { keyHint, p } from "./preview";

type DiagramEntry = CollectionEntry<"diagrams">;

export function diagramVMs(
  diagrams: DiagramEntry[],
  selectedId?: string,
  opened = false,
): EntryVM[] {
  const sorted = [...diagrams].sort((a, b) => a.id.localeCompare(b.id));
  const target = selectedId ?? sorted[0]?.id;
  return sorted.map((entry) => {
    const d = entry.data;
    const selected = entry.id === target;
    return {
      name: `${entry.id}.mmd`,
      kind: "file",
      href: `/diagrams/${entry.id}/`,
      note: truncateNote(d.summary),
      size: sizeOf(d.code),
      date: dateOf(d.updated),
      selected,
      previewTitle: `preview — ${entry.id}.mmd`,
      previewHTML:
        selected && opened
          ? ""
          : [
              mermaidFigure(d.code, d.title),
              p(d.summary),
              keyHint([["⏎", "open for the source"]]),
            ].join(""),
    };
  });
}
