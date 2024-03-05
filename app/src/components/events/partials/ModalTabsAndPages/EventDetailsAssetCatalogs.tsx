import React from "react";
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
import Notifications from "../../../shared/Notifications";
import {
	getAssetCatalogs,
	isFetchingAssetCatalogs,
} from "../../../../selectors/eventDetailsSelectors";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { fetchAssetCatalogDetails } from "../../../../slices/eventDetailsSlice";

/**
 * This component manages the catalogs sub-tab for assets tab of event details modal
 */
const EventDetailsAssetCatalogs = ({
// @ts-expect-error TS(7031): Binding element 'eventId' implicitly has an 'any' ... Remove this comment to see the full error message
	eventId,
// @ts-expect-error TS(7031): Binding element 't' implicitly has an 'any' type.
	t,
// @ts-expect-error TS(7031): Binding element 'setHierarchy' implicitly has an '... Remove this comment to see the full error message
	setHierarchy,
}) => {
	const dispatch = useAppDispatch();

	const catalogs = useAppSelector(state => getAssetCatalogs(state));
	const isFetching = useAppSelector(state => isFetchingAssetCatalogs(state));

// @ts-expect-error TS(7006): Parameter 'subTabName' implicitly has an 'any' typ... Remove this comment to see the full error message
	const openSubTab = (subTabName, catalogId = "") => {
		if (subTabName === "catalog-details") {
			dispatch(fetchAssetCatalogDetails({eventId, catalogId})).then();
		}
		setHierarchy(subTabName);
	};

	return (
		<div className="modal-content">
			{/* Hierarchy navigation */}
			<EventDetailsTabHierarchyNavigation
				openSubTab={openSubTab}
				hierarchyDepth={0}
				translationKey0={"EVENTS.EVENTS.DETAILS.ASSETS.CATALOGS.TITLE"}
				subTabArgument0={"asset-catalogs"}
			/>

			<div className="modal-body">
				{/* Notifications */}
				<Notifications context="not_corner" />

				{/* table with list of catalogs */}
				<div className="full-col">
					<div className="obj tbl-container operations-tbl">
						<header>
							{
								t(
									"EVENTS.EVENTS.DETAILS.ASSETS.CATALOGS.CAPTION"
								) /* Catalogs */
							}
						</header>
						<div className="obj-container">
							<table cellPadding="0" cellSpacing="0" className="main-tbl">
								<thead>
									<tr>
										<th>
											{t("EVENTS.EVENTS.DETAILS.ASSETS.CATALOGS.ID") /* ID */}
										</th>
										<th>
											{
												t(
													"EVENTS.EVENTS.DETAILS.ASSETS.CATALOGS.TYPE"
												) /* Type */
											}
										</th>
										<th>
											{
												t(
													"EVENTS.EVENTS.DETAILS.ASSETS.CATALOGS.MIMETYPE"
												) /* Mimetype */
											}
										</th>
										<th>
											{
												t(
													"EVENTS.EVENTS.DETAILS.ASSETS.CATALOGS.TAGS"
												) /* Tags */
											}
										</th>
										<th className="medium" />
									</tr>
								</thead>
								<tbody>
									{isFetching ||
										catalogs.map((item, key) => (
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
															openSubTab("catalog-details", item.id)
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

export default EventDetailsAssetCatalogs;
