import { useEffect } from "react";
import Notifications from "../../../shared/Notifications";
import {
	getModalWorkflowId,
	getWorkflow,
	isFetchingWorkflowDetails,
} from "../../../../selectors/eventDetailsSelectors";
import { formatDuration } from "../../../../utils/eventDetailsUtils";
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
	fetchWorkflowDetails,
	setModalWorkflowTabHierarchy,
} from "../../../../slices/eventDetailsSlice";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";
import { renderValidDate } from "../../../../utils/dateUtils";
import { WorkflowTabHierarchy } from "../modals/EventDetails";
import { useTranslation } from "react-i18next";
import ButtonLikeAnchor from "../../../shared/ButtonLikeAnchor";
import { ParseKeys } from "i18next";
import ModalContentTable from "../../../shared/modals/ModalContentTable";

/**
 * This component manages the workflow details for the workflows tab of the event details modal
 */
const EventDetailsWorkflowDetails = ({
	eventId,
}: {
	eventId: string,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const user = useAppSelector(state => getUserInformation(state));
	const workflowId = useAppSelector(state => getModalWorkflowId(state));
	const workflowData = useAppSelector(state => getWorkflow(state));
	const isFetching = useAppSelector(state => isFetchingWorkflowDetails(state));

	useEffect(() => {
		dispatch(fetchWorkflowDetails({ eventId, workflowId }));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const openSubTab = (tabType: WorkflowTabHierarchy) => {
		dispatch(removeNotificationWizardForm());
		dispatch(setModalWorkflowTabHierarchy(tabType));
	};

	// Type narrowing. If type is wrong this component breaks.
	if (!("wiid" in workflowData)) {
		return <></>;
	}

	return (
		<ModalContentTable
			modalContentChildren={
				/* Hierarchy navigation */
			<EventDetailsTabHierarchyNavigation
				openSubTab={openSubTab}
				hierarchyDepth={0}
				translationKey0={"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.TITLE"}
				subTabArgument0={"workflow-details"}
			/>
			}
		>
					{/* Notifications */}
					<Notifications context="not_corner" />

					{/* the contained view is only displayed, if the data has been fetched */}
					{isFetching || (
						<>
							{/* 'Workflow Details' table */}
							<div className="obj tbl-details">
								<header>
									{
										t(
											"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.TITLE",
										) /* Workflow Details */
									}
								</header>
								<div className="obj-container">
									<table className="main-tbl vertical-headers">
										<tbody>
											<tr>
												<td>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOWS.TITLE",
														) /* Title */
													}
												</td>
												<td>{workflowData.title}</td>
											</tr>
											{workflowData.description && (
												<tr>
													<td>
														{
															t(
																"EVENTS.EVENTS.DETAILS.WORKFLOWS.DESCRIPTION",
															) /* Description */
														}
													</td>
													<td>{workflowData.description}</td>
												</tr>
											)}
											<tr>
												<td>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOWS.SUBMITTER",
														) /* Submitter*/
													}
												</td>
												<td>
													{ workflowData.creator }
												</td>
											</tr>
											<tr>
												<td>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOWS.SUBMITTED",
														) /* Submitted */
													}
												</td>
												<td>
													{t("dateFormats.dateTime.medium", {
														dateTime: renderValidDate(workflowData.submittedAt),
													})}
												</td>
											</tr>
											<tr>
												<td>
													{
														t(
															"EVENTS.EVENTS.DETAILS.WORKFLOWS.STATUS",
														) /* Status */
													}
												</td>
												<td>{t(workflowData.status as ParseKeys)}</td>
											</tr>
											{workflowData.status !==
												"EVENTS.EVENTS.DETAILS.WORKFLOWS.OPERATION_STATUS.RUNNING" && (
												<tr>
													<td>
														{
															t(
																"EVENTS.EVENTS.DETAILS.WORKFLOWS.EXECUTION_TIME",
															) /* Execution time */
														}
													</td>
													<td>{formatDuration(workflowData.executionTime)}</td>
												</tr>
											)}
											{user.isAdmin && (
												<>
													<tr>
														<td>
															{t("EVENTS.EVENTS.DETAILS.WORKFLOWS.ID") /* ID */}
														</td>
														<td>{workflowData.wiid}</td>
													</tr>
													<tr>
														<td>
															{
																t(
																	"EVENTS.EVENTS.DETAILS.WORKFLOWS.WDID",
																) /* Workflow definition */
															}
														</td>
														<td>{workflowData.wdid}</td>
													</tr>
												</>
											)}
										</tbody>
									</table>
								</div>
							</div>

							{/* 'Workflow configuration' table */}
							{user.isAdmin && (
								<div className="obj tbl-details">
									<header>
										{
											t(
												"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.CONFIGURATION",
											) /* Workflow configuration */
										}
									</header>
									<div className="obj-container">
										<table className="main-tbl">
											<tbody>
												{workflowData && workflowData.configuration &&
                          Object.entries(workflowData.configuration).map(
													([confKey, confValue], key) => (
														<tr key={key}>
															<td>{confKey}</td>
															<td>{confValue as string}</td>
														</tr>
													),
												)}
											</tbody>
										</table>
									</div>
								</div>
							)}

							{/* 'More Information' table */}
							<div className="obj tbl-container more-info-actions">
								<header>
									{
										t(
											"EVENTS.EVENTS.DETAILS.WORKFLOWS.MORE_INFO",
										) /* More Information */
									}
								</header>

								{/* links to 'Operations' or 'Errors & Warnings' sub-Tabs */}
								<div className="obj-container">
									<ul>
										<li>
											<span>
												{
													t(
														"EVENTS.EVENTS.DETAILS.WORKFLOW_OPERATIONS.DETAILS_LINK",
													) /* Operations */
												}
											</span>
											<ButtonLikeAnchor
												extraClassName="details-link"
												onClick={() => openSubTab("workflow-operations")}
											>
												{
													t(
														"EVENTS.EVENTS.DETAILS.WORKFLOWS.DETAILS",
													) /* Details */
												}
											</ButtonLikeAnchor>
										</li>
										<li>
											<span>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.TITLE",
													) /* Errors & Warnings */
												}
											</span>
											<ButtonLikeAnchor
												extraClassName="details-link"
												onClick={() => openSubTab("errors-and-warnings")}
											>
												{
													t(
														"EVENTS.EVENTS.DETAILS.WORKFLOWS.DETAILS",
													) /* Details */
												}
											</ButtonLikeAnchor>
										</li>
									</ul>
								</div>
							</div>
						</>
					)}

					{/* empty view for displaying, while the data is being fetched */}
					{isFetching && (
						<>
							{/* 'Workflow Details' table */}
							<div className="obj tbl-details">
								<header>
									{
										t(
											"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.TITLE",
										) /* Workflow Details */
									}
								</header>
								<div className="obj-container">
									<table className="main-tbl vertical-headers">
										<tbody>
											<tr />
										</tbody>
									</table>
								</div>
							</div>

							{/* 'Workflow configuration' table */}
							{user.isAdmin && (
								<div className="obj tbl-details">
									<header>
										{
											t(
												"EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.CONFIGURATION",
											) /* Workflow configuration */
										}
									</header>
									<div className="obj-container">
										<table className="main-tbl">
											<tbody>
												<tr />
											</tbody>
										</table>
									</div>
								</div>
							)}

							{/* 'More Information' table */}
							<div className="obj tbl-container more-info-actions">
								<header>
									{
										t(
											"EVENTS.EVENTS.DETAILS.WORKFLOWS.MORE_INFO",
										) /* More Information */
									}
								</header>
								<div className="obj-container">
									<ul>
										<li>
											<span>
												{
													t(
														"EVENTS.EVENTS.DETAILS.WORKFLOW_OPERATIONS.DETAILS_LINK",
													) /* Operations */
												}
											</span>
											<ButtonLikeAnchor extraClassName="details-link">
												{
													t(
														"EVENTS.EVENTS.DETAILS.WORKFLOWS.DETAILS",
													) /* Details */
												}
											</ButtonLikeAnchor>
										</li>
										<li>
											<span>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ERRORS_AND_WARNINGS.TITLE",
													) /* Errors & Warnings */
												}
											</span>
											<ButtonLikeAnchor extraClassName="details-link">
												{
													t(
														"EVENTS.EVENTS.DETAILS.WORKFLOWS.DETAILS",
													) /* Details */
												}
											</ButtonLikeAnchor>
										</li>
									</ul>
								</div>
							</div>
						</>
					)}
		</ModalContentTable>
	);
};

export default EventDetailsWorkflowDetails;
