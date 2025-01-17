import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../shared/ConfirmModal";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../../store";
import { Recording, deleteRecording } from "../../../slices/recordingSlice";
import { fetchRecordingDetails } from "../../../slices/recordingDetailsSlice";
import { Tooltip } from "../../shared/Tooltip";
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
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const deleteConfirmationModalRef = useRef<ModalHandle>(null);
	const recordingDetailsModalRef = useRef<ModalHandle>(null);

	const user = useAppSelector(state => getUserInformation(state));

	const hideDeleteConfirmation = () => {
		deleteConfirmationModalRef.current?.close?.();
	};

	const hideRecordingDetails = () => {
		recordingDetailsModalRef.current?.close?.()
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
			{hasAccess("ROLE_UI_LOCATIONS_DETAILS_VIEW", user) && (
				<Tooltip title={t("RECORDINGS.RECORDINGS.TABLE.TOOLTIP.DETAILS")}>
					<button
						className="button-like-anchor more"
						onClick={() => showRecordingDetails()}
					/>
				</Tooltip>
			)}

			<RecordingDetailsModal
				close={hideRecordingDetails}
				recordingId={row.name}
				modalRef={recordingDetailsModalRef}
			/>

			{/* delete location/recording */}
			{hasAccess("ROLE_UI_LOCATIONS_DELETE", user) && (
				<Tooltip title={t("RECORDINGS.RECORDINGS.TABLE.TOOLTIP.DELETE")}>
					<button
						className="button-like-anchor remove"
						onClick={() => deleteConfirmationModalRef.current?.open()}
					/>
				</Tooltip>
			)}

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
