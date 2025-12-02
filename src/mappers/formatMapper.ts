import { Format } from "../types/format";

export const mapFormats = (data: any[]): Format[] => {
  const formatMap = new Map<number, Format>();

  console.log("Mapping formats, received data count:", data.length);

  data.forEach((item, index) => {
    if (item.localeid && item.language) {
      // Use localeid as key to avoid duplicates
      if (!formatMap.has(item.localeid)) {
        formatMap.set(item.localeid, {
          localeid: item.localeid,
          language: item.language,
          region: item.region || undefined,
        });
      }
    } else {
      console.log(
        `Skipping format item at index ${index} due to missing fields:`,
        {
          hasLocaleid: !!item.localeid,
          hasLanguage: !!item.language,
          hasRegion: !!item.region,
          item: item,
        }
      );
    }
  });

  const formats = Array.from(formatMap.values());
  console.log(
    `Successfully mapped ${formats.length} unique formats (from ${data.length} records)`
  );
  return formats;
};
