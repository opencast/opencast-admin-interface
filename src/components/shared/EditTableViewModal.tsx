import React, { useState, useEffect } from "react";
import { arrayMoveImmutable } from "array-move";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { changeColumnSelection } from "../../thunks/tableThunks";
import {
	getActivatedColumns,
	getDeactivatedColumns,
	getResourceType,
} from "../../selectors/tableSelectors";
import { DragDropContext, Droppable, OnDragEndResponder, Draggable as Draggablee } from "@hello-pangea/dnd";
import { availableHotkeys } from "../../configs/hotkeysConfig";
import { useHotkeys } from "react-hotkeys-hook";

/**
 * This component renders the modal for editing which columns are shown in the table
 */
const EditTableViewModal = ({
// @ts-expect-error TS(7031): Binding element 'showModal' implicitly has an 'any... Remove this comment to see the full error message
	showModal,
// @ts-expect-error TS(7031): Binding element 'handleClose' implicitly has an 'a... Remove this comment to see the full error message
	handleClose,
// @ts-expect-error TS(7031): Binding element 'resource' implicitly has an 'any'... Remove this comment to see the full error message
	resource,
// @ts-expect-error TS(7031): Binding element 'activeColumns' implicitly has an ... Remove this comment to see the full error message
	activeColumns,
// @ts-expect-error TS(7031): Binding element 'deactivatedColumns' implicitly ha... Remove this comment to see the full error message
	deactivatedColumns,
// @ts-expect-error TS(7031): Binding element 'changeSelectedColumns' implicitly... Remove this comment to see the full error message
	changeSelectedColumns,
}) => {
	const { t } = useTranslation();

	const originalActiveColumns = activeColumns;
	const originalDeactivatedColumns = deactivatedColumns;

	const [deactivatedCols, setDeactivatedColumns] = useState(deactivatedColumns);
	const [activeCols, setActiveColumns] = useState(activeColumns);
	const [isColsLoaded, setIsColsLoaded] = useState(false);

	useEffect(() => {
		if (!isColsLoaded) {
			setActiveColumns(activeColumns);
			setDeactivatedColumns(deactivatedColumns);
			if (activeColumns.length !== 0 || deactivatedColumns.length !== 0) {
				setIsColsLoaded(true)
			}
		}
	}, [activeColumns, deactivatedColumns, isColsLoaded]);

	useHotkeys(
		availableHotkeys.general.CLOSE_MODAL.sequence,
		() => handleClose(),
		{ description: t(availableHotkeys.general.CLOSE_MODAL.description) ?? undefined },
		[handleClose],
  	);

	// closes this modal
	const close = () => {
		handleClose();
	};

	// set deactivated property of column to true (deactivate = true) or false (deactivate = false) and move to corresponding list
// @ts-expect-error TS(7006): Parameter 'column' implicitly has an 'any' type.
	const changeColumn = (column, deactivate) => {
		if (deactivate) {
// @ts-expect-error TS(7006): Parameter 'col' implicitly has an 'any' type.
			setActiveColumns(activeCols.filter((col) => col !== column));
			column = { ...column, deactivated: deactivate };
			setDeactivatedColumns(deactivatedCols.concat(column));
		} else {
// @ts-expect-error TS(7006): Parameter 'col' implicitly has an 'any' type.
			setDeactivatedColumns(deactivatedCols.filter((col) => col !== column));
			column = { ...column, deactivated: deactivate };
			setActiveColumns(activeCols.concat(column));
		}
	};

	// save new values of which columns are active or deactivated and apply changes to table
	const save = () => {
		const settings = activeCols.concat(deactivatedCols);
		changeSelectedColumns(settings);
		close();
	};

	// reset active and deactivated columns to how they were when the dialogue was opened (used when closing without saving)
	const clearData = () => {
		setActiveColumns(originalActiveColumns);
		setDeactivatedColumns(originalDeactivatedColumns);
		close();
	};

	// change column order based on where column was dragged and dropped
	const onDragEnd: OnDragEndResponder = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

		// @ts-expect-error TS(7006): Parameter 'columns' implicitly has an 'any' type.
		setActiveColumns((columns) => arrayMoveImmutable(columns, result.source.index, result.destination.index));
  }

	return (
		<>
			{showModal && (
				<>
					<div className="modal-animation modal-overlay" />
					<section
						className="modal active modal-animation"
						id="edit-table-view-modal"
					>
						<header>
							<button
								className="button-like-anchor fa fa-times close-modal"
								onClick={() => {
									clearData();
									close();
								}}
							/>
							<h2>{t("PREFERENCES.TABLE.CAPTION") /* Edit Table View */}</h2>
						</header>

						<div className="modal-content">
							<div className="modal-body">
								<div className="tab-description for-header">
									<p>
										{t("PREFERENCES.TABLE.SUBHEADING", {
											tableName: t(
												"EVENTS." + resource.toUpperCase() + ".TABLE.CAPTION"
											),
										})}
									</p>
								</div>

								<div className="row">
									<div className="col">
										<div className="obj drag-available-column">
											<header>
												<h2>
													{
														t(
															"PREFERENCES.TABLE.AVAILABLE_COLUMNS"
														) /* Available Columns */
													}
												</h2>
											</header>
											<ul className="drag-drop-items">
{/* @ts-expect-error TS(7006): Parameter 'column' implicitly has an 'any' type. */}
												{deactivatedCols.map((column, key) =>
													column ? (
														<li className="drag-item" key={key}>
															<div className="title">{t(column.label)}</div>
															<button
																className="button-like-anchor move-item add"
																onClick={() => changeColumn(column, false)}
															>
																<span class="sr-only">{t("PREFERENCES.TABLE.ADD_COLUMN")}</span>
															</button>
														</li>
													) : null
												)}
											</ul>
										</div>
									</div>

									<div className="col">
										<div className="obj drag-selected-column">
											<header>
												<h2>
													{
														t(
															"PREFERENCES.TABLE.SELECTED_COLUMNS"
														) /* Selected Columns */
													}
												</h2>
											</header>
											<ul className="drag-drop-items">
												<li>
													<DragDropContext
														onDragEnd={onDragEnd}
													>
														<Droppable droppableId="droppable">
															{(provided, snapshot) => (
																<div
																	{...provided.droppableProps}
																	ref={provided.innerRef}
																	// style={}
																>
																	{/* @ts-expect-error TS(7006): Parameter 'column' implicitly has an 'any' type. */}
																	{activeCols.filter(col => col).map((column, key) =>
																		(
																			<Draggablee key={column.name} draggableId={column.name} index={key}>
																				{(provided, snapshot) => (
																					<div
																						ref={provided.innerRef}
																						{...provided.draggableProps}
																						{...provided.dragHandleProps}
																						style={{...provided.draggableProps.style}}
																						className="drag-item"
																					>
																						<div className="title">
																							{t(column.label)}
																						</div>
																						<button
																							className="button-like-anchor move-item remove"
																							onClick={() => changeColumn(column, true)}
																						>
																							<span class="sr-only">{t("PREFERENCES.TABLE.REMOVE_COLUMN")}</span>
																						</button>
																					</div>
																				)}
																			</Draggablee>
																		)
																	)}
																	{provided.placeholder}
																</div>
															)}
														</Droppable>
													</DragDropContext>

												</li>
											</ul>
										</div>
									</div>
								</div>

								<div className="tab-description for-footer">
									<p>
										{/* The order and selection will be saved automatically.
                                Press "Reset" to restore the default view. */}
										{t("PREFERENCES.TABLE.FOOTER_TEXT", {
											resetTranslation: t("RESET"),
										})}
									</p>
								</div>
							</div>
						</div>

						<footer>
							{/* Render buttons for updating table data */}
								<button onClick={() => clearData()} className="cancel active">
									{t("CANCEL") /*Cancel*/}
								</button>
								<button onClick={() => save()} className="submit active">
									{t("SAVE") /* Save As Default */}
								</button>
						</footer>
					</section>
				</>
			)}
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	resource: getResourceType(state),
	deactivatedColumns: getDeactivatedColumns(state),
	activeColumns: getActivatedColumns(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'updatedColumns' implicitly has an 'any'... Remove this comment to see the full error message
	changeSelectedColumns: (updatedColumns) =>
		dispatch(changeColumnSelection(updatedColumns)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditTableViewModal);
