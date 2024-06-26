import React from "react";
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
import Notifications from "../../../shared/Notifications";
import {
	getAssetAttachments,
	isFetchingAssetAttachments,
} from "../../../../selectors/eventDetailsSelectors";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { fetchAssetAttachmentDetails } from "../../../../slices/eventDetailsSlice";
import { AssetTabHierarchy } from "../modals/EventDetails";
import { useTranslation } from "react-i18next";

/**
 * This component manages the attachments sub-tab for assets tab of event details modal
 */
const EventDetailsAssetAttachments = ({
	eventId,
	setHierarchy,
}: {
	eventId: string,
	setHierarchy: (subTabName: AssetTabHierarchy) => void,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const attachments = useAppSelector(state => getAssetAttachments(state));
	const isFetching = useAppSelector(state => isFetchingAssetAttachments(state));

	const openSubTab = (subTabName: AssetTabHierarchy, attachmentId = "") => {
		if (subTabName === "attachment-details") {
			dispatch(fetchAssetAttachmentDetails({eventId, attachmentId})).then();
		}
		setHierarchy(subTabName);
	};

	return (
		<div className="modal-content">
			<div className="modal-body">
				{/* Notifications */}
				<Notifications context="not_corner" />

				{/* table with list of attachments */}
				<div className="full-col">
					<div className="obj tbl-container operations-tbl">
						<header>
							{
								t(
									"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.CAPTION"
								) /* Attachments */
							}
						</header>
						<div className="obj-container">
							<table cellPadding="0" cellSpacing="0" className="main-tbl">
								<thead>
									<tr>
										<th>
											{
												t(
													"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.ID"
												) /* ID */
											}
										</th>
										<th>
											{
												t(
													"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.TYPE"
												) /* Type */
											}
										</th>
										<th>
											{
												t(
													"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.MIMETYPE"
												) /* Mimetype */
											}
										</th>
										<th>
											{
												t(
													"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.TAGS"
												) /* Tags */
											}
										</th>
										<th className="medium" />
									</tr>
								</thead>
								<tbody>
									{isFetching ||
										attachments.map((item, key) => (
											<tr key={key}>
												<td>{item.id}</td>
												<td>{item.type}</td>
												<td>{item.mimetype}</td>
												<td>
													{!!item.tags && item.tags.length > 0
														? item.tags.join(", ")
														: null}
												</td>
												<td>
													<button
														className="button-like-anchor details-link"
														onClick={() =>
															openSubTab("attachment-details", item.id)
														}
													>
														{
															t(
																"EVENTS.EVENTS.DETAILS.ASSETS.DETAILS"
															) /* Details */
														}
													</button>
												</td>
											</tr>
										))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventDetailsAssetAttachments;
