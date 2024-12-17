import React, { useState } from "react";
import ThemeDetailsModal from "./wizard/ThemeDetailsModal";
import {
	fetchThemeDetails,
	fetchUsage,
} from "../../../slices/themeDetailsSlice";
import { useAppDispatch } from "../../../store";
import { deleteTheme, ThemeDetailsType } from "../../../slices/themeSlice";
import { ActionCellDelete } from "../../shared/ActionCellDelete";
import { IconButton } from "../../shared/IconButton";

/**
 * This component renders the action cells of themes in the table view
 */
const ThemesActionsCell = ({
	row,
}: {
	row: ThemeDetailsType
}) => {
	const dispatch = useAppDispatch();

	const [displayThemeDetails, setThemeDetails] = useState(false);

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
			<IconButton
				callback={() => showThemeDetails()}
				iconClassname={"more"}
				editAccessRole={"ROLE_UI_THEMES_EDIT"}
				tooltipText={"CONFIGURATION.THEMES.TABLE.TOOLTIP.DETAILS"}
			/>
			{displayThemeDetails && (
				<ThemeDetailsModal
					handleClose={hideThemeDetails}
					themeName={row.name}
				/>
			)}

			{/* delete themes */}
			<ActionCellDelete
				editAccessRole={"ROLE_UI_THEMES_DELETE"}
				tooltipText={"CONFIGURATION.THEMES.TABLE.TOOLTIP.DELETE"}
				resourceId={row.id}
				resourceName={row.name}
				resourceType={"THEME"}
				deleteMethod={deletingTheme}
			/>
		</>
	);
};

export default ThemesActionsCell;
