import React from "react";
import { useTranslation } from "react-i18next";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import { getAssetUploadOptions } from "../../../../selectors/eventSelectors";
import { useAppSelector } from "../../../../store";
import { FormikProps } from "formik";

/**
 * This component renders the asset upload page of the new event wizard
 * (only if its not set hidden (see newEventWizardConfig) or user chose UPLOAD as source mode)
 */
interface RequiredFormProps {
	sourceMode: string,
	[key: string]: any,
}

const NewAssetUploadPage = <T extends RequiredFormProps>({
	formik,
	nextPage,
	previousPage
}: {
	formik: FormikProps<T>,
	nextPage: (values: T) => void,
	previousPage: (values: T, twoPagesBack?: boolean) => void,
}) => {
	const { t } = useTranslation();

	const uploadAssetOptions = useAppSelector(state => getAssetUploadOptions(state));

	// Get upload assets that are not of type track
	const uploadAssets = uploadAssetOptions.filter(
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
		<>
			<div className="modal-content">
				<div className="modal-body">
					<div className="full-col">
						<div className="obj tbl-details">
							<header>{t("EVENTS.EVENTS.NEW.UPLOAD_ASSET.SELECT_TYPE")}</header>
							<div className="obj-container">
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
														{!!asset.displayOverride
															? t(asset.displayOverride)
															: t(asset.title)}
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
																onChange={(e) => handleChange(e, asset.id)}
																type="file"
																tabIndex={0}
															/>
															{formik.values[asset.id] && (
																<span className="ui-helper">
																	{formik.values[asset.id].name.substr(0, 50)}
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
																(document.getElementById(asset.id) as HTMLInputElement).value = "";
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
			<WizardNavigationButtons
				noValidation
				nextPage={nextPage}
				previousPage={previousPage}
				formik={formik}
			/>
		</>
	);
};


export default NewAssetUploadPage;
