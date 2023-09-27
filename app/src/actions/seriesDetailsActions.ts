/**
 * This file contains all redux actions that can be executed on a series
 */

// Constants of action types for fetching metadata of a certain series from server
export const LOAD_SERIES_DETAILS_IN_PROGRESS =
	"LOAD_SERIES_DETAILS_IN_PROGRESS";
export const LOAD_SERIES_DETAILS_METADATA_SUCCESS =
	"LOAD_SERIES_DETAILS_METADATA_SUCCESS";
export const LOAD_SERIES_DETAILS_FAILURE = "LOAD_SERIES_DETAILS_FAILURE";

// Constants of action types for fetching acls of a certain series from server
export const LOAD_SERIES_DETAILS_ACLS_SUCCESS =
	"LOAD_SERIES_DETAILS_ACLS_SUCCESS";

// Constants of action types for fetching feeds of a certain series from server
export const LOAD_SERIES_DETAILS_FEEDS_SUCCESS =
	"LOAD_SERIES_DETAILS_FEEDS_SUCCESS";

// Constants of action types for fetching theme of a certain series from server
export const LOAD_SERIES_DETAILS_THEME_SUCCESS =
	"LOAD_SERIES_DETAILS_THEME_SUCCESS";
export const LOAD_SERIES_DETAILS_THEME_NAMES_IN_PROGRESS =
	"LOAD_SERIES_DETAILS_THEME_NAMES_IN_PROGRESS";
export const LOAD_SERIES_DETAILS_THEME_NAMES_SUCCESS =
	"LOAD_SERIES_DETAILS_THEME_NAMES_SUCCESS";
export const LOAD_SERIES_DETAILS_THEME_NAMES_FAILURE =
	"LOAD_SERIES_DETAILS_THEME_NAMES_FAILURE";

export const SET_SERIES_DETAILS_THEME = "SET_SERIES_DETAILS_THEME";
export const SET_SERIES_DETAILS_METADATA = "SET_SERIES_DETAILS_METADATA";
export const SET_SERIES_DETAILS_EXTENDED_METADATA =
	"SET_SERIES_DETAILS_EXTENDED_METADATA";

// Constants of actions types for fetching statistics of a certain series from server
export const LOAD_SERIES_STATISTICS_IN_PROGRESS =
	"LOAD_SERIES_STATISTICS_IN_PROGRESS";
export const LOAD_SERIES_STATISTICS_SUCCESS = "LOAD_SERIES_STATISTICS_SUCCESS";
export const LOAD_SERIES_STATISTICS_FAILURE = "LOAD_SERIES_STATISTICS_FAILURE";
export const UPDATE_SERIES_STATISTICS_SUCCESS =
	"LOAD_SERIES_STATISTICS_SUCCESS";
export const UPDATE_SERIES_STATISTICS_FAILURE =
	"LOAD_SERIES_STATISTICS_FAILURE";

// Actions affecting fetching metadata of a certain series from server

export const loadSeriesDetailsInProgress = () => ({
	type: LOAD_SERIES_DETAILS_IN_PROGRESS,
});

export const loadSeriesDetailsMetadataSuccess = (
// @ts-expect-error TS(7006): Parameter 'seriesMetadata' implicitly has an 'any'... Remove this comment to see the full error message
	seriesMetadata,
// @ts-expect-error TS(7006): Parameter 'extendedMetadata' implicitly has an 'an... Remove this comment to see the full error message
	extendedMetadata
) => ({
	type: LOAD_SERIES_DETAILS_METADATA_SUCCESS,
	payload: {
		seriesMetadata,
		extendedMetadata,
	},
});

export const loadSeriesDetailsFailure = () => ({
	type: LOAD_SERIES_DETAILS_FAILURE,
});

// Actions affecting fetching acls of a certain series from server

// @ts-expect-error TS(7006): Parameter 'seriesAcls' implicitly has an 'any' typ... Remove this comment to see the full error message
export const loadSeriesDetailsAclsSuccess = (seriesAcls) => ({
	type: LOAD_SERIES_DETAILS_ACLS_SUCCESS,
	payload: { seriesAcls },
});

// Actions affecting fetching feeds of a certain series from server

// @ts-expect-error TS(7006): Parameter 'seriesFeeds' implicitly has an 'any' ty... Remove this comment to see the full error message
export const loadSeriesDetailsFeedsSuccess = (seriesFeeds) => ({
	type: LOAD_SERIES_DETAILS_FEEDS_SUCCESS,
	payload: { seriesFeeds },
});

// Actions affecting fetching theme of a certain series from server

// @ts-expect-error TS(7006): Parameter 'seriesTheme' implicitly has an 'any' ty... Remove this comment to see the full error message
export const loadSeriesDetailsThemeSuccess = (seriesTheme) => ({
	type: LOAD_SERIES_DETAILS_THEME_SUCCESS,
	payload: { seriesTheme },
});

export const loadSeriesDetailsThemeNamesInProgress = () => ({
	type: LOAD_SERIES_DETAILS_THEME_NAMES_IN_PROGRESS,
});

// @ts-expect-error TS(7006): Parameter 'themeNames' implicitly has an 'any' typ... Remove this comment to see the full error message
export const loadSeriesDetailsThemeNamesSuccess = (themeNames) => ({
	type: LOAD_SERIES_DETAILS_THEME_NAMES_SUCCESS,
	payload: { themeNames },
});

export const loadSeriesDetailsThemeNamesFailure = () => ({
	type: LOAD_SERIES_DETAILS_THEME_NAMES_FAILURE,
});

// @ts-expect-error TS(7006): Parameter 'seriesTheme' implicitly has an 'any' ty... Remove this comment to see the full error message
export const setSeriesDetailsTheme = (seriesTheme) => ({
	type: SET_SERIES_DETAILS_THEME,
	payload: { seriesTheme },
});

// @ts-expect-error TS(7006): Parameter 'seriesMetadata' implicitly has an 'any'... Remove this comment to see the full error message
export const setSeriesDetailsMetadata = (seriesMetadata) => ({
	type: SET_SERIES_DETAILS_METADATA,
	payload: { seriesMetadata },
});

// @ts-expect-error TS(7006): Parameter 'seriesMetadata' implicitly has an 'any'... Remove this comment to see the full error message
export const setSeriesDetailsExtendedMetadata = (seriesMetadata) => ({
	type: SET_SERIES_DETAILS_EXTENDED_METADATA,
	payload: { seriesMetadata },
});

// Actions affecting fetching statistics of a certain series from server

export const loadSeriesStatisticsInProgress = () => ({
	type: LOAD_SERIES_STATISTICS_IN_PROGRESS,
});

// @ts-expect-error TS(7006): Parameter 'statistics' implicitly has an 'any' typ... Remove this comment to see the full error message
export const loadSeriesStatisticsSuccess = (statistics, hasError) => ({
	type: LOAD_SERIES_STATISTICS_SUCCESS,
	payload: {
		statistics,
		hasError,
	},
});

// @ts-expect-error TS(7006): Parameter 'hasError' implicitly has an 'any' type.
export const loadSeriesStatisticsFailure = (hasError) => ({
	type: LOAD_SERIES_STATISTICS_FAILURE,
	payload: {
		hasError,
	},
});

// @ts-expect-error TS(7006): Parameter 'statistics' implicitly has an 'any' typ... Remove this comment to see the full error message
export const updateSeriesStatisticsSuccess = (statistics) => ({
	type: UPDATE_SERIES_STATISTICS_SUCCESS,
	payload: {
		statistics,
	},
});

export const updateSeriesStatisticsFailure = () => ({
	type: UPDATE_SERIES_STATISTICS_FAILURE,
});
