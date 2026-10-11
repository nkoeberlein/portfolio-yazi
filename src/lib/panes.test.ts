/** Tests for pure `lib/` modules: `npm test` (node --test, zero external dependencies). */
import assert from "node:assert/strict";
import { test } from "node:test";
import { homeParent, rootParent, type StatusSource, statusOf } from "./panes.ts";
import { findEntry, ROOT } from "./tree.ts";

const vm = (name: string, selected = false): StatusSource => ({
  name,
  kind: name.endsWith("/") ? "dir" : "file",
  note: `note ${name}`,
  size: "1.0K",
  date: "2026-10-11",
  selected,
});

test("homeParent: single active user directory linking to ~", () => {
  assert.deepEqual(homeParent(), [{ name: "max/", kind: "dir", href: "/", active: true }]);
});

test("rootParent: mirrors ROOT and marks exactly the active folder", () => {
  const parent = rootParent("/projects/");
  assert.deepEqual(
    parent.map((entry) => entry.name),
    ROOT.map((entry) => entry.name),
  );
  assert.deepEqual(
    parent.filter((entry) => entry.active).map((entry) => entry.href),
    ["/projects/"],
  );
});

test("rootParent: throws on unknown route", () => {
  assert.throws(() => rootParent("/nope/"), /Unknown tree entry/);
});

test("statusOf: position and permissions of the selected entry", () => {
  const status = statusOf([vm("a.md"), vm("b/", true), vm("c.md")]);
  assert.equal(status.name, "b/");
  assert.equal(status.pos, "2/3");
  assert.equal(status.perms, "drwxr-xr-x");
});

test("statusOf: defaults to first entry without selection, throws on empty list", () => {
  assert.equal(statusOf([vm("a.md"), vm("b.md")]).pos, "1/2");
  assert.equal(statusOf([vm("a.md")]).perms, "-rw-r--r--");
  assert.throws(() => statusOf([]), /at least one entry/);
});

test("findEntry: returns entry for route, throws on typo", () => {
  assert.equal(findEntry("/cv/").name, "cv.md");
  assert.throws(() => findEntry("/cv"), /Unknown tree entry/);
});

test("ROOT: folders first, unique names and routes", () => {
  const kinds = ROOT.map((entry) => entry.kind);
  assert.equal(kinds.lastIndexOf("dir") < kinds.indexOf("file"), true);
  assert.equal(new Set(ROOT.map((entry) => entry.href)).size, ROOT.length);
  assert.equal(new Set(ROOT.map((entry) => entry.name)).size, ROOT.length);
});

test("rootParent: knows all directories in the tree", () => {
  for (const dir of ROOT.filter((entry) => entry.kind === "dir")) {
    assert.equal(rootParent(dir.href).find((entry) => entry.active)?.name, dir.name);
  }
});
