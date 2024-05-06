import  makeStyles  from "@mui/styles/makeStyles";

// Base style for Stepper component
export const useStepperStyle = makeStyles({
	root: {
		background: "#eeeff0",
		height: "100px",
		padding: "24px",
	},
});

// Style of icons used in Stepper
type stepIconStyleProps = {
	active: boolean,
	completed: boolean,
}
export const useStepIconStyles = makeStyles({
	root: {
		height: 22,
		alignItems: "center",
	},
	circle: {
		color: "#92a0ab",
		width: "20px",
		height: "20px",
		transform: (props: stepIconStyleProps) => props.active ? "scale(1.3)" : "scale(1.0)",
	},
});

/* This method checks if the summary page is reachable.
 * If the clicked page is some other page than summary then no check is needed.
 * If the clicked page is summary then it only should be clickable/reachable if all other
 * visible pages of the wizard are valid.
 */
// @ts-expect-error TS(7006): Parameter 'key' implicitly has an 'any' type.
export const isSummaryReachable = (key, steps, completed) => {
	if (steps[key].name === "summary") {
// @ts-expect-error TS(7006): Parameter 'step' implicitly has an 'any' type.
		const visibleSteps = steps.filter((step) => !step.hidden);

		return Object.keys(completed).length >= visibleSteps.length - 2;
	}

	return true;
};
