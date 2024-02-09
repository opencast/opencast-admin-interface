import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { connect } from "react-redux";
import { fetchWorkflowDef } from "../../../../thunks/workflowThunks";
import { getWorkflowDef } from "../../../../selectors/workflowSelectors";
import RenderWorkflowConfig from "../wizards/RenderWorkflowConfig";
import { setDefaultConfig } from "../../../../utils/workflowPanelUtils";
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
		<>
			<div className="modal-content">
				<div className="modal-body">
					<div className="full-col">
						{/* Workflow definition Selection*/}
						<div className="obj quick-actions">
							<header className="no-expand">
								{t("EVENTS.EVENTS.NEW.PROCESSING.SELECT_WORKFLOW")}
							</header>
							<div className="obj-container padded">
								{workflowDef.length > 0 ? (
									<div className="editable">
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
											tabIndex={99}
										/>
									</div>
								) : (
									<span>
										{t("EVENTS.EVENTS.NEW.PROCESSING.SELECT_WORKFLOW_EMPTY")}
									</span>
								)}

								{/* Configuration panel of selected workflow */}
								<div className="collapsible-box">
									<div
										id="new-event-workflow-configuration"
										className="checkbox-container obj-container"
									>
										{formik.values.processingWorkflow ? (
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
			<footer>
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
					tabIndex={100}
				>
					{t("WIZARD.NEXT_STEP")}
				</button>
				<button className="cancel" onClick={() => previous()} tabIndex={101}>
					{t("WIZARD.BACK")}
				</button>
			</footer>

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
