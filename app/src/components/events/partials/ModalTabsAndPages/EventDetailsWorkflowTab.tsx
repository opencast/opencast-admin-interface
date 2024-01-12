import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Formik } from "formik";
import {
	deletingWorkflow as getDeletingWorkflow,
	getBaseWorkflow,
	getWorkflow,
	getWorkflowConfiguration,
	getWorkflowDefinitions,
	getWorkflows,
	isFetchingWorkflows,
	performingWorkflowAction as getPerformingWorkflowAction,
} from "../../../../selectors/eventDetailsSelectors";
import Notifications from "../../../shared/Notifications";
import RenderWorkflowConfig from "../wizards/RenderWorkflowConfig";
import { removeNotificationWizardForm } from "../../../../actions/notificationActions";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { hasAccess, parseBooleanInObject } from "../../../../utils/utils";
import { setDefaultConfig } from "../../../../utils/workflowPanelUtils";
import DropDown from "../../../shared/DropDown";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
	deleteWorkflow as deleteWf,
	fetchWorkflowDetails,
	fetchWorkflows,
	performWorkflowAction,
	saveWorkflowConfig,
	updateWorkflow,
} from "../../../../slices/eventDetailsSlice";

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
// @ts-expect-error TS(7031): Binding element 'removeNotificationWizardForm' imp... Remove this comment to see the full error message
	removeNotificationWizardForm,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
}) => {
	const dispatch = useAppDispatch();

	const deletingWorkflow = useAppSelector(state => getDeletingWorkflow(state));
	const baseWorkflow = useAppSelector(state => getBaseWorkflow(state));
	const workflow = useAppSelector(state => getWorkflow(state));
	const workflowConfiguration = useAppSelector(state => getWorkflowConfiguration(state));
	const workflowDefinitions = useAppSelector(state => getWorkflowDefinitions(state));
	const workflows = useAppSelector(state => getWorkflows(state));
	const isLoading = useAppSelector(state => isFetchingWorkflows(state));
	const performingWorkflowAction = useAppSelector(state => getPerformingWorkflowAction(state));

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
		dispatch(fetchWorkflows(eventId)).then();
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
			dispatch(performWorkflowAction({eventId, workflowId, action, close}));
		}
	};

// @ts-expect-error TS(7006): Parameter 'workflowId' implicitly has an 'any' typ... Remove this comment to see the full error message
	const deleteWorkflow = (workflowId) => {
		if (!deletingWorkflow) {
			dispatch(deleteWf({eventId, workflowId}));
		}
	};

// @ts-expect-error TS(7006): Parameter 'tabType' implicitly has an 'any' type.
	const openSubTab = (tabType, workflowId) => {
		dispatch(fetchWorkflowDetails({eventId, workflowId})).then();
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
		dispatch(updateWorkflow(value));
	};

	const setInitialValues = () => {
		let initialConfig = undefined;

		// TODO: Scheduled events are missing configuration for their workflow
		// Figure out why the config is missing
		if (baseWorkflow.configuration) {
			initialConfig = parseBooleanInObject(baseWorkflow.configuration);
		}

		return {
			workflowDefinition: !!workflow.workflowId
				? workflow.workflowId
				: baseWorkflow.workflowId,
			configuration: initialConfig,
		};
	};

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		dispatch(saveWorkflowConfig({values, eventId}));
	};

	return (
		<div className="modal-content" data-modal-tab-content="workflows">
			<div className="modal-body">
				<div className="full-col">
					{/* Notifications */}
					<Notifications context="not_corner" />

					<ul>
						<li>
							{workflows.scheduling || (
								<div className="obj tbl-container">
									<header>
										{
											t(
												"EVENTS.EVENTS.DETAILS.WORKFLOW_INSTANCES.TITLE"
											) /* Workflow instances */
										}
									</header>
									<div className="obj-container">
										<table className="main-tbl">
											<thead>
												<tr>
													<th>
														{t("EVENTS.EVENTS.DETAILS.WORKFLOWS.ID") /* ID */}
													</th>
													<th>
														{
															t(
																"EVENTS.EVENTS.DETAILS.WORKFLOWS.TITLE"
															) /* Title */
														}
													</th>
													<th>
														{
															t(
																"EVENTS.EVENTS.DETAILS.WORKFLOWS.SUBMITTER"
															) /* Submitter */
														}
													</th>
													<th>
														{
															t(
																"EVENTS.EVENTS.DETAILS.WORKFLOWS.SUBMITTED"
															) /* Submitted */
														}
													</th>
													<th>
														{
															t(
																"EVENTS.EVENTS.DETAILS.WORKFLOWS.STATUS"
															) /* Status */
														}
													</th>
													{isRoleWorkflowEdit && (
														<th className="fit">
															{
																t(
																	"EVENTS.EVENTS.DETAILS.WORKFLOWS.ACTIONS"
																) /* Actions */
															}
														</th>
													)}
													<th className="medium" />
												</tr>
											</thead>
											<tbody>
												{isLoading ||
													workflows.entries.map((
														item,
														key /*orderBy:'submitted':true track by $index"*/
													) => (
														<tr key={key}>
															<td>{item.id}</td>
															<td>{item.title}</td>
															<td>{item.submitter}</td>
															<td>
																{t("dateFormats.dateTime.medium", {
																	dateTime: new Date(item.submitted),
																})}
															</td>
															<td>{t(item.status)}</td>
															{isRoleWorkflowEdit && (
																<td>
																	{item.status ===
																		"EVENTS.EVENTS.DETAILS.WORKFLOWS.OPERATION_STATUS.RUNNING" && (
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
															<td>
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
									<Formik
										initialValues={setInitialValues()}
										enableReinitialize
										onSubmit={(values) => handleSubmit(values)}
									>
										{(formik) => (
											<div className="obj list-obj">
												<header>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.CONFIGURATION"
														) /* Workflow configuration */
													}
												</header>
												<div className="obj-container">
													<div className="obj list-obj quick-actions">
														<table className="main-tbl">
															<thead>
																<tr>
																	<th>
																		{
																			t(
																				"EVENTS.EVENTS.DETAILS.WORKFLOWS.WORKFLOW"
																			) /*Select Workflow*/
																		}
																	</th>
																</tr>
															</thead>

															<tbody>
																<tr>
																	<td>
																		<div className="obj-container padded">
																			<div className="editable">
																				<DropDown
																					value={
																						formik.values.workflowDefinition
																					}
																					text={
																						workflowDefinitions.find(
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
																			<div className="obj-container padded">
																				{workflow.description}
																			</div>
																		</div>
																	</td>
																</tr>
															</tbody>
														</table>
													</div>

													<div className="obj list-obj quick-actions">
														<table className="main-tbl">
															<thead>
																<tr>
																	<th>
																		{
																			t(
																				"EVENTS.EVENTS.DETAILS.WORKFLOWS.CONFIGURATION"
																			) /* Configuration */
																		}
																	</th>
																</tr>
															</thead>

															<tbody>
																<tr>
																	<td>
																		<div className="obj-container padded">
																			{hasCurrentAgentAccess() &&
																				isRoleWorkflowEdit &&
																				!!workflowConfiguration &&
																				!!workflowConfiguration.workflowId && (
																					<div
																						id="event-workflow-configuration"
																						className="checkbox-container obj-container"
																					>
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
														<footer style={{ padding: "15px" }}>
															<div className="pull-left">
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
															<div className="pull-right">
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
	user: getUserInformation(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	removeNotificationWizardForm: () => dispatch(removeNotificationWizardForm()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EventDetailsWorkflowTab);
