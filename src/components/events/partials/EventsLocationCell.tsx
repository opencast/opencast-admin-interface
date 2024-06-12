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
 * This component renders the location cells of events in the table view
 */
const EventsLocationCell = ({
	row,
}: {
	row: Event
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state));

	// Filter with value of current cell
	const addFilter = (location: string) => {
		let filter = filterMap.find(({ name }) => name === "location");
		if (!!filter) {
			dispatch(editFilterValue({filterName: filter.name, value: location}));
			dispatch(fetchEvents());
			dispatch(loadEventsIntoTable());
		}
	};

	return (
		// Link template for location of event
		<Tooltip title={t("EVENTS.EVENTS.TABLE.TOOLTIP.LOCATION")}>
			<button
				className="button-like-anchor crosslink"
				onClick={() => addFilter(row.location)}
			>
				{row.location}
			</button>
		</Tooltip>
	);
};

export default EventsLocationCell;
