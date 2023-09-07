import React from "react";
import { useTranslation } from "react-i18next";

/**
 * This component renders details about the configuration of a recording/capture agent
 */
const ConfigurationDetailsTab = ({
    agent
}: any) => {
	const { t } = useTranslation();

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="full-col">
					{/* If configuration has no item show corresponding message */}
					{agent.configuration.length > 0 ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj tbl-details">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<span>
									{t("RECORDINGS.RECORDINGS.DETAILS.CONFIGURATION.CAPTION")}
								</span>
							</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<tbody>
										{/* Render table row for each configuration item*/}
// @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
										{agent.configuration.map((item, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>{item.key}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>{item.value}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
