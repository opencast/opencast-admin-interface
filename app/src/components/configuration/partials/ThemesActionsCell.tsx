import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import ConfirmModal from "../../shared/ConfirmModal";
import ThemeDetailsModal from "./wizard/ThemeDetailsModal";
import {
	fetchThemeDetails,
	fetchUsage,
} from "../../../thunks/themeDetailsThunks";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { useAppDispatch } from "../../../store";
import { deleteTheme } from "../../../slices/themeSlice";

/**
 * This component renders the action cells of themes in the table view
 */
const ThemesActionsCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
// @ts-expect-error TS(7031): Binding element 'fetchThemeDetails' implicitly has... Remove this comment to see the full error message
	fetchThemeDetails,
// @ts-expect-error TS(7031): Binding element 'fetchUsage' implicitly has an 'an... Remove this comment to see the full error message
	fetchUsage,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [displayDeleteConfirmation, setDeleteConfirmation] = useState(false);
	const [displayThemeDetails, setThemeDetails] = useState(false);

	const hideDeleteConfirmation = () => {
		setDeleteConfirmation(false);
	};

	const hideThemeDetails = () => {
		setThemeDetails(false);
	};

	const showThemeDetails = async () => {
		await fetchThemeDetails(row.id);
		await fetchUsage(row.id);

		setThemeDetails(true);
	};

// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	const deletingTheme = (id) => {
		dispatch(deleteTheme(id));
	};

	return (
		<>
			{/* edit themes */}
			{hasAccess("ROLE_UI_THEMES_EDIT", user) && (
				<button
					onClick={() => showThemeDetails()}
					className="button-like-anchor more"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
					title={t("CONFIGURATION.THEMES.TABLE.TOOLTIP.DETAILS")}
				/>
			)}

			{displayThemeDetails && (
				<ThemeDetailsModal
					handleClose={hideThemeDetails}
					themeId={row.id}
					themeName={row.name}
				/>
			)}

			{/* delete themes */}
			{hasAccess("ROLE_UI_THEMES_DELETE", user) && (
				<button
					onClick={() => setDeleteConfirmation(true)}
					className="button-like-anchor remove ng-scope ng-isolate-scope"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
					title={t("CONFIGURATION.THEMES.TABLE.TOOLTIP.DELETE")}
				/>
			)}

			{displayDeleteConfirmation && (
				<ConfirmModal
					close={hideDeleteConfirmation}
					resourceName={row.name}
					resourceId={row.id}
					deleteMethod={deletingTheme}
					resourceType="THEME"
				/>
			)}
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	user: getUserInformation(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	fetchThemeDetails: (id) => dispatch(fetchThemeDetails(id)),
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	fetchUsage: (id) => dispatch(fetchUsage(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ThemesActionsCell);
