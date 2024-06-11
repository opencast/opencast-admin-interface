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
import { fetchFilters, editTextFilter } from "../../slices/tableFilterSlice";
import {
	loadJobsIntoTable,
	loadServersIntoTable,
	loadServicesIntoTable,
} from "../../thunks/tableThunks";
import { setOffset } from "../../slices/tableSlice";
import Header from "../Header";
import NavBar from "../NavBar";
import MainView from "../MainView";
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
// @ts-expect-error TS(7031): Binding element 'loadingServersIntoTable' implicit... Remove this comment to see the full error message
	loadingServersIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingServicesIntoTable' implici... Remove this comment to see the full error message
	loadingServicesIntoTable,
// @ts-expect-error TS(7031): Binding element 'resetOffset' implicitly has an 'a... Remove this comment to see the full error message
	resetOffset,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [displayNavigation, setNavigation] = useState(false);

	const currentFilterType = useAppSelector(state => getCurrentFilterResource(state));
	const user = useAppSelector(state => getUserInformation(state));
	const jobs = useAppSelector(state => getTotalJobs(state));

	// TODO: Get rid of the wrappers when modernizing redux is done
	const fetchJobsWrapper = async () => {
		await dispatch(fetchJobs())
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
			dispatch(fetchFilters("jobs"));
		}

		// Reset text filter
		dispatch(editTextFilter(""));

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
			<NavBar>
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
			</NavBar>

			<MainView open={displayNavigation}>
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
			</MainView>
			<Footer />
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
	loadingJobsIntoTable: () => dispatch(loadJobsIntoTable()),
	loadingServersIntoTable: () => dispatch(loadServersIntoTable()),
	loadingServicesIntoTable: () => dispatch(loadServicesIntoTable()),
	resetOffset: () => dispatch(setOffset(0)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Jobs);
