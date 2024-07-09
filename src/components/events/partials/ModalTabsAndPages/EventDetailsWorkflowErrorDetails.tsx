import React from "react";
import Notifications from "../../../shared/Notifications";
import {
	getWorkflowErrorDetails,
	isFetchingWorkflowErrorDetails,
} from "../../../../selectors/eventDetailsSelectors";
import { error_detail_style } from "../../../../utils/eventDetailsUtils";
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";
import { renderValidDate } from "../../../../utils/dateUtils";
import { WorkflowTabHierarchy } from "../modals/EventDetails";
import { useTranslation } from "react-i18next";

/**
 * This component manages the workflow error details for the workflows tab of the event details modal
 */
const EventDetailsWorkflowErrorDetails = ({
	setHierarchy,
}: {
	setHierarchy: (subTabName: WorkflowTabHierarchy) => void,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const errorDetails = useAppSelector(state => getWorkflowErrorDetails(state));
	const isFetching = useAppSelector(state => isFetchingWorkflowErrorDetails(state));

	const openSubTab = (tabType: WorkflowTabHierarchy) => {
		dispatch(removeNotificationWizardForm());
		setHierarchy(tabType);
	};

	return (
		<div className="modal-content">
			{/* Hierarchy navigation */}
			<EventDetailsTabHierarchyNavigation
				openSubTab={openSubTab}
				hierarchyDepth={2}
				translationKey0={"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.TITLE"}
				subTabArgument0={"workflow-details"}
				translationKey1={"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.TITLE"}
				subTabArgument1={"errors-and-warnings"}
				translationKey2={
					"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.HEADER"
				}
				subTabArgument2={"workflow-error-details"}
			/>

			<div className="modal-body">
				{/* Notifications */}
				<Notifications context="not_corner" />

				{/* 'Error Details' table */}
				<div className="full-col">
					<div className="obj tbl-details">
						<header>
							{
								t(
									"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.HEADER"
								) /* Error Details */
							}
						</header>
						<div className="obj-container">
							<table className="main-tbl">
								{isFetching || (
									<tbody>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.SEVERITY"
													) /* Severity */
												}
											</td>
											<td>{errorDetails.severity}</td>
										</tr>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.TITLE"
													) /* Title */
												}
											</td>
											<td>{errorDetails.title}</td>
										</tr>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.DESCRIPTION"
													) /* Description */
												}
											</td>
											<td>{errorDetails.description}</td>
										</tr>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.JOB_ID"
													) /* Job ID */
												}
											</td>
											<td>{errorDetails.job_id}</td>
										</tr>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.DATE"
													) /* Date */
												}
											</td>
											<td>
												{t("dateFormats.dateTime.medium", {
													dateTime: renderValidDate(errorDetails.timestamp),
												})}
											</td>
										</tr>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.HOST"
													) /* Host */
												}
											</td>
											<td>{errorDetails.processing_host}</td>
										</tr>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.TYPE"
													) /* Type */
												}
											</td>
											<td>{errorDetails.service_type}</td>
										</tr>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.TECHNICAL_DETAILS"
													) /* Technical Details */
												}
											</td>

											{/* list of technical error details */}
											<td>
												{errorDetails.details.map((item, key) => (
													<div key={key}>
														<h3>{item.name}</h3>
														<div style={error_detail_style}>
															<pre>{item.value}</pre>
														</div>
													</div>
												))}
											</td>
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

export default EventDetailsWorkflowErrorDetails;
