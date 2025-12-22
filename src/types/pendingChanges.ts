import { Usersettings } from "./usersettings";

/**
 * Represents a single field change for a user
 */
export interface FieldChange {
  fieldName: keyof Usersettings;
  newValue: any;
}

/**
 * Represents all pending changes for a single user
 */
export interface UserPendingChanges {
  systemuserid: string;
  userFullname: string;
  changes: Map<keyof Usersettings, any>;
}

/**
 * Map of user ID to their pending changes
 */
export type PendingChangesMap = Map<string, UserPendingChanges>;
