import React from "react";
import { useTranslation } from "react-i18next";
import { Field } from "../../../shared/Field";
import RenderField from "../../../shared/wizard/RenderField";
import RenderMultiField from "../../../shared/wizard/RenderMultiField";
import { MetadataCatalog } from "../../../../slices/eventSlice";
import { getMetadataCollectionFieldName } from "../../../../utils/resourceUtils";

/**
 * This component renders the metadata page for new events and series in the wizards.
 */
const NewMetadataPage = ({
	metadataCatalogs,
	header
}: {
	metadataCatalogs: MetadataCatalog [],
	header?: string
}) => {
	const { t } = useTranslation();

	return (
			<div className="modal-content">
				<div className="modal-body">
					<div className="full-col">
						{
							//iterate through metadata catalogs
							!!metadataCatalogs &&
							metadataCatalogs.length > 0 &&
							metadataCatalogs.map((catalog, index) => (
								<div className="obj tbl-list">
									{/* <header className="no-expand">{t(header)}</header> */}
									<header>
										<span>{t(header ? header : catalog.title)}</span>
									</header>
									{/* Table view containing input fields for metadata */}
									<div className="obj-container">
										<table className="main-tbl">
											<tbody>
												{/* Render table row for each metadata field depending on type*/}
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
																	{/* Render single value or multi value input */}
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
	);
};

export default NewMetadataPage;
