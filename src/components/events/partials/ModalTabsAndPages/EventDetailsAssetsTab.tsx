import React, { useEffect } from "react";
import Notifications from "../../../shared/Notifications";
import {
	getAssets,
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
} from "../../../../slices/eventDetailsSlice";

/**
 * This component manages the main assets tab of event details modal
 */
const EventDetailsAssetsTab = ({
// @ts-expect-error TS(7031): Binding element 'eventId' implicitly has an 'any' ... Remove this comment to see the full error message
	eventId,
// @ts-expect-error TS(7031): Binding element 't' implicitly has an 'any' type.
	t,
// @ts-expect-error TS(7031): Binding element 'setHierarchy' implicitly has an '... Remove this comment to see the full error message
	setHierarchy,
}) => {
	const dispatch = useAppDispatch();

	const user = useAppSelector(state => getUserInformation(state));
	const assets = useAppSelector(state => getAssets(state));
	const uploadAssetOptions = useAppSelector(state => getUploadAssetOptions(state));
	const isFetching = useAppSelector(state => isFetchingAssets(state));
	const transactionsReadOnly = useAppSelector(state => isTransactionReadOnly(state));
	const isFetchingAssetUploadOptions = useAppSelector(state => getIsFetchingAssetUploadOptions(state));

	useEffect(() => {
		dispatch(removeNotificationWizardForm());
		dispatch(fetchAssets(eventId)).then();


		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const openSubTab = (
// @ts-expect-error TS(7006): Parameter 'subTabName' implicitly has an 'any' typ... Remove this comment to see the full error message
		subTabName,
// @ts-expect-error TS(7006): Parameter 'newassetupload' implicitly has an 'any'... Remove this comment to see the full error message
		newassetupload,
		bool1 = false,
		bool2 = true
	) => {
		dispatch(removeNotificationWizardForm());
		if (subTabName === "asset-attachments") {
			dispatch(fetchAssetAttachments(eventId)).then();
		} else if (subTabName === "asset-attachments") {
			dispatch(fetchAssetAttachments(eventId)).then();
		} else if (subTabName === "asset-catalogs") {
			dispatch(fetchAssetCatalogs(eventId)).then();
		} else if (subTabName === "asset-media") {
			dispatch(fetchAssetMedia(eventId)).then();
		} else if (subTabName === "asset-publications") {
			dispatch(fetchAssetPublications(eventId)).then();
		}
		setHierarchy(subTabName);
	};

	return (
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
																	false,
																	true
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
	);
};


export default EventDetailsAssetsTab;
