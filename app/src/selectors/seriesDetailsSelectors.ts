/**
 * This file contains selectors regarding details of a certain series
 */
export const getSeriesDetailsMetadata = (state: any) => state.seriesDetails.metadata;
export const getSeriesDetailsExtendedMetadata = (state: any) => state.seriesDetails.extendedMetadata;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getSeriesDetailsAcl = (state) => state.seriesDetails.acl;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getSeriesDetailsFeeds = (state) => state.seriesDetails.feeds;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getSeriesDetailsTheme = (state) => state.seriesDetails.theme;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getSeriesDetailsThemeNames = (state) =>
	state.seriesDetails.themeNames;

/* selectors for statistics */
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const hasStatistics = (state) =>
	state.seriesDetails.statistics.length > 0;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const getStatistics = (state) => state.seriesDetails.statistics;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const hasStatisticsError = (state) =>
	state.seriesDetails.hasStatisticsError;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isFetchingStatistics = (state) =>
	state.seriesDetails.fetchingStatisticsInProgress;
