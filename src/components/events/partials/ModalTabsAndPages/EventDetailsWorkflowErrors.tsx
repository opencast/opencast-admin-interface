import { useEffect } from "react";
import Notifications from "../../../shared/Notifications";
import {
	getModalWorkflowId,
	getWorkflow,
	getWorkflowErrors,
	isFetchingWorkflowErrors,
} from "../../../../selectors/eventDetailsSelectors";
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";
import {
	fetchWorkflowErrorDetails,
	fetchWorkflowErrors,
	setModalWorkflowTabHierarchy,
} from "../../../../slices/eventDetailsSlice";
import { renderValidDate } from "../../../../utils/dateUtils";
import { WorkflowTabHierarchy } from "../modals/EventDetails";
import { useTranslation } from "react-i18next";
import ButtonLikeAnchor from "../../../shared/ButtonLikeAnchor";
import ModalContentTable from "../../../shared/modals/ModalContentTable";

/**
 * This component manages the workflow errors for the workflows tab of the event details modal
 */
const EventDetailsWorkflowErrors = ({
	eventId,
}: {
	eventId: string,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const workflowId = useAppSelector(state => getModalWorkflowId(state));
	const workflow = useAppSelector(state => getWorkflow(state));
	const errors = useAppSelector(state => getWorkflowErrors(state));
	const isFetching = useAppSelector(state => isFetchingWorkflowErrors(state));

	const severityColor = (severity: string) => {
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

	useEffect(() => {
		dispatch(fetchWorkflowErrors({ eventId, workflowId })).then();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const openSubTab = (tabType: WorkflowTabHierarchy, errorId: number | undefined = undefined) => {
		dispatch(removeNotificationWizardForm());
		dispatch(setModalWorkflowTabHierarchy(tabType));
		if (tabType === "workflow-error-details" && "wiid" in workflow) {
			dispatch(fetchWorkflowErrorDetails({ eventId, workflowId: workflow.wiid, errorId })).then();
		}
	};

	return (
		<ModalContentTable
			modalContentChildren={
				/* Hierarchy navigation */
				<EventDetailsTabHierarchyNavigation
					openSubTab={openSubTab}
					hierarchyDepth={1}
					translationKey0={"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.TITLE"}
					subTabArgument0={"workflow-details"}
					translationKey1={"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.TITLE"}
					subTabArgument1={"errors-and-warnings"}
				/>
			}
			modalBodyChildren={<Notifications context="not_corner" />}
		>
		{/* 'Errors & Warnings' table */}
			<div className="obj tbl-container">
				<header>
					{
						t(
							"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.HEADER",
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
													"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.DATE",
												) /* Date */
											}
											<i />
										</th>
										<th>
											{
												t(
													"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.TITLE",
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
										errors.entries.map((item, key) => (
											<tr key={key}>
												<td>
													{!!item.severity && (
														<div
															className={`circle ${severityColor(
																item.severity,
															)}`}
														/>
													)}
												</td>
												<td>
													{t("dateFormats.dateTime.medium", {
														dateTime: renderValidDate(item.timestamp),
													})}
												</td>
												<td>{item.title}</td>

												{/* link to 'Error Details'  sub-Tab */}
												<td>
													<ButtonLikeAnchor
														extraClassName="details-link"
														onClick={() =>
															openSubTab("workflow-error-details", item.id)
														}
													>
														{
															t(
																"EVENTS.EVENTS.DETAILS.MEDIA.DETAILS",
															) /*  Details */
														}
													</ButtonLikeAnchor>
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
															"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.EMPTY",
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
		</ModalContentTable>
	);
};

export default EventDetailsWorkflowErrors;
