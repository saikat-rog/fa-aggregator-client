import test from "node:test";
import assert from "node:assert/strict";
import {
  getDisplayCategory,
  getDisplayEngagementRate,
  getDisplayFollowers,
  getDisplayPpp,
} from "./advisorDisplay.utils";

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

test("getDisplayFollowers renders compact formatted numbers or N/A", () => {
  assert.equal(getDisplayFollowers(undefined), "N/A");
  assert.equal(getDisplayFollowers(null), "N/A");
  assert.equal(getDisplayFollowers(12000), "12K");
  assert.equal(getDisplayFollowers(1500000), "1.5M");
});

test("getDisplayEngagementRate renders percentage or N/A", () => {
  assert.equal(getDisplayEngagementRate(undefined), "N/A");
  assert.equal(getDisplayEngagementRate(null), "N/A");
  assert.equal(getDisplayEngagementRate(4.25), "4.25%");
  assert.equal(getDisplayEngagementRate(3), "3%");
});
