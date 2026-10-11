import assert from "node:assert/strict";
import { test } from "node:test";
import { iconFor } from "./icons.ts";

test("iconFor: inlines an accessible svg without hardcoded colors", () => {
  const svg = iconFor("skills.md");
  assert.match(svg, /^<svg /);
  assert.match(svg, /aria-hidden="true"/);
  assert.match(svg, /viewBox="0 0 \d+ \d+"/);
  assert.match(svg, /fill="currentColor"/);
  assert.doesNotMatch(svg, /#[0-9a-fA-F]{6}/); // no baked-in hex from the icon set
});

test("iconFor: file types map to flavored icon classes", () => {
  assert.match(iconFor("cover.png"), /class="ic ic-img"/);
  assert.match(iconFor("cover.svg"), /class="ic ic-img"/);
  assert.match(iconFor("post.md"), /class="ic ic-doc"/);
  assert.match(iconFor("welcome.txt"), /class="ic ic-doc"/);
  assert.match(iconFor("flow.mmd"), /class="ic ic-mmd"/);
  assert.match(iconFor("mystery.bin"), /class="ic"/); // default: untinted
  assert.doesNotMatch(iconFor("mystery.bin"), /class="ic ic-/);
});

test("iconFor: folders are two-tone (currentColor body + --icon-badge)", () => {
  const svg = iconFor("pictures/");
  assert.match(svg, /fill="currentColor"/);
  assert.match(svg, /style="fill:var\(--icon-badge\)"/);
  assert.doesNotMatch(svg, /#/);
});

test("iconFor: directories render a closed and an open variant", () => {
  const svg = iconFor("projects/");
  assert.match(svg, /class="ic ic-closed"/);
  assert.match(svg, /class="ic ic-open"/);
});

test("iconFor: xml files get the xml glyph (e.g. the RSS feed)", () => {
  assert.match(iconFor("feed.xml"), /class="ic ic-doc"/);
});

test("iconFor: well-known directories use folder glyphs, unknown dirs the base folder", () => {
  for (const dir of ["projects/", "blog/", "pictures/", "diagrams/", "legal/", "anywhere/"]) {
    const svg = iconFor(dir);
    assert.match(svg, /--icon-badge/, `${dir} should render a folder icon`);
  }
});
