import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { connect } from "react-redux";
import { fetchWorkflowDef } from "../../../../thunks/workflowThunks";
import { getWorkflowDef } from "../../../../selectors/workflowSelectors";
// @ts-expect-error TS(6142): Module '../wizards/RenderWorkflowConfig' was resol... Remove this comment to see the full error message
import RenderWorkflowConfig from "../wizards/RenderWorkflowConfig";
import { setDefaultConfig } from "../../../../utils/workflowPanelUtils";
// @ts-expect-error TS(6142): Module '../../../shared/DropDown' was resolved to ... Remove this comment to see the full error message
import DropDown from "../../../shared/DropDown";

/**
 * This component renders the processing page for new events in the new event wizard.
 */
const NewProcessingPage = ({
// @ts-expect-error TS(7031): Binding element 'previousPage' implicitly has an '... Remove this comment to see the full error message
	previousPage,
// @ts-expect-error TS(7031): Binding element 'nextPage' implicitly has an 'any'... Remove this comment to see the full error message
	nextPage,
// @ts-expect-error TS(7031): Binding element 'formik' implicitly has an 'any' t... Remove this comment to see the full error message
	formik,
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

	const previous = () => {
		// if not UPLOAD is chosen as source mode, then back to source page
		if (formik.values.sourceMode !== "UPLOAD") {
			previousPage(formik.values, true);
		} else {
			previousPage(formik.values, false);
		}
	};

// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	const setDefaultValues = (value) => {
		let workflowId = value;
		// fill values with default configuration of chosen workflow
		let defaultConfiguration = setDefaultConfig(workflowDef, workflowId);

		// set default configuration in formik
		formik.setFieldValue("configuration", defaultConfiguration);
		// set chosen workflow in formik
		formik.setFieldValue("processingWorkflow", workflowId);
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
						<div className="obj quick-actions">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<header className="no-expand">
								{t("EVENTS.EVENTS.NEW.PROCESSING.SELECT_WORKFLOW")}
							</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj-container padded">
								{workflowDef.length > 0 ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="editable">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<DropDown
											value={formik.values.processingWorkflow}
											text={
												!!workflowDef.find(
// @ts-expect-error TS(7006): Parameter 'workflow' implicitly has an 'any' type.
													(workflow) =>
														formik.values.processingWorkflow === workflow.id
												)
													? workflowDef.find(
// @ts-expect-error TS(7006): Parameter 'workflow' implicitly has an 'any' type.
															(workflow) =>
																formik.values.processingWorkflow === workflow.id
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
												"EVENTS.EVENTS.NEW.PROCESSING.SELECT_WORKFLOW"
											)}
											tabIndex={"99"}
										/>
									</div>
								) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<span>
										{t("EVENTS.EVENTS.NEW.PROCESSING.SELECT_WORKFLOW_EMPTY")}
									</span>
								)}

								{/* Configuration panel of selected workflow */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="collapsible-box">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div
										id="new-event-workflow-configuration"
										className="checkbox-container obj-container"
									>
										{formik.values.processingWorkflow ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<RenderWorkflowConfig
												displayDescription
												workflowId={formik.values.processingWorkflow}
												formik={formik}
											/>
										) : null}
									</div>
								</div>
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
						active: formik.values.processingWorkflow && formik.isValid,
						inactive: !(formik.values.processingWorkflow && formik.isValid),
					})}
					disabled={!(formik.values.processingWorkflow && formik.isValid)}
					onClick={() => {
						nextPage(formik.values);
					}}
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
					tabIndex="100"
				>
					{t("WIZARD.NEXT_STEP")}
				</button>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<button className="cancel" onClick={() => previous()} tabIndex="101">
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

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
	loadingWorkflowDef: () => dispatch(fetchWorkflowDef()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewProcessingPage);
