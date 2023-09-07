/**
 * This file contains all redux actions that can be executed on groups
 */

// Constants of action types for fetching groups from server
export const LOAD_GROUPS_IN_PROGRESS = "LOAD_GROUPS_IN_PROGRESS";
export const LOAD_GROUPS_SUCCESS = "LOAD_GROUPS_SUCCESS";
export const LOAD_GROUPS_FAILURE = "LOAD_GROUPS_FAILURE";

// Constants of action types affecting UI
export const SET_GROUP_COLUMNS = "SET_GROUP_COLUMNS";

// Actions affecting fetching groups from server

export const loadGroupsInProgress = () => ({
	type: LOAD_GROUPS_IN_PROGRESS,
});

// @ts-expect-error TS(7006): Parameter 'groups' implicitly has an 'any' type.
export const loadGroupsSuccess = (groups) => ({
	type: LOAD_GROUPS_SUCCESS,
	payload: { groups },
});

export const loadGroupsFailure = () => ({
	type: LOAD_GROUPS_FAILURE,
});

// Actions affecting UI

// @ts-expect-error TS(7006): Parameter 'updatedColumns' implicitly has an 'any'... Remove this comment to see the full error message
export const setGroupColumns = (updatedColumns) => ({
	type: SET_GROUP_COLUMNS,
	payload: { updatedColumns },
});
