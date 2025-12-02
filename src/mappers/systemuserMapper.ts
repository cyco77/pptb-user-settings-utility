import { Systemuser } from "../types/systemuser";

export const mapSystemusers = (
  rawData: Record<string, unknown>[]
): Systemuser[] => {
  const results: Systemuser[] = [];

  rawData.forEach((item) => {
    const id = item["systemuserid"];
    const fullname = item["fullname"];

    // Validate required fields
    if (typeof id === "string" && typeof fullname === "string") {
      results.push({
        systemuserId: id,
        fullname: fullname,
        internalemailaddress: item["internalemailaddress"] as
          | string
          | undefined,
        businessunitid: item["_businessunitid_value"] as string | undefined,
        businessunitname: item[
          "_businessunitid_value@OData.Community.Display.V1.FormattedValue"
        ] as string | undefined,
      });
    }
  });

  return results;
};
