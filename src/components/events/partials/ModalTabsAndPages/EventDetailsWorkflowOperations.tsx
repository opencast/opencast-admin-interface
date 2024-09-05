import React, { useEffect } from "react";
import Notifications from "../../../shared/Notifications";
import { getModalWorkflowId, getWorkflowOperations } from "../../../../selectors/eventDetailsSelectors";
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";
import {
	fetchWorkflowOperationDetails,
	fetchWorkflowOperations,
	setModalWorkflowTabHierarchy
} from "../../../../slices/eventDetailsSlice";
import { useTranslation } from "react-i18next";
import { WorkflowTabHierarchy } from "../modals/EventDetails";

/**
 * This component manages the workflow operations for the workflows tab of the event details modal
 */
const EventDetailsWorkflowOperations = ({
	eventId,
}: {
	eventId: string,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const workflowId = useAppSelector(state => getModalWorkflowId(state));
	const operations = useAppSelector(state => getWorkflowOperations(state));

  const loadWorkflowOperations = async () => {
		// Fetching workflow operations from server
		dispatch(fetchWorkflowOperations({eventId, workflowId}));
	};

  useEffect(() => {
		// Fetch workflow operations initially
		loadWorkflowOperations().then();

		// Fetch workflow operations every 5 seconds
		let fetchWorkflowOperationsInterval = setInterval(loadWorkflowOperations, 5000);

		// Unmount interval
		return () => clearInterval(fetchWorkflowOperationsInterval);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const openSubTab = (tabType: WorkflowTabHierarchy, operationId: number | undefined = undefined) => {
		dispatch(removeNotificationWizardForm());
		dispatch(setModalWorkflowTabHierarchy(tabType));
		if (tabType === "workflow-operation-details") {
			dispatch(fetchWorkflowOperationDetails({eventId, workflowId, operationId})).then();
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
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventDetailsWorkflowOperations;
