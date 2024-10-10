import React from "react";
import { useTranslation } from "react-i18next";
import { LifeCyclePolicy } from "../../../../slices/lifeCycleSlice";
import { renderValidDate } from "../../../../utils/dateUtils";

/**
 * This component renders details about a recording/capture agent
 */
const LifeCyclePolicyGeneralTab = ({
	policy,
}: {
	policy: LifeCyclePolicy
}) => {
	const { t } = useTranslation();

	return (
		<div className="modal-content">
			<div className="modal-body">
				<div className="full-col">
					<div className="obj tbl-details">
						<header>
							<span>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.CAPTION")}</span>
						</header>
						<div className="obj-container">
							{/* Render table containing general information */}
							<table className="main-tbl">
								<tbody>
									<tr>
										<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.TITLE")}</td>
										<td>{policy.title}</td>
									</tr>
									<tr>
										<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.ISACTIVE")}</td>
										<td>{
											<input
												type="checkbox"
												checked={policy.isActive}
												readOnly={true}
											/>
										}</td>
									</tr>
									<tr>
										<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.ISCREATEDFROMCONFIG")}</td>
										<td>{
											<input
												type="checkbox"
												checked={policy.isCreatedFromConfig}
												readOnly={true}
											/>
										}</td>
									</tr>
									<tr>
										<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.TARGETTYPE")}</td>
										<td>{t(policy.targetType)}</td>
									</tr>
									<tr>
										<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.TARGETFILTERS")}</td>
										<td>
											<table className="main-tbl">
											<tbody>
											{Object.entries(policy.targetFilters).map(([key, value], index) => {
													return(
														<tr>
															<td>{key}</td>
															<td>{value.value + ", " + value.type + ", " + value.must}</td>
														</tr>
													)
												})}
											</tbody>
											</table>
										</td>
									</tr>
									<tr>
										<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.TIMING")}</td>
										<td>{t(policy.timing)}</td>
									</tr>
									<tr>
										<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.ACTIONDATE")}</td>
										<td>{t("dateFormats.dateTime.full", { dateTime: renderValidDate(policy.actionDate) })}</td>
									</tr>
									<tr>
										<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.CRONTRIGGER")}</td>
										<td>{policy.cronTrigger}</td>
									</tr>
									<tr>
										<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.ACTION")}</td>
										<td>{t(policy.action)}</td>
									</tr>
									<tr>
										<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.ACTIONPARAMETERS")}</td>
										<td>
										<table className="main-tbl">
										<tbody>
												{Object.entries(policy.actionParameters).map(([key, value], index) => {
													return(
														<tr>
															<td>{key}</td>
															<td>{value}</td>
														</tr>
													)
												})}
											</tbody>
											</table>
										</td>
									</tr>
									<tr>
										<td>{t("LIFECYCLE.POLICIES.DETAILS.GENERAL.ID")}</td>
										<td>{policy.id}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LifeCyclePolicyGeneralTab;
