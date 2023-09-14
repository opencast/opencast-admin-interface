import {
	CREATE_NOTIFICATION,
	REMOVE_NOTIFICATION,
	REMOVE_NOTIFICATION_WIZARD_ACCESS,
	REMOVE_NOTIFICATION_WIZARD_FORM,
	SET_HIDDEN,
} from "../actions/notificationActions";
import {
	NOTIFICATION_CONTEXT,
	NOTIFICATION_CONTEXT_ACCESS,
} from "../configs/modalConfig";

/*
State is looking something like this
notifications: {
    notificationPositionGlobal: 'bottom-right'
    notifications: [{
        message: "",
        id: "",
        hidden: false,
        duration: 0,
        type: "error",
        parameter: "",
        key: "",
        context: ""
    }, ...],

}
*/

/**
 * This file contains redux reducer for actions affecting the state of table
 */

// Initial state of notifications in store
// If you want to change the position of notification, here it can be done
const initialState = {
	notificationPositionGlobal: "bottom-right",
	notifications: [],
};

// Reducer for notifications
// @ts-expect-error TS(7006): Parameter 'action' implicitly has an 'any' type.
export const notifications = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case CREATE_NOTIFICATION: {
			const { notification, id } = payload;
      if (state.notifications.filter(e => e.id === id).length > 0) {
        console.log("Notification with id: " + id + " already exists.")
        return {
          ...state,
          notifications: state.notifications.map((oldNotification) => {
            if (oldNotification.id === id) {
              return {
                id: id,
                ...notification,
              };
            }
            return oldNotification;
          }),
        };
      }
			return {
				...state,
				notifications: [
					...state.notifications,
					{
						id: id,
						key: notification.key,
						message: notification.message,
						type: notification.type,
						hidden: notification.hidden,
						duration: notification.duration,
						parameter: notification.parameter,
						context: notification.context,
					},
				],
			};
		}
		case REMOVE_NOTIFICATION: {
			const { id: idToRemove } = payload;
			return {
				...state,
				notifications: state.notifications.filter(
// @ts-expect-error TS(2339): Property 'id' does not exist on type 'never'.
					(notification) => notification.id !== idToRemove
				),
			};
		}
		case REMOVE_NOTIFICATION_WIZARD_FORM: {
			return {
				...state,
				notifications: state.notifications.filter(
// @ts-expect-error TS(2339): Property 'context' does not exist on type 'never'.
					(notification) => notification.context !== NOTIFICATION_CONTEXT
				),
			};
		}
		case REMOVE_NOTIFICATION_WIZARD_ACCESS: {
			return {
				...state,
				notifications: state.notifications.filter(
// @ts-expect-error TS(2339): Property 'context' does not exist on type 'never'.
					(notification) => notification.context !== NOTIFICATION_CONTEXT_ACCESS
				),
			};
		}
		case SET_HIDDEN: {
			const { id: idToUpdate, isHidden } = payload;
			return {
				...state,
				notifications: state.notifications.map((notification) => {
// @ts-expect-error TS(2339): Property 'id' does not exist on type 'never'.
					if (notification.id === idToUpdate) {
						return {
// @ts-expect-error TS(2698): Spread types may only be created from object types... Remove this comment to see the full error message
							...notification,
							hidden: isHidden,
						};
					}
					return notification;
				}),
			};
		}
		default:
			return state;
	}
};
