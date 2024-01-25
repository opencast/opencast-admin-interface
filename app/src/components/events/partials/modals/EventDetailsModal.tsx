import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import EventDetails from "./EventDetails";
import { removeNotificationWizardForm } from "../../../../actions/notificationActions";

/**
 * This component renders the modal for displaying event details
 */
const EventDetailsModal = ({
// @ts-expect-error TS(7031): Binding element 'handleClose' implicitly has an 'a... Remove this comment to see the full error message
	handleClose,
// @ts-expect-error TS(7031): Binding element 'showModal' implicitly has an 'any... Remove this comment to see the full error message
	showModal,
// @ts-expect-error TS(7031): Binding element 'tabIndex' implicitly has an 'any'... Remove this comment to see the full error message
	tabIndex,
// @ts-expect-error TS(7031): Binding element 'eventTitle' implicitly has an 'an... Remove this comment to see the full error message
	eventTitle,
// @ts-expect-error TS(7031): Binding element 'eventId' implicitly has an 'any' ... Remove this comment to see the full error message
	eventId,
}) => {
	const { t } = useTranslation();

	// tracks, whether the policies are different to the initial value
	const [policyChanged, setPolicyChanged] = useState(false);

	const confirmUnsaved = () => {
		return window.confirm(t("CONFIRMATIONS.WARNINGS.UNSAVED_CHANGES"));
	};

	const close = () => {
		if (!policyChanged || confirmUnsaved()) {
			setPolicyChanged(false);
			removeNotificationWizardForm();
			handleClose();
		}
	};

	return (
		// todo: add hotkeys
		showModal && (
			<>
				<div className="modal-animation modal-overlay" />
				<section
					id="event-details-modal"
					tabIndex={tabIndex}
					className="modal wizard modal-animation"
				>
					<header>
						<button className="button-like-anchor fa fa-times close-modal" onClick={() => close()} />
						<h2>
							{
								t("EVENTS.EVENTS.DETAILS.HEADER", {
									resourceId: eventTitle,
								}) /*Event details - {resourceTitle}*/
							}
						</h2>
					</header>

					<EventDetails
						tabIndex={tabIndex}
						eventId={eventId}
						policyChanged={policyChanged}
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
						setPolicyChanged={(value) => setPolicyChanged(value)}
					/>
				</section>
			</>
		)
	);
};

export default EventDetailsModal;
