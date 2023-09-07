import React from "react";
import { connect } from "react-redux";
// @ts-expect-error TS(6142): Module './EventDetailsTabHierarchyNavigation' was ... Remove this comment to see the full error message
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
import {
	getAssetAttachments,
	isFetchingAssets,
} from "../../../../selectors/eventDetailsSelectors";
import { fetchAssetAttachmentDetails } from "../../../../thunks/eventDetailsThunks";

/**
 * This component manages the attachments sub-tab for assets tab of event details modal
 */
const EventDetailsAssetAttachments = ({
// @ts-expect-error TS(7031): Binding element 'eventId' implicitly has an 'any' ... Remove this comment to see the full error message
	eventId,
// @ts-expect-error TS(7031): Binding element 't' implicitly has an 'any' type.
	t,
// @ts-expect-error TS(7031): Binding element 'setHierarchy' implicitly has an '... Remove this comment to see the full error message
	setHierarchy,
// @ts-expect-error TS(7031): Binding element 'attachments' implicitly has an 'a... Remove this comment to see the full error message
	attachments,
// @ts-expect-error TS(7031): Binding element 'isFetching' implicitly has an 'an... Remove this comment to see the full error message
	isFetching,
// @ts-expect-error TS(7031): Binding element 'loadAttachmentDetails' implicitly... Remove this comment to see the full error message
	loadAttachmentDetails,
}) => {
// @ts-expect-error TS(7006): Parameter 'subTabName' implicitly has an 'any' typ... Remove this comment to see the full error message
	const openSubTab = (subTabName, attachmentId = "") => {
		if (subTabName === "attachment-details") {
// @ts-expect-error TS(7006): Parameter 'r' implicitly has an 'any' type.
			loadAttachmentDetails(eventId, attachmentId).then((r) => {});
		}
		setHierarchy(subTabName);
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="modal-content">
			{/* Hierarchy navigation */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<EventDetailsTabHierarchyNavigation
				openSubTab={openSubTab}
				hierarchyDepth={0}
				translationKey0={"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.TITLE"}
				subTabArgument0={"asset-attachments"}
			/>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-body">
				{/* Notifications */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Notifications context="not_corner" />

				{/* table with list of attachments */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="obj tbl-container operations-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<header>
							{
								t(
									"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.CAPTION"
								) /* Attachments */
							}
						</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<table cellPadding="0" cellSpacing="0" className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<th>
											{
												t(
													"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.ID"
												) /* ID */
											}
										</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<th>
											{
												t(
													"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.TYPE"
												) /* Type */
											}
										</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<th>
											{
												t(
													"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.MIMETYPE"
												) /* Mimetype */
											}
										</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<th>
											{
												t(
													"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.TAGS"
												) /* Tags */
											}
										</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<th className="medium" />
									</tr>
								</thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<tbody>
									{isFetching ||
// @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
										attachments.map((item, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>{item.id}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>{item.type}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>{item.mimetype}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{!!item.tags && item.tags.length > 0
														? item.tags.join(", ")
														: null}
												</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	isFetching: isFetchingAssets(state),
	attachments: getAssetAttachments(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'eventId' implicitly has an 'any' type.
	loadAttachmentDetails: (eventId, attachmentId) =>
		dispatch(fetchAssetAttachmentDetails(eventId, attachmentId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EventDetailsAssetAttachments);
