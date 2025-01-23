import React from "react";
import { useTranslation } from "react-i18next";
import { Formik, FormikProps } from "formik";
import { Field } from "../../../shared/Field";
import _ from "lodash";
import Notifications from "../../../shared/Notifications";
import RenderMultiField from "../../../shared/wizard/RenderMultiField";
import RenderField from "../../../shared/wizard/RenderField";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import {
	hasAccess,
	parseValueForBooleanStrings,
} from "../../../../utils/utils";
import { getMetadataCollectionFieldName } from "../../../../utils/resourceUtils";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { MetadataCatalog } from "../../../../slices/eventSlice";
import { AsyncThunk } from "@reduxjs/toolkit";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";

type InitialValues = {
	[key: string]: any;
}

/**
 * This component renders metadata details of a certain event or series
 */
const DetailsExtendedMetadataTab = ({
	resourceId,
	editAccessRole,
	metadata,
	updateResource,
	formikRef,
}: {
	resourceId: string,
	editAccessRole: string,
	metadata: MetadataCatalog[],
	updateResource: AsyncThunk<void, {
		id: string;
		values: { [key: string]: any; };
		catalog: MetadataCatalog;
	}, any> //(id: string, values: { [key: string]: any }, catalog: MetadataCatalog) => void,
	formikRef?: React.RefObject<FormikProps<InitialValues>>
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const user = useAppSelector(state => getUserInformation(state));

	const handleSubmit = (values: { [key: string]: any }, catalog: MetadataCatalog) => {
		dispatch(updateResource({id: resourceId, values, catalog}));
	};

	// set current values of metadata fields as initial values
	const getInitialValues = (metadataCatalog: MetadataCatalog) => {
		let initialValues: { [key: string]: any } = {};

		// Transform metadata fields and their values provided by backend (saved in redux)
		if (!!metadataCatalog.fields && metadataCatalog.fields.length > 0) {
			metadataCatalog.fields.forEach((field) => {
				let value = parseValueForBooleanStrings(field.value);
				initialValues[field.id] = value;
			});
		}

		return initialValues;
	};

	const checkValidity = (formik: FormikProps<{}>) => {
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
							metadata.map((catalog, key) => (
								// initialize form
								<Formik<InitialValues>
									enableReinitialize
									initialValues={getInitialValues(catalog)}
									onSubmit={(values) => handleSubmit(values, catalog)}
									innerRef={formikRef}
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
																			<td>{getMetadataCollectionFieldName(field, field, t)}</td>
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
													<WizardNavigationButtons
														formik={formik}
														customValidation={!checkValidity(formik)}
														previousPage={() => formik.resetForm()}
														createTranslationString="SAVE"
														cancelTranslationString="CANCEL"
														isLast
													/>

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

export default DetailsExtendedMetadataTab;
