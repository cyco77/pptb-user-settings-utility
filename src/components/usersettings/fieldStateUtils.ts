import { Usersettings } from "../../types/usersettings";
import { Systemuser } from "../../types/systemuser";

export type FieldState<K extends keyof Usersettings> = {
  value: Usersettings[K] | undefined;
  isDifferent: boolean;
};

export type FieldEffectiveValue<K extends keyof Usersettings> = {
  value: Usersettings[K] | undefined;
  showNoChange: boolean;
  state: FieldState<K>;
};

export type FieldDifference = {
  user: Systemuser;
  value: any;
};

/**
 * Get the state of a field across all user settings
 */
export const getFieldState = <K extends keyof Usersettings>(
  fieldKey: K,
  allUsersettings: Usersettings[]
): FieldState<K> => {
  if (!allUsersettings || allUsersettings.length === 0) {
    return { value: undefined, isDifferent: false };
  }

  const values = allUsersettings.map((settings) => settings[fieldKey]);
  const firstValue = values[0];
  const allSame = values.every((value) => {
    if (value === firstValue) return true;
    if (value == null && firstValue == null) return true;
    return false;
  });

  return {
    value: allSame ? firstValue : undefined,
    isDifferent: !allSame,
  };
};

/**
 * Get the effective value of a field, considering edited values
 */
export const getFieldEffectiveValue = <K extends keyof Usersettings>(
  fieldKey: K,
  allUsersettings: Usersettings[],
  editedSettings: Usersettings | null
): FieldEffectiveValue<K> => {
  const state = getFieldState(fieldKey, allUsersettings);
  const editedValue = editedSettings?.[fieldKey];
  const hasEditedValue = editedValue !== undefined;
  const showNoChange = state.isDifferent && !hasEditedValue;
  const value = hasEditedValue ? editedValue : state.value;

  return {
    value,
    showNoChange,
    state,
  };
};

/**
 * Get the differences for a field across all users
 */
export const getFieldDifferences = (
  fieldKey: keyof Usersettings,
  systemusers: Systemuser[],
  allUsersettings: Usersettings[]
): FieldDifference[] | null => {
  if (!systemusers || !allUsersettings) {
    return null;
  }

  if (systemusers.length <= 1 || allUsersettings.length <= 1) {
    return null;
  }

  if (systemusers.length !== allUsersettings.length) {
    console.warn("Mismatch between systemusers and allUsersettings lengths");
    return null;
  }

  const values = allUsersettings
    .map((settings, index) => {
      const user = systemusers[index];
      if (!user) {
        console.error("User not found at index", index);
        return null;
      }
      return {
        user,
        value: settings[fieldKey],
      };
    })
    .filter((v) => v !== null) as FieldDifference[];

  if (values.length === 0) {
    return null;
  }

  // Check if all values are the same
  const firstValue = values[0].value;
  const allSame = values.every((v) => {
    if (v.value === firstValue) return true;
    if (v.value == null && firstValue == null) return true;
    return false;
  });

  if (allSame) {
    return null; // All same, no info icon needed
  }

  return values;
};
