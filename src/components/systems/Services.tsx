import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import { servicesTemplateMap } from "../../configs/tableConfigs/servicesTableMap";
import { fetchFilters, editTextFilter } from "../../slices/tableFilterSlice";
import {
	loadServicesIntoTable,
} from "../../thunks/tableThunks";
import { getTotalServices } from "../../selectors/serviceSelector";
import Header from "../Header";
import NavBar from "../NavBar";
import MainView from "../MainView";
import Footer from "../Footer";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchServices } from "../../slices/serviceSlice";
import { loadServices, systemsLinks } from "./partials/SystemsNavigation";

/**
 * This component renders the table view of services
 */
const Services = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [displayNavigation, setNavigation] = useState(false);

	const services = useAppSelector(state => getTotalServices(state));

	useEffect(() => {
		dispatch(fetchFilters("services"));

		// Reset text filter
		dispatch(editTextFilter(""));

		// Load services on mount
		loadServices(dispatch);

		// Fetch services every minute
		let fetchServicesInterval = setInterval(() => loadServices(dispatch), 5000);

		return () => clearInterval(fetchServicesInterval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Header />
			<NavBar
				displayNavigation={displayNavigation}
				setNavigation={setNavigation}
				links={systemsLinks}
			/>

			<MainView open={displayNavigation}>
				{/* Include notifications component */}
				<Notifications context={"other"}/>

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
