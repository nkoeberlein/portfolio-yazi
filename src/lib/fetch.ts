/**
 * Fastfetch-style profile card for the homepage: ASCII logo on the left,
 * key/value pairs on the right. Pure and testable via `node --test`;
 * styling and colors are defined in `fetch.css`.
 */
import { esc } from "./format.ts";

// Astro rocket logo with notch and flame. Composed solely of Unicode block
// elements included in JetBrains Mono. Symmetrical around the center axis.
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
  /** Rows in display order: [key, value] */
  rows: ReadonlyArray<readonly [string, string]>;
}

/** Number of color swatches under the card (`sw-1` ... in `fetch.css`). */
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
