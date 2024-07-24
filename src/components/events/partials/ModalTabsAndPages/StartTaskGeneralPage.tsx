import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Notifications from "../../../shared/Notifications";
import cn from "classnames";
import { getSelectedRows } from "../../../../selectors/tableSelectors";
import { useSelectionChanges } from "../../../../hooks/wizardHooks";
import {
	checkValidityStartTaskEventSelection,
	isStartable,
	isTaskStartable,
} from "../../../../utils/bulkActionUtils";
import { FormikProps } from "formik";
import {
	Event,
} from "../../../../slices/eventSlice";
import { useAppSelector } from "../../../../store";

/**
 * This component renders the table overview of selected events in start task bulk action
 */
interface RequiredFormProps {
	events: Event[],
}

const StartTaskGeneralPage = <T extends RequiredFormProps>({
	formik,
	nextPage,
}: {
	formik: FormikProps<T>,
	nextPage: (values: T) => void,
}) => {
	const { t } = useTranslation();

	const selectedRows = useAppSelector(state => getSelectedRows(state));

	const {
		selectedEvents,
		allChecked,
		onChangeSelected,
		onChangeAllSelected,
		// @ts-expect-error TS(7006):
	} = useSelectionChanges(formik, selectedRows);

	useEffect(() => {
		// Set field value for formik on mount, because initially all events are selected
		if (formik.values.events.length === 0) {
			formik.setFieldValue("events", selectedEvents);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className="modal-content active">
				<div className="modal-body">
					<div className="row">
						{/* Show only if task not startable */}
						{!isTaskStartable(selectedEvents) && (
							<div className="alert sticky warning">
								<p>{t("BULK_ACTIONS.SCHEDULE_TASK.GENERAL.CANNOTSTART")}</p>
							</div>
						)}
						<Notifications context="not_corner" />
					</div>
					<div className="full-col">
						<div className="obj tbl-list">
							<header>
								{t("BULK_ACTIONS.SCHEDULE_TASK.GENERAL.CAPTION")}
								<span className="header-value">
									{t("BULK_ACTIONS.SCHEDULE_TASK.GENERAL.SUMMARY", {
										count: selectedEvents.filter((e) => e.selected === true)
											.length,
									})}
								</span>
							</header>
							<div className="obj-container">
								<table className="main-tbl">
									<thead>
										<tr>
											<th className="small">
												<input
													className="select-all-cbox"
													type="checkbox"
													checked={allChecked}
													onChange={(e) => onChangeAllSelected(e)}
												/>
											</th>
											<th className="full-width">
												{t("EVENTS.EVENTS.TABLE.TITLE")}
											</th>
											<th className="nowrap">
												{t("EVENTS.EVENTS.TABLE.SERIES")}
											</th>
											<th className="nowrap">
												{t("EVENTS.EVENTS.TABLE.STATUS")}
											</th>
										</tr>
									</thead>
									<tbody>
										{/* Repeat for each event chosen */}
										{selectedEvents.map((event, key) => (
											<tr
												key={key}
												className={cn({ error: !isStartable(event) })}
											>
												<td>
													<input
														name="events"
														type="checkbox"
														onChange={(e) => onChangeSelected(e, event.id)}
														checked={event.selected}
													/>
												</td>
												<td>{event.title}</td>
												<td className="nowrap">
													{event.series ? event.series.title : ""}
												</td>
												<td className="nowrap">{t(event.event_status)}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Button for navigation to next page and previous page */}
			<footer>
				<button
					type="submit"
					className={cn("submit", {
						active: checkValidityStartTaskEventSelection(formik.values),
						inactive: !checkValidityStartTaskEventSelection(formik.values),
					})}
					disabled={!checkValidityStartTaskEventSelection(formik.values)}
					onClick={() => {
						nextPage(formik.values);
					}}
					tabIndex={100}
				>
					{t("WIZARD.NEXT_STEP")}
				</button>
			</footer>

			<div className="btm-spacer" />
		</>
	);
};

export default StartTaskGeneralPage;
