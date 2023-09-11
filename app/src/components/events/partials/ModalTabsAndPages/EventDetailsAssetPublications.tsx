import React from "react";
import { connect } from "react-redux";
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
import Notifications from "../../../shared/Notifications";
import {
	getAssetPublications,
	isFetchingAssets,
} from "../../../../selectors/eventDetailsSelectors";
import { fetchAssetPublicationDetails } from "../../../../thunks/eventDetailsThunks";

/**
 * This component manages the publications sub-tab for assets tab of event details modal
 */
const EventDetailsAssetPublications = ({
    eventId,
    t,
    setHierarchy,
    publications,
    isFetching,
    loadPublicationDetails
}: any) => {
// @ts-expect-error TS(7006): Parameter 'subTabName' implicitly has an 'any' typ... Remove this comment to see the full error message
	const openSubTab = (subTabName, publicationId = "") => {
		if (subTabName === "publication-details") {
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
			loadPublicationDetails(eventId, publicationId).then((r) => {});
		}
		setHierarchy(subTabName);
	};

	return (
		<div className="modal-content">
			{/* Hierarchy navigation */}
			<EventDetailsTabHierarchyNavigation
				openSubTab={openSubTab}
				hierarchyDepth={0}
				translationKey0={"EVENTS.EVENTS.DETAILS.ASSETS.PUBLICATIONS.TITLE"}
				subTabArgument0={"asset-publications"}
			/>

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
// @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
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

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	isFetching: isFetchingAssets(state),
	publications: getAssetPublications(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	loadPublicationDetails: (eventId, publicationId) =>
		dispatch(fetchAssetPublicationDetails(eventId, publicationId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EventDetailsAssetPublications);
