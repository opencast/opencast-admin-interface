import { RootState } from "../store";

/**
 * This file contains selectors regarding groups
 */
export const getGroups = (state: RootState) => state.groups.results;
export const getTotalGroups = (state: RootState) => state.groups.total;
