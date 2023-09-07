import React from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module './RecordingsDetails' was resolved to '/hom... Remove this comment to see the full error message
import RecordingsDetails from "./RecordingsDetails";

/**
 * This component renders the modal for displaying recording details
 */
const RecordingDetailsModal = ({
    close,
    recordingId
}: any) => {
	const { t } = useTranslation();

	const handleClose = () => {
		close();
	};

	return (
		// todo: add hotkeys
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-animation modal-overlay" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<section
				id="capture-agent-details-modal"
				className="modal wizard modal-animation"
			>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button
						className="button-like-anchor fa fa-times close-modal"
						onClick={() => handleClose()}
					/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h2>
						{t("RECORDINGS.RECORDINGS.DETAILS.HEADER", {
							resourceId: recordingId,
						})}
					</h2>
				</header>

				{/* component that manages tabs of recording details modal*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<RecordingsDetails />
			</section>
		</>
	);
};

export default RecordingDetailsModal;
