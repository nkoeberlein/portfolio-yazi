/**
 * Mermaid-Diagramme beim Build: ```mermaid-Codeblöcke werden zu Inline-SVG —
 * kein JavaScript im Browser. Rein (per `node --test` prüfbar).
 *
 * Farben stehen NICHT im SVG: der Renderer referenziert nur die Variablen
 * --bg/--fg/--line/--accent/--muted/--surface/--border, die `.mermaid` in
 * doc.css auf den Flavor abbildet. So bleibt der Flavor austauschbar.
 */
import { renderMermaidSVG } from "beautiful-mermaid";
import { defineHastPlugin } from "satteri";
import { esc } from "./format.ts";

/** Was `beautiful-mermaid` zeichnen kann (kein gantt, pie, mindmap, gitGraph). */
export const SUPPORTED = [
  "graph",
  "flowchart",
  "sequenceDiagram",
  "classDiagram",
  "erDiagram",
  "stateDiagram",
  "stateDiagram-v2",
  "xychart-beta",
] as const;

// Farben sind Platzhalter und werden nach dem Rendern entfernt (siehe `detheme`);
// engere Abstände, damit auch längere Flowcharts in den Preview-Pane passen.
const NEUTRAL = {
  bg: "white",
  fg: "black",
  font: "JetBrains Mono",
  padding: 20,
  layerSpacing: 28,
} as const;

/**
 * Entfernt, was der Renderer fest einbaut und hier nicht sein darf:
 * den Google-Fonts-`@import` (kein Drittanbieter-Request, siehe privacy.md)
 * und die Inline-Farben am <svg> (sie würden die Flavor-Variablen überdecken).
 */
function detheme(svg: string): string {
  return svg
    .replace(/@import url\([^)]*\);?\s*/g, "")
    .replace(/(<svg\b[^>]*?)\s+style="[^"]*"/, "$1");
}

/** Mermaid-Quelltext → `<figure class="mermaid">` mit Inline-SVG. Wirft bei Fehlern. */
export function mermaidFigure(code: string, label = "Diagram"): string {
  let svg: string;
  try {
    svg = renderMermaidSVG(code, NEUTRAL);
  } catch (cause) {
    const header = code.trim().split("\n")[0] ?? "";
    throw new Error(
      `Mermaid diagram "${header}" could not be rendered. Supported types: ${SUPPORTED.join(", ")}.`,
      { cause },
    );
  }
  return `<figure class="mermaid" role="img" aria-label="${esc(label)}">${detheme(svg)}</figure>`;
}

/** Beschriftung aus der Fence-Meta: ```mermaid alt="Replay pipeline" */
export function labelFromMeta(meta: string | null | undefined): string | undefined {
  return meta?.match(/alt="([^"]*)"/)?.[1] || undefined;
}

/** `data.meta` trägt die Fence-Meta, ist in den hast-Typen aber nicht deklariert. */
function metaOf(data: unknown): string | undefined {
  if (typeof data !== "object" || data === null || !("meta" in data)) return undefined;
  return typeof data.meta === "string" ? data.meta : undefined;
}

const failures: string[] = [];

/** Astro-Integration: bricht den Build ab, wenn ein Diagramm nicht gerendert werden konnte. */
export function mermaidGuard() {
  return {
    name: "mermaid-guard",
    hooks: {
      "astro:build:done": () => {
        if (failures.length === 0) return;
        throw new Error(`Mermaid: ${failures.length} diagram(s) failed\n${failures.join("\n")}`);
      },
    },
  };
}

/** Sätteri-hast-Plugin für `astro.config.mjs`; `mermaid` muss von Shiki ausgenommen sein. */
export function mermaidPlugin() {
  return defineHastPlugin({
    name: "mermaid",
    element: {
      filter: ["pre"],
      visit(node, ctx) {
        const code = node.children?.find(
          (child) => child.type === "element" && child.tagName === "code",
        );
        if (code?.type !== "element") return;
        const classes = code.properties?.className;
        if (!Array.isArray(classes) || !classes.includes("language-mermaid")) return;
        try {
          const html = mermaidFigure(ctx.textContent(code), labelFromMeta(metaOf(code.data)));
          return { type: "raw", value: html };
        } catch (error) {
          // Astros Content-Loader protokolliert Render-Fehler nur und baut weiter —
          // `mermaidGuard()` lässt den Build deshalb am Ende scheitern.
          failures.push(`${ctx.fileURL?.pathname ?? "?"}: ${String(error)}`);
          throw error;
        }
      },
    },
  });
}
