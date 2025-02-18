import React, { useEffect } from "react";
import Notifications from "../../../shared/Notifications";
import {
	getAssets,
	getModalAssetsTabHierarchy,
	getUploadAssetOptions,
	isFetchingAssets,
	isTransactionReadOnly,
} from "../../../../selectors/eventDetailsSelectors";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";
import { isFetchingAssetUploadOptions as getIsFetchingAssetUploadOptions } from "../../../../selectors/eventSelectors";
import {
	fetchAssetAttachments,
	fetchAssetCatalogs,
	fetchAssetMedia,
	fetchAssetPublications,
	fetchAssets,
	setModalAssetsTabHierarchy,
} from "../../../../slices/eventDetailsSlice";
import { useTranslation } from "react-i18next";
import { AssetTabHierarchy } from "../modals/EventDetails";
import EventDetailsAssetsAddAsset from "./EventDetailsAssetsAddAsset";
import EventDetailsAssetAttachments from "./EventDetailsAssetAttachments";
import EventDetailsAssetAttachmentDetails from "./EventDetailsAssetAttachmentDetails";
import EventDetailsAssetCatalogs from "./EventDetailsAssetCatalogs";
import EventDetailsAssetCatalogDetails from "./EventDetailsAssetCatalogDetails";
import EventDetailsAssetMedia from "./EventDetailsAssetMedia";
import EventDetailsAssetMediaDetails from "./EventDetailsAssetMediaDetails";
import EventDetailsAssetPublications from "./EventDetailsAssetPublications";
import EventDetailsAssetPublicationDetails from "./EventDetailsAssetPublicationDetails";

/**
 * This component manages the main assets tab of event details modal
 */
const EventDetailsAssetsTab = ({
	eventId,
}: {
	eventId: string,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const assetsTabHierarchy = useAppSelector(state => getModalAssetsTabHierarchy(state));
	const user = useAppSelector(state => getUserInformation(state));
	const assets = useAppSelector(state => getAssets(state));
	const uploadAssetOptions = useAppSelector(state => getUploadAssetOptions(state));
	const isFetching = useAppSelector(state => isFetchingAssets(state));
	const transactionsReadOnly = useAppSelector(state => isTransactionReadOnly(state));
	const isFetchingAssetUploadOptions = useAppSelector(state => getIsFetchingAssetUploadOptions(state));

	const assetsTabs = [
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.TITLE",
			tabHierarchies: ["asset-attachments", "attachment-details"],
			open: () => openSubTab("asset-attachments", "attachment"),
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.ASSETS.CATALOGS.TITLE",
			tabHierarchies: ["asset-catalogs", "catalog-details"],
			open: () => openSubTab("asset-catalogs", "catalog"),
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.ASSETS.MEDIA.TITLE",
			tabHierarchies: ["asset-media", "media-details"],
			open: () => openSubTab("asset-media", "media"),
		},
		{
			tabNameTranslation: "EVENTS.EVENTS.DETAILS.ASSETS.PUBLICATIONS.TITLE",
			tabHierarchies: ["asset-publications", "publication-details"],
			open: () => openSubTab("asset-publications", "publication"),
		},
	];

	const assetsNavStyle = {
		borderBottom: "1px solid #d6d6d6",
		lineHeight: "35px",
		paddingLeft: "15px",
	};

	const assetsTabActive = {
		padding: "14px 5px",
		fontWeight: "600",
		minWidth: "100px",
		color: "#5d7589",
	};

	const assetsTabInactive = {
		padding: "14px 5px",
		minWidth: "100px",
		color: "#92a0ab",
	};

	useEffect(() => {
		dispatch(removeNotificationWizardForm());
		dispatch(fetchAssets(eventId)).then();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const openSubTab = (
		subTabName: AssetTabHierarchy,
		newassetupload: string,
	) => {
		dispatch(removeNotificationWizardForm());
		if (subTabName === "asset-attachments") {
			dispatch(fetchAssetAttachments(eventId)).then();
		} else if (subTabName === "asset-catalogs") {
			dispatch(fetchAssetCatalogs(eventId)).then();
		} else if (subTabName === "asset-media") {
			dispatch(fetchAssetMedia(eventId)).then();
		} else if (subTabName === "asset-publications") {
			dispatch(fetchAssetPublications(eventId)).then();
		}
		dispatch(setModalAssetsTabHierarchy(subTabName));
	};

	return (
		<>
			{/* Assets tabs */}
			<nav style={assetsNavStyle}>
				{assetsTabs.map((tab, key) => (
					<button
						key={key}
						className={"button-like-anchor"}
						style={tab.tabHierarchies.includes(assetsTabHierarchy) ? assetsTabActive: assetsTabInactive}
						onClick={tab.open}
					>
						{t(tab.tabNameTranslation)}
					</button>
				))}
			</nav>
			{((assetsTabHierarchy === "entry" && (
				<div className="modal-content">
					<div className="modal-body">
						{/* Notifications */}
						<Notifications context="not_corner" />

						{/* table with types of assets */}
						<div className="full-col">
							<div className="obj tbl-container operations-tbl">
								{" "}
								{/* Assets */}
								<header>{t("EVENTS.EVENTS.DETAILS.ASSETS.CAPTION")}</header>
								<div className="obj-container">
									{isFetching || (
										<table cellPadding="0" cellSpacing="0" className="main-tbl">
											<thead>
												<tr>
													<th>
														{" "}
														{t("EVENTS.EVENTS.DETAILS.ASSETS.TYPE") /* Type */}
													</th>
													<th>
														{" "}
														{t("EVENTS.EVENTS.DETAILS.ASSETS.SIZE") /* Size */}
													</th>
													<th className="medium">
														{!isFetchingAssetUploadOptions &&
															!!uploadAssetOptions &&
															uploadAssetOptions.length > 0 &&
															!transactionsReadOnly &&
															hasAccess(
																"ROLE_UI_EVENTS_DETAILS_ASSETS_EDIT",
																user
															) && (
																<button
																	className="button-like-anchor details-link"
																	onClick={() =>
																		openSubTab(
																			"add-asset",
																			"newassetupload",
																		)
																	}
																>
																	{t("EVENTS.EVENTS.NEW.UPLOAD_ASSET.ADD")}
																</button>
															)}
													</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>
														{
															t(
																"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.CAPTION"
															) /* Attachments */
														}
													</td>
													<td>{assets.attachments}</td>
													<td>
														{assets.attachments > 0 && (
															<button
																className="button-like-anchor details-link"
																onClick={() =>
																	openSubTab("asset-attachments", "attachment")
																}
															>
																{
																	t(
																		"EVENTS.EVENTS.DETAILS.ASSETS.DETAILS"
																	) /* Details */
																}
															</button>
														)}
													</td>
												</tr>
												<tr>
													<td>
														{
															t(
																"EVENTS.EVENTS.DETAILS.ASSETS.CATALOGS.CAPTION"
															) /* Catalogs */
														}
													</td>
													<td>{assets.catalogs}</td>
													<td>
														{assets.catalogs > 0 && (
															<button
																className="button-like-anchor details-link"
																onClick={() =>
																	openSubTab("asset-catalogs", "catalog")
																}
															>
																{
																	t(
																		"EVENTS.EVENTS.DETAILS.ASSETS.DETAILS"
																	) /* Details */
																}
															</button>
														)}
													</td>
												</tr>
												<tr>
													<td>
														{
															t(
																"EVENTS.EVENTS.DETAILS.ASSETS.MEDIA.CAPTION"
															) /* Media */
														}
													</td>
													<td>{assets.media}</td>
													<td>
														{assets.media > 0 && (
															<button
																className="button-like-anchor details-link"
																onClick={() => openSubTab("asset-media", "media")}
															>
																{
																	t(
																		"EVENTS.EVENTS.DETAILS.ASSETS.DETAILS"
																	) /* Details */
																}
															</button>
														)}
													</td>
												</tr>
												<tr>
													<td>
														{
															t(
																"EVENTS.EVENTS.DETAILS.ASSETS.PUBLICATIONS.CAPTION"
															) /* Publications */
														}
													</td>
													<td>{assets.publications}</td>
													<td>
														{assets.publications > 0 && (
															<button
																className="button-like-anchor details-link"
																onClick={() =>
																	openSubTab("asset-publications", "publication")
																}
															>
																{
																	t(
																		"EVENTS.EVENTS.DETAILS.ASSETS.DETAILS"
																	) /* Details */
																}
															</button>
														)}
													</td>
												</tr>
											</tbody>
										</table>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)) ||
			(assetsTabHierarchy === "add-asset" && (
				<EventDetailsAssetsAddAsset
					eventId={eventId}
				/>
			)) ||
			(assetsTabHierarchy === "asset-attachments" && (
				<EventDetailsAssetAttachments
					eventId={eventId}
				/>
			)) ||
			(assetsTabHierarchy === "attachment-details" && (
				<EventDetailsAssetAttachmentDetails />
			)) ||
			(assetsTabHierarchy === "asset-catalogs" && (
				<EventDetailsAssetCatalogs
					eventId={eventId}
				/>
			)) ||
			(assetsTabHierarchy === "catalog-details" && (
				<EventDetailsAssetCatalogDetails />
			)) ||
			(assetsTabHierarchy === "asset-media" && (
				<EventDetailsAssetMedia
					eventId={eventId}
				/>
			)) ||
			(assetsTabHierarchy === "media-details" && (
				<EventDetailsAssetMediaDetails />
			)) ||
			(assetsTabHierarchy === "asset-publications" && (
				<EventDetailsAssetPublications
					eventId={eventId}
				/>
			)) ||
			(assetsTabHierarchy === "publication-details" && (
				<EventDetailsAssetPublicationDetails />
			)))}
		</>
	);
};


export default EventDetailsAssetsTab;
