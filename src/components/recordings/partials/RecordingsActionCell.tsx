import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import ConfirmModal from "../../shared/ConfirmModal";
import RecordingDetailsModal from "./modal/RecordingDetailsModal";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../../store";
import { deleteRecording } from "../../../slices/recordingSlice";
import { fetchRecordingDetails } from "../../../slices/recordingDetailsSlice";

/**
 * This component renders the action cells of recordings in the table view
 */
const RecordingsActionCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
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

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	const deletingRecording = (id) => {
		dispatch(deleteRecording(id));
	};

	return (
		<>
			{/* view details location/recording */}
			{hasAccess("ROLE_UI_LOCATIONS_DETAILS_VIEW", user) && (
				<button
					className="button-like-anchor more"
					title={t("RECORDINGS.RECORDINGS.TABLE.TOOLTIP.DETAILS")}
					onClick={() => showRecordingDetails()}
				/>
			)}

			{displayRecordingDetails && (
				<RecordingDetailsModal
					close={hideRecordingDetails}
					recordingId={row.name}
				/>
			)}

			{/* delete location/recording */}
			{hasAccess("ROLE_UI_LOCATIONS_DELETE", user) && (
				<button
					className="button-like-anchor remove"
					title={t("RECORDINGS.RECORDINGS.TABLE.TOOLTIP.DELETE")}
					onClick={() => setDeleteConfirmation(true)}
				/>
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
