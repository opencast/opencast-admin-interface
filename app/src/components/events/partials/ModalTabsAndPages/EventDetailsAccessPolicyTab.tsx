import React from "react";
import { connect } from "react-redux";
import {
	fetchAccessPolicies,
	fetchHasActiveTransactions,
	saveAccessPolicies,
} from "../../../../thunks/eventDetailsThunks";
import { getPolicies } from "../../../../selectors/eventDetailsSelectors";
// @ts-expect-error TS(6142): Module '../../../shared/modals/ResourceDetailsAcce... Remove this comment to see the full error message
import ResourceDetailsAccessPolicyTab from "../../../shared/modals/ResourceDetailsAccessPolicyTab";

/**
 * This component manages the access policy tab of the event details modal
 */
const EventDetailsAccessPolicyTab = ({
// @ts-expect-error TS(7031): Binding element 'eventId' implicitly has an 'any' ... Remove this comment to see the full error message
	eventId,
// @ts-expect-error TS(7031): Binding element 'header' implicitly has an 'any' t... Remove this comment to see the full error message
	header,
// @ts-expect-error TS(7031): Binding element 't' implicitly has an 'any' type.
	t,
// @ts-expect-error TS(7031): Binding element 'policies' implicitly has an 'any'... Remove this comment to see the full error message
	policies,
// @ts-expect-error TS(7031): Binding element 'fetchAccessPolicies' implicitly h... Remove this comment to see the full error message
	fetchAccessPolicies,
// @ts-expect-error TS(7031): Binding element 'fetchHasActiveTransactions' impli... Remove this comment to see the full error message
	fetchHasActiveTransactions,
// @ts-expect-error TS(7031): Binding element 'saveNewAccessPolicies' implicitly... Remove this comment to see the full error message
	saveNewAccessPolicies,
// @ts-expect-error TS(7031): Binding element 'policyChanged' implicitly has an ... Remove this comment to see the full error message
	policyChanged,
// @ts-expect-error TS(7031): Binding element 'setPolicyChanged' implicitly has ... Remove this comment to see the full error message
	setPolicyChanged,
}) => {
	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<ResourceDetailsAccessPolicyTab
			resourceId={eventId}
			header={header}
			buttonText={"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.LABEL"}
			saveButtonText={"SAVE"}
			t={t}
			policies={policies}
			fetchAccessPolicies={fetchAccessPolicies}
			fetchHasActiveTransactions={fetchHasActiveTransactions}
			saveNewAccessPolicies={saveNewAccessPolicies}
			descriptionText={t("EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.DESCRIPTION")}
			editAccessRole={"ROLE_UI_EVENTS_DETAILS_ACL_EDIT"}
			policyChanged={policyChanged}
			setPolicyChanged={setPolicyChanged}
		/>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	policies: getPolicies(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	fetchAccessPolicies: (eventId) => dispatch(fetchAccessPolicies(eventId)),
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	fetchHasActiveTransactions: (eventId) =>
		dispatch(fetchHasActiveTransactions(eventId)),
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	saveNewAccessPolicies: (eventId, policies) =>
		dispatch(saveAccessPolicies(eventId, policies)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EventDetailsAccessPolicyTab);
