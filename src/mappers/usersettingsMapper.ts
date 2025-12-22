import { Usersettings } from "../types/usersettings";

export const mapUsersettings = (
  rawData: Record<string, unknown>
): Usersettings | null => {
  if (!rawData) return null;

  const systemuserid = rawData["systemuserid"] as string;

  return {
    systemuserid: systemuserid,
    addressbooksyncinterval: rawData["addressbooksyncinterval"] as
      | number
      | undefined,
    advancedfindstartupmode: rawData["advancedfindstartupmode"] as
      | number
      | undefined,
    allowemailcredentials: rawData["allowemailcredentials"] as
      | boolean
      | undefined,
    amdesignator: rawData["amdesignator"] as string | undefined,
    autocaptureuserstatus: rawData["autocaptureuserstatus"] as
      | number
      | undefined,
    autocreatecontactonpromote: rawData["autocreatecontactonpromote"] as
      | number
      | undefined,
    businessunitid: rawData["businessunitid"] as string | undefined,
    businessunitidname: undefined,
    calendartype: rawData["calendartype"] as number | undefined,
    createdby: rawData["_createdby_value"] as string | undefined,
    createdbyname: rawData[
      "_createdby_value@OData.Community.Display.V1.FormattedValue"
    ] as string | undefined,
    createdon: rawData["createdon"] as string | undefined,
    createdonbehalfby: rawData["_createdonbehalfby_value"] as
      | string
      | undefined,
    createdonbehalfbyname: rawData[
      "_createdonbehalfby_value@OData.Community.Display.V1.FormattedValue"
    ] as string | undefined,
    currencydecimalprecision: rawData["currencydecimalprecision"] as
      | number
      | undefined,
    currencyformatcode: rawData["currencyformatcode"] as number | undefined,
    currencysymbol: rawData["currencysymbol"] as string | undefined,
    d365autoinstallattemptstatus: rawData["d365autoinstallattemptstatus"] as
      | number
      | undefined,
    datavalidationmodeforexporttoexcel: rawData[
      "datavalidationmodeforexporttoexcel"
    ] as number | undefined,
    dateformatcode: rawData["dateformatcode"] as number | undefined,
    dateformatstring: rawData["dateformatstring"] as string | undefined,
    dateseparator: rawData["dateseparator"] as string | undefined,
    decimalsymbol: rawData["decimalsymbol"] as string | undefined,
    defaultcalendarview: rawData["defaultcalendarview"] as number | undefined,
    defaultcountrycode: rawData["defaultcountrycode"] as string | undefined,
    defaultdashboardid: rawData["defaultdashboardid"] as string | undefined,
    defaultdashboardidname: undefined,
    defaultsearchexperience: rawData["defaultsearchexperience"] as
      | number
      | undefined,
    emailpassword: rawData["emailpassword"] as string | undefined,
    emailusername: rawData["emailusername"] as string | undefined,
    entityformmode: rawData["entityformmode"] as number | undefined,
    fullnameconventioncode: rawData["fullnameconventioncode"] as
      | number
      | undefined,
    getstartedpanecontentenabled: rawData["getstartedpanecontentenabled"] as
      | boolean
      | undefined,
    helplanguageid: rawData["helplanguageid"] as number | undefined,
    homepagearea: rawData["homepagearea"] as string | undefined,
    homepagelayout: rawData["homepagelayout"] as string | undefined,
    homepagesubarea: rawData["homepagesubarea"] as string | undefined,
    ignoreunsolicitedemail: rawData["ignoreunsolicitedemail"] as
      | boolean
      | undefined,
    incomingemailfilteringmethod: rawData["incomingemailfilteringmethod"] as
      | number
      | undefined,
    isappsforcrmalertdismissed: rawData["isappsforcrmalertdismissed"] as
      | boolean
      | undefined,
    isautodatacaptureenabled: rawData["isautodatacaptureenabled"] as
      | boolean
      | undefined,
    isdefaultcountrycodecheckenabled: rawData[
      "isdefaultcountrycodecheckenabled"
    ] as boolean | undefined,
    isduplicatedetectionenabledwhengoingonline: rawData[
      "isduplicatedetectionenabledwhengoingonline"
    ] as boolean | undefined,
    isemailconversationviewenabled: rawData[
      "isemailconversationviewenabled"
    ] as boolean | undefined,
    isguidedhelpenabled: rawData["isguidedhelpenabled"] as boolean | undefined,
    isresourcebookingexchangesyncenabled: rawData[
      "isresourcebookingexchangesyncenabled"
    ] as boolean | undefined,
    issendasallowed: rawData["issendasallowed"] as boolean | undefined,
    lastalertsviewedtime: rawData["lastalertsviewedtime"] as string | undefined,
    lastmodifiedtimeforviewpersonalizationsettings: rawData[
      "lastmodifiedtimeforviewpersonalizationsettings"
    ] as string | undefined,
    localeid: rawData["localeid"] as number | undefined,
    longdateformatcode: rawData["longdateformatcode"] as number | undefined,
    modifiedby: rawData["_modifiedby_value"] as string | undefined,
    modifiedbyname: rawData[
      "_modifiedby_value@OData.Community.Display.V1.FormattedValue"
    ] as string | undefined,
    modifiedon: rawData["modifiedon"] as string | undefined,
    modifiedonbehalfby: rawData["_modifiedonbehalfby_value"] as
      | string
      | undefined,
    modifiedonbehalfbyname: rawData[
      "_modifiedonbehalfby_value@OData.Community.Display.V1.FormattedValue"
    ] as string | undefined,
    negativecurrencyformatcode: rawData["negativecurrencyformatcode"] as
      | number
      | undefined,
    negativeformatcode: rawData["negativeformatcode"] as number | undefined,
    nexttrackingnumber: rawData["nexttrackingnumber"] as number | undefined,
    numbergroupformat: rawData["numbergroupformat"] as string | undefined,
    numberseparator: rawData["numberseparator"] as string | undefined,
    offlinesyncinterval: rawData["offlinesyncinterval"] as number | undefined,
    outlooksyncinterval: rawData["outlooksyncinterval"] as number | undefined,
    paginglimit: rawData["paginglimit"] as number | undefined,
    personalizationsettings: rawData["personalizationsettings"] as
      | string
      | undefined,
    pmdesignator: rawData["pmdesignator"] as string | undefined,
    preferredsolution: rawData["preferredsolution"] as string | undefined,
    preferredsolutionname: undefined,
    pricingdecimalprecision: rawData["pricingdecimalprecision"] as
      | number
      | undefined,
    releasechannel: rawData["releasechannel"] as number | undefined,
    reportscripterrors: rawData["reportscripterrors"] as number | undefined,
    resourcebookingexchangesyncversion: rawData[
      "resourcebookingexchangesyncversion"
    ] as number | undefined,
    selectedglobalfilterid: rawData["selectedglobalfilterid"] as
      | string
      | undefined,
    selectedglobalfilteridname: undefined,
    showweeknumber: rawData["showweeknumber"] as boolean | undefined,
    splitviewstate: rawData["splitviewstate"] as boolean | undefined,
    synccontactcompany: rawData["synccontactcompany"] as boolean | undefined,
    tablescopeddvsearchfeatureteachingbubbleviews: rawData[
      "tablescopeddvsearchfeatureteachingbubbleviews"
    ] as number | undefined,
    tablescopeddvsearchquickfindteachingbubbleviews: rawData[
      "tablescopeddvsearchquickfindteachingbubbleviews"
    ] as number | undefined,
    timeformatcode: rawData["timeformatcode"] as number | undefined,
    timeformatstring: rawData["timeformatstring"] as string | undefined,
    timeseparator: rawData["timeseparator"] as string | undefined,
    timezonecode: rawData["timezonecode"] as number | undefined,
    trackingtokenid: rawData["trackingtokenid"] as number | undefined,
    transactioncurrencyid: rawData["transactioncurrencyid"] as
      | string
      | undefined,
    transactioncurrencyidname: undefined,
    trytogglesets: rawData["trytogglesets"] as string | undefined,
    trytogglestatus: rawData["trytogglestatus"] as number | undefined,
    uilanguageid: rawData["uilanguageid"] as number | undefined,
    usecrmformforappointment: rawData["usecrmformforappointment"] as
      | number
      | undefined,
    usecrmformforcontact: rawData["usecrmformforcontact"] as number | undefined,
    usecrmformforemail: rawData["usecrmformforemail"] as number | undefined,
    usecrmformfortask: rawData["usecrmformfortask"] as number | undefined,
    useimagestrips: rawData["useimagestrips"] as boolean | undefined,
    userprofile: rawData["userprofile"] as string | undefined,
    versionnumber: rawData["versionnumber"] as number | undefined,
    visualizationpanelayout: rawData["visualizationpanelayout"] as
      | string
      | undefined,
    workdaystarttime: rawData["workdaystarttime"] as string | undefined,
    workdaystoptime: rawData["workdaystoptime"] as string | undefined,
  };
};
