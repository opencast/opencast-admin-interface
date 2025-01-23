import React from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";

const NavigationButtons = ({
	isFirst,
	isLast,
	isSubmitDisabled = false,
	submitClassName = "submit",
	nextPage,
	previousPage,
	nextTranslationString,
	previousTranslationString,
}: {
	isFirst?: boolean,
	isLast?: boolean,
	isSubmitDisabled?: boolean,
	submitClassName?: string,
	nextPage?: () => unknown,
	previousPage?: () => unknown,
	nextTranslationString?: string,
	previousTranslationString?: string,
}) => {

	const { t } = useTranslation();

	const disabled = isSubmitDisabled;

	const submitActiveClassName = {
		active: !disabled,
		inactive: disabled,
	}

	return (
		<footer>
			{isLast ? (
				<button
					type="submit"
					className={cn(submitClassName, submitActiveClassName)}
					disabled={disabled}
					onClick={() => {
						!!nextPage && nextPage()
					}}
					tabIndex={100}
				>
					{t(nextTranslationString ?? "WIZARD.CREATE")}
				</button>
			) : (
				<button
					type="submit"
					className={cn(submitClassName, submitActiveClassName)}
					disabled={disabled}
					onClick={() => {
						!!nextPage && nextPage();
					}}
					tabIndex={100}
				>
					{t(nextTranslationString ?? "WIZARD.NEXT_STEP")}
				</button>
			)}
			{!isFirst && (
				<button
					className="cancel"
					onClick={() => {
						!!previousPage && previousPage()
					}}
					tabIndex={101}
				>
					{t(previousTranslationString ?? "WIZARD.BACK")}
				</button>
			)}
		</footer>
	);

};

export default NavigationButtons;
