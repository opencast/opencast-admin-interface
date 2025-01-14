import React from "react";
import { useTranslation } from "react-i18next";
import { FormikProps } from "formik";
import { Field } from "../../../shared/Field";
import RenderField from "../../../shared/wizard/RenderField";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import RenderMultiField from "../../../shared/wizard/RenderMultiField";
import { MetadataCatalog } from "../../../../slices/eventSlice";
import ModalContentTable from "../../../shared/modals/ModalContentTable";

/**
 * This component renders the metadata page for new events and series in the wizards.
 */
const NewMetadataPage = <T,>({
	formik,
	nextPage,
	metadataFields,
	header
}: {
	formik: FormikProps<T>,
	nextPage: (values: T) => void,
	metadataFields: MetadataCatalog,
	header: string
}) => {
	const { t } = useTranslation();

	return (
		<>
			<ModalContentTable>
				<div className="obj tbl-list">
					<header className="no-expand">{t(header)}</header>
					{/* Table view containing input fields for metadata */}
					<div className="obj-container">
						<table className="main-tbl">
							<tbody>
								{/* Render table row for each metadata field depending on type*/}
								{!!metadataFields.fields &&
									metadataFields.fields.map((field, key) => (
										<tr key={key}>
											<td>
												<span>{t(field.label)}</span>
												{field.required ? (
													<i className="required">*</i>
												) : null}
											</td>
											<td className="editable ng-isolated-scope">
												{/* Render single value or multi value input */}
												{field.type === "mixed_text" &&
												field.collection?.length !== 0 ? (
													<Field
														name={field.id}
														fieldInfo={field}
														component={RenderMultiField}
													/>
												) : (
													<Field
														name={field.id}
														metadataField={field}
														isFirstField={key === 0}
														component={RenderField}
													/>
												)}
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</ModalContentTable>

			{/* Button for navigation to next page */}
			<WizardNavigationButtons isFirst formik={formik} nextPage={nextPage} />
		</>
	);
};

export default NewMetadataPage;
