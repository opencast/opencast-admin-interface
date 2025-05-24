import React from "react";
import { useTranslation } from "react-i18next";
import { editFilterValue } from "../../slices/tableFilterSlice";
import { getFilters } from "../../selectors/tableFilterSelectors";
import { AppThunk, useAppDispatch, useAppSelector } from "../../store";
import { renderValidDate } from "../../utils/dateUtils";
import { IconButton } from "../shared/IconButton";
import { ParseKeys } from "i18next";
import { AsyncThunk } from "@reduxjs/toolkit";

/**
 * This component renders the start date cells of events in the table view
 */
const DateTimeCell = ({
	resource,
	date,
	filterName,
	fetchResource,
	loadResourceIntoTable,
	tooltipText,
}: {
	resource: string
	date: string
	filterName: string
	fetchResource: AsyncThunk<any, void, any>
	loadResourceIntoTable: () => AppThunk
	tooltipText: ParseKeys
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state, resource));

	// Filter with value of current cell
	const addFilter = async (date: string) => {
		let filter = filterMap.find(({ name }) => name === filterName);
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
			await dispatch(fetchResource());
			dispatch(loadResourceIntoTable());
		}
	};

	return (
		// Link template for start date of event
		<IconButton
			callback={() => addFilter(date)}
			iconClassname={"crosslink"}
			tooltipText={tooltipText}
		>
			{t("dateFormats.date.short", { date: renderValidDate(date) })}
		</IconButton>
	);
};

export default DateTimeCell;
