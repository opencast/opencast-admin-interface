import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module '../../../shared/Notifications' was resolve... Remove this comment to see the full error message
import Notifications from "../../../shared/Notifications";
import { connect } from "react-redux";
import cn from "classnames";
import { getSelectedRows } from "../../../../selectors/tableSelectors";
import { useSelectionChanges } from "../../../../hooks/wizardHooks";
import {
	checkValidityStartTaskEventSelection,
	isStartable,
	isTaskStartable,
} from "../../../../utils/bulkActionUtils";

/**
 * This component renders the table overview of selected events in start task bulk action
 */
// @ts-expect-error TS(7031): Binding element 'formik' implicitly has an 'any' t... Remove this comment to see the full error message
const StartTaskGeneralPage = ({ formik, nextPage, selectedRows }) => {
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
						{/* Show only if task not startable */}
						{!isTaskStartable(selectedEvents) && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="alert sticky warning">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<p>{t("BULK_ACTIONS.SCHEDULE_TASK.GENERAL.CANNOTSTART")}</p>
							</div>
						)}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<Notifications context="not_corner" />
					</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="obj tbl-list">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<header>
								{t("BULK_ACTIONS.SCHEDULE_TASK.GENERAL.CAPTION")}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<span className="header-value">
									{t("BULK_ACTIONS.SCHEDULE_TASK.GENERAL.SUMMARY", {
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
										count: selectedEvents.filter((e) => e.selected === true)
											.length,
									})}
								</span>
							</header>
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
													className="select-all-cbox"
													type="checkbox"
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
										{/* Repeat for each event chosen */}
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
										{selectedEvents.map((event, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tr
												key={key}
												className={cn({ error: !isStartable(event) })}
											>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<input
														name="events"
														type="checkbox"
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

			{/* Button for navigation to next page and previous page */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<footer>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
});

export default connect(mapStateToProps)(StartTaskGeneralPage);
