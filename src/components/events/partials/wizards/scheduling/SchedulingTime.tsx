import React from "react";
import { useTranslation } from "react-i18next";
import DropDown from "../../../../shared/DropDown";
import { hours, minutes } from "../../../../../configs/modalConfig";

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
					options={hours}
					type={"time"}
					required={true}
					handleChange={(element) => {
						if (element) {
							callbackHour(element.value)
							// TODO: Allow for ChangeMultiple for NewSourcePage
						}
					}}
					placeholder={t(hourPlaceholder)}
					disabled={disabled}
				/>

				{/* drop-down for minute */}
				<DropDown
					value={minute}
					text={minute}
					options={minutes}
					type={"time"}
					required={true}
					handleChange={(element) => {
						if (element) {
							callbackMinute(element.value)
						}
					}}
					placeholder={t(minutePlaceholder)}
					disabled={disabled}
				/>
			</td>
		</tr>
	)

};

export default SchedulingTime;