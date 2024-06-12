import React from "react";
import { useTranslation } from "react-i18next";
import { loadServicesIntoTable } from "../../../thunks/tableThunks";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchServices, restartService } from "../../../slices/serviceSlice";
import { Tooltip } from "../../shared/Tooltip";

/**
 * This component renders the action cells of services in the table view
 */
const ServicesActionCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const user = useAppSelector(state => getUserInformation(state));

	const onClickRestart = async () => {
		await dispatch(restartService({host: row.hostname, serviceType: row.name}));
		await dispatch(fetchServices());
		dispatch(loadServicesIntoTable());
	};

	return (
		row.status !== "SYSTEMS.SERVICES.STATUS.NORMAL" &&
		hasAccess("ROLE_UI_SERVICES_STATUS_EDIT", user) && (
			<Tooltip title={t("SYSTEMS.SERVICES.TABLE.SANITIZE")}>
				<button
					className="button-like-anchor sanitize fa fa-undo"
					onClick={() => onClickRestart()}
				/>
			</Tooltip>
		)
	);
};

export default ServicesActionCell;
