import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import EventDetails from "./EventDetails";
import { removeNotificationWizardForm } from "../../../../actions/notificationActions";

/**
 * This component renders the modal for displaying event details
 */
const EventDetailsModal = ({
	handleClose,
	showModal,
	tabIndex,
	eventTitle,
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
						<a className="fa fa-times close-modal" onClick={() => close()} />
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
						setPolicyChanged={(value) => setPolicyChanged(value)}
					/>
				</section>
			</>
		)
	);
};

export default EventDetailsModal;
