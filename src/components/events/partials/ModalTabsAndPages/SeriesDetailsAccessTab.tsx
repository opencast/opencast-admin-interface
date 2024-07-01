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
// @ts-expect-error TS(7031): Binding element 'seriesId' implicitly has an 'any'... Remove this comment to see the full error message
	seriesId,
// @ts-expect-error TS(7031): Binding element 'header' implicitly has an 'any' t... Remove this comment to see the full error message
	header,
// @ts-expect-error TS(7031): Binding element 'policyChanged' implicitly has an ... Remove this comment to see the full error message
	policyChanged,
// @ts-expect-error TS(7031): Binding element 'setPolicyChanged' implicitly has ... Remove this comment to see the full error message
	setPolicyChanged,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const policies = useAppSelector(state => getSeriesDetailsAcl(state));

	// TODO: Get rid of the wrappers when modernizing redux is done
	const fetchSeriesDetailsAclsWrapper = (id: any) => {
		dispatch(fetchSeriesDetailsAcls(id));
	}
	const updateSeriesAccessWrapper = async (id: any, policies: any) => {
		dispatch(updateSeriesAccess({id, policies}));
	}

	useEffect(() => {
		dispatch(removeNotificationWizardForm());
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<ResourceDetailsAccessPolicyTab
			resourceId={seriesId}
			header={header}
			buttonText={"EVENTS.SERIES.DETAILS.ACCESS.ACCESS_POLICY.LABEL"}
			saveButtonText={"SAVE"}
			descriptionText={t("EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.DESCRIPTION")}
			policies={policies}
			fetchAccessPolicies={fetchSeriesDetailsAclsWrapper}
			saveNewAccessPolicies={updateSeriesAccessWrapper}
			editAccessRole={"ROLE_UI_SERIES_DETAILS_ACL_EDIT"}
			policyChanged={policyChanged}
			setPolicyChanged={setPolicyChanged}
		/>
	);
};

export default SeriesDetailsAccessTab;
