import React from "react";
import { useTranslation } from "react-i18next";
import { isJson } from "../../../../../utils/utils";
import { getMetadataCollectionFieldName } from "../../../../../utils/resourceUtils";

/**
 * This component renders the metadata extended table containing access rules provided by user
 * before in wizard summary pages
 */
const MetadataExtendedSummaryTable = ({
// @ts-expect-error TS(7031): Binding element 'extendedMetadata' implicitly has ... Remove this comment to see the full error message
	extendedMetadata,
// @ts-expect-error TS(7031): Binding element 'formikValues' implicitly has an '... Remove this comment to see the full error message
	formikValues,
// @ts-expect-error TS(7031): Binding element 'formikInitialValues' implicitly h... Remove this comment to see the full error message
	formikInitialValues,
// @ts-expect-error TS(7031): Binding element 'header' implicitly has an 'any' t... Remove this comment to see the full error message
	header,
}) => {
	const { t } = useTranslation();

	// extended metadata that user has provided
	const catalogs = [];
	for (const catalog of extendedMetadata) {
		const metadataFields = catalog.fields;
// @ts-expect-error TS(7034): Variable 'metadata' implicitly has type 'any[]' in... Remove this comment to see the full error message
		let metadata = [];

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
					if (
						metadataFields[i].type === "text" &&
						!!metadataFields[i].collection &&
						metadataFields[i].collection.length > 0
					) {
						fieldValue = isJson(
							getMetadataCollectionFieldName(metadataFields[i], {
								value: fieldValue,
							})
						)
							? t(
									JSON.parse(
										getMetadataCollectionFieldName(metadataFields[i], {
											value: fieldValue,
										})
									).label
							  )
							: t(
									getMetadataCollectionFieldName(metadataFields[i], {
										value: fieldValue,
									})
							  );
					}

// @ts-expect-error TS(7005): Variable 'metadata' implicitly has an 'any[]' type... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="obj tbl-list">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<header className="no-expand">{t(header)}</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="obj-container">
				{catalogs.map((catalog, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<tbody>
							{catalog.map((entry, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<td>{t(entry.label)}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
