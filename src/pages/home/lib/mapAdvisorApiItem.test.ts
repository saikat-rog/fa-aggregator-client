import test from "node:test";
import assert from "node:assert/strict";
import { mapAdvisorApiItem } from "./mapAdvisorApiItem";

test("mapAdvisorApiItem keeps ppp as number and trims category", () => {
  const mapped = mapAdvisorApiItem({
    id: "a1",
    name: "Advisor A",
    country: "IN",
    state: "WB",
    marketFocus: [],
    ppp: 42,
    category: "  Wealth  ",
  });
  assert.equal(mapped.ppp, 42);
  assert.equal(mapped.category, "Wealth");
});

test("mapAdvisorApiItem normalizes missing ppp/category for old records", () => {
  const mapped = mapAdvisorApiItem({
    id: "a2",
    name: "Advisor B",
    country: "IN",
    state: "WB",
    marketFocus: [],
  });
  assert.equal(mapped.ppp, null);
  assert.equal(mapped.category, null);
});
