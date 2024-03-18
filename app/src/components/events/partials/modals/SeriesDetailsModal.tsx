import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SeriesDetails from "./SeriesDetails";

/**
 * This component renders the modal for displaying series details
 */
const SeriesDetailsModal = ({
    handleClose,
    seriesTitle,
    seriesId
}: any) => {
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

	// todo: add hotkeys
	return (
		<>
			<div className="modal-animation modal-overlay" />
			<section className="modal modal-animation" id="series-details-modal">
				<header>
					<button className="button-like-anchor fa fa-times close-modal" onClick={() => close()} />
					<h2>
						{t("EVENTS.SERIES.DETAILS.HEADER", { resourceId: seriesTitle })}
					</h2>
				</header>

				<SeriesDetails
					seriesId={seriesId}
					policyChanged={policyChanged}
// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
					setPolicyChanged={(value) => setPolicyChanged(value)}
				/>
			</section>
		</>
	);
};

export default SeriesDetailsModal;
