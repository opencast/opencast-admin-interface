import React from "react";
import { connect } from "react-redux";
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
import Notifications from "../../../shared/Notifications";
import { style_button_spacing } from "../../../../utils/eventDetailsUtils";
import { Formik } from "formik";
import { updateAssets } from "../../../../thunks/eventDetailsThunks";
import { getAssetUploadOptions } from "../../../../selectors/eventSelectors";
import { translateOverrideFallback } from "../../../../utils/utils";

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
		<div className="modal-content">
			{/* Hierarchy navigation */}
			<EventDetailsTabHierarchyNavigation
				openSubTab={openSubTab}
				hierarchyDepth={0}
				translationKey0={"EVENTS.EVENTS.NEW.UPLOAD_ASSET.ADD"}
				subTabArgument0={"add-asset"}
			/>

			<div className="modal-body">
				{/* Notifications */}
				<Notifications context="not_corner" />

				{/* section for adding assets */}
				<div className="full-col">
					<div className="obj tbl-container operations-tbl">
						<header>
							{t("EVENTS.EVENTS.NEW.UPLOAD_ASSET.ADD") /* Attachments */}
						</header>
						<div className="obj-container">
							<Formik
								initialValues={{ newAssets: {} }}
								onSubmit={(values) => saveAssets(values)}
							>
								{(formik) => (
									<div>
										{/* file select for upload for different types of assets */}
										<table className="main-tbl">
											<tbody>
												{uploadAssets.length === 0 ? (
													<tr>
														<td>
															{t("EVENTS.EVENTS.NEW.UPLOAD_ASSET.NO_OPTIONS")}
														</td>
													</tr>
												) : (
// @ts-expect-error TS(7006): Parameter 'asset' implicitly has an 'any' type.
													uploadAssets.map((asset, key) => (
														<tr key={key}>
															<td>
																{" "}
																{translateOverrideFallback(asset, t)}
																<span className="ui-helper-hidden">
                                  { // eslint-disable-next-line react/jsx-no-comment-textnodes
                                  } ({asset.type} "{asset.flavorType}//
																	{asset.flavorSubType}")
																</span>
															</td>
															<td>
																<div className="file-upload">
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
{/* @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message */}
																	{formik.values[asset.id] && (
																		<span className="ui-helper">
{/* @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message */}
																			{formik.values[asset.id].name.substr(
																				0,
																				50
																			)}
																		</span>
																	)}
																</div>
															</td>
															{/*Button to remove asset*/}
															<td className="fit">
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
										<footer>
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
