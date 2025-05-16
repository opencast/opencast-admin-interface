import React, { useState, useEffect } from "react";
import { getFilters } from "../../../selectors/tableFilterSelectors";
import { editFilterValue } from "../../../slices/tableFilterSlice";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchEvents } from "../../../slices/eventSlice";
import { Event } from "../../../slices/eventSlice";
import { IconButton } from "../../shared/IconButton";
import {
	goToPage,
} from "../../../thunks/tableThunks";

/**
 * This component renders the series cells of events in the table view
 */
const EventsSeriesCell = ({
	row,
}: {
	row: Event
}) => {
	// Using itemValue with useState in order to use as flag in useEffect as watcher!
	const [itemValue, setItemValue] = useState('');
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state, "events"));

	// Filter with value of current cell
	const addFilter = async (seriesId: string) => {
		let mustApplyChanges = false;
		let filter = filterMap.find(({ name }) => name === "series");
		if (!!filter) {
			await dispatch(editFilterValue({filterName: filter.name, value: seriesId}));
			mustApplyChanges = true;
		}
		if (mustApplyChanges) {
			setItemValue(seriesId);
		}
	};

	const applyFilterChangesDebounced = async () => {
		// No matter what, we go to page one.
		dispatch(goToPage(0))
		// Reload of resource
		await dispatch(fetchEvents());
		dispatch(loadEventsIntoTable());
		setItemValue('');
	};

	useEffect(() => {
		if (itemValue) {
			// Call to apply filter changes with 500MS debounce!
			let applyFilterChangesDebouncedTimeoutId = setTimeout(applyFilterChangesDebounced, 500);

			return () => clearTimeout(applyFilterChangesDebouncedTimeoutId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [itemValue]);

	return (
		!!row.series ? (
			// Link template for series of event
			<IconButton
				callback={() => row.series
					? addFilter(row.series.id)
					: console.error("Tried to sort by a series, but the series did not exist.")
				}
				iconClassname={"crosslink"}
				tooltipText={"EVENTS.EVENTS.TABLE.TOOLTIP.SERIES"}
			>
				{row.series.title}
			</IconButton>
		)
		: <></>
	);
};

export default EventsSeriesCell;
