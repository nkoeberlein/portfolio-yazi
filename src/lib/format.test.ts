import assert from "node:assert/strict";
import { test } from "node:test";
import { dateOf, esc, sizeOf } from "./format.ts";

test("dateOf: formatiert gültiges Date nach YYYY-MM-DD", () => {
  assert.equal(dateOf(new Date("2026-08-12T00:00:00.000Z")), "2026-08-12");
});

test("dateOf: formatiert gültigen ISO-String nach YYYY-MM-DD", () => {
  assert.equal(dateOf("2026-10-11"), "2026-10-11");
});

test("dateOf: liefert Fallback bei undefined oder null", () => {
  assert.equal(dateOf(undefined), "—");
  assert.equal(dateOf(null), "—");
});

test("dateOf: wirft keinen RangeError bei Invalid Date oder ungültigen Werten", () => {
  assert.equal(dateOf(new Date(Number.NaN)), "—");
  assert.equal(dateOf(new Date(-Infinity)), "—");
  assert.equal(dateOf(new Date(Math.max(...[]))), "—");
  assert.equal(dateOf("ungültiges datum"), "—");
});

test("sizeOf: berechnet KiB-Größe gerundet", () => {
  assert.equal(sizeOf(""), "1.0K");
  assert.equal(sizeOf("a".repeat(1024)), "1.0K");
  assert.equal(sizeOf("a".repeat(2048)), "2.0K");
});

test("esc: escaped Sonderzeichen für HTML", () => {
  assert.equal(
    esc('<div class="box">&</div>'),
    "&lt;div class=&quot;box&quot;&gt;&amp;&lt;/div&gt;",
  );
});
