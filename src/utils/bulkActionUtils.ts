// Check if an event is scheduled and therefore editable
import { hasDeviceAccess } from "./resourceUtils";
import { NOTIFICATION_CONTEXT } from "../configs/modalConfig";
import { addNotification } from "../slices/notificationSlice";
import { EditedEvents, Event } from "../slices/eventSlice";
import { UserInfoState } from "../slices/userInfoSlice";
import { AppDispatch } from "../store";

// Check if event is scheduled and therefore the schedule is editable
export const isScheduleEditable = (event: Event) => {
	return (
		event.event_status.toUpperCase().indexOf("SCHEDULED") > -1 ||
		!event.selected
	);
};

// Check if multiple events are scheduled and therefore the schedule is editable
export const isAllScheduleEditable = (events: Event[]) => {
	for (const event of events) {
		if (!isScheduleEditable(event)) {
			return false;
		}
	}
	return true;
};

// Check if user has access rights for capture agent of event
export const isAgentAccess = (event: Event, user: UserInfoState) => {
	return !event.selected || hasDeviceAccess(user, event.agent_id);
};

// Check if user has access rights for capture agent of several events
export const isAllAgentAccess = (events: Event[], user: UserInfoState) => {
	for (const event of events) {
		if (!event.selected || !isScheduleEditable(event)) {
			continue;
		}
		if (!isAgentAccess(event, user)) {
			return false;
		}
	}
	return true;
};

// Check validity of selected event list for bulk schedule update for activating next button
export const checkValidityUpdateScheduleEventSelection = (
	formikValues: {
		events: Event[]
	},
	user: UserInfoState
) => {
	if (formikValues.events.length > 0) {
		if (
			isAllScheduleEditable(formikValues.events) &&
			isAllAgentAccess(formikValues.events, user)
		) {
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
	formikValues: {
		editedEvents: EditedEvents[]
	},
	setConflicts: (conflicts: any) => void,
	checkConflicts: (editedEvents: EditedEvents[]) => Promise<any[]>,
	dispatch: AppDispatch,
) => {
	// Check if each start is before end
	for (const event of formikValues.editedEvents) {
		let startTime = new Date();
		startTime.setHours(
			parseInt(event.changedStartTimeHour),
			parseInt(event.changedStartTimeMinutes),
			0,
			0
		);
		let endTime = new Date();
		endTime.setHours(
			parseInt(event.changedEndTimeHour),
			parseInt(event.changedEndTimeMinutes),
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
export const isStartable = (event: Event) => {
	return (
		event.event_status.toUpperCase().indexOf("PROCESSED") > -1 ||
		event.event_status.toUpperCase().indexOf("PROCESSING_FAILURE") > -1 ||
		event.event_status.toUpperCase().indexOf("PROCESSING_CANCELED") > -1 ||
		!event.selected
	);
};

// Check if multiple events are in a state that a task on them can be started
export const isTaskStartable = (events: Event[]) => {
	for (const event of events) {
		if (!isStartable(event)) {
			return false;
		}
	}
	return true;
};

// Check validity of selected event list for bulk start task for activating next button
export const checkValidityStartTaskEventSelection = (formikValues: { events: Event[] }) => {
	if (formikValues.events.length > 0) {
		if (isTaskStartable(formikValues.events)) {
			return formikValues.events.some((event) => event.selected === true);
		} else {
			return false;
		}
	} else {
		return false;
	}
};
