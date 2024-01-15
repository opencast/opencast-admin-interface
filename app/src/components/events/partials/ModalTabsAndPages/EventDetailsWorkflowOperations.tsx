import React from "react";
import Notifications from "../../../shared/Notifications";
import {
	getWorkflow,
	getWorkflowOperations,
	isFetchingWorkflowOperations,
} from "../../../../selectors/eventDetailsSelectors";
import { removeNotificationWizardForm } from "../../../../actions/notificationActions";
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { fetchWorkflowOperationDetails } from "../../../../slices/eventDetailsSlice";

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
}) => {
	const dispatch = useAppDispatch();

	const workflow = useAppSelector(state => getWorkflow(state));
	const operations = useAppSelector(state => getWorkflowOperations(state));
	const isFetching = useAppSelector(state => isFetchingWorkflowOperations(state));

// @ts-expect-error TS(7006): Parameter 'tabType' implicitly has an 'any' type.
	const openSubTab = (tabType, operationId: number | null = null) => {
		removeNotificationWizardForm();
		setHierarchy(tabType);
		if (tabType === "workflow-operation-details") {
			dispatch(fetchWorkflowOperationDetails({eventId, workflowId: workflow.wiid, operationId})).then();
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

export default EventDetailsWorkflowOperations;
