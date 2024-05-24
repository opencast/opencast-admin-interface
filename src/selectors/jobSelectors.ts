import { RootState } from "../store";

/**
 * This file contains selectors regarding jobs
 */
export const getJobs = (state: RootState) => state.jobs.results;
export const getTotalJobs = (state: RootState) => state.jobs.total;
