import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import cn from "classnames";
import { Formik } from "formik";
// @ts-expect-error TS(6142): Module './GeneralPage' was resolved to '/home/arne... Remove this comment to see the full error message
import GeneralPage from "./GeneralPage";
// @ts-expect-error TS(6142): Module './BumperPage' was resolved to '/home/arnew... Remove this comment to see the full error message
import BumperPage from "./BumperPage";
// @ts-expect-error TS(6142): Module './TitleSlidePage' was resolved to '/home/a... Remove this comment to see the full error message
import TitleSlidePage from "./TitleSlidePage";
// @ts-expect-error TS(6142): Module './WatermarkPage' was resolved to '/home/ar... Remove this comment to see the full error message
import WatermarkPage from "./WatermarkPage";
import {
	getThemeDetails,
	getThemeUsage,
} from "../../../../selectors/themeDetailsSelectors";
// @ts-expect-error TS(6142): Module './UsagePage' was resolved to '/home/arnewi... Remove this comment to see the full error message
import UsagePage from "./UsagePage";
import { updateThemeDetails } from "../../../../thunks/themeDetailsThunks";
// @ts-expect-error TS(6142): Module '../../../shared/modals/ModalNavigation' wa... Remove this comment to see the full error message
import ModalNavigation from "../../../shared/modals/ModalNavigation";
import { NewThemeSchema } from "../../../../utils/validate";

/**
 * This component manages the pages of the theme details
 */
// @ts-expect-error TS(7031): Binding element 'close' implicitly has an 'any' ty... Remove this comment to see the full error message
const ThemeDetails = ({ close, themeDetails, themeUsage, updateTheme }) => {
	const { t } = useTranslation();

	const [page, setPage] = useState(0);

	// set initial values for formik form
	const initialValues = {
		...themeDetails,
		titleSlideMode:
			themeDetails.titleSlideActive && !!themeDetails.titleSlideBackgroundName
				? "upload"
				: "extract",
	};

	// information about tabs
	const tabs = [
		{
			name: "generalForm",
			tabTranslation: "CONFIGURATION.THEMES.DETAILS.GENERAL.CAPTION",
			translation: "CONFIGURATION.THEMES.DETAILS.GENERAL.CAPTION",
		},
		{
			name: "bumperForm",
			tabTranslation: "CONFIGURATION.THEMES.DETAILS.BUMPER.CAPTION",
			translation: "CONFIGURATION.THEMES.DETAILS.BUMPER.CAPTION",
		},
		{
			name: "trailerForm",
			tabTranslation: "CONFIGURATION.THEMES.DETAILS.TRAILER.CAPTION",
			translation: "CONFIGURATION.THEMES.DETAILS.TRAILER.CAPTION",
		},
		{
			name: "titleSlideForm",
			tabTranslation: "CONFIGURATION.THEMES.DETAILS.TITLE.CAPTION",
			translation: "CONFIGURATION.THEMES.DETAILS.TITLE.CAPTION",
		},
		{
			name: "watermarkForm",
			tabTranslation: "CONFIGURATION.THEMES.DETAILS.WATERMARK.CAPTION",
			translation: "CONFIGURATION.THEMES.DETAILS.WATERMARK.CAPTION",
		},
		{
			name: "usage",
			tabTranslation: "CONFIGURATION.THEMES.DETAILS.USAGE.CAPTION",
			translation: "CONFIGURATION.THEMES.DETAILS.USAGE.CAPTION",
		},
	];

	// Validation schema of current page
	const currentValidationSchema = NewThemeSchema[page];

	// update theme
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		updateTheme(themeDetails.id, values);
		close();
	};

// @ts-expect-error TS(7006): Parameter 'tabNr' implicitly has an 'any' type.
	const openTab = (tabNr) => {
		setPage(tabNr);
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
			{/* navigation */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<ModalNavigation tabInformation={tabs} openTab={openTab} page={page} />

			{/* initialize overall form */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<Formik
				initialValues={initialValues}
				validationSchema={currentValidationSchema}
				onSubmit={(values) => handleSubmit(values)}
			>
				{/* render modal pages depending on current value of page variable */}
				{(formik) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						{page === 0 && <GeneralPage formik={formik} isEdit />}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						{page === 1 && <BumperPage formik={formik} isEdit />}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						{page === 2 && <BumperPage formik={formik} isTrailer isEdit />}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						{page === 3 && <TitleSlidePage formik={formik} isEdit />}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						{page === 4 && <WatermarkPage formik={formik} isEdit />}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						{page === 5 && <UsagePage themeUsage={themeUsage} />}
						{/* submit and cancel button */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<footer>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<button className="cancel" onClick={() => close()}>
								{t("CANCEL")}
							</button>
						</footer>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="btm-spacer" />
					</div>
				)}
			</Formik>
		</>
	);
};

// get current state out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	themeDetails: getThemeDetails(state),
	themeUsage: getThemeUsage(state),
});

// map actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	updateTheme: (id, values) => dispatch(updateThemeDetails(id, values)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ThemeDetails);
