import React from "react";
import { useTranslation } from "react-i18next";
import { editFilterValue } from "../../../slices/tableFilterSlice";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { getFilters } from "../../../selectors/tableFilterSelectors";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchEvents } from "../../../slices/eventSlice";
import { renderValidDate } from "../../../utils/dateUtils";
import { Tooltip } from "../../shared/Tooltip";

/**
 * This component renders the start date cells of events in the table view
 */
const EventsDateCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state));

	// Filter with value of current cell
// @ts-expect-error TS(7006): Parameter 'date' implicitly has an 'any' type.
	const addFilter = async (date) => {
		let filter = filterMap.find(({ name }) => name === "startDate");
		if (!!filter) {
			await dispatch(editFilterValue({filterName: filter.name, value: date + "/" + date}));
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
