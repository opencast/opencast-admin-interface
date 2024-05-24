import { RootState } from "../store";

/**
 * This file contains selectors regarding details of a certain group
 */
export const getGroupDetails = (state: RootState) => state.groupDetails;
