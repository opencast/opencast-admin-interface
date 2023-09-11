import React from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Step, StepButton, StepLabel, Stepper } from "@material-ui/core";
import {
	isSummaryReachable,
	useStepperStyle,
} from "../../../utils/wizardUtils";
import CustomStepIcon from "./CustomStepIcon";
import { checkAcls } from "../../../thunks/aclThunks";
import { connect } from "react-redux";
import { checkConflicts } from "../../../thunks/eventThunks";

const WizardStepperEvent = ({
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
// @ts-expect-error TS(7031): Binding element 'checkAcls' implicitly has an 'any... Remove this comment to see the full error message
	checkAcls,
// @ts-expect-error TS(7031): Binding element 'checkConflicts' implicitly has an... Remove this comment to see the full error message
	checkConflicts,
}) => {
	const { t } = useTranslation();

	const classes = useStepperStyle();

// @ts-expect-error TS(7006): Parameter 'key' implicitly has an 'any' type.
	const handleOnClick = async (key) => {
		if (isSummaryReachable(key, steps, completed)) {
			if (steps[page].name === "source") {
				let dateCheck = await checkConflicts(formik.values);
				if (!dateCheck) {
					return;
				}
			}

			if (
				steps[page].name === "processing" &&
				!formik.values.processingWorkflow
			) {
				return;
			}

			let aclCheck = await checkAcls(formik.values.acls);
			if (!aclCheck) {
				return;
			}

			if (formik.isValid) {
				let updatedCompleted = completed;
				updatedCompleted[page] = true;
				setCompleted(updatedCompleted);
				await setPage(key);
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
				) : null
			)}
		</Stepper>
	);
};

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'acls' implicitly has an 'any' type.
	checkAcls: (acls) => dispatch(checkAcls(acls)),
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	checkConflicts: (values) => dispatch(checkConflicts(values)),
});

export default connect(null, mapDispatchToProps)(WizardStepperEvent);
