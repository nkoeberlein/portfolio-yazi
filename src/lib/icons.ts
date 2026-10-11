/**
 * SVG icons for the file tree, sourced as raw paths from the
 * `material-icon-theme` Iconify dataset and inlined at build time — no icon
 * runtime, no client JS. Colors come from the flavor palette (`currentColor`
 * per file type, exactly like Yazi flavor `[filetype]` rules); the two-tone
 * folder badges use the derived `--icon-badge` variable.
 *
 * Pure module — testable via `node --test` (hence the file extensions in imports).
 */
import iconSet from "@iconify-json/material-icon-theme/icons.json" with { type: "json" };
import { SITE } from "../site.config.ts";

interface IconData {
  body: string;
  width?: number;
  height?: number;
}

const icons = iconSet.icons as unknown as Record<string, IconData>;

/** Specialized folder glyphs for well-known directories (VS Code style naming). */
const FOLDER_ICONS: Record<string, string> = {
  "projects/": "folder-src",
  "blog/": "folder-docs",
  "pictures/": "folder-images",
  "diagrams/": "folder-connection",
  "legal/": "folder-policy",
};
const HOME_DIR = `${SITE.user}/`;

const IMAGE = /\.(svg|png|jpe?g|webp|avif|gif)$/;

/**
 * Builds the inline SVG for an icon of the set, recoloring it:
 * - folders are two-tone (dark body + light badge) — body → currentColor,
 *   badge → `--icon-badge` (defined in list.css from the flavor).
 * - all other icons are single-color → currentColor, tinted via CSS class.
 * Fails the build if an icon deviates from this shape (set updated upstream).
 */
function svgOf(iconName: string, folder: boolean, cls = ""): string {
  const icon = icons[iconName];
  if (!icon) throw new Error(`Unknown material-icon-theme icon: ${iconName}`);
  let { body } = icon;
  const fills = [...new Set([...body.matchAll(/fill="(#[0-9a-fA-F]{6})"/g)].map((m) => m[1]))];
  if (folder) {
    if (fills.length !== 2)
      throw new Error(`Folder icon "${iconName}": expected 2 fills, got ${fills.length}`);
    body = body.replaceAll(`fill="${fills[0]}"`, 'fill="currentColor"');
    body = body.replaceAll(`fill="${fills[1]}"`, 'style="fill:var(--icon-badge)"');
  } else {
    if (fills.length !== 1)
      throw new Error(`File icon "${iconName}": expected 1 fill, got ${fills.length}`);
    body = body.replaceAll(`fill="${fills[0]}"`, 'fill="currentColor"');
  }
  // The set omits dimensions on its native 16×16 icons; wider grids (24/32/64)
  // are declared per icon.
  const width = icon.width ?? 16;
  const height = icon.height ?? 16;
  return `<svg class="ic${cls ? ` ic-${cls}` : ""}" viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false">${body}</svg>`;
}

/** Inline SVG icon for a tree entry, flavored per type (dirs always `--dir`).
 * Directories render both the closed and the open variant; CSS shows the open
 * one on the selected row (`.sel`), like expanding a folder in VS Code. */
export function iconFor(entryName: string): string {
  if (entryName.endsWith("/")) {
    const folder =
      entryName === HOME_DIR ? "folder-home" : (FOLDER_ICONS[entryName] ?? "folder-base");
    return `${svgOf(folder, true, "closed")}${svgOf(`${folder}-open`, true, "open")}`;
  }
  if (IMAGE.test(entryName)) return svgOf("image", false, "img");
  if (entryName.endsWith(".mmd")) return svgOf("mermaid", false, "mmd");
  if (entryName.endsWith(".md")) return svgOf("markdown", false, "doc");
  if (entryName.endsWith(".xml")) return svgOf("xml", false, "doc");
  return svgOf("document", false, entryName.endsWith(".txt") ? "doc" : "");
}

/** Box-drawing pieces for panes and status lines. */
export const box = {
  vertical: "│",
  horizontal: "─",
  topLeft: "┌",
  topRight: "┐",
  bottomLeft: "└",
  bottomRight: "┘",
  cross: "┼",
} as const;
