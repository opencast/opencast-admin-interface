import React from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardNavigationBut... Remove this comment to see the full error message
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import { connect } from "react-redux";
import { getAssetUploadOptions } from "../../../../selectors/eventSelectors";

/**
 * This component renders the asset upload page of the new event wizard
 * (only if its not set hidden (see newEventWizardConfig) or user chose UPLOAD as source mode)
 */
const NewAssetUploadPage = ({
// @ts-expect-error TS(7031): Binding element 'previousPage' implicitly has an '... Remove this comment to see the full error message
	previousPage,
// @ts-expect-error TS(7031): Binding element 'nextPage' implicitly has an 'any'... Remove this comment to see the full error message
	nextPage,
// @ts-expect-error TS(7031): Binding element 'formik' implicitly has an 'any' t... Remove this comment to see the full error message
	formik,
// @ts-expect-error TS(7031): Binding element 'uploadAssetOptions' implicitly ha... Remove this comment to see the full error message
	uploadAssetOptions,
}) => {
	const { t } = useTranslation();

	// Get upload assets that are not of type track
	const uploadAssets = uploadAssetOptions.filter(
// @ts-expect-error TS(7006): Parameter 'asset' implicitly has an 'any' type.
		(asset) => asset.type !== "track"
	);

	// if user not chose upload in step before, the skip this step
	if (formik.values.sourceMode !== "UPLOAD") {
		nextPage(formik.values);
		return null;
	}

// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const handleChange = (e, assetId) => {
		if (e.target.files.length === 0) {
			formik.setFieldValue(assetId, null);
		} else {
			formik.setFieldValue(assetId, e.target.files[0]);
		}
	};
	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj tbl-details">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<header>{t("EVENTS.EVENTS.NEW.UPLOAD_ASSET.SELECT_TYPE")}</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj-container">
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
																onChange={(e) => handleChange(e, asset.id)}
																type="file"
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
																tabIndex=""
															/>
															{formik.values[asset.id] && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<span className="ui-helper">
																	{formik.values[asset.id].name.substr(0, 50)}
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
																document.getElementById(asset.id).value = "";
															}}
														/>
													</td>
												</tr>
											))
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Button for navigation to next page */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<WizardNavigationButtons
				noValidation
				nextPage={nextPage}
				previousPage={previousPage}
				formik={formik}
			/>
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	uploadAssetOptions: getAssetUploadOptions(state),
});

export default connect(mapStateToProps)(NewAssetUploadPage);
