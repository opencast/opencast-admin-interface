import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getFilters, getStats } from "../../selectors/tableFilterSelectors";
import {
	editFilterValue,
	resetFilterValues,
	fetchStats,
} from "../../slices/tableFilterSlice";
import { connect } from "react-redux";
import { loadEventsIntoTable } from "../../thunks/tableThunks";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchEvents } from "../../slices/eventSlice";

/**
 * This component renders the status bar of the event view and filters depending on these
 */
const Stats = ({
// @ts-expect-error TS(7031): Binding element 'loadEventsIntoTable' implicitly h... Remove this comment to see the full error message
	loadEventsIntoTable,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state));
	const stats = useAppSelector(state => getStats(state));

	// Filter with value of clicked status
// @ts-expect-error TS(7006): Parameter 'stats' implicitly has an 'any' type.
	const showStatsFilter = async (stats) => {
		dispatch(resetFilterValues());
		let filterValue;
// @ts-expect-error TS(7006): Parameter 'f' implicitly has an 'any' type.
		await stats.filters.forEach((f) => {
			let filter = filterMap.find(({ name }) => name === f.name);
			filterValue = f.value;
			if (!!filter) {
				dispatch(editFilterValue({filterName: filter.name, value: filterValue}));
			}
		});
		await dispatch(fetchEvents());
		loadEventsIntoTable();
	};

	const loadStats = async () => {
		// Fetching stats from server
		await dispatch(fetchStats());
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
				{stats.map((st, key) => (
					<div className="col" key={key}>
						<button className="stat" onClick={() => showStatsFilter(st)}>
							<h1>{st.count}</h1>
							{/* Show the description of the status, if defined,
								else show name of filter and its value*/}
							{!!st.description ? (
								<span>{t(st.description)}</span>
							) : (
								st.filters.map((filter, key) => (
									<span key={key}>
										{t(filter.filter)}: {t(filter.value)}
									</span>
								))
							)}
						</button>
					</div>
				))}
			</div>
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
	loadEventsIntoTable: () => dispatch(loadEventsIntoTable()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
