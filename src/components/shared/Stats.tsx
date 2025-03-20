import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getFilters, getStats } from "../../selectors/tableFilterSelectors";
import {
	editFilterValue,
	resetFilterValues,
	fetchStats,
	Stats as StatsType,
	editTextFilter,
	removeTextFilter,
} from "../../slices/tableFilterSlice";
import { loadEventsIntoTable } from "../../thunks/tableThunks";
import { useAppDispatch, useAppSelector } from "../../store";
import { fetchEvents } from "../../slices/eventSlice";
import { ParseKeys } from "i18next";

/**
 * This component renders the status bar of the event view and filters depending on these
 */
const Stats = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const filterMap = useAppSelector(state => getFilters(state, "events"));
	const stats = useAppSelector(state => getStats(state));

	// Filter with value of clicked status
	const showStatsFilter = async (stats: StatsType) => {
		dispatch(resetFilterValues());
		let filterValue;
		await stats.filters.forEach((f) => {
			if (f.name.toLowerCase() === "textfilter") {
				dispatch(editTextFilter(f.value));
				return;
			} else {
				dispatch(removeTextFilter());
			}
			let filter = filterMap.find(({ name }) => name === f.name);
			filterValue = f.value;
			if (!!filter) {
				dispatch(editFilterValue({filterName: filter.name, value: filterValue}));
			}
		});
		await dispatch(fetchEvents());
		dispatch(loadEventsIntoTable());
	};

	const loadStats = async () => {
		// Fetching stats from server
		await dispatch(fetchStats());
	};

	useEffect(() => {
		// Load stats on mount
		loadStats();

		let fetchEventsInterval = setInterval(() => loadStats(), 5000);

		return () => clearInterval(fetchEventsInterval);
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
								<span>{t(st.description as ParseKeys)}</span>
							) : (
								st.filters.map((filter, key) => (
									<span key={key}>
										{t(filter.filter as ParseKeys)}: {t(filter.value as ParseKeys)}
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

export default Stats;
