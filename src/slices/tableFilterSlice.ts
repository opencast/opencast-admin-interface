import { PayloadAction, SerializedError, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { relativeDateSpanToFilterValue } from '../utils/dateUtils';
import { createAppAsyncThunk } from '../createAsyncThunkWithTypes';
import { FilterProfile } from './tableFilterProfilesSlice';

/**
 * This file contains redux reducer for actions affecting the state of table filters
 * This information is used to filter the entries of the table in the main view.
 */

export type FilterData = {
	label: string,
	name: string,
	options?: {
		label: string,
		value: string,
	}[],
	translatable: boolean,
	type: string,
	resource: string, // Not from the backend. We set this to keep track of which table this filter belongs to
	value: string,
}

export type Stats = {
	count: number,
	description: string,
	filters: {
		filter: string,
		name: string,
		value: string,
	}[],
	name: string,
	order: number,
}

type TableFilterState = {
	status: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	error: SerializedError | null,
	statusStats: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	errorStats: SerializedError | null,
	currentResource: string,
	data: FilterData[],
	filterProfiles: FilterProfile[],
	textFilter: string,
	selectedFilter: string,
	secondFilter: string,
	stats: Stats[],
}

// Initial state of table filters in redux store
const initialState: TableFilterState = {
	status: 'uninitialized',
	error: null,
	statusStats: 'uninitialized',
	errorStats: null,
	currentResource: "",
	data: [],
	filterProfiles: [],
	textFilter: "",
	selectedFilter: "",
	secondFilter: "",
	stats: [],
};

// Fetch table filters from opencast instance and transform them for further use
export const fetchFilters = createAppAsyncThunk('tableFilters/fetchFilters', async (resource: TableFilterState["currentResource"], { getState }) => {
	const data = await axios.get(
		`/admin-ng/resources/${resource}/filters.json`
	);
	const resourceData = await data.data;

	const filters = transformResponse(resourceData);
	const filtersList = Object.keys(filters.filters).map((key) => {
		let filter = filters.filters[key];
		filter.name = key;
		filter.resource = resource;
		return filter;
	});

	if (resource === "events") {
		filtersList.push({
			label: "FILTERS.EVENTS.PRESENTERS_BIBLIOGRAPHIC.LABEL",
			name: "presentersBibliographic",
			translatable: false,
			type: "select",
			resource: "events",
			value: "",
		});
	}

	// Do all this purely to keep set filter values saved if the tab gets switched
	let oldData = getState().tableFilters.data

	for (const oldFilter of oldData) {
		const foundIndex = filtersList.findIndex(x => x.name === oldFilter.name && x.resource === oldFilter.resource);
		if (foundIndex >= 0) {
			filtersList[foundIndex].value = oldFilter.value;
		}
	}

	oldData = oldData.filter(filter => filter.resource !== resource)
	filtersList.push(...oldData)

	return { filtersList, resource };
});

export const fetchStats = createAppAsyncThunk('tableFilters/fetchStats', async () => {
	// fetch information about possible status an event can have
	let data = await axios.get("/admin-ng/resources/STATS.json");
	let response = await data.data;

	// transform response
	const statsResponse = Object.keys(response).map((key) => {
		let stat = JSON.parse(response[key]);
		stat.name = key;
		return stat;
	});

	let stats = [];

	// fetch for each status the corresponding count of events having this status
	for (const [i, _] of statsResponse.entries()) {
		let filter = [];
		for (let j in statsResponse[i].filters) {
			let value = statsResponse[i].filters[j].value;
			let name = statsResponse[i].filters[j].name;

			if (Object.prototype.hasOwnProperty.call(value, "relativeDateSpan")) {
				value = relativeDateSpanToFilterValue(
					value.relativeDateSpan.from,
					value.relativeDateSpan.to,
					value.relativeDateSpan.unit
				);
				// set date span as filter value
				statsResponse[i].filters[j].value = value;
			}
			filter.push(name + ":" + value);
		}
		let data = await axios.get("/admin-ng/event/events.json", {
			params: {
				filter: filter.join(","),
				limit: 1,
			},
		});

		let response = await data.data;

		// add count to status information fetched before
		statsResponse[i] = {
			...statsResponse[i],
			count: response.total,
		};

		// fill stats array for redux state
		stats.push(statsResponse[i]);
	}

	stats.sort(compareOrder);

	return stats;
});

export const setSpecificEventFilter = createAppAsyncThunk('tableFilters/setSpecificEventFilter', async (params: { filter: string, filterValue: string }, { dispatch, getState }) => {
	const { filter, filterValue } = params;
	const { tableFilters } = getState();

	let filterToChange = tableFilters.data.find(({ name }) => name === filter);

	if (!filterToChange) {
		await dispatch(fetchFilters("events"));
	}

	if (!!filterToChange) {
		await dispatch(editFilterValue({
			filterName: filterToChange.name,
			value: filterValue
		}));
	}
});

export const setSpecificServiceFilter = createAppAsyncThunk('tableFilters/setSpecificServiceFilter', async (params: { filter: string, filterValue: string }, { dispatch, getState }) => {
	const { filter, filterValue } = params;
	const { tableFilters } = getState();

	let filterToChange = tableFilters.data.find(({ name }) => name === filter);

	if (!filterToChange) {
		await dispatch(fetchFilters("services"));
	}

	if (!!filterToChange) {
		await dispatch(editFilterValue({
			filterName: filterToChange.name,
			value: filterValue
		}));
	}
});

// Transform received filter.json to a structure that can be used for filtering
function transformResponse(data: {
	[key: string]: {
		value: string,
		label: string,
		options?: { [key: string]: string },
		name: string
		translatable: boolean,
		type: string,
		resource: string,
	}
}) {
	type ParsedFilters = {
		[key: string]: {
			value: string
			label: string
			options?: { value: string, label: string }[]
			name: string
			translatable: boolean,
			type: string,
			resource: string,
		}
	}

	let filters = Object.keys(data).reduce((acc, key) => {
		let newOptions: {
			label: string,
			value: string,
		}[] = []
		acc[key] = {
			...data[key],
			options: newOptions
		};
		return acc;
	}, {} as ParsedFilters);

	try {
		for (let key in data) {
			filters[key].value = "";
			if (!data[key].options) {
				continue;
			}
			let filterArr: { value: string, label: string }[] = [];
			let options = data[key].options;
			for (let subKey in options) {
				filterArr.push({ value: subKey, label: options[subKey] });
			}
			filterArr = filterArr.sort(function (a, b) {
				if (a.label.toLowerCase() < b.label.toLowerCase()) {
					return -1;
				}
				if (a.label.toLowerCase() > b.label.toLowerCase()) {
					return 1;
				}
				return 0;
			});
			filters[key].options = filterArr;
		}
	} catch (e) {
		let errorMessage;
		if (e instanceof Error) {
			errorMessage = e.message
		} else {
			errorMessage = String(e);
		}
		console.error(errorMessage);
	}

	return { filters: filters };
}

// compare function for sort stats array by order property
const compareOrder = (a: { order: number }, b: { order: number }) => {
	if (a.order < b.order) {
		return -1;
	}
	if (a.order > b.order) {
		return 1;
	}
	return 0;
};


const tableFilterSlice = createSlice({
	name: 'tableFilters',
	initialState,
	reducers: {
		editFilterValue(state, action: PayloadAction<{
			filterName: TableFilterState["data"][0]["name"],
			value: TableFilterState["data"][0]["value"],
		}>) {
			const { filterName, value } = action.payload;
			state.data = state.data.map((filter) => {
				return filter.name === filterName
					? { ...filter, value: value }
					: filter;
			})
		},
		resetFilterValues(state) {
			state.data = state.data.map((filter) => {
				return { ...filter, value: "" };
			})
		},
		editTextFilter(state, action: PayloadAction<
			TableFilterState["textFilter"]
		>) {
			const textFilter = action.payload;
			state.textFilter = textFilter;
		},
		removeTextFilter(state) {
			state.textFilter = "";
		},
		loadFilterProfile(state, action: PayloadAction<
			TableFilterState["data"]
		>) {
			const filterMap = action.payload;
			state.data = filterMap;
		},
		editSelectedFilter(state, action: PayloadAction<
			TableFilterState["selectedFilter"]
		>) {
			const filter = action.payload;
			state.selectedFilter = filter;
		},
		removeSelectedFilter(state) {
			state.selectedFilter = "";
		},
		editSecondFilter(state, action: PayloadAction<
			TableFilterState["secondFilter"]
		>) {
			const filter = action.payload;
			state.secondFilter = filter;
		},
		removeSecondFilter(state) {
			state.secondFilter = "";
		},
	},
	extraReducers: builder => {
		builder
			.addCase(fetchFilters.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchFilters.fulfilled, (state, action: PayloadAction<{
				filtersList: TableFilterState["data"],
				resource: TableFilterState["currentResource"],
			}>) => {
				state.status = 'succeeded';
				const tableFilters = action.payload;
				state.data = tableFilters.filtersList;
				state.currentResource = tableFilters.resource;

			})
			.addCase(fetchFilters.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error;
			})
			.addCase(fetchStats.pending, (state) => {
				state.statusStats = 'loading';
			})
			.addCase(fetchStats.fulfilled, (state, action: PayloadAction<
				TableFilterState["stats"]
			>) => {
				state.statusStats = 'succeeded';
				const stats = action.payload;
				state.stats = stats;
			})
			.addCase(fetchStats.rejected, (state, action) => {
				state.statusStats = 'failed';
				state.errorStats = action.error;
			});
	}
});

export const {
	editFilterValue,
	resetFilterValues,
	editTextFilter,
	removeTextFilter,
	loadFilterProfile,
	editSelectedFilter,
	removeSelectedFilter,
	editSecondFilter,
	removeSecondFilter
} = tableFilterSlice.actions;

// Export the slice reducer as the default export
export default tableFilterSlice.reducer;
