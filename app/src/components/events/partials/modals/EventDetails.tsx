import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { connect } from "react-redux";
import { hasAccess } from "../../../../utils/utils";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsCommentsT... Remove this comment to see the full error message
import EventDetailsCommentsTab from "../ModalTabsAndPages/EventDetailsCommentsTab";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsAccessPol... Remove this comment to see the full error message
import EventDetailsAccessPolicyTab from "../ModalTabsAndPages/EventDetailsAccessPolicyTab";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsWorkflowT... Remove this comment to see the full error message
import EventDetailsWorkflowTab from "../ModalTabsAndPages/EventDetailsWorkflowTab";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsWorkflowD... Remove this comment to see the full error message
import EventDetailsWorkflowDetails from "../ModalTabsAndPages/EventDetailsWorkflowDetails";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsPublicati... Remove this comment to see the full error message
import EventDetailsPublicationTab from "../ModalTabsAndPages/EventDetailsPublicationTab";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsWorkflowO... Remove this comment to see the full error message
import EventDetailsWorkflowOperations from "../ModalTabsAndPages/EventDetailsWorkflowOperations";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsWorkflowO... Remove this comment to see the full error message
import EventDetailsWorkflowOperationDetails from "../ModalTabsAndPages/EventDetailsWorkflowOperationDetails";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsWorkflowE... Remove this comment to see the full error message
import EventDetailsWorkflowErrors from "../ModalTabsAndPages/EventDetailsWorkflowErrors";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsWorkflowE... Remove this comment to see the full error message
import EventDetailsWorkflowErrorDetails from "../ModalTabsAndPages/EventDetailsWorkflowErrorDetails";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsAssetsTab... Remove this comment to see the full error message
import EventDetailsAssetsTab from "../ModalTabsAndPages/EventDetailsAssetsTab";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsAssetAtta... Remove this comment to see the full error message
import EventDetailsAssetAttachments from "../ModalTabsAndPages/EventDetailsAssetAttachments";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsAssetCata... Remove this comment to see the full error message
import EventDetailsAssetCatalogs from "../ModalTabsAndPages/EventDetailsAssetCatalogs";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsAssetMedi... Remove this comment to see the full error message
import EventDetailsAssetMedia from "../ModalTabsAndPages/EventDetailsAssetMedia";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsAssetPubl... Remove this comment to see the full error message
import EventDetailsAssetPublications from "../ModalTabsAndPages/EventDetailsAssetPublications";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsAssetAtta... Remove this comment to see the full error message
import EventDetailsAssetAttachmentDetails from "../ModalTabsAndPages/EventDetailsAssetAttachmentDetails";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsAssetCata... Remove this comment to see the full error message
import EventDetailsAssetCatalogDetails from "../ModalTabsAndPages/EventDetailsAssetCatalogDetails";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsAssetMedi... Remove this comment to see the full error message
import EventDetailsAssetMediaDetails from "../ModalTabsAndPages/EventDetailsAssetMediaDetails";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsAssetPubl... Remove this comment to see the full error message
import EventDetailsAssetPublicationDetails from "../ModalTabsAndPages/EventDetailsAssetPublicationDetails";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsAssetsAdd... Remove this comment to see the full error message
import EventDetailsAssetsAddAsset from "../ModalTabsAndPages/EventDetailsAssetsAddAsset";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsSchedulin... Remove this comment to see the full error message
import EventDetailsSchedulingTab from "../ModalTabsAndPages/EventDetailsSchedulingTab";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/DetailsExtendedMetada... Remove this comment to see the full error message
import DetailsExtendedMetadataTab from "../ModalTabsAndPages/DetailsExtendedMetadataTab";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/DetailsMetadataTab' w... Remove this comment to see the full error message
import DetailsMetadataTab from "../ModalTabsAndPages/DetailsMetadataTab";
import {
	getMetadata,
	getExtendedMetadata,
	isFetchingMetadata,
	getSchedulingProperties,
	isFetchingScheduling,
	hasStatistics,
	isFetchingStatistics,
} from "../../../../selectors/eventDetailsSelectors";
import {
	fetchMetadata,
	updateMetadata,
	updateExtendedMetadata,
	fetchSchedulingInfo,
	fetchEventStatistics,
} from "../../../../thunks/eventDetailsThunks";
import { removeNotificationWizardForm } from "../../../../actions/notificationActions";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
// @ts-expect-error TS(6142): Module '../ModalTabsAndPages/EventDetailsStatistic... Remove this comment to see the full error message
import EventDetailsStatisticsTab from "../ModalTabsAndPages/EventDetailsStatisticsTab";
import { fetchAssetUploadOptions } from "../../../../thunks/assetsThunks";
import { hasAnyDeviceAccess } from "../../../../utils/resourceUtils";
import { getRecordings } from "../../../../selectors/recordingSelectors";

/**
 * This component manages the pages of the event details
 */
const EventDetails = ({
// @ts-expect-error TS(7031): Binding element 'tabIndex' implicitly has an 'any'... Remove this comment to see the full error message
	tabIndex,
// @ts-expect-error TS(7031): Binding element 'eventId' implicitly has an 'any' ... Remove this comment to see the full error message
	eventId,
// @ts-expect-error TS(7031): Binding element 'close' implicitly has an 'any' ty... Remove this comment to see the full error message
	close,
// @ts-expect-error TS(7031): Binding element 'metadata' implicitly has an 'any'... Remove this comment to see the full error message
	metadata,
// @ts-expect-error TS(7031): Binding element 'extendedMetadata' implicitly has ... Remove this comment to see the full error message
	extendedMetadata,
// @ts-expect-error TS(7031): Binding element 'isLoadingMetadata' implicitly has... Remove this comment to see the full error message
	isLoadingMetadata,
// @ts-expect-error TS(7031): Binding element 'hasSchedulingProperties' implicit... Remove this comment to see the full error message
	hasSchedulingProperties,
// @ts-expect-error TS(7031): Binding element 'isLoadingScheduling' implicitly h... Remove this comment to see the full error message
	isLoadingScheduling,
// @ts-expect-error TS(7031): Binding element 'hasStatistics' implicitly has an ... Remove this comment to see the full error message
	hasStatistics,
// @ts-expect-error TS(7031): Binding element 'isLoadingStatistics' implicitly h... Remove this comment to see the full error message
	isLoadingStatistics,
// @ts-expect-error TS(7031): Binding element 'captureAgents' implicitly has an ... Remove this comment to see the full error message
	captureAgents,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
// @ts-expect-error TS(7031): Binding element 'loadMetadata' implicitly has an '... Remove this comment to see the full error message
	loadMetadata,
// @ts-expect-error TS(7031): Binding element 'updateMetadata' implicitly has an... Remove this comment to see the full error message
	updateMetadata,
// @ts-expect-error TS(7031): Binding element 'updateExtendedMetadata' implicitl... Remove this comment to see the full error message
	updateExtendedMetadata,
// @ts-expect-error TS(7031): Binding element 'loadScheduling' implicitly has an... Remove this comment to see the full error message
	loadScheduling,
// @ts-expect-error TS(7031): Binding element 'loadStatistics' implicitly has an... Remove this comment to see the full error message
	loadStatistics,
// @ts-expect-error TS(7031): Binding element 'fetchAssetUploadOptions' implicit... Remove this comment to see the full error message
	fetchAssetUploadOptions,
// @ts-expect-error TS(7031): Binding element 'removeNotificationWizardForm' imp... Remove this comment to see the full error message
	removeNotificationWizardForm,
// @ts-expect-error TS(7031): Binding element 'policyChanged' implicitly has an ... Remove this comment to see the full error message
	policyChanged,
// @ts-expect-error TS(7031): Binding element 'setPolicyChanged' implicitly has ... Remove this comment to see the full error message
	setPolicyChanged,
}) => {
	const { t } = useTranslation();

	useEffect(() => {
		removeNotificationWizardForm();
		loadMetadata(eventId).then();
		loadScheduling(eventId).then();
		loadStatistics(eventId).then();
		fetchAssetUploadOptions().then();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [page, setPage] = useState(tabIndex);
	const [workflowTabHierarchy, setWorkflowTabHierarchy] = useState("entry");
	const [assetsTabHierarchy, setAssetsTabHierarchy] = useState("entry");

	const tabs = [
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.TABS.METADATA",
			bodyHeaderTranslation: "EVENTS.EVENTS.DETAILS.METADATA.CAPTION",
			accessRole: "ROLE_UI_EVENTS_DETAILS_METADATA_VIEW",
			name: "metadata",
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.TABS.EXTENDED-METADATA",
			accessRole: "ROLE_UI_EVENTS_DETAILS_METADATA_VIEW",
			name: "metadata-extended",
			hidden: !extendedMetadata || !(extendedMetadata.length > 0),
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.TABS.PUBLICATIONS",
			bodyHeaderTranslation: "EVENTS.EVENTS.DETAILS.PUBLICATIONS.CAPTION",
			accessRole: "ROLE_UI_EVENTS_DETAILS_PUBLICATIONS_VIEW",
			name: "publications",
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.TABS.ASSETS",
			bodyHeaderTranslation: "EVENTS.EVENTS.DETAILS.ASSETS.CAPTION",
			accessRole: "ROLE_UI_EVENTS_DETAILS_ASSETS_VIEW",
			name: "assets",
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.TABS.SCHEDULING",
			bodyHeaderTranslation: "EVENTS.EVENTS.DETAILS.SCHEDULING.CAPTION",
			accessRole: "ROLE_UI_EVENTS_DETAILS_SCHEDULING_VIEW",
			name: "scheduling",
			hidden:
				!hasSchedulingProperties && hasAnyDeviceAccess(user, captureAgents),
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.TABS.WORKFLOWS",
			accessRole: "ROLE_UI_EVENTS_DETAILS_WORKFLOWS_VIEW",
			name: "workflows",
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.TABS.ACCESS",
			bodyHeaderTranslation: "EVENTS.EVENTS.DETAILS.TABS.ACCESS",
			accessRole: "ROLE_UI_EVENTS_DETAILS_ACL_VIEW",
			name: "access",
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.TABS.COMMENTS",
			bodyHeaderTranslation: "EVENTS.EVENTS.DETAILS.COMMENTS.CAPTION",
			accessRole: "ROLE_UI_EVENTS_DETAILS_COMMENTS_VIEW",
			name: "comments",
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.TABS.STATISTICS",
			bodyHeaderTranslation: "EVENTS.EVENTS.DETAILS.STATISTICS.CAPTION",
			accessRole: "ROLE_UI_EVENTS_DETAILS_STATISTICS_VIEW",
			name: "statistics",
			hidden: !hasStatistics,
		},
	];

// @ts-expect-error TS(7006): Parameter 'tabNr' implicitly has an 'any' type.
	const openTab = (tabNr) => {
		removeNotificationWizardForm();
		setWorkflowTabHierarchy("entry");
		setAssetsTabHierarchy("entry");
		setPage(tabNr);
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<nav className="modal-nav" id="modal-nav">
				{hasAccess(tabs[0].accessRole, user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button className={"button-like-anchor " + cn({ active: page === 0 })} onClick={() => openTab(0)}>
						{t(tabs[0].tabNameTranslation)}
					</button>
				)}
				{!tabs[1].hidden && hasAccess(tabs[1].accessRole, user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button className={"button-like-anchor " + cn({ active: page === 1 })} onClick={() => openTab(1)}>
						{t(tabs[1].tabNameTranslation)}
					</button>
				)}
				{hasAccess(tabs[2].accessRole, user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button className={"button-like-anchor " + cn({ active: page === 2 })} onClick={() => openTab(2)}>
						{t(tabs[2].tabNameTranslation)}
					</button>
				)}
				{hasAccess(tabs[3].accessRole, user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button className={"button-like-anchor " + cn({ active: page === 3 })} onClick={() => openTab(3)}>
						{t(tabs[3].tabNameTranslation)}
					</button>
				)}
				{!tabs[4].hidden && hasAccess(tabs[4].accessRole, user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button className={"button-like-anchor " + cn({ active: page === 4 })} onClick={() => openTab(4)}>
						{t(tabs[4].tabNameTranslation)}
					</button>
				)}
				{hasAccess(tabs[5].accessRole, user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button className={"button-like-anchor " + cn({ active: page === 5 })} onClick={() => openTab(5)}>
						{t(tabs[5].tabNameTranslation)}
					</button>
				)}
				{hasAccess(tabs[6].accessRole, user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button className={"button-like-anchor " + cn({ active: page === 6 })} onClick={() => openTab(6)}>
						{t(tabs[6].tabNameTranslation)}
					</button>
				)}
				{hasAccess(tabs[7].accessRole, user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button className={"button-like-anchor " + cn({ active: page === 7 })} onClick={() => openTab(7)}>
						{t(tabs[7].tabNameTranslation)}
					</button>
				)}

				{!tabs[8].hidden && hasAccess(tabs[8].accessRole, user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button className={"button-like-anchor " + cn({ active: page === 8 })} onClick={() => openTab(8)}>
						{t(tabs[8].tabNameTranslation)}
					</button>
				)}
			</nav>
			{/* Initialize overall modal */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div>
				{page === 0 && !isLoadingMetadata && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<DetailsMetadataTab
						metadataFields={metadata}
						resourceId={eventId}
						header={tabs[page].bodyHeaderTranslation}
						updateResource={updateMetadata}
						editAccessRole="ROLE_UI_EVENTS_DETAILS_METADATA_EDIT"
					/>
				)}
				{page === 1 && !isLoadingMetadata && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<DetailsExtendedMetadataTab
						resourceId={eventId}
						metadata={extendedMetadata}
						updateResource={updateExtendedMetadata}
						editAccessRole="ROLE_UI_EVENTS_DETAILS_METADATA_EDIT"
					/>
				)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				{page === 2 && <EventDetailsPublicationTab eventId={eventId} />}
				{page === 3 &&
					((assetsTabHierarchy === "entry" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<EventDetailsAssetsTab
							eventId={eventId}
							t={t}
							setHierarchy={setAssetsTabHierarchy}
						/>
					)) ||
						(assetsTabHierarchy === "add-asset" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<EventDetailsAssetsAddAsset
								eventId={eventId}
								t={t}
								setHierarchy={setAssetsTabHierarchy}
							/>
						)) ||
						(assetsTabHierarchy === "asset-attachments" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<EventDetailsAssetAttachments
								eventId={eventId}
								t={t}
								setHierarchy={setAssetsTabHierarchy}
							/>
						)) ||
						(assetsTabHierarchy === "attachment-details" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<EventDetailsAssetAttachmentDetails
								eventId={eventId}
								t={t}
								setHierarchy={setAssetsTabHierarchy}
							/>
						)) ||
						(assetsTabHierarchy === "asset-catalogs" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<EventDetailsAssetCatalogs
								eventId={eventId}
								t={t}
								setHierarchy={setAssetsTabHierarchy}
							/>
						)) ||
						(assetsTabHierarchy === "catalog-details" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<EventDetailsAssetCatalogDetails
								eventId={eventId}
								t={t}
								setHierarchy={setAssetsTabHierarchy}
							/>
						)) ||
						(assetsTabHierarchy === "asset-media" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<EventDetailsAssetMedia
								eventId={eventId}
								t={t}
								setHierarchy={setAssetsTabHierarchy}
							/>
						)) ||
						(assetsTabHierarchy === "media-details" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<EventDetailsAssetMediaDetails
								eventId={eventId}
								t={t}
								setHierarchy={setAssetsTabHierarchy}
							/>
						)) ||
						(assetsTabHierarchy === "asset-publications" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<EventDetailsAssetPublications
								eventId={eventId}
								t={t}
								setHierarchy={setAssetsTabHierarchy}
							/>
						)) ||
						(assetsTabHierarchy === "publication-details" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<EventDetailsAssetPublicationDetails
								eventId={eventId}
								t={t}
								setHierarchy={setAssetsTabHierarchy}
							/>
						)))}
				{page === 4 && !isLoadingScheduling && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<EventDetailsSchedulingTab eventId={eventId} t={t} />
				)}
				{page === 5 &&
					((workflowTabHierarchy === "entry" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<EventDetailsWorkflowTab
							eventId={eventId}
							t={t}
							close={close}
							setHierarchy={setWorkflowTabHierarchy}
						/>
					)) ||
						(workflowTabHierarchy === "workflow-details" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<EventDetailsWorkflowDetails
								eventId={eventId}
								t={t}
								setHierarchy={setWorkflowTabHierarchy}
							/>
						)) ||
						(workflowTabHierarchy === "workflow-operations" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<EventDetailsWorkflowOperations
								eventId={eventId}
								t={t}
								setHierarchy={setWorkflowTabHierarchy}
							/>
						)) ||
						(workflowTabHierarchy === "workflow-operation-details" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<EventDetailsWorkflowOperationDetails
								eventId={eventId}
								t={t}
								setHierarchy={setWorkflowTabHierarchy}
							/>
						)) ||
						(workflowTabHierarchy === "errors-and-warnings" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<EventDetailsWorkflowErrors
								eventId={eventId}
								t={t}
								setHierarchy={setWorkflowTabHierarchy}
							/>
						)) ||
						(workflowTabHierarchy === "workflow-error-details" && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<EventDetailsWorkflowErrorDetails
								eventId={eventId}
								t={t}
								setHierarchy={setWorkflowTabHierarchy}
							/>
						)))}
				{page === 6 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<EventDetailsAccessPolicyTab
						eventId={eventId}
						header={tabs[page].bodyHeaderTranslation}
						t={t}
						policyChanged={policyChanged}
						setPolicyChanged={setPolicyChanged}
					/>
				)}
				{page === 7 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<EventDetailsCommentsTab
						eventId={eventId}
						header={tabs[page].bodyHeaderTranslation}
						t={t}
					/>
				)}
				{page === 8 && !isLoadingStatistics && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<EventDetailsStatisticsTab
						eventId={eventId}
						header={tabs[page].bodyHeaderTranslation}
						t={t}
					/>
				)}
			</div>
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	metadata: getMetadata(state),
	extendedMetadata: getExtendedMetadata(state),
	isLoadingMetadata: isFetchingMetadata(state),
	hasSchedulingProperties: getSchedulingProperties(state),
	isLoadingScheduling: isFetchingScheduling(state),
	hasStatistics: hasStatistics(state),
	isLoadingStatistics: isFetchingStatistics(state),
	captureAgents: getRecordings(state),
	user: getUserInformation(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	loadMetadata: (id) => dispatch(fetchMetadata(id)),
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	updateMetadata: (id, values) => dispatch(updateMetadata(id, values)),
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	loadScheduling: (id) => dispatch(fetchSchedulingInfo(id)),
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	updateExtendedMetadata: (id, values, catalog) =>
		dispatch(updateExtendedMetadata(id, values, catalog)),
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	loadStatistics: (id) => dispatch(fetchEventStatistics(id)),
	fetchAssetUploadOptions: () => dispatch(fetchAssetUploadOptions()),
	removeNotificationWizardForm: () => dispatch(removeNotificationWizardForm()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);
