import { Timezone } from "../types/timezone";

export const mapTimezones = (
  rawData: Record<string, unknown>[]
): Timezone[] => {
  const results: Timezone[] = [];

  rawData.forEach((item) => {
    const code = item["timezonecode"];
    const name = item["userinterfacename"];

    // Validate required fields
    if (typeof code === "number" && typeof name === "string") {
      results.push({
        timezonecode: code,
        userinterfacename: name,
      });
    }
  });

  return results;
};
