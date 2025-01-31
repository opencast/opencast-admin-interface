import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SeriesDetails from "./SeriesDetails";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";
import { useAppDispatch } from "../../../../store";
import { Modal, ModalHandle } from "../../../shared/modals/Modal";

/**
 * This component renders the modal for displaying series details
 */
const SeriesDetailsModal = ({
	seriesTitle,
	seriesId,
	modalRef,
}: {
	seriesTitle: string
	seriesId: string
	modalRef: React.RefObject<ModalHandle>
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
			return true;
		}
		return false;
	};

	return (
		<Modal
			closeCallback={close}
			header={t("EVENTS.SERIES.DETAILS.HEADER", { name: seriesTitle })}
			classId="series-details-modal"
			ref={modalRef}
		>
			<SeriesDetails
				seriesId={seriesId}
				policyChanged={policyChanged}
				setPolicyChanged={(value) => setPolicyChanged(value)}
			/>
		</Modal>
	);
};

export default SeriesDetailsModal;
