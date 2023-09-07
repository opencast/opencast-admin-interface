import React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
	getSeriesExtendedMetadata,
	getSeriesMetadata,
	getSeriesThemes,
} from "../../../../selectors/seriesSeletctor";
// @ts-expect-error TS(6142): Module './summaryTables/MetadataSummaryTable' was ... Remove this comment to see the full error message
import MetadataSummaryTable from "./summaryTables/MetadataSummaryTable";
// @ts-expect-error TS(6142): Module './summaryTables/MetadataExtendedSummaryTab... Remove this comment to see the full error message
import MetadataExtendedSummaryTable from "./summaryTables/MetadataExtendedSummaryTable";
// @ts-expect-error TS(6142): Module './summaryTables/AccessSummaryTable' was re... Remove this comment to see the full error message
import AccessSummaryTable from "./summaryTables/AccessSummaryTable";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardNavigationBut... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="full-col">
						{/*Summary metadata*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<MetadataSummaryTable
							metadataFields={metadataSeries.fields}
							formikValues={formik.values}
							header={"EVENTS.SERIES.NEW.METADATA.CAPTION"}
						/>

						{/*Summary metadata extended*/}
						{!metaDataExtendedHidden ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<MetadataExtendedSummaryTable
								extendedMetadata={extendedMetadata}
								formikValues={formik.values}
								formikInitialValues={formik.initialValues}
								header={"EVENTS.SERIES.NEW.METADATA_EXTENDED.CAPTION"}
							/>
						) : null}

						{/*Summary access configuration*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<AccessSummaryTable
							policies={formik.values.acls}
							header={"EVENTS.SERIES.NEW.ACCESS.CAPTION"}
						/>

						{/*Summary themes*/}
						{!!formik.values.theme && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj tbl-list">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<header className="no-expand">
									{t("EVENTS.SERIES.NEW.THEME.CAPTION")}
								</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<tbody>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<td>{t("EVENTS.SERIES.NEW.THEME.CAPTION")}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
