/**
 * This file contains selectors regarding information about the health status
 */

export const getHealthStatus = (state: any) => state.health.service;
export const getErrorStatus = (state: any) => state.health.error;
export const getErrorCount = (state: any) => state.health.numErr;
