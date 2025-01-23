import React from "react";
import { FormikProps } from "formik";
import NavigationButtons from "../NavigationButtons";

const WizardNavigationButtons = <T,>({
	isFirst,
	isLast,
	noValidation, // Do not validate
	customValidation, // Custom validation. If your component does its own validation instead of using Yup
	formik,
	nextPage,
	previousPage,
	submitPage,
	createTranslationString,
	cancelTranslationString,
}: {
  isFirst?: boolean,
	isLast?: boolean,
	noValidation?: boolean,
	customValidation?: boolean,
	formik: FormikProps<T>,
	nextPage?: (values: T) => void,
	previousPage?: (values: T) => void,
	submitPage?: () => void,
	createTranslationString?: string,
	cancelTranslationString?: string,
}) => {

	const disabled = noValidation
		? false
		: customValidation !== undefined
		? customValidation
		: !(formik.dirty && formik.isValid);

	return (
		<NavigationButtons
			isFirst={isFirst}
			isLast={isLast}
			isSubmitDisabled={disabled}
			nextPage={
				isLast
				? () => { !!submitPage ? submitPage() : formik.handleSubmit(); }
				: () => { !!nextPage && nextPage(formik.values); }
			}
			previousPage={
				() => { !!previousPage && previousPage(formik.values) }
			}
			nextTranslationString={
				isLast
				? createTranslationString ?? "WIZARD.CREATE"
				: "WIZARD.NEXT_STEP"
			}
			previousTranslationString={cancelTranslationString ?? "WIZARD.BACK"}
		/>
	);
};

export default WizardNavigationButtons;
