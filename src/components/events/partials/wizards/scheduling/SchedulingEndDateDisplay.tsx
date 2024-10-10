import React from "react";
import { getCurrentLanguageInformation } from "../../../../../utils/utils";

const SchedulingEndDateDisplay = ({
	scheduleEndDate
}: {
	scheduleEndDate: string
}) => {
		// Get info about the current language and its date locale
		const currentLanguage = getCurrentLanguageInformation();

	return (
		<tr>
			<td></td>
			<td className="editable ng-isolated-scope">
				<span style={{ marginLeft: "10px" }}>
					{new Date(
						scheduleEndDate
					).toLocaleDateString(
						currentLanguage ? currentLanguage.dateLocale.code : undefined
					)}
				</span>
			</td>
		</tr>
	)
};

export default SchedulingEndDateDisplay;