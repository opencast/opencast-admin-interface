import React, { useEffect } from "react";
import { Formik } from "formik";
import GeneralPage from "./GeneralPage";
import BumperPage from "./BumperPage";
import TitleSlidePage from "./TitleSlidePage";
import WatermarkPage from "./WatermarkPage";
import ThemeSummaryPage from "./ThemeSummaryPage";
import WizardStepper from "../../../shared/wizard/WizardStepper";
import { initialFormValuesNewThemes } from "../../../../configs/modalConfig";
import { usePageFunctions } from "../../../../hooks/wizardHooks";
import { NewThemeSchema } from "../../../../utils/validate";
import { useAppDispatch } from "../../../../store";
import { Details, postNewTheme } from "../../../../slices/themeSlice";

/**
 * This component manages the pages of the new theme wizard and the submission of values
 */
const NewThemeWizard: React.FC<{
	close: () => void
}> = ({
	close,
}) => {
	const dispatch = useAppDispatch();
	const initialValues = initialFormValuesNewThemes;

	const {
		snapshot,
		page,
		nextPage,
		previousPage,
		setPage,
		pageCompleted,
		setPageCompleted,
	 } = usePageFunctions(0, initialValues);

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

	const handleSubmit = (values: Details) => {
		dispatch(postNewTheme(values));
		close();
	};

	return (
		<>
			{/* Initialize overall form */}
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
						<>
							{/* Stepper that shows each step of wizard as header */}
							<WizardStepper
								steps={steps}
								page={page}
								setPage={setPage}
								completed={pageCompleted}
								setCompleted={setPageCompleted}
								formik={formik}
							/>
							<div>
								{page === 0 && (
									<GeneralPage formik={formik} nextPage={nextPage} />
								)}
								{page === 1 && (
									<BumperPage
										formik={formik}
										nextPage={nextPage}
										previousPage={previousPage}
									/>
								)}
								{page === 2 && (
									<BumperPage
										formik={formik}
										nextPage={nextPage}
										previousPage={previousPage}
										isTrailer
									/>
								)}
								{page === 3 && (
									<TitleSlidePage
										formik={formik}
										nextPage={nextPage}
										previousPage={previousPage}
									/>
								)}
								{page === 4 && (
									<WatermarkPage
										formik={formik}
										nextPage={nextPage}
										previousPage={previousPage}
									/>
								)}
								{page === 5 && (
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

export default NewThemeWizard;
