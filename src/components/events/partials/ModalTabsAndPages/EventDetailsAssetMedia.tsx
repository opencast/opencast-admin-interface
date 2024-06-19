import React from "react";
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
import Notifications from "../../../shared/Notifications";
import {
	getAssetMedia,
	isFetchingAssetMedia,
} from "../../../../selectors/eventDetailsSelectors";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { fetchAssetMediaDetails } from "../../../../slices/eventDetailsSlice";
import { AssetTabHierarchy } from "../modals/EventDetails";
import { useTranslation } from "react-i18next";

/**
 * This component manages the media sub-tab for assets tab of event details modal
 */
const EventDetailsAssetMedia = ({
	eventId,
	setHierarchy,
}: {
	eventId: string,
	setHierarchy: (subTabName: AssetTabHierarchy) => void,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const media = useAppSelector(state => getAssetMedia(state));
	const isFetching = useAppSelector(state => isFetchingAssetMedia(state));

	const openSubTab = (subTabName: AssetTabHierarchy, mediaId = "") => {
		if (subTabName === "media-details") {
			dispatch(fetchAssetMediaDetails({eventId, mediaId})).then();
		}
		setHierarchy(subTabName);
	};

	return (
		<div className="modal-content">
			{/* Hierarchy navigation */}
			<EventDetailsTabHierarchyNavigation
				openSubTab={openSubTab}
				hierarchyDepth={0}
				translationKey0={"EVENTS.EVENTS.DETAILS.ASSETS.MEDIA.TITLE"}
				subTabArgument0={"asset-media"}
			/>

			<div className="modal-body">
				{/* Notifications */}
				<Notifications context="not_corner" />

				{/* table with list of media */}
				<div className="full-col">
					<div className="obj tbl-container operations-tbl">
						<header>
							{t("EVENTS.EVENTS.DETAILS.ASSETS.MEDIA.CAPTION") /* Media */}
						</header>
						<div className="obj-container">
							<table cellPadding="0" cellSpacing="0" className="main-tbl">
								<thead>
									<tr>
										<th>
											{t("EVENTS.EVENTS.DETAILS.ASSETS.MEDIA.ID") /* ID */}
										</th>
										<th>
											{t("EVENTS.EVENTS.DETAILS.ASSETS.MEDIA.TYPE") /* Type */}
										</th>
										<th>
											{
												t(
													"EVENTS.EVENTS.DETAILS.ASSETS.MEDIA.MIMETYPE"
												) /* Mimetype */
											}
										</th>
										<th>
											{t("EVENTS.EVENTS.DETAILS.ASSETS.MEDIA.TAGS") /* Tags */}
										</th>
										<th className="medium" />
									</tr>
								</thead>
								<tbody>
									{isFetching ||
										media.map((item, key) => (
											<tr key={key}>
												<td>
													<a href={item.url} target="_blank" rel="noreferrer">{item.id}</a>
												</td>
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
														onClick={() => openSubTab("media-details", item.id)}
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

export default EventDetailsAssetMedia;
