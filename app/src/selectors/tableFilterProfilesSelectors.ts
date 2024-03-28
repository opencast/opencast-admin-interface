import { RootState } from "../store";
/**
 * This file contains selectors regarding filter profiles
 */

export const getFilterProfiles = (state: RootState) => state.tableFilterProfiles.profiles;
