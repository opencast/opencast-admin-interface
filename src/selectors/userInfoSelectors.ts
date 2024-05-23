import { RootState } from "../store";

/**
 * This file contains selectors regarding information about the current user
 */
export const getUserInformation = (state: RootState) => state.userInfo;
export const getUserBasicInfo = (state: RootState) => state.userInfo.user;
export const getUserRoles = (state: RootState) => state.userInfo.roles;
export const getOrgProperties = (state: RootState) => state.userInfo.org.properties;
export const getOrgId = (state: RootState) => state.userInfo.org.id;
