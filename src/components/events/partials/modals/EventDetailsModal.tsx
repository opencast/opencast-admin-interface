import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import EventDetails from "./EventDetails";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";
import { getModalEvent } from "../../../../selectors/eventDetailsSelectors";
import { setModalEvent, setShowModal } from "../../../../slices/eventDetailsSlice";
import { Modal, ModalHandle } from "../../../shared/modals/Modal";

/**
 * This component renders the modal for displaying event details
 */
const EventDetailsModal = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const modalRef = useRef<ModalHandle>(null);

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

	return (
		<Modal
			open
			closeCallback={close}
			header={t("EVENTS.EVENTS.DETAILS.HEADER", { name: event.title })}
			classId="event-details-modal"
			ref={modalRef}
		>
			<EventDetails
				eventId={event.id}
				policyChanged={policyChanged}
				setPolicyChanged={(value) => setPolicyChanged(value)}
			/>
		</Modal>
	);
}

export default EventDetailsModal;
