import { connect } from "react-redux";
import React from "react";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
import {
	getWorkflow,
	getWorkflowOperationDetails,
	getWorkflowOperations,
	isFetchingWorkflowOperationDetails,
} from "../../../../selectors/eventDetailsSelectors";
import { removeNotificationWizardForm } from "../../../../actions/notificationActions";
// @ts-expect-error TS(6142): Module './EventDetailsTabHierarchyNavigation' was ... Remove this comment to see the full error message
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";

/**
 * This component manages the workflow operation details for the workflows tab of the event details modal
 */
const EventDetailsWorkflowOperationDetails = ({
// @ts-expect-error TS(7031): Binding element 'eventId' implicitly has an 'any' ... Remove this comment to see the full error message
	eventId,
// @ts-expect-error TS(7031): Binding element 't' implicitly has an 'any' type.
	t,
// @ts-expect-error TS(7031): Binding element 'setHierarchy' implicitly has an '... Remove this comment to see the full error message
	setHierarchy,
// @ts-expect-error TS(7031): Binding element 'operationDetails' implicitly has ... Remove this comment to see the full error message
	operationDetails,
// @ts-expect-error TS(7031): Binding element 'isFetching' implicitly has an 'an... Remove this comment to see the full error message
	isFetching,
}) => {
// @ts-expect-error TS(7006): Parameter 'tabType' implicitly has an 'any' type.
	const openSubTab = (tabType) => {
		removeNotificationWizardForm();
		setHierarchy(tabType);
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="modal-content">
			{/* Hierarchy navigation */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<EventDetailsTabHierarchyNavigation
				openSubTab={openSubTab}
				hierarchyDepth={2}
				translationKey0={"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.TITLE"}
				subTabArgument0={"workflow-details"}
				translationKey1={"EVENTS.EVENTS.DETAILS.WORKFLOW_OPERATIONS.TITLE"}
				subTabArgument1={"workflow-operations"}
				translationKey2={"EVENTS.EVENTS.DETAILS.OPERATION_DETAILS.TITLE"}
				subTabArgument2={"workflow-operation-details"}
			/>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-body">
				{/* Notifications */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Notifications context="not_corner" />

				{/* 'Operation Details' table */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="obj tbl-details">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<header>
							{
								t(
									"EVENTS.EVENTS.DETAILS.OPERATION_DETAILS.TITLE"
								) /* Operation Details */
							}
						</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<table className="main-tbl">
								{isFetching || (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<tbody>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.OPERATION_DETAILS.TABLE_HEADERS.TITLE"
													) /* Title */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{operationDetails.name}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.OPERATION_DETAILS.TABLE_HEADERS.DESCRIPTION"
													) /* Description */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{operationDetails.description}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.OPERATION_DETAILS.TABLE_HEADERS.STATE"
													) /* State */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{t(operationDetails.state)}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.OPERATION_DETAILS.TABLE_HEADERS.EXECUTION_HOST"
													) /* Execution Host */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{operationDetails.execution_host}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.OPERATION_DETAILS.TABLE_HEADERS.JOB"
													) /* Job */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{operationDetails.job}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.OPERATION_DETAILS.TABLE_HEADERS.TIME_IN_QUEUE"
													) /* Time in Queue */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{operationDetails.time_in_queue}ms</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.OPERATION_DETAILS.TABLE_HEADERS.STARTED"
													) /* Started */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{t("dateFormats.dateTime.medium", {
													dateTime: new Date(operationDetails.started),
												})}
											</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.OPERATION_DETAILS.TABLE_HEADERS.FINISHED"
													) /* Finished */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{t("dateFormats.dateTime.medium", {
													dateTime: new Date(operationDetails.completed),
												})}
											</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.OPERATION_DETAILS.TABLE_HEADERS.RETRY_STRATEGY"
													) /* Retry Strategy */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{operationDetails.retry_strategy}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.OPERATION_DETAILS.TABLE_HEADERS.FAILED_ATTEMPTS"
													) /* Failed Attempts */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{operationDetails.failed_attempts}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.OPERATION_DETAILS.TABLE_HEADERS.MAX_ATTEMPTS"
													) /* Max */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{operationDetails.max_attempts}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.OPERATION_DETAILS.TABLE_HEADERS.EXCEPTION_HANDLER_WORKFLOW"
													) /* Exception Handler Workflow */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{operationDetails.exception_handler_workflow}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.OPERATION_DETAILS.TABLE_HEADERS.FAIL_ON_ERROR"
													) /* Fail on Error */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{operationDetails.fail_on_error}</td>
										</tr>
									</tbody>
								)}
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	workflowId: getWorkflow(state).wiid,
	operations: getWorkflowOperations(state),
	isFetching: isFetchingWorkflowOperationDetails(state),
	operationDetails: getWorkflowOperationDetails(state),
});

export default connect(mapStateToProps)(EventDetailsWorkflowOperationDetails);
