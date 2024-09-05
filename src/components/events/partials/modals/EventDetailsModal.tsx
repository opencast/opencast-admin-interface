import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import EventDetails from "./EventDetails";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";
import { useHotkeys } from "react-hotkeys-hook";
import { availableHotkeys } from "../../../../configs/hotkeysConfig";
import { getModalEvent } from "../../../../selectors/eventDetailsSelectors";
import { setModalEvent, setShowModal } from "../../../../slices/eventDetailsSlice";

/**
 * This component renders the modal for displaying event details
 */
const EventDetailsModal = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	// tracks, whether the policies are different to the initial value
	const [policyChanged, setPolicyChanged] = useState(false);

	const event = useAppSelector(state => getModalEvent(state))!;

	const confirmUnsaved = () => {
		return window.confirm(t("CONFIRMATIONS.WARNINGS.UNSAVED_CHANGES"));
	};

	const hideModal = () => {
		dispatch(setModalEvent(null));
		dispatch(setShowModal(false));
	};

	const close = () => {
		if (!policyChanged || confirmUnsaved()) {
			setPolicyChanged(false);
			dispatch(removeNotificationWizardForm());
			hideModal();
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
				tabIndex={0}
				className="modal wizard modal-animation"
			>
				<header>
					<button className="button-like-anchor fa fa-times close-modal" onClick={() => close()} />
					<h2>
						{
							t("EVENTS.EVENTS.DETAILS.HEADER", {
								resourceId: event.title,
							}) /*Event details - {resourceTitle}*/
						}
					</h2>
				</header>

				<EventDetails
					eventId={event.id}
					policyChanged={policyChanged}
					setPolicyChanged={(value) => setPolicyChanged(value)}
				/>
			</section>
		</>
	)
};

export default EventDetailsModal;
