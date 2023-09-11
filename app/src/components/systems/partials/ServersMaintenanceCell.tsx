import React from "react";
import { connect } from "react-redux";
import {
	fetchServers,
	setServerMaintenance,
} from "../../../thunks/serverThunks";
import { loadServersIntoTable } from "../../../thunks/tableThunks";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";

/**
 * This component renders the maintenance cells of servers in the table view
 */
const ServersMaintenanceCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
// @ts-expect-error TS(7031): Binding element 'loadServers' implicitly has an 'a... Remove this comment to see the full error message
	loadServers,
// @ts-expect-error TS(7031): Binding element 'loadServersIntoTable' implicitly ... Remove this comment to see the full error message
	loadServersIntoTable,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
}) => {
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const onClickCheckbox = async (e) => {
		await setServerMaintenance(row.hostname, e.target.checked);
		await loadServers();
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
	user: getUserInformation(state),
});

// mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadServers: () => dispatch(fetchServers()),
	loadServersIntoTable: () => dispatch(loadServersIntoTable()),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ServersMaintenanceCell);
