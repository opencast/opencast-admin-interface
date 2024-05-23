import { RootState } from "../store";

/**
 * This file contains selectors regarding acls
 */
export const getAcls = (state: RootState) => state.acls.results;
export const getTotalAcls = (state: RootState) => state.acls.total;
