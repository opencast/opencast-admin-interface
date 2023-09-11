import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import ResourceDetailsAccessPolicyTab from "../../../shared/modals/ResourceDetailsAccessPolicyTab";
import { getSeriesDetailsAcl } from "../../../../selectors/seriesDetailsSelectors";
import {
	fetchSeriesDetailsAcls,
	updateSeriesAccess,
} from "../../../../thunks/seriesDetailsThunks";
import { removeNotificationWizardForm } from "../../../../actions/notificationActions";

/**
 * This component manages the access policy tab of the series details modal
 */
const SeriesDetailsAccessTab = ({
// @ts-expect-error TS(7031): Binding element 'seriesId' implicitly has an 'any'... Remove this comment to see the full error message
	seriesId,
// @ts-expect-error TS(7031): Binding element 'header' implicitly has an 'any' t... Remove this comment to see the full error message
	header,
// @ts-expect-error TS(7031): Binding element 'policies' implicitly has an 'any'... Remove this comment to see the full error message
	policies,
// @ts-expect-error TS(7031): Binding element 'fetchAccessPolicies' implicitly h... Remove this comment to see the full error message
	fetchAccessPolicies,
// @ts-expect-error TS(7031): Binding element 'saveNewAccessPolicies' implicitly... Remove this comment to see the full error message
	saveNewAccessPolicies,
// @ts-expect-error TS(7031): Binding element 'policyChanged' implicitly has an ... Remove this comment to see the full error message
	policyChanged,
// @ts-expect-error TS(7031): Binding element 'setPolicyChanged' implicitly has ... Remove this comment to see the full error message
	setPolicyChanged,
}) => {
	const { t } = useTranslation();

	useEffect(() => {
		removeNotificationWizardForm();
	}, []);

	return (
		<ResourceDetailsAccessPolicyTab
			resourceId={seriesId}
			header={header}
			t={t}
			buttonText={"EVENTS.SERIES.DETAILS.ACCESS.ACCESS_POLICY.LABEL"}
			saveButtonText={"SAVE"}
			descriptionText={t("EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.DESCRIPTION")}
			policies={policies}
			fetchAccessPolicies={fetchAccessPolicies}
			saveNewAccessPolicies={saveNewAccessPolicies}
			editAccessRole={"ROLE_UI_SERIES_DETAILS_ACL_EDIT"}
			policyChanged={policyChanged}
			setPolicyChanged={setPolicyChanged}
		/>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	policies: getSeriesDetailsAcl(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	fetchAccessPolicies: (id) => dispatch(fetchSeriesDetailsAcls(id)),
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	saveNewAccessPolicies: (id, policies) =>
		dispatch(updateSeriesAccess(id, policies)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SeriesDetailsAccessTab);
