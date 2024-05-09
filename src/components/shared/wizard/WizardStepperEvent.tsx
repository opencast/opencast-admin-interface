import React from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Step, StepButton, StepLabel, Stepper } from "@mui/material";
import {
	isSummaryReachable,
	useStepperStyle,
} from "../../../utils/wizardUtils";
import CustomStepIcon from "./CustomStepIcon";
import { FormikProps } from "formik/dist/types";

const WizardStepperEvent = ({
	steps,
	page,
	setPage,
	formik,
	completed,
	setCompleted,
} : {
	steps: {
		name: string,
		translation: string,
		hidden?: boolean,
	}[],
	page: number,
	setPage: (num: number) => void,
	formik: FormikProps<any>,
	completed: Record<number, boolean>,
	setCompleted: (rec: Record<number, boolean>) => void,
}) => {
	const { t } = useTranslation();

	const classes = useStepperStyle();

	const handleOnClick = async (key: number) => {
		if (isSummaryReachable(key, steps, completed)) {

			if (completed[key]) {
				await setPage(key);
			}

			let previousPageIndex = key - 1 > 0 ? key - 1 : 0;
			while (previousPageIndex >= 0) {
				if (steps[previousPageIndex].hidden) {
					previousPageIndex = previousPageIndex - 1;
				} else {
					break;
				}
			}
			if (completed[previousPageIndex]) {
				await setPage(key);
			}
		}
	};

	return (
		<Stepper
			activeStep={page}
			nonLinear
			alternativeLabel
// @ts-expect-error TS(2322): Type 'boolean' is not assignable to type 'ReactEle... Remove this comment to see the full error message
			connector={false}
			className={cn("step-by-step", classes.root)}
		>
			{steps.filter(step => !step.hidden).map((label, key) => (
					<Step key={label.translation} completed={completed[key]}>
						<StepButton onClick={() => handleOnClick(key)}>
							<StepLabel StepIconComponent={CustomStepIcon}>
								{t(label.translation)}
							</StepLabel>
						</StepButton>
					</Step>
			))}
		</Stepper>
	);
};



export default WizardStepperEvent;
