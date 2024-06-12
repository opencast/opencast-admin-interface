import React from "react";
import { loadServersIntoTable } from "../../../thunks/tableThunks";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
	fetchServers,
	setServerMaintenance,
} from "../../../slices/serverSlice";

/**
 * This component renders the maintenance cells of servers in the table view
 */
const ServersMaintenanceCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
}) => {
	const user = useAppSelector(state => getUserInformation(state));
	const dispatch = useAppDispatch();

// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const onClickCheckbox = async (e) => {
		await dispatch(setServerMaintenance({host: row.hostname, maintenance: e.target.checked}));
		await dispatch(fetchServers());
		dispatch(loadServersIntoTable());
	};

	return (
		<>
			{hasAccess("ROLE_UI_SERVERS_MAINTENANCE_EDIT", user) && (
				<input
					type="checkbox"
					onChange={(e) => onClickCheckbox(e)}
					name="maintenanceStatus"
					checked={row.maintenance}
				/>
			)}
		</>
	);
};

export default ServersMaintenanceCell;
