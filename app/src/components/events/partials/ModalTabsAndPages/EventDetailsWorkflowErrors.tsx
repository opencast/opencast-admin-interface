import { connect } from "react-redux";
import React from "react";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
import {
	getWorkflow,
	getWorkflowErrors,
	isFetchingWorkflowErrors,
} from "../../../../selectors/eventDetailsSelectors";
import { fetchWorkflowErrorDetails } from "../../../../thunks/eventDetailsThunks";
import { removeNotificationWizardForm } from "../../../../actions/notificationActions";
// @ts-expect-error TS(6142): Module './EventDetailsTabHierarchyNavigation' was ... Remove this comment to see the full error message
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";

/**
 * This component manages the workflow errors for the workflows tab of the event details modal
 */
const EventDetailsWorkflowErrors = ({
// @ts-expect-error TS(7031): Binding element 'eventId' implicitly has an 'any' ... Remove this comment to see the full error message
	eventId,
// @ts-expect-error TS(7031): Binding element 't' implicitly has an 'any' type.
	t,
// @ts-expect-error TS(7031): Binding element 'setHierarchy' implicitly has an '... Remove this comment to see the full error message
	setHierarchy,
// @ts-expect-error TS(7031): Binding element 'workflowId' implicitly has an 'an... Remove this comment to see the full error message
	workflowId,
// @ts-expect-error TS(7031): Binding element 'errors' implicitly has an 'any' t... Remove this comment to see the full error message
	errors,
// @ts-expect-error TS(7031): Binding element 'isFetching' implicitly has an 'an... Remove this comment to see the full error message
	isFetching,
// @ts-expect-error TS(7031): Binding element 'fetchErrorDetails' implicitly has... Remove this comment to see the full error message
	fetchErrorDetails,
}) => {
// @ts-expect-error TS(7006): Parameter 'severity' implicitly has an 'any' type.
	const severityColor = (severity) => {
		switch (severity.toUpperCase()) {
			case "FAILURE":
				return "red";
			case "INFO":
				return "green";
			case "WARNING":
				return "yellow";
			default:
				return "red";
		}
	};

// @ts-expect-error TS(7006): Parameter 'tabType' implicitly has an 'any' type.
	const openSubTab = (tabType, errorId = null) => {
		removeNotificationWizardForm();
		setHierarchy(tabType);
		if (tabType === "workflow-error-details") {
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
			fetchErrorDetails(eventId, workflowId, errorId).then((r) => {});
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
				translationKey1={"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.TITLE"}
				subTabArgument1={"errors-and-warnings"}
			/>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-body">
				{/* Notifications */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Notifications context="not_corner" />

				{/* 'Errors & Warnings' table */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="obj tbl-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<header>
							{
								t(
									"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.HEADER"
								) /* Errors & Warnings */
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
												<th className="small" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<th>
													{
														t(
															"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DATE"
														) /* Date */
													}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<i />
												</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<th>
													{
														t(
															"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.TITLE"
														) /* Errors & Warnings */
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
											{
												/* error details */
// @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
												errors.entries.map((item, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td>
															{!!item.severity && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<div
																	className={`circle ${severityColor(
																		item.severity
																	)}`}
																/>
															)}
														</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td>
															{t("dateFormats.dateTime.medium", {
																dateTime: new Date(item.timestamp),
															})}
														</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td>{item.title}</td>

														{/* link to 'Error Details'  sub-Tab */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<button
																className="button-like-anchor details-link"
																onClick={() =>
																	openSubTab("workflow-error-details", item.id)
																}
															>
																{
																	t(
																		"EVENTS.EVENTS.DETAILS.MEDIA.DETAILS"
																	) /*  Details */
																}
															</button>
														</td>
													</tr>
												))
											}
											{
												/* No errors message */
												errors.entries.length === 0 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td colSpan="4">
															{
																t(
																	"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.EMPTY"
																) /* No errors found. */
															}
														</td>
													</tr>
												)
											}
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
	errors: getWorkflowErrors(state),
	isFetching: isFetchingWorkflowErrors(state),
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
)(EventDetailsWorkflowErrors);
