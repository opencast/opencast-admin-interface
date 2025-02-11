import { fetchEvents } from "../../../slices/eventSlice";
import { fetchLifeCyclePolicies } from "../../../slices/lifeCycleSlice";
import { fetchSeries } from "../../../slices/seriesSlice";
import { fetchStats } from "../../../slices/tableFilterSlice";
import { AppDispatch } from "../../../store";
import { loadEventsIntoTable, loadLifeCyclePoliciesIntoTable, loadSeriesIntoTable } from "../../../thunks/tableThunks";

/**
 * Utility file for the navigation bar
 */

export const loadEvents = (dispatch: AppDispatch) => {
	// Fetching stats from server
	dispatch(fetchStats());

	// Fetching events from server
	dispatch(fetchEvents());

	// Load events into table
	dispatch(loadEventsIntoTable());
};

export const loadSeries = (dispatch: AppDispatch) => {
	// fetching series from server
	dispatch(fetchSeries());

	// load series into table
	dispatch(loadSeriesIntoTable());
};

export const loadLifeCyclePolicies = (dispatch: AppDispatch) => {
	// Fetching policies from server
	dispatch(fetchLifeCyclePolicies());

	// Load policies into table
	dispatch(loadLifeCyclePoliciesIntoTable());
};

export const eventsLinks = [
	{
		path: "/events/events",
		accessRole: "ROLE_UI_EVENTS_VIEW",
		loadFn: loadEvents,
		text: "EVENTS.EVENTS.NAVIGATION.EVENTS"
	},
	{
		path: "/events/series",
		accessRole: "ROLE_UI_SERIES_VIEW",
		loadFn: loadSeries,
		text: "EVENTS.EVENTS.NAVIGATION.SERIES"
	},
	{
		path: "/events/lifeCyclePolicies",
		accessRole: "ROLE_UI_LIFECYCLEPOLICIES_VIEW",
		loadFn: loadLifeCyclePolicies,
		text: "LIFECYCLE.NAVIGATION.POLICIES"
	}
];
