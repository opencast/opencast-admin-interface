/**
 * This file contains selectors regarding users
 */
import { createSelector } from "reselect";

export const getUsers = (state: any) => state.users.results;
export const getTotalUsers = (state: any) => state.users.total;

export const getUsernames = createSelector(getUsers, (users) => {
// @ts-expect-error TS(7006): Parameter 'user' implicitly has an 'any' type.
	return users.map((user) => user.username);
});
