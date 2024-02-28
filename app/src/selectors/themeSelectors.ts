import { RootState } from "../store";

/**
 * This file contains selectors regarding themes
 */
export const getThemes = (state: RootState) => state.themes.results;
export const getTotalThemes = (state: RootState) => state.themes.total;
