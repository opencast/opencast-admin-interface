import React from "react";
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
import Notifications from "../../../shared/Notifications";
import {
	getAssetCatalogDetails,
	isFetchingAssetCatalogDetails,
} from "../../../../selectors/eventDetailsSelectors";
import { humanReadableBytesFilter } from "../../../../utils/eventDetailsUtils";
import { useAppSelector } from "../../../../store";
import { AssetTabHierarchy } from "../modals/EventDetails";
import { useTranslation } from "react-i18next";

/**
 * This component manages the catalog details sub-tab for assets tab of event details modal
 */
const EventDetailsAssetCatalogDetails = ({
	setHierarchy,
}: {
	setHierarchy: (subTabName: AssetTabHierarchy) => void,
}) => {
	const { t } = useTranslation();

	const catalog = useAppSelector(state => getAssetCatalogDetails(state));
	const isFetching = useAppSelector(state => isFetchingAssetCatalogDetails(state));

	const openSubTab = (subTabName: AssetTabHierarchy) => {
		setHierarchy(subTabName);
	};

	return (
		<div className="modal-content">
			<div className="modal-body">
				{/* Notifications */}
				<Notifications context="not_corner" />

				{/* table with details for the catalog */}
				<div className="full-col">
					<div className="obj tbl-container operations-tbl">
						<header>
							{
								t(
									"EVENTS.EVENTS.DETAILS.ASSETS.CATALOGS.DETAILS.CAPTION"
								) /* Catalog Details */
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
														"EVENTS.EVENTS.DETAILS.ASSETS.CATALOGS.DETAILS.ID"
													) /* Id */
												}
											</td>
											<td>{catalog.id}</td>
										</tr>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.CATALOGS.DETAILS.TYPE"
													) /* Type */
												}
											</td>
											<td>{catalog.type}</td>
										</tr>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.CATALOGS.DETAILS.MIMETYPE"
													) /* Mimetype */
												}
											</td>
											<td>{catalog.mimetype}</td>
										</tr>
										{catalog.size > 0 && (
											<tr>
												<td>
													{
														t(
															"EVENTS.EVENTS.DETAILS.ASSETS.CATALOGS.DETAILS.SIZE"
														) /* Size */
													}
												</td>
												<td>{humanReadableBytesFilter(catalog.size)}</td>
											</tr>
										)}
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.CATALOGS.DETAILS.CHECKSUM"
													) /* Checksum */
												}
											</td>
											<td>{catalog.checksum}</td>
										</tr>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.CATALOGS.DETAILS.REFERENCE"
													) /* Reference */
												}
											</td>
											<td>{catalog.reference}</td>
										</tr>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.CATALOGS.DETAILS.TAGS"
													) /* Tags */
												}
											</td>
											<td>
												{!!catalog.tags && catalog.tags.length > 0
													? catalog.tags.join(", ")
													: null}
											</td>
										</tr>
										<tr>
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.CATALOGS.DETAILS.URL"
													) /* Link */
												}
											</td>
											<td>
												{/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
												<a className="fa fa-external-link" href={catalog.url} target="_blank" rel="noreferrer"/>
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

export default EventDetailsAssetCatalogDetails;
