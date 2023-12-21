import React from "react";
import { useTranslation } from "react-i18next";
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import { getWorkflowDef } from "../../../../selectors/workflowSelectors";
import { useAppSelector } from "../../../../store";

/**
 * This component renders the summary page of the start task bulk action
 */
const StartTaskSummaryPage: React.FC<{
	formik: any	//TODO: Add type
	previousPage: any	//TODO: Add type
}> = ({
	formik,
	previousPage,
}) => {
	const { t } = useTranslation();

	const workflowDef = useAppSelector(state => getWorkflowDef(state));

	return (
		<>
			<div className="modal-content active">
				<div className="modal-body">
					<div className="full-col">
						<div className="obj list-obj">
							<header>{t("BULK_ACTIONS.SCHEDULE_TASK.SUMMARY.CAPTION")}</header>
							<div className="obj-container">
								{/* List configuration for task to be started */}
								<ul>
									<li>
										<span>
											{t("BULK_ACTIONS.SCHEDULE_TASK.SUMMARY.EVENTS")}
										</span>
										<p>
											{t("BULK_ACTIONS.SCHEDULE_TASK.SUMMARY.EVENTS_SUMMARY", {
												numberOfEvents: formik.values.events.filter(
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
													(e) => e.selected === true
												).length,
											})}
										</p>
									</li>
									<li>
										<span>
											{t("BULK_ACTIONS.SCHEDULE_TASK.SUMMARY.WORKFLOW")}
										</span>
										<p>
											{
												workflowDef.find(
													(workflow) =>
														formik.values.processingWorkflow === workflow.id
												)?.title ?? ""
												}
										</p>
									</li>
									<li>
										<span>
											{t("BULK_ACTIONS.SCHEDULE_TASK.SUMMARY.CONFIGURATION")}
										</span>
										{Object.keys(formik.values.configuration).map(
											(config, key) => (
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
			<WizardNavigationButtons
				isLast
				previousPage={previousPage}
				formik={formik}
			/>
		</>
	);
};

export default StartTaskSummaryPage;
