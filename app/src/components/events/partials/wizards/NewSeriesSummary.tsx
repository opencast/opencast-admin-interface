import React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
	getSeriesExtendedMetadata,
	getSeriesMetadata,
	getSeriesThemes,
} from "../../../../selectors/seriesSeletctor";
import MetadataSummaryTable from "./summaryTables/MetadataSummaryTable";
import MetadataExtendedSummaryTable from "./summaryTables/MetadataExtendedSummaryTable";
import AccessSummaryTable from "./summaryTables/AccessSummaryTable";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";

/**
 * This component renders the summary page for new series in the new series wizard.
 */
const NewSeriesSummary = ({
// @ts-expect-error TS(7031): Binding element 'formik' implicitly has an 'any' t... Remove this comment to see the full error message
	formik,
// @ts-expect-error TS(7031): Binding element 'previousPage' implicitly has an '... Remove this comment to see the full error message
	previousPage,
// @ts-expect-error TS(7031): Binding element 'metaDataExtendedHidden' implicitl... Remove this comment to see the full error message
	metaDataExtendedHidden,
// @ts-expect-error TS(7031): Binding element 'metadataSeries' implicitly has an... Remove this comment to see the full error message
	metadataSeries,
// @ts-expect-error TS(7031): Binding element 'extendedMetadata' implicitly has ... Remove this comment to see the full error message
	extendedMetadata,
// @ts-expect-error TS(7031): Binding element 'seriesThemes' implicitly has an '... Remove this comment to see the full error message
	seriesThemes,
}) => {
	const { t } = useTranslation();

	// Get additional information about chosen series theme
// @ts-expect-error TS(7006): Parameter 'theme' implicitly has an 'any' type.
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
											<td>{theme.name}</td>
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

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	metadataSeries: getSeriesMetadata(state),
	extendedMetadata: getSeriesExtendedMetadata(state),
	seriesThemes: getSeriesThemes(state),
});

export default connect(mapStateToProps)(NewSeriesSummary);
