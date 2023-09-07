import React from "react";
import { connect } from "react-redux";
// @ts-expect-error TS(6142): Module './EventDetailsTabHierarchyNavigation' was ... Remove this comment to see the full error message
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
import { style_button_spacing } from "../../../../utils/eventDetailsUtils";
import { Formik } from "formik";
import { updateAssets } from "../../../../thunks/eventDetailsThunks";
import { getAssetUploadOptions } from "../../../../selectors/eventSelectors";

/**
 * This component manages the add asset sub-tab for assets tab of event details modal
 */
const EventDetailsAssetsAddAsset = ({
// @ts-expect-error TS(7031): Binding element 'eventId' implicitly has an 'any' ... Remove this comment to see the full error message
	eventId,
// @ts-expect-error TS(7031): Binding element 't' implicitly has an 'any' type.
	t,
// @ts-expect-error TS(7031): Binding element 'setHierarchy' implicitly has an '... Remove this comment to see the full error message
	setHierarchy,
// @ts-expect-error TS(7031): Binding element 'updateAssets' implicitly has an '... Remove this comment to see the full error message
	updateAssets,
// @ts-expect-error TS(7031): Binding element 'uploadAssetOptions' implicitly ha... Remove this comment to see the full error message
	uploadAssetOptions,
}) => {
	// Get upload assets that are not of type track
	const uploadAssets = uploadAssetOptions.filter(
// @ts-expect-error TS(7006): Parameter 'asset' implicitly has an 'any' type.
		(asset) => asset.type !== "track"
	);

// @ts-expect-error TS(7006): Parameter 'subTabName' implicitly has an 'any' typ... Remove this comment to see the full error message
	const openSubTab = (subTabName) => {
		setHierarchy(subTabName);
	};

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	function saveAssets(values) {
		updateAssets(values, eventId);
	}

// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const handleChange = (e, formik, assetId) => {
		if (e.target.files.length === 0) {
			formik.setFieldValue(assetId, null);
		} else {
			formik.setFieldValue(assetId, e.target.files[0]);
		}
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="modal-content">
			{/* Hierarchy navigation */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<EventDetailsTabHierarchyNavigation
				openSubTab={openSubTab}
				hierarchyDepth={0}
				translationKey0={"EVENTS.EVENTS.NEW.UPLOAD_ASSET.ADD"}
				subTabArgument0={"add-asset"}
			/>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-body">
				{/* Notifications */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Notifications context="not_corner" />

				{/* section for adding assets */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="obj tbl-container operations-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<header>
							{t("EVENTS.EVENTS.NEW.UPLOAD_ASSET.ADD") /* Attachments */}
						</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<Formik
								initialValues={{ newAssets: {} }}
								onSubmit={(values) => saveAssets(values)}
							>
								{(formik) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div>
										{/* file select for upload for different types of assets */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tbody>
												{uploadAssets.length === 0 ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td>
															{t("EVENTS.EVENTS.NEW.UPLOAD_ASSET.NO_OPTIONS")}
														</td>
													</tr>
												) : (
// @ts-expect-error TS(7006): Parameter 'asset' implicitly has an 'any' type.
													uploadAssets.map((asset, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<td>
																{" "}
																{!!asset.displayOverride
																	? t(asset.displayOverride)
																	: t(asset.title)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<span className="ui-helper-hidden">
                                  { // eslint-disable-next-line react/jsx-no-comment-textnodes
                                  } ({asset.type} "{asset.flavorType}//
																	{asset.flavorSubType}")
																</span>
															</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<div className="file-upload">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<input
																		id={asset.id}
																		className="blue-btn file-select-btn"
																		accept={asset.accept}
																		onChange={(e) =>
																			handleChange(e, formik, asset.id)
																		}
																		type="file"
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
																		tabIndex=""
																	/>
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
																	{formik.values[asset.id] && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<span className="ui-helper">
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
																			{formik.values[asset.id].name.substr(
																				0,
																				50
																			)}
																		</span>
																	)}
																</div>
															</td>
															{/*Button to remove asset*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<td className="fit">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<button
																	className="button-like-anchor remove"
																	onClick={() => {
																		formik.setFieldValue(asset.id, null);
// @ts-expect-error TS(2531): Object is possibly 'null'.
																		document.getElementById(asset.id).value =
																			"";
																	}}
																/>
															</td>
														</tr>
													))
												)}
											</tbody>
										</table>

										{/* add asset button */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<footer>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<button
												className="submit"
												style={style_button_spacing}
												type="submit"
												onClick={() => formik.handleSubmit()}
											>
												{t("EVENTS.EVENTS.NEW.UPLOAD_ASSET.ADD")}
											</button>
										</footer>
									</div>
								)}
							</Formik>
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
	uploadAssetOptions: getAssetUploadOptions(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	updateAssets: (values, eventId) => dispatch(updateAssets(values, eventId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EventDetailsAssetsAddAsset);
