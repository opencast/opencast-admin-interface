import React, { useEffect, useState } from "react";
import ModalNavigation from "../../../shared/modals/ModalNavigation";
import { getLifeCyclePolicyDetails } from "../../../../selectors/lifeCycleDetailsSelectors";
import LifeCyclePolicyGeneralTab from "../ModalTabsAndPages/LifeCyclePolicyGeneralTab";
import LifeCyclePolicyDetailsAccessTab from "../ModalTabsAndPages/LifeCyclePolicyAccessTab";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";
import { fetchLifeCyclePolicyActions, fetchLifeCyclePolicyTargetTypes, fetchLifeCyclePolicyTimings } from "../../../../slices/lifeCycleDetailsSlice";

/**
 * This component manages the tabs of the series details modal
 */
const LifeCyclePolicyDetails = () => {
	const [page, setPage] = useState(0);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(removeNotificationWizardForm());
		dispatch(fetchLifeCyclePolicyActions());
		dispatch(fetchLifeCyclePolicyTargetTypes());
		dispatch(fetchLifeCyclePolicyTimings());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const policy = useAppSelector(state => getLifeCyclePolicyDetails(state));

	// tracks, whether the policies are different to the initial value
	const [policyChanged, setPolicyChanged] = useState(false);

	// information about tabs
	const tabs = [
		{
			tabTranslation: "LIFECYCLE.POLICIES.DETAILS.TAB.GENERAL",
			accessRole: "ROLE_UI_LIFECYCLEPOLICIES_DETAILS_GENERAL_VIEW",
			name: "general",
		},
		{
			tabTranslation: "LIFECYCLE.POLICIES.DETAILS.TAB.ACCESSPOLICIES",
			accessRole: "ROLE_UI_LIFECYCLEPOLICIES_DETAILS_ACCESSPOLICIES_VIEW",
			name: "Access Policies"
		},
	];

	const openTab = (tabNr: number) => {
		setPage(tabNr);
	};

	return (
		<>
			{/* Navigation */}
			<ModalNavigation tabInformation={tabs} page={page} openTab={openTab} />

			<div>
				{page === 0 && <LifeCyclePolicyGeneralTab policy={policy} />}
				{page === 1 &&
					<LifeCyclePolicyDetailsAccessTab
						seriesId={policy.id}
						header={tabs[page].name}
						policyChanged={policyChanged}
						setPolicyChanged={setPolicyChanged}
					/>
				}
			</div>
		</>
	);
};

export default LifeCyclePolicyDetails;
