import React from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Step, StepButton, StepLabel, Stepper } from "@mui/material";
import {
	isSummaryReachable,
	useStepperStyle,
} from "../../../utils/wizardUtils";
import CustomStepIcon from "./CustomStepIcon";
import { checkAcls } from "../../../slices/aclSlice";
import { useAppDispatch } from "../../../store";

/**
 * This components renders the stepper navigation of new resource wizards
 */
const WizardStepper = ({
// @ts-expect-error TS(7031): Binding element 'steps' implicitly has an 'any' ty... Remove this comment to see the full error message
	steps,
// @ts-expect-error TS(7031): Binding element 'page' implicitly has an 'any' typ... Remove this comment to see the full error message
	page,
// @ts-expect-error TS(7031): Binding element 'setPage' implicitly has an 'any' ... Remove this comment to see the full error message
	setPage,
// @ts-expect-error TS(7031): Binding element 'formik' implicitly has an 'any' t... Remove this comment to see the full error message
	formik,
// @ts-expect-error TS(7031): Binding element 'completed' implicitly has an 'any... Remove this comment to see the full error message
	completed,
// @ts-expect-error TS(7031): Binding element 'setCompleted' implicitly has an '... Remove this comment to see the full error message
	setCompleted,
	hasAccessPage = false,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const classes = useStepperStyle();

// @ts-expect-error TS(7006): Parameter 'key' implicitly has an 'any' type.
	const handleOnClick = async (key) => {
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
			className={cn("step-by-step", classes.root)}
		>
{/* @ts-expect-error TS(7006): Parameter 'label' implicitly has an 'any' type. */}
			{steps.map((label, key) =>
				!label.hidden ? (
					<Step key={label.translation} completed={completed[key]}>
						<StepButton onClick={() => handleOnClick(key)} disabled={disabled}>
							<StepLabel StepIconComponent={CustomStepIcon}>
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
