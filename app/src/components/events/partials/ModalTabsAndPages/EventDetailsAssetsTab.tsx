import React, { useEffect } from "react";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
import { connect } from "react-redux";
import { removeNotificationWizardForm } from "../../../../actions/notificationActions";
import {
	fetchAssetAttachments,
	fetchAssetCatalogs,
	fetchAssetMedia,
	fetchAssetPublications,
	fetchAssets,
	fetchWorkflows,
} from "../../../../thunks/eventDetailsThunks";
import {
	getAssets,
	getUploadAssetOptions,
	isFetchingAssets,
	isTransactionReadOnly,
} from "../../../../selectors/eventDetailsSelectors";
import { getWorkflow } from "../../../../selectors/eventDetailsSelectors";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../../utils/utils";
import { isFetchingAssetUploadOptions } from "../../../../selectors/eventSelectors";

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
// @ts-expect-error TS(7031): Binding element 'fetchAssets' implicitly has an 'a... Remove this comment to see the full error message
	fetchAssets,
// @ts-expect-error TS(7031): Binding element 'fetchAttachments' implicitly has ... Remove this comment to see the full error message
	fetchAttachments,
// @ts-expect-error TS(7031): Binding element 'fetchCatalogs' implicitly has an ... Remove this comment to see the full error message
	fetchCatalogs,
// @ts-expect-error TS(7031): Binding element 'fetchMedia' implicitly has an 'an... Remove this comment to see the full error message
	fetchMedia,
// @ts-expect-error TS(7031): Binding element 'fetchPublications' implicitly has... Remove this comment to see the full error message
	fetchPublications,
// @ts-expect-error TS(7031): Binding element 'assets' implicitly has an 'any' t... Remove this comment to see the full error message
	assets,
// @ts-expect-error TS(7031): Binding element 'transactionsReadOnly' implicitly ... Remove this comment to see the full error message
	transactionsReadOnly,
// @ts-expect-error TS(7031): Binding element 'uploadAssetOptions' implicitly ha... Remove this comment to see the full error message
	uploadAssetOptions,
// @ts-expect-error TS(7031): Binding element 'isFetching' implicitly has an 'an... Remove this comment to see the full error message
	isFetching,
// @ts-expect-error TS(7031): Binding element 'isFetchingAssetUploadOptions' imp... Remove this comment to see the full error message
	isFetchingAssetUploadOptions,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
}) => {
	useEffect(() => {
		removeNotificationWizardForm();
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
		fetchAssets(eventId).then((r) => {});
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
		removeNotificationWizardForm();
		if (subTabName === "asset-attachments") {
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
			fetchAttachments(eventId).then((r) => {});
		} else if (subTabName === "asset-attachments") {
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
			fetchAttachments(eventId).then((r) => {});
		} else if (subTabName === "asset-catalogs") {
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
			fetchCatalogs(eventId).then((r) => {});
		} else if (subTabName === "asset-media") {
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
			fetchMedia(eventId).then((r) => {});
		} else if (subTabName === "asset-publications") {
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
			fetchPublications(eventId).then((r) => {});
		}
		setHierarchy(subTabName);
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-body">
				{/* Notifications */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Notifications context="not_corner" />

				{/* table with types of assets */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="obj tbl-container operations-tbl">
						{" "}
						{/* Assets */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<header>{t("EVENTS.EVENTS.DETAILS.ASSETS.CAPTION")}</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj-container">
							{isFetching || (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<table cellPadding="0" cellSpacing="0" className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<th>
												{" "}
												{t("EVENTS.EVENTS.DETAILS.ASSETS.TYPE") /* Type */}
											</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<th>
												{" "}
												{t("EVENTS.EVENTS.DETAILS.ASSETS.SIZE") /* Size */}
											</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<th className="medium">
												{!isFetchingAssetUploadOptions &&
													!!uploadAssetOptions &&
													uploadAssetOptions.filter(
// @ts-expect-error TS(7006): Parameter 'asset' implicitly has an 'any' type.
														(asset) => asset.type !== "track"
													).length > 0 &&
													!transactionsReadOnly &&
													hasAccess(
														"ROLE_UI_EVENTS_DETAILS_ASSETS_EDIT",
														user
													) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<tbody>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.CAPTION"
													) /* Attachments */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{assets.attachments}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{assets.attachments > 0 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.CATALOGS.CAPTION"
													) /* Catalogs */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{assets.catalogs}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{assets.catalogs > 0 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.MEDIA.CAPTION"
													) /* Media */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{assets.media}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{assets.media > 0 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.PUBLICATIONS.CAPTION"
													) /* Publications */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{assets.publications}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{assets.publications > 0 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	assets: getAssets(state),
	isFetching: isFetchingAssets(state),
	transactionsReadOnly: isTransactionReadOnly(state),
	uploadAssetOptions: getUploadAssetOptions(state),
	assetUploadWorkflowDefId: getWorkflow(state).id,
	user: getUserInformation(state),
	isFetchingAssetUploadOptions: isFetchingAssetUploadOptions(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	fetchAssets: (eventId) => dispatch(fetchAssets(eventId)),
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	fetchAttachments: (eventId) => dispatch(fetchAssetAttachments(eventId)),
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	fetchCatalogs: (eventId) => dispatch(fetchAssetCatalogs(eventId)),
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	fetchMedia: (eventId) => dispatch(fetchAssetMedia(eventId)),
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	fetchPublications: (eventId) => dispatch(fetchAssetPublications(eventId)),
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	fetchWorkflows: (eventId) => dispatch(fetchWorkflows(eventId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EventDetailsAssetsTab);
