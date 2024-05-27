import { PayloadAction, SerializedError, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { relativeDateSpanToFilterValue } from '../utils/dateUtils';
import { RootState } from '../store';
import { setOffset } from '../actions/tableActions';
import { fetchEvents } from './eventSlice';
import { fetchServices } from './serviceSlice';
import { FilterProfile } from './tableFilterProfilesSlice';

/**
 * This file contains redux reducer for actions affecting the state of table filters
 * This information is used to filter the entries of the table in the main view.
 */

export type FilterData = {
	label: string,
	name: string,
	options: {
		label: string,
		value: string,
	}[],
	translatable: boolean,
	type: string,
	value: string,
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
	stats: {
		count: number,
		description: string,
		filters: {
			filter: string,
			name: string,
			value: string,
		}[],
		name: string,
		order: number,
	}[],
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
export const fetchFilters = createAsyncThunk('tableFilters/fetchFilters', async (resource: any, { getState }) => {
	const data = await axios.get(
		`/admin-ng/resources/${resource}/filters.json`
	);
	const resourceData = await data.data;

	const filters = transformResponse(resourceData);
	const filtersList = Object.keys(filters.filters).map((key) => {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
		let filter = filters.filters[key];
		filter.name = key;
		return filter;
	});

	if (resource === "events") {
		filtersList.push({ name: "presentersBibliographic" });
	}

	return { filtersList, resource };
});

export const fetchStats = createAsyncThunk('tableFilters/fetchStats', async () => {
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
	for (let i in statsResponse) {
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

export const setSpecificEventFilter = createAsyncThunk('tableFilters/setSpecificEventFilter', async (params: { filter: any, filterValue: any }, { dispatch, getState }) => {
	const { filter, filterValue } = params;
	await dispatch(fetchFilters("events"));

	const { tableFilters } = getState() as RootState;

	let filterToChange = tableFilters.data.find(({ name }) => name === filter);

	if (!!filterToChange) {
		await dispatch(editFilterValue({
			filterName: filterToChange.name,
			value: filterValue
		}));
	}

	dispatch(setOffset(0));

	dispatch(fetchStats());

	dispatch(fetchEvents());
});

export const setSpecificServiceFilter = createAsyncThunk('tableFilters/setSpecificServiceFilter', async (params: { filter: any, filterValue: any }, { dispatch, getState }) => {
	const { filter, filterValue } = params;
	await dispatch(fetchFilters("services"));

	const { tableFilters } = getState() as RootState;

	let filterToChange = tableFilters.data.find(({ name }) => name === filter);

	if (!!filterToChange) {
		await dispatch(editFilterValue({
			filterName: filterToChange.name,
			value: filterValue
		}));
	}

	dispatch(setOffset(0));

	dispatch(fetchServices());
});

// Transform received filter.json to a structure that can be used for filtering
// @ts-expect-error TS(7006): Parameter 'data' implicitly has an 'any' type.
function transformResponse(data) {
	let filters = {};
	try {
		filters = data;

		for (let key in filters) {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
			filters[key].value = "";
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
			if (!filters[key].options) {
				continue;
			}
			let filterArr = [];
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
			let options = filters[key].options;
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
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
			filters[key].options = filterArr;
		}
	} catch (e) {
// @ts-expect-error TS(2571): Object is of type 'unknown'.
		console.error(e.message);
	}

	return { filters: filters };
}

// compare function for sort stats array by order property
// @ts-expect-error TS(7006): Parameter 'a' implicitly has an 'any' type.
const compareOrder = (a, b) => {
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
