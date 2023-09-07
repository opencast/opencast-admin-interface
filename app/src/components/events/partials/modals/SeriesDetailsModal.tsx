import React, { useState } from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module './SeriesDetails' was resolved to '/home/ar... Remove this comment to see the full error message
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
// @ts-expect-error TS(2345): Argument of type 'DefaultTFuncReturn' is not assig... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-animation modal-overlay" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<section className="modal modal-animation" id="series-details-modal">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button className="button-like-anchor fa fa-times close-modal" onClick={() => close()} />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h2>
						{t("EVENTS.SERIES.DETAILS.HEADER", { resourceId: seriesTitle })}
					</h2>
				</header>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
