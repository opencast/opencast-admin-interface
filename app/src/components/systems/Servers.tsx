import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MainNav from "../shared/MainNav";
import { Link } from "react-router-dom";
import cn from "classnames";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import { connect } from "react-redux";
import Notifications from "../shared/Notifications";
import { serversTemplateMap } from "../../configs/tableConfigs/serversTableMap";
import { getTotalServers } from "../../selectors/serverSelectors";
import { fetchFilters } from "../../thunks/tableFilterThunks";
import {
	loadJobsIntoTable,
	loadServersIntoTable,
	loadServicesIntoTable,
} from "../../thunks/tableThunks";
import { fetchServices } from "../../thunks/serviceThunks";
import { editTextFilter } from "../../actions/tableFilterActions";
import { setOffset } from "../../actions/tableActions";
import { styleNavClosed, styleNavOpen } from "../../utils/componentsUtils";
import Header from "../Header";
import Footer from "../Footer";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchServers } from "../../slices/serverSlice";
import { fetchJobs } from "../../slices/jobSlice";

/**
 * This component renders the table view of servers
 */
const Servers = ({
// @ts-expect-error TS(7031): Binding element 'loadingServersIntoTable' implicit... Remove this comment to see the full error message
	loadingServersIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingFilters' implicitly has an... Remove this comment to see the full error message
	loadingFilters,
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
	const dispatch = useAppDispatch();
	const [displayNavigation, setNavigation] = useState(false);

	const servers = useAppSelector(state => getTotalServers(state));

	// TODO: Get rid of the wrappers when modernizing redux is done
	const fetchServersWrapper = () => {
		dispatch(fetchServers())
	}

	const loadServers = async () => {
		// Fetching servers from server
		await dispatch(fetchServers());

		// Load servers into table
		loadingServersIntoTable();
	};

	const loadJobs = () => {
		// Reset the current page to first page
		resetOffset();

		// Fetching jobs from server
		dispatch(fetchJobs());

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
		<>
			<Header />
			<section className="action-nav-bar">
				{/* Include Burger-button menu*/}
				<MainNav isOpen={displayNavigation} toggleMenu={toggleNavigation} />

				<nav>
					{hasAccess("ROLE_UI_JOBS_VIEW", user) && (
						<Link
							to="/systems/jobs"
							className={cn({ active: false })}
							onClick={() => loadJobs()}
						>
							{t("SYSTEMS.NAVIGATION.JOBS")}
						</Link>
					)}
					{hasAccess("ROLE_UI_SERVERS_VIEW", user) && (
						<Link
							to="/systems/servers"
							className={cn({ active: true })}
							onClick={() => loadServers()}
						>
							{t("SYSTEMS.NAVIGATION.SERVERS")}
						</Link>
					)}
					{hasAccess("ROLE_UI_SERVICES_VIEW", user) && (
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

			<div
				className="main-view"
				style={displayNavigation ? styleNavOpen : styleNavClosed}
			>
				{/* Include notifications component */}
				<Notifications />

				<div className="controls-container">
					{/* Include filters component */}
					<TableFilters
						loadResource={fetchServersWrapper}
						loadResourceIntoTable={loadingServersIntoTable}
						resource={"servers"}
					/>
					<h1>{t("SYSTEMS.SERVERS.TABLE.CAPTION")}</h1>
					<h4>{t("TABLE_SUMMARY", { numberOfRows: servers })}</h4>
				</div>
				{/* Include table component */}
				<Table templateMap={serversTemplateMap} />
			</div>
			<Footer />
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	user: getUserInformation(state),
	currentFilterType: getCurrentFilterResource(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'resource' implicitly has an 'any' type.
	loadingFilters: (resource) => dispatch(fetchFilters(resource)),
	loadingServersIntoTable: () => dispatch(loadServersIntoTable()),
	loadingJobsIntoTable: () => dispatch(loadJobsIntoTable()),
	loadingServices: () => dispatch(fetchServices()),
	loadingServicesIntoTable: () => dispatch(loadServicesIntoTable()),
	resetTextFilter: () => dispatch(editTextFilter("")),
	resetOffset: () => dispatch(setOffset(0)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Servers);
