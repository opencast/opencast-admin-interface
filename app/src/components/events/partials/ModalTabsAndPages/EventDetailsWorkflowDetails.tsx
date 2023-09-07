import React from "react";
import { connect } from "react-redux";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
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
import { removeNotificationWizardForm } from "../../../../actions/notificationActions";
// @ts-expect-error TS(6142): Module './EventDetailsTabHierarchyNavigation' was ... Remove this comment to see the full error message
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
import { hasAccess } from "../../../../utils/utils";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";

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
// @ts-expect-error TS(7006): Parameter 'tabType' implicitly has an 'any' type.
	const openSubTab = (tabType) => {
		removeNotificationWizardForm();
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="modal-content">
			{/* Hierarchy navigation */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<EventDetailsTabHierarchyNavigation
				openSubTab={openSubTab}
				hierarchyDepth={0}
				translationKey0={"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.TITLE"}
				subTabArgument0={"workflow-details"}
			/>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="full-col">
					{/* Notifications */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<Notifications context="not_corner" />

					{/* the contained view is only displayed, if the data has been fetched */}
					{isFetching || (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<>
							{/* 'Workflow Details' table */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj tbl-details">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<header>
									{
										t(
											"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.TITLE"
										) /* Workflow Details */
									}
								</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<table className="main-tbl vertical-headers">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tbody>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOWS.TITLE"
														) /* Title */
													}
												</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>{workflowData.title}</td>
											</tr>
											{workflowData.description && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>
														{
															t(
																"EVENTS.EVENTS.DETAILS.WORKFLOWS.DESCRIPTION"
															) /* Description */
														}
													</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>{workflowData.description}</td>
												</tr>
											)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOWS.SUBMITTER"
														) /* Submitter*/
													}
												</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{workflowData.creator.name + " "}
													{workflowData.creator.email && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<span>
															{"<" + workflowData.creator.email + ">"}
														</span>
													)}
												</td>
											</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOWS.SUBMITTED"
														) /* Submitted */
													}
												</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{t("dateFormats.dateTime.medium", {
														dateTime: new Date(workflowData.submittedAt),
													})}
												</td>
											</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOWS.STATUS"
														) /* Status */
													}
												</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>{t(workflowData.status)}</td>
											</tr>
											{workflowData.status !==
												"EVENTS.EVENTS.DETAILS.WORKFLOWS.OPERATION_STATUS.RUNNING" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>
														{
															t(
																"EVENTS.EVENTS.DETAILS.WORKFLOWS.EXECUTION_TIME"
															) /* Execution time */
														}
													</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>{formatDuration(workflowData.executionTime)}</td>
												</tr>
											)}
											{hasAccess("ROLE_ADMIN", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td>
															{t("EVENTS.EVENTS.DETAILS.WORKFLOWS.ID") /* ID */}
														</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td>{workflowData.wiid}</td>
													</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td>
															{
																t(
																	"EVENTS.EVENTS.DETAILS.WORKFLOWS.WDID"
																) /* Workflow definition */
															}
														</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="obj tbl-details">
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
										<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tbody>
// @ts-expect-error TS(2550): Property 'entries' does not exist on type 'ObjectC... Remove this comment to see the full error message
												{Object.entries(workflowData.configuration).map(
// @ts-expect-error TS(7031): Binding element 'confKey' implicitly has an 'any' ... Remove this comment to see the full error message
													([confKey, confValue], key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<td>{confKey}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj tbl-container more-info-actions">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<header>
									{
										t(
											"EVENTS.EVENTS.DETAILS.WORKFLOWS.MORE_INFO"
										) /* More Information */
									}
								</header>

								{/* links to 'Operations' or 'Errors & Warnings' sub-Tabs */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<ul>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<span>
												{
													t(
														"EVENTS.EVENTS.DETAILS.WORKFLOW_OPERATIONS.DETAILS_LINK"
													) /* Operations */
												}
											</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<span>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.TITLE"
													) /* Errors & Warnings */
												}
											</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<>
							{/* 'Workflow Details' table */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj tbl-details">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<header>
									{
										t(
											"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.TITLE"
										) /* Workflow Details */
									}
								</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<table className="main-tbl vertical-headers">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tbody>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr />
										</tbody>
									</table>
								</div>
							</div>

							{/* 'Workflow configuration' table */}
							{hasAccess("ROLE_ADMIN", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="obj tbl-details">
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
										<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tbody>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<tr />
											</tbody>
										</table>
									</div>
								</div>
							)}

							{/* 'More Information' table */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj tbl-container more-info-actions">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<header>
									{
										t(
											"EVENTS.EVENTS.DETAILS.WORKFLOWS.MORE_INFO"
										) /* More Information */
									}
								</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<ul>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<span>
												{
													t(
														"EVENTS.EVENTS.DETAILS.WORKFLOW_OPERATIONS.DETAILS_LINK"
													) /* Operations */
												}
											</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<button className="button-like-anchor details-link">
												{
													t(
														"EVENTS.EVENTS.DETAILS.WORKFLOWS.DETAILS"
													) /* Details */
												}
											</button>
										</li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<span>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.TITLE"
													) /* Errors & Warnings */
												}
											</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
