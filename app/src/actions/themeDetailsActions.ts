/**
 * This file contains all redux actions that can be executed on a certain theme
 */

// Constants of action types for fetching details of a certain theme from server
export const LOAD_THEME_DETAILS_IN_PROGRESS = "LOAD_THEME_DETAILS_IN_PROGRESS";
export const LOAD_THEME_DETAILS_SUCCESS = "LOAD_THEME_DETAILS_SUCCESS";
export const LOAD_THEME_DETAILS_FAILURE = "LOAD_THEME_DETAILS_FAILURE";
export const LOAD_THEME_USAGE_SUCCESS = "LOAD_THEME_USAGE_SUCCESS";

// Actions affecting fetching details of a certain theme from server

export const loadThemeDetailsInProgress = () => ({
	type: LOAD_THEME_DETAILS_IN_PROGRESS,
});

// @ts-expect-error TS(7006): Parameter 'themeDetails' implicitly has an 'any' t... Remove this comment to see the full error message
export const loadThemeDetailsSuccess = (themeDetails) => ({
	type: LOAD_THEME_DETAILS_SUCCESS,
	payload: { themeDetails },
});

export const loadThemeDetailsFailure = () => ({
	type: LOAD_THEME_DETAILS_FAILURE,
});

// @ts-expect-error TS(7006): Parameter 'themeUsage' implicitly has an 'any' typ... Remove this comment to see the full error message
export const loadThemeUsageSuccess = (themeUsage) => ({
	type: LOAD_THEME_USAGE_SUCCESS,
	payload: { themeUsage },
});
