import assert from "node:assert/strict";
import { test } from "node:test";
import { ASTRO_LOGO, fetchHTML } from "./fetch.ts";

test("ASTRO_LOGO: alle Zeilen gleich breit (Monospace-Raster)", () => {
  const widths = new Set(ASTRO_LOGO.map((line) => line.length));
  assert.equal(widths.size, 1);
  assert.ok(ASTRO_LOGO.length >= 10);
});

test("ASTRO_LOGO: spiegelsymmetrisch um die Mittelachse", () => {
  const mirror: Record<string, string> = { "▌": "▐", "▐": "▌" };
  // Breite des symmetrischen Feldes: linker Rand + Inhalt + gleich breiter rechter Rand.
  const fields = ASTRO_LOGO.map((line) => {
    const content = line.trim();
    const indent = line.length - line.trimStart().length;
    return { content, indent, field: indent * 2 + content.length };
  });
  assert.equal(new Set(fields.map((f) => f.field)).size, 1, "Zeilen haben verschiedene Achsen");
  for (const { content } of fields) {
    const flipped = [...content].reverse().map((char) => mirror[char] ?? char);
    assert.equal(flipped.join(""), content, `schief: "${content}"`);
  }
});

test("fetchHTML: Titel, Trennlinie in Titelbreite, Zeilen in Reihenfolge", () => {
  const html = fetchHTML({
    user: "max",
    host: "host",
    rows: [
      ["role", "Engineer"],
      ["projects", "6"],
    ],
  });
  assert.match(html, /max<span class="fetch-at">@<\/span>host/);
  assert.match(html, />─{8}</);
  assert.ok(html.indexOf("<dt>role</dt>") < html.indexOf("<dt>projects</dt><dd>6</dd>"));
  assert.match(html, /<pre class="fetch-art" aria-hidden="true">/);
});

test("fetchHTML: Werte werden escaped", () => {
  const html = fetchHTML({ user: "a<b", host: "c", rows: [["k&", '<i>"x"</i>']] });
  assert.match(html, /a&lt;b/);
  assert.match(html, /<dt>k&amp;<\/dt><dd>&lt;i&gt;&quot;x&quot;&lt;\/i&gt;<\/dd>/);
});
