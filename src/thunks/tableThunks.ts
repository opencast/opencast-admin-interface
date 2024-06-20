import { eventsTableConfig } from "../configs/tableConfigs/eventsTableConfig";
import { seriesTableConfig } from "../configs/tableConfigs/seriesTableConfig";
import { recordingsTableConfig } from "../configs/tableConfigs/recordingsTableConfig";
import { jobsTableConfig } from "../configs/tableConfigs/jobsTableConfig";
import { serversTableConfig } from "../configs/tableConfigs/serversTableConfig";
import { servicesTableConfig } from "../configs/tableConfigs/servicesTableConfig";
import { usersTableConfig } from "../configs/tableConfigs/usersTableConfig";
import { groupsTableConfig } from "../configs/tableConfigs/groupsTableConfig";
import { aclsTableConfig } from "../configs/tableConfigs/aclsTableConfig";
import { themesTableConfig } from "../configs/tableConfigs/themesTableConfig";
import {
	deselectAll,
	loadResourceIntoTable,
	selectAll,
	selectRow,
	setOffset,
	setPageActive,
	setPages,
} from "../actions/tableActions";
import {
	setEventColumns,
	setShowActions as showEventsActions,
	fetchEvents,
} from "../slices/eventSlice";
import {
	getPageOffset,
	getResourceType,
	getSelectedRows,
	getTablePages,
	getTablePagination,
} from "../selectors/tableSelectors";
import {
	fetchSeries,
	setSeriesColumns,
	showActionsSeries,
} from "../slices/seriesSlice";
import { fetchJobs, setJobColumns } from "../slices/jobSlice";
import { fetchServers, setServerColumns } from "../slices/serverSlice";
import { fetchServices, setServiceColumns } from "../slices/serviceSlice";
import { fetchUsers, setUserColumns } from "../slices/userSlice";
import { fetchGroups } from "../slices/groupSlice";
import { fetchThemes, setThemeColumns } from "../slices/themeSlice";
import { fetchRecordings, setRecordingsColumns } from "../slices/recordingSlice";
import { setGroupColumns } from "../slices/groupSlice";
import { fetchAcls, setAclColumns } from "../slices/aclSlice";

/**
 * This file contains methods/thunks used to manage the table in the main view and its state changes
 * */

// Method to load events into the table
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const loadEventsIntoTable = () => async (dispatch, getState) => {
	const { events, table } = getState();
	const total = events.total;

	const pagination = table.pagination;
	// check which events are currently selected
// @ts-expect-error TS(7006): Parameter 'result' implicitly has an 'any' type.
	const resource = events.results.map((result) => {
// @ts-expect-error TS(7006): Parameter 'row' implicitly has an 'any' type.
		const current = table.rows.find((row) => row.id === result.id);

		if (!!current && table.resource === "events") {
			return {
				...result,
				selected: current.selected,
			};
		} else {
			return {
				...result,
				selected: false,
			};
		}
	});

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	let tableData = {
		resource: "events",
		rows: resource,
		columns: events.columns,
		multiSelect: table.multiSelect,
		pages: pages,
		sortBy: table.sortBy,
		reverse: table.reverse,
		totalItems: total,
	};

	if (table.resource !== "events") {
		const multiSelect = eventsTableConfig.multiSelect;

		tableData = {
			...tableData,
			sortBy: "date",
			reverse: "DESC",
			multiSelect: multiSelect,
		};
	}
	dispatch(loadResourceIntoTable(tableData));
};

// Method to load series into the table
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const loadSeriesIntoTable = () => (dispatch, getState) => {
	const { series, table } = getState();
	const total = series.total;
	const pagination = table.pagination;

	// check which events are currently selected
// @ts-expect-error TS(7006): Parameter 'result' implicitly has an 'any' type.
	const resource = series.results.map((result) => {
// @ts-expect-error TS(7006): Parameter 'row' implicitly has an 'any' type.
		const current = table.rows.find((row) => row.id === result.id);

		if (!!current && table.resource === "series") {
			return {
				...result,
				selected: current.selected,
			};
		} else {
			return {
				...result,
				selected: false,
			};
		}
	});

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	let tableData = {
		resource: "series",
		rows: resource,
		columns: series.columns,
		multiSelect: table.multiSelect,
		pages: pages,
		sortBy: table.sortBy,
		reverse: table.reverse,
		totalItems: total,
	};

	if (table.resource !== "series") {
		const multiSelect = seriesTableConfig.multiSelect;

		tableData = {
			...tableData,
			sortBy: "title",
			reverse: "ASC",
			multiSelect: multiSelect,
		};
	}
	dispatch(loadResourceIntoTable(tableData));
};

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const loadRecordingsIntoTable = () => (dispatch, getState) => {
	const { recordings, table } = getState();
	const pagination = table.pagination;
	const resource = recordings.results;
	const total = recordings.total;

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	let tableData = {
		resource: "recordings",
		columns: recordings.columns,
		multiSelect: table.multiSelect,
		pages: pages,
		sortBy: table.sortBy,
		reverse: table.reverse,
		rows: resource,
		totalItems: total,
	};

	if (table.resource !== "recordings") {
		const multiSelect = recordingsTableConfig.multiSelect;

		tableData = {
			...tableData,
			sortBy: "status",
			reverse: "ASC",
			multiSelect: multiSelect,
		};
	}

	dispatch(loadResourceIntoTable(tableData));
};

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const loadJobsIntoTable = () => (dispatch, getState) => {
	const { jobs, table } = getState();
	const pagination = table.pagination;
	const resource = jobs.results;
	const total = jobs.total;

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	let tableData = {
		resource: "jobs",
		rows: resource,
		columns: jobs.columns,
		multiSelect: table.multiSelect,
		pages: pages,
		sortBy: table.sortBy,
		reverse: table.reverse,
		totalItems: total,
	};

	if (table.resource !== "jobs") {
		const multiSelect = jobsTableConfig.multiSelect;

		tableData = {
			...tableData,
			sortBy: "id",
			reverse: "ASC",
			multiSelect: multiSelect,
		};
	}
	dispatch(loadResourceIntoTable(tableData));
};

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const loadServersIntoTable = () => (dispatch, getState) => {
	const { servers, table } = getState();
	const pagination = table.pagination;
	const resource = servers.results;
	const total = servers.total;

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	let tableData = {
		resource: "servers",
		rows: resource,
		columns: servers.columns,
		multiSelect: table.multiSelect,
		pages: pages,
		sortBy: table.sortBy,
		reverse: table.reverse,
		totalItems: total,
	};

	if (table.resource !== "servers") {
		const multiSelect = serversTableConfig.multiSelect;

		tableData = {
			...tableData,
			sortBy: "online",
			reverse: "ASC",
			multiSelect: multiSelect,
		};
	}
	dispatch(loadResourceIntoTable(tableData));
};

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const loadServicesIntoTable = () => (dispatch, getState) => {
	const { services, table } = getState();
	const pagination = table.pagination;
	const resource = services.results;
	const total = services.total;

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	let tableData = {
		rows: resource,
		pages: pages,
		totalItems: total,
		resource: "services",
		columns: services.columns,
		multiSelect: table.multiSelect,
		sortBy: table.sortBy,
		reverse: table.reverse,
	};

	if (table.resource !== "services") {
		const multiSelect = servicesTableConfig.multiSelect;

		tableData = {
			...tableData,
			sortBy: "status",
			reverse: "ASC",
			multiSelect: multiSelect,
		};
	}

	dispatch(loadResourceIntoTable(tableData));
};

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const loadUsersIntoTable = () => (dispatch, getState) => {
	const { users, table } = getState();
	const pagination = table.pagination;
	const resource = users.results;
	const total = users.total;

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	let tableData = {
		resource: "users",
		rows: resource,
		columns: users.columns,
		multiSelect: table.multiSelect,
		pages: pages,
		sortBy: table.sortBy,
		reverse: table.reverse,
		totalItems: total,
	};

	if (table.resource !== "users") {
		const multiSelect = usersTableConfig.multiSelect;

		tableData = {
			...tableData,
			sortBy: "name",
			reverse: "ASC",
			multiSelect: multiSelect,
		};
	}
	dispatch(loadResourceIntoTable(tableData));
};

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const loadGroupsIntoTable = () => (dispatch, getState) => {
	const { groups, table } = getState();
	const pagination = table.pagination;
	const resource = groups.results;
	const total = groups.total;

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	let tableData = {
		resource: "groups",
		rows: resource,
		columns: groups.columns,
		multiSelect: table.multiSelect,
		pages: pages,
		sortBy: table.sortBy,
		reverse: table.reverse,
		totalItems: total,
	};

	if (table.resource !== "groups") {
		const multiSelect = groupsTableConfig.multiSelect;

		tableData = {
			...tableData,
			sortBy: "name",
			reverse: "ASC",
			multiSelect: multiSelect,
		};
	}
	dispatch(loadResourceIntoTable(tableData));
};

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const loadAclsIntoTable = () => (dispatch, getState) => {
	const { acls, table } = getState();
	const pagination = table.pagination;
	const resource = acls.results;
	const total = acls.total;

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	let tableData = {
		resource: "acls",
		rows: resource,
		columns: acls.columns,
		multiSelect: table.multiSelect,
		pages: pages,
		sortBy: table.sortBy,
		reverse: table.reverse,
		totalItems: total,
	};

	if (table.resource !== "acls") {
		const multiSelect = aclsTableConfig.multiSelect;
		tableData = {
			...tableData,
			sortBy: "name",
			reverse: "ASC",
			multiSelect: multiSelect,
		};
	}
	dispatch(loadResourceIntoTable(tableData));
};

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const loadThemesIntoTable = () => (dispatch, getState) => {
	const { themes, table } = getState();
	const pagination = table.pagination;
	const resource = themes.results;
	const total = themes.total;

	const pages = calculatePages(total / pagination.limit, pagination.offset);

	let tableData = {
		resource: "themes",
		rows: resource,
		columns: themes.columns,
		multiSelect: table.multiSelect,
		pages: pages,
		sortBy: table.sortBy,
		reverse: table.reverse,
		totalItems: total,
	};

	if (table.resource !== "themes") {
		const multiSelect = themesTableConfig.multiSelect;

		tableData = {
			...tableData,
			sortBy: "name",
			reverse: "ASC",
			multiSelect: multiSelect,
		};
	}
	dispatch(loadResourceIntoTable(tableData));
};

// Navigate between pages
// @ts-expect-error TS(7006): Parameter 'pageNumber' implicitly has an 'any' typ... Remove this comment to see the full error message
export const goToPage = (pageNumber) => async (dispatch, getState) => {
	dispatch(deselectAll());
	dispatch(setOffset(pageNumber));

	const state = getState();
	const offset = getPageOffset(state);
	const pages = getTablePages(state);

	dispatch(setPageActive(pages[offset].number));

	// Get resources of page and load them into table
	// eslint-disable-next-line default-case
	switch (getResourceType(state)) {
		case "events": {
			await dispatch(fetchEvents());
			dispatch(loadEventsIntoTable());
			break;
		}
		case "series": {
			await dispatch(fetchSeries());
			dispatch(loadSeriesIntoTable());
			break;
		}
		case "recordings": {
			await dispatch(fetchRecordings());
			dispatch(loadRecordingsIntoTable());
			break;
		}
		case "jobs": {
			await dispatch(fetchJobs());
			dispatch(loadJobsIntoTable());
			break;
		}
		case "servers": {
			await dispatch(fetchServers());
			dispatch(loadServersIntoTable());
			break;
		}
		case "services": {
			await dispatch(fetchServices());
			dispatch(loadServicesIntoTable());
			break;
		}
		case "users": {
			await dispatch(fetchUsers());
			dispatch(loadUsersIntoTable());
			break;
		}
		case "groups": {
			await dispatch(fetchGroups());
			dispatch(loadGroupsIntoTable());
			break;
		}
		case "acls": {
			await dispatch(fetchAcls());
			dispatch(loadAclsIntoTable());
			break;
		}
		case "themes": {
			await dispatch(fetchThemes());
			dispatch(loadThemesIntoTable());
			break;
		}
	}
};

// Update pages for example if page size was changed
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const updatePages = () => async (dispatch, getState) => {
	const state = getState();

	const pagination = getTablePagination(state);

	const pages = calculatePages(
		pagination.totalItems / pagination.limit,
		pagination.offset
	);

	dispatch(setPages(pages));

	// Get resources of page and load them into table
	// eslint-disable-next-line default-case
	switch (getResourceType(state)) {
		case "events": {
			await dispatch(fetchEvents());
			dispatch(loadEventsIntoTable());
			break;
		}
		case "series": {
			await dispatch(fetchSeries());
			dispatch(loadSeriesIntoTable());
			break;
		}
		case "recordings": {
			await dispatch(fetchRecordings());
			dispatch(loadRecordingsIntoTable());
			break;
		}
		case "jobs": {
			await dispatch(fetchJobs());
			dispatch(loadJobsIntoTable());
			break;
		}
		case "servers": {
			await dispatch(fetchServers());
			dispatch(loadServersIntoTable());
			break;
		}
		case "services": {
			await dispatch(fetchServices());
			dispatch(loadServicesIntoTable());
			break;
		}
		case "users": {
			await dispatch(fetchUsers());
			dispatch(loadUsersIntoTable());
			break;
		}
		case "groups": {
			await dispatch(fetchGroups());
			dispatch(loadGroupsIntoTable());
			break;
		}
		case "acls": {
			await dispatch(fetchAcls());
			dispatch(loadAclsIntoTable());
			break;
		}
		case "themes": {
			await dispatch(fetchThemes());
			dispatch(loadThemesIntoTable());
			break;
		}
	}
};

// Select all rows on table page
// @ts-expect-error TS(7006): Parameter 'selected' implicitly has an 'any' type.
export const changeAllSelected = (selected) => (dispatch, getState) => {
	const state = getState();

	if (selected) {
		// eslint-disable-next-line default-case
		switch (getResourceType(state)) {
			case "events": {
				dispatch(showEventsActions(true));
				break;
			}
			case "series": {
				dispatch(showActionsSeries(true));
				break;
			}
		}
		dispatch(selectAll());
	} else {
		// eslint-disable-next-line default-case
		switch (getResourceType(state)) {
			case "events": {
				dispatch(showEventsActions(false));
				break;
			}
			case "series": {
				dispatch(showActionsSeries(false));
				break;
			}
		}
		dispatch(deselectAll());
	}
};

// Select certain columns
// @ts-expect-error TS(7006): Parameter 'updatedColumns' implicitly has an 'any'... Remove this comment to see the full error message
export const changeColumnSelection = (updatedColumns) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch,
// @ts-expect-error TS(7006): Parameter 'getState' implicitly has an 'any' type.
	getState
) => {
	const state = getState();

	// eslint-disable-next-line default-case
	switch (getResourceType(state)) {
		case "events": {
			await dispatch(setEventColumns(updatedColumns));

			if (getSelectedRows(state).length > 0) {
				dispatch(showEventsActions(true));
			} else {
				dispatch(showEventsActions(false));
			}

			dispatch(loadEventsIntoTable());

			await dispatch(fetchEvents());
			dispatch(loadEventsIntoTable());

			break;
		}
		case "series": {
			await dispatch(setSeriesColumns(updatedColumns));

			if (getSelectedRows(state).length > 0) {
				dispatch(showActionsSeries(true));
			} else {
				dispatch(showActionsSeries(false));
			}

			dispatch(loadSeriesIntoTable());
			break;
		}
		case "recordings": {
			await dispatch(setRecordingsColumns(updatedColumns));
			dispatch(loadRecordingsIntoTable());
			break;
		}
		case "jobs": {
			await dispatch(setJobColumns(updatedColumns));
			dispatch(loadJobsIntoTable());
			break;
		}
		case "servers": {
			await dispatch(setServerColumns(updatedColumns));
			dispatch(loadServersIntoTable());
			break;
		}
		case "services": {
			await dispatch(setServiceColumns(updatedColumns));
			dispatch(loadServicesIntoTable());
			break;
		}
		case "users": {
			await dispatch(setUserColumns(updatedColumns));
			dispatch(loadUsersIntoTable());
			break;
		}
		case "groups": {
			await dispatch(setGroupColumns(updatedColumns));
			dispatch(loadGroupsIntoTable());
			break;
		}
		case "acls": {
			await dispatch(setAclColumns(updatedColumns));
			dispatch(loadAclsIntoTable());
			break;
		}
		case "themes": {
			await dispatch(setThemeColumns(updatedColumns));
			dispatch(loadThemesIntoTable());
			break;
		}
	}
};

// Select certain row
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
export const changeRowSelection = (id, selected) => (dispatch, getState) => {
	dispatch(selectRow(id, selected));

	const state = getState();

	// eslint-disable-next-line default-case
	switch (getResourceType(state)) {
		case "events": {
			if (getSelectedRows(state).length > 0) {
				dispatch(showEventsActions(true));
			} else {
				dispatch(showEventsActions(false));
			}
			break;
		}
		case "series": {
			if (getSelectedRows(state).length > 0) {
				dispatch(showActionsSeries(true));
			} else {
				dispatch(showActionsSeries(false));
			}
			break;
		}
	}
};

// @ts-expect-error TS(7006): Parameter 'numberOfPages' implicitly has an 'any' ... Remove this comment to see the full error message
const calculatePages = (numberOfPages, offset) => {
	const pages = [];

	for (let i = 0; i < numberOfPages || (i === 0 && numberOfPages === 0); i++) {
		pages.push({
			number: i,
			label: (i + 1).toString(),
			active: i === offset,
		});
	}

  if (pages.every(page => page.active === false)) {
    pages[0].active = true;
  }

	return pages;
};
