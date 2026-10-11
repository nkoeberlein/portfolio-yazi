/**
 * Liest die Mermaid-Beispieldateien (`src/content/diagrams/*.mmd`) für die
 * Collection `diagrams`. Metadaten stehen als Kommentarkopf in der Datei:
 *
 *   %% title: Flowchart
 *   %% summary: Decisions and pipelines.
 *   %% updated: 2026-10-11
 *   flowchart TD …
 *
 * Rein bis auf `readDiagrams` (Dateisystem); per `node --test` prüfbar.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface DiagramFile {
  id: string;
  title: string;
  summary: string;
  updated: string;
  /** Mermaid-Quelltext ohne den Kommentarkopf */
  code: string;
}

const HEADER = /^%%\s*(\w+):\s*(.*)$/;

export function parseDiagramFile(id: string, text: string): DiagramFile {
  const lines = text.replaceAll("\r\n", "\n").split("\n");
  const meta = new Map<string, string>();
  let start = 0;
  for (const line of lines) {
    const match = HEADER.exec(line.trim());
    if (!match) break;
    meta.set(match[1] ?? "", (match[2] ?? "").trim());
    start += 1;
  }
  const field = (key: string): string => {
    const value = meta.get(key);
    if (!value) throw new Error(`Diagram ${id}.mmd: missing "%% ${key}: …" header line`);
    return value;
  };
  const code = lines.slice(start).join("\n").trim();
  if (!code) throw new Error(`Diagram ${id}.mmd: no diagram source below the header`);
  return {
    id,
    title: field("title"),
    summary: field("summary"),
    updated: field("updated"),
    code,
  };
}

/** Alle `.mmd`-Dateien eines Verzeichnisses, alphabetisch. */
export function readDiagrams(dir: string): DiagramFile[] {
  return readdirSync(dir)
    .filter((file) => file.endsWith(".mmd"))
    .sort()
    .map((file) => parseDiagramFile(file.slice(0, -4), readFileSync(join(dir, file), "utf8")));
}
