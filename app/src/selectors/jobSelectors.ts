/**
 * This file contains selectors regarding jobs
 */

export const getJobs = (state: any) => state.jobs.results;
export const getTotalJobs = (state: any) => state.jobs.total;
