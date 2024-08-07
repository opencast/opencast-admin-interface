import React from "react";
import { useTranslation } from "react-i18next";
import { editFilterValue } from "../../../slices/tableFilterSlice";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { getFilters } from "../../../selectors/tableFilterSelectors";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchEvents } from "../../../slices/eventSlice";
import { renderValidDate } from "../../../utils/dateUtils";
import { Tooltip } from "../../shared/Tooltip";
import { Event } from "../../../slices/eventSlice";

/**
 * This component renders the start date cells of events in the table view
 */
const EventsDateCell = ({
	row,
}: {
	row: Event
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state));

	// Filter with value of current cell
	const addFilter = async (date: string) => {
		let filter = filterMap.find(({ name }) => name === "startDate");
		if (!!filter) {
			let startDate = new Date(date);
			startDate.setHours(0);
			startDate.setMinutes(0);
			startDate.setSeconds(0);
			let endDate = new Date(date);
			endDate.setHours(23);
			endDate.setMinutes(59);
			endDate.setSeconds(59);

			await dispatch(editFilterValue({filterName: filter.name, value: startDate.toISOString() + "/" + endDate.toISOString()}));
			await dispatch(fetchEvents());
			dispatch(loadEventsIntoTable());
		}
	};

	return (
		// Link template for start date of event
		<Tooltip title={t("EVENTS.EVENTS.TABLE.TOOLTIP.START")}>
			<button
				className="button-like-anchor crosslink"
				onClick={() => addFilter(row.date)}
			>
				{t("dateFormats.date.short", { date: renderValidDate(row.date) })}
			</button>
		</Tooltip>
	);
};

export default EventsDateCell;
