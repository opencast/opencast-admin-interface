import { RootState } from "../store";

/**
 * This file contains selectors regarding series
 */
export const getSeries = (state: RootState) => state.series.results;
export const getVisibilitySeriesColumns = (state: RootState) => state.series.columns;
export const isShowActions = (state: RootState) => state.series.showActions;
export const isSeriesDeleteAllowed = (state: RootState) => state.series.deletionAllowed;
export const getSeriesHasEvents = (state: RootState) => state.series.hasEvents;
export const getSeriesMetadata = (state: RootState) => state.series.metadata;
export const getSeriesExtendedMetadata = (state: RootState) => state.series.extendedMetadata;
export const getSeriesThemes = (state: RootState) => state.series.themes;
export const getTotalSeries = (state: RootState) => state.series.total;
