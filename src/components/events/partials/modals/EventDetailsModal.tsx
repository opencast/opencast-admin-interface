import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import EventDetails from "./EventDetails";
import { useAppDispatch } from "../../../../store";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";
import { useHotkeys } from "react-hotkeys-hook";
import { availableHotkeys } from "../../../../configs/hotkeysConfig";

/**
 * This component renders the modal for displaying event details
 */
const EventDetailsModal = ({
	handleClose,
	tabIndex,
	eventTitle,
	eventId,
}: {
	handleClose: () => void,
	tabIndex: number,
	eventTitle: string,
	eventId: string,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	// tracks, whether the policies are different to the initial value
	const [policyChanged, setPolicyChanged] = useState(false);

	const confirmUnsaved = () => {
		return window.confirm(t("CONFIRMATIONS.WARNINGS.UNSAVED_CHANGES"));
	};

	const close = () => {
		if (!policyChanged || confirmUnsaved()) {
			setPolicyChanged(false);
			dispatch(removeNotificationWizardForm());
			handleClose();
		}
	};

	useHotkeys(
		availableHotkeys.general.CLOSE_MODAL.sequence,
		() => close(),
		{ description: t(availableHotkeys.general.CLOSE_MODAL.description) ?? undefined },
		[close],
  	);

	return (
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
					setPolicyChanged={(value) => setPolicyChanged(value)}
				/>
			</section>
		</>
	)
};

export default EventDetailsModal;
