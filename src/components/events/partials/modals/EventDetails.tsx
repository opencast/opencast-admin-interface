import React, { useEffect } from "react";
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
	getModalWorkflowTabHierarchy,
	getModalPage,
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
	openModalTab,
} from "../../../../slices/eventDetailsSlice";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";

export enum EventDetailsPage {
	Metadata,
	ExtendedMetadata,
	Publication,
	Assets,
	Scheduling,
	Workflow,
	AccessPolicy,
	Comments,
	Statistics,
}

export type WorkflowTabHierarchy = "entry" | "workflow-details" | "workflow-operations" | "workflow-operation-details" | "errors-and-warnings" | "workflow-error-details"
export type AssetTabHierarchy = "entry" | "add-asset" | "asset-attachments" | "attachment-details" | "asset-catalogs" | "catalog-details" | "asset-media" | "media-details" | "asset-publications" | "publication-details";

/**
 * This component manages the pages of the event details
 */
const EventDetails = ({
	eventId,
	close,
	policyChanged,
	setPolicyChanged,
}: {
	eventId: string,
	close?: () => void,
	policyChanged: boolean,
	setPolicyChanged: (value: boolean) => void,
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

	// TODO: Get rid of the wrappers when modernizing redux is done
	const updateMetadataWrapper = (id: any, values: any) => {
		dispatch(updateMetadata({eventId: id, values}));
	}
	const updateExtendedMetadataWrapper = (id: any, values: any, catalog: any) => {
		dispatch(updateExtendedMetadata({eventId: id, values, catalog}));
	}

	const page = useAppSelector(state => getModalPage(state));
	const workflowTabHierarchy = useAppSelector(state => getModalWorkflowTabHierarchy(state));
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
		page: EventDetailsPage,
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
			page: EventDetailsPage.Metadata,
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.TABS.EXTENDED-METADATA",
			accessRole: "ROLE_UI_EVENTS_DETAILS_METADATA_VIEW",
			name: "metadata-extended",
			page: EventDetailsPage.ExtendedMetadata,
			hidden: !extendedMetadata || !(extendedMetadata.length > 0),
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.TABS.PUBLICATIONS",
			bodyHeaderTranslation: "EVENTS.EVENTS.DETAILS.PUBLICATIONS.CAPTION",
			accessRole: "ROLE_UI_EVENTS_DETAILS_PUBLICATIONS_VIEW",
			name: "publications",
			page: EventDetailsPage.Publication,
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.TABS.ASSETS",
			bodyHeaderTranslation: "EVENTS.EVENTS.DETAILS.ASSETS.CAPTION",
			accessRole: "ROLE_UI_EVENTS_DETAILS_ASSETS_VIEW",
			name: "assets",
			page: EventDetailsPage.Assets,
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.TABS.SCHEDULING",
			bodyHeaderTranslation: "EVENTS.EVENTS.DETAILS.SCHEDULING.CAPTION",
			accessRole: "ROLE_UI_EVENTS_DETAILS_SCHEDULING_VIEW",
			name: "scheduling",
			page: EventDetailsPage.Scheduling,
			hidden:
				!hasSchedulingProperties || !hasAnyDeviceAccess(user, captureAgents),
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.TABS.WORKFLOWS",
			accessRole: "ROLE_UI_EVENTS_DETAILS_WORKFLOWS_VIEW",
			name: "workflows",
			page: EventDetailsPage.Workflow,
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.TABS.ACCESS",
			bodyHeaderTranslation: "EVENTS.EVENTS.DETAILS.TABS.ACCESS",
			accessRole: "ROLE_UI_EVENTS_DETAILS_ACL_VIEW",
			name: "access",
			page: EventDetailsPage.AccessPolicy,
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.TABS.COMMENTS",
			bodyHeaderTranslation: "EVENTS.EVENTS.DETAILS.COMMENTS.CAPTION",
			accessRole: "ROLE_UI_EVENTS_DETAILS_COMMENTS_VIEW",
			name: "comments",
			page: EventDetailsPage.Comments,
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.TABS.STATISTICS",
			bodyHeaderTranslation: "EVENTS.EVENTS.DETAILS.STATISTICS.CAPTION",
			accessRole: "ROLE_UI_EVENTS_DETAILS_STATISTICS_VIEW",
			name: "statistics",
			page: EventDetailsPage.Statistics,
			hidden: !hasStatistics,
		},
	];

	const openTab = (tabNr: EventDetailsPage) => {
		dispatch(removeNotificationWizardForm());
		dispatch(openModalTab(tabNr, "entry", "entry"))
	};

	return (
		<>
			<nav className="modal-nav" id="modal-nav">
				{hasAccess(tabs[0].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === tabs[0].page })} onClick={() => openTab(tabs[0].page)}>
						{t(tabs[0].tabNameTranslation)}
					</button>
				)}
				{!tabs[1].hidden && hasAccess(tabs[1].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === tabs[1].page })} onClick={() => openTab(tabs[1].page)}>
						{t(tabs[1].tabNameTranslation)}
					</button>
				)}
				{hasAccess(tabs[2].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === tabs[2].page })} onClick={() => openTab(tabs[2].page)}>
						{t(tabs[2].tabNameTranslation)}
					</button>
				)}
				{hasAccess(tabs[3].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === tabs[3].page })} onClick={() => openTab(tabs[3].page)}>
						{t(tabs[3].tabNameTranslation)}
					</button>
				)}
				{!tabs[4].hidden && hasAccess(tabs[4].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === tabs[4].page })} onClick={() => openTab(tabs[4].page)}>
						{t(tabs[4].tabNameTranslation)}
					</button>
				)}
				{hasAccess(tabs[5].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === tabs[5].page })} onClick={() => openTab(tabs[5].page)}>
						{t(tabs[5].tabNameTranslation)}
					</button>
				)}
				{hasAccess(tabs[6].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === tabs[6].page })} onClick={() => openTab(tabs[6].page)}>
						{t(tabs[6].tabNameTranslation)}
					</button>
				)}
				{hasAccess(tabs[7].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === tabs[7].page })} onClick={() => openTab(tabs[7].page)}>
						{t(tabs[7].tabNameTranslation)}
					</button>
				)}

				{!tabs[8].hidden && hasAccess(tabs[8].accessRole, user) && (
					<button className={"button-like-anchor " + cn({ active: page === tabs[8].page })} onClick={() => openTab(tabs[8].page)}>
						{t(tabs[8].tabNameTranslation)}
					</button>
				)}
			</nav>
			{/* Initialize overall modal */}
			<div>
				{page === EventDetailsPage.Metadata && !isLoadingMetadata && (
					<DetailsMetadataTab
						metadataFields={metadata}
						resourceId={eventId}
						header={tabs[page].bodyHeaderTranslation ?? ""}
						updateResource={updateMetadataWrapper}
						editAccessRole="ROLE_UI_EVENTS_DETAILS_METADATA_EDIT"
					/>
				)}
				{page === EventDetailsPage.ExtendedMetadata && !isLoadingMetadata && (
					<DetailsExtendedMetadataTab
						resourceId={eventId}
						metadata={extendedMetadata}
						updateResource={updateExtendedMetadataWrapper}
						editAccessRole="ROLE_UI_EVENTS_DETAILS_METADATA_EDIT"
					/>
				)}
				{page === 2 && <EventDetailsPublicationTab eventId={eventId} />}
				{page === EventDetailsPage.Assets && (
					<EventDetailsAssetsTab
						eventId={eventId}
					/>
				)}
				{page === 4 && !isLoadingScheduling && (
					<EventDetailsSchedulingTab eventId={eventId} />
				)}
				{page === EventDetailsPage.Workflow &&
					((workflowTabHierarchy === "entry" && (
						<EventDetailsWorkflowTab
							eventId={eventId}
						/>
					)) ||
						(workflowTabHierarchy === "workflow-details" && (
							<EventDetailsWorkflowDetails
								eventId={eventId}
							/>
						)) ||
						(workflowTabHierarchy === "workflow-operations" && (
							<EventDetailsWorkflowOperations
								eventId={eventId}
							/>
						)) ||
						(workflowTabHierarchy === "workflow-operation-details" && (
							<EventDetailsWorkflowOperationDetails />
						)) ||
						(workflowTabHierarchy === "errors-and-warnings" && (
							<EventDetailsWorkflowErrors
								eventId={eventId}
							/>
						)) ||
						(workflowTabHierarchy === "workflow-error-details" && (
							<EventDetailsWorkflowErrorDetails />
						)))}
				{page === EventDetailsPage.AccessPolicy && (
					<EventDetailsAccessPolicyTab
						eventId={eventId}
						header={tabs[page].bodyHeaderTranslation ?? ""}
						policyChanged={policyChanged}
						setPolicyChanged={setPolicyChanged}
					/>
				)}
				{page === EventDetailsPage.Comments && (
					<EventDetailsCommentsTab
						eventId={eventId}
						header={tabs[page].bodyHeaderTranslation ?? ""}
					/>
				)}
				{page === EventDetailsPage.Statistics && !isLoadingStatistics && (
					<EventDetailsStatisticsTab
						eventId={eventId}
						header={tabs[page].bodyHeaderTranslation ?? ""}
					/>
				)}
			</div>
		</>
	);
};

export default EventDetails;
