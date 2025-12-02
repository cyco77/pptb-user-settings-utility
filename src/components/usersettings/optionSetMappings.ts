import { Usersettings } from "../../types/usersettings";

/**
 * Option set value mappings for user settings fields
 */
export const optionSetMappings: Record<string, Record<number, string>> = {
  advancedfindstartupmode: {
    1: "Simple",
    2: "Advanced",
  },
  defaultcalendarview: {
    0: "Day",
    1: "Week",
    2: "Month",
  },
  calendartype: {
    0: "Gregorian",
    1: "Gregorian US",
    2: "Japanese Emperor Era",
    3: "Taiwan Calendar",
    4: "Korean Tangun Era",
    5: "Hijri",
    6: "Thai Buddhist",
    7: "Hebrew Lunar",
    8: "Gregorian Middle East French",
    9: "Gregorian Arabic",
    10: "Gregorian Transliterated English",
    11: "Gregorian Transliterated French",
    12: "Japanese Lunar",
    14: "Chinese Lunar",
    15: "Saka Era",
    16: "Lunar ETO Chinese",
    17: "Lunar ETO Korean",
    18: "Lunar ETO Rokuyou",
    23: "UmAlQura",
  },
  autocaptureuserstatus: {
    0: "No Preference",
    1: "Opted In",
    2: "Opted Out",
  },
  releasechannel: {
    0: "Semi-Annual Channel",
    1: "Monthly Channel",
    2: "Microsoft Inner Channel",
  },
  defaultsearchexperience: {
    0: "Relevance Search",
    1: "Categorized Search",
    2: "Custom Search",
    3: "Single Entity Search",
  },
  incomingemailfilteringmethod: {
    0: "All email messages",
    1: "Email messages in response to Dynamics 365 email",
    2: "Email messages from Dynamics 365 Leads, Contacts and Accounts",
    3: "Email messages from Dynamics 365 records that are email enabled",
    4: "No email messages",
  },
  autocreatecontactonpromote: {
    0: "No",
    1: "Yes",
    2: "Ask",
  },
  datavalidationmodeforexporttoexcel: {
    0: "Block",
    1: "Warn",
  },
  reportscripterrors: {
    1: "Ask me for permission to send an error report to Microsoft",
    2: "Automatically send an error report to Microsoft without asking me for permission",
    3: "Never send an error report to Microsoft about Microsoft Dynamics 365",
  },
  paginglimit: {
    25: "25",
    50: "50",
    75: "75",
    100: "100",
    250: "250",
  },
};

/**
 * Get the display value for an option set field
 */
export const getOptionSetValue = (
  fieldKey: keyof Usersettings,
  value: number
): string => {
  const fieldMapping = optionSetMappings[fieldKey];
  if (fieldMapping && value in fieldMapping) {
    return fieldMapping[value];
  }
  return value.toString();
};
