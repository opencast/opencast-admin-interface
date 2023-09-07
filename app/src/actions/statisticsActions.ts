/**
 * This file contains all redux actions that can be executed on the statistics page
 */

// Constants of actions types
export const LOAD_STATISTICS_IN_PROGRESS = "LOAD_STATISTICS_IN_PROGRESS";
export const LOAD_STATISTICS_SUCCESS = "LOAD_STATISTICS_SUCCESS";
export const LOAD_STATISTICS_FAILURE = "LOAD_STATISTICS_FAILURE";
export const UPDATE_STATISTICS_SUCCESS = "LOAD_STATISTICS_SUCCESS";
export const UPDATE_STATISTICS_FAILURE = "LOAD_STATISTICS_FAILURE";

// Actions affecting fetching statistics from server
export const loadStatisticsInProgress = () => ({
	type: LOAD_STATISTICS_IN_PROGRESS,
});

// @ts-expect-error TS(7006): Parameter 'statistics' implicitly has an 'any' typ... Remove this comment to see the full error message
export const loadStatisticsSuccess = (statistics, hasError) => ({
	type: LOAD_STATISTICS_SUCCESS,
	payload: {
		statistics,
		hasError,
	},
});

// @ts-expect-error TS(7006): Parameter 'hasError' implicitly has an 'any' type.
export const loadStatisticsFailure = (hasError) => ({
	type: LOAD_STATISTICS_FAILURE,
	payload: {
		hasError,
	},
});

// @ts-expect-error TS(7006): Parameter 'statistics' implicitly has an 'any' typ... Remove this comment to see the full error message
export const updateStatisticsSuccess = (statistics) => ({
	type: UPDATE_STATISTICS_SUCCESS,
	payload: {
		statistics,
	},
});

export const updateStatisticsFailure = () => ({
	type: UPDATE_STATISTICS_FAILURE,
});
