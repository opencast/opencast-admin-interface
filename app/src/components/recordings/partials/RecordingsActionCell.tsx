import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
// @ts-expect-error TS(6142): Module '../../shared/ConfirmModal' was resolved to... Remove this comment to see the full error message
import ConfirmModal from "../../shared/ConfirmModal";
// @ts-expect-error TS(6142): Module './modal/RecordingDetailsModal' was resolve... Remove this comment to see the full error message
import RecordingDetailsModal from "./modal/RecordingDetailsModal";
import { deleteRecording } from "../../../thunks/recordingThunks";
import { fetchRecordingDetails } from "../../../thunks/recordingDetailsThunks";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";

/**
 * This component renders the action cells of recordings in the table view
 */
const RecordingsActionCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
// @ts-expect-error TS(7031): Binding element 'deleteRecording' implicitly has a... Remove this comment to see the full error message
	deleteRecording,
// @ts-expect-error TS(7031): Binding element 'fetchRecordingDetails' implicitly... Remove this comment to see the full error message
	fetchRecordingDetails,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
}) => {
	const { t } = useTranslation();

	const [displayDeleteConfirmation, setDeleteConfirmation] = useState(false);
	const [displayRecordingDetails, setRecordingDetails] = useState(false);

	const hideDeleteConfirmation = () => {
		setDeleteConfirmation(false);
	};

	const hideRecordingDetails = () => {
		setRecordingDetails(false);
	};

	const showRecordingDetails = async () => {
		await fetchRecordingDetails(row.name);

		setRecordingDetails(true);
	};

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	const deletingRecording = (id) => {
		deleteRecording(id);
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
			{/* view details location/recording */}
			{hasAccess("ROLE_UI_LOCATIONS_DETAILS_VIEW", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<button
					className="button-like-anchor more"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
					title={t("RECORDINGS.RECORDINGS.TABLE.TOOLTIP.DETAILS")}
					onClick={() => showRecordingDetails()}
				/>
			)}

			{displayRecordingDetails && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<RecordingDetailsModal
					close={hideRecordingDetails}
					recordingId={row.name}
				/>
			)}

			{/* delete location/recording */}
			{hasAccess("ROLE_UI_LOCATIONS_DELETE", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<button
					className="button-like-anchor remove"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
					title={t("RECORDINGS.RECORDINGS.TABLE.TOOLTIP.DELETE")}
					onClick={() => setDeleteConfirmation(true)}
				/>
			)}

			{displayDeleteConfirmation && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	user: getUserInformation(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	deleteRecording: (id) => dispatch(deleteRecording(id)),
// @ts-expect-error TS(7006): Parameter 'name' implicitly has an 'any' type.
	fetchRecordingDetails: (name) => dispatch(fetchRecordingDetails(name)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RecordingsActionCell);
