import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ResourceDetailsAccessPolicyTab from "../../../shared/modals/ResourceDetailsAccessPolicyTab";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { getLifeCyclePolicyDetailsAcl } from "../../../../selectors/lifeCycleDetailsSelectors";
import { fetchLifeCyclePolicyDetailsAcls, updateLifeCyclePolicyAccess } from "../../../../slices/lifeCycleDetailsSlice";
import { ParseKeys } from "i18next";

/**
 * This component manages the access policy tab of the series details modal
 */
const LifeCyclePolicyDetailsAccessTab = ({
	seriesId,
	header,
	policyChanged,
	setPolicyChanged,
}: {
	seriesId: string,
	header: ParseKeys,
	policyChanged: boolean,
	setPolicyChanged: (value: boolean) => void,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const acl = useAppSelector(state => getLifeCyclePolicyDetailsAcl(state));

	useEffect(() => {
		dispatch(removeNotificationWizardForm());
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<ResourceDetailsAccessPolicyTab
			resourceId={seriesId}
			header={header}
			buttonText={"LIFECYCLE.POLICIES.DETAILS.ACCESS.LABEL"}
			saveButtonText={"SAVE"}
			descriptionText={t("LIFECYCLE.POLICIES.DETAILS.ACCESS.DESCRIPTION")}
			policies={acl}
			fetchAccessPolicies={fetchLifeCyclePolicyDetailsAcls}
			// TODO: Figure out why typescript is being funky here
			// @ts-ignore
			saveNewAccessPolicies={updateLifeCyclePolicyAccess}
			editAccessRole={"ROLE_UI_LIFECYCLEPOLICY_DETAILS_ACL_EDIT"}
			policyChanged={policyChanged}
			setPolicyChanged={setPolicyChanged}
		/>
	);
};

export default LifeCyclePolicyDetailsAccessTab;
