import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ResourceDetailsAccessPolicyTab from "../../../shared/modals/ResourceDetailsAccessPolicyTab";
import { getSeriesDetailsAcl } from "../../../../selectors/seriesDetailsSelectors";
import {
	fetchSeriesDetailsAcls,
	updateSeriesAccess,
} from "../../../../slices/seriesDetailsSlice";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";
import { useAppDispatch, useAppSelector } from "../../../../store";

/**
 * This component manages the access policy tab of the series details modal
 */
const SeriesDetailsAccessTab = ({
	seriesId,
	header,
	policyChanged,
	setPolicyChanged,
}: {
	seriesId: string,
	header: string,
	policyChanged: boolean,
	setPolicyChanged: (value: boolean) => void,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const policies = useAppSelector(state => getSeriesDetailsAcl(state));

	useEffect(() => {
		dispatch(removeNotificationWizardForm());
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<ResourceDetailsAccessPolicyTab
			resourceId={seriesId}
			header={header}
			buttonText={"EVENTS.SERIES.DETAILS.ACCESS.ACCESS_POLICY.LABEL"}
			descriptionText={t("EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.DESCRIPTION")}
			policies={policies}
			fetchAccessPolicies={fetchSeriesDetailsAcls}
			saveNewAccessPolicies={updateSeriesAccess}
			editAccessRole={"ROLE_UI_SERIES_DETAILS_ACL_EDIT"}
			policyChanged={policyChanged}
			setPolicyChanged={setPolicyChanged}
		/>
	);
};

export default SeriesDetailsAccessTab;
