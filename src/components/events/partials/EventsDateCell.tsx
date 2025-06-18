import { useTranslation } from "react-i18next";
import { editFilterValue } from "../../../slices/tableFilterSlice";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { getFilters } from "../../../selectors/tableFilterSelectors";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchEvents } from "../../../slices/eventSlice";
import { renderValidDate } from "../../../utils/dateUtils";
import { Event } from "../../../slices/eventSlice";
import { IconButton } from "../../shared/IconButton";

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

	const filterMap = useAppSelector(state => getFilters(state, "events"));

	// Filter with value of current cell
	const addFilter = async (date: string) => {
		const filter = filterMap.find(({ name }) => name === "startDate");
		if (filter) {
			const startDate = new Date(date);
			startDate.setHours(0);
			startDate.setMinutes(0);
			startDate.setSeconds(0);
			const endDate = new Date(date);
			endDate.setHours(23);
			endDate.setMinutes(59);
			endDate.setSeconds(59);

			await dispatch(editFilterValue({ filterName: filter.name, value: startDate.toISOString() + "/" + endDate.toISOString() }));
			await dispatch(fetchEvents());
			dispatch(loadEventsIntoTable());
		}
	};

	return (
		// Link template for start date of event
		<IconButton
			callback={() => addFilter(row.date)}
			iconClassname={"crosslink"}
			tooltipText={"EVENTS.EVENTS.TABLE.TOOLTIP.START"}
		>
			{t("dateFormats.date.short", { date: renderValidDate(row.date) })}
		</IconButton>
	);
};

export default EventsDateCell;
