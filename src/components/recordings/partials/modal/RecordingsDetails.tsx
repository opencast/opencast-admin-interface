import React, { useState } from "react";
import GeneralDetailsTab from "../wizards/GeneralDetailsTab";
import ConfigurationDetailsTab from "../wizards/ConfigurationDetailsTab";
import CapabilitiesDetailsTab from "../wizards/CapabilitiesDetailsTab";
import { getRecordingDetails } from "../../../../selectors/recordingDetailsSelectors";
import ModalNavigation from "../../../shared/modals/ModalNavigation";
import { useAppSelector } from "../../../../store";

/**
 * This component manages the pages of the recording details
 */
const RecordingsDetails: React.FC = () => {
	const [page, setPage] = useState(0);

	const agent = useAppSelector(state => getRecordingDetails(state));

	// information about tabs
	const tabs = [
		{
			tabTranslation: "RECORDINGS.RECORDINGS.DETAILS.TAB.GENERAL",
			accessRole: "ROLE_UI_LOCATIONS_DETAILS_GENERAL_VIEW",
			name: "general",
		},
		{
			tabTranslation: "RECORDINGS.RECORDINGS.DETAILS.TAB.CONFIGURATION",
			accessRole: "ROLE_UI_LOCATIONS_DETAILS_CONFIGURATION_VIEW",
			name: "configuration",
		},
		{
			tabTranslation: "RECORDINGS.RECORDINGS.DETAILS.TAB.CAPABILITIES",
			accessRole: "ROLE_UI_LOCATIONS_DETAILS_CAPABILITIES_VIEW",
			name: "capabilities",
		},
	];

// @ts-expect-error TS(7006): Parameter 'tabNr' implicitly has an 'any' type.
	const openTab = (tabNr) => {
		setPage(tabNr);
	};

	return (
		<>
			{/* navigation */}
			<ModalNavigation tabInformation={tabs} openTab={openTab} page={page} />

			<div>
				{page === 0 && <GeneralDetailsTab agent={agent} />}
				{page === 1 && <ConfigurationDetailsTab agent={agent} />}
				{page === 2 && <CapabilitiesDetailsTab agent={agent} />}
			</div>
		</>
	);
};

export default RecordingsDetails;
