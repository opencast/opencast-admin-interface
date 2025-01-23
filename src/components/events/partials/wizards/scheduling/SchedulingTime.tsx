import React from "react";
import { useTranslation } from "react-i18next";
import DropDown from "../../../../shared/DropDown";
import { hours, minutes } from "../../../../../configs/modalConfig";
import { formatTimeForDropdown } from "../../../../../utils/dropDownUtils";

const SchedulingTime = ({
	hour,
	minute,
	disabled,
	title,
	hourPlaceholder,
	minutePlaceholder,
	callbackHour,
	callbackMinute
}: {
	hour: string,
	minute: string,
	disabled: boolean
	title: string
	hourPlaceholder: string
	minutePlaceholder: string
	callbackHour: (value: string) => void
	callbackMinute: (value: string) => void
}) => {
	const { t } = useTranslation();

	return (
		<tr>
			<td>
				{t(title)}{" "}
				<i className="required">*</i>
			</td>
			<td className="editable ng-isolated-scope">
				{/* drop-down for hour */}
				<DropDown
					value={hour}
					text={hour}
					options={formatTimeForDropdown(hours)}
					required={true}
					handleChange={(element) => {
						if (element) {
							callbackHour(element.value)
							// TODO: Allow for ChangeMultiple for NewSourcePage
						}
					}}
					placeholder={t(hourPlaceholder)}
					disabled={disabled}
					customCSS={{width: 70}}
				/>

				{/* drop-down for minute */}
				<DropDown
					value={minute}
					text={minute}
					options={formatTimeForDropdown(minutes)}
					required={true}
					handleChange={(element) => {
						if (element) {
							callbackMinute(element.value)
						}
					}}
					placeholder={t(minutePlaceholder)}
					disabled={disabled}
					customCSS={{width: 70}}
				/>
			</td>
		</tr>
	)

};

export default SchedulingTime;