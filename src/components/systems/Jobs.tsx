import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import { jobsTemplateMap } from "../../configs/tableConfigs/jobsTableConfig";
import { getTotalJobs } from "../../selectors/jobSelectors";
import { fetchFilters, editTextFilter } from "../../slices/tableFilterSlice";
import {
	loadJobsIntoTable,
} from "../../thunks/tableThunks";
import Header from "../Header";
import NavBar from "../NavBar";
import MainView from "../MainView";
import Footer from "../Footer";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchJobs } from "../../slices/jobSlice";
import { loadJobs, systemsLinks } from "./partials/SystemsNavigation";

/**
 * This component renders the table view of jobs
 */
const Jobs = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [displayNavigation, setNavigation] = useState(false);

	const currentFilterType = useAppSelector(state => getCurrentFilterResource(state));
	const jobs = useAppSelector(state => getTotalJobs(state));

	useEffect(() => {
		if ("jobs" !== currentFilterType) {
			dispatch(fetchFilters("jobs"));
		}

		// Reset text filter
		dispatch(editTextFilter(""));

		// Load jobs on mount
		loadJobs(dispatch);

		// Fetch jobs every minute
		let fetchJobInterval = setInterval(() => loadJobs(dispatch), 5000);

		return () => clearInterval(fetchJobInterval);
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
						loadResource={fetchJobs}
						loadResourceIntoTable={loadJobsIntoTable}
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

export default Jobs;
