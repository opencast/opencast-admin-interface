import React, { useState } from "react";
import ConfirmModal from "../../shared/ConfirmModal";
import { useAppDispatch } from "../../../store";
import { Recording, deleteRecording } from "../../../slices/recordingSlice";
import { fetchRecordingDetails } from "../../../slices/recordingDetailsSlice";
import DetailsModal from "../../shared/modals/DetailsModal";
import RecordingsDetails from "./modal/RecordingsDetails";
import ButtonLikeAnchor from "../../shared/ButtonLikeAnchor";

/**
 * This component renders the action cells of recordings in the table view
 */
const RecordingsActionCell = ({
	row,
}: {
	row: Recording
}) => {
	const dispatch = useAppDispatch();

	const [displayDeleteConfirmation, setDeleteConfirmation] = useState(false);
	const [displayRecordingDetails, setRecordingDetails] = useState(false);

	const hideDeleteConfirmation = () => {
		setDeleteConfirmation(false);
	};

	const hideRecordingDetails = () => {
		setRecordingDetails(false);
	};

	const showRecordingDetails = async () => {
		await dispatch(fetchRecordingDetails(row.name));

		setRecordingDetails(true);
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

			{displayRecordingDetails && (
				<DetailsModal
					handleClose={hideRecordingDetails}
					title={row.name}
					prefix={"RECORDINGS.RECORDINGS.DETAILS.HEADER"}
				>
					<RecordingsDetails/>
				</DetailsModal>
			)}

			{/* delete location/recording */}
			<ButtonLikeAnchor
				extraClassName="remove"
				onClick={() => setDeleteConfirmation(true)}
				tooltipText="RECORDINGS.RECORDINGS.TABLE.TOOLTIP.DELETE"
				editAccessRole="ROLE_UI_LOCATIONS_DELETE"
			/>

			{displayDeleteConfirmation && (
				<ConfirmModal
					close={hideDeleteConfirmation}
					resourceName={row.name}
					resourceType="LOCATION"
					resourceId={row.name}
					deleteMethod={deletingRecording}
				/>
			)}
		</>
	);
};

export default RecordingsActionCell;
