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
 * This component renders the presenters cells of events in the table view
 */
const EventsPresentersCell = ({
	row,
}: {
	row: Event
}) => {
	// Using itemValue with useState in order to use as flag in useEffect as watcher!
	const [itemValue, setItemValue] = useState('');
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state, "events"));

	// Filter with value of current cell
	const addFilter = async (presenter: string) => {
		let mustApplyChanges = false;
		let filter = filterMap.find(
			({ name }) => name === "presentersBibliographic"
		);
		if (!!filter) {
			await dispatch(editFilterValue({filterName: filter.name, value: presenter}));
			mustApplyChanges = true;
		}
		if (mustApplyChanges) {
			setItemValue(presenter);
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
