import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module '../wizards/RenderWorkflowConfig' was resol... Remove this comment to see the full error message
import RenderWorkflowConfig from "../wizards/RenderWorkflowConfig";
import { fetchWorkflowDef } from "../../../../thunks/workflowThunks";
import { getWorkflowDef } from "../../../../selectors/workflowSelectors";
import { connect } from "react-redux";
import cn from "classnames";
import { setDefaultConfig } from "../../../../utils/workflowPanelUtils";
// @ts-expect-error TS(6142): Module '../../../shared/DropDown' was resolved to ... Remove this comment to see the full error message
import DropDown from "../../../shared/DropDown";

/**
 * This component renders the workflow selection for start task bulk action
 */
const StartTaskWorkflowPage = ({
// @ts-expect-error TS(7031): Binding element 'formik' implicitly has an 'any' t... Remove this comment to see the full error message
	formik,
// @ts-expect-error TS(7031): Binding element 'previousPage' implicitly has an '... Remove this comment to see the full error message
	previousPage,
// @ts-expect-error TS(7031): Binding element 'nextPage' implicitly has an 'any'... Remove this comment to see the full error message
	nextPage,
// @ts-expect-error TS(7031): Binding element 'setPageCompleted' implicitly has ... Remove this comment to see the full error message
	setPageCompleted,
// @ts-expect-error TS(7031): Binding element 'loadingWorkflowDef' implicitly ha... Remove this comment to see the full error message
	loadingWorkflowDef,
// @ts-expect-error TS(7031): Binding element 'workflowDef' implicitly has an 'a... Remove this comment to see the full error message
	workflowDef,
}) => {
	const { t } = useTranslation();

	useEffect(() => {
		// Load workflow definitions for selecting
		loadingWorkflowDef();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	const setDefaultValues = (value) => {
		let workflowId = value;
		// fill values with default configuration of chosen workflow
		let defaultConfiguration = setDefaultConfig(workflowDef, workflowId);

		// set default configuration in formik
		formik.setFieldValue("configuration", defaultConfiguration);
		// set chosen workflow in formik
		formik.setFieldValue("workflow", workflowId);
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="full-col">
						{/* Workflow definition Selection*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj list-obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<header>{t("BULK_ACTIONS.SCHEDULE_TASK.TASKS.SELECT")}</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj-container">
								{workflowDef.length > 0 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="editable">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<DropDown
											value={formik.values.workflow}
											text={
												!!workflowDef.find(
// @ts-expect-error TS(7006): Parameter 'workflowDef' implicitly has an 'any' ty... Remove this comment to see the full error message
													(workflowDef) =>
														workflowDef.id === formik.values.workflow
												)
													? workflowDef.find(
// @ts-expect-error TS(7006): Parameter 'workflowDef' implicitly has an 'any' ty... Remove this comment to see the full error message
															(workflowDef) =>
																workflowDef.id === formik.values.workflow
													  ).title
													: ""
											}
											options={workflowDef}
											type={"workflow"}
											required={true}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
											handleChange={(element) =>
												setDefaultValues(element.value)
											}
											placeholder={t(
												"EVENTS.EVENTS.DETAILS.PUBLICATIONS.SELECT_WORKFLOW"
											)}
											tabIndex={"99"}
										/>
									</div>
								)}
								{formik.values.workflow && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<>
										{/* Configuration panel of selected workflow */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div
											id="new-event-workflow-configuration"
											className="checkbox-container obj-container"
										>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<RenderWorkflowConfig
												displayDescription
												workflowId={formik.values.workflow}
												formik={formik}
											/>
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Button for navigation to next page and previous page */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<footer>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<button
					type="submit"
					className={cn("submit", {
						active: formik.values.workflow && formik.isValid,
						inactive: !(formik.values.workflow && formik.isValid),
					})}
					disabled={!(formik.values.workflow && formik.isValid)}
					onClick={() => {
						nextPage(formik.values);
					}}
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
					tabIndex="100"
				>
					{t("WIZARD.NEXT_STEP")}
				</button>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<button
					className="cancel"
					onClick={() => {
						previousPage();
						if (!formik.isValid) {
							// set page as not filled out
							setPageCompleted([]);
						}
					}}
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
					tabIndex="101"
				>
					{t("WIZARD.BACK")}
				</button>
			</footer>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="btm-spacer" />
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	workflowDef: getWorkflowDef(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadingWorkflowDef: () => dispatch(fetchWorkflowDef("tasks")),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(StartTaskWorkflowPage);
