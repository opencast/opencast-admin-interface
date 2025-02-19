import { fetchEvents } from "../../../slices/eventSlice";
import { fetchSeries } from "../../../slices/seriesSlice";
import { fetchStats } from "../../../slices/tableFilterSlice";
import { AppDispatch } from "../../../store";
import { loadEventsIntoTable, loadSeriesIntoTable } from "../../../thunks/tableThunks";

/**
 * Utility file for the navigation bar
 */

export const loadEvents = async(dispatch: AppDispatch) => {
	// Fetching stats from server
	await dispatch(fetchStats());

	// Fetching events from server
	await dispatch(fetchEvents());

	// Load events into table
	dispatch(loadEventsIntoTable());
};

export const loadSeries = async(dispatch: AppDispatch) => {
	// fetching series from server
	await dispatch(fetchSeries());

	// load series into table
	dispatch(loadSeriesIntoTable());
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
	}
];
