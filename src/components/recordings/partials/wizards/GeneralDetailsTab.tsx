import React from "react";
import { useTranslation } from "react-i18next";
import { RecordingDetails } from "../../../../slices/recordingDetailsSlice";

/**
 * This component renders details about a recording/capture agent
 */
const GeneralDetailsTab: React.FC<{
	agent: RecordingDetails
}> = ({
	agent
}) => {
	const { t } = useTranslation();

	return (
		<div className="modal-content">
			<div className="modal-body">
				<div className="full-col">
					<div className="obj tbl-details">
						<header>
							<span>{t("RECORDINGS.RECORDINGS.DETAILS.GENERAL.CAPTION")}</span>
						</header>
						<div className="obj-container">
							{/* Render table containing general information */}
							<table className="main-tbl">
								<tbody>
									<tr>
										<td>{t("RECORDINGS.RECORDINGS.DETAILS.GENERAL.NAME")}</td>
										<td>{agent.name}</td>
									</tr>
									<tr>
										<td>{t("RECORDINGS.RECORDINGS.DETAILS.GENERAL.URL")}</td>
										<td>
											<a href={agent.url} target="_blank" rel="noreferrer">
												{agent.url}
											</a>
										</td>
									</tr>
									<tr>
										<td>{t("RECORDINGS.RECORDINGS.DETAILS.GENERAL.STATUS")}</td>
										<td>{t(agent.status)}</td>
									</tr>
									<tr>
										<td>{t("RECORDINGS.RECORDINGS.DETAILS.GENERAL.UPDATE")}</td>
										<td>{agent.update}</td>
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

export default GeneralDetailsTab;
