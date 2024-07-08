import React from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../store";
import { Tooltip } from "../../shared/Tooltip";
import { EventDetailsPage } from "./modals/EventDetails";
import { Event } from "../../../slices/eventSlice";
import {
	fetchWorkflowDetails,
	fetchWorkflowOperations,
	fetchWorkflows,
	openModal
} from "../../../slices/eventDetailsSlice";

/**
 * This component renders the status cells of events in the table view
 */
const EventsStatusCell = ({
	row,
}: {
	row: Event
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const openWorkflowOperations = () => {
		dispatch(fetchWorkflows(row.id)).unwrap()
			.then(async (workflows) => {
				if (!workflows.entries) {
					// Open workflow overview modal
					return dispatch(openModal(EventDetailsPage.Workflow, row));
				}

				// Show operations of last workflow
				const lastWorkflow = workflows.entries[workflows.entries.length-1];

				// Load necessary workflow data
				await dispatch(fetchWorkflowDetails({ eventId: row.id, workflowId: lastWorkflow.id }));
				await dispatch(fetchWorkflowOperations({ eventId: row.id, workflowId: lastWorkflow.id }));

				dispatch(openModal(EventDetailsPage.Workflow, row, 'workflow-operations'));
			});
	};

	return (
		<Tooltip title={t("EVENTS.EVENTS.TABLE.TOOLTIP.STATUS")}>
			<button
				className="button-like-anchor crosslink"
				onClick={() => openWorkflowOperations()}
			>
				{t(row.displayable_status)}
			</button>
		</Tooltip>
	);
};

export default EventsStatusCell;
