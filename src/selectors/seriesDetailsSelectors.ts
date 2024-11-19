import { RootState } from "../store";

/**
 * This file contains selectors regarding details of a certain series
 */

/* Selectors for the modal */
export const showModal = (state: RootState) => state.seriesDetails.modal.show;
export const getModalPage = (state: RootState) => state.seriesDetails.modal.page;
export const getModalSeries = (state: RootState) => state.seriesDetails.modal.series;

export const getSeriesDetailsMetadata = (state: RootState) => state.seriesDetails.metadata;
export const getSeriesDetailsExtendedMetadata = (state: RootState) => state.seriesDetails.extendedMetadata;
export const getSeriesDetailsAcl = (state: RootState) => state.seriesDetails.acl;
export const getSeriesDetailsFeeds = (state: RootState) => state.seriesDetails.feeds;
export const getSeriesDetailsTheme = (state: RootState) => state.seriesDetails.theme;
export const getSeriesDetailsThemeNames = (state: RootState) =>
	state.seriesDetails.themeNames;

export const getSeriesDetailsTobiraData = (state: RootState) =>
	state.seriesDetails.tobiraData
export const getSeriesDetailsTobiraDataError = (state: RootState) =>
	state.seriesDetails.errorTobiraData

/* selectors for statistics */
export const hasStatistics = (state: RootState) =>
	state.seriesDetails.statistics.length > 0;
export const getStatistics = (state: RootState) => state.seriesDetails.statistics;
export const hasStatisticsError = (state: RootState) =>
	state.seriesDetails.hasStatisticsError;
export const isFetchingStatistics = (state: RootState) =>
	state.seriesDetails.statusStatistics === 'loading';
