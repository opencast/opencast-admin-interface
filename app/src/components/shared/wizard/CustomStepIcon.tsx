import { useStepIconStyles } from "../../../utils/wizardUtils";
import cn from "classnames";
import { FaCircle, FaDotCircle } from "react-icons/fa";
import React from "react";

/**
 * Component that renders icons of Stepper depending on completeness of steps
 */
const CustomStepIcon = (props: any) => {
	const classes = useStepIconStyles();
	const { completed } = props;

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className={cn(classes.root)}>
			{completed ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<FaCircle className={classes.circle} />
			) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<FaDotCircle className={classes.circle} />
			)}
		</div>
	);
};

export default CustomStepIcon;
