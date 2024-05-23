import { RootState } from "../store";

/**
 * This file contains selectors regarding details of a certain user
 */
export const getUserDetails = (state: RootState) => state.userDetails;
