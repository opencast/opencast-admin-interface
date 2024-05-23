import React from "react";
import { getPolicies } from "../../../../selectors/eventDetailsSelectors";
import ResourceDetailsAccessPolicyTab from "../../../shared/modals/ResourceDetailsAccessPolicyTab";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
	fetchAccessPolicies,
	fetchHasActiveTransactions,
	saveAccessPolicies,
} from "../../../../slices/eventDetailsSlice";
import { unwrapResult } from "@reduxjs/toolkit";

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
// @ts-expect-error TS(7031): Binding element 'policyChanged' implicitly has an ... Remove this comment to see the full error message
	policyChanged,
// @ts-expect-error TS(7031): Binding element 'setPolicyChanged' implicitly has ... Remove this comment to see the full error message
	setPolicyChanged,
}) => {
	const dispatch = useAppDispatch();

	// TODO: Get rid of the wrappers when modernizing redux is done
	const fetchAccessPoliciesWrapper = (eventId: any) => {
		dispatch(fetchAccessPolicies(eventId));
	}
	const fetchHasActiveTransactionsWrapper = async(eventId: any) => {
		return await dispatch(fetchHasActiveTransactions(eventId)).then(unwrapResult);
	}
	const saveNewAccessPoliciesWrapper = async(eventId: any, policies: any) => {
		dispatch(saveAccessPolicies({eventId, policies}));
	}

	const policies = useAppSelector(state => getPolicies(state));

	return (
		<ResourceDetailsAccessPolicyTab
			resourceId={eventId}
			header={header}
			buttonText={"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.LABEL"}
			saveButtonText={"SAVE"}
			t={t}
			policies={policies}
			fetchAccessPolicies={fetchAccessPoliciesWrapper}
			fetchHasActiveTransactions={fetchHasActiveTransactionsWrapper}
			saveNewAccessPolicies={saveNewAccessPoliciesWrapper}
			descriptionText={t("EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.DESCRIPTION")}
			editAccessRole={"ROLE_UI_EVENTS_DETAILS_ACL_EDIT"}
			policyChanged={policyChanged}
			setPolicyChanged={setPolicyChanged}
		/>
	);
};

export default EventDetailsAccessPolicyTab;
