import React, { useEffect } from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
// @ts-expect-error TS(6142): Module './GeneralPage' was resolved to '/home/arne... Remove this comment to see the full error message
import GeneralPage from "./GeneralPage";
// @ts-expect-error TS(6142): Module './BumperPage' was resolved to '/home/arnew... Remove this comment to see the full error message
import BumperPage from "./BumperPage";
// @ts-expect-error TS(6142): Module './TitleSlidePage' was resolved to '/home/a... Remove this comment to see the full error message
import TitleSlidePage from "./TitleSlidePage";
// @ts-expect-error TS(6142): Module './WatermarkPage' was resolved to '/home/ar... Remove this comment to see the full error message
import WatermarkPage from "./WatermarkPage";
// @ts-expect-error TS(6142): Module './ThemeSummaryPage' was resolved to '/home... Remove this comment to see the full error message
import ThemeSummaryPage from "./ThemeSummaryPage";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardStepper' was ... Remove this comment to see the full error message
import WizardStepper from "../../../shared/wizard/WizardStepper";
import { postNewTheme } from "../../../../thunks/themeThunks";
import { initialFormValuesNewThemes } from "../../../../configs/modalConfig";
import { usePageFunctions } from "../../../../hooks/wizardHooks";
import { NewThemeSchema } from "../../../../utils/validate";

/**
 * This component manages the pages of the new theme wizard and the submission of values
 */
const NewThemeWizard = ({
    close,
    postNewTheme
}: any) => {
	const initialValues = initialFormValuesNewThemes;

	const [
		snapshot,
		page,
		nextPage,
		previousPage,
		setPage,
		pageCompleted,
		setPageCompleted,
	] = usePageFunctions(0, initialValues);

	// Caption of steps used by Stepper
	const steps = [
		{
			name: "generalForm",
			translation: "CONFIGURATION.THEMES.DETAILS.GENERAL.CAPTION",
		},
		{
			name: "bumperForm",
			translation: "CONFIGURATION.THEMES.DETAILS.BUMPER.CAPTION",
		},
		{
			name: "trailerForm",
			translation: "CONFIGURATION.THEMES.DETAILS.TRAILER.CAPTION",
		},
		{
			name: "titleSlideForm",
			translation: "CONFIGURATION.THEMES.DETAILS.TITLE.CAPTION",
		},
		{
			name: "watermarkForm",
			translation: "CONFIGURATION.THEMES.DETAILS.WATERMARK.CAPTION",
		},
		{
			name: "summary",
			translation: "CONFIGURATION.THEMES.DETAILS.SUMMARY.CAPTION",
		},
	];

	// Validation schema of current page
	const currentValidationSchema = NewThemeSchema[page];

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		postNewTheme(values);
		close();
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
			{/* Initialize overall form */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<Formik
				initialValues={snapshot}
				validationSchema={currentValidationSchema}
				onSubmit={(values) => handleSubmit(values)}
			>
				{/* Render wizard pages depending on current value of page variable */}
				{(formik) => {
					// eslint-disable-next-line react-hooks/rules-of-hooks
					useEffect(() => {
						formik.validateForm();
						// eslint-disable-next-line react-hooks/exhaustive-deps
					}, [page]);

					return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<>
							{/* Stepper that shows each step of wizard as header */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<WizardStepper
								steps={steps}
								page={page}
								setPage={setPage}
								completed={pageCompleted}
								setCompleted={setPageCompleted}
								formik={formik}
							/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div>
								{page === 0 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<GeneralPage formik={formik} nextPage={nextPage} />
								)}
								{page === 1 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<BumperPage
										formik={formik}
										nextPage={nextPage}
										previousPage={previousPage}
									/>
								)}
								{page === 2 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<BumperPage
										formik={formik}
										nextPage={nextPage}
										previousPage={previousPage}
										isTrailer
									/>
								)}
								{page === 3 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<TitleSlidePage
										formik={formik}
										nextPage={nextPage}
										previousPage={previousPage}
									/>
								)}
								{page === 4 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<WatermarkPage
										formik={formik}
										nextPage={nextPage}
										previousPage={previousPage}
									/>
								)}
								{page === 5 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<ThemeSummaryPage
										formik={formik}
										previousPage={previousPage}
									/>
								)}
							</div>
						</>
					);
				}}
			</Formik>
		</>
	);
};

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	postNewTheme: (values) => dispatch(postNewTheme(values)),
});

export default connect(null, mapDispatchToProps)(NewThemeWizard);
