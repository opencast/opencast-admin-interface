import React from "react";
import { useTranslation } from "react-i18next";

/**
 * This component renders details about the capabilities of a recording/capture agent
 */
const CapabilitiesDetailsTab = ({
    agent
}: any) => {
	const { t } = useTranslation();

	return (
		<div className="modal-content">
			<div className="modal-body">
				<div className="full-col">
					{/* If capabilities has no item show corresponding message */}
					{agent.capabilities.length > 0 ? (
						<div className="obj tbl-details">
							<header>
								<span>
									{t("RECORDINGS.RECORDINGS.DETAILS.CAPABILITIES.CAPTION")}
								</span>
							</header>
							<div className="obj-container">
								<table className="main-tbl">
									<tbody>
										{/* Render table row for each capability item*/}
{/* @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type. */}
										{agent.capabilities.map((item, key) => (
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
									"RECORDINGS.RECORDINGS.DETAILS.CAPABILITIES.NO_CAPABILITIES"
								)}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CapabilitiesDetailsTab;
