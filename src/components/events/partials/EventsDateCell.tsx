import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { editFilterValue } from "../../../slices/tableFilterSlice";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { getFilters } from "../../../selectors/tableFilterSelectors";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchEvents } from "../../../slices/eventSlice";
import { renderValidDate } from "../../../utils/dateUtils";
import { Event } from "../../../slices/eventSlice";
import { IconButton } from "../../shared/IconButton";
import {
	goToPage,
} from "../../../thunks/tableThunks";

/**
 * This component renders the start date cells of events in the table view
 */
const EventsDateCell = ({
	row,
}: {
	row: Event
}) => {
	// Using itemValue with useState in order to use as flag in useEffect as watcher!
	const [itemValue, setItemValue] = useState('');
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state, "events"));

	// Filter with value of current cell
	const addFilter = async (date: string) => {
		let mustApplyChanges = false;
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
			mustApplyChanges = true;
		}
		if (mustApplyChanges) {
			setItemValue(date);
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
