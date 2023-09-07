/**
 * This file contains selectors regarding series
 */

export const getSeries = (state: any) => state.series.results;
export const getVisibilitySeriesColumns = (state: any) => state.series.columns;
export const isShowActions = (state: any) => state.series.showActions;
export const isSeriesDeleteAllowed = (state: any) => state.series.deletionAllowed;
export const getSeriesHasEvents = (state: any) => state.series.hasEvents;
export const getSeriesMetadata = (state: any) => state.series.metadata;
export const getSeriesExtendedMetadata = (state: any) => state.series.extendedMetadata;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getSeriesThemes = (state) => state.series.themes;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getTotalSeries = (state) => state.series.total;
