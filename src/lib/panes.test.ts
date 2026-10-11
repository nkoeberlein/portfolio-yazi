/** Beispieltest für reine `lib/`-Module: `npm test` (node --test, keine Dependency). */
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

test("homeParent: ein aktives Benutzerverzeichnis, das nach ~ führt", () => {
  assert.deepEqual(homeParent(), [{ name: "max/", kind: "dir", href: "/", active: true }]);
});

test("rootParent: spiegelt ROOT und markiert genau den aktuellen Ordner", () => {
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

test("rootParent: unbekannte Route wirft", () => {
  assert.throws(() => rootParent("/nope/"), /Unknown tree entry/);
});

test("statusOf: Position und Rechte des selektierten Eintrags", () => {
  const status = statusOf([vm("a.md"), vm("b/", true), vm("c.md")]);
  assert.equal(status.name, "b/");
  assert.equal(status.pos, "2/3");
  assert.equal(status.perms, "drwxr-xr-x");
});

test("statusOf: ohne Auswahl der erste Eintrag, leere Liste wirft", () => {
  assert.equal(statusOf([vm("a.md"), vm("b.md")]).pos, "1/2");
  assert.equal(statusOf([vm("a.md")]).perms, "-rw-r--r--");
  assert.throws(() => statusOf([]), /at least one entry/);
});

test("findEntry: liefert den Eintrag zur Route, wirft bei Tippfehlern", () => {
  assert.equal(findEntry("/cv/").name, "cv.md");
  assert.throws(() => findEntry("/cv"), /Unknown tree entry/);
});

test("ROOT: Ordner zuerst, eindeutige Namen und Routen", () => {
  const kinds = ROOT.map((entry) => entry.kind);
  assert.equal(kinds.lastIndexOf("dir") < kinds.indexOf("file"), true);
  assert.equal(new Set(ROOT.map((entry) => entry.href)).size, ROOT.length);
  assert.equal(new Set(ROOT.map((entry) => entry.name)).size, ROOT.length);
});

test("rootParent: kennt alle Ordner des Baums", () => {
  for (const dir of ROOT.filter((entry) => entry.kind === "dir")) {
    assert.equal(rootParent(dir.href).find((entry) => entry.active)?.name, dir.name);
  }
});
