import React from "react";
import Notifications from "../../../shared/Notifications";
import {
	getAssetPublications,
	isFetchingAssetPublications,
} from "../../../../selectors/eventDetailsSelectors";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { fetchAssetPublicationDetails, setModalAssetsTabHierarchy } from "../../../../slices/eventDetailsSlice";
import { AssetTabHierarchy } from "../modals/EventDetails";
import { useTranslation } from "react-i18next";

/**
 * This component manages the publications sub-tab for assets tab of event details modal
 */
const EventDetailsAssetPublications = ({
	eventId,
}: {
	eventId: string,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const publications = useAppSelector(state => getAssetPublications(state));
	const isFetching = useAppSelector(state => isFetchingAssetPublications(state));

	const openSubTab = (subTabName: AssetTabHierarchy, publicationId = "") => {
		if (subTabName === "publication-details") {
			dispatch(fetchAssetPublicationDetails({eventId, publicationId})).then();
		}
		dispatch(setModalAssetsTabHierarchy(subTabName));
	};

	return (
		<div className="modal-content">
			<div className="modal-body">
				{/* Notifications */}
				<Notifications context="not_corner" />

				{/* table with list of publications */}
				<div className="full-col">
					<div className="obj tbl-container operations-tbl">
						<header>
							{
								t(
									"EVENTS.EVENTS.DETAILS.ASSETS.PUBLICATIONS.CAPTION"
								) /* Publications */
							}
						</header>
						<div className="obj-container">
							<table cellPadding="0" cellSpacing="0" className="main-tbl">
								<thead>
									<tr>
										<th>
											{
												t(
													"EVENTS.EVENTS.DETAILS.ASSETS.PUBLICATIONS.ID"
												) /* ID */
											}
										</th>
										<th>
											{
												t(
													"EVENTS.EVENTS.DETAILS.ASSETS.PUBLICATIONS.CHANNEL"
												) /* Channel */
											}
										</th>
										<th>
											{
												t(
													"EVENTS.EVENTS.DETAILS.ASSETS.PUBLICATIONS.TAGS"
												) /* Tags */
											}
										</th>
										<th className="medium" />
									</tr>
								</thead>
								<tbody>
									{isFetching ||
										publications.map((item, key) => (
											<tr key={key}>
												<td>{item.id}</td>
												<td>{item.channel}</td>
												<td>
													{!!item.tags && item.tags.length > 0
														? item.tags.join(", ")
														: null}
												</td>
												<td>
													<button
														className="button-like-anchor details-link"
														onClick={() =>
															openSubTab("publication-details", item.id)
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

export default EventDetailsAssetPublications;
