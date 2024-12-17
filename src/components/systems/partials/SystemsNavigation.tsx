import { fetchJobs } from "../../../slices/jobSlice";
import { fetchServers } from "../../../slices/serverSlice";
import { fetchServices } from "../../../slices/serviceSlice";
import { AppDispatch } from "../../../store";
import { loadJobsIntoTable, loadServersIntoTable, loadServicesIntoTable } from "../../../thunks/tableThunks";

/**
 * Utility file for the navigation bar
 */

export const loadJobs = async (dispatch: AppDispatch) => {
	// Fetching jobs from server
	await dispatch(fetchJobs());

	// Load jobs into table
	dispatch(loadJobsIntoTable());
};

export const loadServers = async (dispatch: AppDispatch) => {
	// Fetching servers from server
	await dispatch(fetchServers());

	// Load servers into table
	dispatch(loadServersIntoTable());
};

export const loadServices = async (dispatch: AppDispatch) => {
	// Fetching services from server
	await dispatch(fetchServices());

	// Load services into table
	dispatch(loadServicesIntoTable());
};

export const systemsLinks = [
	{
		path: "/systems/jobs",
		accessRole: "ROLE_UI_JOBS_VIEW",
		loadFn: loadJobs,
		text: "SYSTEMS.NAVIGATION.JOBS"
	},
	{
		path: "/systems/SERVERS",
		accessRole: "ROLE_UI_SERVERS_VIEW",
		loadFn: loadServers,
		text: "SYSTEMS.NAVIGATION.SERVERS"
	},
	{
		path: "/systems/services",
		accessRole: "ROLE_UI_SERVICES_VIEW",
		loadFn: loadServices,
		text: "SYSTEMS.NAVIGATION.SERVICES"
	},
];
