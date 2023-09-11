import React from "react";
import { connect } from "react-redux";
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
import Notifications from "../../../shared/Notifications";
import {
	getAssetCatalogs,
	isFetchingAssets,
} from "../../../../selectors/eventDetailsSelectors";
import { fetchAssetCatalogDetails } from "../../../../thunks/eventDetailsThunks";

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
// @ts-expect-error TS(7031): Binding element 'catalogs' implicitly has an 'any'... Remove this comment to see the full error message
	catalogs,
// @ts-expect-error TS(7031): Binding element 'isFetching' implicitly has an 'an... Remove this comment to see the full error message
	isFetching,
// @ts-expect-error TS(7031): Binding element 'loadCatalogDetails' implicitly ha... Remove this comment to see the full error message
	loadCatalogDetails,
}) => {
// @ts-expect-error TS(7006): Parameter 'subTabName' implicitly has an 'any' typ... Remove this comment to see the full error message
	const openSubTab = (subTabName, catalogId = "") => {
		if (subTabName === "catalog-details") {
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
			loadCatalogDetails(eventId, catalogId).then((r) => {});
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
// @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
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

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	isFetching: isFetchingAssets(state),
	catalogs: getAssetCatalogs(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	loadCatalogDetails: (eventId, catalogId) =>
		dispatch(fetchAssetCatalogDetails(eventId, catalogId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EventDetailsAssetCatalogs);
