import React from "react";
import { connect } from "react-redux";
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
// @ts-expect-error TS(7031): Binding element 'loadServersIntoTable' implicitly ... Remove this comment to see the full error message
	loadServersIntoTable,
}) => {
	const user = useAppSelector(state => getUserInformation(state));
	const dispatch = useAppDispatch();

// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const onClickCheckbox = async (e) => {
		await dispatch(setServerMaintenance({host: row.hostname, maintenance: e.target.checked}));
		await dispatch(fetchServers());
		loadServersIntoTable();
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

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({

});

// mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadServersIntoTable: () => dispatch(loadServersIntoTable()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ServersMaintenanceCell);
