import React from "react";
import { Field, Tooltip } from "@fluentui/react-components";
import { QuestionCircle16Regular } from "@fluentui/react-icons";
import { Usersettings } from "../../types/usersettings";
import { useUsersettingsStyles } from "./styles";

const PERSONAL_OPTIONS_URL =
  "https://learn.microsoft.com/power-apps/user/set-personal-options";
const USER_SETTINGS_REFERENCE_URL =
  "https://learn.microsoft.com/power-apps/developer/data-platform/reference/entities/usersettings";

const settingHelpLinks: Partial<Record<keyof Usersettings, string>> = {
  paginglimit: `${PERSONAL_OPTIONS_URL}#general-tab-options`,
  displaydensity:
    "https://learn.microsoft.com/power-apps/user/appearance-settings#display-density",
  timezonecode: `${PERSONAL_OPTIONS_URL}#general-tab-options`,
  uilanguageid: `${PERSONAL_OPTIONS_URL}#languages-tab-options`,
  localeid:
    "https://learn.microsoft.com/power-platform/admin/customize-regional-options-admins",
  currencyformatcode:
    "https://learn.microsoft.com/power-platform/admin/customize-regional-options-admins",
  helplanguageid: `${PERSONAL_OPTIONS_URL}#languages-tab-options`,
  isdefaultcountrycodecheckenabled: `${PERSONAL_OPTIONS_URL}#general-tab-options`,
  defaultcountrycode: `${PERSONAL_OPTIONS_URL}#general-tab-options`,
  transactioncurrencyid: `${PERSONAL_OPTIONS_URL}#general-tab-options`,
  calendartype:
    "https://learn.microsoft.com/power-platform/admin/customize-regional-options-admins",
  homepagearea: `${PERSONAL_OPTIONS_URL}#general-tab-options`,
  homepagesubarea: `${PERSONAL_OPTIONS_URL}#general-tab-options`,
  defaultdashboardid: `${PERSONAL_OPTIONS_URL}#general-tab-options`,
  entityformmode: `${USER_SETTINGS_REFERENCE_URL}#BKMK_EntityFormMode`,
  advancedfindstartupmode: `${PERSONAL_OPTIONS_URL}#general-tab-options`,
  defaultcalendarview: `${PERSONAL_OPTIONS_URL}#activities-tab-options`,
  workdaystarttime: `${PERSONAL_OPTIONS_URL}#activities-tab-options`,
  workdaystoptime: `${PERSONAL_OPTIONS_URL}#activities-tab-options`,
  showweeknumber:
    "https://learn.microsoft.com/power-platform/admin/customize-regional-options-admins",
  visualizationpanelayout: `${USER_SETTINGS_REFERENCE_URL}#BKMK_VisualizationPaneLayout`,
  usecrmformforappointment:
    "https://learn.microsoft.com/power-platform/admin/set-personal-options-affect-tracking-synchronization-between-dynamics-365-outlook-exchange",
  usecrmformforcontact:
    "https://learn.microsoft.com/power-platform/admin/set-personal-options-affect-tracking-synchronization-between-dynamics-365-outlook-exchange",
  usecrmformforemail:
    "https://learn.microsoft.com/power-platform/admin/set-personal-options-affect-tracking-synchronization-between-dynamics-365-outlook-exchange",
  usecrmformfortask:
    "https://learn.microsoft.com/power-platform/admin/set-personal-options-affect-tracking-synchronization-between-dynamics-365-outlook-exchange",
  autocaptureuserstatus: "https://learn.microsoft.com/dynamics365/sales/auto-capture",
  releasechannel: "https://learn.microsoft.com/power-platform/admin/user-channel-override",
  defaultsearchexperience: "https://learn.microsoft.com/power-apps/user/search",
  incomingemailfilteringmethod:
    "https://learn.microsoft.com/dynamics365/outlook-addin/user-guide/set-option-automatically-track-incoming-outlook-email",
  isemailconversationviewenabled: `${PERSONAL_OPTIONS_URL}#email-tab-options`,
  autocreatecontactonpromote: `${PERSONAL_OPTIONS_URL}#email-tab-options`,
  datavalidationmodeforexporttoexcel:
    `${USER_SETTINGS_REFERENCE_URL}#BKMK_DataValidationModeForExportToExcel`,
  reportscripterrors: `${PERSONAL_OPTIONS_URL}#privacy-tab-options`,
  issendasallowed: "https://learn.microsoft.com/power-platform/admin/send-email-on-behalf",
};

const settingHelpSummaries: Partial<Record<keyof Usersettings, string>> = {
  paginglimit:
    "Sets the maximum number of rows shown on each list page. Microsoft notes that smaller page sizes can improve grid performance.",
  displaydensity:
    "Controls how compact or spacious supported app controls appear. Some controls might not yet respond to density settings.",
  timezonecode:
    "Sets the time zone used to display dates and times for the user. If you also use Outlook, Microsoft recommends matching its time zone.",
  uilanguageid:
    "Sets the language used for interface labels and dialog boxes. Only languages installed and enabled in the environment are available.",
  localeid:
    "Sets regional conventions for dates, times, numbers, and currencies. These formats affect how values are displayed to the user.",
  helplanguageid:
    "Sets the language used for Help content. Additional languages must be installed and enabled by an administrator.",
  isdefaultcountrycodecheckenabled:
    "Enables or disables prefixing phone numbers with a default country or region calling code. Set the code in the adjacent Country/Region Code Prefix setting.",
  defaultcountrycode:
    "Specifies the default calling code used for country or region prefixing. Enable prefixing separately to use this value.",
  transactioncurrencyid:
    "Sets the user's default currency for financial transactions. It does not change the organization's base currency.",
  calendartype:
    "Sets the calendar system used for regional date formatting. Available calendar systems depend on the user's locale and environment.",
  homepagearea:
    "Sets the default home pane or app area shown when the user signs in. The available choices depend on the apps and areas available to that user.",
  homepagesubarea:
    "Sets the default page within the selected home pane or app area. Only pages available in that area can be selected.",
  defaultdashboardid:
    "Selects the dashboard shown by default for the user. The dashboard must be available to that user.",
  entityformmode:
    "Sets the default form mode used when opening records. Options are organization default, read-optimized, and edit.",
  advancedfindstartupmode:
    "Controls whether Advanced Find opens with query details hidden or visible. Choose Detailed to show query details by default.",
  defaultcalendarview:
    "Sets the default calendar view. Choose day, week, or month; users can still switch views in the calendar.",
  workdaystarttime:
    "Sets the start time for the user's default work hours. These hours are used by calendar and scheduling experiences.",
  workdaystoptime:
    "Sets the end time for the user's default work hours. Together with the start time, it defines the user's normal workday.",
  showweeknumber:
    "Controls whether calendar views display week numbers. Calendar week numbering can also depend on regional settings.",
  visualizationpanelayout:
    "Controls the layout of the visualization pane. Choose a top-bottom or side-by-side arrangement.",
  usecrmformforappointment:
    "Controls whether Outlook uses the Dynamics 365 form when creating appointments. This preference applies to supported Outlook integration scenarios.",
  usecrmformforcontact:
    "Controls whether Outlook uses the Dynamics 365 form when creating contacts. This preference applies to supported Outlook integration scenarios.",
  usecrmformforemail:
    "Controls whether Outlook uses the Dynamics 365 form when creating email. This preference applies to supported Outlook integration scenarios.",
  usecrmformfortask:
    "Controls whether Outlook uses the Dynamics 365 form when creating tasks. This preference applies to supported Outlook integration scenarios.",
  autocaptureuserstatus:
    "Stores the user's Auto Capture preference for activity suggestions. Auto Capture can surface related emails and meetings from Outlook for review in Dynamics 365 Sales.",
  releasechannel:
    "Overrides the model-driven app release channel for this user. The user override takes precedence over the environment and app channels.",
  defaultsearchexperience:
    "Sets the default search experience in model-driven apps. Choices include Relevance, Categorized, Use last search, and Custom search.",
  incomingemailfilteringmethod:
    "Controls which incoming Outlook messages are automatically tracked in Dynamics 365. You can track all email, replies to Dynamics 365 email, messages from selected record types, or none.",
  isemailconversationviewenabled:
    "Controls whether related emails appear as a conversation thread on the timeline. This changes how email activity is grouped for the user.",
  autocreatecontactonpromote:
    "Controls whether Dynamics 365 automatically creates a contact when an email or appointment is tracked. The personal option documentation describes this alongside automatic record creation from tracked email.",
  datavalidationmodeforexporttoexcel:
    "Controls data validation in Excel worksheets exported in a format intended for re-import. Full applies validation; None disables it.",
  reportscripterrors:
    "Sets the user's preference for reporting script errors to Microsoft. The user can ask each time, send automatically, or never send reports.",
  issendasallowed:
    "Allows other users to send email on this user's behalf. The sender still needs the appropriate security privilege, and the user's name appears as the sender.",
};

interface SettingFieldProps {
  fieldKey: keyof Usersettings;
  label: React.ReactNode;
  children: React.ReactNode;
}

export const SettingField: React.FC<SettingFieldProps> = ({
  fieldKey,
  label,
  children,
}) => {
  const styles = useUsersettingsStyles();
  const helpUrl = settingHelpLinks[fieldKey];
  const helpSummary = settingHelpSummaries[fieldKey];

  return (
    <div className={styles.settingField}>
      <div className={styles.fieldCaption}>
        <div className={styles.fieldCaptionText}>{label}</div>
        {helpUrl && (
          <Tooltip
            content={helpSummary ?? "Open the related Microsoft documentation."}
            relationship="description"
            withArrow
          >
              <a
                className={styles.helpLink}
                href={helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Microsoft help for ${String(fieldKey)}`}
                onClick={(event) => {
                  event.preventDefault();
                  void window.toolboxAPI.utils
                    .openInConnectionBrowser(helpUrl)
                    .catch(() => {
                      window.open(helpUrl, "_blank", "noopener,noreferrer");
                    });
                }}
              >
              <QuestionCircle16Regular />
            </a>
          </Tooltip>
        )}
      </div>
      <Field
        label={<span>{label}</span>}
        className={styles.fieldControl}
        size="medium"
      >
        {children}
      </Field>
    </div>
  );
};
