import { RootState } from "../store";

/**
 * This file contains selectors regarding details of a certain ACL
 */
export const getAclDetails = (state: RootState) => state.aclDetails;
