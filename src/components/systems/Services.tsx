import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import cn from "classnames";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import MainNav from "../shared/MainNav";
import Notifications from "../shared/Notifications";
import { servicesTemplateMap } from "../../configs/tableConfigs/servicesTableMap";
import { fetchFilters, editTextFilter } from "../../slices/tableFilterSlice";
import {
	loadJobsIntoTable,
	loadServicesIntoTable,
} from "../../thunks/tableThunks";
import { getTotalServices } from "../../selectors/serviceSelector";
import { setOffset } from "../../slices/tableSlice";
import Header from "../Header";
import NavBar from "../NavBar";
import MainView from "../MainView";
import Footer from "../Footer";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchServers } from "../../slices/serverSlice";
import { fetchJobs } from "../../slices/jobSlice";
import { fetchServices } from "../../slices/serviceSlice";

/**
 * This component renders the table view of services
 */
const Services = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [displayNavigation, setNavigation] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));
	const services = useAppSelector(state => getTotalServices(state));

	const loadServices = async () => {
		// Fetching services from server
		await dispatch(fetchServices());

		// Load services into table
		dispatch(loadServicesIntoTable());
	};

	const loadJobs = () => {
		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching jobs from server
		dispatch(fetchJobs());

		// Load jobs into table
		dispatch(loadJobsIntoTable());
	};

	const loadServers = () => {
		// Reset the current page to first page
		dispatch(setOffset(0));

		// Fetching servers from server
		dispatch(fetchServers());

		// Load servers into table
		dispatch(fetchServers());
	};

	useEffect(() => {
		dispatch(fetchFilters("services"));

		// Reset text filter
		dispatch(editTextFilter(""));

		// Load services on mount
		loadServices().then((r) => console.info(r));

		// Fetch services every minute
		let fetchServicesInterval = setInterval(loadServices, 5000);

		return () => clearInterval(fetchServicesInterval);
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
							className={cn({ active: false })}
							onClick={() => loadServers()}
						>
							{t("SYSTEMS.NAVIGATION.SERVERS")}
						</Link>
					)}
					{hasAccess("ROLE_UI_SERVICES_VIEW", user) && (
						<Link
							to="/systems/services"
							className={cn({ active: true })}
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
						loadResource={fetchServices}
						loadResourceIntoTable={loadServicesIntoTable}
						resource={"services"}
					/>
					<h1>{t("SYSTEMS.SERVICES.TABLE.CAPTION")}</h1>
					<h4>{t("TABLE_SUMMARY", { numberOfRows: services })}</h4>
				</div>
				{/* Include table component */}
				<Table templateMap={servicesTemplateMap} />
			</MainView>
			<Footer />
		</>
	);
};

export default Services;
