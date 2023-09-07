import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Formik } from "formik";
import {
	deleteWorkflow,
	fetchWorkflowDetails,
	fetchWorkflows,
	performWorkflowAction,
	saveWorkflowConfig,
	updateWorkflow,
} from "../../../../thunks/eventDetailsThunks";
import {
	deletingWorkflow,
	getBaseWorkflow,
	getWorkflow,
	getWorkflowConfiguration,
	getWorkflowDefinitions,
	getWorkflows,
	isFetchingWorkflows,
	performingWorkflowAction,
} from "../../../../selectors/eventDetailsSelectors";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
// @ts-expect-error TS(6142): Module '../wizards/RenderWorkflowConfig' was resol... Remove this comment to see the full error message
import RenderWorkflowConfig from "../wizards/RenderWorkflowConfig";
import { removeNotificationWizardForm } from "../../../../actions/notificationActions";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { hasAccess, parseBooleanInObject } from "../../../../utils/utils";
import { setDefaultConfig } from "../../../../utils/workflowPanelUtils";
// @ts-expect-error TS(6142): Module '../../../shared/DropDown' was resolved to ... Remove this comment to see the full error message
import DropDown from "../../../shared/DropDown";

/**
 * This component manages the workflows tab of the event details modal
 */
const EventDetailsWorkflowTab = ({
// @ts-expect-error TS(7031): Binding element 'eventId' implicitly has an 'any' ... Remove this comment to see the full error message
	eventId,
// @ts-expect-error TS(7031): Binding element 't' implicitly has an 'any' type.
	t,
// @ts-expect-error TS(7031): Binding element 'close' implicitly has an 'any' ty... Remove this comment to see the full error message
	close,
// @ts-expect-error TS(7031): Binding element 'setHierarchy' implicitly has an '... Remove this comment to see the full error message
	setHierarchy,
// @ts-expect-error TS(7031): Binding element 'baseWorkflow' implicitly has an '... Remove this comment to see the full error message
	baseWorkflow,
// @ts-expect-error TS(7031): Binding element 'saveWorkflowConfig' implicitly ha... Remove this comment to see the full error message
	saveWorkflowConfig,
// @ts-expect-error TS(7031): Binding element 'removeNotificationWizardForm' imp... Remove this comment to see the full error message
	removeNotificationWizardForm,
// @ts-expect-error TS(7031): Binding element 'workflow' implicitly has an 'any'... Remove this comment to see the full error message
	workflow,
// @ts-expect-error TS(7031): Binding element 'workflows' implicitly has an 'any... Remove this comment to see the full error message
	workflows,
// @ts-expect-error TS(7031): Binding element 'isLoading' implicitly has an 'any... Remove this comment to see the full error message
	isLoading,
// @ts-expect-error TS(7031): Binding element 'workflowDefinitions' implicitly h... Remove this comment to see the full error message
	workflowDefinitions,
// @ts-expect-error TS(7031): Binding element 'workflowConfiguration' implicitly... Remove this comment to see the full error message
	workflowConfiguration,
// @ts-expect-error TS(7031): Binding element 'performingWorkflowAction' implici... Remove this comment to see the full error message
	performingWorkflowAction,
// @ts-expect-error TS(7031): Binding element 'deletingWorkflow' implicitly has ... Remove this comment to see the full error message
	deletingWorkflow,
// @ts-expect-error TS(7031): Binding element 'loadWorkflows' implicitly has an ... Remove this comment to see the full error message
	loadWorkflows,
// @ts-expect-error TS(7031): Binding element 'updateWorkflow' implicitly has an... Remove this comment to see the full error message
	updateWorkflow,
// @ts-expect-error TS(7031): Binding element 'loadWorkflowDetails' implicitly h... Remove this comment to see the full error message
	loadWorkflowDetails,
// @ts-expect-error TS(7031): Binding element 'performWorkflowAction' implicitly... Remove this comment to see the full error message
	performWorkflowAction,
// @ts-expect-error TS(7031): Binding element 'deleteWf' implicitly has an 'any'... Remove this comment to see the full error message
	deleteWf,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
}) => {
	const isRoleWorkflowEdit = hasAccess(
		"ROLE_UI_EVENTS_DETAILS_WORKFLOWS_EDIT",
		user
	);
	const isRoleWorkflowDelete = hasAccess(
		"ROLE_UI_EVENTS_DETAILS_WORKFLOWS_DELETE",
		user
	);

	useEffect(() => {
		removeNotificationWizardForm();
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
		loadWorkflows(eventId).then((r) => {});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

// @ts-expect-error TS(7006): Parameter 'workflowId' implicitly has an 'any' typ... Remove this comment to see the full error message
	const isCurrentWorkflow = (workflowId) => {
		let currentWorkflow = workflows.entries[workflows.entries.length - 1];
		return currentWorkflow.id === workflowId;
	};

// @ts-expect-error TS(7006): Parameter 'workflowId' implicitly has an 'any' typ... Remove this comment to see the full error message
	const workflowAction = (workflowId, action) => {
		if (!performingWorkflowAction) {
			performWorkflowAction(eventId, workflowId, action, close);
		}
	};

// @ts-expect-error TS(7006): Parameter 'workflowId' implicitly has an 'any' typ... Remove this comment to see the full error message
	const deleteWorkflow = (workflowId) => {
		if (!deletingWorkflow) {
			deleteWf(eventId, workflowId);
		}
	};

// @ts-expect-error TS(7006): Parameter 'tabType' implicitly has an 'any' type.
	const openSubTab = (tabType, workflowId) => {
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
		loadWorkflowDetails(eventId, workflowId).then((r) => {});
		setHierarchy(tabType);
		removeNotificationWizardForm();
	};

	const hasCurrentAgentAccess = () => {
		//todo
		return true;
	};

// @ts-expect-error TS(7006): Parameter 'value' implicitly has an 'any' type.
	const changeWorkflow = (value, changeFormikValue) => {
		let currentConfiguration = {};

		if (value === baseWorkflow.workflowId) {
			currentConfiguration = parseBooleanInObject(baseWorkflow.configuration);
		} else {
			currentConfiguration = setDefaultConfig(workflowDefinitions, value);
		}

		changeFormikValue("configuration", currentConfiguration);
		changeFormikValue("workflowDefinition", value);
		updateWorkflow(value);
	};

	const setInitialValues = () => {
		let initialConfig = parseBooleanInObject(baseWorkflow.configuration);

		return {
			workflowDefinition: !!workflow.workflowId
				? workflow.workflowId
				: baseWorkflow.workflowId,
			configuration: initialConfig,
		};
	};

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		saveWorkflowConfig(values, eventId);
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="modal-content" data-modal-tab-content="workflows">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="full-col">
					{/* Notifications */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<Notifications context="not_corner" />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<ul>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<li>
							{workflows.scheduling || (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="obj tbl-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<header>
										{
											t(
												"EVENTS.EVENTS.DETAILS.WORKFLOW_INSTANCES.TITLE"
											) /* Workflow instances */
										}
									</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<th>
														{t("EVENTS.EVENTS.DETAILS.WORKFLOWS.ID") /* ID */}
													</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<th>
														{
															t(
																"EVENTS.EVENTS.DETAILS.WORKFLOWS.TITLE"
															) /* Title */
														}
													</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<th>
														{
															t(
																"EVENTS.EVENTS.DETAILS.WORKFLOWS.SUBMITTER"
															) /* Submitter */
														}
													</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<th>
														{
															t(
																"EVENTS.EVENTS.DETAILS.WORKFLOWS.SUBMITTED"
															) /* Submitted */
														}
													</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<th>
														{
															t(
																"EVENTS.EVENTS.DETAILS.WORKFLOWS.STATUS"
															) /* Status */
														}
													</th>
													{isRoleWorkflowEdit && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<th className="fit">
															{
																t(
																	"EVENTS.EVENTS.DETAILS.WORKFLOWS.ACTIONS"
																) /* Actions */
															}
														</th>
													)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<th className="medium" />
												</tr>
											</thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tbody>
												{isLoading ||
													workflows.entries.map((
// @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
														item,
// @ts-expect-error TS(7006): Parameter 'key' implicitly has an 'any' type.
														key /*orderBy:'submitted':true track by $index"*/
													) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<td>{item.id}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<td>{item.title}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<td>{item.submitter}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<td>
																{t("dateFormats.dateTime.medium", {
																	dateTime: new Date(item.submitted),
																})}
															</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<td>{t(item.status)}</td>
															{isRoleWorkflowEdit && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<td>
																	{item.status ===
																		"EVENTS.EVENTS.DETAILS.WORKFLOWS.OPERATION_STATUS.RUNNING" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<button
																			onClick={() =>
																				workflowAction(item.id, "STOP")
																			}
																			className="button-like-anchor stop fa-fw"
																			title={t(
																				"EVENTS.EVENTS.DETAILS.WORKFLOWS.TOOLTIP.STOP"
																			)}
																		>
																			{/* STOP */}
																		</button>
																	)}
																	{item.status ===
																		"EVENTS.EVENTS.DETAILS.WORKFLOWS.OPERATION_STATUS.PAUSED" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<button
																			onClick={() =>
																				workflowAction(item.id, "NONE")
																			}
																			className="button-like-anchor fa fa-hand-stop-o fa-fw"
																			style={{ color: "red" }}
																			title={t(
																				"EVENTS.EVENTS.DETAILS.WORKFLOWS.TOOLTIP.ABORT"
																			)}
																		>
																			{/* Abort */}
																		</button>
																	)}
																	{item.status ===
																		"EVENTS.EVENTS.DETAILS.WORKFLOWS.OPERATION_STATUS.PAUSED" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<button
																			onClick={() =>
																				workflowAction(item.id, "RETRY")
																			}
																			className="button-like-anchor fa fa-refresh fa-fw"
																			title={t(
																				"EVENTS.EVENTS.DETAILS.WORKFLOWS.TOOLTIP.RETRY"
																			)}
																		>
																			{/* Retry */}
																		</button>
																	)}
																	{(item.status ===
																		"EVENTS.EVENTS.DETAILS.WORKFLOWS.OPERATION_STATUS.SUCCEEDED" ||
																		item.status ===
																			"EVENTS.EVENTS.DETAILS.WORKFLOWS.OPERATION_STATUS.FAILED" ||
																		item.status ===
																			"EVENTS.EVENTS.DETAILS.WORKFLOWS.OPERATION_STATUS.STOPPED") &&
																		!isCurrentWorkflow(item.id) &&
																		isRoleWorkflowDelete && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<button
																				onClick={() => deleteWorkflow(item.id)}
																				className="button-like-anchor remove fa-fw"
																				title={t(
																					"EVENTS.EVENTS.DETAILS.WORKFLOWS.TOOLTIP.DELETE"
																				)}
																			>
																				{/* DELETE */}
																			</button>
																		)}
																</td>
															)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<button
																	className="button-like-anchor details-link"
																	onClick={() =>
																		openSubTab("workflow-details", item.id)
																	}
																>
																	{
																		t(
																			"EVENTS.EVENTS.DETAILS.MEDIA.DETAILS"
																		) /* Details */
																	}
																</button>
															</td>
														</tr>
													))}
											</tbody>
										</table>
									</div>
								</div>
							)}

							{workflows.scheduling &&
								(isLoading || (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<Formik
										initialValues={setInitialValues()}
										enableReinitialize
										onSubmit={(values) => handleSubmit(values)}
									>
										{(formik) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<div className="obj list-obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<header>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.CONFIGURATION"
														) /* Workflow configuration */
													}
												</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="obj list-obj quick-actions">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<th>
																		{
																			t(
																				"EVENTS.EVENTS.DETAILS.WORKFLOWS.WORKFLOW"
																			) /*Select Workflow*/
																		}
																	</th>
																</tr>
															</thead>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<tbody>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<div className="obj-container padded">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<div className="editable">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																				<DropDown
																					value={
																						formik.values.workflowDefinition
																					}
																					text={
																						workflowDefinitions.find(
// @ts-expect-error TS(7006): Parameter 'workflowDef' implicitly has an 'any' ty... Remove this comment to see the full error message
																							(workflowDef) =>
																								workflowDef.id ===
																								formik.values.workflowDefinition
																						).title
																					}
																					options={
																						!!workflowDefinitions &&
																						workflowDefinitions.length > 0
																							? workflowDefinitions /*w.id as w.title for w in workflowDefinitions | orderBy: 'displayOrder':true*/
																							: []
																					}
																					type={"workflow"}
																					required={true}
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
																					handleChange={(element) =>
																						changeWorkflow(
																							element.value,
																							formik.setFieldValue
																						)
																					}
																					placeholder={
																						!!workflowDefinitions &&
																						workflowDefinitions.length > 0
																							? t(
																									"EVENTS.EVENTS.NEW.PROCESSING.SELECT_WORKFLOW"
																							  )
																							: t(
																									"EVENTS.EVENTS.NEW.PROCESSING.SELECT_WORKFLOW_EMPTY"
																							  )
																					}
																					tabIndex={"5"}
																					disabled={
																						!hasCurrentAgentAccess() ||
																						!isRoleWorkflowEdit
																					}
																				/>
																				{/*pre-select-from="workflowDefinitionIds"*/}
																			</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<div className="obj-container padded">
																				{workflow.description}
																			</div>
																		</div>
																	</td>
																</tr>
															</tbody>
														</table>
													</div>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div className="obj list-obj quick-actions">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<th>
																		{
																			t(
																				"EVENTS.EVENTS.DETAILS.WORKFLOWS.CONFIGURATION"
																			) /* Configuration */
																		}
																	</th>
																</tr>
															</thead>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<tbody>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<div className="obj-container padded">
																			{hasCurrentAgentAccess() &&
																				isRoleWorkflowEdit &&
																				!!workflowConfiguration &&
																				!!workflowConfiguration.workflowId && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																					<div
																						id="event-workflow-configuration"
																						className="checkbox-container obj-container"
																					>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																						<RenderWorkflowConfig
																							workflowId={
																								workflowConfiguration.workflowId
																							}
																							formik={formik}
																						/>
																					</div>
																				)}
																			{(!!workflowConfiguration &&
																				!!workflowConfiguration.workflowId) || (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																				<div>
																					{
																						t(
																							"EVENTS.EVENTS.DETAILS.WORKFLOWS.NO_CONFIGURATION"
																						) /* No config */
																					}
																				</div>
																			)}
																		</div>
																	</td>
																</tr>
															</tbody>
														</table>
													</div>
												</div>

												{/* Save and cancel buttons */}
												{hasCurrentAgentAccess() &&
													isRoleWorkflowEdit &&
													!!workflowConfiguration &&
													!!workflowConfiguration.workflowId &&
													formik.dirty && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<footer style={{ padding: "15px" }}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<div className="pull-left">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<button
																	type="reset"
																	onClick={() => {
																		changeWorkflow(
																			baseWorkflow.workflowId,
																			formik.setFieldValue
																		);
																		formik.resetForm();
																	}}
																	disabled={!formik.isValid}
																	className={`cancel  ${
																		!formik.isValid ? "disabled" : ""
																	}`}
																>
																	{t("CANCEL") /* Cancel */}
																</button>
															</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<div className="pull-right">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<button
																	onClick={() => formik.handleSubmit()}
																	disabled={!(formik.dirty && formik.isValid)}
																	className={`save green  ${
																		!(formik.dirty && formik.isValid)
																			? "disabled"
																			: ""
																	}`}
																>
																	{t("SAVE") /* Save */}
																</button>
															</div>
														</footer>
													)}
											</div>
										)}
									</Formik>
								))}
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	workflow: getWorkflow(state),
	workflows: getWorkflows(state),
	baseWorkflow: getBaseWorkflow(state),
	isLoading: isFetchingWorkflows(state),
	workflowDefinitions: getWorkflowDefinitions(state),
	workflowConfiguration: getWorkflowConfiguration(state),
	performingWorkflowAction: performingWorkflowAction(state),
	deletingWorkflow: deletingWorkflow(state),
	user: getUserInformation(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	loadWorkflows: (eventId) => dispatch(fetchWorkflows(eventId)),
// @ts-expect-error TS(7006): Parameter 'workflow' implicitly has an 'any' type.
	updateWorkflow: (workflow) => dispatch(updateWorkflow(workflow)),
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	loadWorkflowDetails: (eventId, workflowId) =>
		dispatch(fetchWorkflowDetails(eventId, workflowId)),
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	performWorkflowAction: (eventId, workflowId, action, close) =>
		dispatch(performWorkflowAction(eventId, workflowId, action, close)),
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	deleteWf: (eventId, workflowId) =>
		dispatch(deleteWorkflow(eventId, workflowId)),
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	saveWorkflowConfig: (values, eventId) =>
		dispatch(saveWorkflowConfig(values, eventId)),
	removeNotificationWizardForm: () => dispatch(removeNotificationWizardForm()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EventDetailsWorkflowTab);
