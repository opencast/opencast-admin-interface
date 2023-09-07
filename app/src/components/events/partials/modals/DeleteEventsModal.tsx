import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { deleteMultipleEvent } from "../../../../thunks/eventThunks";
import { getSelectedRows } from "../../../../selectors/tableSelectors";
import { connect } from "react-redux";

/**
 * This component manages the delete bulk action
 */
const DeleteEventsModal = ({
    close,
    selectedRows,
    deleteMultipleEvent
}: any) => {
	const { t } = useTranslation();

	const [allChecked, setAllChecked] = useState(true);
	const [selectedEvents, setSelectedEvents] = useState(selectedRows);

	const deleteSelectedEvents = () => {
		deleteMultipleEvent(selectedEvents);
		close();
	};

	// Select or deselect all rows in table
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const onChangeAllSelected = (e) => {
		const selected = e.target.checked;
		setAllChecked(selected);
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
		let changedSelection = selectedEvents.map((event) => {
			return {
				...event,
				selected: selected,
			};
		});
		setSelectedEvents(changedSelection);
	};

	// Handle change of checkboxes indicating which events to consider further
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const onChangeSelected = (e, id) => {
		const selected = e.target.checked;
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
		let changedEvents = selectedEvents.map((event) => {
			if (event.id === id) {
				return {
					...event,
					selected: selected,
				};
			} else {
				return event;
			}
		});
		setSelectedEvents(changedEvents);

		if (!selected) {
			setAllChecked(false);
		}
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
		if (changedEvents.every((event) => event.selected === true)) {
			setAllChecked(true);
		}
	};
	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-animation modal-overlay" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<section
				className="modal active modal-open"
				id="delete-events-status-modal"
				style={{ display: "block" }}
			>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button onClick={close} className="button-like-anchor fa fa-times close-modal" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h2>{t("BULK_ACTIONS.DELETE.EVENTS.CAPTION")}</h2>
				</header>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="modal-content active">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="list-obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="modal-alert danger obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<p>{t("BULK_ACTIONS.DELETE_EVENTS_WARNING_LINE1")}</p>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<p>{t("BULK_ACTIONS.DELETE_EVENTS_WARNING_LINE2")}</p>
								</div>
								{/*todo: only show if scheduling Authorized*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<p>{t("BULK_ACTIONS.DELETE.EVENTS.UNAUTHORIZED")}</p>
								</div>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<header>
											{t("BULK_ACTIONS.DELETE.EVENTS.DELETE_EVENTS")}
										</header>
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
															checked={allChecked}
															onChange={(e) => onChangeAllSelected(e)}
															className="select-all-cbox"
														/>
													</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<th>{t("EVENTS.EVENTS.TABLE.TITLE")}</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<th>{t("EVENTS.EVENTS.TABLE.PRESENTERS")}</th>
												</tr>
											</thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tbody>
												{/* Repeat for each marked event*/}
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
												{selectedEvents.map((event, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<input
																className="child-cbox"
																name="selection"
																type="checkbox"
																checked={event.selected}
																onChange={(e) => onChangeSelected(e, event.id)}
															/>
														</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td>{event.title}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td>
															{/* Repeat for each presenter*/}
// @ts-expect-error TS(7006): Parameter 'presenter' implicitly has an 'any' type... Remove this comment to see the full error message
															{event.presenters.map((presenter, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<span className="metadata-entry" key={key}>
																	{presenter}
																</span>
															))}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<footer>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button
						onClick={() => deleteSelectedEvents()}
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
						disabled={!selectedEvents.some((event) => event.selected === true)}
						className={cn("danger", {
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
							active: selectedEvents.some((event) => event.selected === true),
							inactive: !selectedEvents.some(
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
								(event) => event.selected === true
							),
						})}
					>
						{t("WIZARD.DELETE")}
					</button>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button onClick={() => close()} className="cancel">
						{t("CANCEL")}
					</button>
				</footer>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="btm-spacer" />
			</section>
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	selectedRows: getSelectedRows(state),
});

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'selectedEvents' implicitly has an 'any'... Remove this comment to see the full error message
	deleteMultipleEvent: (selectedEvents) =>
		dispatch(deleteMultipleEvent(selectedEvents)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteEventsModal);
