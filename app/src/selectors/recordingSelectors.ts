import { RootState } from "../store";

/**
 * This file contains selectors regarding recordings
 */
export const getRecordings = (state: RootState) => state.recordings.results;
export const getTotalRecordings = (state: RootState) => state.recordings.total;
