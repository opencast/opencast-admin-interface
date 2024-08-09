import React from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Step, StepButton, StepLabel, Stepper } from "@mui/material";
import {
	isSummaryReachable,
	stepLabelStyle,
	stepperStyle,
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

	const handleOnClick = async (key: number) => {
		if (isSummaryReachable(key, steps, completed)) {

			if (completed[key]) {
				await setPage(key);
			}

			let previousPageIndex = Math.max(0, key - 1);
			while (previousPageIndex >= 0) {
				if (steps[previousPageIndex]!.hidden) {
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
			connector={<></>}
			sx={stepperStyle.root}
			className={cn("step-by-step")}
		>
			{steps.map((label, key) =>
				!label.hidden ? (
					<Step key={label.translation} completed={completed[key]}>
						<StepButton onClick={() => handleOnClick(key)}>
							<StepLabel sx={stepLabelStyle.root} StepIconComponent={CustomStepIcon}>
								{t(label.translation)}
							</StepLabel>
						</StepButton>
					</Step>
				) : <React.Fragment key={label.translation} />
			)}
		</Stepper>
	);
};



export default WizardStepperEvent;
