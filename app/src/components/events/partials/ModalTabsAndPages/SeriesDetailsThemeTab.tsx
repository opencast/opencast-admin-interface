import React from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from "lodash";
import cn from "classnames";
import { connect } from "react-redux";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
import { updateSeriesTheme } from "../../../../thunks/seriesDetailsThunks";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../../utils/utils";
// @ts-expect-error TS(6142): Module '../../../shared/DropDown' was resolved to ... Remove this comment to see the full error message
import DropDown from "../../../shared/DropDown";

/**
 * This component renders the tab for editing the theme of a certain series
 */
const SeriesDetailsThemeTab = ({
// @ts-expect-error TS(7031): Binding element 'theme' implicitly has an 'any' ty... Remove this comment to see the full error message
	theme,
// @ts-expect-error TS(7031): Binding element 'seriesId' implicitly has an 'any'... Remove this comment to see the full error message
	seriesId,
// @ts-expect-error TS(7031): Binding element 'themeNames' implicitly has an 'an... Remove this comment to see the full error message
	themeNames,
// @ts-expect-error TS(7031): Binding element 'updateTheme' implicitly has an 'a... Remove this comment to see the full error message
	updateTheme,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
}) => {
	const { t } = useTranslation();

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		updateTheme(seriesId, values);
	};

// @ts-expect-error TS(7006): Parameter 'formik' implicitly has an 'any' type.
	const checkValidity = (formik) => {
		if (formik.dirty && formik.isValid) {
			// check if user provided values differ from initial ones
			return !_.isEqual(formik.values, formik.initialValues);
		} else {
			return false;
		}
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<Formik
			enableReinitialize
			initialValues={{ theme: theme }}
			onSubmit={(values) => handleSubmit(values)}
		>
			{(formik) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<Notifications context="not-corner" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="obj quick-actions">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<header>{t("CONFIGURATION.NAVIGATION.THEMES")}</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="obj-container padded">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<ul>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<p>{t("EVENTS.SERIES.NEW.THEME.DESCRIPTION.TEXT")}</p>
												{themeNames.length > 0 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<p>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<div className="editable">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<DropDown
																value={formik.values.theme}
																text={formik.values.theme}
																options={themeNames}
																type={"theme"}
																required={false}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
																handleChange={(element) =>
																	formik.setFieldValue("theme", element.value)
																}
																placeholder={t("EVENTS.SERIES.NEW.THEME.LABEL")}
																tabIndex={"8"}
																disabled={
																	!hasAccess(
																		"ROLE_UI_SERIES_DETAILS_THEMES_EDIT",
																		user
																	)
																}
															/>
														</div>
														{/*<option value={theme}>{theme}</option>*/}
													</p>
												)}
											</li>
										</ul>
									</div>
									{formik.dirty && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<>
											{/* Render buttons for updating theme */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<footer style={{ padding: "15px" }}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<button
													type="submit"
													onClick={() => formik.handleSubmit()}
													disabled={!checkValidity(formik)}
													className={cn("submit", {
														active: checkValidity(formik),
														inactive: !checkValidity(formik),
													})}
												>
													{t("SAVE")}
												</button>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<button
// @ts-expect-error TS(2322): Type 'string' is not assignable to type '{ theme: ... Remove this comment to see the full error message
													onClick={() => formik.resetForm({ values: "" })}
													className="cancel"
												>
													{t("CANCEL")}
												</button>
											</footer>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<div className="btm-spacer" />
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</Formik>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	user: getUserInformation(state),
});

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	updateTheme: (id, values) => dispatch(updateSeriesTheme(id, values)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SeriesDetailsThemeTab);
