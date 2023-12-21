import axios from "axios";
import moment from "moment";
import {
	createChartOptions,
	createDownloadUrl,
} from "../utils/statisticsUtils";
import { getHttpHeaders } from "../utils/resourceUtils";
import { getStatistics } from "../selectors/statisticsSelectors";
import {
	loadStatisticsFailure,
	loadStatisticsInProgress,
	loadStatisticsSuccess,
	updateStatisticsFailure,
	updateStatisticsSuccess,
} from "../actions/statisticsActions";

/* thunks for fetching statistics data */

// @ts-expect-error TS(7006): Parameter 'organizationId' implicitly has an 'any'... Remove this comment to see the full error message
export const fetchStatisticsPageStatistics = (organizationId) => async (
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
	dispatch
) => {
	dispatch(
		fetchStatistics(
			organizationId,
			"organization",
			getStatistics,
			loadStatisticsInProgress,
			loadStatisticsSuccess,
			loadStatisticsFailure
		)
	);
};

export const fetchStatisticsPageStatisticsValueUpdate = (
// @ts-expect-error TS(7006): Parameter 'organizationId' implicitly has an 'any'... Remove this comment to see the full error message
	organizationId,
// @ts-expect-error TS(7006): Parameter 'providerId' implicitly has an 'any' typ... Remove this comment to see the full error message
	providerId,
// @ts-expect-error TS(7006): Parameter 'from' implicitly has an 'any' type.
	from,
// @ts-expect-error TS(7006): Parameter 'to' implicitly has an 'any' type.
	to,
// @ts-expect-error TS(7006): Parameter 'dataResolution' implicitly has an 'any'... Remove this comment to see the full error message
	dataResolution,
// @ts-expect-error TS(7006): Parameter 'timeMode' implicitly has an 'any' type.
	timeMode
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
) => async (dispatch) => {
	dispatch(
		fetchStatisticsValueUpdate(
			organizationId,
			"organization",
			providerId,
			from,
			to,
			dataResolution,
			timeMode,
			getStatistics,
			updateStatisticsSuccess,
			updateStatisticsFailure
		)
	);
};

export const fetchStatistics = (
// @ts-expect-error TS(7006): Parameter 'resourceId' implicitly has an 'any' typ... Remove this comment to see the full error message
	resourceId,
// @ts-expect-error TS(7006): Parameter 'resourceType' implicitly has an 'any' t... Remove this comment to see the full error message
	resourceType,
// @ts-expect-error TS(7006): Parameter 'getStatistics' implicitly has an 'any' ... Remove this comment to see the full error message
	getStatistics,
// @ts-expect-error TS(7006): Parameter 'loadStatisticsInProgress' implicitly ha... Remove this comment to see the full error message
	loadStatisticsInProgress,
// @ts-expect-error TS(7006): Parameter 'loadStatisticsSuccess' implicitly has a... Remove this comment to see the full error message
	loadStatisticsSuccess,
// @ts-expect-error TS(7006): Parameter 'loadStatisticsFailure' implicitly has a... Remove this comment to see the full error message
	loadStatisticsFailure
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
) => async (dispatch, getState) => {
	dispatch(loadStatisticsInProgress());

	// get prior statistics
	const state = getState();
	const statistics = getStatistics(state);

	// create url params
	let params = new URLSearchParams();
	params.append("resourceType", resourceType);

	// get the available statistics providers from API
	axios
		.get("/admin-ng/statistics/providers.json", { params })
		.then((response) => {
			// default values to use, when statistics are viewed the first time
			const originalDataResolution = "monthly";
			const originalTimeMode = "year";
			const originalFrom = moment().startOf(originalTimeMode);
			const originalTo = moment().endOf(originalTimeMode);

// @ts-expect-error TS(7034): Variable 'newStatistics' implicitly has type 'any[... Remove this comment to see the full error message
			let newStatistics = [];
			const statisticsValueRequest = [];

			// iterate over statistics providers
			for (let i = 0; i < response.data.length; i++) {
				// currently, only time series data can be displayed, for other types, add data directly, then continue
				if (response.data[i].providerType !== "timeSeries") {
					newStatistics.push({
						...response.data[i],
					});
				} else {
					// case: provider is of type time series
					let from;
					let to;
					let timeMode;
					let dataResolution;

					/* if old values for this statistic exist, use old
                    from (date), to (date), timeMode and dataResolution values, otherwise use defaults */
					if (statistics.length > i) {
						from = statistics[i].from;
						to = statistics[i].to;
						timeMode = statistics[i].timeMode;
						dataResolution = statistics[i].dataResolution;
					} else {
						from = originalFrom.format("YYYY-MM-DD");
						to = originalTo.format("YYYY-MM-DD");
						timeMode = originalTimeMode;
						dataResolution = originalDataResolution;
					}

					// create chart options and download url
					const options = createChartOptions(timeMode, dataResolution);
					const csvUrl = createDownloadUrl(
						resourceId,
						resourceType,
						response.data[i].providerId,
						from,
						to,
						dataResolution
					);

					// add provider to statistics list and add statistic settings
					newStatistics.push({
						...response.data[i],
						from: from,
						to: to,
						timeMode: timeMode,
						dataResolution: dataResolution,
						options: options,
						csvUrl: csvUrl,
					});

					// add settings for this statistic of this resource to value request
					statisticsValueRequest.push({
						dataResolution: dataResolution,
						from: moment(from),
						to: moment(to).endOf("day"),
						resourceId: resourceId,
						providerId: response.data[i].providerId,
					});
				}
			}

			// prepare header and data for statistics values request
			const requestHeaders = getHttpHeaders();
			const requestData = new URLSearchParams({
				data: JSON.stringify(statisticsValueRequest),
			});

			// request statistics values from API
			axios
				.post("/admin-ng/statistics/data.json", requestData, requestHeaders)
				.then((dataResponse) => {
					// iterate over value responses
					for (const statisticsValue of dataResponse.data) {
						// get the statistic the response is meant for
// @ts-expect-error TS(7005): Variable 'newStatistics' implicitly has an 'any[]'... Remove this comment to see the full error message
						const stat = newStatistics.find(
							(element) => element.providerId === statisticsValue.providerId
						);

						// add values to statistic
						const statistic = {
							...stat,
							values: statisticsValue.values,
							labels: statisticsValue.labels,
							totalValue: statisticsValue.total,
						};

						// put updated statistic into statistics list
// @ts-expect-error TS(7005): Variable 'newStatistics' implicitly has an 'any[]'... Remove this comment to see the full error message
						newStatistics = newStatistics.map((oldStat) =>
							oldStat === stat ? statistic : oldStat
						);

						// put statistics list into redux store
						dispatch(loadStatisticsSuccess(newStatistics, false));
					}
// @ts-expect-error TS(7005): Variable 'newStatistics' implicitly has an 'any[]'... Remove this comment to see the full error message
					dispatch(loadStatisticsSuccess(newStatistics, false));
				})
				.catch((response) => {
					// put unfinished statistics list into redux store but set flag that an error occurred
// @ts-expect-error TS(7005): Variable 'newStatistics' implicitly has an 'any[]'... Remove this comment to see the full error message
					dispatch(loadStatisticsSuccess(newStatistics, true));
					console.error(response);
				});
		})
		.catch((response) => {
			// getting statistics from API failed
			dispatch(loadStatisticsFailure(true));
			console.error(response);
		});
};

export const fetchStatisticsValueUpdate = (
// @ts-expect-error TS(7006): Parameter 'resourceId' implicitly has an 'any' typ... Remove this comment to see the full error message
	resourceId,
// @ts-expect-error TS(7006): Parameter 'resourceType' implicitly has an 'any' t... Remove this comment to see the full error message
	resourceType,
// @ts-expect-error TS(7006): Parameter 'providerId' implicitly has an 'any' typ... Remove this comment to see the full error message
	providerId,
// @ts-expect-error TS(7006): Parameter 'from' implicitly has an 'any' type.
	from,
// @ts-expect-error TS(7006): Parameter 'to' implicitly has an 'any' type.
	to,
// @ts-expect-error TS(7006): Parameter 'dataResolution' implicitly has an 'any'... Remove this comment to see the full error message
	dataResolution,
// @ts-expect-error TS(7006): Parameter 'timeMode' implicitly has an 'any' type.
	timeMode,
// @ts-expect-error TS(7006): Parameter 'getStatistics' implicitly has an 'any' ... Remove this comment to see the full error message
	getStatistics,
// @ts-expect-error TS(7006): Parameter 'updateStatisticsSuccess' implicitly has... Remove this comment to see the full error message
	updateStatisticsSuccess,
// @ts-expect-error TS(7006): Parameter 'updateStatisticsFailure' implicitly has... Remove this comment to see the full error message
	updateStatisticsFailure
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
) => async (dispatch, getState) => {
	// get prior statistics
	const state = getState();
	const statistics = getStatistics(state);

	// settings for this statistic of this resource for value request
	const statisticsValueRequest = [
		{
			dataResolution: dataResolution,
			from: moment(from),
			to: moment(to).endOf("day"),
			resourceId: resourceId,
			providerId: providerId,
		},
	];

	// prepare header and data for statistic values request
	const requestHeaders = getHttpHeaders();
	const requestData = new URLSearchParams({
		data: JSON.stringify(statisticsValueRequest),
	});

	// request statistic values from API
	axios
		.post("/admin-ng/statistics/data.json", requestData, requestHeaders)
		.then((dataResponse) => {
			// if only one element is in the response (as expected), get the response
			if (dataResponse.data.length === 1) {
				const newStatisticData = dataResponse.data[0];

				// get the statistic the response is meant for out of the statistics list
				const stat = statistics.find(
// @ts-expect-error TS(7006): Parameter 'element' implicitly has an 'any' type.
					(element) => element.providerId === providerId
				);

				// get statistic options and download url for new statistic settings
				const options = createChartOptions(timeMode, dataResolution);
				const csvUrl = createDownloadUrl(
					resourceId,
					resourceType,
					providerId,
					from,
					to,
					dataResolution
				);

				// update statistic
				const statistic = {
					...stat,
					from: from,
					to: to,
					dataResolution: dataResolution,
					timeMode: timeMode,
					options: options,
					csvUrl: csvUrl,
					values: newStatisticData.values,
					labels: newStatisticData.labels,
					totalValue: newStatisticData.total,
				};

				// put updated statistic into statistics list
// @ts-expect-error TS(7006): Parameter 'oldStat' implicitly has an 'any' type.
				const newStatistics = statistics.map((oldStat) =>
					oldStat === stat ? statistic : oldStat
				);

				// put updates statistics list into redux store
				dispatch(updateStatisticsSuccess(newStatistics));
			}
		})
		.catch((response) => {
			// getting new statistic values from API failed
			dispatch(updateStatisticsFailure());
			console.error(response);
		});
};
