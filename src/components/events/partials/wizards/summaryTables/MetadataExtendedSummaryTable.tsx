import React from "react";
import { useTranslation } from "react-i18next";
import { getMetadataCollectionFieldName } from "../../../../../utils/resourceUtils";
import { MetadataCatalog } from "../../../../../slices/eventSlice";

/**
 * This component renders the metadata extended table containing access rules provided by user
 * before in wizard summary pages
 */
const MetadataExtendedSummaryTable = ({
	extendedMetadata,
	formikValues,
	formikInitialValues,
	header,
}: {
	extendedMetadata: MetadataCatalog[],
	formikValues: { [key: string]: string | string[] | boolean },
	formikInitialValues: { [key: string]: string | string[] | boolean },
	header: string,
}) => {
	const { t } = useTranslation();

	// extended metadata that user has provided
	const catalogs = [];
	for (const catalog of extendedMetadata) {
		const metadataFields = catalog.fields;
		let metadata: {
			name: string,
			label: string,
			value: unknown,
		}[] = [];

		for (let i = 0; metadataFields.length > i; i++) {
			let fieldValue =
				formikValues[catalog.flavor + "_" + metadataFields[i].id];
			let initialValue =
				formikInitialValues[catalog.flavor + "_" + metadataFields[i].id];

			if (fieldValue !== initialValue) {
				if (fieldValue === true) {
					fieldValue = "true";
				} else if (fieldValue === false) {
					fieldValue = "false";
				}

				if (!!fieldValue && fieldValue.length > 0) {
					const collection = metadataFields[i].collection;
					if (
						metadataFields[i].type === "text" &&
						!!collection && collection.length > 0
					) {
						fieldValue = getMetadataCollectionFieldName(
							metadataFields[i],
							{
								value: fieldValue,
							},
							t
						);
					}

					metadata = metadata.concat({
						name: catalog.flavor + "_" + metadataFields[i].id,
						label: metadataFields[i].label,
						value: fieldValue,
					});
				}
			}
		}
		catalogs.push(metadata);
	}

	return (
		<div className="obj tbl-list">
			<header className="no-expand">{t(header)}</header>
			<div className="obj-container">
				{catalogs.map((catalog, key) => (
					<table key={key} className="main-tbl">
						<tbody>
							{catalog.map((entry, key) => (
								<tr key={key}>
									<td>{t(entry.label)}</td>
									<td>
										{Array.isArray(entry.value)
											? entry.value.join(", ")
											: entry.value}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				))}
			</div>
		</div>
	);
};

export default MetadataExtendedSummaryTable;
