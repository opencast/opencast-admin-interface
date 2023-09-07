import React from "react";
import { useTranslation } from "react-i18next";
import { Field } from "formik";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/RenderMultiField' w... Remove this comment to see the full error message
import RenderMultiField from "../../../shared/wizard/RenderMultiField";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/RenderField' was re... Remove this comment to see the full error message
import RenderField from "../../../shared/wizard/RenderField";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardNavigationBut... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="full-col">
						{
							//iterate through metadata catalogs
							!!extendedMetadataFields &&
								extendedMetadataFields.length > 0 &&
// @ts-expect-error TS(7006): Parameter 'catalog' implicitly has an 'any' type.
								extendedMetadataFields.map((catalog, index) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="obj tbl-list" key={index}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<span>{t(catalog.title)}</span>
										</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<tbody>
													{!!catalog.fields &&
// @ts-expect-error TS(7006): Parameter 'field' implicitly has an 'any' type.
														catalog.fields.map((field, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<span>{t(field.label)}</span>
																	{field.required && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<i className="required">*</i>
																	)}
																</td>
																{field.readOnly ? (
																	// non-editable field if readOnly is set or user doesn't have edit access rights
																	!!field.collection &&
																	field.collection.length !== 0 ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<td>{field.value}</td>
																	)
																) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<td className="editable ng-isolated-scope">
																		{field.type === "mixed_text" &&
																		field.collection.length !== 0 ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																			<Field
																				name={catalog.flavor + "_" + field.id}
																				fieldInfo={field}
																				component={RenderMultiField}
																			/>
																		) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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

export default NewMetadataExtendedPage;
