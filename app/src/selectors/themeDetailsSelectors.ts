import { RootState } from "../store";

/**
 * This file contains selectors regarding details of a certain theme
 */
export const getThemeDetails = (state: RootState) => state.themeDetails.details;
export const getThemeUsage = (state: RootState) => state.themeDetails.usage;
