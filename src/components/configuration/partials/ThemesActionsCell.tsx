import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../shared/ConfirmModal";
import {
	fetchThemeDetails,
	fetchUsage,
} from "../../../slices/themeDetailsSlice";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../../store";
import { deleteTheme, ThemeDetailsType } from "../../../slices/themeSlice";
import { Tooltip } from "../../shared/Tooltip";
import ThemeDetails from "./wizard/ThemeDetails";
import DetailsModal from "../../shared/modals/DetailsModal";

/**
 * This component renders the action cells of themes in the table view
 */
const ThemesActionsCell = ({
	row,
}: {
	row: ThemeDetailsType
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
				<Tooltip title={t("CONFIGURATION.THEMES.TABLE.TOOLTIP.DETAILS")}>
					<button
						onClick={() => showThemeDetails()}
						className="button-like-anchor more"
					/>
				</Tooltip>
			)}

			{displayThemeDetails && (
				<DetailsModal
					handleClose={hideThemeDetails}
					title={row.name}
					prefix={"CONFIGURATION.THEMES.DETAILS.EDITCAPTION"}
				>
					<ThemeDetails close={hideThemeDetails} />
				</DetailsModal>
			)}

			{/* delete themes */}
			{hasAccess("ROLE_UI_THEMES_DELETE", user) && (
				<Tooltip title={t("CONFIGURATION.THEMES.TABLE.TOOLTIP.DELETE")}>
					<button
						onClick={() => setDeleteConfirmation(true)}
						className="button-like-anchor remove ng-scope ng-isolate-scope"
					/>
				</Tooltip>
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
