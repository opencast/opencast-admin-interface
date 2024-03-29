import {
	CANCEL_EDITING_FILTER_PROFILE,
	CREATE_FILTER_PROFILE,
	EDIT_FILTER_PROFILE,
	REMOVE_FILTER_PROFILE,
} from "../actions/tableFilterProfilesActions";

/**
 * This file contains redux reducer for actions affecting the state of table filter profiles
 */

// Initial state of filter profiles in redux store
const initialState = {
	profiles: [],
};

// Reducer for filter profiles
// @ts-expect-error TS(7006): Parameter 'action' implicitly has an 'any' type.
const tableFilterProfiles = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case CREATE_FILTER_PROFILE: {
			const { filterProfile } = payload;
			return {
				...state,
				profiles: state.profiles.concat(filterProfile),
			};
		}
		case EDIT_FILTER_PROFILE: {
			const { filterProfile: updatedFilterProfile } = payload;
			return {
				...state,
				profiles: state.profiles.map((filterProfile) => {
// @ts-expect-error TS(2339): Property 'name' does not exist on type 'never'.
					if (filterProfile.name === updatedFilterProfile.name) {
						return updatedFilterProfile;
					}
					return filterProfile;
				}),
			};
		}
		case REMOVE_FILTER_PROFILE: {
			const { filterProfile: filterProfileToRemove } = payload;
			return {
				...state,
				profiles: state.profiles.filter(
// @ts-expect-error TS(2339): Property 'name' does not exist on type 'never'.
					(filterProfile) => filterProfile.name !== filterProfileToRemove.name
				),
			};
		}
		case CANCEL_EDITING_FILTER_PROFILE: {
			return state;
		}
		default:
			return state;
	}
};

export default tableFilterProfiles;
