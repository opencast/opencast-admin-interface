import React from "react";
import { useTranslation } from "react-i18next";
import { Field } from "formik";
import RenderMultiField from "../../../shared/wizard/RenderMultiField";
import RenderField from "../../../shared/wizard/RenderField";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import { isJson } from "../../../../utils/utils";
import { getMetadataCollectionFieldName } from "../../../../utils/resourceUtils";

const NewMetadataExtendedPage = ({
// @ts-expect-error TS(7031): Binding element 'previousPage' implicitly has an '... Remove this comment to see the full error message
	previousPage,
// @ts-expect-error TS(7031): Binding element 'nextPage' implicitly has an 'any'... Remove this comment to see the full error message
	nextPage,
// @ts-expect-error TS(7031): Binding element 'formik' implicitly has an 'any' t... Remove this comment to see the full error message
	formik,
// @ts-expect-error TS(7031): Binding element 'extendedMetadataFields' implicitl... Remove this comment to see the full error message
	extendedMetadataFields,
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
// @ts-expect-error TS(7006): Parameter 'catalog' implicitly has an 'any' type.
								extendedMetadataFields.map((catalog, index) => (
									<div className="obj tbl-list" key={index}>
										<header>
											<span>{t(catalog.title)}</span>
										</header>
										<div className="obj-container">
											<table className="main-tbl">
												<tbody>
													{!!catalog.fields &&
// @ts-expect-error TS(7006): Parameter 'field' implicitly has an 'any' type.
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
																		<td>
																			{isJson(
																				getMetadataCollectionFieldName(
																					field,
																					field
																				)
																			)
																				? t(
																						JSON.parse(
																							getMetadataCollectionFieldName(
																								field,
																								field
																							)
																						).label
																				  )
																				: t(
																						getMetadataCollectionFieldName(
																							field,
																							field
																						)
																				  )}
																		</td>
																	) : (
																		<td>{field.value}</td>
																	)
																) : (
																	<td className="editable ng-isolated-scope">
																		{field.type === "mixed_text" &&
																		field.collection.length !== 0 ? (
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
