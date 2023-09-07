import React from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardNavigationBut... Remove this comment to see the full error message
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";

/**
 * This component renders the summary page for new themes in the new theme wizard.
 */
const ThemeSummaryPage = ({
    formik,
    previousPage
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
						<div className="obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<header>
								{t("CONFIGURATION.THEMES.DETAILS.SUMMARY.CAPTION")}
							</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj-container summary-list padded">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<ul>
									{/* show only when file is uploaded for a list item */}
									{formik.values.bumperFile && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<h4>
												{t("CONFIGURATION.THEMES.DETAILS.BUMPER.CAPTION")}
											</h4>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<p>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<span>
													{t(
														"CONFIGURATION.THEMES.DETAILS.BUMPER.FILE_UPLOADED"
													)}
												</span>
												{formik.values.bumperFileName}
											</p>
										</li>
									)}
									{formik.values.trailerFile && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<h4>
												{t("CONFIGURATION.THEMES.DETAILS.TRAILER.CAPTION")}
											</h4>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<p>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<span>
													{t(
														"CONFIGURATION.THEMES.DETAILS.TRAILER.FILE_UPLOADED"
													)}
												</span>
												{formik.values.trailerFileName}
											</p>
										</li>
									)}
									{formik.values.titleSlideMode === "upload" &&
										formik.values.titleSlideBackground && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<h4>
													{t("CONFIGURATION.THEMES.DETAILS.TITLE.CAPTION")}
												</h4>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<p>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<span>
														{t(
															"CONFIGURATION.THEMES.DETAILS.TITLE.FILE_UPLOADED"
														)}
													</span>
													{formik.values.titleSlideBackgroundName}
												</p>
											</li>
										)}
									{formik.values.watermarkFile && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<h4>
												{t("CONFIGURATION.THEMES.DETAILS.WATERMARK.CAPTION")}
											</h4>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<p>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<span>
													{t(
														"CONFIGURATION.THEMES.DETAILS.WATERMARK.FILE_UPLOADED"
													)}
												</span>
												{formik.values.watermarkFileName}
											</p>
										</li>
									)}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Button for navigation to next page */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<WizardNavigationButtons
				isLast
				formik={formik}
				previousPage={previousPage}
			/>
		</>
	);
};

export default ThemeSummaryPage;
