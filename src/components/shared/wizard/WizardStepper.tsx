import React from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Step, StepButton, StepLabel, Stepper } from "@mui/material";
import {
	isSummaryReachable,
	useStepLabelStyles,
	useStepperStyle,
} from "../../../utils/wizardUtils";
import CustomStepIcon from "./CustomStepIcon";
import { checkAcls } from "../../../slices/aclSlice";
import { useAppDispatch } from "../../../store";
import { FormikProps } from "formik/dist/types";

/**
 * This components renders the stepper navigation of new resource wizards
 */
const WizardStepper = ({
	steps,
	page,
	setPage,
	formik,
	completed,
	setCompleted,
	hasAccessPage = false,
}: {
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
	hasAccessPage?: boolean,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const stepperClasses = useStepperStyle();
	const labelClasses = useStepLabelStyles();

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
				updatedCompleted[page] = true;
				setCompleted(updatedCompleted);
				setPage(key);
			}
		}
	};

	const disabled = !(formik.dirty && formik.isValid);

	return (
		<Stepper
			activeStep={page}
			nonLinear
			alternativeLabel
// @ts-expect-error TS(2322): Type 'boolean' is not assignable to type 'ReactEle... Remove this comment to see the full error message
			connector={false}
			className={cn("step-by-step", stepperClasses.root)}
		>
			{steps.map((label, key) =>
				!label.hidden ? (
					<Step key={label.translation} completed={completed[key]}>
						<StepButton onClick={() => handleOnClick(key)} disabled={disabled}>
							<StepLabel className={labelClasses.root} StepIconComponent={CustomStepIcon}>
								{t(label.translation)}
							</StepLabel>
						</StepButton>
					</Step>
				) : <></>
			)}
		</Stepper>
	);
};

export default WizardStepper;
