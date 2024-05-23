import {
	editFilterValue,
	loadFiltersFailure,
	loadFiltersInProgress,
	loadFiltersSuccess,
	loadStats,
} from "../actions/tableFilterActions";
import axios from "axios";
import { relativeDateSpanToFilterValue } from "../utils/dateUtils";
import { setOffset } from "../actions/tableActions";
import { fetchEvents } from "../slices/eventSlice";
import { fetchServices } from "../slices/serviceSlice";

/**
 * This file contains methods/thunks used to query the REST-API of Opencast to get the filters of a certain resource type.
 * This information is used to filter the entries of the table in the main view.
 *
 * */
// Fetch table filters from opencast instance and transform them for further use
// @ts-expect-error TS(7006): Parameter 'resource' implicitly has an 'any' type.
export const fetchFilters = (resource) => async (dispatch) => {
	try {
		dispatch(loadFiltersInProgress());

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

		await dispatch(loadFiltersSuccess(filtersList, resource));
	} catch (e) {
		dispatch(loadFiltersFailure());
		console.error(e);
	}
};

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const fetchStats = () => async (dispatch) => {
	try {
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

		dispatch(loadStats(stats));
	} catch (e) {
		console.error(e);
	}
};

// @ts-expect-error TS(7006): Parameter 'filter' implicitly has an 'any' type.
export const setSpecificEventFilter = (filter, filterValue) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch,
// @ts-expect-error TS(7006): Parameter 'getState' implicitly has an 'any' type.
	getState
) => {
	await dispatch(fetchFilters("events"));

	const { tableFilters } = getState();

// @ts-expect-error TS(7031): Binding element 'name' implicitly has an 'any' typ... Remove this comment to see the full error message
	let filterToChange = tableFilters.data.find(({ name }) => name === filter);

	if (!!filterToChange) {
		await dispatch(editFilterValue(filterToChange.name, filterValue));
	}

	dispatch(setOffset(0));

	dispatch(fetchStats());

	dispatch(fetchEvents());
};

// @ts-expect-error TS(7006): Parameter 'filter' implicitly has an 'any' type.
export const setSpecificServiceFilter = (filter, filterValue) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch,
// @ts-expect-error TS(7006): Parameter 'getState' implicitly has an 'any' type.
	getState
) => {
	await dispatch(fetchFilters("services"));

	const { tableFilters } = getState();

// @ts-expect-error TS(7031): Binding element 'name' implicitly has an 'any' typ... Remove this comment to see the full error message
	let filterToChange = tableFilters.data.find(({ name }) => name === filter);

	if (!!filterToChange) {
		await dispatch(editFilterValue(filterToChange.name, filterValue));
	}

	dispatch(setOffset(0));

	dispatch(fetchServices());
};

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
