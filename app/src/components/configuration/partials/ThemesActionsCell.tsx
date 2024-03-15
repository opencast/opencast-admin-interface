import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../shared/ConfirmModal";
import ThemeDetailsModal from "./wizard/ThemeDetailsModal";
import {
	fetchThemeDetails,
	fetchUsage,
} from "../../../slices/themeDetailsSlice";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../../store";
import { deleteTheme } from "../../../slices/themeSlice";

/**
 * This component renders the action cells of themes in the table view
 */
const ThemesActionsCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [displayDeleteConfirmation, setDeleteConfirmation] = useState(false);
	const [displayThemeDetails, setThemeDetails] = useState(false);

	const user = useAppSelector(state => getUserInformation(state));

	const hideDeleteConfirmation = () => {
		setDeleteConfirmation(false);
	};

	const hideThemeDetails = () => {
		setThemeDetails(false);
	};

	const showThemeDetails = async () => {
		await dispatch(fetchThemeDetails(row.id));
		await dispatch(fetchUsage(row.id));

		setThemeDetails(true);
	};

	const deletingTheme = (id: number) => {
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

export default ThemesActionsCell;
