import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { getSelectedRows } from "../../../../selectors/tableSelectors";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { deleteMultipleEvent } from "../../../../slices/eventSlice";
import { isEvent } from "../../../../slices/tableSlice";
import NavigationButtons from "../../../shared/NavigationButtons";

/**
 * This component manages the delete bulk action
 */
const DeleteEventsModal = ({
	close,
}: {
	close: () => void
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const selectedRows = useAppSelector(state => getSelectedRows(state));

	const [allChecked, setAllChecked] = useState(true);
	const [selectedEvents, setSelectedEvents] = useState(selectedRows);

	const deleteSelectedEvents = () => {
		// @ts-expect-error TS(7006): Type guarding array is hard
		dispatch(deleteMultipleEvent(selectedEvents));
		close();
	};

	// Select or deselect all rows in table
	const onChangeAllSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.checked;
		setAllChecked(selected);
		let changedSelection = selectedEvents.map((event) => {
			return {
				...event,
				selected: selected,
			};
		});
		setSelectedEvents(changedSelection);
	};

	// Handle change of checkboxes indicating which events to consider further
	const onChangeSelected = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
		const selected = e.target.checked;
		let changedEvents = selectedEvents.map((event) => {
			if (isEvent(event) && event.id === id) {
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
		if (changedEvents.every((event) => event.selected === true)) {
			setAllChecked(true);
		}
	};

	return (
		<>
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
											{selectedEvents.map((event, key) => (
												<tr key={key}>
													<td>
														<input
															className="child-cbox"
															name="selection"
															type="checkbox"
															checked={event.selected}
															onChange={(e) => onChangeSelected(e, isEvent(event) ? event.id : "")}
														/>
													</td>
													<td>{isEvent(event) && event.title}</td>
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

			<NavigationButtons
				isLast
				isSubmitDisabled={!selectedEvents.some((event) => event.selected === true)}
				submitClassName="danger"
				nextPage={deleteSelectedEvents}
				previousPage={close}
				nextTranslationString="WIZARD.DELETE"
				previousTranslationString="CANCEL"
			/>
		</>
	);
};

export default DeleteEventsModal;
