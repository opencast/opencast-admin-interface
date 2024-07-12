import React from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { Field } from "../../../shared/Field";
import cn from "classnames";
import _ from "lodash";
import Notifications from "../../../shared/Notifications";
import RenderDate from "../../../shared/RenderDate";
import RenderMultiField from "../../../shared/wizard/RenderMultiField";
import RenderField from "../../../shared/wizard/RenderField";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { hasAccess, isJson } from "../../../../utils/utils";
import { getMetadataCollectionFieldName } from "../../../../utils/resourceUtils";
import { useAppSelector } from "../../../../store";
import { MetadataCatalog } from "../../../../slices/eventDetailsSlice";

/**
 * This component renders metadata details of a certain event or series
 */
const DetailsMetadataTab = ({
	metadataFields,
	updateResource,
	resourceId,
	header,
	editAccessRole,
}: {
	metadataFields: MetadataCatalog,
	updateResource: (id: string, values: { [key: string]: any }) => void,
	resourceId: string,
	header: string,
	editAccessRole: string,
}) => {
	const { t } = useTranslation();

	const user = useAppSelector(state => getUserInformation(state));

	const handleSubmit = (values: { [key: string]: any }) => {
		updateResource(resourceId, values);
	};

	// set current values of metadata fields as initial values
	const getInitialValues = () => {
		let initialValues = {};

		// Transform metadata fields and their values provided by backend (saved in redux)
		if (
			!!metadataFields &&
			!!metadataFields.fields &&
			metadataFields.fields.length > 0
		) {
			metadataFields.fields.forEach((field) => {
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
				initialValues[field.id] = field.value;
			});
		}

		return initialValues;
	};

// @ts-expect-error TS(7006): Parameter 'formik' implicitly has an 'any' type.
	const checkValidity = (formik) => {
		if (formik.dirty && formik.isValid && hasAccess(editAccessRole, user)) {
			// check if user provided values differ from initial ones
			return !_.isEqual(formik.values, formik.initialValues);
		} else {
			return false;
		}
	};

	return (
		// initialize form
		<Formik
			enableReinitialize
			initialValues={getInitialValues()}
			onSubmit={(values) => handleSubmit(values)}
		>
			{(formik) => (
				<>
					<div className="modal-content">
						<div className="modal-body">
							<Notifications context="not-corner" />
							<div className="full-col">
								<div className="obj tbl-list">
									<header className="no-expand">{t(header)}</header>
									<div className="obj-container">
										<table className="main-tbl">
											<tbody>
												{/* Render table row for each metadata field depending on type */}
												{!!metadataFields &&
													!!metadataFields.fields &&
													metadataFields.fields.map((field, key) => (
														<tr key={key}>
															<td>
																<span>{t(field.label)}</span>
																{field.required && (
																	<i className="required">*</i>
																)}
															</td>
															{field.readOnly ? (
																// non-editable field if readOnly is set
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
																	<td>{
																		field.type === "time" || field.type === "date"
																			? <RenderDate date={field.value as string} />
																			: field.value
																	}</td>
																)
															) : (
																<td className="editable">
																	{/* Render single value or multi value editable input */}
																	{field.type === "mixed_text" &&
																	field.collection?.length !== 0 ? (
																		<Field
																			name={field.id}
																			fieldInfo={field}
																			showCheck
																			component={RenderMultiField}
																		/>
																	) : (
																		<Field
																			name={field.id}
																			metadataField={field}
																			showCheck
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

									{formik.dirty && (
										<>
											{/* Render buttons for updating metadata */}
											<footer>
												<button
													type="submit"
													onClick={() => formik.handleSubmit()}
													disabled={!checkValidity(formik)}
													className={cn("submit", {
														active: checkValidity(formik),
														inactive: !checkValidity(formik),
													})}
												>
													{t("SAVE")}
												</button>
												<button
													className="cancel"
													onClick={() => formik.resetForm({ values: "" })}
												>
													{t("CANCEL")}
												</button>
											</footer>

											<div className="btm-spacer" />
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</Formik>
	);
};

export default DetailsMetadataTab;
