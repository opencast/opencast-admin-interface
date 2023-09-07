/**
 * This file contains selectors regarding table filters
 */

export const getFilters = (state: any) => state.tableFilters.data;
export const getStats = (state: any) => state.tableFilters.stats;
export const getTextFilter = (state: any) => state.tableFilters.textFilter;
export const getSelectedFilter = (state: any) => state.tableFilters.selectedFilter;
export const getSecondFilter = (state: any) => state.tableFilters.secondFilter;
export const getCurrentFilterResource = (state: any) => state.tableFilters.currentResource;
