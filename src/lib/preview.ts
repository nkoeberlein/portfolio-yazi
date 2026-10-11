/**
 * Bausteine für Preview-HTML. Ausgaben sind escaped — sie werden in
 * <template>-Elementen bzw. #preview-body über set:html gerendert.
 * Rein (per `node --test` prüfbar), deshalb Importe mit Dateiendung.
 */
import { esc } from "./format.ts";
import { iconFor } from "./icons.ts";

export const p = (text: string): string => `<p class="pv-p">${esc(text)}</p>`;

export const heading = (text: string): string => `<h3 class="pv-h">${esc(text)}</h3>`;

export const bullets = (items: string[]): string =>
  `<ul class="pv-ul">${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`;

export const kv = (items: Array<[string, string]>): string =>
  items
    .map(
      ([key, value]) => `<p class="pv-p"><span class="pv-kv">${esc(key)}</span> ${esc(value)}</p>`,
    )
    .join("");

export const hint = (text: string): string => `<p class="pv-hint">${text}</p>`; // hint darf <b>-Markup enthalten

/** Tastaturhinweis mit <b>-Markern (einziger nicht-escapeter Block). */
export const keyHint = (parts: Array<[string, string]>): string =>
  hint(parts.map(([key, label]) => `<b>${esc(key)}</b> ${esc(label)}`).join(" · "));

/** Ordner-Preview wie in Yazi: die Dateiliste des markierten Verzeichnisses. */
export const listing = (names: string[]): string =>
  `<ul class="pv-ls">${names
    .map(
      (name) =>
        `<li class="${name.endsWith("/") ? "dir" : "file"}"><span class="glyph" aria-hidden="true">${iconFor(name)}</span><span class="c-name">${esc(name)}</span></li>`,
    )
    .join("")}</ul>`;

export interface FigureSpec {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
}

/** Bild für die Preview-Pane. In <template> lädt es erst, wenn es geklont wird. */
export const figure = ({ src, width, height, alt, caption }: FigureSpec): string =>
  `<figure class="pv-img"><img src="${esc(src)}" width="${width}" height="${height}" alt="${esc(alt)}" decoding="async" />${
    caption ? `<figcaption>${esc(caption)}</figcaption>` : ""
  }</figure>`;
