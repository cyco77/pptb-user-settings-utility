import { Usersettings } from "../../types/usersettings";
import { Timezone } from "../../types/timezone";
import { Language } from "../../types/language";
import { Format } from "../../types/format";
import { SitemapData } from "../../types/sitemap";
import { Dashboard } from "../../types/dashboard";
import { Currency } from "../../types/currency";
import { getOptionSetValue } from "./optionSetMappings";

export interface FormatValueContext {
  timezones: Timezone[];
  languages: Language[];
  formats: Format[];
  sitemapData: SitemapData;
  dashboards: Dashboard[];
  currencies: Currency[];
}

/**
 * Format a field value for display in tooltips and labels
 */
export const formatFieldValue = (
  value: any,
  fieldKey: keyof Usersettings,
  context: FormatValueContext
): string => {
  const { timezones, languages, formats, sitemapData, dashboards, currencies } =
    context;

  if (value === null || value === undefined) return "Not set";
  if (typeof value === "boolean") return value ? "Yes" : "No";

  // Special formatting for specific fields
  if (fieldKey === "timezonecode" && timezones.length > 0) {
    const tz = timezones.find((t) => t.timezonecode === value);
    return tz ? `${tz.userinterfacename}` : String(value);
  }

  if (
    (fieldKey === "uilanguageid" || fieldKey === "helplanguageid") &&
    languages.length > 0
  ) {
    const lang = languages.find((l) => l.localeid === value);
    return lang
      ? `${lang.language}${lang.region ? ` (${lang.region})` : ""}`
      : String(value);
  }

  if (fieldKey === "localeid" && formats.length > 0) {
    const format = formats.find((f) => f.localeid === value);
    return format
      ? `${format.language}${format.region ? ` (${format.region})` : ""}`
      : String(value);
  }

  if (fieldKey === "homepagearea" && sitemapData.areas.length > 0) {
    const area = sitemapData.areas.find((a) => a.id === value);
    return area ? area.title : String(value);
  }

  if (fieldKey === "homepagesubarea" && sitemapData.subAreas.length > 0) {
    const subArea = sitemapData.subAreas.find((s) => s.id === value);
    return subArea ? subArea.title : String(value);
  }

  if (fieldKey === "defaultdashboardid" && dashboards.length > 0) {
    const dashboard = dashboards.find((d) => d.formid === value);
    return dashboard ? dashboard.name : String(value);
  }

  if (fieldKey === "transactioncurrencyid" && currencies.length > 0) {
    const currency = currencies.find((c) => c.transactioncurrencyid === value);
    return currency ? currency.currencyname : String(value);
  }

  // Handle option set values
  if (typeof value === "number") {
    return getOptionSetValue(fieldKey, value);
  }

  return String(value);
};
