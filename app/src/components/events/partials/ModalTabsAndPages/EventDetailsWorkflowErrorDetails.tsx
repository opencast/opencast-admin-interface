import { connect } from "react-redux";
import React from "react";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
import {
	getWorkflowErrorDetails,
	isFetchingWorkflowErrorDetails,
} from "../../../../selectors/eventDetailsSelectors";
import { fetchWorkflowErrorDetails } from "../../../../thunks/eventDetailsThunks";
import { error_detail_style } from "../../../../utils/eventDetailsUtils";
import { removeNotificationWizardForm } from "../../../../actions/notificationActions";
// @ts-expect-error TS(6142): Module './EventDetailsTabHierarchyNavigation' was ... Remove this comment to see the full error message
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";

/**
 * This component manages the workflow error details for the workflows tab of the event details modal
 */
const EventDetailsWorkflowErrorDetails = ({
    eventId,
    t,
    setHierarchy,
    errorDetails,
    isFetching
}: any) => {
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
				translationKey1={"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.TITLE"}
				subTabArgument1={"errors-and-warnings"}
				translationKey2={
					"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.HEADER"
				}
				subTabArgument2={"workflow-error-details"}
			/>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-body">
				{/* Notifications */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Notifications context="not_corner" />

				{/* 'Error Details' table */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="obj tbl-details">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<header>
							{
								t(
									"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.HEADER"
								) /* Error Details */
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
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.SEVERITY"
													) /* Severity */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{errorDetails.severity}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.TITLE"
													) /* Title */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{errorDetails.title}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.DESCRIPTION"
													) /* Description */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{errorDetails.description}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.JOB_ID"
													) /* Job ID */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{errorDetails.job_id}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.DATE"
													) /* Date */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{t("dateFormats.dateTime.medium", {
													dateTime: new Date(errorDetails.timestamp),
												})}
											</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.HOST"
													) /* Host */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{errorDetails.processing_host}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.TYPE"
													) /* Type */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{errorDetails.service_type}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DETAILS.TECHNICAL_DETAILS"
													) /* Technical Details */
												}
											</td>

											{/* list of technical error details */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
// @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
												{errorDetails.details.map((item, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<div key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<h3>{item.name}</h3>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<div style={error_detail_style}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	errorDetails: getWorkflowErrorDetails(state),
	isFetching: isFetchingWorkflowErrorDetails(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	fetchErrorDetails: (eventId, workflowId, operationId) =>
		dispatch(fetchWorkflowErrorDetails(eventId, workflowId, operationId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EventDetailsWorkflowErrorDetails);
