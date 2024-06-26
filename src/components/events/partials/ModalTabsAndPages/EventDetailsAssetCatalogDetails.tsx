import React from "react";
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
import Notifications from "../../../shared/Notifications";
import {
	getAssetCatalogDetails,
	isFetchingAssetCatalogDetails,
} from "../../../../selectors/eventDetailsSelectors";
import { humanReadableBytesFilter } from "../../../../utils/eventDetailsUtils";
import { useAppSelector } from "../../../../store";

/**
 * This component manages the catalog details sub-tab for assets tab of event details modal
 */
const EventDetailsAssetCatalogDetails = ({
// @ts-expect-error TS(7031): Binding element 'eventId' implicitly has an 'any' ... Remove this comment to see the full error message
	eventId,
// @ts-expect-error TS(7031): Binding element 't' implicitly has an 'any' type.
	t,
// @ts-expect-error TS(7031): Binding element 'setHierarchy' implicitly has an '... Remove this comment to see the full error message
	setHierarchy,
}) => {
	const catalog = useAppSelector(state => getAssetCatalogDetails(state));
	const isFetching = useAppSelector(state => isFetchingAssetCatalogDetails(state));

// @ts-expect-error TS(7006): Parameter 'subTabName' implicitly has an 'any' typ... Remove this comment to see the full error message
	const openSubTab = (subTabName) => {
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
