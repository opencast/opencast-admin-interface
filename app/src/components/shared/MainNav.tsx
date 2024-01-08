import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import {
	loadAclsIntoTable,
	loadEventsIntoTable,
	loadGroupsIntoTable,
	loadJobsIntoTable,
	loadRecordingsIntoTable,
	loadSeriesIntoTable,
	loadServersIntoTable,
	loadServicesIntoTable,
	loadThemesIntoTable,
	loadUsersIntoTable,
} from "../../thunks/tableThunks";
import { fetchEvents } from "../../thunks/eventThunks";
import { fetchRecordings } from "../../thunks/recordingThunks";
import { fetchJobs } from "../../thunks/jobThunks";
import { fetchUsers } from "../../thunks/userThunks";
import { fetchThemes } from "../../thunks/themeThunks";
import { fetchFilters, fetchStats } from "../../thunks/tableFilterThunks";
import { setOffset } from "../../actions/tableActions";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { fetchSeries } from "../../thunks/seriesThunks";
import { fetchServers } from "../../thunks/serverThunks";
import { fetchServices } from "../../slices/serviceSlice";
import { fetchGroups } from "../../thunks/groupThunks";
import { GlobalHotKeys } from "react-hotkeys";
import { availableHotkeys } from "../../configs/hotkeysConfig";
import { fetchAcls } from "../../slices/aclSlice";
import { useAppDispatch } from "../../store";

/**
 * This component renders the main navigation that opens when the burger button is clicked
 */
const MainNav = ({
// @ts-expect-error TS(7031): Binding element 'isOpen' implicitly has an 'any' t... Remove this comment to see the full error message
	isOpen,
// @ts-expect-error TS(7031): Binding element 'toggleMenu' implicitly has an 'an... Remove this comment to see the full error message
	toggleMenu,
// @ts-expect-error TS(7031): Binding element 'loadingEvents' implicitly has an ... Remove this comment to see the full error message
	loadingEvents,
// @ts-expect-error TS(7031): Binding element 'loadingEventsIntoTable' implicitl... Remove this comment to see the full error message
	loadingEventsIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingSeries' implicitly has an ... Remove this comment to see the full error message
	loadingSeries,
// @ts-expect-error TS(7031): Binding element 'loadingSeriesIntoTable' implicitl... Remove this comment to see the full error message
	loadingSeriesIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingStats' implicitly has an '... Remove this comment to see the full error message
	loadingStats,
// @ts-expect-error TS(7031): Binding element 'loadingRecordings' implicitly has... Remove this comment to see the full error message
	loadingRecordings,
// @ts-expect-error TS(7031): Binding element 'loadingRecordingsIntoTable' impli... Remove this comment to see the full error message
	loadingRecordingsIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingJobs' implicitly has an 'a... Remove this comment to see the full error message
	loadingJobs,
// @ts-expect-error TS(7031): Binding element 'loadingJobsIntoTable' implicitly ... Remove this comment to see the full error message
	loadingJobsIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingServers' implicitly has an... Remove this comment to see the full error message
	loadingServers,
// @ts-expect-error TS(7031): Binding element 'loadingServersIntoTable' implicit... Remove this comment to see the full error message
	loadingServersIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingServicesIntoTable' implici... Remove this comment to see the full error message
	loadingServicesIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingUsers' implicitly has an '... Remove this comment to see the full error message
	loadingUsers,
// @ts-expect-error TS(7031): Binding element 'loadingUsersIntoTable' implicitly... Remove this comment to see the full error message
	loadingUsersIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingGroups' implicitly has an ... Remove this comment to see the full error message
	loadingGroups,
// @ts-expect-error TS(7031): Binding element 'loadingGroupsIntoTable' implicitl... Remove this comment to see the full error message
	loadingGroupsIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingAclsIntoTable' implicitly ... Remove this comment to see the full error message
	loadingAclsIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingThemes' implicitly has an ... Remove this comment to see the full error message
	loadingThemes,
// @ts-expect-error TS(7031): Binding element 'loadingThemesIntoTable' implicitl... Remove this comment to see the full error message
	loadingThemesIntoTable,
// @ts-expect-error TS(7031): Binding element 'resetOffset' implicitly has an 'a... Remove this comment to see the full error message
	resetOffset,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
// @ts-expect-error TS(7031): Binding element 'loadingFilters' implicitly has an... Remove this comment to see the full error message
	loadingFilters,
}) => {
	const { t } = useTranslation();
        const dispatch = useAppDispatch();
	let navigate = useNavigate();

	const loadEvents = () => {
		loadingFilters("events");

		// Reset the current page to first page
		resetOffset();

		// Fetching stats from server
		loadingStats();

		// Fetching events from server
		loadingEvents();

		// Load events into table
		loadingEventsIntoTable();
	};

	const loadSeries = () => {
		loadingFilters("series");

		// Reset the current page to first page
		resetOffset();

		// Fetching series from server
		loadingSeries();

		// Load series into table
		loadingSeriesIntoTable();
	};

	const loadRecordings = () => {
		loadingFilters("recordings");

		// Reset the current page to first page
		resetOffset();

		// Fetching recordings from server
		loadingRecordings();

		// Load recordings into table
		loadingRecordingsIntoTable();
	};

	const loadJobs = () => {
		loadingFilters("jobs");

		// Reset the current page to first page
		resetOffset();

		// Fetching jobs from server
		loadingJobs();

		// Load jobs into table
		loadingJobsIntoTable();
	};

	const loadServers = () => {
		loadingFilters("servers");

		// Reset the current page to first page
		resetOffset();

		// Fetching servers from server
		loadingServers();

		// Load servers into table
		loadingServersIntoTable();
	};

	const loadServices = () => {
		loadingFilters("services");

		// Reset the current page to first page
		resetOffset();

		// Fetching services from server
		dispatch(fetchServices());

		// Load services into table
		loadingServicesIntoTable();
	};

	const loadUsers = () => {
		loadingFilters("users");

		// Reset the current page to first page
		resetOffset();

		// Fetching users from server
		loadingUsers();

		// Load users into table
		loadingUsersIntoTable();
	};

	const loadGroups = () => {
		loadingFilters("groups");

		// Reset the current page to first page
		resetOffset();

		// Fetching groups from server
		loadingGroups();

		// Load groups into table
		loadingGroupsIntoTable();
	};

	const loadAcls = () => {
		loadingFilters("acls");

		// Reset the current page to first page
		resetOffset();

		// Fetching acls from server
        dispatch(fetchAcls());

		// Load acls into table
		loadingAclsIntoTable();
	};

	const loadThemes = () => {
		loadingFilters("themes");

		// Reset the current page to first page
		resetOffset();

		// Fetching themes from server
		loadingThemes();

		// Load themes into table
		loadingThemesIntoTable();
	};

	const hotkeyLoadEvents = () => {
		navigate("/events/events");
	};

	const hotkeyLoadSeries = () => {
		navigate("/events/series");
	};

	const hotKeyHandlers = {
		EVENT_VIEW: hotkeyLoadEvents,
		SERIES_VIEW: hotkeyLoadSeries,
		MAIN_MENU: toggleMenu,
	};
	return (
		<>
			<GlobalHotKeys
// @ts-expect-error TS(2769): No overload matches this call.
				keyMap={availableHotkeys.general}
				handlers={hotKeyHandlers}
			/>
			<div className="menu-top" onClick={() => toggleMenu()}>
				{isOpen && (
					<nav id="roll-up-menu">
						<div id="nav-container">
							{/* todo: more than one href? how? roles? (see MainNav admin-ui-frontend)*/}
							{hasAccess("ROLE_UI_NAV_RECORDINGS_VIEW", user) &&
								(hasAccess("ROLE_UI_EVENTS_VIEW", user) ? (
									<Link to="/events/events" onClick={() => loadEvents()}>
										<i className="events" title={t<string>("NAV.EVENTS.TITLE")} />
									</Link>
								) : (
									hasAccess("ROLE_UI_SERIES_VIEW", user) && (
										<Link to="/events/series" onClick={() => loadSeries()}>
											<i className="events" title={t<string>("NAV.EVENTS.TITLE")} />
										</Link>
									)
								))}
							{hasAccess("ROLE_UI_NAV_CAPTURE_VIEW", user) &&
								hasAccess("ROLE_UI_LOCATIONS_VIEW", user) && (
									<Link
										to="/recordings/recordings"
										onClick={() => loadRecordings()}
									>
										<i
											className="recordings"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
											title={t("NAV.CAPTUREAGENTS.TITLE")}
										/>
									</Link>
								)}
							{hasAccess("ROLE_UI_NAV_SYSTEMS_VIEW", user) &&
								(hasAccess("ROLE_UI_JOBS_VIEW", user) ? (
									<Link to="/systems/jobs" onClick={() => loadJobs()}>
										<i className="systems" title={t<string>("NAV.SYSTEMS.TITLE")} />
									</Link>
								) : hasAccess("ROLE_UI_SERVERS_VIEW", user) ? (
									<Link to="/systems/servers" onClick={() => loadServers()}>
										<i className="systems" title={t<string>("NAV.SYSTEMS.TITLE")} />
									</Link>
								) : (
									hasAccess("ROLE_UI_SERVICES_VIEW", user) && (
										<Link to="/systems/services" onClick={() => loadServices()}>
											<i className="systems" title={t<string>("NAV.SYSTEMS.TITLE")} />
										</Link>
									)
								))}
							{hasAccess("ROLE_UI_NAV_ORGANIZATION_VIEW", user) &&
								(hasAccess("ROLE_UI_USERS_VIEW", user) ? (
									<Link to="/users/users" onClick={() => loadUsers()}>
										<i className="users" title={t<string>("NAV.USERS.TITLE")} />
									</Link>
								) : hasAccess("ROLE_UI_GROUPS_VIEW", user) ? (
									<Link to="/users/groups" onClick={() => loadGroups()}>
										<i className="users" title={t<string>("NAV.USERS.TITLE")} />
									</Link>
								) : (
									hasAccess("ROLE_UI_ACLS_VIEW", user) && (
										<Link to="/users/acls" onClick={() => loadAcls()}>
											<i className="users" title={t<string>("NAV.USERS.TITLE")} />
										</Link>
									)
								))}
							{hasAccess("ROLE_UI_NAV_CONFIGURATION_VIEW", user) &&
								hasAccess("ROLE_UI_THEMES_VIEW", user) && (
									<Link to="/configuration/themes" onClick={() => loadThemes()}>
										<i
											className="configuration"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
											title={t("NAV.CONFIGURATION.TITLE")}
										/>
									</Link>
								)}
							{hasAccess("ROLE_UI_NAV_STATISTICS_VIEW", user) &&
								hasAccess("ROLE_UI_STATISTICS_ORGANIZATION_VIEW", user) && (
									<Link to="/statistics/organization">
										<i
											className="statistics"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
											title={t("NAV.STATISTICS.TITLE")}
										/>
									</Link>
								)}
						</div>
					</nav>
				)}
			</div>
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	user: getUserInformation(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadingEvents: () => dispatch(fetchEvents()),
	loadingEventsIntoTable: () => dispatch(loadEventsIntoTable()),
	loadingSeries: () => dispatch(fetchSeries()),
	loadingSeriesIntoTable: () => dispatch(loadSeriesIntoTable()),
	loadingStats: () => dispatch(fetchStats()),
// @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
	loadingRecordings: () => dispatch(fetchRecordings()),
	loadingRecordingsIntoTable: () => dispatch(loadRecordingsIntoTable()),
	loadingJobs: () => dispatch(fetchJobs()),
	loadingJobsIntoTable: () => dispatch(loadJobsIntoTable()),
	loadingServers: () => dispatch(fetchServers()),
	loadingServersIntoTable: () => dispatch(loadServersIntoTable()),
	loadingServicesIntoTable: () => dispatch(loadServicesIntoTable()),
	loadingUsers: () => dispatch(fetchUsers()),
	loadingUsersIntoTable: () => dispatch(loadUsersIntoTable()),
	loadingGroups: () => dispatch(fetchGroups()),
	loadingGroupsIntoTable: () => dispatch(loadGroupsIntoTable()),
	loadingAclsIntoTable: () => dispatch(loadAclsIntoTable()),
	loadingThemes: () => dispatch(fetchThemes()),
	loadingThemesIntoTable: () => dispatch(loadThemesIntoTable()),
	resetOffset: () => dispatch(setOffset(0)),
// @ts-expect-error TS(7006): Parameter 'resource' implicitly has an 'any' type.
	loadingFilters: (resource) => dispatch(fetchFilters(resource)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainNav);
