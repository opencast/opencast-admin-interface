import React, { useState, useEffect } from "react";
import { arrayMoveImmutable } from "array-move";
import { useTranslation } from "react-i18next";
import { changeColumnSelection } from "../../thunks/tableThunks";
import {
	getActivatedColumns,
	getDeactivatedColumns,
	getResourceType,
} from "../../selectors/tableSelectors";
import { DragDropContext, Droppable, OnDragEndResponder, Draggable as Draggablee } from "@hello-pangea/dnd";
import { availableHotkeys } from "../../configs/hotkeysConfig";
import { useHotkeys } from "react-hotkeys-hook";
import { useAppDispatch, useAppSelector } from "../../store";
import { TableColumn } from "../../configs/tableConfigs/aclsTableConfig";

/**
 * This component renders the modal for editing which columns are shown in the table
 */
const EditTableViewModal = ({
	handleClose,
}: {
	handleClose: () => void,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const resource = useAppSelector(state => getResourceType(state));
	const deactivatedColumns = useAppSelector(state => getDeactivatedColumns(state));
	const activeColumns = useAppSelector(state => getActivatedColumns(state));

	const originalActiveColumns = activeColumns;
	const originalDeactivatedColumns = deactivatedColumns;

	const [deactivatedCols, setDeactivatedColumns] = useState(deactivatedColumns);
	const [activeCols, setActiveColumns] = useState(activeColumns);
	const [isColsLoaded, setIsColsLoaded] = useState(false);

	useEffect(() => {
		if (!isColsLoaded) {
			if (activeColumns.length !== 0 || deactivatedColumns.length !== 0) {
				setIsColsLoaded(true)
			}
			setActiveColumns(activeColumns);
			setDeactivatedColumns(deactivatedColumns);
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
	const changeColumn = (column: TableColumn, deactivate: boolean) => {
		if (deactivate) {
			setActiveColumns(activeCols.filter((col) => col !== column));
			column = { ...column, deactivated: deactivate };
			setDeactivatedColumns(deactivatedCols.concat(column));
		} else {
			setDeactivatedColumns(deactivatedCols.filter((col) => col !== column));
			column = { ...column, deactivated: deactivate };
			setActiveColumns(activeCols.concat(column));
		}
	};

	// save new values of which columns are active or deactivated and apply changes to table
	const save = () => {
		const settings = activeCols.concat(deactivatedCols);
		dispatch(changeColumnSelection(settings))
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
		const destination = result.destination
		if (destination === null) {
			return;
		}

		setActiveColumns((columns) => arrayMoveImmutable(columns, result.source.index, destination.index));
	}

	return (
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
										{deactivatedCols.map((column, key) =>
											column ? (
												<li className="drag-item" key={key}>
													<div className="title">{t(column.label)}</div>
													<button
														className="button-like-anchor move-item add"
														onClick={() => changeColumn(column, false)}
													>
														<span className="sr-only">{t("PREFERENCES.TABLE.ADD_COLUMN")}</span>
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
																					<span className="sr-only">{t("PREFERENCES.TABLE.REMOVE_COLUMN")}</span>
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
	);
};

export default EditTableViewModal;
