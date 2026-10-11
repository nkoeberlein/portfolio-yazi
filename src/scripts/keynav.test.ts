import assert from "node:assert/strict";
import test from "node:test";
import { parseHashSelection } from "./keynav.ts";

test("parseHashSelection: extracts valid #sel=<name>", () => {
  assert.equal(parseHashSelection("#sel=welcome.txt"), "welcome.txt");
  assert.equal(parseHashSelection("#sel=hello%20world"), "hello world");
  assert.equal(parseHashSelection("#sel=c%2B%2B"), "c++");
});

test("parseHashSelection: ignores empty fragments or non-#sel fragments", () => {
  assert.equal(parseHashSelection(""), "");
  assert.equal(parseHashSelection("#"), "");
  assert.equal(parseHashSelection("#sel="), "");
  assert.equal(parseHashSelection("#read-me"), "");
  assert.equal(parseHashSelection("#50%-off"), "");
});

test("parseHashSelection: does not throw URIError on malformed percent-encoding", () => {
  assert.equal(parseHashSelection("#sel=%"), "");
  assert.equal(parseHashSelection("#sel=%E0%A4%A"), "");
  assert.equal(parseHashSelection("#sel=valid%99bad"), "");
});
