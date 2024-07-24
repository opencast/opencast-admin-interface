import React from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { FormikProps } from "formik";

const WizardNavigationButtons = <T,>({
	isFirst,
	isLast,
	noValidation,         // Do not validate
	additionalValidation, // Custom validation. If your component does its own validation instead of using Yup
	formik,
	nextPage,
	previousPage,
}: {
  isFirst?: boolean,
	isLast?: boolean,
	noValidation?: boolean,
	additionalValidation?: boolean,
	formik: FormikProps<T>,
	nextPage?: (values: T) => void,
	previousPage?: (values: T) => void,
}) => {
	const { t } = useTranslation();

	const validation = noValidation
		? {}
		: {
				active: formik.dirty && formik.isValid,
				inactive: !(formik.dirty && formik.isValid) || additionalValidation,
		  };

	const disabled = !(formik.dirty && formik.isValid) || additionalValidation;

	return (
		<>
			<footer>
				{isLast ? (
					<button
						type="submit"
						className={cn("submit", validation)}
						disabled={noValidation ? false : disabled}
						onClick={() => {
							formik.handleSubmit();
						}}
						tabIndex={100}
					>
						{t("WIZARD.CREATE")}
					</button>
				) : (
					<button
						type="submit"
						className={cn("submit", validation)}
						disabled={noValidation ? false : disabled}
						onClick={() => {
							!!nextPage && nextPage(formik.values);
						}}
						tabIndex={100}
					>
						{t("WIZARD.NEXT_STEP")}
					</button>
				)}
				{!isFirst && (
					<button
						className="cancel"
						onClick={() => {
							!!previousPage && previousPage(formik.values)
						}}
						tabIndex={101}
					>
						{t("WIZARD.BACK")}
					</button>
				)}
			</footer>

			<div className="btm-spacer" />
		</>
	);
};

export default WizardNavigationButtons;
