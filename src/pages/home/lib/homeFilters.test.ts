import test from "node:test";
import assert from "node:assert/strict";
import { buildAdvisorQuery, filtersFromSearchParams, queryParamsFromFilters } from "./homeFilters";
import type { AdvisorFilters } from "../Home.types";

const baseFilters: AdvisorFilters = {
  page: 1,
  limit: 20,
  country: "",
  state: "",
  category: "",
  industries: [],
  instagramFollowersGt: "",
  instagramFollowersGte: "",
  youtubeSubscribersGt: "",
  youtubeSubscribersGte: "",
  tiktokFollowersGt: "",
  tiktokFollowersGte: "",
  linkedinFollowersGt: "",
  linkedinFollowersGte: "",
  facebookFollowersGt: "",
  facebookFollowersGte: "",
  twitterFollowersGt: "",
  twitterFollowersGte: "",
};

test("buildAdvisorQuery includes trimmed category", () => {
  const query = buildAdvisorQuery({ ...baseFilters, category: "  retirement planning  " });
  assert.equal(query.includes("category=retirement+planning"), true);
});

test("filtersFromSearchParams reads category", () => {
  const params = new URLSearchParams("category=wealth%20management");
  const filters = filtersFromSearchParams(params);
  assert.equal(filters.category, "wealth management");
});

test("queryParamsFromFilters maps category to request params", () => {
  const params = queryParamsFromFilters({ ...baseFilters, category: "  tax  " });
  assert.equal(params.category, "tax");
});
