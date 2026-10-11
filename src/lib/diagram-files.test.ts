import assert from "node:assert/strict";
import { test } from "node:test";
import { parseDiagramFile, readDiagrams } from "./diagram-files.ts";

const FILE = `%% title: Flowchart
%% summary: Decisions: and pipelines.
%% updated: 2026-10-11
flowchart TD
  a --> b
  %% a comment inside the diagram stays
`;

test("parseDiagramFile: reads header and separates it from diagram source", () => {
  const diagram = parseDiagramFile("flowchart", FILE);
  assert.equal(diagram.title, "Flowchart");
  assert.equal(diagram.summary, "Decisions: and pipelines.");
  assert.equal(diagram.updated, "2026-10-11");
  assert.equal(diagram.code.split("\n")[0], "flowchart TD");
  assert.match(diagram.code, /a comment inside the diagram stays/);
});

test("parseDiagramFile: throws on missing header line or empty source", () => {
  assert.throws(() => parseDiagramFile("x", "flowchart TD\n a --> b"), /missing "%% title/);
  assert.throws(
    () => parseDiagramFile("x", "%% title: T\n%% summary: S\n%% updated: 2026-01-01\n"),
    /no diagram source/,
  );
});

test("readDiagrams: sample diagram files in theme are complete", () => {
  const diagrams = readDiagrams("src/content/diagrams");
  assert.deepEqual(
    diagrams.map((diagram) => diagram.id),
    ["class", "er", "flowchart", "sequence", "state", "xychart"],
  );
});
