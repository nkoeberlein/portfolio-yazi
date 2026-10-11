import assert from "node:assert/strict";
import { test } from "node:test";
import { dateOf, esc, sizeOf } from "./format.ts";

test("dateOf: formats valid Date to YYYY-MM-DD", () => {
  assert.equal(dateOf(new Date("2026-08-12T00:00:00.000Z")), "2026-08-12");
});

test("dateOf: formats valid ISO string to YYYY-MM-DD", () => {
  assert.equal(dateOf("2026-10-11"), "2026-10-11");
});

test("dateOf: returns fallback dash for undefined or null", () => {
  assert.equal(dateOf(undefined), "—");
  assert.equal(dateOf(null), "—");
});

test("dateOf: does not throw RangeError on Invalid Date or invalid values", () => {
  assert.equal(dateOf(new Date(Number.NaN)), "—");
  assert.equal(dateOf(new Date(-Infinity)), "—");
  assert.equal(dateOf(new Date(Math.max(...[]))), "—");
  assert.equal(dateOf("invalid date"), "—");
});

test("sizeOf: calculates rounded KiB size", () => {
  assert.equal(sizeOf(""), "1.0K");
  assert.equal(sizeOf("a".repeat(1024)), "1.0K");
  assert.equal(sizeOf("a".repeat(2048)), "2.0K");
});

test("esc: escapes special HTML characters", () => {
  assert.equal(
    esc('<div class="box">&</div>'),
    "&lt;div class=&quot;box&quot;&gt;&amp;&lt;/div&gt;",
  );
});
