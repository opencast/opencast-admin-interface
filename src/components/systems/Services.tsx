import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import cn from "classnames";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import MainNav from "../shared/MainNav";
import Notifications from "../shared/Notifications";
import { servicesTemplateMap } from "../../configs/tableConfigs/servicesTableMap";
import { fetchFilters } from "../../thunks/tableFilterThunks";
import {
	loadJobsIntoTable,
	loadServersIntoTable,
	loadServicesIntoTable,
} from "../../thunks/tableThunks";
import { getTotalServices } from "../../selectors/serviceSelector";
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
import { fetchServices } from "../../slices/serviceSlice";

/**
 * This component renders the table view of services
 */
const Services = ({
// @ts-expect-error TS(7031): Binding element 'loadingServicesIntoTable' implici... Remove this comment to see the full error message
	loadingServicesIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingFilters' implicitly has an... Remove this comment to see the full error message
	loadingFilters,
// @ts-expect-error TS(7031): Binding element 'loadingJobsIntoTable' implicitly ... Remove this comment to see the full error message
	loadingJobsIntoTable,
// @ts-expect-error TS(7031): Binding element 'loadingServersIntoTable' implicit... Remove this comment to see the full error message
	loadingServersIntoTable,
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
	const services = useAppSelector(state => getTotalServices(state));

	// TODO: Get rid of the wrappers when modernizing redux is done
	const fetchServicesWrapper = () => {
		dispatch(fetchServices())
	}

	const loadServices = async () => {
		// Fetching services from server
		await dispatch(fetchServices());

		// Load services into table
		loadingServicesIntoTable();
	};

	const loadJobs = () => {
		// Reset the current page to first page
		resetOffset();

		// Fetching jobs from server
		dispatch(fetchJobs());

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

	useEffect(() => {
		if ("services" !== currentFilterType) {
			loadingFilters("services");
		}

		resetTextFilter();

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
						loadResource={fetchServicesWrapper}
						loadResourceIntoTable={loadingServicesIntoTable}
						resource={"services"}
					/>
					<h1>{t("SYSTEMS.SERVICES.TABLE.CAPTION")}</h1>
					<h4>{t("TABLE_SUMMARY", { numberOfRows: services })}</h4>
				</div>
				{/* Include table component */}
				<Table templateMap={servicesTemplateMap} />
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
	loadingServicesIntoTable: () => dispatch(loadServicesIntoTable()),
	loadingJobsIntoTable: () => dispatch(loadJobsIntoTable()),
	loadingServers: () => dispatch(fetchServers()),
	loadingServersIntoTable: () => dispatch(loadServersIntoTable()),
	resetTextFilter: () => dispatch(editTextFilter("")),
	resetOffset: () => dispatch(setOffset(0)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Services);
