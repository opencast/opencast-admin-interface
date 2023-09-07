import React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { getSeriesThemes } from "../../../../selectors/seriesSeletctor";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardNavigationBut... Remove this comment to see the full error message
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
// @ts-expect-error TS(6142): Module '../../../shared/DropDown' was resolved to ... Remove this comment to see the full error message
import DropDown from "../../../shared/DropDown";

/**
 * This component renders the theme page for new series in the new series wizard.
 */
const NewThemePage = ({
    formik,
    nextPage,
    previousPage,
    seriesThemes
}: any) => {
	const { t } = useTranslation();

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	const getDescription = (id) => {
// @ts-expect-error TS(7006): Parameter 'theme' implicitly has an 'any' type.
		const theme = seriesThemes.find((theme) => theme.id === id);

		return theme.description;
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
						<div className="obj quick-actions">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<header className="no-expand">
								{t("EVENTS.SERIES.NEW.THEME.TITLE")}
							</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj-container padded">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<ul>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<p>{t("EVENTS.SERIES.NEW.THEME.DESCRIPTION.TEXT")}</p>
										{seriesThemes.length > 0 ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<p>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="editable">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<DropDown
															value={formik.values.theme}
															text={
																!!seriesThemes.find(
// @ts-expect-error TS(7006): Parameter 'theme' implicitly has an 'any' type.
																	(theme) => formik.values.theme === theme.id
																)
																	? seriesThemes.find(
// @ts-expect-error TS(7006): Parameter 'theme' implicitly has an 'any' type.
																			(theme) =>
																				formik.values.theme === theme.id
																	  ).name
																	: ""
															}
															options={seriesThemes}
															type={"newTheme"}
															required={false}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
															handleChange={(element) =>
																formik.setFieldValue("theme", element.value)
															}
															placeholder={t("EVENTS.SERIES.NEW.THEME.LABEL")}
															tabIndex={"1"}
														/>
													</div>
												</p>
												{!!formik.values.theme && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<p>{getDescription(formik.values.theme)}</p>
												)}
											</>
										) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<p>{t("EVENTS.SERIES.NEW.THEME.EMPTY")}</p>
										)}
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Button for navigation to next page and previous page */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<WizardNavigationButtons
				formik={formik}
				nextPage={nextPage}
				previousPage={previousPage}
			/>
		</>
	);
};

// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	seriesThemes: getSeriesThemes(state),
});

export default connect(mapStateToProps)(NewThemePage);
