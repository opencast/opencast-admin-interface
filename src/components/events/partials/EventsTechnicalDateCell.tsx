import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getFilters } from "../../../selectors/tableFilterSelectors";
import { editFilterValue } from "../../../slices/tableFilterSlice";
import { loadEventsIntoTable } from "../../../thunks/tableThunks";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchEvents } from "../../../slices/eventSlice";
import { renderValidDate } from "../../../utils/dateUtils";
import { Event } from "../../../slices/eventSlice";
import { IconButton } from "../../shared/IconButton";
import {
	goToPage,
} from "../../../thunks/tableThunks";

/**
 * This component renders the technical date cells of events in the table view
 */
const EventsTechnicalDateCell = ({
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
		let filter = filterMap.find(({ name }) => name === "technicalStart");
		if (!!filter) {
			await dispatch(editFilterValue({filterName: filter.name, value: date + "/" + date}));
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
		// Link template for technical date of event
		<IconButton
			callback={() => addFilter(row.date)}
			iconClassname={"crosslink"}
			tooltipText={"EVENTS.EVENTS.TABLE.TOOLTIP.START"}
		>
			{t("dateFormats.date.short", { date: renderValidDate(row.technical_start) })}
		</IconButton>
	);
};

export default EventsTechnicalDateCell;
