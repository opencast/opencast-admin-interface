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
import { fetchThemes } from "../../slices/themeSlice";
import { fetchFilters, fetchStats } from "../../slices/tableFilterSlice";
import { setOffset } from "../../actions/tableActions";
import {
	getOrgProperties,
	getUserInformation
} from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { fetchServices } from "../../slices/serviceSlice";
import { fetchGroups } from "../../slices/groupSlice";
import { useHotkeys } from "react-hotkeys-hook";
import { availableHotkeys } from "../../configs/hotkeysConfig";
import { fetchAcls } from "../../slices/aclSlice";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchRecordings } from "../../slices/recordingSlice";
import { fetchUsers } from "../../slices/userSlice";
import { fetchServers } from "../../slices/serverSlice";
import { fetchSeries } from "../../slices/seriesSlice";
import { fetchJobs } from "../../slices/jobSlice";
import { fetchEvents } from "../../slices/eventSlice";
import { Tooltip } from "./Tooltip";

/**
 * This component renders the main navigation that opens when the burger button is clicked
 */
const MainNav = ({
// @ts-expect-error TS(7031): Binding element 'isOpen' implicitly has an 'any' t... Remove this comment to see the full error message
	isOpen,
// @ts-expect-error TS(7031): Binding element 'toggleMenu' implicitly has an 'an... Remove this comment to see the full error message
	toggleMenu,
// @ts-expect-error TS(7031): Binding element 'loadingEventsIntoTable' implicitl... Remove this comment to see the full error message
	loadingEventsIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingSeriesIntoTable' implicitl... Remove this comment to see the full error message
	loadingSeriesIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingRecordingsIntoTable' impli... Remove this comment to see the full error message
	loadingRecordingsIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingJobsIntoTable' implicitly ... Remove this comment to see the full error message
	loadingJobsIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingServersIntoTable' implicit... Remove this comment to see the full error message
	loadingServersIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingServicesIntoTable' implici... Remove this comment to see the full error message
	loadingServicesIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingUsersIntoTable' implicitly... Remove this comment to see the full error message
	loadingUsersIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingGroupsIntoTable' implicitl... Remove this comment to see the full error message
	loadingGroupsIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingAclsIntoTable' implicitly ... Remove this comment to see the full error message
	loadingAclsIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingThemesIntoTable' implicitl... Remove this comment to see the full error message
	loadingThemesIntoTable,
// @ts-expect-error TS(7031): Binding element 'resetOffset' implicitly has an 'a... Remove this comment to see the full error message
	resetOffset,
}) => {
	const { t } = useTranslation();
        const dispatch = useAppDispatch();
	let navigate = useNavigate();

	const user = useAppSelector(state => getUserInformation(state));
	const orgProperties = useAppSelector(state => getOrgProperties(state));

	const statisticsEnabled = (orgProperties['admin.statistics.enabled'] || 'false').toLowerCase() === 'true';
	const themesEnabled = (orgProperties['admin.themes.enabled'] || 'true').toLowerCase() === 'true';

	const loadEvents = () => {
		dispatch(fetchFilters("events"));

		// Reset the current page to first page
		resetOffset();

		// Fetching stats from server
		dispatch(fetchStats());

		// Fetching events from server
		dispatch(fetchEvents());

		// Load events into table
		loadingEventsIntoTable();
	};

	const loadSeries = () => {
		dispatch(fetchFilters("series"));

		// Reset the current page to first page
		resetOffset();

		// Fetching series from server
		dispatch(fetchSeries());

		// Load series into table
		loadingSeriesIntoTable();
	};

	const loadRecordings = () => {
		dispatch(fetchFilters("recordings"));

		// Reset the current page to first page
		resetOffset();

		// Fetching recordings from server
		dispatch(fetchRecordings(undefined));

		// Load recordings into table
		loadingRecordingsIntoTable();
	};

	const loadJobs = () => {
		dispatch(fetchFilters("jobs"));

		// Reset the current page to first page
		resetOffset();

		// Fetching jobs from server
		dispatch(fetchJobs());

		// Load jobs into table
		loadingJobsIntoTable();
	};

	const loadServers = () => {
		dispatch(fetchFilters("servers"));

		// Reset the current page to first page
		resetOffset();

		// Fetching servers from server
		dispatch(fetchServers());

		// Load servers into table
		loadingServersIntoTable();
	};

	const loadServices = () => {
		dispatch(fetchFilters("services"));

		// Reset the current page to first page
		resetOffset();

		// Fetching services from server
		dispatch(fetchServices());

		// Load services into table
		loadingServicesIntoTable();
	};

	const loadUsers = () => {
		dispatch(fetchFilters("users"));

		// Reset the current page to first page
		resetOffset();

		// Fetching users from server
		dispatch(fetchUsers());

		// Load users into table
		loadingUsersIntoTable();
	};

	const loadGroups = () => {
		dispatch(fetchFilters("groups"));

		// Reset the current page to first page
		resetOffset();

		// Fetching groups from server
		dispatch(fetchGroups());

		// Load groups into table
		loadingGroupsIntoTable();
	};

	const loadAcls = () => {
		dispatch(fetchFilters("acls"));

		// Reset the current page to first page
		resetOffset();

		// Fetching acls from server
        dispatch(fetchAcls());

		// Load acls into table
		loadingAclsIntoTable();
	};

	const loadThemes = () => {
		dispatch(fetchFilters("themes"));

		// Reset the current page to first page
		resetOffset();

		// Fetching themes from server
		dispatch(fetchThemes());

		// Load themes into table
		loadingThemesIntoTable();
	};

	useHotkeys(
    availableHotkeys.general.EVENT_VIEW.sequence,
    () => navigate("/events/events"),
		{ description: t(availableHotkeys.general.EVENT_VIEW.description) ?? undefined },
    []
  );

	useHotkeys(
    availableHotkeys.general.SERIES_VIEW.sequence,
    () => navigate("/events/series"),
		{ description: t(availableHotkeys.general.SERIES_VIEW.description) ?? undefined },
    []
  );

	useHotkeys(
    availableHotkeys.general.MAIN_MENU.sequence,
    () => toggleMenu(),
		{ description: t(availableHotkeys.general.MAIN_MENU.description) ?? undefined },
    [toggleMenu]
  );

	return (
		<>
			<div className="menu-top" >
				<Tooltip title={t("HOTKEYS.DESCRIPTIONS.GENERAL.MAIN_MENU")}>
					<button className="button-like-anchor" onClick={() => toggleMenu()}>
						<i className="fa fa-bars" />
					</button>
				</Tooltip>
				{isOpen && (
					<nav id="roll-up-menu">
						<div id="nav-container">
							{/* todo: more than one href? how? roles? (see MainNav admin-ui-frontend)*/}
							{hasAccess("ROLE_UI_NAV_RECORDINGS_VIEW", user) &&
								(hasAccess("ROLE_UI_EVENTS_VIEW", user) ? (
									<Link to="/events/events" onClick={() => loadEvents()}>
										<Tooltip title={t("NAV.EVENTS.TITLE")} placement={"right"}>
											<i className="events" />
										</Tooltip>
									</Link>
								) : (
									hasAccess("ROLE_UI_SERIES_VIEW", user) && (
										<Link to="/events/series" onClick={() => loadSeries()}>
											<Tooltip title={t("NAV.EVENTS.TITLE")} placement={"right"}>
												<i className="events" />
											</Tooltip>
										</Link>
									)
								))}
							{hasAccess("ROLE_UI_NAV_CAPTURE_VIEW", user) &&
								hasAccess("ROLE_UI_LOCATIONS_VIEW", user) && (
									<Link
										to="/recordings/recordings"
										onClick={() => loadRecordings()}
									>
										<Tooltip title={t("NAV.CAPTUREAGENTS.TITLE")} placement={"right"}>
											<i
												className="recordings"
											/>
										</Tooltip>
									</Link>
								)}
							{hasAccess("ROLE_UI_NAV_SYSTEMS_VIEW", user) &&
								(hasAccess("ROLE_UI_JOBS_VIEW", user) ? (
									<Link to="/systems/jobs" onClick={() => loadJobs()}>
										<Tooltip  title={t("NAV.SYSTEMS.TITLE")} placement={"right"}>
											<i className="systems" />
										</Tooltip>
									</Link>
								) : hasAccess("ROLE_UI_SERVERS_VIEW", user) ? (
									<Link to="/systems/servers" onClick={() => loadServers()}>
										<Tooltip title={t("NAV.SYSTEMS.TITLE")} placement={"right"}>
											<i className="systems" />
										</Tooltip>
									</Link>
								) : (
									hasAccess("ROLE_UI_SERVICES_VIEW", user) && (
										<Link to="/systems/services" onClick={() => loadServices()}>
											<Tooltip title={t("NAV.SYSTEMS.TITLE")} placement={"right"}>
												<i className="systems" />
											</Tooltip>
										</Link>
									)
								))}
							{hasAccess("ROLE_UI_NAV_ORGANIZATION_VIEW", user) &&
								(hasAccess("ROLE_UI_USERS_VIEW", user) ? (
									<Link to="/users/users" onClick={() => loadUsers()}>
										<Tooltip title={t("NAV.USERS.TITLE")} placement={"right"}>
											<i className="users" />
										</Tooltip>
									</Link>
								) : hasAccess("ROLE_UI_GROUPS_VIEW", user) ? (
									<Link to="/users/groups" onClick={() => loadGroups()}>
										<Tooltip title={t("NAV.USERS.TITLE")} placement={"right"}>
											<i className="users" />
										</Tooltip>
									</Link>
								) : (
									hasAccess("ROLE_UI_ACLS_VIEW", user) && (
										<Link to="/users/acls" onClick={() => loadAcls()}>
											<Tooltip title={t("NAV.USERS.TITLE")} placement={"right"}>
												<i className="users" />
											</Tooltip>
										</Link>
									)
								))}
							{themesEnabled &&
								hasAccess("ROLE_UI_NAV_CONFIGURATION_VIEW", user) &&
								hasAccess("ROLE_UI_THEMES_VIEW", user) && (
									<Link to="/configuration/themes" onClick={() => loadThemes()}>
										<Tooltip title={t("NAV.CONFIGURATION.TITLE")} placement={"right"}>
											<i className="configuration" />
										</Tooltip>
									</Link>
								)}
							{statisticsEnabled &&
								hasAccess("ROLE_UI_NAV_STATISTICS_VIEW", user) &&
								hasAccess("ROLE_UI_STATISTICS_ORGANIZATION_VIEW", user) && (
									<Link to="/statistics/organization">
										<Tooltip title={t("NAV.STATISTICS.TITLE")} placement={"right"}>
											<i className="statistics" />
										</Tooltip>
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

});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadingEventsIntoTable: () => dispatch(loadEventsIntoTable()),
	loadingSeriesIntoTable: () => dispatch(loadSeriesIntoTable()),
	loadingRecordingsIntoTable: () => dispatch(loadRecordingsIntoTable()),
	loadingJobsIntoTable: () => dispatch(loadJobsIntoTable()),
	loadingServersIntoTable: () => dispatch(loadServersIntoTable()),
	loadingServicesIntoTable: () => dispatch(loadServicesIntoTable()),
	loadingUsersIntoTable: () => dispatch(loadUsersIntoTable()),
	loadingGroupsIntoTable: () => dispatch(loadGroupsIntoTable()),
	loadingAclsIntoTable: () => dispatch(loadAclsIntoTable()),
	loadingThemesIntoTable: () => dispatch(loadThemesIntoTable()),
	resetOffset: () => dispatch(setOffset(0)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainNav);
