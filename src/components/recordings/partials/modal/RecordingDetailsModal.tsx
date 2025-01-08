import React from "react";
import { useTranslation } from "react-i18next";
import RecordingsDetails from "./RecordingsDetails";
import { Modal, ModalHandle } from "../../../shared/modals/Modal";

/**
 * This component renders the modal for displaying recording details
 */
const RecordingDetailsModal = ({
	close,
	recordingId,
	modalRef,
}: {
	close: () => void,
	recordingId: string,
	modalRef: React.RefObject<ModalHandle>
}) => {
	const { t } = useTranslation();

	return (
		<Modal
			closeCallback={close}
			header={t("RECORDINGS.RECORDINGS.DETAILS.HEADER", {
				resourceId: recordingId,
			})}
			classId="capture-agent-details-modal"
			ref={modalRef}
		>
			{/* component that manages tabs of recording details modal*/}
			<RecordingsDetails />
		</Modal>
	);
};

export default RecordingDetailsModal;
