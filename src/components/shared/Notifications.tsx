import React from "react";
import {
	getNotifications,
	getGlobalPositions,
} from "../../selectors/notificationSelector";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import {
	NOTIFICATION_CONTEXT,
	NOTIFICATION_CONTEXT_ACCESS,
} from "../../configs/modalConfig";
import { useAppDispatch, useAppSelector } from "../../store";
import { setHidden } from "../../slices/notificationSlice";

/**
 * This component renders notifications about occurred errors, warnings and info
 */
const Notifications : React.FC<{
  context?: any,
}> = ({
	context,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const notifications = useAppSelector(state => getNotifications(state))
	const globalPosition = useAppSelector(state => getGlobalPositions(state))

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	const closeNotification = (id) => {
		dispatch(setHidden({id: id, isHidden: true}));
	};

// @ts-expect-error TS(7006): Parameter 'notification' implicitly has an 'any' t... Remove this comment to see the full error message
	const renderNotification = (notification, key) => (
		<li key={key}>
			<div className={cn(notification.type, "alert sticky")}>
				<button
					onClick={() => closeNotification(notification.id)}
					className="button-like-anchor fa fa-times close"
				/>
				<p>{t(notification.message, notification.parameter)}</p>
			</div>
		</li>
	);

	return (
		// if context is not_corner then render notification without consider global notification position
		context === "not_corner" ? (
			<ul>
				{notifications.map(
					(notification, key) =>
						!notification.hidden &&
						(notification.context === NOTIFICATION_CONTEXT ||
							notification.context === NOTIFICATION_CONTEXT_ACCESS) &&
						renderNotification(notification, key)
				)}
			</ul>
		) : context === "above_table" ? (
			<ul>
				{notifications.map(
					(notification, key) =>
						!notification.hidden &&
						notification.context === "global" &&
						notification.type === "error" &&
						renderNotification(notification, key)
				)}
			</ul>
		) : (
			<ul
				className={cn({
					"global-notifications": true,
					"notifications-top-left": globalPosition === "top-left",
					"notifications-top-right": globalPosition === "top-right",
					"notification-top-center": globalPosition === "top-center",
					"notifications-bottom-left": globalPosition === "bottom-left",
					"notifications-bottom-right": globalPosition === "bottom-right",
					"notifications-bottom-center": globalPosition === "bottom-center",
				})}
			>
				{notifications.map(
					(notification, key) =>
						!notification.hidden &&
						notification.context === "global" &&
						renderNotification(notification, key)
				)}
			</ul>
		)
	);
};

export default Notifications;
