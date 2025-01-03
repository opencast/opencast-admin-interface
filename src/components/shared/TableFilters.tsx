import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
	getFilters,
	getSecondFilter,
	getSelectedFilter,
	getTextFilter,
} from "../../selectors/tableFilterSelectors";
import {
	FilterData,
	editFilterValue,
	editSelectedFilter,
	editTextFilter,
	removeSecondFilter,
	removeSelectedFilter,
	removeTextFilter,
	resetFilterValues,
} from "../../slices/tableFilterSlice";
import {
	goToPage,
} from "../../thunks/tableThunks";
import TableFilterProfiles from "./TableFilterProfiles";
import { availableHotkeys } from "../../configs/hotkeysConfig";
import { useHotkeys } from "react-hotkeys-hook";
import moment from "moment";
import { AppThunk, useAppDispatch, useAppSelector } from "../../store";
import { renderValidDate } from "../../utils/dateUtils";
import { Tooltip } from "./Tooltip";
import DropDown from "./DropDown";
import { AsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkConfig } from "@reduxjs/toolkit/dist/createAsyncThunk";

/**
 * This component renders the table filters in the upper right corner of the table
 */
const TableFilters = ({
	loadResource,
	loadResourceIntoTable,
	resource,
}: {
	loadResource: AsyncThunk<any, void, AsyncThunkConfig>,
	loadResourceIntoTable: () => AppThunk,
	resource: string,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state));
	const secondFilter = useAppSelector(state => getSecondFilter(state));
	const selectedFilter = useAppSelector(state => getSelectedFilter(state));
	const textFilter = useAppSelector(state => getTextFilter(state));

	// Variables for showing different dialogs depending on what was clicked
	const [showFilterSelector, setFilterSelector] = useState(false);
	const [showFilterSettings, setFilterSettings] = useState(false);
	const [itemValue, setItemValue] = React.useState("");
	const [openSecondFilterMenu, setOpenSecondFilterMenu] = useState(false);

	// Variables containing selected start date and end date for date filter
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);

	let filter = filterMap.find(({ name }) => name === selectedFilter);

	// Remove all selected filters, no filter should be "active" anymore
	const removeFilters = async () => {
		// Clear state
		setStartDate(undefined);
		setEndDate(undefined);

		dispatch(removeTextFilter());
		dispatch(removeSelectedFilter());
		dispatch(removeSelectedFilter());

		// Set all values of the filters in filterMap back to ""
		dispatch(resetFilterValues())

		// Reload resources when filters are removed
		await dispatch(loadResource);
		dispatch(loadResourceIntoTable());
	};

	// Remove a certain filter
	const removeFilter = async (filter: FilterData) => {
		if (filter.name === "startDate") {
			// Clear state
			setStartDate(undefined);
			setEndDate(undefined);
		}

		dispatch(editFilterValue({filterName: filter.name, value: ""}));

		// Reload resources when filter is removed
		await dispatch(loadResource());
		dispatch(loadResourceIntoTable());
	};

	// Handle changes when an item of the component is changed
	const handleChange = (name: string, value: string) => {
		let mustApplyChanges = false;
		if (name === "textFilter") {
			dispatch(editTextFilter(value));
			mustApplyChanges = true;
		}

		if (name === "selectedFilter") {
			dispatch(editSelectedFilter(value));
			setOpenSecondFilterMenu(true);
		}

		// If the change is in secondFilter (filter is picked) then the selected value is saved in filterMap
		// and the filter selections are cleared
		if (name === "secondFilter") {
			let filter = filterMap.find(({ name }) => name === selectedFilter);
			if (!!filter) {
				dispatch(editFilterValue({filterName: filter.name, value: value}));
				setFilterSelector(false);
				dispatch(removeSelectedFilter());
				dispatch(removeSecondFilter());
				setOpenSecondFilterMenu(false);
				mustApplyChanges = true;
			}
		}

		if (mustApplyChanges) {
			setItemValue(value);
		}
	};

	// Apply the filter changes (in debounced) accomulated in handleChange,
	// simply by going to first page and then load resources.
	// This helps increase performance by reducing the number of calls to load resources.
	const applyFilterChangesDebounced = async () => {
		// No matter what, we go to page one.
		dispatch(goToPage(0))
		// Reload of resource
		await dispatch(loadResource());
		dispatch(loadResourceIntoTable());
	};

	useEffect(() => {
		// Call to apply filter changes with 500MS debounce!
		let applyFilterChangesDebouncedTimeoutId = setTimeout(applyFilterChangesDebounced, 500);

		return () => clearTimeout(applyFilterChangesDebouncedTimeoutId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [itemValue]);

	// Set the sate of startDate and endDate picked with datepicker
	const handleDatepickerChange = async (date: Date | null, isStart = false) => {
		if (date === null) {
			return;
		}

		if (isStart) {
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			setStartDate(date);
		} else {
			date.setHours(23);
			date.setMinutes(59);
			date.setSeconds(59);
			setEndDate(date);
		}
	};

	// If both dates are set, set the value for the startDate filter
	// If the just changed, it can be passed here so we don't have wait a render
	// cycle for the useState state to update
	const handleDatepickerConfirm = async (date?: Date | null, isStart = false) => {
		if (date === null) {
			return;
		}

		let myStartDate = startDate;
		let myEndDate = endDate;
		if (date && isStart) {
			myStartDate = date;
			myStartDate.setHours(0);
			myStartDate.setMinutes(0);
			myStartDate.setSeconds(0);
		}
		if (date && !isStart) {
			myEndDate = date;
			myEndDate.setHours(23);
			myEndDate.setMinutes(59);
			myEndDate.setSeconds(59);
		}

		if (myStartDate && myEndDate && moment(myStartDate).isValid() && moment(myEndDate).isValid()) {
			let filter = filterMap.find(({ name }) => name === selectedFilter);
			if (filter) {
				dispatch(editFilterValue({
					filterName: filter.name,
					value: myStartDate.toISOString() + "/" + myEndDate.toISOString()
				}));
				setFilterSelector(false);
				dispatch(removeSelectedFilter());
				// Reload of resource after going to very first page.
				dispatch(goToPage(0))
				await dispatch(loadResource());
				dispatch(loadResourceIntoTable());
			}
		}

		if (myStartDate && isStart && !endDate) {
			let tmp = new Date(myStartDate.getTime());
			tmp.setHours(23);
			tmp.setMinutes(59);
			tmp.setSeconds(59);
			setEndDate(tmp);
		}
		if (myEndDate && !isStart && !startDate) {
			let tmp = new Date(myEndDate.getTime());
			tmp.setHours(0);
			tmp.setMinutes(0);
			tmp.setSeconds(0);
			setStartDate(tmp);
		}
	}

	useHotkeys(
    availableHotkeys.general.REMOVE_FILTERS.sequence,
    () => removeFilters(),
		{ description: t(availableHotkeys.general.REMOVE_FILTERS.description) ?? undefined },
    [removeFilters]
  );

	const renderBlueBox = (filter: FilterData) => {
		let valueLabel = filter.options?.find((opt) => opt.value === filter.value)
			?.label || filter.value;
		return (
			<span className="table-filter-blue-box">
				{t(filter.label)}:
				{filter.translatable? t(valueLabel) : valueLabel}
			</span>
		);
	};

	const getSelectedFilterText = () => {
		return filter?.label ? t(filter.label) : selectedFilter;
	}

	return (
		<>
			<div className="filters-container">
				{/* Text filter - Search Query */}
        <div className="search-container">
          <input
            type="text"
            className="search expand"
            placeholder={t("TABLE_FILTERS.PLACEHOLDER")}
            onChange={(e) => handleChange("textFilter", e.target.value)}
            name="textFilter"
            value={textFilter}
          />
        </div>

				{/* Selection of filters and management of filter profiles*/}
				{/*show only if filters.filters contains filters*/}
				{!!filterMap && (
					<div className="table-filter">
						<div className="filters">
							<Tooltip title={t("TABLE_FILTERS.ADD")}>
								<button className="button-like-anchor" onClick={() => setFilterSelector(!showFilterSelector)}>
									<i className="fa fa-filter" />
								</button>
							</Tooltip>

							{/*show if icon is clicked*/}
							{showFilterSelector && (
								/*Show all filtersMap as selectable options*/
								<DropDown
									value={selectedFilter}
									text={getSelectedFilterText()}
									options={
										!!filterMap && filterMap.length > 0
											? filterMap.filter(
													(filter) => filter.name !== "presentersBibliographic"
												)
												.sort((a, b) => t(a.label).localeCompare(t(b.label))) // Sort alphabetically
												.map(filter => {
													return {
														value: filter.name,
														label: t(filter.label).substr(0, 40),
													};
												})
											: []
									}
									type={"filter"}
									required={true}
									handleChange={(element) => handleChange("selectedFilter", element!.value)}
									placeholder={
										!!filterMap && filterMap.length > 0
											? t(
												"TABLE_FILTERS.FILTER_SELECTION.PLACEHOLDER"
												)
											: t(
												"TABLE_FILTERS.FILTER_SELECTION.NO_OPTIONS"
												)
									}
									defaultOpen
									autoFocus
									openMenuOnFocus
								/>
							)}

							{/*Show selection of secondary filter if a main filter is chosen*/}
							{!!selectedFilter && (
								<div>
									{/*Show the secondary filter depending on the type of main filter chosen (select or period)*/}
									<FilterSwitch
										filter={filter}
										secondFilter={secondFilter}
										startDate={startDate}
										endDate={endDate}
										handleDate={handleDatepickerChange}
										handleDateConfirm={handleDatepickerConfirm}
										handleChange={handleChange}
										openSecondFilterMenu={openSecondFilterMenu}
										setOpenSecondFilterMenu={setOpenSecondFilterMenu}
									/>
								</div>
							)}

							{/* Show for each selected filter a blue label containing its name and option */}
							{filterMap.map((filter, key) => {
								return filter.value && (
									<span className="ng-multi-value" key={key}>
										{
											// Use different representation of name and value depending on type of filter
											filter.type === "period" ? (
												<span className="table-filter-blue-box">
													{t(filter.label)}:
													{t("dateFormats.date.short", {
														date: renderValidDate(filter.value.split("/")[0]),
													})}
													-
													{t("dateFormats.date.short", {
														date: renderValidDate(filter.value.split("/")[1]),
													})}
												</span>
											) : (
												renderBlueBox(filter)
											)
										}
										{/* Remove icon in blue area around filter */}
										<Tooltip title={t("TABLE_FILTERS.REMOVE")}>
											<button
												onClick={() => removeFilter(filter)}
												className="button-like-anchor"
											>
												<i className="fa fa-times" />
											</button>
										</Tooltip>
									</span>
								);
							})}
						</div>

						{/* Remove icon to clear all filters */}
						<Tooltip title={t("TABLE_FILTERS.CLEAR")}>
							<button className="button-like-anchor" onClick={removeFilters}>
								<i className="clear fa fa-times" />
							</button>
						</Tooltip>
						{/* Settings icon to open filters profile dialog (save and editing filter profiles)*/}
						<Tooltip title={t("TABLE_FILTERS.PROFILES.FILTERS_HEADER")}>
							<button className="button-like-anchor" onClick={() => setFilterSettings(!showFilterSettings)}>
								<i className="settings fa fa-cog fa-times" />
							</button>
						</Tooltip>

						{/* Filter profile dialog for saving and editing filter profiles */}
						<TableFilterProfiles
							showFilterSettings={showFilterSettings}
							setFilterSettings={setFilterSettings}
							resource={resource}
							loadResource={loadResource}
							loadResourceIntoTable={loadResourceIntoTable}
						/>
					</div>
				)}
			</div>
		</>
	);
};

/*
 * Component for rendering the selection of options for the secondary filter
 * depending on the the type of the main filter. These types can be select or period.
 * In case of select, a second selection is shown. In case of period, datepicker are shown.
 */
const FilterSwitch = ({
	filter,
	handleChange,
	startDate,
	endDate,
	handleDate,
	handleDateConfirm,
	secondFilter,
	openSecondFilterMenu,
	setOpenSecondFilterMenu,
} : {
	filter: FilterData | undefined,
	handleChange: (name: string, value: string) => void,
	startDate: Date | undefined,
	endDate: Date | undefined,
	handleDate: (date: Date | null, isStart?: boolean) => void,
	handleDateConfirm: (date: Date | undefined | null, isStart?: boolean) => void,
	secondFilter: string,
	openSecondFilterMenu: boolean,
	setOpenSecondFilterMenu: (open: boolean) => void,
}) => {
	const { t } = useTranslation();

	const startDateRef = useRef<HTMLInputElement>(null);
	const endDateRef = useRef<HTMLInputElement>(null);

	if (!filter) {
		return null;
	}

	// eslint-disable-next-line default-case
	switch (filter.type) {
		case "select":
			return (
				<div>
					{/* Show further options for a secondary filter */}
					<DropDown
						value={secondFilter}
						text={secondFilter}
						options={
							!!filter.options && filter.options.length > 0
								? filter.options.map((option) => {
									if (!filter.translatable) {
										return {
											...option,
											label: option.label.substr(0, 40),
										}
									} else {
										return {
											...option,
											label: t(option.label).substr(0, 40),
										}
									}
								})
								: []
						}
						type={"filter"}
						required={true}
						handleChange={(element) => handleChange("secondFilter", element!.value)}
						placeholder={
							!!filter.options && filter.options.length > 0
								? t(
									"TABLE_FILTERS.FILTER_VALUE_SELECTION.PLACEHOLDER"
									)
								: t(
									"TABLE_FILTERS.FILTER_SELECTION.NO_OPTIONS"
									)
						}
						autoFocus
						defaultOpen
						openMenuOnFocus
						menuIsOpen={openSecondFilterMenu}
						handleMenuIsOpen={setOpenSecondFilterMenu}
					/>
				</div>
			);
		case "period":
			return (
				<div>
					{/* Show datepicker for start date */}
					<DatePicker
						autoFocus={true}
						inputRef={startDateRef}
						className="small-search start-date"
						value={startDate ?? null}
						format="dd/MM/yyyy"
						onChange={(date) => handleDate(date as Date | null, true)}
						// FixMe: onAccept does not trigger if the already set value is the same as the selected value
						// This prevents us from confirming from confirming our filter, if someone wants to selected the same
						// day for both start and end date (since we automatically set one to the other)
						onAccept={(e) => {handleDateConfirm(e as Date | null, true)}}
						slotProps={{
							textField: {
								onKeyDown: (event) => {
									if (event.key === "Enter") {
										handleDateConfirm(undefined, true)
										if (endDateRef.current && startDate && moment(startDate).isValid()) {
											endDateRef.current.focus();
										}
									}
								},
							},
						}}
					/>
					<DatePicker
						inputRef={endDateRef}
						className="small-search end-date"
						value={endDate ?? null}
						format="dd/MM/yyyy"
						onChange={(date) => handleDate(date as Date | null)}
						// FixMe: See above
						onAccept={(e) => handleDateConfirm(e as Date | null, false)}
						slotProps={{
							textField: {
								onKeyDown: (event) => {
									if (event.key === "Enter") {
										handleDateConfirm(undefined, false)
										if (startDateRef.current && endDate && moment(endDate).isValid()) {
											startDateRef.current.focus();
										}
									}
								},
							},
						}}
					/>
				</div>
			);
    // This should never happen
    default:
      return null;
	}
};

export default TableFilters;
