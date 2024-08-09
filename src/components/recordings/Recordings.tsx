import React, { useEffect, useState } from "react";
import MainNav from "../shared/MainNav";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import cn from "classnames";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import { recordingsTemplateMap } from "../../configs/tableConfigs/recordingsTableMap";
import { getTotalRecordings } from "../../selectors/recordingSelectors";
import { loadRecordingsIntoTable } from "../../thunks/tableThunks";
import { fetchFilters, editTextFilter } from "../../slices/tableFilterSlice";
import Header from "../Header";
import NavBar from "../NavBar";
import MainView from "../MainView";
import Footer from "../Footer";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchRecordings } from "../../slices/recordingSlice";

/**
 * This component renders the table view of recordings
 */
const Recordings = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [displayNavigation, setNavigation] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));
	const currentFilterType = useAppSelector(state => getCurrentFilterResource(state));
	const recordings = useAppSelector(state => getTotalRecordings(state));

	const fetchRecordingsWrapper = () => {
		fetchRecordings(undefined)
	}

	const loadRecordings = async () => {
		// Fetching recordings from server
		await dispatch(fetchRecordings(undefined));

		// Load recordings into table
		dispatch(loadRecordingsIntoTable());
	};

	useEffect(() => {
		if ("recordings" !== currentFilterType) {
			dispatch(fetchFilters("recordings"));
		}

		// Reset text filter
		dispatch(editTextFilter(""));

		// Load recordings on mount
		loadRecordings().then((r) => console.info(r));
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
					{hasAccess("ROLE_UI_LOCATIONS_VIEW", user) && (
						<Link
							to="/recordings/recordings"
							className={cn({ active: true })}
							onClick={() => loadRecordings()}
						>
							{t("RECORDINGS.NAVIGATION.LOCATIONS")}
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
						loadResource={fetchRecordingsWrapper}
						loadResourceIntoTable={loadRecordingsIntoTable}
						resource={"recordings"}
					/>

					<h1>{t("RECORDINGS.RECORDINGS.TABLE.CAPTION")}</h1>
					<h4>{t("TABLE_SUMMARY", { numberOfRows: recordings })}</h4>
				</div>
				{/* Include table component */}
				<Table templateMap={recordingsTemplateMap} />
			</MainView>
			<Footer />
		</>
	);
};

export default Recordings;
