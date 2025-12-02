import React, { useState, useEffect } from "react";
import { Field, Option, Combobox } from "@fluentui/react-components";
import { Usersettings } from "../../types/usersettings";
import { SitemapData } from "../../types/sitemap";
import { Timezone } from "../../types/timezone";
import { Language } from "../../types/language";
import { Format } from "../../types/format";
import { Systemuser } from "../../types/systemuser";
import { Dashboard } from "../../types/dashboard";
import { Currency } from "../../types/currency";
import { useUsersettingsStyles } from "./styles";
import { useFieldRenderers, FieldRendererProps } from "./FieldRenderers";
import { SettingsSection } from "./SettingsSection";
import { getFieldEffectiveValue } from "./fieldStateUtils";
import { FormatValueContext } from "./formatFieldValue";
import { optionSetMappings } from "./optionSetMappings";

interface IUsersettingsTabProps {
  usersettings: Usersettings | null;
  isLoading: boolean;
  sitemapData: SitemapData;
  timezones: Timezone[];
  languages: Language[];
  formats: Format[];
  systemusers: Systemuser[];
  allUsersettings: Usersettings[];
  dashboards: Dashboard[];
  currencies: Currency[];
}

export const UsersettingsTab: React.FC<IUsersettingsTabProps> = ({
  usersettings,
  isLoading,
  sitemapData,
  timezones,
  languages,
  formats,
  systemusers,
  allUsersettings,
  dashboards,
  currencies,
}) => {
  const styles = useUsersettingsStyles();
  const [editedSettings, setEditedSettings] = useState<Usersettings | null>(
    null
  );
  const [selectedArea, setSelectedArea] = useState<string>("");

  // Create format context for field value formatting
  const formatContext: FormatValueContext = {
    timezones,
    languages,
    formats,
    sitemapData,
    dashboards,
    currencies,
  };

  // Field renderer props
  const fieldRendererProps: FieldRendererProps = {
    allUsersettings,
    editedSettings,
    setEditedSettings,
    systemusers,
    formatContext,
  };

  const {
    renderTextField,
    renderDropdown,
    renderBooleanDropdown,
    renderLabelWithInfo,
  } = useFieldRenderers(fieldRendererProps);

  useEffect(() => {
    if (usersettings) {
      setEditedSettings({ ...usersettings });
      setSelectedArea(usersettings.homepagearea || "");
    } else {
      setEditedSettings(null);
      setSelectedArea("");
    }
  }, [usersettings]);

  if (isLoading) {
    return (
      <div className={styles.loadingMessage}>Loading user settings...</div>
    );
  }

  if (!usersettings) {
    return (
      <div className={styles.loadingMessage}>No user settings available</div>
    );
  }

  if (!editedSettings) {
    return null;
  }

  const filteredSubAreas = selectedArea
    ? sitemapData.subAreas.filter((s) => s.areaId === selectedArea)
    : sitemapData.subAreas;

  // Helper for creating combobox fields with consistent pattern
  const renderComboboxField = (
    label: string,
    field: keyof Usersettings,
    items: Array<{ value: string; label: string }>,
    onSelect?: (value: string | undefined) => Partial<Usersettings>
  ) => {
    const { value, showNoChange } = getFieldEffectiveValue(
      field,
      allUsersettings,
      editedSettings
    );
    const displayValue = showNoChange
      ? "No change"
      : value === undefined || value === null
      ? "No change"
      : items.find((i) => i.value === String(value))?.label ?? String(value);

    const selectedOptions =
      showNoChange || value === undefined || value === null
        ? [""]
        : [String(value)];

    return (
      <Field label={renderLabelWithInfo(label, field)} size="medium">
        <Combobox
          size="medium"
          value={displayValue}
          selectedOptions={selectedOptions}
          onOptionSelect={(_e, data) => {
            if (editedSettings) {
              const updates = onSelect
                ? onSelect(data.optionValue || undefined)
                : { [field]: data.optionValue || undefined };
              setEditedSettings({ ...editedSettings, ...updates });
            }
          }}
        >
          <Option key="" value="">
            No change
          </Option>
          {items.map((item) => (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          ))}
        </Combobox>
      </Field>
    );
  };

  // Helper for number-based combobox (timezone, language, etc.)
  const renderNumberCombobox = (
    label: string,
    field: keyof Usersettings,
    items: Array<{ value: number; label: string }>
  ) => {
    const { value, showNoChange } = getFieldEffectiveValue(
      field,
      allUsersettings,
      editedSettings
    );
    const displayValue = showNoChange
      ? "No change"
      : value === undefined || value === null
      ? "No change"
      : items.find((i) => i.value === value)?.label ?? String(value);

    const selectedOptions =
      showNoChange || value === undefined || value === null
        ? ["0"]
        : [String(value)];

    return (
      <Field label={renderLabelWithInfo(label, field)} size="medium">
        <Combobox
          size="medium"
          value={displayValue}
          selectedOptions={selectedOptions}
          onOptionSelect={(_e, data) => {
            if (editedSettings) {
              const selectedValue = data.optionValue
                ? parseInt(data.optionValue)
                : undefined;
              setEditedSettings({
                ...editedSettings,
                [field]: selectedValue === 0 ? undefined : selectedValue,
              });
            }
          }}
        >
          <Option key="0" value="0">
            No change
          </Option>
          {items.map((item) => (
            <Option key={item.value} value={String(item.value)}>
              {item.label}
            </Option>
          ))}
        </Combobox>
      </Field>
    );
  };

  return (
    <div>
      {/* Display Settings */}
      <SettingsSection title="Display Settings">
        {renderDropdown(
          "Records Per Page",
          "paginglimit",
          optionSetMappings.paginglimit
        )}
      </SettingsSection>

      {/* Regional & Language Settings */}
      <SettingsSection title="Regional & Language Settings">
        {renderNumberCombobox(
          "Time Zone",
          "timezonecode",
          timezones.map((tz) => ({
            value: tz.timezonecode,
            label: tz.userinterfacename,
          }))
        )}
        {renderNumberCombobox(
          "UI Language",
          "uilanguageid",
          languages.map((l) => ({
            value: l.localeid,
            label: `${l.language}${l.region ? ` (${l.region})` : ""}`,
          }))
        )}
        {renderNumberCombobox(
          "Regional Format",
          "localeid",
          formats.map((f) => ({
            value: f.localeid,
            label: `${f.language}${f.region ? ` (${f.region})` : ""}`,
          }))
        )}
        {renderNumberCombobox(
          "Help Language",
          "helplanguageid",
          languages.map((l) => ({
            value: l.localeid,
            label: `${l.language}${l.region ? ` (${l.region})` : ""}`,
          }))
        )}
        {renderComboboxField(
          "Currency",
          "transactioncurrencyid",
          currencies.map((c) => ({
            value: c.transactioncurrencyid,
            label: c.currencyname,
          }))
        )}
        {renderDropdown(
          "Calendar Type",
          "calendartype",
          optionSetMappings.calendartype
        )}
      </SettingsSection>

      {/* Home Page Settings */}
      <SettingsSection title="Home Page Settings">
        {renderComboboxField(
          "App",
          "homepagearea",
          sitemapData.areas.map((a) => ({ value: a.id, label: a.title })),
          (value) => {
            setSelectedArea(value || "");
            return { homepagearea: value, homepagesubarea: undefined };
          }
        )}
        {renderComboboxField(
          "Page",
          "homepagesubarea",
          filteredSubAreas.map((s) => ({ value: s.id, label: s.title }))
        )}
        {renderComboboxField(
          "Default Dashboard",
          "defaultdashboardid",
          dashboards.map((d) => ({ value: d.formid, label: d.name }))
        )}
      </SettingsSection>

      {/* Advanced Find */}
      <SettingsSection title="Advanced Find">
        {renderDropdown(
          "Advanced Find Startup Mode",
          "advancedfindstartupmode",
          optionSetMappings.advancedfindstartupmode
        )}
      </SettingsSection>

      {/* Calendar Settings */}
      <SettingsSection title="Calendar Settings">
        {renderDropdown(
          "Default Calendar View",
          "defaultcalendarview",
          optionSetMappings.defaultcalendarview
        )}
        {renderTextField("Work Day Start Time", "workdaystarttime")}
        {renderTextField("Work Day Stop Time", "workdaystoptime")}
      </SettingsSection>

      {/* Sales & Marketing */}
      <SettingsSection title="Sales & Marketing">
        {renderBooleanDropdown("Show Week Number", "showweeknumber")}
        {renderBooleanDropdown(
          "Use CRM Form for Appointment",
          "usecrmformforappointment"
        )}
        {renderBooleanDropdown(
          "Use CRM Form for Contact",
          "usecrmformforcontact"
        )}
        {renderBooleanDropdown("Use CRM Form for Email", "usecrmformforemail")}
        {renderBooleanDropdown("Use CRM Form for Task", "usecrmformfortask")}
      </SettingsSection>

      {/* Auto Capture */}
      <SettingsSection title="Auto Capture">
        {renderDropdown(
          "Auto Capture User Status",
          "autocaptureuserstatus",
          optionSetMappings.autocaptureuserstatus
        )}
      </SettingsSection>

      {/* Microsoft 365 */}
      <SettingsSection title="Microsoft 365">
        {renderDropdown(
          "Release Channel",
          "releasechannel",
          optionSetMappings.releasechannel
        )}
      </SettingsSection>

      {/* Search Settings */}
      <SettingsSection title="Search Settings">
        {renderDropdown(
          "Default Search Experience",
          "defaultsearchexperience",
          optionSetMappings.defaultsearchexperience
        )}
      </SettingsSection>

      {/* Email Settings */}
      <SettingsSection title="Email Settings">
        {renderDropdown(
          "Incoming Email Filtering Method",
          "incomingemailfilteringmethod",
          optionSetMappings.incomingemailfilteringmethod
        )}
        {renderDropdown(
          "Auto Create Contact on Promote",
          "autocreatecontactonpromote",
          optionSetMappings.autocreatecontactonpromote
        )}
      </SettingsSection>

      {/* Export Settings */}
      <SettingsSection title="Export Settings">
        {renderDropdown(
          "Data Validation Mode for Export to Excel",
          "datavalidationmodeforexporttoexcel",
          optionSetMappings.datavalidationmodeforexporttoexcel
        )}
      </SettingsSection>

      {/* Error Reporting */}
      <SettingsSection title="Error Reporting">
        {renderDropdown(
          "Report Script Errors",
          "reportscripterrors",
          optionSetMappings.reportscripterrors
        )}
      </SettingsSection>

      {/* Privacy Settings */}
      <SettingsSection title="Privacy Settings">
        {renderBooleanDropdown("Is Send As Allowed", "issendasallowed")}
      </SettingsSection>
    </div>
  );
};
