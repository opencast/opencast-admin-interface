import React, { useEffect, useState } from "react";
import MainNav from "../shared/MainNav";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import cn from "classnames";
import TableFilters from "../shared/TableFilters";
import Table from "../shared/Table";
import Notifications from "../shared/Notifications";
import { recordingsTemplateMap } from "../../configs/tableConfigs/recordingsTableConfig";
import { getTotalRecordings } from "../../selectors/recordingSelectors";
import { fetchRecordings } from "../../thunks/recordingThunks";
import { loadRecordingsIntoTable } from "../../thunks/tableThunks";
import { fetchFilters } from "../../thunks/tableFilterThunks";
import { editTextFilter } from "../../actions/tableFilterActions";
import { styleNavClosed, styleNavOpen } from "../../utils/componentsUtils";
import Header from "../Header";
import Footer from "../Footer";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { hasAccess } from "../../utils/utils";
import { getCurrentFilterResource } from "../../selectors/tableFilterSelectors";

/**
 * This component renders the table view of recordings
 */
const Recordings = ({
// @ts-expect-error TS(7031): Binding element 'loadingRecordings' implicitly has... Remove this comment to see the full error message
	loadingRecordings,
// @ts-expect-error TS(7031): Binding element 'loadingRecordingsIntoTable' impli... Remove this comment to see the full error message
	loadingRecordingsIntoTable,
// @ts-expect-error TS(7031): Binding element 'recordings' implicitly has an 'an... Remove this comment to see the full error message
	recordings,
// @ts-expect-error TS(7031): Binding element 'loadingFilters' implicitly has an... Remove this comment to see the full error message
	loadingFilters,
// @ts-expect-error TS(7031): Binding element 'resetTextFilter' implicitly has a... Remove this comment to see the full error message
	resetTextFilter,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
// @ts-expect-error TS(7031): Binding element 'currentFilterType' implicitly has... Remove this comment to see the full error message
	currentFilterType,
}) => {
	const { t } = useTranslation();
	const [displayNavigation, setNavigation] = useState(false);

	const loadRecordings = async () => {
		// Fetching recordings from server
		await loadingRecordings();

		// Load recordings into table
		loadingRecordingsIntoTable();
	};

	useEffect(() => {
		if ("recordings" !== currentFilterType) {
			loadingFilters("recordings");
		}

		resetTextFilter();

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
						loadResource={loadingRecordings}
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
	recordings: getTotalRecordings(state),
	user: getUserInformation(state),
	currentFilterType: getCurrentFilterResource(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
	loadingRecordings: () => dispatch(fetchRecordings()),
	loadingRecordingsIntoTable: () => dispatch(loadRecordingsIntoTable()),
// @ts-expect-error TS(7006): Parameter 'resource' implicitly has an 'any' type.
	loadingFilters: (resource) => dispatch(fetchFilters(resource)),
	resetTextFilter: () => dispatch(editTextFilter("")),
});

export default connect(mapStateToProps, mapDispatchToProps)(Recordings);
