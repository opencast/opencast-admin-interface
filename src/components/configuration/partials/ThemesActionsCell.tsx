import React, { useState } from "react";
import {
	fetchThemeDetails,
	fetchUsage,
} from "../../../slices/themeDetailsSlice";
import { useAppDispatch } from "../../../store";
import { deleteTheme, ThemeDetailsType } from "../../../slices/themeSlice";
import ThemeDetails from "./wizard/ThemeDetails";
import DetailsModal from "../../shared/modals/DetailsModal";
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
				<DetailsModal
					handleClose={hideThemeDetails}
					title={row.name}
					prefix={"CONFIGURATION.THEMES.DETAILS.EDITCAPTION"}
				>
					<ThemeDetails close={hideThemeDetails} />
				</DetailsModal>
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
