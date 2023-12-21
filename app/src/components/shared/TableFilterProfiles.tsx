import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import cn from "classnames";
import { getFilterProfiles } from "../../selectors/tableFilterProfilesSelectors";
import {
	cancelEditFilterProfile,
	createFilterProfile,
	editFilterProfile,
	removeFilterProfile,
} from "../../actions/tableFilterProfilesActions";
import { getFilters } from "../../selectors/tableFilterSelectors";
import { loadFilterProfile } from "../../actions/tableFilterActions";

/**
 * This component renders the table filter profiles in the upper right corner when clicked on settings icon of the
 * table filters.
 */
const TableFiltersProfiles = ({
// @ts-expect-error TS(7031): Binding element 'showFilterSettings' implicitly ha... Remove this comment to see the full error message
	showFilterSettings,
// @ts-expect-error TS(7031): Binding element 'setFilterSettings' implicitly has... Remove this comment to see the full error message
	setFilterSettings,
// @ts-expect-error TS(7031): Binding element 'createFilterProfile' implicitly h... Remove this comment to see the full error message
	createFilterProfile,
// @ts-expect-error TS(7031): Binding element 'filterMap' implicitly has an 'any... Remove this comment to see the full error message
	filterMap,
// @ts-expect-error TS(7031): Binding element 'cancelEditFilterProfile' implicit... Remove this comment to see the full error message
	cancelEditFilterProfile,
// @ts-expect-error TS(7031): Binding element 'profiles' implicitly has an 'any'... Remove this comment to see the full error message
	profiles,
// @ts-expect-error TS(7031): Binding element 'removeFilterProfile' implicitly h... Remove this comment to see the full error message
	removeFilterProfile,
// @ts-expect-error TS(7031): Binding element 'loadFilterProfile' implicitly has... Remove this comment to see the full error message
	loadFilterProfile,
// @ts-expect-error TS(7031): Binding element 'loadResource' implicitly has an '... Remove this comment to see the full error message
	loadResource,
// @ts-expect-error TS(7031): Binding element 'loadResourceIntoTable' implicitly... Remove this comment to see the full error message
	loadResourceIntoTable,
// @ts-expect-error TS(7031): Binding element 'resource' implicitly has an 'any'... Remove this comment to see the full error message
	resource,
}) => {
	// State for switching between list of profiles and saving/editing dialog
	const [settingsMode, setSettingsMode] = useState(true);

	// State for helping saving and editing profiles
	const [profileName, setProfileName] = useState("");
	const [profileDescription, setProfileDescription] = useState("");
	const [currentlyEditing, setCurrentlyEditing] = useState("");
	const [validName, setValidName] = useState(false);

	const { t } = useTranslation();

	const currentProfiles = profiles.filter(
// @ts-expect-error TS(7006): Parameter 'profile' implicitly has an 'any' type.
		(profile) => profile.resource === resource
	);

	// todo: Maybe saving to storage is needed
	const saveProfile = () => {
		if (validName) {
			const filterProfile = {
				name: profileName,
				description: profileDescription,
				filterMap: filterMap,
				resource: resource,
			};
			createFilterProfile(filterProfile);
		}
		setSettingsMode(!settingsMode);
		resetStateValues();
	};

// @ts-expect-error TS(7006): Parameter 'profile' implicitly has an 'any' type.
	const editFilterProfile = (profile) => {
		setSettingsMode(false);
		setCurrentlyEditing(profile);
		setProfileName(profile.name);
		setProfileDescription(profile.description);
		removeFilterProfile(profile);
		setValidName(true);
	};

	const cancelEditProfile = () => {
		if (currentlyEditing !== "") {
			createFilterProfile(currentlyEditing);
		}
		cancelEditFilterProfile();
		setSettingsMode(!settingsMode);
		setFilterSettings(!showFilterSettings);
		resetStateValues();
	};

	const resetStateValues = () => {
		setProfileName("");
		setProfileDescription("");
		setCurrentlyEditing("");
		setValidName(false);
	};

// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const handleChange = (e) => {
		const itemName = e.target.name;
		const itemValue = e.target.value;

		if (itemName === "name") {
			const isDuplicated = profiles.some(
// @ts-expect-error TS(7006): Parameter 'profile' implicitly has an 'any' type.
				(profile) => profile.name === itemValue
			);
			if (!isDuplicated) {
				setValidName(true);
			} else {
				setValidName(false);
			}
			setProfileName(itemValue);
		}
		if (itemName === "description") {
			setProfileDescription(itemValue);
		}
	};

// @ts-expect-error TS(7006): Parameter 'filterMap' implicitly has an 'any' type... Remove this comment to see the full error message
	const chooseFilterProfile = (filterMap) => {
		loadFilterProfile(filterMap);

		// Reload resources when filters are removed
		loadResource();
		loadResourceIntoTable();
	};

	return (
		<>
			{/*Show filter profiles dialog if settings icon in TableFilters is clicked*/}
			{showFilterSettings && (
				<div className="btn-dd filter-settings-dd df-profile-filters">
					{/* depending on settingsMode show list of all saved profiles or the chosen profile to edit*/}
					{settingsMode ? (
						// if settingsMode is true the list with all saved profiles is shown
						<div className="filters-list">
							<header>
								<button
									className="button-like-anchor icon close"
									onClick={() => setFilterSettings(!showFilterSettings)}
								/>
								<h4>{t("TABLE_FILTERS.PROFILES.FILTERS_HEADER")}</h4>
							</header>
							<ul>
								{currentProfiles.length === 0 ? (
									//if no profiles saved yet
									<li>{t("TABLE_FILTERS.PROFILES.EMPTY")}</li>
								) : (
									// repeat for each profile in profiles filtered for currently shown resource (else-case)
// @ts-expect-error TS(7006): Parameter 'profile' implicitly has an 'any' type.
									currentProfiles.map((profile, key) => (
										<li key={key}>
											<button
												title="profile.description"
												onClick={() => chooseFilterProfile(profile.filterMap)}
                        className="button-like-anchor"
											>
												{profile.name.substr(0, 70)}
											</button>
											{/* Settings icon to edit profile */}
											<button
												onClick={() => editFilterProfile(profile)}
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
												title={t("TABLE_FILTERS.PROFILES.EDIT")}
												className="button-like-anchor icon edit"
											/>
											{/* Remove icon to remove profile */}
											<button
												onClick={() => removeFilterProfile(profile)}
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
												title={t("TABLE_FILTERS.PROFILES.REMOVE")}
												className="button-like-anchor icon remove"
											/>
										</li>
									))
								)}
							</ul>

							{/* Save the currently selected filter options as new profile */}
							{/* settingsMode is switched and save dialog is opened*/}
							<div className="input-container">
								<div className="btn-container">
									<button
										className="button-like-anchor save"
										onClick={() => setSettingsMode(!settingsMode)}
									>
										{t("TABLE_FILTERS.PROFILES.SAVE_FILTERS").substr(0, 70)}
									</button>
								</div>
							</div>
						</div>
					) : (
						// if settingsMode is false then show editing dialog of selected filter profile
						<div className="filter-details">
							<header>
								<button
									className="button-like-anchor icon close"
									onClick={() => {
										setFilterSettings(!showFilterSettings);
										setSettingsMode(true);
									}}
								/>
								<h4>{t("TABLE_FILTERS.PROFILES.FILTER_HEADER")}</h4>
							</header>
							{/* Input form for save/editing profile*/}
							<div>
								<label>
									{t("TABLE_FILTERS.PROFILES.NAME")}{" "}
									<i className="required">*</i>
								</label>
								{/*Input for name of the filter profile*/}
								<input
									required
									name="name"
									type="text"
									value={profileName}
									onChange={(e) => handleChange(e)}
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
									placeholder={t("TABLE_FILTERS.PROFILES.NAME_PLACEHOLDER")}
								/>

								<label>{t("TABLE_FILTERS.PROFILES.DESCRIPTION")}</label>
								{/*Input for a description of the filter profile*/}
								<textarea
									value={profileDescription}
									name="description"
									onChange={(e) => handleChange(e)}
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
									placeholder={t(
										"TABLE_FILTERS.PROFILES.DESCRIPTION_PLACEHOLDER"
									)}
								/>
							</div>
							<div className="input-container">
								{/* Buttons for saving and canceling editing */}
								<div className="btn-container">
									<button onClick={cancelEditProfile} className="button-like-anchor cancel">
										{t("CANCEL")}
									</button>
									<button
										onClick={saveProfile}
										className={"button-like-anchor " + cn("save", { disabled: !validName })}
									>
										{t("SAVE")}
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	filterMap: getFilters(state),
	profiles: getFilterProfiles(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'filterMap' implicitly has an 'any' type... Remove this comment to see the full error message
	loadFilterProfile: (filterMap) => dispatch(loadFilterProfile(filterMap)),
// @ts-expect-error TS(7006): Parameter 'filterProfile' implicitly has an 'any' ... Remove this comment to see the full error message
	createFilterProfile: (filterProfile) =>
		dispatch(createFilterProfile(filterProfile)),
// @ts-expect-error TS(7006): Parameter 'filterProfile' implicitly has an 'any' ... Remove this comment to see the full error message
	editFilterProfile: (filterProfile) =>
		dispatch(editFilterProfile(filterProfile)),
// @ts-expect-error TS(7006): Parameter 'filterProfile' implicitly has an 'any' ... Remove this comment to see the full error message
	removeFilterProfile: (filterProfile) =>
		dispatch(removeFilterProfile(filterProfile)),
	cancelEditFilterProfile: () => dispatch(cancelEditFilterProfile()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TableFiltersProfiles);
