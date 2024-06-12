import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
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
import { setOffset } from "../../slices/tableSlice";
import { getUserInformation } from "../../selectors/userInfoSelectors";
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
}) => {
	const { t } = useTranslation();
        const dispatch = useAppDispatch();
	let navigate = useNavigate();

	const user = useAppSelector(state => getUserInformation(state));

	const loadEvents = () => {
		dispatch(fetchFilters("events"));

		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching stats from server
		dispatch(fetchStats());

		// Fetching events from server
		dispatch(fetchEvents());

		// Load events into table
		dispatch(loadEventsIntoTable());
	};

	const loadSeries = () => {
		dispatch(fetchFilters("series"));

		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching series from server
		dispatch(fetchSeries());

		// Load series into table
		dispatch(loadSeriesIntoTable());
	};

	const loadRecordings = () => {
		dispatch(fetchFilters("recordings"));

		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching recordings from server
		dispatch(fetchRecordings(undefined));

		// Load recordings into table
		dispatch(loadRecordingsIntoTable());
	};

	const loadJobs = () => {
		dispatch(fetchFilters("jobs"));

		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching jobs from server
		dispatch(fetchJobs());

		// Load jobs into table
		dispatch(loadJobsIntoTable());
	};

	const loadServers = () => {
		dispatch(fetchFilters("servers"));

		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching servers from server
		dispatch(fetchServers());

		// Load servers into table
		dispatch(loadServersIntoTable());
	};

	const loadServices = () => {
		dispatch(fetchFilters("services"));

		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching services from server
		dispatch(fetchServices());

		// Load services into table
		dispatch(loadServicesIntoTable());
	};

	const loadUsers = () => {
		dispatch(fetchFilters("users"));

		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching users from server
		dispatch(fetchUsers());

		// Load users into table
		dispatch(loadUsersIntoTable());
	};

	const loadGroups = () => {
		dispatch(fetchFilters("groups"));

		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching groups from server
		dispatch(fetchGroups());

		// Load groups into table
		dispatch(loadGroupsIntoTable());
	};

	const loadAcls = () => {
		dispatch(fetchFilters("acls"));

		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching acls from server
		dispatch(fetchAcls());

		// Load acls into table
		dispatch(loadAclsIntoTable());
	};

	const loadThemes = () => {
		dispatch(fetchFilters("themes"));

		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching themes from server
		dispatch(fetchThemes());

		// Load themes into table
		dispatch(loadThemesIntoTable());
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
			<div className="menu-top" onClick={() => toggleMenu()}>
				{isOpen && (
					<nav id="roll-up-menu">
						<div id="nav-container">
							{/* todo: more than one href? how? roles? (see MainNav admin-ui-frontend)*/}
							{hasAccess("ROLE_UI_NAV_RECORDINGS_VIEW", user) &&
								(hasAccess("ROLE_UI_EVENTS_VIEW", user) ? (
									<Tooltip title={t("NAV.EVENTS.TITLE")}>
										<Link to="/events/events" onClick={() => loadEvents()}>
											<i className="events" />
										</Link>
									</Tooltip>
								) : (
									hasAccess("ROLE_UI_SERIES_VIEW", user) && (
										<Tooltip title={t("NAV.EVENTS.TITLE")}>
											<Link to="/events/series" onClick={() => loadSeries()}>
												<i className="events" />
											</Link>
										</Tooltip>
									)
								))}
							{hasAccess("ROLE_UI_NAV_CAPTURE_VIEW", user) &&
								hasAccess("ROLE_UI_LOCATIONS_VIEW", user) && (
									<Tooltip title={t("NAV.CAPTUREAGENTS.TITLE")}>
										<Link
											to="/recordings/recordings"
											onClick={() => loadRecordings()}
										>
											<i
												className="recordings"
											/>
										</Link>
									</Tooltip>
								)}
							{hasAccess("ROLE_UI_NAV_SYSTEMS_VIEW", user) &&
								(hasAccess("ROLE_UI_JOBS_VIEW", user) ? (
									<Tooltip  title={t("NAV.SYSTEMS.TITLE")}>
										<Link to="/systems/jobs" onClick={() => loadJobs()}>
											<i className="systems" />
										</Link>
									</Tooltip>
								) : hasAccess("ROLE_UI_SERVERS_VIEW", user) ? (
									<Tooltip title={t("NAV.SYSTEMS.TITLE")}>
										<Link to="/systems/servers" onClick={() => loadServers()}>
											<i className="systems" />
										</Link>
									</Tooltip>
								) : (
									hasAccess("ROLE_UI_SERVICES_VIEW", user) && (
										<Tooltip title={t("NAV.SYSTEMS.TITLE")}>
											<Link to="/systems/services" onClick={() => loadServices()}>
												<i className="systems" />
											</Link>
										</Tooltip>
									)
								))}
							{hasAccess("ROLE_UI_NAV_ORGANIZATION_VIEW", user) &&
								(hasAccess("ROLE_UI_USERS_VIEW", user) ? (
									<Tooltip title={t("NAV.USERS.TITLE")}>
										<Link to="/users/users" onClick={() => loadUsers()}>
											<i className="users" />
										</Link>
									</Tooltip>
								) : hasAccess("ROLE_UI_GROUPS_VIEW", user) ? (
									<Tooltip title={t("NAV.USERS.TITLE")}>
										<Link to="/users/groups" onClick={() => loadGroups()}>
											<i className="users" />
										</Link>
									</Tooltip>
								) : (
									hasAccess("ROLE_UI_ACLS_VIEW", user) && (
										<Tooltip title={t("NAV.USERS.TITLE")}>
											<Link to="/users/acls" onClick={() => loadAcls()}>
												<i className="users" />
											</Link>
										</Tooltip>
									)
								))}
							{hasAccess("ROLE_UI_NAV_CONFIGURATION_VIEW", user) &&
								hasAccess("ROLE_UI_THEMES_VIEW", user) && (
									<Tooltip title={t("NAV.CONFIGURATION.TITLE")}>
										<Link to="/configuration/themes" onClick={() => loadThemes()}>
											<i className="configuration" />
										</Link>
									</Tooltip>
								)}
							{hasAccess("ROLE_UI_NAV_STATISTICS_VIEW", user) &&
								hasAccess("ROLE_UI_STATISTICS_ORGANIZATION_VIEW", user) && (
									<Tooltip title={t("NAV.STATISTICS.TITLE")}>
										<Link to="/statistics/organization">
											<i className="statistics" />
										</Link>
									</Tooltip>
								)}
						</div>
					</nav>
				)}
			</div>
		</>
	);
};

export default MainNav;
