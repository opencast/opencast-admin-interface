import React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { fetchServices, restartService } from "../../../thunks/serviceThunks";
import { loadServicesIntoTable } from "../../../thunks/tableThunks";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";

/**
 * This component renders the action cells of services in the table view
 */
const ServicesActionCell = ({
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
	row,
// @ts-expect-error TS(7031): Binding element 'loadServices' implicitly has an '... Remove this comment to see the full error message
	loadServices,
// @ts-expect-error TS(7031): Binding element 'loadServicesIntoTable' implicitly... Remove this comment to see the full error message
	loadServicesIntoTable,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
}) => {
	const { t } = useTranslation();

	const onClickRestart = async () => {
		await restartService(row.hostname, row.name);
		await loadServices();
		loadServicesIntoTable();
	};

	return (
		row.status !== "SYSTEMS.SERVICES.STATUS.NORMAL" &&
		hasAccess("ROLE_UI_SERVICES_STATUS_EDIT", user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<button
				className="button-like-anchor sanitize fa fa-undo"
				onClick={() => onClickRestart()}
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
				title={t("SYSTEMS.SERVICES.TABLE.SANITIZE")}
			/>
		)
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
	loadServices: () => dispatch(fetchServices()),
	loadServicesIntoTable: () => dispatch(loadServicesIntoTable()),
});

// @ts-expect-error TS(2345): Argument of type '({ row, loadServices, loadServic... Remove this comment to see the full error message
export default connect(mapStateToProps, mapDispatchToProps)(ServicesActionCell);
