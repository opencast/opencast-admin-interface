import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { hasAccess } from "../../../../utils/utils";
import EventDetailsCommentsTab from "../ModalTabsAndPages/EventDetailsCommentsTab";
import EventDetailsAccessPolicyTab from "../ModalTabsAndPages/EventDetailsAccessPolicyTab";
import EventDetailsWorkflowTab from "../ModalTabsAndPages/EventDetailsWorkflowTab";
import EventDetailsWorkflowDetails from "../ModalTabsAndPages/EventDetailsWorkflowDetails";
import EventDetailsPublicationTab from "../ModalTabsAndPages/EventDetailsPublicationTab";
import EventDetailsWorkflowOperations from "../ModalTabsAndPages/EventDetailsWorkflowOperations";
import EventDetailsWorkflowOperationDetails from "../ModalTabsAndPages/EventDetailsWorkflowOperationDetails";
import EventDetailsWorkflowErrors from "../ModalTabsAndPages/EventDetailsWorkflowErrors";
import EventDetailsWorkflowErrorDetails from "../ModalTabsAndPages/EventDetailsWorkflowErrorDetails";
import EventDetailsAssetsTab from "../ModalTabsAndPages/EventDetailsAssetsTab";
import EventDetailsAssetAttachments from "../ModalTabsAndPages/EventDetailsAssetAttachments";
import EventDetailsAssetCatalogs from "../ModalTabsAndPages/EventDetailsAssetCatalogs";
import EventDetailsAssetMedia from "../ModalTabsAndPages/EventDetailsAssetMedia";
import EventDetailsAssetPublications from "../ModalTabsAndPages/EventDetailsAssetPublications";
import EventDetailsAssetAttachmentDetails from "../ModalTabsAndPages/EventDetailsAssetAttachmentDetails";
import EventDetailsAssetCatalogDetails from "../ModalTabsAndPages/EventDetailsAssetCatalogDetails";
import EventDetailsAssetMediaDetails from "../ModalTabsAndPages/EventDetailsAssetMediaDetails";
import EventDetailsAssetPublicationDetails from "../ModalTabsAndPages/EventDetailsAssetPublicationDetails";
import EventDetailsAssetsAddAsset from "../ModalTabsAndPages/EventDetailsAssetsAddAsset";
import EventDetailsSchedulingTab from "../ModalTabsAndPages/EventDetailsSchedulingTab";
import DetailsExtendedMetadataTab from "../ModalTabsAndPages/DetailsExtendedMetadataTab";
import DetailsMetadataTab from "../ModalTabsAndPages/DetailsMetadataTab";
import {
	getMetadata,
	getExtendedMetadata,
	isFetchingMetadata,
	getSchedulingProperties,
	isFetchingScheduling,
	hasStatistics as getHasStatistics,
	isFetchingStatistics,
} from "../../../../selectors/eventDetailsSelectors";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import EventDetailsStatisticsTab from "../ModalTabsAndPages/EventDetailsStatisticsTab";
import { fetchAssetUploadOptions } from "../../../../thunks/assetsThunks";
import { hasAnyDeviceAccess } from "../../../../utils/resourceUtils";
import { getRecordings } from "../../../../selectors/recordingSelectors";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
	fetchMetadata,
	updateMetadata,
	updateExtendedMetadata,
	fetchSchedulingInfo,
	fetchEventStatistics,
} from "../../../../slices/eventDetailsSlice";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";

/**
 * This component manages the pages of the event details
 */
const EventDetails : React.FC<{
  tabIndex: any,
	eventId: any,
	close?: any,
	policyChanged: any,
	setPolicyChanged: any,
}>= ({
	tabIndex,
	eventId,
	close,
	policyChanged,
	setPolicyChanged,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(removeNotificationWizardForm());
		dispatch(fetchMetadata(eventId)).then();
		dispatch(fetchSchedulingInfo(eventId)).then();
		dispatch(fetchEventStatistics(eventId)).then();
		dispatch(fetchAssetUploadOptions()).then();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [page, setPage] = useState(tabIndex);
	const [workflowTabHierarchy, setWorkflowTabHierarchy] = useState("entry");
	const [assetsTabHierarchy, setAssetsTabHierarchy] = useState("entry");

	// TODO: Get rid of the wrappers when modernizing redux is done
	const updateMetadataWrapper = (id: any, values: any) => {
		dispatch(updateMetadata({eventId: id, values}));
	}
	const updateExtendedMetadataWrapper = (id: any, values: any, catalog: any) => {
		dispatch(updateExtendedMetadata({eventId: id, values, catalog}));
	}

	const user = useAppSelector(state => getUserInformation(state));
	const metadata = useAppSelector(state => getMetadata(state));
	const extendedMetadata = useAppSelector(state => getExtendedMetadata(state));
	const isLoadingMetadata = useAppSelector(state => isFetchingMetadata(state));
	const hasSchedulingProperties = useAppSelector(state => getSchedulingProperties(state));
	const isLoadingScheduling = useAppSelector(state => isFetchingScheduling(state));
	const hasStatistics = useAppSelector(state => getHasStatistics(state));
	const isLoadingStatistics = useAppSelector(state => isFetchingStatistics(state));
	const captureAgents = useAppSelector(state => getRecordings(state));

	type Tab = {
		tabNameTranslation: string,
		bodyHeaderTranslation?: string,
		accessRole: string,
		name: string,
		hidden?: boolean,
	}

	type Tabs = [
		Tab, Tab, Tab, Tab, Tab,
		Tab, Tab, Tab, Tab,
	]

	const tabs: Tabs = [
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
				!hasSchedulingProperties || !hasAnyDeviceAccess(user, captureAgents),
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
		dispatch(removeNotificationWizardForm());
		setWorkflowTabHierarchy("entry");
		setAssetsTabHierarchy("entry");
		setPage(tabNr);
	};

	return (
		<>
			<nav className="modal-nav" id="modal-nav">
				{hasAccess(tabs[0].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === 0 })} onClick={() => openTab(0)}>
						{t(tabs[0].tabNameTranslation)}
					</button>
				)}
				{!tabs[1].hidden && hasAccess(tabs[1].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === 1 })} onClick={() => openTab(1)}>
						{t(tabs[1].tabNameTranslation)}
					</button>
				)}
				{hasAccess(tabs[2].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === 2 })} onClick={() => openTab(2)}>
						{t(tabs[2].tabNameTranslation)}
					</button>
				)}
				{hasAccess(tabs[3].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === 3 })} onClick={() => openTab(3)}>
						{t(tabs[3].tabNameTranslation)}
					</button>
				)}
				{!tabs[4].hidden && hasAccess(tabs[4].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === 4 })} onClick={() => openTab(4)}>
						{t(tabs[4].tabNameTranslation)}
					</button>
				)}
				{hasAccess(tabs[5].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === 5 })} onClick={() => openTab(5)}>
						{t(tabs[5].tabNameTranslation)}
					</button>
				)}
				{hasAccess(tabs[6].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === 6 })} onClick={() => openTab(6)}>
						{t(tabs[6].tabNameTranslation)}
					</button>
				)}
				{hasAccess(tabs[7].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === 7 })} onClick={() => openTab(7)}>
						{t(tabs[7].tabNameTranslation)}
					</button>
				)}

				{!tabs[8].hidden && hasAccess(tabs[8].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === 8 })} onClick={() => openTab(8)}>
						{t(tabs[8].tabNameTranslation)}
					</button>
				)}
			</nav>
			{/* Initialize overall modal */}
			<div>
				{page === 0 && !isLoadingMetadata && (
					<DetailsMetadataTab
						metadataFields={metadata}
						resourceId={eventId}
						header={tabs[page]!.bodyHeaderTranslation}
						updateResource={updateMetadataWrapper}
						editAccessRole="ROLE_UI_EVENTS_DETAILS_METADATA_EDIT"
					/>
				)}
				{page === 1 && !isLoadingMetadata && (
					<DetailsExtendedMetadataTab
						resourceId={eventId}
						metadata={extendedMetadata}
						updateResource={updateExtendedMetadataWrapper}
						editAccessRole="ROLE_UI_EVENTS_DETAILS_METADATA_EDIT"
					/>
				)}
				{page === 2 && <EventDetailsPublicationTab eventId={eventId} />}
				{page === 3 && (
					<EventDetailsAssetsTab
						eventId={eventId}
						t={t}
						assetsTabHierarchy={assetsTabHierarchy}
						setAssetsTabHierarchy={setAssetsTabHierarchy}
					/>
				)}
				{page === 4 && !isLoadingScheduling && (
					<EventDetailsSchedulingTab eventId={eventId} t={t} />
				)}
				{page === 5 &&
					((workflowTabHierarchy === "entry" && (
						<EventDetailsWorkflowTab
							eventId={eventId}
							t={t}
							close={close}
							setHierarchy={setWorkflowTabHierarchy}
						/>
					)) ||
						(workflowTabHierarchy === "workflow-details" && (
							<EventDetailsWorkflowDetails
								eventId={eventId}
								t={t}
								setHierarchy={setWorkflowTabHierarchy}
							/>
						)) ||
						(workflowTabHierarchy === "workflow-operations" && (
							<EventDetailsWorkflowOperations
								eventId={eventId}
								setHierarchy={setWorkflowTabHierarchy}
							/>
						)) ||
						(workflowTabHierarchy === "workflow-operation-details" && (
							<EventDetailsWorkflowOperationDetails
								eventId={eventId}
								t={t}
								setHierarchy={setWorkflowTabHierarchy}
							/>
						)) ||
						(workflowTabHierarchy === "errors-and-warnings" && (
							<EventDetailsWorkflowErrors
								eventId={eventId}
								t={t}
								setHierarchy={setWorkflowTabHierarchy}
							/>
						)) ||
						(workflowTabHierarchy === "workflow-error-details" && (
							<EventDetailsWorkflowErrorDetails
								eventId={eventId}
								t={t}
								setHierarchy={setWorkflowTabHierarchy}
							/>
						)))}
				{page === 6 && (
					<EventDetailsAccessPolicyTab
						eventId={eventId}
						header={tabs[page]!.bodyHeaderTranslation}
						t={t}
						policyChanged={policyChanged}
						setPolicyChanged={setPolicyChanged}
					/>
				)}
				{page === 7 && (
					<EventDetailsCommentsTab
						eventId={eventId}
						header={tabs[page]!.bodyHeaderTranslation}
						t={t}
					/>
				)}
				{page === 8 && !isLoadingStatistics && (
					<EventDetailsStatisticsTab
						eventId={eventId}
						header={tabs[page]!.bodyHeaderTranslation}
						t={t}
					/>
				)}
			</div>
		</>
	);
};

export default EventDetails;
