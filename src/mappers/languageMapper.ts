import { Language } from "../types/language";

export const mapLanguages = (data: any[]): Language[] => {
  const languageMap = new Map<number, Language>();

  console.log("Mapping languages, received data count:", data.length);

  data.forEach((item, index) => {
    if (item.languagelocaleid && item.localeid && item.language) {
      // Use localeid as key to avoid duplicates
      if (!languageMap.has(item.localeid)) {
        languageMap.set(item.localeid, {
          languagelocaleid: item.languagelocaleid,
          localeid: item.localeid,
          language: item.language,
          region: item.region || undefined,
        });
      }
    } else {
      console.log(
        `Skipping language item at index ${index} due to missing fields:`,
        {
          hasLanguagelocaleid: !!item.languagelocaleid,
          hasLocaleid: !!item.localeid,
          hasLanguage: !!item.language,
          hasRegion: !!item.region,
          item: item,
        }
      );
    }
  });

  const languages = Array.from(languageMap.values());
  console.log(
    `Successfully mapped ${languages.length} unique languages (from ${data.length} records)`
  );
  return languages;
};
