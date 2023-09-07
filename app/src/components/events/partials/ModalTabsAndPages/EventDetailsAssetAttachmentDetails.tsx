import React from "react";
import { connect } from "react-redux";
// @ts-expect-error TS(6142): Module './EventDetailsTabHierarchyNavigation' was ... Remove this comment to see the full error message
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
import {
	getAssetAttachmentDetails,
	isFetchingAssets,
} from "../../../../selectors/eventDetailsSelectors";
import { humanReadableBytesFilter } from "../../../../utils/eventDetailsUtils";

/**
 * This component manages the attachment details sub-tab for assets tab of event details modal
 */
const EventDetailsAssetAttachmentDetails = ({
// @ts-expect-error TS(7031): Binding element 'eventId' implicitly has an 'any' ... Remove this comment to see the full error message
	eventId,
// @ts-expect-error TS(7031): Binding element 't' implicitly has an 'any' type.
	t,
// @ts-expect-error TS(7031): Binding element 'setHierarchy' implicitly has an '... Remove this comment to see the full error message
	setHierarchy,
// @ts-expect-error TS(7031): Binding element 'attachment' implicitly has an 'an... Remove this comment to see the full error message
	attachment,
// @ts-expect-error TS(7031): Binding element 'isFetching' implicitly has an 'an... Remove this comment to see the full error message
	isFetching,
}) => {
// @ts-expect-error TS(7006): Parameter 'subTabName' implicitly has an 'any' typ... Remove this comment to see the full error message
	const openSubTab = (subTabName) => {
		setHierarchy(subTabName);
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="modal-content">
			{/* Hierarchy navigation */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<EventDetailsTabHierarchyNavigation
				openSubTab={openSubTab}
				hierarchyDepth={1}
				translationKey0={"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.TITLE"}
				subTabArgument0={"asset-attachments"}
				translationKey1={
					"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.TITLE"
				}
				subTabArgument1={"attachment-details"}
			/>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-body">
				{/* Notifications */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Notifications context="not_corner" />

				{/* table with details for the attachment */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="obj tbl-container operations-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<header>
							{
								t(
									"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.CAPTION"
								) /* Attachment Details */
							}
						</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<table className="main-tbl">
								{isFetching || (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<tbody>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.ID"
													) /* Id */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{attachment.id}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.TYPE"
													) /* Type */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{attachment.type}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.MIMETYPE"
													) /* Mimetype */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{attachment.mimetype}</td>
										</tr>
										{!!attachment.size && attachment.size > 0 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
													{
														t(
															"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.SIZE"
														) /* Size */
													}
												</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>{humanReadableBytesFilter(attachment.size)}</td>
											</tr>
										)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.CHECKSUM"
													) /* Checksum */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{attachment.checksum}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.REFERENCE"
													) /* Reference */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{attachment.reference}</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.TAGS"
													) /* Tags */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{!!attachment.tags && attachment.tags.length > 0
													? attachment.tags.join(", ")
													: null}
											</td>
										</tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
												{
													t(
														"EVENTS.EVENTS.DETAILS.ASSETS.ATTACHMENTS.DETAILS.URL"
													) /* Link */
												}
											</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<a
													className="fa fa-external-link"
													href={attachment.url}
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

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	isFetching: isFetchingAssets(state),
	attachment: getAssetAttachmentDetails(state),
});

export default connect(mapStateToProps)(EventDetailsAssetAttachmentDetails);
