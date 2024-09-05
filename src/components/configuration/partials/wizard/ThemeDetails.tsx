import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Formik } from "formik";
import GeneralPage from "./GeneralPage";
import BumperPage from "./BumperPage";
import TitleSlidePage from "./TitleSlidePage";
import WatermarkPage from "./WatermarkPage";
import {
	getThemeDetails,
	getThemeUsage,
} from "../../../../selectors/themeDetailsSelectors";
import UsagePage from "./UsagePage";
import ModalNavigation from "../../../shared/modals/ModalNavigation";
import { NewThemeSchema } from "../../../../utils/validate";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { updateThemeDetails } from "../../../../slices/themeDetailsSlice";
import { ThemeDetailsInitialValues } from "../../../../slices/themeSlice";

/**
 * This component manages the pages of the theme details
 */
const ThemeDetails : React.FC<{
	close: () => void,
}> = ({
  close,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [page, setPage] = useState(0);

	const themeDetails = useAppSelector(state => getThemeDetails(state));
	const themeUsage = useAppSelector(state => getThemeUsage(state));

	// set initial values for formik form
	const initialValues = {
		...themeDetails,
		titleSlideMode:
			themeDetails.titleSlideActive && !!themeDetails.titleSlideBackground
				? "upload"
				: "extract",
	};

	// information about tabs
	const tabs = [
		{
			name: "generalForm",
			tabTranslation: "CONFIGURATION.THEMES.DETAILS.GENERAL.CAPTION",
			translation: "CONFIGURATION.THEMES.DETAILS.GENERAL.CAPTION",
			accessRole: "ROLE_UI_THEMES_EDIT",
		},
		{
			name: "bumperForm",
			tabTranslation: "CONFIGURATION.THEMES.DETAILS.BUMPER.CAPTION",
			translation: "CONFIGURATION.THEMES.DETAILS.BUMPER.CAPTION",
			accessRole: "ROLE_UI_THEMES_EDIT",
		},
		{
			name: "trailerForm",
			tabTranslation: "CONFIGURATION.THEMES.DETAILS.TRAILER.CAPTION",
			translation: "CONFIGURATION.THEMES.DETAILS.TRAILER.CAPTION",
			accessRole: "ROLE_UI_THEMES_EDIT",
		},
		{
			name: "titleSlideForm",
			tabTranslation: "CONFIGURATION.THEMES.DETAILS.TITLE.CAPTION",
			translation: "CONFIGURATION.THEMES.DETAILS.TITLE.CAPTION",
			accessRole: "ROLE_UI_THEMES_EDIT",
		},
		{
			name: "watermarkForm",
			tabTranslation: "CONFIGURATION.THEMES.DETAILS.WATERMARK.CAPTION",
			translation: "CONFIGURATION.THEMES.DETAILS.WATERMARK.CAPTION",
			accessRole: "ROLE_UI_THEMES_EDIT",
		},
		{
			name: "usage",
			tabTranslation: "CONFIGURATION.THEMES.DETAILS.USAGE.CAPTION",
			translation: "CONFIGURATION.THEMES.DETAILS.USAGE.CAPTION",
			accessRole: "ROLE_UI_THEMES_EDIT",
		},
	];

	// Validation schema of current page
	const currentValidationSchema = NewThemeSchema[page];

	// update theme
	const handleSubmit = (values: ThemeDetailsInitialValues) => {
		dispatch(updateThemeDetails({id: themeDetails.id, values: values}));
		close();
	};

	const openTab = (tabNr: number) => {
		setPage(tabNr);
	};

	return (
		<>
			{/* navigation */}
			<ModalNavigation tabInformation={tabs} openTab={openTab} page={page} />

			{/* initialize overall form */}
			<Formik
				initialValues={initialValues}
				validationSchema={currentValidationSchema}
				onSubmit={(values) => handleSubmit(values)}
			>
				{/* render modal pages depending on current value of page variable */}
				{(formik) => (
					<div>
						{page === 0 && <GeneralPage formik={formik} isEdit />}
						{page === 1 && <BumperPage formik={formik} isEdit />}
						{page === 2 && <BumperPage formik={formik} isTrailer isEdit />}
						{page === 3 && <TitleSlidePage formik={formik} isEdit />}
						{page === 4 && <WatermarkPage formik={formik} isEdit />}
						{page === 5 && <UsagePage themeUsage={themeUsage} />}
						{/* submit and cancel button */}
						<footer>
							<button
								className={cn("submit", {
									active: formik.dirty && formik.isValid,
									inactive: !(formik.dirty && formik.isValid),
								})}
								disabled={!(formik.dirty && formik.isValid)}
								onClick={() => formik.handleSubmit()}
							>
								{t("SUBMIT")}
							</button>
							<button className="cancel" onClick={() => close()}>
								{t("CANCEL")}
							</button>
						</footer>

						<div className="btm-spacer" />
					</div>
				)}
			</Formik>
		</>
	);
};

export default ThemeDetails;
