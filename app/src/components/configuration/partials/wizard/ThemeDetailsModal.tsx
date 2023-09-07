import React from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module './ThemeDetails' was resolved to '/home/arn... Remove this comment to see the full error message
import ThemeDetails from "./ThemeDetails";

/**
 * This component renders the modal for displaying theme details
 */
const ThemeDetailsModal = ({
    handleClose,
    themeId,
    themeName
}: any) => {
	const { t } = useTranslation();

	const close = () => {
		handleClose();
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-animation modal-overlay" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<section
				id="theme-details-modal"
				className="modal wizard modal-animation"
			>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button className="button-like-anchor fa fa-times close-modal" onClick={() => close()} />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h2>
						{t("CONFIGURATION.THEMES.DETAILS.EDITCAPTION", { name: themeName })}
					</h2>
				</header>

				{/* component that manages tabs of theme details modal*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<ThemeDetails themeId={themeId} close={close} />
			</section>
		</>
	);
};

export default ThemeDetailsModal;
