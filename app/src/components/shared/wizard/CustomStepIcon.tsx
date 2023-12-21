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
		<div className={cn(classes.root)}>
			{completed ? (
				<FaCircle className={classes.circle} />
			) : (
				<FaDotCircle className={classes.circle} />
			)}
		</div>
	);
};

export default CustomStepIcon;
