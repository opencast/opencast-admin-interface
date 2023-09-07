import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
// @ts-expect-error TS(6142): Module '../../shared/ConfirmModal' was resolved to... Remove this comment to see the full error message
import ConfirmModal from "../../shared/ConfirmModal";
// @ts-expect-error TS(6142): Module './wizard/ThemeDetailsModal' was resolved t... Remove this comment to see the full error message
import ThemeDetailsModal from "./wizard/ThemeDetailsModal";
import { deleteTheme } from "../../../thunks/themeThunks";
import {
	fetchThemeDetails,
	fetchUsage,
} from "../../../thunks/themeDetailsThunks";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";

/**
 * This component renders the action cells of themes in the table view
 */
const ThemesActionsCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
// @ts-expect-error TS(7031): Binding element 'deleteTheme' implicitly has an 'a... Remove this comment to see the full error message
	deleteTheme,
// @ts-expect-error TS(7031): Binding element 'fetchThemeDetails' implicitly has... Remove this comment to see the full error message
	fetchThemeDetails,
// @ts-expect-error TS(7031): Binding element 'fetchUsage' implicitly has an 'an... Remove this comment to see the full error message
	fetchUsage,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
}) => {
	const { t } = useTranslation();

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
		deleteTheme(id);
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
			{/* edit themes */}
			{hasAccess("ROLE_UI_THEMES_EDIT", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<button
					onClick={() => showThemeDetails()}
					className="button-like-anchor more"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
					title={t("CONFIGURATION.THEMES.TABLE.TOOLTIP.DETAILS")}
				/>
			)}

			{displayThemeDetails && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<ThemeDetailsModal
					handleClose={hideThemeDetails}
					themeId={row.id}
					themeName={row.name}
				/>
			)}

			{/* delete themes */}
			{hasAccess("ROLE_UI_THEMES_DELETE", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<button
					onClick={() => setDeleteConfirmation(true)}
					className="button-like-anchor remove ng-scope ng-isolate-scope"
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
					title={t("CONFIGURATION.THEMES.TABLE.TOOLTIP.DELETE")}
				/>
			)}

			{displayDeleteConfirmation && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
	deleteTheme: (id) => dispatch(deleteTheme(id)),
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	fetchThemeDetails: (id) => dispatch(fetchThemeDetails(id)),
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	fetchUsage: (id) => dispatch(fetchUsage(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ThemesActionsCell);
