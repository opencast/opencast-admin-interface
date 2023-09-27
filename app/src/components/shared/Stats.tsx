import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getFilters, getStats } from "../../selectors/tableFilterSelectors";
import {
	editFilterValue,
	resetFilterValues,
} from "../../actions/tableFilterActions";
import { connect } from "react-redux";
import { fetchEvents } from "../../thunks/eventThunks";
import { loadEventsIntoTable } from "../../thunks/tableThunks";
import { fetchStats } from "../../thunks/tableFilterThunks";

/**
 * This component renders the status bar of the event view and filters depending on these
 */
const Stats = ({
// @ts-expect-error TS(7031): Binding element 'loadingStats' implicitly has an '... Remove this comment to see the full error message
	loadingStats,
// @ts-expect-error TS(7031): Binding element 'stats' implicitly has an 'any' ty... Remove this comment to see the full error message
	stats,
// @ts-expect-error TS(7031): Binding element 'filterMap' implicitly has an 'any... Remove this comment to see the full error message
	filterMap,
// @ts-expect-error TS(7031): Binding element 'editFilterValue' implicitly has a... Remove this comment to see the full error message
	editFilterValue,
// @ts-expect-error TS(7031): Binding element 'loadEvents' implicitly has an 'an... Remove this comment to see the full error message
	loadEvents,
// @ts-expect-error TS(7031): Binding element 'loadEventsIntoTable' implicitly h... Remove this comment to see the full error message
	loadEventsIntoTable,
// @ts-expect-error TS(7031): Binding element 'resetFilterMap' implicitly has an... Remove this comment to see the full error message
	resetFilterMap,
}) => {
	const { t } = useTranslation();

	// Filter with value of clicked status
// @ts-expect-error TS(7006): Parameter 'stats' implicitly has an 'any' type.
	const showStatsFilter = async (stats) => {
		resetFilterMap();
		let filterValue;
// @ts-expect-error TS(7006): Parameter 'f' implicitly has an 'any' type.
		await stats.filters.forEach((f) => {
// @ts-expect-error TS(7031): Binding element 'name' implicitly has an 'any' typ... Remove this comment to see the full error message
			let filter = filterMap.find(({ name }) => name === f.name);
			filterValue = f.value;
			if (!!filter) {
				editFilterValue(filter.name, filterValue);
			}
		});
		await loadEvents();
		loadEventsIntoTable();
	};

	const loadStats = async () => {
		// Fetching stats from server
		await loadingStats();
	};

	useEffect(() => {
		// Load stats on mount
		loadStats().then((r) => console.info(r));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className="main-stats">
				{/* Show one counter for each status */}
{/* @ts-expect-error TS(7006): Parameter 'st' implicitly has an 'any' type. */}
				{stats.map((st, key) => (
					<div className="col" key={key}>
						<div
							className="stat"
							onClick={() => showStatsFilter(st)}
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
							title={t(st.description)}
						>
							<h1>{st.count}</h1>
							{/* Show the description of the status, if defined,
                            else show name of filter and its value*/}
							{!!st.description ? (
								<span>{t(st.description)}</span>
							) : (
// @ts-expect-error TS(7006): Parameter 'filter' implicitly has an 'any' type.
								st.filters.map((filter, key) => (
									<span key={key}>
										{t(filter.filter)}: {t(filter.value)}
									</span>
								))
							)}
						</div>
					</div>
				))}
			</div>
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	filterMap: getFilters(state),
	stats: getStats(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadingStats: () => dispatch(fetchStats()),
// @ts-expect-error TS(7006): Parameter 'filterName' implicitly has an 'any' typ... Remove this comment to see the full error message
	editFilterValue: (filterName, value) =>
		dispatch(editFilterValue(filterName, value)),
	loadEvents: () => dispatch(fetchEvents()),
	loadEventsIntoTable: () => dispatch(loadEventsIntoTable()),
	resetFilterMap: () => dispatch(resetFilterValues()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
