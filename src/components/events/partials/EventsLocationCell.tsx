import React from "react";
import { useTranslation } from "react-i18next";
import { getFilters } from "../../../selectors/tableFilterSelectors";
import { editFilterValue } from "../../../slices/tableFilterSlice";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchEvents } from "../../../slices/eventSlice";
import { Tooltip } from "../../shared/Tooltip";

/**
 * This component renders the location cells of events in the table view
 */
const EventsLocationCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state));

	// Filter with value of current cell
// @ts-expect-error TS(7006): Parameter 'location' implicitly has an 'any' type.
	const addFilter = (location) => {
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
