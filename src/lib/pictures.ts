/**
 * EntryVMs für `~/pictures/`: Bilddateien als Einträge, die Preview zeigt das
 * Bild (wie Yazi). Größenspalte = Pixelmaße, da es keine echte Dateigröße gibt.
 */
import type { CollectionEntry } from "astro:content";
import type { EntryVM } from "../components/FileList.astro";
import { dateOf } from "./format";
import { figureFor } from "./images";
import { truncateNote } from "./listing";
import { keyHint, kv } from "./preview";

type PictureEntry = CollectionEntry<"pictures">;

/** neueste zuerst */
const pictureOrder = (a: PictureEntry, b: PictureEntry): number =>
  b.data.taken.getTime() - a.data.taken.getTime();

export const pictureName = (entry: PictureEntry): string =>
  `${entry.id}.${entry.data.image.format}`;

export const dimensionsOf = (entry: PictureEntry): string =>
  `${entry.data.image.width}×${entry.data.image.height}`;

async function pictureVM(
  entry: PictureEntry,
  selected: boolean,
  opened: boolean,
): Promise<EntryVM> {
  const d = entry.data;
  const name = pictureName(entry);
  return {
    name,
    kind: "file",
    href: `/pictures/${entry.id}/`,
    note: truncateNote(d.caption),
    size: dimensionsOf(entry),
    date: dateOf(d.taken),
    selected,
    previewTitle: `preview — ${name}`,
    previewHTML:
      selected && opened
        ? ""
        : [
            await figureFor(d.image, d.alt, d.caption),
            kv([["taken:", `${dateOf(d.taken)} · ${dimensionsOf(entry)}`]]),
            keyHint([["⏎", "view the image"]]),
          ].join(""),
  };
}

export async function pictureVMs(
  pictures: PictureEntry[],
  selectedId?: string,
  opened = false,
): Promise<EntryVM[]> {
  const sorted = [...pictures].sort(pictureOrder);
  const target = selectedId ?? sorted[0]?.id;
  return Promise.all(sorted.map((entry) => pictureVM(entry, entry.id === target, opened)));
}
