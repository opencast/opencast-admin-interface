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
 * This component renders the series cells of events in the table view
 */
const EventsSeriesCell = ({
	row,
}: {
	row: Event
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state));

	// Filter with value of current cell
	const addFilter = async (seriesId: string) => {
		let filter = filterMap.find(({ name }) => name === "series");
		if (!!filter) {
			await dispatch(editFilterValue({filterName: filter.name, value: seriesId}));
			await dispatch(fetchEvents());
			dispatch(loadEventsIntoTable());
		}
	};

	return (
		!!row.series ? (
			// Link template for series of event
			<Tooltip title={t("EVENTS.EVENTS.TABLE.TOOLTIP.SERIES")}>
				<button
					className="button-like-anchor crosslink"
					onClick={() => row.series
						? addFilter(row.series.id)
						: console.error("Tried to sort by a series, but the series did not exist.")
					}
				>
					{row.series.title}
				</button>
			</Tooltip>
		)
		: <></>
	);
};

export default EventsSeriesCell;
