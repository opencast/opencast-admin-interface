import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import cn from "classnames";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import MainNav from "../shared/MainNav";
import Notifications from "../shared/Notifications";
import { jobsTemplateMap } from "../../configs/tableConfigs/jobsTableConfig";
import { getTotalJobs } from "../../selectors/jobSelectors";
import { fetchFilters } from "../../thunks/tableFilterThunks";
import {
	loadJobsIntoTable,
	loadServersIntoTable,
	loadServicesIntoTable,
} from "../../thunks/tableThunks";
import { editTextFilter } from "../../actions/tableFilterActions";
import { setOffset } from "../../actions/tableActions";
import { styleNavClosed, styleNavOpen } from "../../utils/componentsUtils";
import Header from "../Header";
import Footer from "../Footer";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchJobs } from "../../slices/jobSlice";
import { fetchServers } from "../../slices/serverSlice";
import { fetchServices } from "../../slices/serviceSlice";

/**
 * This component renders the table view of jobs
 */
const Jobs = ({
// @ts-expect-error TS(7031): Binding element 'loadingJobsIntoTable' implicitly ... Remove this comment to see the full error message
	loadingJobsIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingFilters' implicitly has an... Remove this comment to see the full error message
	loadingFilters,
// @ts-expect-error TS(7031): Binding element 'loadingServersIntoTable' implicit... Remove this comment to see the full error message
	loadingServersIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingServicesIntoTable' implici... Remove this comment to see the full error message
	loadingServicesIntoTable,
// @ts-expect-error TS(7031): Binding element 'resetTextFilter' implicitly has a... Remove this comment to see the full error message
	resetTextFilter,
// @ts-expect-error TS(7031): Binding element 'resetOffset' implicitly has an 'a... Remove this comment to see the full error message
	resetOffset,
// @ts-expect-error TS(7031): Binding element 'currentFilterType' implicitly has... Remove this comment to see the full error message
	currentFilterType,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [displayNavigation, setNavigation] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));
	const jobs = useAppSelector(state => getTotalJobs(state));

	// TODO: Get rid of the wrappers when modernizing redux is done
	const fetchJobsWrapper = () => {
		dispatch(fetchJobs())
	}

	const loadJobs = async () => {
		// Fetching jobs from server
		await dispatch(fetchJobs());

		// Load jobs into table
		loadingJobsIntoTable();
	};

	const loadServers = () => {
		// Reset the current page to first page
		resetOffset();

		// Fetching servers from server
		dispatch(fetchServers());

		// Load servers into table
		loadingServersIntoTable();
	};

	const loadServices = () => {
		// Reset the current page to first page
		resetOffset();

		// Fetching services from server
		dispatch(fetchServices());

		// Load services into table
		loadingServicesIntoTable();
	};

	useEffect(() => {
		if ("jobs" !== currentFilterType) {
			loadingFilters("jobs");
		}

		resetTextFilter();

		// Load jobs on mount
		loadJobs().then((r) => console.info(r));

		// Fetch jobs every minute
		let fetchJobInterval = setInterval(loadJobs, 5000);

		return () => clearInterval(fetchJobInterval);
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
							className={cn({ active: true })}
							onClick={() => loadJobs()}
						>
							{t("SYSTEMS.NAVIGATION.JOBS")}
						</Link>
					)}
					{hasAccess("ROLE_UI_SERVERS_VIEW", user) && (
						<Link
							to="/systems/servers"
							className={cn({ active: false })}
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
						loadResource={fetchJobsWrapper}
						loadResourceIntoTable={loadingJobsIntoTable}
						resource={"jobs"}
					/>
					<h1>{t("SYSTEMS.JOBS.TABLE.CAPTION")}</h1>
					<h4>{t("TABLE_SUMMARY", { numberOfRows: jobs })}</h4>
				</div>
				{/* Include table component */}
				<Table templateMap={jobsTemplateMap} />
			</div>
			<Footer />
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	currentFilterType: getCurrentFilterResource(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'resource' implicitly has an 'any' type.
	loadingFilters: (resource) => dispatch(fetchFilters(resource)),
	loadingJobsIntoTable: () => dispatch(loadJobsIntoTable()),
	loadingServersIntoTable: () => dispatch(loadServersIntoTable()),
	loadingServicesIntoTable: () => dispatch(loadServicesIntoTable()),
	resetTextFilter: () => dispatch(editTextFilter("")),
	resetOffset: () => dispatch(setOffset(0)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Jobs);
