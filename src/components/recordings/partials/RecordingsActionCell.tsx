import React, { useRef } from "react";
import ConfirmModal from "../../shared/ConfirmModal";
import { useAppDispatch } from "../../../store";
import { Recording, deleteRecording } from "../../../slices/recordingSlice";
import { fetchRecordingDetails } from "../../../slices/recordingDetailsSlice";
import ButtonLikeAnchor from "../../shared/ButtonLikeAnchor";
import { ModalHandle } from "../../shared/modals/Modal";
import RecordingDetailsModal from "./modal/RecordingDetailsModal";

/**
 * This component renders the action cells of recordings in the table view
 */
const RecordingsActionCell = ({
	row,
}: {
	row: Recording
}) => {
	const dispatch = useAppDispatch();

	const deleteConfirmationModalRef = useRef<ModalHandle>(null);
	const recordingDetailsModalRef = useRef<ModalHandle>(null);

	const hideDeleteConfirmation = () => {
		deleteConfirmationModalRef.current?.close?.();
	};

	const showRecordingDetails = async () => {
		await dispatch(fetchRecordingDetails(row.name));

		recordingDetailsModalRef.current?.open()
	};

	const deletingRecording = (id: string) => {
		dispatch(deleteRecording(id));
	};

	return (
		<>
			{/* view details location/recording */}
			<ButtonLikeAnchor
				extraClassName="more"
				onClick={() => showRecordingDetails()}
				tooltipText="RECORDINGS.RECORDINGS.TABLE.TOOLTIP.DETAILS"
				editAccessRole="ROLE_UI_LOCATIONS_DETAILS_VIEW"
			/>

			<RecordingDetailsModal
				recordingId={row.name}
				modalRef={recordingDetailsModalRef}
			/>

			{/* delete location/recording */}
			<ButtonLikeAnchor
				extraClassName="remove"
				onClick={() => deleteConfirmationModalRef.current?.open()}
				tooltipText="RECORDINGS.RECORDINGS.TABLE.TOOLTIP.DELETE"
				editAccessRole="ROLE_UI_LOCATIONS_DELETE"
			/>

			<ConfirmModal
				close={hideDeleteConfirmation}
				resourceName={row.name}
				resourceType="LOCATION"
				resourceId={row.name}
				deleteMethod={deletingRecording}
				modalRef={deleteConfirmationModalRef}
			/>
		</>
	);
};

export default RecordingsActionCell;
