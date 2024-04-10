import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { getSelectedRows } from "../../../../selectors/tableSelectors";
import { connect } from "react-redux";
import { useSelectionChanges } from "../../../../hooks/wizardHooks";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import {
	checkValidityUpdateScheduleEventSelection,
	isAgentAccess,
	isAllAgentAccess,
	isAllScheduleEditable,
	isScheduleEditable,
} from "../../../../utils/bulkActionUtils";
import { useAppSelector } from "../../../../store";
import { FormikProps } from "formik";
import { Event } from "../../../../slices/eventSlice";

/**
 * This component renders the table overview of selected events in edit scheduled events bulk action
 */
interface RequiredFormProps {
	events: Event[],
}

const EditScheduledEventsGeneralPage = <T extends RequiredFormProps>({
	nextPage,
	formik,
// @ts-expect-error TS(7031): Binding element 'selectedRows' implicitly has an '... Remove this comment to see the full error message
	selectedRows,
}: {
	formik: FormikProps<T>,
	nextPage: (values: T) => void,
}) => {
	const { t } = useTranslation();

	const user = useAppSelector(state => getUserInformation(state));

	const {
		selectedEvents,
		allChecked,
		onChangeSelected,
		onChangeAllSelected,
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
						{/* Show only if non-scheduled event is selected*/}
						{!isAllScheduleEditable(selectedEvents) && (
							<div className="alert sticky warning">
								<p>{t("BULK_ACTIONS.EDIT_EVENTS.GENERAL.CANNOTSTART")}</p>
							</div>
						)}
						{/* Show only if user doesn't have access to all agents*/}
						{!isAllAgentAccess(selectedEvents, user) && (
							<div className="alert sticky info">
								<p>
									{t("BULK_ACTIONS.EDIT_EVENTS.GENERAL.CANNOTEDITSCHEDULE")}
								</p>
							</div>
						)}
					</div>
					<div className="full-col">
						<div className="obj tbl-list">
							<header>{t("BULK_ACTIONS.EDIT_EVENTS.GENERAL.CAPTION")}</header>
							<div className="obj-container">
								<table className="main-tbl">
									<thead>
										<tr>
											<th className="small">
												<input
													type="checkbox"
													className="select-all-cbox"
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
										{/* Repeat for each selected event */}
										{selectedEvents.map((event, key) => (
											<tr
												key={key}
												className={cn(
													{ error: !isScheduleEditable(event) },
													{ info: !isAgentAccess(event, user) }
												)}
											>
												<td>
													<input
														type="checkbox"
														name="events"
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

			{/* Button for navigation to next page */}
			<footer>
				<button
					type="submit"
					className={cn("submit", {
						active: checkValidityUpdateScheduleEventSelection(
							formik.values,
							user
						),
						inactive: !checkValidityUpdateScheduleEventSelection(
							formik.values,
							user
						),
					})}
					disabled={
						!checkValidityUpdateScheduleEventSelection(formik.values, user)
					}
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

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	selectedRows: getSelectedRows(state),
});

export default connect(mapStateToProps)(EditScheduledEventsGeneralPage);
