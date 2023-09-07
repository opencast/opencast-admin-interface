import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module '../shared/MainNav' was resolved to '/home/... Remove this comment to see the full error message
import MainNav from "../shared/MainNav";
import { Link } from "react-router-dom";
import cn from "classnames";
// @ts-expect-error TS(6142): Module '../shared/TableFilters' was resolved to '/... Remove this comment to see the full error message
import TableFilters from "../shared/TableFilters";
// @ts-expect-error TS(6142): Module '../shared/Table' was resolved to '/home/ar... Remove this comment to see the full error message
import Table from "../shared/Table";
import { connect } from "react-redux";
// @ts-expect-error TS(6142): Module '../shared/Notifications' was resolved to '... Remove this comment to see the full error message
import Notifications from "../shared/Notifications";
import { serversTemplateMap } from "../../configs/tableConfigs/serversTableConfig";
import { getTotalServers } from "../../selectors/serverSelectors";
import { fetchFilters } from "../../thunks/tableFilterThunks";
import { fetchServers } from "../../thunks/serverThunks";
import {
	loadJobsIntoTable,
	loadServersIntoTable,
	loadServicesIntoTable,
} from "../../thunks/tableThunks";
import { fetchJobs } from "../../thunks/jobThunks";
import { fetchServices } from "../../thunks/serviceThunks";
import { editTextFilter } from "../../actions/tableFilterActions";
import { setOffset } from "../../actions/tableActions";
import { styleNavClosed, styleNavOpen } from "../../utils/componentsUtils";
// @ts-expect-error TS(6142): Module '../Header' was resolved to '/home/arnewilk... Remove this comment to see the full error message
import Header from "../Header";
// @ts-expect-error TS(6142): Module '../Footer' was resolved to '/home/arnewilk... Remove this comment to see the full error message
import Footer from "../Footer";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";

/**
 * This component renders the table view of servers
 */
const Servers = ({
// @ts-expect-error TS(7031): Binding element 'loadingServers' implicitly has an... Remove this comment to see the full error message
	loadingServers,
// @ts-expect-error TS(7031): Binding element 'loadingServersIntoTable' implicit... Remove this comment to see the full error message
	loadingServersIntoTable,
// @ts-expect-error TS(7031): Binding element 'servers' implicitly has an 'any' ... Remove this comment to see the full error message
	servers,
// @ts-expect-error TS(7031): Binding element 'loadingFilters' implicitly has an... Remove this comment to see the full error message
	loadingFilters,
// @ts-expect-error TS(7031): Binding element 'loadingJobs' implicitly has an 'a... Remove this comment to see the full error message
	loadingJobs,
// @ts-expect-error TS(7031): Binding element 'loadingJobsIntoTable' implicitly ... Remove this comment to see the full error message
	loadingJobsIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingServices' implicitly has a... Remove this comment to see the full error message
	loadingServices,
// @ts-expect-error TS(7031): Binding element 'loadingServicesIntoTable' implici... Remove this comment to see the full error message
	loadingServicesIntoTable,
// @ts-expect-error TS(7031): Binding element 'resetTextFilter' implicitly has a... Remove this comment to see the full error message
	resetTextFilter,
// @ts-expect-error TS(7031): Binding element 'resetOffset' implicitly has an 'a... Remove this comment to see the full error message
	resetOffset,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
// @ts-expect-error TS(7031): Binding element 'currentFilterType' implicitly has... Remove this comment to see the full error message
	currentFilterType,
}) => {
	const { t } = useTranslation();
	const [displayNavigation, setNavigation] = useState(false);

	const loadServers = async () => {
		// Fetching servers from server
		await loadingServers();

		// Load servers into table
		loadingServersIntoTable();
	};

	const loadJobs = () => {
		// Reset the current page to first page
		resetOffset();

		// Fetching jobs from server
		loadingJobs();

		// Load jobs into table
		loadingJobsIntoTable();
	};

	const loadServices = () => {
		// Reset the current page to first page
		resetOffset();

		// Fetching services from server
		loadingServices();

		// Load services into table
		loadingServicesIntoTable();
	};

	useEffect(() => {
		if ("servers" !== currentFilterType) {
			loadingFilters("servers");
		}

		resetTextFilter();

		// Load servers on mount
		loadServers().then((r) => console.info(r));

		// Fetch servers every minute
		let fetchServersInterval = setInterval(loadServers, 5000);

		return () => clearInterval(fetchServersInterval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const toggleNavigation = () => {
		setNavigation(!displayNavigation);
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<Header />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<section className="action-nav-bar">
				{/* Include Burger-button menu*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<MainNav isOpen={displayNavigation} toggleMenu={toggleNavigation} />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<nav>
					{hasAccess("ROLE_UI_JOBS_VIEW", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Link
							to="/systems/jobs"
							className={cn({ active: false })}
							onClick={() => loadJobs()}
						>
							{t("SYSTEMS.NAVIGATION.JOBS")}
						</Link>
					)}
					{hasAccess("ROLE_UI_SERVERS_VIEW", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Link
							to="/systems/servers"
							className={cn({ active: true })}
							onClick={() => loadServers()}
						>
							{t("SYSTEMS.NAVIGATION.SERVERS")}
						</Link>
					)}
					{hasAccess("ROLE_UI_SERVICES_VIEW", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Link
							to="/systems/services"
							className={cn({ active: false })}
							onClick={() => loadServices()}
						>
							{t("SYSTEMS.NAVIGATION.SERVICES")}
						</Link>
					)}
				</nav>
			</section>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div
				className="main-view"
				style={displayNavigation ? styleNavOpen : styleNavClosed}
			>
				{/* Include notifications component */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Notifications />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="controls-container">
					{/* Include filters component */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<TableFilters
						loadResource={loadingServers}
						loadResourceIntoTable={loadingServersIntoTable}
						resource={"servers"}
					/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h1>{t("SYSTEMS.SERVERS.TABLE.CAPTION")}</h1>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h4>{t("TABLE_SUMMARY", { numberOfRows: servers })}</h4>
				</div>
				{/* Include table component */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Table templateMap={serversTemplateMap} />
			</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<Footer />
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	servers: getTotalServers(state),
	user: getUserInformation(state),
	currentFilterType: getCurrentFilterResource(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'resource' implicitly has an 'any' type.
	loadingFilters: (resource) => dispatch(fetchFilters(resource)),
	loadingServers: () => dispatch(fetchServers()),
	loadingServersIntoTable: () => dispatch(loadServersIntoTable()),
	loadingJobs: () => dispatch(fetchJobs()),
	loadingJobsIntoTable: () => dispatch(loadJobsIntoTable()),
	loadingServices: () => dispatch(fetchServices()),
	loadingServicesIntoTable: () => dispatch(loadServicesIntoTable()),
	resetTextFilter: () => dispatch(editTextFilter("")),
	resetOffset: () => dispatch(setOffset(0)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Servers);
