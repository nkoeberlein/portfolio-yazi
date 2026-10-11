/**
 * Mermaid diagrams rendered at build time: ```mermaid code blocks are transformed
 * into inline SVGs — zero client-side JavaScript. Pure and testable via `node --test`.
 *
 * Colors are NOT hardcoded in the SVG: the renderer references CSS variables
 * --bg/--fg/--line/--accent/--muted/--surface/--border, which `.mermaid` in
 * `doc.css` maps to the theme flavor. This allows flavors to remain swappable.
 */
import { renderMermaidSVG } from "beautiful-mermaid";
import { defineHastPlugin } from "satteri";
import { esc } from "./format.ts";

/** Diagram types supported by `beautiful-mermaid` (excludes gantt, pie, mindmap, gitGraph). */
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

// Colors are placeholders stripped after rendering (see `detheme`);
// tighter spacing ensures tall flowcharts fit within the preview pane.
const NEUTRAL = {
  bg: "white",
  fg: "black",
  font: "JetBrains Mono",
  padding: 20,
  layerSpacing: 28,
} as const;

/**
 * Strips hardcoded artifacts inserted by the renderer:
 * Google Fonts `@import` (prevents third-party requests, see privacy.md)
 * and inline colors on the `<svg>` (which would override flavor CSS variables).
 */
function detheme(svg: string): string {
  return svg
    .replace(/@import url\([^)]*\);?\s*/g, "")
    .replace(/(<svg\b[^>]*?)\s+style="[^"]*"/, "$1");
}

/** Mermaid source code → `<figure class="mermaid">` with inline SVG. Throws on error. */
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

/** Label extracted from code block fence metadata: ```mermaid alt="Replay pipeline" */
export function labelFromMeta(meta: string | null | undefined): string | undefined {
  return meta?.match(/alt="([^"]*)"/)?.[1] || undefined;
}

/** `data.meta` contains fence metadata, but is untyped in HAST element types. */
function metaOf(data: unknown): string | undefined {
  if (typeof data !== "object" || data === null || !("meta" in data)) return undefined;
  return typeof data.meta === "string" ? data.meta : undefined;
}

const failures: string[] = [];

/** Astro integration: halts build if any diagram failed rendering. */
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

/** Sätteri HAST plugin for `astro.config.mjs`; `mermaid` must be excluded from Shiki. */
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
          // Astro content loader logs render errors and continues —
          // `mermaidGuard()` ensures the build ultimately fails on errors.
          failures.push(`${ctx.fileURL?.pathname ?? "?"}: ${String(error)}`);
          throw error;
        }
      },
    },
  });
}
