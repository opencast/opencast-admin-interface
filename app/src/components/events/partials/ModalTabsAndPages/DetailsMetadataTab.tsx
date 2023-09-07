import React from "react";
import { useTranslation } from "react-i18next";
import { Field, Formik } from "formik";
import cn from "classnames";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import _ from "lodash";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/RenderMultiField' w... Remove this comment to see the full error message
import RenderMultiField from "../../../shared/wizard/RenderMultiField";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/RenderField' was re... Remove this comment to see the full error message
import RenderField from "../../../shared/wizard/RenderField";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { connect } from "react-redux";
import { hasAccess, isJson } from "../../../../utils/utils";
import { getMetadataCollectionFieldName } from "../../../../utils/resourceUtils";

/**
 * This component renders metadata details of a certain event or series
 */
const DetailsMetadataTab = ({
// @ts-expect-error TS(7031): Binding element 'metadataFields' implicitly has an... Remove this comment to see the full error message
	metadataFields,
// @ts-expect-error TS(7031): Binding element 'updateResource' implicitly has an... Remove this comment to see the full error message
	updateResource,
// @ts-expect-error TS(7031): Binding element 'resourceId' implicitly has an 'an... Remove this comment to see the full error message
	resourceId,
// @ts-expect-error TS(7031): Binding element 'header' implicitly has an 'any' t... Remove this comment to see the full error message
	header,
// @ts-expect-error TS(7031): Binding element 'editAccessRole' implicitly has an... Remove this comment to see the full error message
	editAccessRole,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
}) => {
	const { t } = useTranslation();

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
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
// @ts-expect-error TS(7006): Parameter 'field' implicitly has an 'any' type.
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<Formik
			enableReinitialize
			initialValues={getInitialValues()}
			onSubmit={(values) => handleSubmit(values)}
		>
			{(formik) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<Notifications context="not-corner" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="obj tbl-list">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<header className="no-expand">{t(header)}</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tbody>
												{/* Render table row for each metadata field depending on type */}
												{!!metadataFields &&
													!!metadataFields.fields &&
// @ts-expect-error TS(7006): Parameter 'field' implicitly has an 'any' type.
													metadataFields.fields.map((field, key) => (
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
																// non-editable field if readOnly is set
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
																<td className="editable">
																	{/* Render single value or multi value editable input */}
																	{field.type === "mixed_text" &&
																	field.collection.length !== 0 ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<Field
																			name={field.id}
																			fieldInfo={field}
																			showCheck
																			component={RenderMultiField}
																		/>
																	) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<>
											{/* Render buttons for updating metadata */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<footer style={{ padding: "15px" }}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<button
													className="cancel"
													onClick={() => formik.resetForm({ values: "" })}
												>
													{t("CANCEL")}
												</button>
											</footer>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	user: getUserInformation(state),
});

export default connect(mapStateToProps)(DetailsMetadataTab);
