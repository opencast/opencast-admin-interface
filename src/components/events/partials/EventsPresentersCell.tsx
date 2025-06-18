import { getFilters } from "../../../selectors/tableFilterSelectors";
import { editFilterValue } from "../../../slices/tableFilterSlice";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchEvents } from "../../../slices/eventSlice";
import { Event } from "../../../slices/eventSlice";
import { IconButton } from "../../shared/IconButton";

/**
 * This component renders the presenters cells of events in the table view
 */
const EventsPresentersCell = ({
	row,
}: {
	row: Event
}) => {
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state, "events"));

	// Filter with value of current cell
	const addFilter = async (presenter: string) => {
		const filter = filterMap.find(
			({ name }) => name === "presentersBibliographic",
		);
		if (filter) {
			await dispatch(editFilterValue({ filterName: filter.name, value: presenter }));
			await dispatch(fetchEvents());
			dispatch(loadEventsIntoTable());
		}
	};

	return (
		// Link template for presenter of event
		// Repeat for each presenter
		row.presenters.map((presenter, key) => (
			<IconButton
				key={key}
				callback={() => addFilter(presenter)}
				iconClassname={"metadata-entry"}
				tooltipText={"EVENTS.EVENTS.TABLE.TOOLTIP.PRESENTER"}
			>
				{presenter}
			</IconButton>
		))
	);
};

export default EventsPresentersCell;
