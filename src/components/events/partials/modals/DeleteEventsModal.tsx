import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { getSelectedRows } from "../../../../selectors/tableSelectors";
import { connect } from "react-redux";
import { useAppDispatch } from "../../../../store";
import { deleteMultipleEvent } from "../../../../slices/eventSlice";

/**
 * This component manages the delete bulk action
 */
const DeleteEventsModal = ({
    close,
    selectedRows,
}: any) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [allChecked, setAllChecked] = useState(true);
	const [selectedEvents, setSelectedEvents] = useState(selectedRows);

	const deleteSelectedEvents = () => {
		dispatch(deleteMultipleEvent(selectedEvents));
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
		<>
			<div className="modal-animation modal-overlay" />
			<section
				className="modal active modal-open"
				id="delete-events-status-modal"
				style={{ display: "block" }}
			>
				<header>
					<button onClick={close} className="button-like-anchor fa fa-times close-modal" />
					<h2>{t("BULK_ACTIONS.DELETE.EVENTS.CAPTION")}</h2>
				</header>

				<div className="modal-content active">
					<div className="modal-body">
						<div className="full-col">
							<div className="list-obj">
								<div className="modal-alert danger obj">
									<p>{t("BULK_ACTIONS.DELETE_EVENTS_WARNING_LINE1")}</p>
									<p>{t("BULK_ACTIONS.DELETE_EVENTS_WARNING_LINE2")}</p>
								</div>
								{/*todo: only show if scheduling Authorized*/}
								<div>
									<p>{t("BULK_ACTIONS.DELETE.EVENTS.UNAUTHORIZED")}</p>
								</div>

								<div className="full-col">
									<div className="obj">
										<header>
											{t("BULK_ACTIONS.DELETE.EVENTS.DELETE_EVENTS")}
										</header>
										<table className="main-tbl">
											<thead>
												<tr>
													<th className="small">
														<input
															type="checkbox"
															checked={allChecked}
															onChange={(e) => onChangeAllSelected(e)}
															className="select-all-cbox"
														/>
													</th>
													<th>{t("EVENTS.EVENTS.TABLE.TITLE")}</th>
													<th>{t("EVENTS.EVENTS.TABLE.PRESENTERS")}</th>
												</tr>
											</thead>
											<tbody>
												{/* Repeat for each marked event*/}
{/* @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type. */}
												{selectedEvents.map((event, key) => (
													<tr key={key}>
														<td>
															<input
																className="child-cbox"
																name="selection"
																type="checkbox"
																checked={event.selected}
																onChange={(e) => onChangeSelected(e, event.id)}
															/>
														</td>
														<td>{event.title}</td>
														<td>
															{/* Repeat for each presenter*/}
{/* @ts-expect-error TS(7006): Parameter 'presenter' implicitly has an 'any' type... Remove this comment to see the full error message */}
															{event.presenters.map((presenter, key) => (
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

				<footer>
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
					<button onClick={() => close()} className="cancel">
						{t("CANCEL")}
					</button>
				</footer>

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

});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteEventsModal);
