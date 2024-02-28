import React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { loadServicesIntoTable } from "../../../thunks/tableThunks";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchServices, restartService } from "../../../slices/serviceSlice";

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
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const user = useAppSelector(state => getUserInformation(state));

	const onClickRestart = async () => {
		await dispatch(restartService({host: row.hostname, serviceType: row.name}));
		await dispatch(fetchServices());
		loadServicesIntoTable();
	};

	return (
		row.status !== "SYSTEMS.SERVICES.STATUS.NORMAL" &&
		hasAccess("ROLE_UI_SERVICES_STATUS_EDIT", user) && (
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

});

// mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadServicesIntoTable: () => dispatch(loadServicesIntoTable()),
});

// @ts-expect-error TS(2345): Argument of type '({ row, loadServices, loadServic... Remove this comment to see the full error message
export default connect(mapStateToProps, mapDispatchToProps)(ServicesActionCell);
