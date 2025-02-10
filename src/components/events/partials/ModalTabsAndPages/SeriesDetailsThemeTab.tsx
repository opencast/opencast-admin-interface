import React from "react";
import { useTranslation } from "react-i18next";
import { Formik, FormikProps } from "formik";
import _ from "lodash";
import Notifications from "../../../shared/Notifications";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../../utils/utils";
import DropDown from "../../../shared/DropDown";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { updateSeriesTheme } from "../../../../slices/seriesDetailsSlice";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";

/**
 * This component renders the tab for editing the theme of a certain series
 */
const SeriesDetailsThemeTab = ({
	theme,
	themeNames,
	seriesId,
}: {
	theme: string,
	themeNames: unknown[]
	seriesId: string
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const user = useAppSelector(state => getUserInformation(state));

	const handleSubmit = (values: { theme: string }) => {
		dispatch(updateSeriesTheme({id: seriesId, values: values}));
	};

	const checkValidity = (formik: FormikProps<{theme: string }>) => {
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
											<WizardNavigationButtons
												formik={formik}
												customValidation={!checkValidity(formik)}
												previousPage={() => formik.resetForm()}
												createTranslationString="SAVE"
												cancelTranslationString="CANCEL"
												isLast
											/>
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
