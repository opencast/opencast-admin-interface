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
import { checkAcls } from "../../../slices/aclSlice";
import { useAppDispatch } from "../../../store";
import { FormikProps } from "formik/dist/types";
import { ParseKeys } from "i18next";

export type WizardStep = {
	translation: ParseKeys,
	name: string,
}

/**
 * This components renders the stepper navigation of new resource wizards
 */
const WizardStepper = ({
	steps,
	activePageIndex,
	setActivePage,
	formik,
	completed,
	setCompleted,
	hasAccessPage = false,
}: {
	steps: WizardStep[],
	activePageIndex: number,
	setActivePage: (num: number) => void,
	formik: FormikProps<any>,
	completed: Record<number, boolean>,
	setCompleted: (rec: Record<number, boolean>) => void,
	hasAccessPage?: boolean,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const handleOnClick = async (key: number) => {
		if (isSummaryReachable(key, steps, completed)) {
			if (hasAccessPage) {
				let check = await dispatch(checkAcls(formik.values.acls));
				if (!check) {
					return;
				}
			}

			if (formik.isValid) {
				let updatedCompleted = completed;
				updatedCompleted[activePageIndex] = true;
				setCompleted(updatedCompleted);
				// If all previous pages have been completed
				if (Object.values(updatedCompleted)
						.filter((_, index) => index > key)
						.every(value => value)
				) {
					setActivePage(key);
				}
			}

			if (!formik.isValid) {
				if (completed[key]) {
					setActivePage(key);
				}
			}
		}
	};

	return (
		<Stepper
			activeStep={activePageIndex}
			nonLinear
			alternativeLabel
			connector={<></>}
			sx={stepperStyle.root}
			className={cn("step-by-step")}
		>
			{steps.map((label, key) =>
				<Step key={label.translation} completed={completed[key]}>
					<StepButton onClick={() => handleOnClick(key)}>
						<StepLabel sx={stepLabelStyle.root} StepIconComponent={CustomStepIcon}>
							{t(label.translation)}
						</StepLabel>
					</StepButton>
				</Step>
			)}
		</Stepper>
	);
};

export default WizardStepper;
