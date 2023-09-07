import React from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardNavigationBut... Remove this comment to see the full error message
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/FileUpload' was res... Remove this comment to see the full error message
import FileUpload from "../../../shared/wizard/FileUpload";
import { Field } from "formik";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";

/**
 * This component renders the bumper/trailer (depending on isTrailer flag) page for new themes in the new themes wizard
 * and for themes in themes details modal.
 */
const BumperPage = ({
    formik,
    nextPage,
    previousPage,
    isTrailer,
    isEdit
}: any) => {
	const { t } = useTranslation();

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<p className="tab-description">
							{t(
								!isTrailer
									? "CONFIGURATION.THEMES.DETAILS.BUMPER.DESCRIPTION"
									: "CONFIGURATION.THEMES.DETAILS.TRAILER.DESCRIPTION"
							)}
						</p>
						{/* notifications */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Notifications context="not_corner" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<header>
								{t(
									!isTrailer
										? "CONFIGURATION.THEMES.DETAILS.BUMPER.ACTIVE"
										: "CONFIGURATION.THEMES.DETAILS.TRAILER.ACTIVE"
								)}
							</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj-container content-list padded">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="list-row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="header-column">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<label className="large">
											{t(
												!isTrailer
													? "CONFIGURATION.THEMES.DETAILS.BUMPER.ENABLE"
													: "CONFIGURATION.THEMES.DETAILS.TRAILER.ENABLE"
											)}
										</label>
									</div>
									{/* Checkbox for activating bumper/trailer */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="content-column">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="content-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<Field
												id="bumper-toggle"
												type="checkbox"
												name={!isTrailer ? "bumperActive" : "trailerActive"}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* if checkbox is checked, then render object for uploading files */}
						{((!isTrailer && formik.values.bumperActive) ||
							(isTrailer && formik.values.trailerActive)) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<header>
									{t(
										!isTrailer
											? "CONFIGURATION.THEMES.DETAILS.BUMPER.SELECT"
											: "CONFIGURATION.THEMES.DETAILS.TRAILER.SELECT"
									)}
								</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="obj-container padded">
									{/* Upload file for bumper/trailer */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<FileUpload
										acceptableTypes="video/*"
										fileId={!isTrailer ? "bumperFile" : "trailerFile"}
										fileName={!isTrailer ? "bumperFileName" : "trailerFileName"}
										formik={formik}
										buttonKey="CONFIGURATION.THEMES.DETAILS.BUMPER.UPLOAD_BUTTON"
										labelKey="CONFIGURATION.THEMES.DETAILS.BUMPER.UPLOAD_LABEL"
										isEdit={isEdit}
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Show navigation buttons only if page is used for a new theme*/}
			{!isEdit && (
				//Button for navigation to next page
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<WizardNavigationButtons
					formik={formik}
					previousPage={previousPage}
					nextPage={nextPage}
				/>
			)}
		</>
	);
};

export default BumperPage;
