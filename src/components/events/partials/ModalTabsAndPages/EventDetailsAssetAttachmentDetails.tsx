import React from "react";
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
import Notifications from "../../../shared/Notifications";
import {
	getAssetAttachmentDetails,
	isFetchingAssetAttachmentDetails,
} from "../../../../selectors/eventDetailsSelectors";
import { humanReadableBytesFilter } from "../../../../utils/eventDetailsUtils";
import { useAppSelector } from "../../../../store";
import { AssetTabHierarchy } from "../modals/EventDetails";
import { useTranslation } from "react-i18next";

/**
 * This component manages the attachment details sub-tab for assets tab of event details modal
 */
const EventDetailsAssetAttachmentDetails = ({
	setHierarchy,
}: {
	setHierarchy: (subTabName: AssetTabHierarchy) => void,
}) => {
	const { t } = useTranslation();
	const attachment = useAppSelector(state => getAssetAttachmentDetails(state));
	const isFetching = useAppSelector(state => isFetchingAssetAttachmentDetails(state));

	const openSubTab = (subTabName: AssetTabHierarchy) => {
		setHierarchy(subTabName);
	};

	return (
		<div className="modal-content">
			<div className="modal-body">
				{/* Notifications */}
				<Notifications context="not_corner" />

				{/* table with details for the attachment */}
				<div className="full-col">
					<div className="obj tbl-container operations-tbl">
						<header>
							{
								t(
									"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.CAPTION"
								) /* Attachment Details */
							}
						</header>
						<div className="obj-container">
							<table className="main-tbl">
								{isFetching || (
									<tbody>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.ID"
													) /* Id */
												}
											</td>
											<td>{attachment.id}</td>
										</tr>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.TYPE"
													) /* Type */
												}
											</td>
											<td>{attachment.type}</td>
										</tr>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.MIMETYPE"
													) /* Mimetype */
												}
											</td>
											<td>{attachment.mimetype}</td>
										</tr>
										{!!attachment.size && attachment.size > 0 && (
											<tr>
												<td>
													{
														t(
															"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.SIZE"
														) /* Size */
													}
												</td>
												<td>{humanReadableBytesFilter(attachment.size)}</td>
											</tr>
										)}
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.CHECKSUM"
													) /* Checksum */
												}
											</td>
											<td>{attachment.checksum}</td>
										</tr>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.REFERENCE"
													) /* Reference */
												}
											</td>
											<td>{attachment.reference}</td>
										</tr>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.TAGS"
													) /* Tags */
												}
											</td>
											<td>
												{!!attachment.tags && attachment.tags.length > 0
													? attachment.tags.join(", ")
													: null}
											</td>
										</tr>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.URL"
													) /* Link */
												}
											</td>
											<td>
												{/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
												<a
													className="fa fa-external-link"
													href={attachment.url}
													target="_blank" rel="noreferrer"
												/>
											</td>
										</tr>
									</tbody>
								)}
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventDetailsAssetAttachmentDetails;
