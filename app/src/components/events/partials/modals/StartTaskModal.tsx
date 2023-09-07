import React, { useEffect } from "react";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { initialFormValuesStartTask } from "../../../../configs/modalConfig";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardStepper' was ... Remove this comment to see the full error message
import WizardStepper from "../../../shared/wizard/WizardStepper";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/StartTaskGeneralPage'... Remove this comment to see the full error message
import StartTaskGeneralPage from "../ModalTabsAndPages/StartTaskGeneralPage";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/StartTaskWorkflowPage... Remove this comment to see the full error message
import StartTaskWorkflowPage from "../ModalTabsAndPages/StartTaskWorkflowPage";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/StartTaskSummaryPage'... Remove this comment to see the full error message
import StartTaskSummaryPage from "../ModalTabsAndPages/StartTaskSummaryPage";
import { postTasks } from "../../../../thunks/taskThunks";
import { usePageFunctions } from "../../../../hooks/wizardHooks";
import { checkValidityStartTaskEventSelection } from "../../../../utils/bulkActionUtils";

/**
 * This component manages the pages of the task start bulk action
 */
const StartTaskModal = ({
    close,
    postTasks
}: any) => {
	const { t } = useTranslation();

	const initialValues = initialFormValuesStartTask;

	const [
		snapshot,
		page,
		nextPage,
		previousPage,
		setPage,
		pageCompleted,
		setPageCompleted,
	] = usePageFunctions(0, initialValues);

	const steps = [
		{
			translation: "BULK_ACTIONS.SCHEDULE_TASK.GENERAL.CAPTION",
			name: "general",
		},
		{
			translation: "BULK_ACTIONS.SCHEDULE_TASK.TASKS.CAPTION",
			name: "tasks",
		},
		{
			translation: "BULK_ACTIONS.SCHEDULE_TASK.SUMMARY.CAPTION",
			name: "summary",
		},
	];

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const validateFormik = (values) => {
		const errors = {};
		if (!checkValidityStartTaskEventSelection(values)) {
// @ts-expect-error TS(2339): Property 'events' does not exist on type '{}'.
			errors.events = "Not on all events task startable!";
		}
		if (
			steps[page].name !== "general" &&
			!(
				!!values.workflow &&
				values.workflow !== "" &&
				values.configuration !== {}
			)
		) {
// @ts-expect-error TS(2339): Property 'worflow' does not exist on type '{}'.
			errors.worflow = "Workflow not selected!";
		}
		return errors;
	};

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		postTasks(values);
		close();
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-animation modal-overlay" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<section className="modal wizard modal-animation">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button className="button-like-anchor fa fa-times close-modal" onClick={() => close()} />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h2>{t("BULK_ACTIONS.SCHEDULE_TASK.CAPTION")}</h2>
				</header>

				{/* Initialize overall form */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Formik
					initialValues={snapshot}
					validate={(values) => validateFormik(values)}
					onSubmit={(values) => handleSubmit(values)}
				>
					{/* Render wizard pages depending on current value of page variable */}
					{(formik) => {
						// eslint-disable-next-line react-hooks/rules-of-hooks
						useEffect(() => {
							formik.validateForm().then();
						}, [page]);

						return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<>
								{/* Stepper that shows each step of wizard as header */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<WizardStepper
									steps={steps}
									page={page}
									setPage={setPage}
									completed={pageCompleted}
									setCompleted={setPageCompleted}
									formik={formik}
								/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div>
									{page === 0 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<StartTaskGeneralPage formik={formik} nextPage={nextPage} />
									)}
									{page === 1 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<StartTaskWorkflowPage
											formik={formik}
											nextPage={nextPage}
											previousPage={previousPage}
											setPageCompleted={setPageCompleted}
										/>
									)}
									{page === 2 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<StartTaskSummaryPage
// @ts-expect-error TS(2322): Type '{ formik: FormikProps<any>; previousPage: an... Remove this comment to see the full error message
											formik={formik}
											previousPage={previousPage}
										/>
									)}
								</div>
							</>
						);
					}}
				</Formik>
			</section>
		</>
	);
};

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToState = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	postTasks: (values) => dispatch(postTasks(values)),
});

export default connect(null, mapDispatchToState)(StartTaskModal);
