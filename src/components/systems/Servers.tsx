import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MainNav from "../shared/MainNav";
import { Link } from "react-router-dom";
import cn from "classnames";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import { serversTemplateMap } from "../../configs/tableConfigs/serversTableMap";
import { getTotalServers } from "../../selectors/serverSelectors";
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
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchServices } from "../../slices/serviceSlice";
import { fetchJobs } from "../../slices/jobSlice";
import { fetchServers } from "../../slices/serverSlice";

/**
 * This component renders the table view of servers
 */
const Servers = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [displayNavigation, setNavigation] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));
	const servers = useAppSelector(state => getTotalServers(state));

	const loadServers = async () => {
		// Fetching servers from server
		await dispatch(fetchServers());

		// Load servers into table
		dispatch(loadServersIntoTable());
	};

	const loadJobs = () => {
		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching jobs from server
		dispatch(fetchJobs());

		// Load jobs into table
		dispatch(loadJobsIntoTable());
	};

	const loadServices = () => {
		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching services from server
		dispatch(fetchServices());

		// Load services into table
		dispatch(loadServicesIntoTable());
	};

	useEffect(() => {
		dispatch(fetchFilters("servers"));

		// Reset text filter
		dispatch(editTextFilter(""));

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
			<NavBar>
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
			</NavBar>

			<MainView open={displayNavigation}>
				{/* Include notifications component */}
				<Notifications />

				<div className="controls-container">
					{/* Include filters component */}
					<TableFilters
						loadResource={fetchServers}
						loadResourceIntoTable={loadServersIntoTable}
						resource={"servers"}
					/>
					<h1>{t("SYSTEMS.SERVERS.TABLE.CAPTION")}</h1>
					<h4>{t("TABLE_SUMMARY", { numberOfRows: servers })}</h4>
				</div>
				{/* Include table component */}
				<Table templateMap={serversTemplateMap} />
			</MainView>
			<Footer />
		</>
	);
};

export default Servers;
