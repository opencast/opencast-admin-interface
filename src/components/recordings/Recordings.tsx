import React, { useEffect, useState } from "react";
import MainNav from "../shared/MainNav";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import cn from "classnames";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import { recordingsTemplateMap } from "../../configs/tableConfigs/recordingsTableMap";
import { getTotalRecordings } from "../../selectors/recordingSelectors";
import { loadRecordingsIntoTable } from "../../thunks/tableThunks";
import { fetchFilters, editTextFilter } from "../../slices/tableFilterSlice";
import { styleNavClosed, styleNavOpen } from "../../utils/componentsUtils";
import Header from "../Header";
import Footer from "../Footer";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchRecordings } from "../../slices/recordingSlice";

/**
 * This component renders the table view of recordings
 */
const Recordings = ({
// @ts-expect-error TS(7031): Binding element 'loadingRecordingsIntoTable' impli... Remove this comment to see the full error message
	loadingRecordingsIntoTable,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const [displayNavigation, setNavigation] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));
	const currentFilterType = useAppSelector(state => getCurrentFilterResource(state));
	const recordings = useAppSelector(state => getTotalRecordings(state));

	// TODO: Get rid of the wrappers when modernizing redux is done
	const fetchRecordingsWrapper = async () => {
		await dispatch(fetchRecordings(undefined))
	}

	const loadRecordings = async () => {
		// Fetching recordings from server
		await dispatch(fetchRecordings(undefined));

		// Load recordings into table
		loadingRecordingsIntoTable();
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
			<section className="action-nav-bar">
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
						loadResource={fetchRecordingsWrapper}
						loadResourceIntoTable={loadingRecordingsIntoTable}
						resource={"recordings"}
					/>

					<h1>{t("RECORDINGS.RECORDINGS.TABLE.CAPTION")}</h1>
					<h4>{t("TABLE_SUMMARY", { numberOfRows: recordings })}</h4>
				</div>
				{/* Include table component */}
				<Table templateMap={recordingsTemplateMap} />
			</div>
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
	loadingRecordingsIntoTable: () => dispatch(loadRecordingsIntoTable()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Recordings);
