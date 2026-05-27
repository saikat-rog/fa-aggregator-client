import test from "node:test";
import assert from "node:assert/strict";
import {
  getAdvisorApplicationFieldErrors,
  normalizeCategory,
  parsePpp,
} from "./applicationForm.utils";

test("parsePpp returns number for valid non-negative values", () => {
  assert.equal(parsePpp("10"), 10);
  assert.equal(parsePpp("0"), 0);
});

test("parsePpp rejects invalid values", () => {
  assert.equal(parsePpp("-1"), null);
  assert.equal(parsePpp("abc"), null);
});

test("normalizeCategory trims input", () => {
  assert.equal(normalizeCategory("  Retirement  "), "Retirement");
});

test("getAdvisorApplicationFieldErrors validates required rules", () => {
  assert.deepEqual(
    getAdvisorApplicationFieldErrors({ pppValue: "", categoryValue: "x" }),
    { pppError: "PPP is required.", categoryError: "" },
  );
  assert.deepEqual(
    getAdvisorApplicationFieldErrors({ pppValue: "-5", categoryValue: "x" }),
    { pppError: "PPP must be a non-negative number.", categoryError: "" },
  );
  assert.deepEqual(
    getAdvisorApplicationFieldErrors({ pppValue: "12", categoryValue: " " }),
    { pppError: "", categoryError: "Category is required." },
  );
});
