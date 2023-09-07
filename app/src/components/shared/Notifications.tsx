import React from "react";
import {
	getNotifications,
	getGlobalPositions,
} from "../../selectors/notificationSelector";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { setHidden } from "../../actions/notificationActions";
import {
	NOTIFICATION_CONTEXT,
	NOTIFICATION_CONTEXT_ACCESS,
} from "../../configs/modalConfig";

/**
 * This component renders notifications about occurred errors, warnings and info
 */
const Notifications = ({
// @ts-expect-error TS(7031): Binding element 'setNotificationHidden' implicitly... Remove this comment to see the full error message
	setNotificationHidden,
// @ts-expect-error TS(7031): Binding element 'notifications' implicitly has an ... Remove this comment to see the full error message
	notifications,
// @ts-expect-error TS(7031): Binding element 'globalPosition' implicitly has an... Remove this comment to see the full error message
	globalPosition,
// @ts-expect-error TS(7031): Binding element 'context' implicitly has an 'any' ... Remove this comment to see the full error message
	context,
}) => {
	const { t } = useTranslation();

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	const closeNotification = (id) => {
		setNotificationHidden(id, true);
	};

// @ts-expect-error TS(7006): Parameter 'notification' implicitly has an 'any' t... Remove this comment to see the full error message
	const renderNotification = (notification, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<li key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className={cn(notification.type, "alert sticky")}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<button
					onClick={() => closeNotification(notification.id)}
					className="button-like-anchor fa fa-times close"
				/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<p>{t(notification.message)}</p>
			</div>
		</li>
	);

	return (
		// if context is not_corner then render notification without consider global notification position
		context === "not_corner" ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<ul>
				{notifications.map(
// @ts-expect-error TS(7006): Parameter 'notification' implicitly has an 'any' t... Remove this comment to see the full error message
					(notification, key) =>
						!notification.hidden &&
						(notification.context === NOTIFICATION_CONTEXT ||
							notification.context === NOTIFICATION_CONTEXT_ACCESS) &&
						renderNotification(notification, key)
				)}
			</ul>
		) : context === "above_table" ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<ul>
				{notifications.map(
// @ts-expect-error TS(7006): Parameter 'notification' implicitly has an 'any' t... Remove this comment to see the full error message
					(notification, key) =>
						!notification.hidden &&
						notification.context === "global" &&
						notification.type === "error" &&
						renderNotification(notification, key)
				)}
			</ul>
		) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(7006): Parameter 'notification' implicitly has an 'any' t... Remove this comment to see the full error message
					(notification, key) =>
						!notification.hidden &&
						notification.context === "global" &&
						renderNotification(notification, key)
				)}
			</ul>
		)
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	notifications: getNotifications(state),
	globalPosition: getGlobalPositions(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	setNotificationHidden: (id, isHidden) => dispatch(setHidden(id, isHidden)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
