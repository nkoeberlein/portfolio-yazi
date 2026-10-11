/**
 * Startseiten-Steckbrief im fastfetch-Stil: ASCII-Logo links, Schlüssel/Wert-
 * Zeilen rechts. Rein (per `node --test` prüfbar); Farben kommen aus fetch.css.
 */
import { esc } from "./format.ts";

// Astro-Logo: die Rakete mit Kerbe, darunter die Flamme. Nur Block-Elemente,
// die JetBrains Mono enthält. Spiegelsymmetrisch um die Mittelachse (Test!);
// Zeilen werden unten auf gleiche Breite gebracht.
const LOGO_SOURCE = [
  "            ▄██▄",
  "           ██████",
  "          ████████",
  "         ███▀  ▀███",
  "        ████    ████",
  "       ████▌    ▐████",
  "      █████      █████",
  "     █████▌      ▐█████",
  "    ██████   ▄▄   ██████",
  "   ██████▄▄██████▄▄██████",
  "  ████████▀▀    ▀▀████████",
  "  ▀▀▀▀▀▀            ▀▀▀▀▀▀",
  "        ▀█▄      ▄█▀",
  "          ▀██▄▄██▀",
  "            ▀██▀",
];

const LOGO_WIDTH = Math.max(...LOGO_SOURCE.map((line) => line.length));

export const ASTRO_LOGO: readonly string[] = LOGO_SOURCE.map((line) => line.padEnd(LOGO_WIDTH));

export interface FetchInfo {
  user: string;
  host: string;
  /** Zeilen in Anzeigereihenfolge: [Schlüssel, Wert] */
  rows: ReadonlyArray<readonly [string, string]>;
}

/** Anzahl der Farbfelder unter dem Steckbrief (Klassen `sw-1` … in fetch.css). */
const SWATCHES = 8;

export function fetchHTML({ user, host, rows }: FetchInfo): string {
  const title = `${esc(user)}<span class="fetch-at">@</span>${esc(host)}`;
  const rule = "─".repeat(user.length + host.length + 1);
  const list = rows
    .map(([key, value]) => `<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`)
    .join("");
  const swatches = Array.from({ length: SWATCHES }, (_, i) => `<span class="sw-${i + 1}"></span>`);
  return [
    '<div class="fetch">',
    `<pre class="fetch-art" aria-hidden="true">${ASTRO_LOGO.join("\n")}</pre>`,
    '<div class="fetch-info">',
    `<p class="fetch-title">${title}</p>`,
    `<p class="fetch-rule" aria-hidden="true">${rule}</p>`,
    `<dl>${list}</dl>`,
    `<p class="fetch-swatches" aria-hidden="true">${swatches.join("")}</p>`,
    "</div></div>",
  ].join("");
}
