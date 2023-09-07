import React, { useState } from "react";
import { connect } from "react-redux";
// @ts-expect-error TS(6142): Module '../wizards/GeneralDetailsTab' was resolved... Remove this comment to see the full error message
import GeneralDetailsTab from "../wizards/GeneralDetailsTab";
// @ts-expect-error TS(6142): Module '../wizards/ConfigurationDetailsTab' was re... Remove this comment to see the full error message
import ConfigurationDetailsTab from "../wizards/ConfigurationDetailsTab";
// @ts-expect-error TS(6142): Module '../wizards/CapabilitiesDetailsTab' was res... Remove this comment to see the full error message
import CapabilitiesDetailsTab from "../wizards/CapabilitiesDetailsTab";
import { getRecordingDetails } from "../../../../selectors/recordingDetailsSelectors";
// @ts-expect-error TS(6142): Module '../../../shared/modals/ModalNavigation' wa... Remove this comment to see the full error message
import ModalNavigation from "../../../shared/modals/ModalNavigation";

/**
 * This component manages the pages of the recording details
 */
const RecordingsDetails = ({
    agent
}: any) => {
	const [page, setPage] = useState(0);

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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
			{/* navigation */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<ModalNavigation tabInformation={tabs} openTab={openTab} page={page} />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				{page === 0 && <GeneralDetailsTab agent={agent} />}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				{page === 1 && <ConfigurationDetailsTab agent={agent} />}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				{page === 2 && <CapabilitiesDetailsTab agent={agent} />}
			</div>
		</>
	);
};

// get current state out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	agent: getRecordingDetails(state),
});

export default connect(mapStateToProps)(RecordingsDetails);
