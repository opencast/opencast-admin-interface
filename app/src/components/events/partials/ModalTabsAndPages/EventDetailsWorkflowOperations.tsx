import { connect } from "react-redux";
import React from "react";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
import {
	getWorkflow,
	getWorkflowOperations,
	isFetchingWorkflowOperations,
} from "../../../../selectors/eventDetailsSelectors";
import { fetchWorkflowOperationDetails } from "../../../../thunks/eventDetailsThunks";
import { removeNotificationWizardForm } from "../../../../actions/notificationActions";
// @ts-expect-error TS(6142): Module './EventDetailsTabHierarchyNavigation' was ... Remove this comment to see the full error message
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";

/**
 * This component manages the workflow operations for the workflows tab of the event details modal
 */
const EventDetailsWorkflowOperations = ({
// @ts-expect-error TS(7031): Binding element 'eventId' implicitly has an 'any' ... Remove this comment to see the full error message
	eventId,
// @ts-expect-error TS(7031): Binding element 't' implicitly has an 'any' type.
	t,
// @ts-expect-error TS(7031): Binding element 'setHierarchy' implicitly has an '... Remove this comment to see the full error message
	setHierarchy,
// @ts-expect-error TS(7031): Binding element 'workflowId' implicitly has an 'an... Remove this comment to see the full error message
	workflowId,
// @ts-expect-error TS(7031): Binding element 'operations' implicitly has an 'an... Remove this comment to see the full error message
	operations,
// @ts-expect-error TS(7031): Binding element 'isFetching' implicitly has an 'an... Remove this comment to see the full error message
	isFetching,
// @ts-expect-error TS(7031): Binding element 'fetchOperationDetails' implicitly... Remove this comment to see the full error message
	fetchOperationDetails,
}) => {
// @ts-expect-error TS(7006): Parameter 'tabType' implicitly has an 'any' type.
	const openSubTab = (tabType, operationId = null) => {
		removeNotificationWizardForm();
		setHierarchy(tabType);
		if (tabType === "workflow-operation-details") {
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
			fetchOperationDetails(eventId, workflowId, operationId).then((r) => {});
		}
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="modal-content">
			{/* Hierarchy navigation */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<EventDetailsTabHierarchyNavigation
				openSubTab={openSubTab}
				hierarchyDepth={1}
				translationKey0={"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.TITLE"}
				subTabArgument0={"workflow-details"}
				translationKey1={"EVENTS.EVENTS.DETAILS.WORKFLOW_OPERATIONS.TITLE"}
				subTabArgument1={"workflow-operations"}
			/>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-body">
				{/* Notifications */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Notifications context="not_corner" />

				{/* 'Workflow Operations' table */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="obj tbl-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<header>
							{
								t(
									"EVENTS.EVENTS.DETAILS.WORKFLOW_OPERATIONS.TITLE"
								) /* Workflow Operations */
							}
						</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<table className="main-tbl">
								{isFetching || (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<th>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOW_OPERATIONS.TABLE_HEADERS.STATUS"
														) /* Status */
													}
												</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<th>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOW_OPERATIONS.TABLE_HEADERS.TITLE"
														) /* Title */
													}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<i />
												</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<th>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOW_OPERATIONS.TABLE_HEADERS.DESCRIPTION"
														) /* Description */
													}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<i />
												</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<th className="medium" />
											</tr>
										</thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tbody>
											{/* workflow operation details */}
// @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
											{operations.entries.map((item, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>{t(item.status)}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>{item.title}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>{item.description}</td>

													{/* link to 'Operation Details'  sub-Tab */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<button
															className="button-like-anchor details-link"
															onClick={() =>
																openSubTab("workflow-operation-details", key)
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
									</>
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
	isFetching: isFetchingWorkflowOperations(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	fetchOperationDetails: (eventId, workflowId, operationId) =>
		dispatch(fetchWorkflowOperationDetails(eventId, workflowId, operationId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EventDetailsWorkflowOperations);
