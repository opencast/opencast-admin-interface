import { connect } from "react-redux";
import React from "react";
import Notifications from "../../../shared/Notifications";
import {
	getWorkflow,
	getWorkflowErrors,
	isFetchingWorkflowErrors,
} from "../../../../selectors/eventDetailsSelectors";
import { fetchWorkflowErrorDetails } from "../../../../thunks/eventDetailsThunks";
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
import { useAppDispatch } from "../../../../store";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";

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
	const dispatch = useAppDispatch();

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
		dispatch(removeNotificationWizardForm());
		setHierarchy(tabType);
		if (tabType === "workflow-error-details") {
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
			fetchErrorDetails(eventId, workflowId, errorId).then((r) => {});
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
				translationKey1={"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.TITLE"}
				subTabArgument1={"errors-and-warnings"}
			/>

			<div className="modal-body">
				{/* Notifications */}
				<Notifications context="not_corner" />

				{/* 'Errors & Warnings' table */}
				<div className="full-col">
					<div className="obj tbl-container">
						<header>
							{
								t(
									"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.HEADER"
								) /* Errors & Warnings */
							}
						</header>

						<div className="obj-container">
							<table className="main-tbl">
								{isFetching || (
									<>
										<thead>
											<tr>
												<th className="small" />
												<th>
													{
														t(
															"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DATE"
														) /* Date */
													}
													<i />
												</th>
												<th>
													{
														t(
															"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.TITLE"
														) /* Errors & Warnings */
													}
													<i />
												</th>
												<th className="medium" />
											</tr>
										</thead>
										<tbody>
											{
												/* error details */
// @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
												errors.entries.map((item, key) => (
													<tr key={key}>
														<td>
															{!!item.severity && (
																<div
																	className={`circle ${severityColor(
																		item.severity
																	)}`}
																/>
															)}
														</td>
														<td>
															{t("dateFormats.dateTime.medium", {
																dateTime: new Date(item.timestamp),
															})}
														</td>
														<td>{item.title}</td>

														{/* link to 'Error Details'  sub-Tab */}
														<td>
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
													<tr>
														<td colSpan={4}>
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
