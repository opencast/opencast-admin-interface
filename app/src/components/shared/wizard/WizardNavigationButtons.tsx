import React from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";

const WizardNavigationButtons = ({
// @ts-expect-error TS(7031): Binding element 'isFirst' implicitly has an 'any' ... Remove this comment to see the full error message
	isFirst,
// @ts-expect-error TS(7031): Binding element 'isLast' implicitly has an 'any' t... Remove this comment to see the full error message
	isLast,
// @ts-expect-error TS(7031): Binding element 'noValidation' implicitly has an '... Remove this comment to see the full error message
	noValidation,
// @ts-expect-error TS(7031): Binding element 'formik' implicitly has an 'any' t... Remove this comment to see the full error message
	formik,
// @ts-expect-error TS(7031): Binding element 'nextPage' implicitly has an 'any'... Remove this comment to see the full error message
	nextPage,
// @ts-expect-error TS(7031): Binding element 'previousPage' implicitly has an '... Remove this comment to see the full error message
	previousPage,
}) => {
	const { t } = useTranslation();

	const validation = noValidation
		? {}
		: {
				active: formik.dirty && formik.isValid,
				inactive: !(formik.dirty && formik.isValid),
		  };

	const disabled = !(formik.dirty && formik.isValid);

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<footer>
				{isLast ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button
						type="submit"
						className={cn("submit", validation)}
						disabled={noValidation ? false : disabled}
						onClick={() => {
							formik.handleSubmit();
						}}
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
						tabIndex="100"
					>
						{t("WIZARD.CREATE")}
					</button>
				) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button
						type="submit"
						className={cn("submit", validation)}
						disabled={noValidation ? false : disabled}
						onClick={() => {
							nextPage(formik.values);
						}}
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
						tabIndex="100"
					>
						{t("WIZARD.NEXT_STEP")}
					</button>
				)}
				{!isFirst && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button
						className="cancel"
						onClick={() => previousPage(formik.values, false)}
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
						tabIndex="101"
					>
						{t("WIZARD.BACK")}
					</button>
				)}
			</footer>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="btm-spacer" />
		</>
	);
};

export default WizardNavigationButtons;
