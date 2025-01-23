import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../shared/ConfirmModal";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../../store";
import { Recording, deleteRecording } from "../../../slices/recordingSlice";
import { fetchRecordingDetails } from "../../../slices/recordingDetailsSlice";
import { Tooltip } from "../../shared/Tooltip";
import DetailsModal from "../../shared/modals/DetailsModal";
import RecordingsDetails from "./modal/RecordingsDetails";

/**
 * This component renders the action cells of recordings in the table view
 */
const RecordingsActionCell = ({
	row,
}: {
	row: Recording
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [displayDeleteConfirmation, setDeleteConfirmation] = useState(false);
	const [displayRecordingDetails, setRecordingDetails] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));

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
			{hasAccess("ROLE_UI_LOCATIONS_DETAILS_VIEW", user) && (
				<Tooltip title={t("RECORDINGS.RECORDINGS.TABLE.TOOLTIP.DETAILS")}>
					<button
						className="button-like-anchor more"
						onClick={() => showRecordingDetails()}
					/>
				</Tooltip>
			)}

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
			{hasAccess("ROLE_UI_LOCATIONS_DELETE", user) && (
				<Tooltip title={t("RECORDINGS.RECORDINGS.TABLE.TOOLTIP.DELETE")}>
					<button
						className="button-like-anchor remove"
						onClick={() => setDeleteConfirmation(true)}
					/>
				</Tooltip>
			)}

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
