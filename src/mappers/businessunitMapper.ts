import { Businessunit } from "../types/businessunit";

export const mapBusinessunits = (
  rawData: Record<string, unknown>[]
): Businessunit[] => {
  const results: Businessunit[] = [];

  rawData.forEach((item) => {
    const id = item["businessunitid"];
    const name = item["name"];

    // Validate required fields
    if (typeof id === "string" && typeof name === "string") {
      results.push({
        businessunitid: id,
        name: name,
      });
    }
  });

  return results;
};
