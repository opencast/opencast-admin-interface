import { RootState } from "../store";

/**
 * This file contains selectors regarding table filters
 */

export const getFilters = (state: RootState) => state.tableFilters.data;
export const getStats = (state: RootState) => state.tableFilters.stats;
export const getTextFilter = (state: RootState) => state.tableFilters.textFilter;
export const getSelectedFilter = (state: RootState) => state.tableFilters.selectedFilter;
export const getSecondFilter = (state: RootState) => state.tableFilters.secondFilter;
export const getCurrentFilterResource = (state: RootState) => state.tableFilters.currentResource;
