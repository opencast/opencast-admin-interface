import React from "react";
import { useTranslation } from "react-i18next";
import { FormikProps } from "formik";
import { Field } from "../../../shared/Field";
import RenderMultiField from "../../../shared/wizard/RenderMultiField";
import RenderField from "../../../shared/wizard/RenderField";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import { getMetadataCollectionFieldName } from "../../../../utils/resourceUtils";
import { MetadataCatalog } from "../../../../slices/eventSlice";

const NewMetadataExtendedPage = <T,>({
	formik,
	nextPage,
	previousPage,
	extendedMetadataFields,
}: {
	formik: FormikProps<T>,
	nextPage: (values: T) => void,
	previousPage: (values: T, twoPagesBack?: boolean) => void,
	extendedMetadataFields?: MetadataCatalog[],
}) => {
	const { t } = useTranslation();

	return (
		<>
			<div className="modal-content">
				<div className="modal-body">
					<div className="full-col">
						{
							//iterate through metadata catalogs
							!!extendedMetadataFields &&
								extendedMetadataFields.length > 0 &&
								extendedMetadataFields.map((catalog, index) => (
									<div className="obj tbl-list" key={index}>
										<header>
											<span>{t(catalog.title)}</span>
										</header>
										<div className="obj-container">
											<table className="main-tbl">
												<tbody>
													{!!catalog.fields &&
														catalog.fields.map((field, key) => (
															<tr key={key}>
																<td>
																	<span>{t(field.label)}</span>
																	{field.required && (
																		<i className="required">*</i>
																	)}
																</td>
																{field.readOnly ? (
																	// non-editable field if readOnly is set or user doesn't have edit access rights
																	!!field.collection &&
																	field.collection.length !== 0 ? (
																		<td>{getMetadataCollectionFieldName(field, field, t)}</td>
																	) : (
																		<td>{field.value}</td>
																	)
																) : (
																	<td className="editable ng-isolated-scope">
																		{field.type === "mixed_text" &&
																		field.collection?.length !== 0 ? (
																			<Field
																				name={catalog.flavor + "_" + field.id}
																				fieldInfo={field}
																				component={RenderMultiField}
																			/>
																		) : (
																			<Field
																				name={catalog.flavor + "_" + field.id}
																				metadataField={field}
																				isFirstField={index === 0 && key === 0}
																				component={RenderField}
																			/>
																		)}
																	</td>
																)}
															</tr>
														))}
												</tbody>
											</table>
										</div>
									</div>
								))
						}
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

export default NewMetadataExtendedPage;
