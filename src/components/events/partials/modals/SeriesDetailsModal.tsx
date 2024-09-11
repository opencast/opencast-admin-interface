import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SeriesDetails from "./SeriesDetails";
import DetailsModal from "../../../shared/modals/DetailsModal";

/**
 * This component renders the modal for displaying series details
 */
const SeriesDetailsModal = ({
	handleClose,
	seriesTitle,
	seriesId
}: {
	handleClose: () => void
	seriesTitle: string
	seriesId: string
}) => {
	const { t } = useTranslation();

	// tracks, whether the policies are different to the initial value
	const [policyChanged, setPolicyChanged] = useState(false);

	const confirmUnsaved = () => {
		return window.confirm(t("CONFIRMATIONS.WARNINGS.UNSAVED_CHANGES"));
	};

	const close = () => {
		if (!policyChanged || confirmUnsaved()) {
			setPolicyChanged(false);
			handleClose();
		}
	};

	return (
		<DetailsModal
			handleClose={close}
			prefix={"EVENTS.SERIES.DETAILS.HEADER"}
			title={seriesTitle}
		>
				<SeriesDetails
					seriesId={seriesId}
					policyChanged={policyChanged}
					setPolicyChanged={(value) => setPolicyChanged(value)}
				/>
		</DetailsModal>
	);
};

export default SeriesDetailsModal;
