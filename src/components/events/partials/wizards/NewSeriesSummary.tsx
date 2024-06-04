import React from "react";
import { useTranslation } from "react-i18next";
import {
	getSeriesExtendedMetadata,
	getSeriesMetadata,
	getSeriesThemes,
} from "../../../../selectors/seriesSeletctor";
import MetadataSummaryTable from "./summaryTables/MetadataSummaryTable";
import MetadataExtendedSummaryTable from "./summaryTables/MetadataExtendedSummaryTable";
import AccessSummaryTable from "./summaryTables/AccessSummaryTable";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import { useAppSelector } from "../../../../store";
import { FormikProps } from "formik";
import { TransformedAcl } from "../../../../slices/aclDetailsSlice";

/**
 * This component renders the summary page for new series in the new series wizard.
 */
interface RequiredFormProps {
	theme: string,
	acls: TransformedAcl[],
}

const NewSeriesSummary = <T extends RequiredFormProps>({
	formik,
	previousPage,
	metaDataExtendedHidden,
}: {
	formik: FormikProps<T>,
	previousPage: (values: T, twoPagesBack?: boolean) => void,
	metaDataExtendedHidden: boolean,
}) => {
	const { t } = useTranslation();

	const metadataSeries = useAppSelector(state => getSeriesMetadata(state));
	const extendedMetadata = useAppSelector(state => getSeriesExtendedMetadata(state));
	const seriesThemes = useAppSelector(state => getSeriesThemes(state));

	// Get additional information about chosen series theme
	const theme = seriesThemes.find((theme) => theme.id === formik.values.theme);

	return (
		<>
			<div className="modal-content">
				<div className="modal-body">
					<div className="full-col">
						{/*Summary metadata*/}
						<MetadataSummaryTable
							metadataFields={metadataSeries.fields}
							formikValues={formik.values}
							header={"EVENTS.SERIES.NEW.METADATA.CAPTION"}
						/>

						{/*Summary metadata extended*/}
						{!metaDataExtendedHidden ? (
							<MetadataExtendedSummaryTable
								extendedMetadata={extendedMetadata}
								formikValues={formik.values}
								formikInitialValues={formik.initialValues}
								header={"EVENTS.SERIES.NEW.METADATA_EXTENDED.CAPTION"}
							/>
						) : null}

						{/*Summary access configuration*/}
						<AccessSummaryTable
							policies={formik.values.acls}
							header={"EVENTS.SERIES.NEW.ACCESS.CAPTION"}
						/>

						{/*Summary themes*/}
						{!!formik.values.theme && (
							<div className="obj tbl-list">
								<header className="no-expand">
									{t("EVENTS.SERIES.NEW.THEME.CAPTION")}
								</header>
								<table className="main-tbl">
									<tbody>
										<tr>
											<td>{t("EVENTS.SERIES.NEW.THEME.CAPTION")}</td>
											<td>{theme?.name}</td>
										</tr>
									</tbody>
								</table>
							</div>
						)}

						{/*Summary Tobira*/}
						{!!formik.values.selectedPage && (
							<div className="obj tbl-list">
								<header className="no-expand">
									{t("EVENTS.SERIES.NEW.TOBIRA.CAPTION")}
								</header>
								<table className="main-tbl">
									<tbody>
										<tr>
											<td>{t("EVENTS.SERIES.NEW.TOBIRA.PATH_SEGMENT")}</td>
											<td>{formik.values.selectedPage?.path}</td>
										</tr>
									</tbody>
								</table>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Button for navigation to next page and previous page */}
			<WizardNavigationButtons
				isLast
				previousPage={previousPage}
				formik={formik}
			/>
		</>
	);
};

export default NewSeriesSummary;
