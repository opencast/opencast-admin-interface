import React from "react";
import { useTranslation } from "react-i18next";
import { Field } from "formik";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardNavigationBut... Remove this comment to see the full error message
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/FileUpload' was res... Remove this comment to see the full error message
import FileUpload from "../../../shared/wizard/FileUpload";

/**
 * This component renders the title slide page for new themes in the new theme wizard and for themes in themes details modal.
 */
const TitleSlidePage = ({
    formik,
    nextPage,
    previousPage,
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
							{t("CONFIGURATION.THEMES.DETAILS.TITLE.DESCRIPTION")}
						</p>
					</div>
					{/*todo: Notification*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<header>{t("CONFIGURATION.THEMES.DETAILS.TITLE.ACTIVE")}</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj-container content-list padded">
							{/* Checkbox for activation of title slide*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="list-row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="header-column">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<label className="large">
										{t("CONFIGURATION.THEMES.DETAILS.TITLE.ENABLE")}
									</label>
								</div>
								{/* Checkbox for activating title slide */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="content-column">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="content-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<Field
											id="titleSlide-toggle"
											type="checkbox"
											name="titleSlideActive"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Radio buttons for choosing between extraction of title slide or uploading file */}
					{formik.values.titleSlideActive && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<header>
								{t("CONFIGURATION.THEMES.DETAILS.TITLE.BACKGROUND")}
							</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj-container padded">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="file-upload">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="form-container">
										{/* Radio button for choosing title slide mode*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<Field
												type="radio"
												value="extract"
												name="titleSlideMode"
												id="background-extract"
											/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<label>
												{t("CONFIGURATION.THEMES.DETAILS.TITLE.EXTRACT")}
											</label>
										</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<Field
												type="radio"
												value="upload"
												name="titleSlideMode"
												id="background-upload"
											/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<label>
												{t("CONFIGURATION.THEMES.DETAILS.TITLE.UPLOAD")}
											</label>
										</div>
									</div>
								</div>
								{/*If title slide mode upload is chosen, use component for file upload */}
								{formik.values.titleSlideMode === "upload" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<FileUpload
										acceptableTypes="image/*"
										fileId="titleSlideBackground"
										fileName="titleSlideBackgroundName"
										formik={formik}
										labelKey="CONFIGURATION.THEMES.DETAILS.TITLE.UPLOAD_LABEL"
										buttonKey="CONFIGURATION.THEMES.DETAILS.TITLE.UPLOAD_BUTTON"
										isEdit={isEdit}
									/>
								)}
							</div>
						</div>
					)}
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

export default TitleSlidePage;
