import { connect } from "react-redux";
import React, { useEffect } from "react";
import Notifications from "../../../shared/Notifications";
import {
	getWorkflow,
	getWorkflowOperations,
	isFetchingWorkflowOperations,
} from "../../../../selectors/eventDetailsSelectors";
import { fetchWorkflowOperationDetails, fetchWorkflowOperations } from "../../../../thunks/eventDetailsThunks";
import { removeNotificationWizardForm } from "../../../../actions/notificationActions";
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
	fetchOperations,
// @ts-expect-error TS(7031): Binding element 'fetchOperationDetails' implicitly... Remove this comment to see the full error message
	fetchOperationDetails,
}) => {

  const loadWorkflowOperations = async () => {
		// Fetching workflow operations from server
		await fetchOperations(eventId, workflowId);
	};

  useEffect(() => {
		// Fetch workflow operations every 5 seconds
		let fetchWorkflowOperationsInterval = setInterval(loadWorkflowOperations, 5000);

		// Unmount interval
		return () => clearInterval(fetchWorkflowOperationsInterval);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
		<div className="modal-content">
			{/* Hierarchy navigation */}
			<EventDetailsTabHierarchyNavigation
				openSubTab={openSubTab}
				hierarchyDepth={1}
				translationKey0={"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.TITLE"}
				subTabArgument0={"workflow-details"}
				translationKey1={"EVENTS.EVENTS.DETAILS.WORKFLOW_OPERATIONS.TITLE"}
				subTabArgument1={"workflow-operations"}
			/>

			<div className="modal-body">
				{/* Notifications */}
				<Notifications context="not_corner" />

				{/* 'Workflow Operations' table */}
				<div className="full-col">
					<div className="obj tbl-container">
						<header>
							{
								t(
									"EVENTS.EVENTS.DETAILS.WORKFLOW_OPERATIONS.TITLE"
								) /* Workflow Operations */
							}
						</header>
						<div className="obj-container">
							<table className="main-tbl">
								{isFetching || (
									<>
										<thead>
											<tr>
												<th>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOW_OPERATIONS.TABLE_HEADERS.STATUS"
														) /* Status */
													}
												</th>
												<th>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOW_OPERATIONS.TABLE_HEADERS.TITLE"
														) /* Title */
													}
													<i />
												</th>
												<th>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOW_OPERATIONS.TABLE_HEADERS.DESCRIPTION"
														) /* Description */
													}
													<i />
												</th>
												<th className="medium" />
											</tr>
										</thead>
										<tbody>
											{/* workflow operation details */}
{/* @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type. */}
											{operations.entries.map((item, key) => (
												<tr key={key}>
													<td>{t(item.status)}</td>
													<td>{item.title}</td>
													<td>{item.description}</td>

													{/* link to 'Operation Details'  sub-Tab */}
													<td>
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
  fetchOperations: (eventId: string, workflowId: string) =>
    dispatch(fetchWorkflowOperations(eventId, workflowId)),
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	fetchOperationDetails: (eventId, workflowId, operationId) =>
		dispatch(fetchWorkflowOperationDetails(eventId, workflowId, operationId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EventDetailsWorkflowOperations);
