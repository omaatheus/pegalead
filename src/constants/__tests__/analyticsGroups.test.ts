import { test } from "node:test";
import assert from "node:assert/strict";
import { getAnalyticsGroups } from "../analyticsGroups.ts";
import { ANALYTICS_OPTIONS } from "../analytics.ts";

test("agrupamento visual cobre exatamente os IDs originais, sem duplicar nem inventar", () => {
  const ids = getAnalyticsGroups().flatMap((g) => g.options.map((o) => o.id));
  assert.equal(ids.length, new Set(ids).size, "IDs duplicados");
  assert.deepEqual([...ids].sort(), ANALYTICS_OPTIONS.map((o) => o.id).sort());
});

test("labels dos grupos vêm de ANALYTICS_OPTIONS", () => {
  for (const g of getAnalyticsGroups())
    for (const o of g.options)
      assert.equal(o, ANALYTICS_OPTIONS.find((x) => x.id === o.id));
});
