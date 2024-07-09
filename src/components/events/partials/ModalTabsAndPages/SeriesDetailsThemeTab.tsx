import React from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import _ from "lodash";
import cn from "classnames";
import Notifications from "../../../shared/Notifications";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../../utils/utils";
import DropDown from "../../../shared/DropDown";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { updateSeriesTheme } from "../../../../slices/seriesDetailsSlice";

/**
 * This component renders the tab for editing the theme of a certain series
 */
const SeriesDetailsThemeTab = ({
	theme,
	themeNames,
	seriesId,
}: {
	theme: string,
	themeNames: any[]
	seriesId: string
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const user = useAppSelector(state => getUserInformation(state));

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		dispatch(updateSeriesTheme({id: seriesId, values: values}));
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
		<Formik
			enableReinitialize
			initialValues={{ theme: theme }}
			onSubmit={(values) => handleSubmit(values)}
		>
			{(formik) => (
				<>
					<div className="modal-content">
						<div className="modal-body">
							<div className="full-col">
								{/* Notifications */}
								<Notifications context="not_corner" />
								<div className="obj quick-actions">
									<header>{t("CONFIGURATION.NAVIGATION.THEMES")}</header>
									<div className="obj-container padded">
										<ul>
											<li>
												<p>{t("EVENTS.SERIES.NEW.THEME.DESCRIPTION.TEXT")}</p>
												{themeNames.length > 0 && (
													<div className="editable">
														<DropDown
															value={formik.values.theme}
															text={formik.values.theme}
															options={themeNames}
															type={"theme"}
															required={false}
															handleChange={(element) => {
																if (element) {
																	formik.setFieldValue("theme", element.value)
																}
															}}
															placeholder={t("EVENTS.SERIES.NEW.THEME.LABEL")}
															disabled={
																!hasAccess(
																	"ROLE_UI_SERIES_DETAILS_THEMES_EDIT",
																	user
																)
															}
														/>
													</div>
												)}
											</li>
										</ul>
									</div>
									{formik.dirty && (
										<>
											{/* Render buttons for updating theme */}
											<footer>
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
												<button
// @ts-expect-error TS(2322): Type 'string' is not assignable to type '{ theme: ... Remove this comment to see the full error message
													onClick={() => formik.resetForm({ values: "" })}
													className="cancel"
												>
													{t("CANCEL")}
												</button>
											</footer>

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

export default SeriesDetailsThemeTab;
