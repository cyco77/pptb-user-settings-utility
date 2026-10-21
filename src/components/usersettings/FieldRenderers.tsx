import React from "react";
import {
  Input,
  Dropdown,
  Option,
  Combobox,
} from "@fluentui/react-components";
import { Usersettings } from "../../types/usersettings";
import { Systemuser } from "../../types/systemuser";
import { getFieldEffectiveValue } from "./fieldStateUtils";
import { FormatValueContext } from "./formatFieldValue";
import { FieldInfoTooltip } from "./FieldInfoTooltip";
import { useUsersettingsStyles } from "./styles";
import { SettingField } from "./SettingField";

export interface FieldRendererProps {
  allUsersettings: Usersettings[];
  editedSettings: Usersettings | null;
  setEditedSettings: React.Dispatch<React.SetStateAction<Usersettings | null>>;
  systemusers: Systemuser[];
  formatContext: FormatValueContext;
  onFieldChange?: (fieldName: keyof Usersettings, newValue: any) => void;
}

/**
 * Render a label with optional info tooltip when values differ
 */
export const useLabelWithInfo = (props: FieldRendererProps) => {
  const styles = useUsersettingsStyles();
  const { allUsersettings, editedSettings, systemusers, formatContext } = props;

  return (label: string, field?: keyof Usersettings) => {
    if (!field) {
      return label;
    }

    const { state } = getFieldEffectiveValue(
      field,
      allUsersettings,
      editedSettings
    );

    return (
      <div className={styles.fieldLabelWithInfo}>
        {label}
        {state.isDifferent && (
          <FieldInfoTooltip
            fieldKey={field}
            systemusers={systemusers}
            allUsersettings={allUsersettings}
            formatContext={formatContext}
          />
        )}
      </div>
    );
  };
};

/**
 * Hook providing field rendering functions
 */
export const useFieldRenderers = (props: FieldRendererProps) => {
  const { allUsersettings, editedSettings, setEditedSettings, onFieldChange } =
    props;
  const renderLabelWithInfo = useLabelWithInfo(props);

  // Helper to update state and notify parent of change
  const updateField = (field: keyof Usersettings, newValue: any) => {
    if (editedSettings) {
      setEditedSettings({
        ...editedSettings,
        [field]: newValue,
      });
      onFieldChange?.(field, newValue);
    }
  };

  const renderTextField = (
    label: string,
    field: keyof Usersettings,
    editable: boolean = false
  ) => {
    const { value, showNoChange } = getFieldEffectiveValue(
      field,
      allUsersettings,
      editedSettings
    );
    const displayValue = showNoChange
      ? "No change"
      : value === undefined || value === null
      ? ""
      : String(value);

    return (
      <SettingField fieldKey={field} label={renderLabelWithInfo(label, field)}>
        <Input
          size="medium"
          value={displayValue}
          readOnly={!editable}
          onChange={(e) => {
            if (editable && editedSettings) {
              const newValue = e.target.value || undefined;
              updateField(field, newValue);
            }
          }}
        />
      </SettingField>
    );
  };

  const renderDropdown = (
    label: string,
    field: keyof Usersettings,
    options: Record<number, string>
  ) => {
    const { value, showNoChange } = getFieldEffectiveValue(
      field,
      allUsersettings,
      editedSettings
    );
    const resolvedValue =
      value !== undefined && value !== null ? value : undefined;
    const selectedOptions =
      resolvedValue !== undefined && !showNoChange
        ? [String(resolvedValue)]
        : [""];
    const displayValue = showNoChange
      ? "No change"
      : resolvedValue !== undefined
      ? options[resolvedValue as number] || String(resolvedValue)
      : "No change";

    return (
      <SettingField fieldKey={field} label={renderLabelWithInfo(label, field)}>
        <Dropdown
          size="medium"
          value={displayValue}
          selectedOptions={selectedOptions}
          onOptionSelect={(_e, data) => {
            if (editedSettings && data.optionValue !== undefined) {
              const newValue = data.optionValue
                ? parseInt(data.optionValue)
                : undefined;
              updateField(field, newValue);
            }
          }}
        >
          <Option key="no-change" value="">
            No change
          </Option>
          {Object.entries(options).map(([key, text]) => (
            <Option key={key} value={key}>
              {text}
            </Option>
          ))}
        </Dropdown>
      </SettingField>
    );
  };

  const renderBooleanDropdown = (label: string, field: keyof Usersettings) => {
    const { value, showNoChange } = getFieldEffectiveValue(
      field,
      allUsersettings,
      editedSettings
    );
    const baseValue = value;
    const selectedIndex = showNoChange
      ? ""
      : baseValue === undefined || baseValue === null
      ? ""
      : baseValue
      ? "true"
      : "false";
    const displayValue = showNoChange
      ? "No change"
      : baseValue === undefined || baseValue === null
      ? "No change"
      : baseValue
      ? "Yes"
      : "No";

    return (
      <SettingField fieldKey={field} label={renderLabelWithInfo(label, field)}>
        <Dropdown
          size="medium"
          value={displayValue}
          selectedOptions={[selectedIndex]}
          onOptionSelect={(_e, data) => {
            if (editedSettings && data.optionValue !== undefined) {
              const newValue =
                data.optionValue === "" ? undefined : data.optionValue === "true";
              updateField(field, newValue);
            }
          }}
        >
          <Option key="no-change" value="">
            No change
          </Option>
          <Option key="false" value="false">
            No
          </Option>
          <Option key="true" value="true">
            Yes
          </Option>
        </Dropdown>
      </SettingField>
    );
  };

  const renderCombobox = <T extends { id: string | number; label: string }>(
    label: string,
    field: keyof Usersettings,
    items: T[],
    getItemValue: (item: T) => string,
    getItemLabel: (item: T) => string,
    parseValue?: (value: string) => any
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
      : items.find((item) => getItemValue(item) === String(value))
      ? getItemLabel(
          items.find((item) => getItemValue(item) === String(value))!
        )
      : String(value);

    const selectedOptions =
      showNoChange || value === undefined || value === null
        ? [""]
        : [String(value)];

    return (
      <SettingField fieldKey={field} label={renderLabelWithInfo(label, field)}>
        <Combobox
          size="medium"
          value={displayValue}
          selectedOptions={selectedOptions}
          onOptionSelect={(_e, data) => {
            if (editedSettings) {
              const rawValue = data.optionValue;
              const parsedValue = rawValue
                ? parseValue
                  ? parseValue(rawValue)
                  : rawValue
                : undefined;
              updateField(field, parsedValue);
            }
          }}
        >
          <Option key="" value="">
            No change
          </Option>
          {items.map((item) => (
            <Option key={getItemValue(item)} value={getItemValue(item)}>
              {getItemLabel(item)}
            </Option>
          ))}
        </Combobox>
      </SettingField>
    );
  };

  return {
    renderTextField,
    renderDropdown,
    renderBooleanDropdown,
    renderCombobox,
    renderLabelWithInfo,
  };
};
