import React from "react";
import { useTranslation } from "react-i18next";
import { getFilters } from "../../../selectors/tableFilterSelectors";
import { editFilterValue } from "../../../slices/tableFilterSlice";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchEvents } from "../../../slices/eventSlice";
import { Tooltip } from "../../shared/Tooltip";
import { Event } from "../../../slices/eventSlice";

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

	const filterMap = useAppSelector(state => getFilters(state));

	// Filter with value of current cell
	const addFilter = async (status: string) => {
		let filter = filterMap.find(({ name }) => name === "status");
		if (!!filter) {
			await dispatch(editFilterValue({filterName: filter.name, value: status}));
			await dispatch(fetchEvents());
			dispatch(loadEventsIntoTable());
		}
	};

	return (
		<Tooltip title={t("EVENTS.EVENTS.TABLE.TOOLTIP.STATUS")}>
			<button
				className="button-like-anchor crosslink"
				onClick={() => addFilter(row.event_status)}
			>
				{t(row.displayable_status)}
			</button>
		</Tooltip>
	);
};

export default EventsStatusCell;
