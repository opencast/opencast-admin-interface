import React from "react";
import { getPolicies } from "../../../../selectors/eventDetailsSelectors";
import ResourceDetailsAccessPolicyTab from "../../../shared/modals/ResourceDetailsAccessPolicyTab";
import { useAppSelector } from "../../../../store";
import {
	fetchAccessPolicies,
	fetchHasActiveTransactions,
	saveAccessPolicies,
} from "../../../../slices/eventDetailsSlice";
import { useTranslation } from "react-i18next";

/**
 * This component manages the access policy tab of the event details modal
 */
const EventDetailsAccessPolicyTab = ({
	eventId,
	header,
	policyChanged,
	setPolicyChanged,
}: {
	eventId: string,
	header: string,
	policyChanged: boolean,
	setPolicyChanged: (value: boolean) => void,
}) => {
	const { t } = useTranslation();

	const policies = useAppSelector(state => getPolicies(state));

	return (
		<ResourceDetailsAccessPolicyTab
			resourceId={eventId}
			header={header}
			buttonText={"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.LABEL"}
			policies={policies}
			fetchAccessPolicies={fetchAccessPolicies}
			fetchHasActiveTransactions={fetchHasActiveTransactions}
			saveNewAccessPolicies={saveAccessPolicies}
			descriptionText={t("EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.DESCRIPTION")}
			policyTableHeaderText={"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.DETAILS"}
			policyTableRoleText={"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.ROLE"}
			policyTableNewText={"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.NEW"}
			userPolicyTableHeaderText={"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.USERS"}
			userPolicyTableRoleText={"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.USER"}
			userPolicyTableNewText={"EVENTS.EVENTS.DETAILS.ACCESS.ACCESS_POLICY.NEW_USER"}
			editAccessRole={"ROLE_UI_EVENTS_DETAILS_ACL_EDIT"}
			policyChanged={policyChanged}
			setPolicyChanged={setPolicyChanged}
		/>
	);
};

export default EventDetailsAccessPolicyTab;
