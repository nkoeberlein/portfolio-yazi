/** Formatters for the ls-style metadata columns (rendered in monospace `ch` units). */

/** Formats a plausible file size in KiB from markdown content body. */
export function sizeOf(body: string | undefined): string {
  const bytes = (body ?? "").length;
  return `${Math.max(1, Math.round(bytes / 102.4) / 10).toFixed(1)}K`;
}

/** Formats ISO timestamp or Date object to `YYYY-MM-DD` (exact 10 monospace characters). Falls back to `—`. */
export function dateOf(value: Date | string | undefined | null): string {
  if (value === undefined || value === null) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toISOString().slice(0, 10);
}

/** HTML escaping for content injected into templates via set:html. */
export function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
