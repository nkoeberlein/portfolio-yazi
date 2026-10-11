import assert from "node:assert/strict";
import { test } from "node:test";
import { figure, listing } from "./preview.ts";

test("figure: escaped src/alt/caption, Maße als Attribute", () => {
  const html = figure({
    src: "/_astro/a.svg?x=1&y=2",
    width: 1600,
    height: 1000,
    alt: 'a "quoted" <tag>',
    caption: "rock & roll",
  });
  assert.match(html, /src="\/_astro\/a\.svg\?x=1&amp;y=2"/);
  assert.match(html, /width="1600" height="1000"/);
  assert.match(html, /alt="a &quot;quoted&quot; &lt;tag&gt;"/);
  assert.match(html, /<figcaption>rock &amp; roll<\/figcaption>/);
});

test("figure: ohne Caption kein <figcaption>", () => {
  assert.doesNotMatch(figure({ src: "/a.png", width: 1, height: 1, alt: "" }), /figcaption/);
});

test("listing: Ordner und Dateien bekommen ihre Klasse", () => {
  const html = listing(["sub/", "a.md", "b.svg"]);
  assert.equal(html.match(/class="dir"/g)?.length, 1);
  assert.equal(html.match(/class="file"/g)?.length, 2);
});
