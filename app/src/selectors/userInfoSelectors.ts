/**
 * This file contains selectors regarding information about the current user
 */
export const getUserInformation = (state: any) => state.userInfo;
export const getUserBasicInfo = (state: any) => state.userInfo.user;
export const getUserRoles = (state: any) => state.userInfo.roles;
export const getOrgProperties = (state: any) => state.userInfo.org.properties;
export const getOrgId = (state: any) => state.userInfo.org.id;
