import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
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
import { getResourceType } from "../../selectors/tableSelectors";
import { useHotkeys } from "react-hotkeys-hook";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../store";

/**
 * This component renders the table filters in the upper right corner of the table
 */
const TableFilters = ({
// @ts-expect-error TS(7031): Binding element 'loadResource' implicitly has an '... Remove this comment to see the full error message
	loadResource,
// @ts-expect-error TS(7031): Binding element 'loadResourceIntoTable' implicitly... Remove this comment to see the full error message
	loadResourceIntoTable,
// @ts-expect-error TS(7031): Binding element 'resource' implicitly has an 'any'... Remove this comment to see the full error message
	resource,
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

	// Variables containing selected start date and end date for date filter
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);

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
		await loadResource();
		loadResourceIntoTable();
	};

	// Remove a certain filter
// @ts-expect-error TS(7006): Parameter 'filter' implicitly has an 'any' type.
	const removeFilter = async (filter) => {
		if (filter.name === "startDate") {
			// Clear state
			setStartDate(undefined);
			setEndDate(undefined);
		}

		dispatch(editFilterValue({filterName: filter.name, value: ""}));

		// Reload resources when filter is removed
		await loadResource();
		loadResourceIntoTable();
	};

	// Handle changes when an item of the component is changed
	// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const handleChange = (e) => {
		let targetName = e.target.name;
		let targetValue = e.target.value;

		let mustApplyChanges = false;
		if (targetName === "textFilter") {
			dispatch(editTextFilter(targetValue));
			mustApplyChanges = true;
		}

		if (targetName === "selectedFilter") {
			dispatch(editSelectedFilter(targetValue));
		}

		// If the change is in secondFilter (filter is picked) then the selected value is saved in filterMap
		// and the filter selections are cleared
		if (targetName === "secondFilter") {
			let filter = filterMap.find(({ name }) => name === selectedFilter);
			if (!!filter) {
				dispatch(editFilterValue({filterName: filter.name, value: targetValue}));
				setFilterSelector(false);
				dispatch(removeSelectedFilter());
				dispatch(removeSecondFilter());
				mustApplyChanges = true;
			}
		}

		if (mustApplyChanges) {
			setItemValue(e.target.value);
		}
	};

	// Apply the filter changes (in debounced) accomulated in handleChange,
	// simply by going to first page and then load resources.
	// This helps increase performance by reducing the number of calls to load resources.
	const applyFilterChangesDebounced = async () => {
		// No matter what, we go to page one.
		dispatch(goToPage(0)).then(async () => {
			// Reload of resource
			await loadResource();
			loadResourceIntoTable();
		});
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
				dispatch(goToPage(0)).then(async () => {
					await loadResource();
					loadResourceIntoTable();
				});
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

// @ts-expect-error TS(7006): Parameter 'filter' implicitly has an 'any' type.
	const renderBlueBox = (filter) => {
// @ts-expect-error TS(7006): Parameter 'opt' implicitly has an 'any' type.
		let valueLabel = filter.options.find((opt) => opt.value === filter.value)
			.label;
		return (
			<span>
				{t(filter.label).substr(0, 40)}:
				{filter.translatable
					? t(valueLabel).substr(0, 40)
					: valueLabel.substr(0, 40)}
			</span>
		);
	};

	return (
		<>
			<div className="filters-container">
				{/* Text filter - Search Query */}
				<input
					type="text"
					className="search expand"
					placeholder={t("TABLE_FILTERS.PLACEHOLDER")}
					onChange={(e) => handleChange(e)}
					name="textFilter"
					value={textFilter}
				/>

				{/* Selection of filters and management of filter profiles*/}
				{/*show only if filters.filters contains filters*/}
				{!!filterMap && (
					<div className="table-filter">
						<div className="filters">
							<i
								title={t("TABLE_FILTERS.ADD")}
								className="fa fa-filter"
								onClick={() => setFilterSelector(!showFilterSelector)}
							/>

							{/*show if icon is clicked*/}
							{showFilterSelector && (
								<div>
									{/*Check if filters in filtersMap and show corresponding selection*/}
									{!filterMap || false ? (
										// Show if no filters in filtersList
										<select
											defaultValue={t(
												"TABLE_FILTERS.FILTER_SELECTION.NO_OPTIONS"
											)}
											className="main-filter"
										>
											<option disabled>
												{t("TABLE_FILTERS.FILTER_SELECTION.NO_OPTIONS")}
											</option>
										</select>
									) : (
										// Show all filtersMap as selectable options
										<select
// @ts-expect-error TS(2322): Type '{ children: any[]; disable_search_threshold:... Remove this comment to see the full error message
											disable_search_threshold="10"
											onChange={(e) => handleChange(e)}
											value={selectedFilter}
											name="selectedFilter"
											className="main-filter"
										>
											<option value="" disabled>
												{t("TABLE_FILTERS.FILTER_SELECTION.PLACEHOLDER")}
											</option>
											{filterMap
												.filter(
													(filter) => filter.name !== "presentersBibliographic"
												)
												.map((filter, key) => (
													<option key={key} value={filter.name}>
														{t(filter.label).substr(0, 40)}
													</option>
												))}
										</select>
									)}
								</div>
							)}

							{/*Show selection of secondary filter if a main filter is chosen*/}
							{!!selectedFilter && (
								<div>
									{/*Show the secondary filter depending on the type of main filter chosen (select or period)*/}
									<FilterSwitch
										filterMap={filterMap}
										selectedFilter={selectedFilter}
										secondFilter={secondFilter}
										startDate={startDate}
										endDate={endDate}
										handleDate={handleDatepickerChange}
										handleDateConfirm={handleDatepickerConfirm}
										handleChange={handleChange}
									/>
								</div>
							)}

							{/* Show for each selected filter a blue label containing its name and option */}
							{filterMap.map((filter, key) => {
								return filter.value && (
									<span className="ng-multi-value" key={key}>
										<span>
											{
												// Use different representation of name and value depending on type of filter
												filter.type === "select" ? (
													renderBlueBox(filter)
												) : filter.type === "period" ? (
													<span>
														<span>
															{t(filter.label).substr(0, 40)}:
															{t("dateFormats.date.short", {
																date: new Date(filter.value.split("/")[0]),
															})}
															-
															{t("dateFormats.date.short", {
																date: new Date(filter.value.split("/")[1]),
															})}
														</span>
													</span>
												) : null
											}
										</span>
										{/* Remove icon in blue area around filter */}
										<button
											title={t("TABLE_FILTERS.REMOVE")}
											onClick={() => removeFilter(filter)}
											className="button-like-anchor"
										>
											<i className="fa fa-times" />
										</button>
									</span>
								);
							})}
						</div>

						{/* Remove icon to clear all filters */}
						<i
							onClick={removeFilters}
							title={t("TABLE_FILTERS.CLEAR")}
							className="clear fa fa-times"
						/>
						{/* Settings icon to open filters profile dialog (save and editing filter profiles)*/}
						<i
							onClick={() => setFilterSettings(!showFilterSettings)}
							title={t("TABLE_FILTERS.PROFILES.FILTERS_HEADER")}
							className="settings fa fa-cog fa-times"
						/>

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
	filterMap,
	selectedFilter,
	handleChange,
	startDate,
	endDate,
	handleDate,
	handleDateConfirm,
	secondFilter,
} : {
	filterMap: FilterData[],
	selectedFilter: string,
	handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
	startDate: Date | undefined,
	endDate: Date | undefined,
	handleDate: (date: Date | null, isStart?: boolean) => void,
	handleDateConfirm: (date: Date | undefined | null, isStart?: boolean) => void,
	secondFilter: string,
}) => {
	const { t } = useTranslation();

	const startDateRef = useRef<HTMLInputElement>(null);
	const endDateRef = useRef<HTMLInputElement>(null);

	let filter = filterMap.find(({ name }) => name === selectedFilter);
	if (!filter) {
		return null;
	}

	// eslint-disable-next-line default-case
	switch (filter.type) {
		case "select":
			return (
				<div>
					{/*Show only if selected main filter has translatable options*/}
					{filter.translatable ? (
						// Show if the selected main filter has no further options
						!filter.options || false ? (
							<select
								defaultValue={t("TABLE_FILTERS.FILTER_SELECTION.NO_OPTIONS")}
								className="second-filter"
							>
								<option disabled>
									{t("TABLE_FILTERS.FILTER_SELECTION.NO_OPTIONS")}
								</option>
							</select>
						) : (
							// Show further options for a secondary filter
							<select
								className="second-filter"
								onChange={(e) => handleChange(e)}
								value={secondFilter}
								name="secondFilter"
							>
								<option value="" disabled>
									{t("TABLE_FILTERS.FILTER_VALUE_SELECTION.PLACEHOLDER")}
								</option>
								{filter.options.map((option, key) => (
									<option key={key} value={option.value}>
										{t(option.label).substr(0, 40)}
									</option>
								))}
							</select>
						)
					) : // Show only if the selected main filter has options that are not translatable (else case from above)
					!filter.options || false ? (
						// Show if the selected main filter has no further options
						<select
							defaultValue={t("TABLE_FILTERS.FILTER_SELECTION.NO_OPTIONS")}
							className="second-filter"
						>
							<option disabled>
								{t("TABLE_FILTERS.FILTER_SELECTION.NO_OPTIONS")}
							</option>
						</select>
					) : (
						// Show further options for a secondary filter
						<select
							className="second-filter"
							onChange={(e) => handleChange(e)}
							value={secondFilter}
							name="secondFilter"
						>
							<option value="" disabled>
								{t("TABLE_FILTERS.FILTER_VALUE_SELECTION.PLACEHOLDER")}
							</option>
							{filter.options.map((option, key) => (
								<option key={key} value={option.value}>
									{option.label.substr(0, 40)}
								</option>
							))}
						</select>
					)}
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
						value={startDate}
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
						value={endDate}
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

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	resourceType: getResourceType(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(TableFilters);
