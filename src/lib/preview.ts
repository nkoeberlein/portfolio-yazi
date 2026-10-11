/**
 * Building blocks for preview pane HTML. All outputs are escaped — they are
 * rendered via `set:html` in `<template>` elements or directly in `#preview-body`.
 * Pure and testable via `node --test` (hence the file extension in imports).
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

export const hint = (text: string): string => `<p class="pv-hint">${text}</p>`; // Hint may contain <b> markup

/** Keyboard hint with <b> tags for keys. */
export const keyHint = (parts: Array<[string, string]>): string =>
  hint(parts.map(([key, label]) => `<b>${esc(key)}</b> ${esc(label)}`).join(" · "));

/** Directory preview modeled after Yazi: file list of the highlighted directory. */
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

/** Image for the preview pane. When inside `<template>`, it only loads when cloned. */
export const figure = ({ src, width, height, alt, caption }: FigureSpec): string =>
  `<figure class="pv-img"><img src="${esc(src)}" width="${width}" height="${height}" alt="${esc(alt)}" decoding="async" />${
    caption ? `<figcaption>${esc(caption)}</figcaption>` : ""
  }</figure>`;
