import React, { useState } from "react";
import ModalNavigation from "../../../shared/modals/ModalNavigation";
import { getLifeCyclePolicyDetails } from "../../../../selectors/lifeCycleDetailsSelectors";
import LifeCyclePolicyGeneralTab from "../ModalTabsAndPages/LifeCyclePolicyGeneralTab";
import LifeCyclePolicyDetailsAccessTab from "../ModalTabsAndPages/LifeCyclePolicyAccessTab";
import { useAppSelector } from "../../../../store";

/**
 * This component manages the tabs of the series details modal
 */
const LifeCyclePolicyDetails = () => {
	const [page, setPage] = useState(0);

	const policy = useAppSelector(state => getLifeCyclePolicyDetails(state));

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
			name: "WARNING: None of the changes you make here can be saved!",
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
						policyChanged={false}
						setPolicyChanged={() => false}
					/>
				}
			</div>
		</>
	);
};

export default LifeCyclePolicyDetails;
