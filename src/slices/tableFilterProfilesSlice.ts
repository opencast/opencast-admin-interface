import { PayloadAction, createSlice } from '@reduxjs/toolkit'

/**
 * This file contains redux reducer for actions affecting the state of table filter profiles
 */

type FilterProfile = {
	name: string,
	description: string,
	resource: string,
	filterMap: {
		label: string,
		name: string
		options: {
			label: string,
			value: string,
		}[],
		translatable: false,
		type: string,
		value: string,
	}[]
}

type TableFilterProfilesState = {
	profiles: FilterProfile[]
}

// Initial state of filter profiles in redux store
const initialState: TableFilterProfilesState = {
	profiles: []
};

const tableFilterProfileSlice = createSlice({
	name: 'tableFilterProfiles',
	initialState,
	reducers: {
		createFilterProfile(state, action: PayloadAction<
			FilterProfile
		>) {
			const filterProfile = action.payload;
			state.profiles = state.profiles.concat(filterProfile)
		},
		editFilterProfile(state, action: PayloadAction<
			FilterProfile
		>) {
			const updatedFilterProfile = action.payload;
			state.profiles = state.profiles.map((filterProfile) => {
				if (filterProfile.name === updatedFilterProfile.name) {
					return updatedFilterProfile;
				}
				return filterProfile;
			})
		},
		removeFilterProfile(state, action: PayloadAction<
			FilterProfile
		>) {
			const filterProfileToRemove = action.payload;
			state.profiles = state.profiles.filter(
									(filterProfile) => filterProfile.name !== filterProfileToRemove.name
								)
		},
		cancelEditFilterProfile(state) {
			return
		}
	},
});

export const {
	createFilterProfile,
	editFilterProfile,
	removeFilterProfile,
	cancelEditFilterProfile,
} = tableFilterProfileSlice.actions;

// Export the slice reducer as the default export
export default tableFilterProfileSlice.reducer;
