import { RootState } from "../store";

/**
 * This file contains selectors regarding services
 */
export const getServices = (state: RootState) => state.services.results;
export const getTotalServices = (state: RootState) => state.services.total;
