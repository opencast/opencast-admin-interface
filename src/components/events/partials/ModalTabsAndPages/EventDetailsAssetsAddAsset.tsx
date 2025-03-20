import React from "react";
import EventDetailsTabHierarchyNavigation from "./EventDetailsTabHierarchyNavigation";
import Notifications from "../../../shared/Notifications";
import { style_button_spacing } from "../../../../utils/eventDetailsUtils";
import { Formik, FormikProps } from "formik";
import { getAssetUploadOptions } from "../../../../selectors/eventSelectors";
import { translateOverrideFallback } from "../../../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { setModalAssetsTabHierarchy, updateAssets } from "../../../../slices/eventDetailsSlice";
import { AssetTabHierarchy } from "../modals/EventDetails";
import { useTranslation } from "react-i18next";
import ButtonLikeAnchor from "../../../shared/ButtonLikeAnchor";

/**
 * This component manages the add asset sub-tab for assets tab of event details modal
 */
const EventDetailsAssetsAddAsset = ({
	eventId,
}: {
	eventId: string,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const uploadAssetOptions = useAppSelector(state => getAssetUploadOptions(state));

	const initialValues: { [key: string]: File } = {};

	// Get upload assets that are not of type track
	const uploadAssets = uploadAssetOptions.filter(
		(asset) => asset.type !== "track"
	);

	const openSubTab = (subTabName: AssetTabHierarchy) => {
		dispatch(setModalAssetsTabHierarchy(subTabName));
	};

	function saveAssets(values: { [key: string]: File }) {
		dispatch(updateAssets({values, eventId}));
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>, formik: FormikProps<{ [key: string]: File }>, assetId: string) => {
		if (e.target.files) {
			if (e.target.files.length === 0) {
				formik.setFieldValue(assetId, null);
			} else {
				formik.setFieldValue(assetId, e.target.files[0]);
			}
		} else {
			console.warn("File event did not contain any files")
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
								initialValues={initialValues}
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
													uploadAssets.map((asset, key) => (
														<tr key={key}>
															<td>
																{" "}
																{translateOverrideFallback(asset, t)}
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
																		tabIndex={0}
																	/>
																	{formik.values[asset.id] && (
																		<span className="ui-helper">
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
																<ButtonLikeAnchor
																	className="remove"
																	onClick={() => {
																		formik.setFieldValue(asset.id, null);
																		const element = document.getElementById(asset.id) as HTMLInputElement;
																		if (element) {
																			element.value = "";
																		}
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

export default EventDetailsAssetsAddAsset;
