import { RootState } from "../store";

/**
 * This file contains selectors regarding information about the health status
 */
export const getHealthStatus = (state: RootState) => state.health.service;
export const getErrorStatus = (state: RootState) => state.health.error;
export const getErrorCount = (state: RootState) => state.health.numErr;
