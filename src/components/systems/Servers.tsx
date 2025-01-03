import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import { serversTemplateMap } from "../../configs/tableConfigs/serversTableMap";
import { getTotalServers } from "../../selectors/serverSelectors";
import { fetchFilters, editTextFilter } from "../../slices/tableFilterSlice";
import {
	loadServersIntoTable,
} from "../../thunks/tableThunks";
import Header from "../Header";
import NavBar from "../NavBar";
import MainView from "../MainView";
import Footer from "../Footer";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchServers } from "../../slices/serverSlice";
import { loadServers, systemsLinks } from "./partials/SystemsNavigation";

/**
 * This component renders the table view of servers
 */
const Servers = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [displayNavigation, setNavigation] = useState(false);

	const currentFilterType = useAppSelector(state => getCurrentFilterResource(state));
	const servers = useAppSelector(state => getTotalServers(state));

	useEffect(() => {
		if ("servers" !== currentFilterType) {
			dispatch(fetchFilters("servers"));
		}

		// Reset text filter
		dispatch(editTextFilter(""));

		// Load servers on mount
		loadServers(dispatch);

		// Fetch servers every minute
		let fetchServersInterval = setInterval(() => loadServers(dispatch), 5000);

		return () => clearInterval(fetchServersInterval);
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
