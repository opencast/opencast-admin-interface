import { createSelector } from "reselect";

export const getNotifications = (state: any) => state.notifications.notifications;
export const getGlobalPositions = (state: any) =>
  state.notifications.notificationPositionGlobal;

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const getNotificationById = (id) =>
	createSelector(getNotifications, (notifications) =>
// @ts-expect-error TS(7006): Parameter 'notification' implicitly has an 'any' t... Remove this comment to see the full error message
		notifications.filter((notification) => notification.id === id)
	);

export const getLastAddedNotification = createSelector(
	getNotifications,
	(notifications) =>
// @ts-expect-error TS(7006): Parameter 'prev' implicitly has an 'any' type.
		notifications.reduce((prev, current) =>
			prev.id > current.id ? prev : current
		)
);
