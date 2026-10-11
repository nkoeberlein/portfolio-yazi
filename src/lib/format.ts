/** Formatierer für die ls-artigen Metadatenspalten (alles fest in `ch`). */

/** Aus Markdown-Body eine plausible Dateigröße formatieren (KiB). */
export function sizeOf(body: string | undefined): string {
  const bytes = (body ?? "").length;
  return `${Math.max(1, Math.round(bytes / 102.4) / 10).toFixed(1)}K`;
}

/** ISO-Datum → `YYYY-MM-DD` (10 Zeichen, monospace-exakt). Fallback auf `—` bei ungültigem/fehlendem Wert. */
export function dateOf(value: Date | string | undefined | null): string {
  if (value === undefined || value === null) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toISOString().slice(0, 10);
}

/** HTML-Escaping für Inhalte, die via set:html in Templates landen. */
export function esc(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
