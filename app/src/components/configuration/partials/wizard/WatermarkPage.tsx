import React from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Field } from "formik";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardNavigationBut... Remove this comment to see the full error message
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/FileUpload' was res... Remove this comment to see the full error message
import FileUpload from "../../../shared/wizard/FileUpload";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";

/**
 * This component renders the watermark page for new themes in the new themes wizard
 * and for themes in themes details modal.
 */
const WatermarkPage = ({
    formik,
    nextPage,
    previousPage,
    isEdit
}: any) => {
	const { t } = useTranslation();

// @ts-expect-error TS(7006): Parameter 'position' implicitly has an 'any' type.
	const handleButtonClick = (position) => {
		formik.setFieldValue("watermarkPosition", position);
	};

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
						<p>{t("CONFIGURATION.THEMES.DETAILS.WATERMARK.DESCRIPTION")}</p>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Notifications context="not_corner" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<header>
								{t("CONFIGURATION.THEMES.DETAILS.WATERMARK.CAPTION")}
							</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj-container content-list padded">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="list-row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="header-column">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<label className="large">
											{t("CONFIGURATION.THEMES.DETAILS.WATERMARK.ENABLE")}
										</label>
									</div>
									{/* Checkbox for activating watermark */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="content-column">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="content-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<Field
												id="watermark-toggle"
												type="checkbox"
												name="watermarkActive"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* if checkbox is checked, then render object for uploading files */}
						{formik.values.watermarkActive && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<header>
										{t("CONFIGURATION.THEMES.DETAILS.WATERMARK.UPLOAD")}
									</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="obj-container padded">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<FileUpload
											acceptableTypes="image/*"
											fileId="watermarkFile"
											fileName="watermarkFileName"
											formik={formik}
											buttonKey="CONFIGURATION.THEMES.DETAILS.WATERMARK.UPLOAD_BUTTON"
											labelKey="CONFIGURATION.THEMES.DETAILS.WATERMARK.UPLOAD_LABEL"
											descriptionKey="CONFIGURATION.THEMES.DETAILS.WATERMARK.FILEUPLOAD_DESCRIPTION"
											isEdit={isEdit}
										/>
									</div>
								</div>

								{/*if file uploaded, then render buttons for choice of position*/}
								{formik.values.watermarkFile && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<header>
											{t("CONFIGURATION.THEMES.DETAILS.WATERMARK.POSITION")}
										</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="obj-container padded">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<div className="video-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<div className="watermark-config">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="position-selection">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<button
															className={cn(
																"position-button position-top-left",
																{
																	active:
																		formik.values.watermarkPosition ===
																		"topLeft",
																}
															)}
															onClick={() => handleButtonClick("topLeft")}
														>
															{t(
																"CONFIGURATION.THEMES.DETAILS.WATERMARK.TOP_LEFT"
															)}
														</button>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<button
															className={cn(
																"position-button position-top-right",
																{
																	active:
																		formik.values.watermarkPosition ===
																		"topRight",
																}
															)}
															onClick={() => handleButtonClick("topRight")}
														>
															{t(
																"CONFIGURATION.THEMES.DETAILS.WATERMARK.TOP_RIGHT"
															)}
														</button>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<button
															className={cn(
																"position-button position-bottom-left",
																{
																	active:
																		formik.values.watermarkPosition ===
																		"bottomLeft",
																}
															)}
															onClick={() => handleButtonClick("bottomLeft")}
														>
															{t(
																"CONFIGURATION.THEMES.DETAILS.WATERMARK.BOTTOM_LEFT"
															)}
														</button>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<button
															className={cn(
																"position-button position-bottom-right",
																{
																	active:
																		formik.values.watermarkPosition ===
																		"bottomRight",
																}
															)}
															onClick={() => handleButtonClick("bottomRight")}
														>
															{t(
																"CONFIGURATION.THEMES.DETAILS.WATERMARK.BOTTOM_RIGHT"
															)}
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}
							</>
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

export default WatermarkPage;
