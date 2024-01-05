import React from "react";
import { connect } from "react-redux";
import Notifications from "../../../shared/Notifications";
import {
	getWorkflow,
	isFetchingWorkflowDetails,
} from "../../../../selectors/eventDetailsSelectors";
import {
	fetchWorkflowErrors,
	fetchWorkflowOperations,
} from "../../../../thunks/eventDetailsThunks";
import { formatDuration } from "../../../../utils/eventDetailsUtils";
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
import { hasAccess } from "../../../../utils/utils";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { useAppDispatch } from "../../../../store";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";

/**
 * This component manages the workflow details for the workflows tab of the event details modal
 */
const EventDetailsWorkflowDetails = ({
// @ts-expect-error TS(7031): Binding element 'eventId' implicitly has an 'any' ... Remove this comment to see the full error message
	eventId,
// @ts-expect-error TS(7031): Binding element 't' implicitly has an 'any' type.
	t,
// @ts-expect-error TS(7031): Binding element 'setHierarchy' implicitly has an '... Remove this comment to see the full error message
	setHierarchy,
// @ts-expect-error TS(7031): Binding element 'workflowData' implicitly has an '... Remove this comment to see the full error message
	workflowData,
// @ts-expect-error TS(7031): Binding element 'isFetching' implicitly has an 'an... Remove this comment to see the full error message
	isFetching,
// @ts-expect-error TS(7031): Binding element 'fetchOperations' implicitly has a... Remove this comment to see the full error message
	fetchOperations,
// @ts-expect-error TS(7031): Binding element 'fetchErrors' implicitly has an 'a... Remove this comment to see the full error message
	fetchErrors,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
}) => {
	const dispatch = useAppDispatch();

// @ts-expect-error TS(7006): Parameter 'tabType' implicitly has an 'any' type.
	const openSubTab = (tabType) => {
		dispatch(removeNotificationWizardForm());
		setHierarchy(tabType);
		if (tabType === "workflow-operations") {
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
			fetchOperations(eventId, workflowData.wiid).then((r) => {});
		} else if (tabType === "errors-and-warnings") {
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
			fetchErrors(eventId, workflowData.wiid).then((r) => {});
		}
	};

	return (
		<div className="modal-content">
			{/* Hierarchy navigation */}
			<EventDetailsTabHierarchyNavigation
				openSubTab={openSubTab}
				hierarchyDepth={0}
				translationKey0={"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.TITLE"}
				subTabArgument0={"workflow-details"}
			/>

			<div className="modal-body">
				<div className="full-col">
					{/* Notifications */}
					<Notifications context="not_corner" />

					{/* the contained view is only displayed, if the data has been fetched */}
					{isFetching || (
						<>
							{/* 'Workflow Details' table */}
							<div className="obj tbl-details">
								<header>
									{
										t(
											"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.TITLE"
										) /* Workflow Details */
									}
								</header>
								<div className="obj-container">
									<table className="main-tbl vertical-headers">
										<tbody>
											<tr>
												<td>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOWS.TITLE"
														) /* Title */
													}
												</td>
												<td>{workflowData.title}</td>
											</tr>
											{workflowData.description && (
												<tr>
													<td>
														{
															t(
																"EVENTS.EVENTS.DETAILS.WORKFLOWS.DESCRIPTION"
															) /* Description */
														}
													</td>
													<td>{workflowData.description}</td>
												</tr>
											)}
											<tr>
												<td>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOWS.SUBMITTER"
														) /* Submitter*/
													}
												</td>
												<td>
													{workflowData.creator.name + " "}
													{workflowData.creator.email && (
														<span>
															{"<" + workflowData.creator.email + ">"}
														</span>
													)}
												</td>
											</tr>
											<tr>
												<td>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOWS.SUBMITTED"
														) /* Submitted */
													}
												</td>
												<td>
													{t("dateFormats.dateTime.medium", {
														dateTime: new Date(workflowData.submittedAt),
													})}
												</td>
											</tr>
											<tr>
												<td>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOWS.STATUS"
														) /* Status */
													}
												</td>
												<td>{t(workflowData.status)}</td>
											</tr>
											{workflowData.status !==
												"EVENTS.EVENTS.DETAILS.WORKFLOWS.OPERATION_STATUS.RUNNING" && (
												<tr>
													<td>
														{
															t(
																"EVENTS.EVENTS.DETAILS.WORKFLOWS.EXECUTION_TIME"
															) /* Execution time */
														}
													</td>
													<td>{formatDuration(workflowData.executionTime)}</td>
												</tr>
											)}
											{hasAccess("ROLE_ADMIN", user) && (
												<>
													<tr>
														<td>
															{t("EVENTS.EVENTS.DETAILS.WORKFLOWS.ID") /* ID */}
														</td>
														<td>{workflowData.wiid}</td>
													</tr>
													<tr>
														<td>
															{
																t(
																	"EVENTS.EVENTS.DETAILS.WORKFLOWS.WDID"
																) /* Workflow definition */
															}
														</td>
														<td>{workflowData.wdid}</td>
													</tr>
												</>
											)}
										</tbody>
									</table>
								</div>
							</div>

							{/* 'Workflow configuration' table */}
							{hasAccess("ROLE_ADMIN", user) && (
								<div className="obj tbl-details">
									<header>
										{
											t(
												"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.CONFIGURATION"
											) /* Workflow configuration */
										}
									</header>
									<div className="obj-container">
										<table className="main-tbl">
											<tbody>
												{Object.entries(workflowData.configuration).map(
													([confKey, confValue], key) => (
														<tr key={key}>
															<td>{confKey}</td>
															<td>{confValue}</td>
														</tr>
													)
												)}
											</tbody>
										</table>
									</div>
								</div>
							)}

							{/* 'More Information' table */}
							<div className="obj tbl-container more-info-actions">
								<header>
									{
										t(
											"EVENTS.EVENTS.DETAILS.WORKFLOWS.MORE_INFO"
										) /* More Information */
									}
								</header>

								{/* links to 'Operations' or 'Errors & Warnings' sub-Tabs */}
								<div className="obj-container">
									<ul>
										<li>
											<span>
												{
													t(
														"EVENTS.EVENTS.DETAILS.WORKFLOW_OPERATIONS.DETAILS_LINK"
													) /* Operations */
												}
											</span>
											<button
												className="button-like-anchor details-link"
												onClick={() => openSubTab("workflow-operations")}
											>
												{
													t(
														"EVENTS.EVENTS.DETAILS.WORKFLOWS.DETAILS"
													) /* Details */
												}
											</button>
										</li>
										<li>
											<span>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.TITLE"
													) /* Errors & Warnings */
												}
											</span>
											<button
												className="button-like-anchor details-link"
												onClick={() => openSubTab("errors-and-warnings")}
											>
												{
													t(
														"EVENTS.EVENTS.DETAILS.WORKFLOWS.DETAILS"
													) /* Details */
												}
											</button>
										</li>
									</ul>
								</div>
							</div>
						</>
					)}

					{/* empty view for displaying, while the data is being fetched */}
					{isFetching && (
						<>
							{/* 'Workflow Details' table */}
							<div className="obj tbl-details">
								<header>
									{
										t(
											"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.TITLE"
										) /* Workflow Details */
									}
								</header>
								<div className="obj-container">
									<table className="main-tbl vertical-headers">
										<tbody>
											<tr />
										</tbody>
									</table>
								</div>
							</div>

							{/* 'Workflow configuration' table */}
							{hasAccess("ROLE_ADMIN", user) && (
								<div className="obj tbl-details">
									<header>
										{
											t(
												"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.CONFIGURATION"
											) /* Workflow configuration */
										}
									</header>
									<div className="obj-container">
										<table className="main-tbl">
											<tbody>
												<tr />
											</tbody>
										</table>
									</div>
								</div>
							)}

							{/* 'More Information' table */}
							<div className="obj tbl-container more-info-actions">
								<header>
									{
										t(
											"EVENTS.EVENTS.DETAILS.WORKFLOWS.MORE_INFO"
										) /* More Information */
									}
								</header>
								<div className="obj-container">
									<ul>
										<li>
											<span>
												{
													t(
														"EVENTS.EVENTS.DETAILS.WORKFLOW_OPERATIONS.DETAILS_LINK"
													) /* Operations */
												}
											</span>
											<button className="button-like-anchor details-link">
												{
													t(
														"EVENTS.EVENTS.DETAILS.WORKFLOWS.DETAILS"
													) /* Details */
												}
											</button>
										</li>
										<li>
											<span>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.TITLE"
													) /* Errors & Warnings */
												}
											</span>
											<button className="button-like-anchor details-link">
												{
													t(
														"EVENTS.EVENTS.DETAILS.WORKFLOWS.DETAILS"
													) /* Details */
												}
											</button>
										</li>
									</ul>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	workflowData: getWorkflow(state),
	isFetching: isFetchingWorkflowDetails(state),
	user: getUserInformation(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	fetchOperations: (eventId, workflowId) =>
		dispatch(fetchWorkflowOperations(eventId, workflowId)),
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	fetchErrors: (eventId, workflowId) =>
		dispatch(fetchWorkflowErrors(eventId, workflowId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EventDetailsWorkflowDetails);
