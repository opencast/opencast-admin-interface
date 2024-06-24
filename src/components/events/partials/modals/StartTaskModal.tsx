import React, { useEffect } from "react";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { initialFormValuesStartTask } from "../../../../configs/modalConfig";
import WizardStepper from "../../../shared/wizard/WizardStepper";
import StartTaskGeneralPage from "../ModalTabsAndPages/StartTaskGeneralPage";
import StartTaskWorkflowPage from "../ModalTabsAndPages/StartTaskWorkflowPage";
import StartTaskSummaryPage from "../ModalTabsAndPages/StartTaskSummaryPage";
import { postTasks } from "../../../../thunks/taskThunks";
import { usePageFunctions } from "../../../../hooks/wizardHooks";
import { checkValidityStartTaskEventSelection } from "../../../../utils/bulkActionUtils";
import { useHotkeys } from "react-hotkeys-hook";
import { availableHotkeys } from "../../../../configs/hotkeysConfig";

/**
 * This component manages the pages of the task start bulk action
 */
const StartTaskModal = ({
    close,
    postTasks
}: any) => {
	const { t } = useTranslation();

	const initialValues = initialFormValuesStartTask;

	const {
		snapshot,
		page,
		nextPage,
		previousPage,
		setPage,
		pageCompleted,
		setPageCompleted,
	} = usePageFunctions(0, initialValues);

	useHotkeys(
		availableHotkeys.general.CLOSE_MODAL.sequence,
		() => close(),
		{ description: t(availableHotkeys.general.CLOSE_MODAL.description) ?? undefined },
		[close],
  	);

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
			steps[page]!.name !== "general" &&
			!(
				!!values.workflow &&
				values.workflow !== ""
			)
		) {
// @ts-expect-error TS(2339): Property 'worflow' does not exist on type '{}'.
			errors.workflow = "Workflow not selected!";
		}
		return errors;
	};

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		postTasks(values);
		close();
	};

	return (
		<>
			<div className="modal-animation modal-overlay" />
			<section className="modal wizard modal-animation">
				<header>
					<button className="button-like-anchor fa fa-times close-modal" onClick={() => close()} />
					<h2>{t("BULK_ACTIONS.SCHEDULE_TASK.CAPTION")}</h2>
				</header>

				{/* Initialize overall form */}
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
						// eslint-disable-next-line react-hooks/exhaustive-deps
						}, [page]);

						return (
							<>
								{/* Stepper that shows each step of wizard as header */}
								<WizardStepper
									steps={steps}
									page={page}
									setPage={setPage}
									completed={pageCompleted}
									setCompleted={setPageCompleted}
									formik={formik}
								/>
								<div>
									{page === 0 && (
										<StartTaskGeneralPage
											// @ts-expect-error: Type-checking gets confused by redux-connect in the child
											formik={formik}
											// @ts-expect-error: Type-checking gets confused by redux-connect in the child
											nextPage={nextPage}
										/>
									)}
									{page === 1 && (
										<StartTaskWorkflowPage
											formik={formik}
											nextPage={nextPage}
											previousPage={previousPage}
											setPageCompleted={setPageCompleted}
										/>
									)}
									{page === 2 && (
										<StartTaskSummaryPage
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
