// Check if an event is scheduled and therefore editable
import { hasDeviceAccess } from "./resourceUtils";
import { NOTIFICATION_CONTEXT } from "../configs/modalConfig";
import { addNotification } from "../slices/notificationSlice";

// Check if event is scheduled and therefore the schedule is editable
export const isScheduleEditable = (event: any) => {
	return (
		event.event_status.toUpperCase().indexOf("SCHEDULED") > -1 ||
		!event.selected
	);
};

// Check if multiple events are scheduled and therefore the schedule is editable
// @ts-expect-error TS(7006): Parameter 'events' implicitly has an 'any' type.
export const isAllScheduleEditable = (events) => {
	for (let i = 0; i < events.length; i++) {
		if (!isScheduleEditable(events[i])) {
			return false;
		}
	}
	return true;
};

// Check if user has access rights for capture agent of event
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
export const isAgentAccess = (event, user) => {
	return !event.selected || hasDeviceAccess(user, event.agent_id);
};

// Check if user has access rights for capture agent of several events
// @ts-expect-error TS(7006): Parameter 'events' implicitly has an 'any' type.
export const isAllAgentAccess = (events, user) => {
	for (let i = 0; i < events.length; i++) {
		if (!events[i].selected || !isScheduleEditable(events[i])) {
			continue;
		}
		if (!isAgentAccess(events[i], user)) {
			return false;
		}
	}
	return true;
};

// Check validity of selected event list for bulk schedule update for activating next button
export const checkValidityUpdateScheduleEventSelection = (
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'user' implicitly has an 'any' type.
	user
) => {
	if (formikValues.events.length > 0) {
		if (
			isAllScheduleEditable(formikValues.events) &&
			isAllAgentAccess(formikValues.events, user)
		) {
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
			return formikValues.events.some((event) => event.selected === true);
		} else {
			return false;
		}
	} else {
		return false;
	}
};

// check changed events in formik for scheduling conflicts
export const checkSchedulingConflicts = async (
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7006): Parameter 'setConflicts' implicitly has an 'any' t... Remove this comment to see the full error message
	setConflicts,
// @ts-expect-error TS(7006): Parameter 'checkConflicts' implicitly has an 'any'... Remove this comment to see the full error message
	checkConflicts,
// @ts-expect-error TS(7006):
	dispatch,
) => {
	// Check if each start is before end
	for (let i = 0; i < formikValues.editedEvents.length; i++) {
		let event = formikValues.editedEvents[i];
		let startTime = new Date();
		startTime.setHours(
			event.changedStartTimeHour,
			event.changedStartTimeMinutes,
			0,
			0
		);
		let endTime = new Date();
		endTime.setHours(
			event.changedEndTimeHour,
			event.changedEndTimeMinutes,
			0,
			0
		);

		if (startTime > endTime) {
			dispatch(addNotification({
				type: "error",
				key: "CONFLICT_END_BEFORE_START",
				duration: -1,
				parameter: null,
				context: NOTIFICATION_CONTEXT
			}));
			return false;
		}
	}

	// Use backend for check for conflicts with other events
	const response = await checkConflicts(formikValues.editedEvents);

	if (response.length > 0) {
		setConflicts(response);
		return false;
	} else {
		setConflicts([]);
		return true;
	}
};

// Check if an event is in a state that a task on it can be started
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
export const isStartable = (event) => {
	return (
		event.event_status.toUpperCase().indexOf("PROCESSED") > -1 ||
		event.event_status.toUpperCase().indexOf("PROCESSING_FAILURE") > -1 ||
		event.event_status.toUpperCase().indexOf("PROCESSING_CANCELED") > -1 ||
		!event.selected
	);
};

// Check if multiple events are in a state that a task on them can be started
// @ts-expect-error TS(7006): Parameter 'events' implicitly has an 'any' type.
export const isTaskStartable = (events) => {
	for (let i = 0; i < events.length; i++) {
		if (!isStartable(events[i])) {
			return false;
		}
	}
	return true;
};

// Check validity of selected event list for bulk start task for activating next button
// @ts-expect-error TS(7006): Parameter 'formikValues' implicitly has an 'any' t... Remove this comment to see the full error message
export const checkValidityStartTaskEventSelection = (formikValues) => {
	if (formikValues.events.length > 0) {
		if (isTaskStartable(formikValues.events)) {
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
			return formikValues.events.some((event) => event.selected === true);
		} else {
			return false;
		}
	} else {
		return false;
	}
};
