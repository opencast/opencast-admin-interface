import React from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../../store";
import { Tooltip } from "../../shared/Tooltip";
import { Event } from "../../../slices/eventSlice";
import {
	fetchWorkflows,
	openModal,
} from "../../../slices/eventDetailsSlice";
import { EventDetailsPage } from "./modals/EventDetails";
import { hasScheduledStatus } from "../../../utils/eventDetailsUtils";

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

	const openStatusModal = () => {
		// Open scheduling modal for scheduled and recording events
		if (hasScheduledStatus(row)) {
			return dispatch(openModal(EventDetailsPage.Scheduling, row));
		}

		dispatch(fetchWorkflows(row.id)).unwrap()
			.then(async (workflows) => {
				// Open workflow overview modal if no workflows available
				if (!workflows.entries.length) {
					return dispatch(openModal(EventDetailsPage.Workflow, row));
				}

				// Show operations of last workflow
				const lastWorkflow = workflows.entries[workflows.entries.length-1];
				if (lastWorkflow) {
					dispatch(openModal(EventDetailsPage.Workflow, row, 'workflow-operations', 'entry', lastWorkflow.id));
				}
			});
	};

	return (
		<Tooltip title={t("EVENTS.EVENTS.TABLE.TOOLTIP.STATUS")}>
			<button
				className="button-like-anchor crosslink"
				onClick={() => openStatusModal()}
			>
				{t(row.displayable_status)}
			</button>
		</Tooltip>
	);
};

export default EventsStatusCell;
