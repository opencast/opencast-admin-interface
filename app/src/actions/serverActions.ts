/**
 * This file contains all redux actions that can be executed on servers
 */

// Constants of action types for fetching servers from server
export const LOAD_SERVERS_IN_PROGRESS = "LOAD_SERVERS_IN_PROGRESS";
export const LOAD_SERVERS_SUCCESS = "LOAD_SERVERS_SUCCESS";
export const LOAD_SERVERS_FAILURE = "LOAD_SERVERS_FAILURE";

// Constants of action types affecting UI
export const SET_SERVER_COLUMNS = "SET_SERVER_COLUMNS";

// Actions affecting fetching servers from server

export const loadServersInProgress = () => ({
	type: LOAD_SERVERS_IN_PROGRESS,
});

// @ts-expect-error TS(7006): Parameter 'servers' implicitly has an 'any' type.
export const loadServersSuccess = (servers) => ({
	type: LOAD_SERVERS_SUCCESS,
	payload: { servers },
});

export const loadServersFailure = () => ({
	type: LOAD_SERVERS_FAILURE,
});

// Actions affecting UI

// @ts-expect-error TS(7006): Parameter 'updatedColumns' implicitly has an 'any'... Remove this comment to see the full error message
export const setServerColumns = (updatedColumns) => ({
	type: SET_SERVER_COLUMNS,
	payload: { updatedColumns },
});
