import React from "react";
import { useTranslation } from "react-i18next";
import { getFilters } from "../../../selectors/tableFilterSelectors";
import { editFilterValue } from "../../../slices/tableFilterSlice";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchEvents } from "../../../slices/eventSlice";
import { renderValidDate } from "../../../utils/dateUtils";
import { Tooltip } from "../../shared/Tooltip";
import { Event } from "../../../slices/eventSlice";

/**
 * This component renders the technical date cells of events in the table view
 */
const EventsTechnicalDateCell = ({
	row,
}: {
	row: Event
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state));

	// Filter with value of current cell
	const addFilter = async (date: string) => {
		let filter = filterMap.find(({ name }) => name === "technicalStart");
		if (!!filter) {
			await dispatch(editFilterValue({filterName: filter.name, value: date + "/" + date}));
			await dispatch(fetchEvents());
			dispatch(loadEventsIntoTable());
		}
	};

	return (
		// Link template for technical date of event
		<Tooltip title={t("EVENTS.EVENTS.TABLE.TOOLTIP.START")}>
			<button
				className="button-like-anchor crosslink"
				onClick={() => addFilter(row.date)}
			>
				{t("dateFormats.date.short", { date: renderValidDate(row.technical_start) })}
			</button>
		</Tooltip>
	);
};

export default EventsTechnicalDateCell;
