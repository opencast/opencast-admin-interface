/**
 * This file contains all redux actions that can be executed on events
 */

// Constants of actions types for fetching events from server
export const LOAD_EVENTS_IN_PROGRESS = "LOAD_EVENTS_IN_PROGRESS";
export const LOAD_EVENTS_SUCCESS = "LOAD_EVENTS_SUCCESS";
export const LOAD_EVENTS_FAILURE = "LOAD_EVENTS_FAILURE";

// Constants of actions types affecting UI
export const SHOW_ACTIONS_EVENTS = "SHOW_ACTIONS_EVENTS";
export const SET_EVENT_COLUMNS = "SET_EVENT_COLUMNS";
export const SET_EVENT_SELECTED = "SET_EVENT_SELECTED";

// Constants of action types affecting fetching of event metadata from server
export const LOAD_EVENT_METADATA_IN_PROGRESS =
	"LOAD_EVENT_METADATA_IN_PROGRESS";
export const LOAD_EVENT_METADATA_SUCCESS = "LOAD_EVENT_METADATA_SUCCESS";
export const LOAD_EVENT_METADATA_FAILURE = "LOAD_EVENT_METADATA_FAILURE";

// Constants of action types affecting fetching of event scheduling information from server
export const LOAD_BULK_UPDATE_EVENT_SCHEDULING_IN_PROGRESS =
	"LOAD_BULK_UPDATE_EVENT_SCHEDULING_IN_PROGRESS";
export const LOAD_BULK_UPDATE_EVENT_SCHEDULING_SUCCESS =
	"LOAD_BULK_UPDATE_EVENT_SCHEDULING_SUCCESS";
export const LOAD_BULK_UPDATE_EVENT_SCHEDULING_FAILURE =
	"LOAD_BULK_UPDATE_EVENT_SCHEDULING_FAILURE";

// Actions affecting fetching of events from server

export const loadEventsInProgress = () => ({
	type: LOAD_EVENTS_IN_PROGRESS,
});

// @ts-expect-error TS(7006): Parameter 'events' implicitly has an 'any' type.
export const loadEventsSuccess = (events) => ({
	type: LOAD_EVENTS_SUCCESS,
	payload: { events },
});

export const loadEventsFailure = () => ({
	type: LOAD_EVENTS_FAILURE,
});

// Actions affecting UI

// @ts-expect-error TS(7006): Parameter 'isShowing' implicitly has an 'any' type... Remove this comment to see the full error message
export const showActions = (isShowing) => ({
	type: SHOW_ACTIONS_EVENTS,
	payload: { isShowing },
});

// @ts-expect-error TS(7006): Parameter 'updatedColumns' implicitly has an 'any'... Remove this comment to see the full error message
export const setEventColumns = (updatedColumns) => ({
	type: SET_EVENT_COLUMNS,
	payload: { updatedColumns },
});

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const setEventSelected = (id) => ({
	type: SET_EVENT_SELECTED,
	payload: { id },
});

// Actions affecting fetching of event metadata from server

export const loadEventMetadataInProgress = () => ({
	type: LOAD_EVENT_METADATA_IN_PROGRESS,
});

// @ts-expect-error TS(7006): Parameter 'metadata' implicitly has an 'any' type.
export const loadEventMetadataSuccess = (metadata, extendedMetadata) => ({
	type: LOAD_EVENT_METADATA_SUCCESS,
	payload: { metadata, extendedMetadata },
});

export const loadEventMetadataFailure = () => ({
	type: LOAD_EVENT_METADATA_FAILURE,
});

// Actions affecting fetching of event scheduling information from server

export const loadEventSchedulingInProgress = () => ({
	type: LOAD_BULK_UPDATE_EVENT_SCHEDULING_IN_PROGRESS,
});

// @ts-expect-error TS(7006): Parameter 'editedEvents' implicitly has an 'any' t... Remove this comment to see the full error message
export const loadEventSchedulingSuccess = (editedEvents, seriesOptions) => ({
	type: LOAD_BULK_UPDATE_EVENT_SCHEDULING_SUCCESS,
	payload: { editedEvents, seriesOptions },
});

export const loadEventSchedulingFailure = () => ({
	type: LOAD_BULK_UPDATE_EVENT_SCHEDULING_FAILURE,
});
