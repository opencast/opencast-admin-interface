import React from "react";
import { useTranslation } from "react-i18next";
import RecordingsDetails from "./RecordingsDetails";
import { availableHotkeys } from "../../../../configs/hotkeysConfig";
import { useHotkeys } from "react-hotkeys-hook";

/**
 * This component renders the modal for displaying recording details
 */
const RecordingDetailsModal = ({
    close,
    recordingId
}: any) => {
	const { t } = useTranslation();

	useHotkeys(
		availableHotkeys.general.CLOSE_MODAL.sequence,
		() => close(),
		{ description: t(availableHotkeys.general.CLOSE_MODAL.description) ?? undefined },
		[close],
  	);

	const handleClose = () => {
		close();
	};

	return (
		// todo: add hotkeys
		<>
			<div className="modal-animation modal-overlay" />
			<section
				id="capture-agent-details-modal"
				className="modal wizard modal-animation"
			>
				<header>
					<button
						className="button-like-anchor fa fa-times close-modal"
						onClick={() => handleClose()}
					/>
					<h2>
						{t("RECORDINGS.RECORDINGS.DETAILS.HEADER", {
							resourceId: recordingId,
						})}
					</h2>
				</header>

				{/* component that manages tabs of recording details modal*/}
				<RecordingsDetails />
			</section>
		</>
	);
};

export default RecordingDetailsModal;
