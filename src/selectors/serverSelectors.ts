import { RootState } from "../store";

/**
 * This file contains selectors regarding servers
 */
export const getServers = (state: RootState) => state.servers.results;
export const getTotalServers = (state: RootState) => state.servers.total;
