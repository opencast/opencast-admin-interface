import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { getFilterProfiles } from "../../selectors/tableFilterProfilesSelectors";
import {
	FilterProfile,
	createFilterProfile,
	removeFilterProfile,
} from "../../slices/tableFilterProfilesSlice";
import {
	goToPage,
} from "../../thunks/tableThunks";
import { getFilters } from "../../selectors/tableFilterSelectors";
import { FilterData, loadFilterProfile } from "../../slices/tableFilterSlice";
import { AppThunk, useAppDispatch, useAppSelector } from "../../store";
import { useHotkeys } from "react-hotkeys-hook";
import { availableHotkeys } from "../../configs/hotkeysConfig";
import { Tooltip } from "./Tooltip";
import { AsyncThunk } from "@reduxjs/toolkit";
import { AsyncThunkConfig } from "@reduxjs/toolkit/dist/createAsyncThunk";

/**
 * This component renders the table filter profiles in the upper right corner when clicked on settings icon of the
 * table filters.
 */
const TableFiltersProfiles = ({
	showFilterSettings,
	setFilterSettings,
	loadResource,
	loadResourceIntoTable,
	resource,
}: {
	showFilterSettings: boolean,
	setFilterSettings: (_: boolean) => void,
	loadResource: AsyncThunk<any, void, AsyncThunkConfig>,
	loadResourceIntoTable: () => AppThunk,
	resource: string,
}) => {
	const dispatch = useAppDispatch();

	const profiles = useAppSelector(state => getFilterProfiles(state));
	const filterMap = useAppSelector(state => getFilters(state));

	// State for switching between list of profiles and saving/editing dialog
	const [settingsMode, setSettingsMode] = useState(true);

	// State for helping saving and editing profiles
	const [profileName, setProfileName] = useState("");
	const [profileDescription, setProfileDescription] = useState("");
	const [currentlyEditing, setCurrentlyEditing] = useState<FilterProfile | null>(null);
	const [validName, setValidName] = useState(false);

	const { t } = useTranslation();

	useHotkeys(
		availableHotkeys.general.CLOSE_MODAL.sequence,
		() => setFilterSettings(false),
		{ description: t(availableHotkeys.general.CLOSE_MODAL.description) ?? undefined },
		[setFilterSettings],
  	);

	const currentProfiles = profiles.filter(
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
			dispatch(createFilterProfile(filterProfile));
		}
		setSettingsMode(!settingsMode);
		resetStateValues();
	};

	const editFilterProfile = (profile: FilterProfile) => {
		setSettingsMode(false);
		setCurrentlyEditing(profile);
		setProfileName(profile.name);
		setProfileDescription(profile.description);
		dispatch(removeFilterProfile(profile));
		setValidName(true);
	};

	const cancelEditProfile = () => {
		// This holds the value of the profile being edited (in edit mode), and by cancelling the process, the profile won't vanish!
		if (currentlyEditing) {
			dispatch(createFilterProfile(currentlyEditing));
		}
		setSettingsMode(true);
		resetStateValues();
	};

	const closeFilterSetting = () => {
		if (currentlyEditing) {
			cancelEditProfile();
		}
		setFilterSettings(!showFilterSettings);
	};

	const resetStateValues = () => {
		setProfileName("");
		setProfileDescription("");
		setCurrentlyEditing(null);
		setValidName(false);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const itemName = e.target.name;
		const itemValue = e.target.value;

		if (itemName === "name") {
			const isDuplicated = profiles.some(
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

	const chooseFilterProfile = (filterMap: FilterData[]) => {
		dispatch(loadFilterProfile(filterMap));

		// No matter what, we go to page one.
		dispatch(goToPage(0))
		// Reload resources when filters are removed
		dispatch(loadResource());
		dispatch(loadResourceIntoTable());
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
									onClick={closeFilterSetting}
								/>
								<h4>{t("TABLE_FILTERS.PROFILES.FILTERS_HEADER")}</h4>
							</header>
							<ul>
								{currentProfiles.length === 0 ? (
									//if no profiles saved yet
									<li>{t("TABLE_FILTERS.PROFILES.EMPTY")}</li>
								) : (
									// repeat for each profile in profiles filtered for currently shown resource (else-case)
									currentProfiles.map((profile, key) => (
										<li key={key}>
											<Tooltip title={profile.description}>
												<button
													onClick={() => chooseFilterProfile(profile.filterMap)}
													className="button-like-anchor"
												>
													{profile.name.substr(0, 70)}
												</button>
											</Tooltip>
											{/* Settings icon to edit profile */}
											<Tooltip title={t("TABLE_FILTERS.PROFILES.EDIT")}>
												<button
													onClick={() => editFilterProfile(profile)}
													className="button-like-anchor icon edit"
												/>
											</Tooltip>
											{/* Remove icon to remove profile */}
											<Tooltip title={t("TABLE_FILTERS.PROFILES.REMOVE")}>
												<button
													onClick={() => dispatch(removeFilterProfile(profile))}
													className="button-like-anchor icon remove"
												/>
											</Tooltip>
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
										{t("TABLE_FILTERS.PROFILES.ADD").substr(0, 70)}
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
									onClick={closeFilterSetting}
								/>
								<h4>{t("TABLE_FILTERS.PROFILES.FILTER_HEADER")}</h4>
							</header>
							{/* Input form for save/editing profile*/}
							<div className="edit-details">
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
									placeholder={t("TABLE_FILTERS.PROFILES.NAME_PLACEHOLDER")}
								/>

								<label>{t("TABLE_FILTERS.PROFILES.DESCRIPTION")}</label>
								{/*Input for a description of the filter profile*/}
								<textarea
									value={profileDescription}
									name="description"
									onChange={(e) => handleChange(e)}
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



export default TableFiltersProfiles;
