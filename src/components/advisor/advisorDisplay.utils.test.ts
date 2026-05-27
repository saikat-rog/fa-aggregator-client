import test from "node:test";
import assert from "node:assert/strict";
import { getDisplayCategory, getDisplayPpp } from "./advisorDisplay.utils";

test("getDisplayPpp renders N/A for missing values", () => {
  assert.equal(getDisplayPpp(undefined), "N/A");
  assert.equal(getDisplayPpp(null), "N/A");
  assert.equal(getDisplayPpp(12), "12");
});

test("getDisplayCategory renders N/A for empty values", () => {
  assert.equal(getDisplayCategory(undefined), "N/A");
  assert.equal(getDisplayCategory(" "), "N/A");
  assert.equal(getDisplayCategory("Retirement"), "Retirement");
});
