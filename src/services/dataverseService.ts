import { mapSystemusers } from "../mappers/systemuserMapper";
import { mapUsersettings } from "../mappers/usersettingsMapper";
import { mapSitemap } from "../mappers/sitemapMapper";
import { mapBusinessunits } from "../mappers/businessunitMapper";
import { mapTimezones } from "../mappers/timezoneMapper";
import { mapLanguages } from "../mappers/languageMapper";
import { mapFormats } from "../mappers/formatMapper";
import { Systemuser } from "../types/systemuser";
import { Usersettings } from "../types/usersettings";
import { SitemapData } from "../types/sitemap";
import { Businessunit } from "../types/businessunit";
import { Timezone } from "../types/timezone";
import { Language } from "../types/language";
import { Format } from "../types/format";
import { Dashboard } from "../types/dashboard";
import { Currency } from "../types/currency";
import { UserPendingChanges } from "../types/pendingChanges";

export const loadSystemusers = async (): Promise<Systemuser[]> => {
  const selectFields = [
    "systemuserid",
    "fullname",
    "internalemailaddress",
    "_businessunitid_value",
  ].join(",");

  let url = `systemusers?$select=${selectFields}&$filter=(isdisabled eq false and accessmode eq 0)`;

  const allRecords = await loadAllData(url);

  console.log(
    `Loaded ${allRecords.length} systemusers from Dataverse`,
    allRecords
  );

  return mapSystemusers(allRecords);
};

export const loadBusinessunits = async (): Promise<Businessunit[]> => {
  const selectFields = ["businessunitid", "name"].join(",");

  let url = `businessunits?$select=${selectFields}&$orderby=name asc`;

  const allRecords = await loadAllData(url);

  console.log(
    `Loaded ${allRecords.length} business units from Dataverse`,
    allRecords
  );

  return mapBusinessunits(allRecords);
};

export const loadTimezones = async (): Promise<Timezone[]> => {
  const selectFields = ["timezonecode", "userinterfacename"].join(",");

  let url = `timezonedefinitions?$select=${selectFields}&$orderby=userinterfacename asc`;

  const allRecords = await loadAllData(url);

  console.log(
    `Loaded ${allRecords.length} timezones from Dataverse`,
    allRecords
  );

  return mapTimezones(allRecords);
};

export const loadLanguages = async (): Promise<Language[]> => {
  try {
    console.log("Retrieving provisioned languages...");

    // Use RetrieveProvisionedLanguages to get installed language LCIDs
    const response = await window.dataverseAPI.queryData(
      "RetrieveProvisionedLanguages"
    );

    console.log("RetrieveProvisionedLanguages response:", response);

    const provisionedLcids =
      (response as any).RetrieveProvisionedLanguages || [];
    console.log(
      `Found ${provisionedLcids.length} provisioned language LCIDs:`,
      provisionedLcids
    );

    if (provisionedLcids.length === 0) {
      console.warn("No provisioned languages found");
      return [];
    }

    // Now get the language locale details for these LCIDs
    const selectFields = [
      "languagelocaleid",
      "localeid",
      "language",
      "region",
    ].join(",");

    // Build filter for provisioned localeids
    const filterConditions = provisionedLcids
      .map((lcid: number) => `localeid eq ${lcid}`)
      .join(" or ");

    const url = `languagelocale?$select=${selectFields}&$filter=${filterConditions}&$orderby=language asc`;
    console.log("Loading language details from:", url);

    const allRecords = await loadAllData(url);

    console.log(
      `Loaded ${allRecords.length} language details from Dataverse`,
      allRecords
    );

    const mappedLanguages = mapLanguages(allRecords);
    console.log(
      `Mapped ${mappedLanguages.length} unique languages`,
      mappedLanguages
    );
    return mappedLanguages;
  } catch (error) {
    console.error("Error loading languages:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return [];
  }
};

export const loadFormats = async (): Promise<Format[]> => {
  try {
    const selectFields = ["localeid", "language", "region"].join(",");

    let url = `languagelocale?$select=${selectFields}&$orderby=language asc`;

    console.log("Loading formats from:", url);
    const allRecords = await loadAllData(url);

    console.log(
      `Loaded ${allRecords.length} formats from Dataverse`,
      allRecords
    );

    const mappedFormats = mapFormats(allRecords);
    console.log(`Mapped ${mappedFormats.length} formats`, mappedFormats);
    return mappedFormats;
  } catch (error) {
    console.error("Error loading formats:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    return [];
  }
};

export const loadUsersettingsBySystemuserId = async (
  systemuserid: string
): Promise<Usersettings | null> => {
  const selectFields = [
    "systemuserid",
    "addressbooksyncinterval",
    "advancedfindstartupmode",
    "allowemailcredentials",
    "amdesignator",
    "autocaptureuserstatus",
    "autocreatecontactonpromote",
    "businessunitid",
    "calendartype",
    "_createdby_value",
    "createdon",
    "_createdonbehalfby_value",
    "currencydecimalprecision",
    "currencyformatcode",
    "currencysymbol",
    "d365autoinstallattemptstatus",
    "datavalidationmodeforexporttoexcel",
    "dateformatcode",
    "dateformatstring",
    "dateseparator",
    "decimalsymbol",
    "defaultcalendarview",
    "defaultcountrycode",
    "defaultdashboardid",
    "defaultsearchexperience",
    "emailpassword",
    "emailusername",
    "entityformmode",
    "fullnameconventioncode",
    "getstartedpanecontentenabled",
    "helplanguageid",
    "homepagearea",
    "homepagelayout",
    "homepagesubarea",
    "ignoreunsolicitedemail",
    "incomingemailfilteringmethod",
    "isappsforcrmalertdismissed",
    "isautodatacaptureenabled",
    "isdefaultcountrycodecheckenabled",
    "isduplicatedetectionenabledwhengoingonline",
    "isemailconversationviewenabled",
    "isguidedhelpenabled",
    "isresourcebookingexchangesyncenabled",
    "issendasallowed",
    "lastalertsviewedtime",
    "lastmodifiedtimeforviewpersonalizationsettings",
    "localeid",
    "longdateformatcode",
    "_modifiedby_value",
    "modifiedon",
    "_modifiedonbehalfby_value",
    "negativecurrencyformatcode",
    "negativeformatcode",
    "nexttrackingnumber",
    "numbergroupformat",
    "numberseparator",
    "offlinesyncinterval",
    "outlooksyncinterval",
    "paginglimit",
    "personalizationsettings",
    "pmdesignator",
    "preferredsolution",
    "pricingdecimalprecision",
    "releasechannel",
    "reportscripterrors",
    "resourcebookingexchangesyncversion",
    "selectedglobalfilterid",
    "showweeknumber",
    "splitviewstate",
    "synccontactcompany",
    "tablescopeddvsearchfeatureteachingbubbleviews",
    "tablescopeddvsearchquickfindteachingbubbleviews",
    "timeformatcode",
    "timeformatstring",
    "timeseparator",
    "timezonecode",
    "trackingtokenid",
    "transactioncurrencyid",
    "trytogglesets",
    "trytogglestatus",
    "uilanguageid",
    "usecrmformforappointment",
    "usecrmformforcontact",
    "usecrmformforemail",
    "usecrmformfortask",
    "useimagestrips",
    "userprofile",
    "versionnumber",
    "visualizationpanelayout",
    "workdaystarttime",
    "workdaystoptime",
  ].join(",");

  let url = `usersettingscollection?$select=${selectFields}&$filter=systemuserid eq '${systemuserid}'`;

  try {
    const results = await loadAllData(url);
    console.log("Usersettings response:", results);
    if (results && results.length > 0) {
      const mapped = mapUsersettings(results[0]);
      console.log("Mapped usersettings:", mapped);
      return mapped;
    }
    console.log("No usersettings found for systemuserid:", systemuserid);
    return null;
  } catch (error) {
    console.error("Error loading usersettings for", systemuserid, error);
    throw error;
  }
};

const loadAllData = async (fullUrl: string) => {
  const allRecords = [];

  while (fullUrl) {
    let relativePath = fullUrl;

    if (fullUrl.startsWith("http")) {
      const url = new URL(fullUrl);
      const apiRegex = /^\/api\/data\/v\d+\.\d+\//;
      relativePath = url.pathname.replace(apiRegex, "") + url.search;
    }

    const response = await window.dataverseAPI.queryData(relativePath);

    // Add the current page of results
    allRecords.push(...response.value);

    // Check for paging link
    fullUrl = (response as any)["@odata.nextLink"] || null;
  }

  return allRecords;
};

export const loadSitemapData = async (lcid?: number): Promise<SitemapData> => {
  try {
    // Retrieve the default sitemap with optional language preference
    const selectFields = ["sitemapid", "sitemapxml", "sitemapname"].join(",");
    const url = `sitemaps?$select=${selectFields}`;

    // Set language preference header if LCID is provided
    if (lcid) {
      console.log(`Loading sitemap with language preference: ${lcid}`);
    }

    const sitemaps = await loadAllData(url);

    if (!sitemaps || sitemaps.length === 0) {
      console.log("No sitemaps found");
      return { areas: [], subAreas: [] };
    }

    console.log(`Loaded ${sitemaps.length} sitemaps from Dataverse`, sitemaps);

    // Use the first sitemap (default)
    const sitemap = sitemaps[0];
    const sitemapXml = sitemap.sitemapxml as string;

    if (!sitemapXml) {
      console.log("No sitemap XML found");
      return { areas: [], subAreas: [] };
    }

    return mapSitemap(sitemapXml, lcid);
  } catch (error) {
    console.error("Error loading sitemap data:", error);
    return { areas: [], subAreas: [] };
  }
};

export const loadDashboards = async (): Promise<Dashboard[]> => {
  try {
    const fetchXml = `
      <fetch>
        <entity name='systemform'>
          <attribute name='formid' />
          <attribute name='name' />
          <filter type='or'>
            <condition attribute='type' operator='eq' value='0' />
            <condition attribute='type' operator='eq' value='10' />
            <condition attribute='type' operator='eq' value='103' />
          </filter>
          <order attribute='name' />
        </entity>
      </fetch>`;

    const encodedFetchXml = encodeURIComponent(fetchXml);
    const url = `systemforms?fetchXml=${encodedFetchXml}`;

    const response = await window.dataverseAPI.queryData(url);
    const dashboards = response?.value || [];

    console.log(
      `Loaded ${dashboards.length} dashboards from Dataverse`,
      dashboards
    );

    return dashboards.map((d: any) => ({
      formid: d.formid,
      name: d.name,
    }));
  } catch (error) {
    console.error("Error loading dashboards:", error);
    return [];
  }
};

export const loadCurrencies = async (): Promise<Currency[]> => {
  try {
    const fetchXml = `
      <fetch>
        <entity name='transactioncurrency'>
          <attribute name='transactioncurrencyid' />
          <attribute name='currencyname' />
          <order attribute='currencyname' />
        </entity>
      </fetch>`;

    const encodedFetchXml = encodeURIComponent(fetchXml);
    const url = `transactioncurrencies?fetchXml=${encodedFetchXml}`;

    const response = await window.dataverseAPI.queryData(url);
    const currencies = response?.value || [];

    console.log(
      `Loaded ${currencies.length} currencies from Dataverse`,
      currencies
    );

    return currencies.map((c: any) => ({
      transactioncurrencyid: c.transactioncurrencyid,
      currencyname: c.currencyname,
    }));
  } catch (error) {
    console.error("Error loading currencies:", error);
    return [];
  }
};

/**
 * Update user settings for a single user with only the changed attributes
 */
export const updateUsersettings = async (
  userChanges: UserPendingChanges
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { systemuserid, changes } = userChanges;

    if (changes.size === 0) {
      return { success: true };
    }

    // Build the update payload with only changed fields
    const updatePayload: Record<string, any> = {};

    changes.forEach((value, fieldName) => {
      // Handle special field mappings for Dataverse
      if (fieldName === "transactioncurrencyid" && value) {
        // Currency is a lookup field - use @odata.bind
        updatePayload[
          "transactioncurrencyid@odata.bind"
        ] = `/transactioncurrencies(${value})`;
      } else {
        // Regular field - convert to lowercase for Dataverse
        updatePayload[fieldName.toLowerCase()] = value ?? null;
      }
    });

    console.log(
      `Updating usersettings for user ${systemuserid}:`,
      updatePayload
    );

    // Use PATCH to update the usersettings record
    await window.dataverseAPI.update(
      "usersettingscollection",
      systemuserid,
      updatePayload
    );

    console.log(`Successfully updated usersettings for user ${systemuserid}`);
    return { success: true };
  } catch (error) {
    console.error(
      `Error updating usersettings for user ${userChanges.systemuserid}:`,
      error
    );
    return {
      success: false,
      error: (error as Error).message || "Unknown error occurred",
    };
  }
};

/**
 * Update user settings for multiple users
 */
export const updateMultipleUsersettings = async (
  allChanges: UserPendingChanges[],
  onProgress?: (completed: number, total: number, userName: string) => void
): Promise<{
  successful: string[];
  failed: Array<{ userId: string; userName: string; error: string }>;
}> => {
  const successful: string[] = [];
  const failed: Array<{ userId: string; userName: string; error: string }> = [];

  for (let i = 0; i < allChanges.length; i++) {
    const userChanges = allChanges[i];

    if (onProgress) {
      onProgress(i, allChanges.length, userChanges.userFullname);
    }

    const result = await updateUsersettings(userChanges);

    if (result.success) {
      successful.push(userChanges.systemuserid);
    } else {
      failed.push({
        userId: userChanges.systemuserid,
        userName: userChanges.userFullname,
        error: result.error || "Unknown error",
      });
    }
  }

  if (onProgress) {
    onProgress(allChanges.length, allChanges.length, "Complete");
  }

  return { successful, failed };
};
