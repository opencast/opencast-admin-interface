import React, { useRef } from "react";
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
import { Modal, ModalHandle } from "../../shared/modals/Modal";

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

	const deleteConfirmationModalRef = useRef<ModalHandle>(null);
	const detailsModalRef = useRef<ModalHandle>(null);

	const user = useAppSelector(state => getUserInformation(state));

	const hideDeleteConfirmation = () => {
		deleteConfirmationModalRef.current?.close?.();
	};

	const hideThemeDetails = () => {
		detailsModalRef.current?.close?.();
	};

	const showThemeDetails = async () => {
		await dispatch(fetchThemeDetails(row.id));
		await dispatch(fetchUsage(row.id));

		detailsModalRef.current?.open();
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

			{/* themes details modal */}
			<Modal
				header={t("CONFIGURATION.THEMES.DETAILS.EDITCAPTION", { name: row.name })}
				classId="theme-details-modal"
				ref={detailsModalRef}
			>
				{/* component that manages tabs of theme details modal*/}
				<ThemeDetails close={hideThemeDetails} />
			</Modal>

			{/* delete themes */}
			{hasAccess("ROLE_UI_THEMES_DELETE", user) && (
				<Tooltip title={t("CONFIGURATION.THEMES.TABLE.TOOLTIP.DELETE")}>
					<button
						onClick={() => deleteConfirmationModalRef.current?.open()}
						className="button-like-anchor remove ng-scope ng-isolate-scope"
					/>
				</Tooltip>
			)}

			<ConfirmModal
				close={hideDeleteConfirmation}
				resourceName={row.name}
				resourceId={row.id}
				deleteMethod={deletingTheme}
				resourceType="THEME"
				modalRef={deleteConfirmationModalRef}
			/>
		</>
	);
};

export default ThemesActionsCell;
