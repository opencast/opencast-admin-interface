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

/**
 * This component renders the table overview of selected events in edit scheduled events bulk action
 */
const EditScheduledEventsGeneralPage = ({
// @ts-expect-error TS(7031): Binding element 'nextPage' implicitly has an 'any'... Remove this comment to see the full error message
	nextPage,
// @ts-expect-error TS(7031): Binding element 'formik' implicitly has an 'any' t... Remove this comment to see the full error message
	formik,
// @ts-expect-error TS(7031): Binding element 'selectedRows' implicitly has an '... Remove this comment to see the full error message
	selectedRows,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
}) => {
	const { t } = useTranslation();

	const [
		selectedEvents,
		allChecked,
		onChangeSelected,
		onChangeAllSelected,
	] = useSelectionChanges(formik, selectedRows);

	useEffect(() => {
		// Set field value for formik on mount, because initially all events are selected
		if (formik.values.events.length === 0) {
			formik.setFieldValue("events", selectedEvents);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-content active">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="row">
						{/* Show only if non-scheduled event is selected*/}
						{!isAllScheduleEditable(selectedEvents) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="alert sticky warning">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<p>{t("BULK_ACTIONS.EDIT_EVENTS.GENERAL.CANNOTSTART")}</p>
							</div>
						)}
						{/* Show only if user doesn't have access to all agents*/}
						{!isAllAgentAccess(selectedEvents, user) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="alert sticky info">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<p>
									{t("BULK_ACTIONS.EDIT_EVENTS.GENERAL.CANNOTEDITSCHEDULE")}
								</p>
							</div>
						)}
					</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj tbl-list">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<header>{t("BULK_ACTIONS.EDIT_EVENTS.GENERAL.CAPTION")}</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<th className="small">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<input
													type="checkbox"
													className="select-all-cbox"
													checked={allChecked}
													onChange={(e) => onChangeAllSelected(e)}
												/>
											</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<th className="full-width">
												{t("EVENTS.EVENTS.TABLE.TITLE")}
											</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<th className="nowrap">
												{t("EVENTS.EVENTS.TABLE.SERIES")}
											</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<th className="nowrap">
												{t("EVENTS.EVENTS.TABLE.STATUS")}
											</th>
										</tr>
									</thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<tbody>
										{/* Repeat for each selected event */}
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
										{selectedEvents.map((event, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr
												key={key}
												className={cn(
													{ error: !isScheduleEditable(event) },
													{ info: !isAgentAccess(event, user) }
												)}
											>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<input
														type="checkbox"
														name="events"
														onChange={(e) => onChangeSelected(e, event.id)}
														checked={event.selected}
													/>
												</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>{event.title}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td className="nowrap">
													{event.series ? event.series.title : ""}
												</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<footer>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'number'.
					tabIndex="100"
				>
					{t("WIZARD.NEXT_STEP")}
				</button>
			</footer>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="btm-spacer" />
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	selectedRows: getSelectedRows(state),
	user: getUserInformation(state),
});

export default connect(mapStateToProps)(EditScheduledEventsGeneralPage);
