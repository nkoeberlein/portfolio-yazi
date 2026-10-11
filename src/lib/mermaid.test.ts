import assert from "node:assert/strict";
import { test } from "node:test";
import { labelFromMeta, mermaidFigure } from "./mermaid.ts";

const FLOW = "graph LR\n  A[Capture] --> B{Store}\n  B -->|ok| C[Replay]";

test("mermaidFigure: Flowchart wird zu einer Figur mit Inline-SVG", () => {
  const html = mermaidFigure(FLOW, "Replay pipeline");
  assert.match(html, /^<figure class="mermaid" role="img" aria-label="Replay pipeline"><svg/);
  assert.match(html, /Capture/);
  assert.match(html, /<\/svg><\/figure>$/);
});

test("mermaidFigure: keine festen Farben, kein Drittanbieter-Request", () => {
  const html = mermaidFigure(FLOW);
  assert.doesNotMatch(html, /#[0-9a-fA-F]{3,8}\b/);
  assert.doesNotMatch(html, /@import|googleapis/);
  assert.doesNotMatch(html, /<svg[^>]*\sstyle=/);
  assert.match(html, /var\(--fg\)/);
});

test("mermaidFigure: Label wird escaped", () => {
  assert.match(mermaidFigure(FLOW, 'a "b" <c>'), /aria-label="a &quot;b&quot; &lt;c&gt;"/);
});

test("mermaidFigure: nicht unterstützte Typen brechen den Build ab", () => {
  assert.throws(() => mermaidFigure("gantt\n  title Plan"), /"gantt" could not be rendered/);
  assert.throws(() => mermaidFigure("pie\n  title X"), /Supported types: graph, flowchart/);
});

test('labelFromMeta: liest alt="…", sonst undefined', () => {
  assert.equal(labelFromMeta('alt="Replay pipeline"'), "Replay pipeline");
  assert.equal(labelFromMeta("title=x"), undefined);
  assert.equal(labelFromMeta(null), undefined);
});
