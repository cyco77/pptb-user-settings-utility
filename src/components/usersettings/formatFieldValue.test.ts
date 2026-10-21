import { describe, expect, it } from "vitest";
import { formatFieldValue } from "./formatFieldValue";
import type { FormatValueContext } from "./formatFieldValue";

const context: FormatValueContext = {
  timezones: [{ timezonecode: 4, userinterfacename: "Pacific Standard Time" }],
  languages: [
    { languagelocaleid: "en-us", localeid: 1033, language: "English", region: "United States" },
    { languagelocaleid: "de-de", localeid: 1031, language: "German" },
  ],
  formats: [
    { localeid: 1033, language: "English", region: "United States" },
    { localeid: 1031, language: "German" },
  ],
  sitemapData: {
    areas: [{ id: "sales", title: "Sales" }],
    subAreas: [{ id: "accounts", title: "Accounts", areaId: "sales" }],
  },
  dashboards: [{ formid: "dashboard-1", name: "Sales dashboard" }],
  currencies: [{ transactioncurrencyid: "currency-1", currencyname: "Euro" }],
};

describe("formatFieldValue", () => {
  it("formats unset and boolean values", () => {
    expect(formatFieldValue(null, "paginglimit", context)).toBe("Not set");
    expect(formatFieldValue(undefined, "paginglimit", context)).toBe("Not set");
    expect(formatFieldValue(true, "allowemailcredentials", context)).toBe("Yes");
    expect(formatFieldValue(false, "allowemailcredentials", context)).toBe("No");
  });

  it.each([
    ["timezonecode", 4, "Pacific Standard Time"],
    ["uilanguageid", 1033, "English (United States)"],
    ["helplanguageid", 1031, "German"],
    ["localeid", 1033, "English (United States)"],
    ["localeid", 1031, "German"],
    ["homepagearea", "sales", "Sales"],
    ["homepagesubarea", "accounts", "Accounts"],
    ["defaultdashboardid", "dashboard-1", "Sales dashboard"],
    ["transactioncurrencyid", "currency-1", "Euro"],
  ] as const)("formats %s values using its lookup data", (field, value, expected) => {
    expect(formatFieldValue(value, field, context)).toBe(expected);
  });

  it("falls back to the raw value when lookup data has no match", () => {
    expect(formatFieldValue(99, "timezonecode", context)).toBe("99");
    expect(formatFieldValue(9999, "uilanguageid", context)).toBe("9999");
    expect(formatFieldValue("unknown", "homepagearea", context)).toBe("unknown");
    expect(formatFieldValue("unknown", "homepagesubarea", context)).toBe("unknown");
    expect(formatFieldValue("unknown", "defaultdashboardid", context)).toBe("unknown");
    expect(formatFieldValue("unknown", "transactioncurrencyid", context)).toBe("unknown");
  });

  it("formats option sets and arbitrary values", () => {
    expect(formatFieldValue(2, "defaultcalendarview", context)).toBe("Month");
    expect(formatFieldValue(42, "paginglimit", context)).toBe("42");
    expect(formatFieldValue("custom", "userprofile", context)).toBe("custom");
  });

  it("uses raw values if a lookup collection is empty", () => {
    const emptyContext: FormatValueContext = {
      timezones: [],
      languages: [],
      formats: [],
      sitemapData: { areas: [], subAreas: [] },
      dashboards: [],
      currencies: [],
    };

    expect(formatFieldValue(4, "timezonecode", emptyContext)).toBe("4");
    expect(formatFieldValue(1033, "uilanguageid", emptyContext)).toBe("1033");
    expect(formatFieldValue(1033, "localeid", emptyContext)).toBe("1033");
    expect(formatFieldValue("sales", "homepagearea", emptyContext)).toBe("sales");
    expect(formatFieldValue("accounts", "homepagesubarea", emptyContext)).toBe("accounts");
    expect(formatFieldValue("dashboard-1", "defaultdashboardid", emptyContext)).toBe("dashboard-1");
    expect(formatFieldValue("currency-1", "transactioncurrencyid", emptyContext)).toBe("currency-1");
  });
});
