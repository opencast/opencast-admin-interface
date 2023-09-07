/* selectors for statistics page */
export const hasStatistics = (state: any) => state.statistics.statistics.length > 0;
export const getStatistics = (state: any) => state.statistics.statistics;
export const hasStatisticsError = (state: any) => state.statistics.hasStatisticsError;
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
export const isFetchingStatistics = (state) =>
	state.statistics.fetchingStatisticsInProgress;
