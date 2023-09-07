import React from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardNavigationBut... Remove this comment to see the full error message
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import { getWorkflowDef } from "../../../../selectors/workflowSelectors";
import { connect } from "react-redux";

/**
 * This component renders the summary page of the start task bulk action
 */
const StartTaskSummaryPage = ({
    formik,
    previousPage,
    workflowDef
}: any) => {
	const { t } = useTranslation();

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-content active">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj list-obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<header>{t("BULK_ACTIONS.SCHEDULE_TASK.SUMMARY.CAPTION")}</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj-container">
								{/* List configuration for task to be started */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<ul>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<span>
											{t("BULK_ACTIONS.SCHEDULE_TASK.SUMMARY.EVENTS")}
										</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<p>
											{t("BULK_ACTIONS.SCHEDULE_TASK.SUMMARY.EVENTS_SUMMARY", {
												numberOfEvents: formik.values.events.filter(
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
													(e) => e.selected === true
												).length,
											})}
										</p>
									</li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<span>
											{t("BULK_ACTIONS.SCHEDULE_TASK.SUMMARY.WORKFLOW")}
										</span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<p>
											{!!workflowDef.find(
// @ts-expect-error TS(7006): Parameter 'workflowDef' implicitly has an 'any' ty... Remove this comment to see the full error message
												(workflowDef) =>
													workflowDef.id === formik.values.workflow
											)
												? workflowDef.find(
// @ts-expect-error TS(7006): Parameter 'workflowDef' implicitly has an 'any' ty... Remove this comment to see the full error message
														(workflowDef) =>
															workflowDef.id === formik.values.workflow
												  ).title
												: ""}
										</p>
									</li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<span>
											{t("BULK_ACTIONS.SCHEDULE_TASK.SUMMARY.CONFIGURATION")}
										</span>
										{Object.keys(formik.values.configuration).map(
											(config, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<p>
													{config} :{" "}
													{formik.values.configuration[config].toString()}
												</p>
											)
										)}
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Navigation buttons */}
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
	workflowDef: getWorkflowDef(state),
});

export default connect(mapStateToProps, null)(StartTaskSummaryPage);
