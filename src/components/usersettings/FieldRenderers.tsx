import React from "react";
import {
  Field,
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

export interface FieldRendererProps {
  allUsersettings: Usersettings[];
  editedSettings: Usersettings | null;
  setEditedSettings: React.Dispatch<React.SetStateAction<Usersettings | null>>;
  systemusers: Systemuser[];
  formatContext: FormatValueContext;
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
    if (!state.isDifferent) {
      return label;
    }

    return (
      <div className={styles.fieldLabelWithInfo}>
        {label}
        <FieldInfoTooltip
          fieldKey={field}
          systemusers={systemusers}
          allUsersettings={allUsersettings}
          formatContext={formatContext}
        />
      </div>
    );
  };
};

/**
 * Hook providing field rendering functions
 */
export const useFieldRenderers = (props: FieldRendererProps) => {
  const { allUsersettings, editedSettings, setEditedSettings } = props;
  const renderLabelWithInfo = useLabelWithInfo(props);

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
      <Field label={renderLabelWithInfo(label, field)} size="medium">
        <Input
          size="medium"
          value={displayValue}
          readOnly={!editable}
          onChange={(e) => {
            if (editable && editedSettings) {
              setEditedSettings({
                ...editedSettings,
                [field]: e.target.value || undefined,
              });
            }
          }}
        />
      </Field>
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
      resolvedValue !== undefined ? [String(resolvedValue)] : ["0"];
    const displayValue = showNoChange
      ? "No change"
      : resolvedValue !== undefined
      ? options[resolvedValue as number] || String(resolvedValue)
      : "No change";

    return (
      <Field label={renderLabelWithInfo(label, field)} size="medium">
        <Dropdown
          size="medium"
          value={displayValue}
          selectedOptions={selectedOptions}
          onOptionSelect={(_e, data) => {
            if (editedSettings && data.optionValue !== undefined) {
              const selectedValue = parseInt(data.optionValue);
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
          {Object.entries(options).map(([key, text]) => (
            <Option key={key} value={key}>
              {text}
            </Option>
          ))}
        </Dropdown>
      </Field>
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
      ? "0"
      : baseValue === undefined || baseValue === null
      ? "0"
      : baseValue
      ? "2"
      : "1";
    const displayValue = showNoChange
      ? "No change"
      : baseValue === undefined || baseValue === null
      ? "No change"
      : baseValue
      ? "Yes"
      : "No";

    return (
      <Field label={renderLabelWithInfo(label, field)} size="medium">
        <Dropdown
          size="medium"
          value={displayValue}
          selectedOptions={[selectedIndex]}
          onOptionSelect={(_e, data) => {
            if (editedSettings) {
              const newValue =
                data.optionValue === "0" ? undefined : data.optionValue === "2";
              setEditedSettings({
                ...editedSettings,
                [field]: newValue,
              });
            }
          }}
        >
          <Option key="0" value="0">
            No change
          </Option>
          <Option key="1" value="1">
            No
          </Option>
          <Option key="2" value="2">
            Yes
          </Option>
        </Dropdown>
      </Field>
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
      <Field label={renderLabelWithInfo(label, field)} size="medium">
        <Combobox
          size="medium"
          value={displayValue}
          selectedOptions={selectedOptions}
          onOptionSelect={(_e, data) => {
            if (editedSettings) {
              const rawValue = data.optionValue;
              const parsedValue = parseValue
                ? parseValue(rawValue || "")
                : rawValue || undefined;
              setEditedSettings({
                ...editedSettings,
                [field]: parsedValue,
              });
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
      </Field>
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
