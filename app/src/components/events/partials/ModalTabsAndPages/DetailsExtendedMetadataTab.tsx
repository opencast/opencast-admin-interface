import React from "react";
import { useTranslation } from "react-i18next";
import { Field, Formik } from "formik";
import cn from "classnames";
import _ from "lodash";
import Notifications from "../../../shared/Notifications";
import RenderMultiField from "../../../shared/wizard/RenderMultiField";
import RenderField from "../../../shared/wizard/RenderField";
import { connect } from "react-redux";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import {
	hasAccess,
	isJson,
	parseValueForBooleanStrings,
} from "../../../../utils/utils";
import { getMetadataCollectionFieldName } from "../../../../utils/resourceUtils";

/**
 * This component renders metadata details of a certain event or series
 */
const DetailsExtendedMetadataTab = ({
// @ts-expect-error TS(7031): Binding element 'resourceId' implicitly has an 'an... Remove this comment to see the full error message
	resourceId,
// @ts-expect-error TS(7031): Binding element 'editAccessRole' implicitly has an... Remove this comment to see the full error message
	editAccessRole,
// @ts-expect-error TS(7031): Binding element 'metadata' implicitly has an 'any'... Remove this comment to see the full error message
	metadata,
// @ts-expect-error TS(7031): Binding element 'updateResource' implicitly has an... Remove this comment to see the full error message
	updateResource,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
}) => {
	const { t } = useTranslation();

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values, catalog) => {
		updateResource(resourceId, values, catalog);
	};

	// set current values of metadata fields as initial values
// @ts-expect-error TS(7006): Parameter 'metadataCatalog' implicitly has an 'any... Remove this comment to see the full error message
	const getInitialValues = (metadataCatalog) => {
		let initialValues = {};

		// Transform metadata fields and their values provided by backend (saved in redux)
		if (!!metadataCatalog.fields && metadataCatalog.fields.length > 0) {
// @ts-expect-error TS(7006): Parameter 'field' implicitly has an 'any' type.
			metadataCatalog.fields.forEach((field) => {
				let value = parseValueForBooleanStrings(field.value);
// @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
				initialValues[field.id] = value;
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
		<div className="modal-content">
			<div className="modal-body">
				{/* Notifications */}
				<Notifications context="not_corner" />

				<div className="full-col">
					{
						//iterate through metadata catalogs
						!!metadata &&
							metadata.length > 0 &&
// @ts-expect-error TS(7006): Parameter 'catalog' implicitly has an 'any' type.
							metadata.map((catalog, key) => (
								// initialize form
								<Formik
									enableReinitialize
									initialValues={getInitialValues(catalog)}
									onSubmit={(values) => handleSubmit(values, catalog)}
								>
									{(formik) => (
										/* Render table for each metadata catalog */
										<div className="obj tbl-details" key={key}>
											<header>
												<span>{t(catalog.title)}</span>
											</header>
											<div className="obj-container">
												<table className="main-tbl">
													<tbody>
														{/* Render table row for each metadata field depending on type */}
														{!!catalog.fields &&
// @ts-expect-error TS(7006): Parameter 'field' implicitly has an 'any' type.
															catalog.fields.map((field, index) => (
																<tr key={index}>
																	<td>
																		<span>{t(field.label)}</span>
																		{field.required && (
																			<i className="required">*</i>
																		)}
																	</td>
																	{field.readOnly ||
																	!hasAccess(editAccessRole, user) ? (
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
													<footer style={{ padding: "15px" }}>
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
									)}
								</Formik>
							))
					}
				</div>
			</div>
		</div>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	user: getUserInformation(state),
});

export default connect(mapStateToProps)(DetailsExtendedMetadataTab);
