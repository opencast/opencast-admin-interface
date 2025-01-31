import React, { useEffect } from "react";
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
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { hasAccess, parseBooleanInObject } from "../../../../utils/utils";
import DropDown from "../../../shared/DropDown";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
	deleteWorkflow as deleteWf,
	fetchWorkflows,
	performWorkflowAction,
	saveWorkflowConfig,
	setModalWorkflowId,
	setModalWorkflowTabHierarchy,
} from "../../../../slices/eventDetailsSlice";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";
import { renderValidDate } from "../../../../utils/dateUtils";
import { Tooltip } from "../../../shared/Tooltip";
import { WorkflowTabHierarchy } from "../modals/EventDetails";
import { useTranslation } from "react-i18next";

/**
 * This component manages the workflows tab of the event details modal
 */
const EventDetailsWorkflowTab = ({
	eventId,
}: {
	eventId: string,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const user = useAppSelector(state => getUserInformation(state));
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
		dispatch(removeNotificationWizardForm());
		dispatch(fetchWorkflows(eventId)).then();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const isCurrentWorkflow = (workflowId: string) => {
		let currentWorkflow = workflows.entries[workflows.entries.length - 1];
		return currentWorkflow.id === workflowId;
	};

	const workflowAction = (workflowId: string, action: string) => {
		if (!performingWorkflowAction) {
			dispatch(performWorkflowAction({eventId, workflowId, action}));
		}
	};

	const deleteWorkflow = (workflowId: string) => {
		if (!deletingWorkflow) {
			dispatch(deleteWf({eventId, workflowId}));
		}
	};

	const openSubTab = (tabType: WorkflowTabHierarchy, workflowId: string) => {
		dispatch(setModalWorkflowId(workflowId));
		dispatch(setModalWorkflowTabHierarchy(tabType));
		dispatch(removeNotificationWizardForm());
	};

	const hasCurrentAgentAccess = () => {
		//todo
		return true;
	};

	const setInitialValues = () => {
		let initialConfig = undefined;

		if (baseWorkflow.configuration) {
			initialConfig = parseBooleanInObject(baseWorkflow.configuration);
		}

		return {
			workflowDefinition: "workflowId" in workflow && !!workflow.workflowId
				? workflow.workflowId
				: baseWorkflow.workflowId,
			configuration: initialConfig,
		};
	};

	const handleSubmit = (values: {
		workflowDefinition: string,
		configuration: { [key: string]: unknown } | undefined
	}) => {
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
																	dateTime: renderValidDate(item.submitted),
																})}
															</td>
															<td>{t(item.status)}</td>
															{isRoleWorkflowEdit && (
																<td>
																	{item.status ===
																		"EVENTS.EVENTS.DETAILS.WORKFLOWS.OPERATION_STATUS.RUNNING" && (
																		<Tooltip title={t("EVENTS.EVENTS.DETAILS.WORKFLOWS.TOOLTIP.STOP")}>
																			<button
																				onClick={() =>
																					workflowAction(item.id, "STOP")
																				}
																				className="button-like-anchor stop fa-fw"
																			>
																				{/* STOP */}
																			</button>
																		</Tooltip>
																	)}
																	{item.status ===
																		"EVENTS.EVENTS.DETAILS.WORKFLOWS.OPERATION_STATUS.PAUSED" && (
																		<Tooltip title={t("EVENTS.EVENTS.DETAILS.WORKFLOWS.TOOLTIP.ABORT")}>
																			<button
																				onClick={() =>
																					workflowAction(item.id, "NONE")
																				}
																				className="button-like-anchor fa fa-hand-stop-o fa-fw"
																				style={{ color: "red" }}
																			>
																				{/* Abort */}
																			</button>
																		</Tooltip>
																	)}
																	{item.status ===
																		"EVENTS.EVENTS.DETAILS.WORKFLOWS.OPERATION_STATUS.PAUSED" && (
																		<Tooltip title={t("EVENTS.EVENTS.DETAILS.WORKFLOWS.TOOLTIP.RETRY")}>
																			<button
																				onClick={() =>
																					workflowAction(item.id, "RETRY")
																				}
																				className="button-like-anchor fa fa-refresh fa-fw"
																			>
																				{/* Retry */}
																			</button>
																		</Tooltip>
																	)}
																	{(item.status ===
																		"EVENTS.EVENTS.DETAILS.WORKFLOWS.OPERATION_STATUS.SUCCEEDED" ||
																		item.status ===
																			"EVENTS.EVENTS.DETAILS.WORKFLOWS.OPERATION_STATUS.FAILED" ||
																		item.status ===
																			"EVENTS.EVENTS.DETAILS.WORKFLOWS.OPERATION_STATUS.STOPPED") &&
																		!isCurrentWorkflow(item.id) &&
																		isRoleWorkflowDelete && (
																			<Tooltip
																				title={t(
																					"EVENTS.EVENTS.DETAILS.WORKFLOWS.TOOLTIP.DELETE"
																				)}
																			>
																				<button
																					onClick={() => deleteWorkflow(item.id)}
																					className="button-like-anchor remove fa-fw"
																				>
																					{/* DELETE */}
																				</button>
																			</Tooltip>
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
																						)?.title ?? ""
																					}
																					options={
																						!!workflowDefinitions &&
																						workflowDefinitions.length > 0
																							? workflowDefinitions /*w.id as w.title for w in workflowDefinitions | orderBy: 'displayOrder':true*/
																							: []
																					}
																					type={"workflow"}
																					required={true}
																					handleChange={(element) => {
																						if (element) {
																							formik.setFieldValue("workflowDefinition", element.value)
																						}
																					}}
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
														<footer style={{ padding: "0 15px" }}>
															<div className="pull-left">
																<button
																	type="reset"
																	onClick={() => {
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

export default EventDetailsWorkflowTab;
