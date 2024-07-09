import React from "react";
import { useTranslation } from "react-i18next";
import { RecordingDetails } from "../../../../slices/recordingDetailsSlice";

/**
 * This component renders details about the configuration of a recording/capture agent
 */
const ConfigurationDetailsTab: React.FC<{
	agent: RecordingDetails
}> = ({
	agent
}) => {
	const { t } = useTranslation();

	return (
		<div className="modal-content">
			<div className="modal-body">
				<div className="full-col">
					{/* If configuration has no item show corresponding message */}
					{agent.configuration.length > 0 ? (
						<div className="obj tbl-details">
							<header>
								<span>
									{t("RECORDINGS.RECORDINGS.DETAILS.CONFIGURATION.CAPTION")}
								</span>
							</header>
							<div className="obj-container">
								<table className="main-tbl">
									<tbody>
										{/* Render table row for each configuration item*/}
										{agent.configuration.map((item, key) => (
											<tr key={key}>
												<td>{item.key}</td>
												<td>{item.value}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					) : (
						<div>
							<p>
								{t(
									"RECORDINGS.RECORDINGS.DETAILS.CONFIGURATION.NO_CONFIGURATION"
								)}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ConfigurationDetailsTab;
