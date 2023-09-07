import React, { useState, useEffect } from "react";
import { Container, Draggable } from "@edorivai/react-smooth-dnd";
import { arrayMoveImmutable } from "array-move";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { changeColumnSelection } from "../../thunks/tableThunks";
import {
	getActivatedColumns,
	getDeactivatedColumns,
	getResourceType,
} from "../../selectors/tableSelectors";

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

	useEffect(() => {
		setActiveColumns(activeColumns);
		setDeactivatedColumns(deactivatedColumns);
	}, [activeColumns, deactivatedColumns]);

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
// @ts-expect-error TS(7031): Binding element 'removedIndex' implicitly has an '... Remove this comment to see the full error message
	const onDrop = ({ removedIndex, addedIndex }) => {
// @ts-expect-error TS(7006): Parameter 'columns' implicitly has an 'any' type.
		setActiveColumns((columns) => arrayMoveImmutable(columns, removedIndex, addedIndex));
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
			{showModal && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="modal-animation modal-overlay" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<section
						className="modal active modal-animation"
						id="edit-table-view-modal"
					>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<button
								className="button-like-anchor fa fa-times close-modal"
								onClick={() => {
									clearData();
									close();
								}}
							/>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<h2>{t("PREFERENCES.TABLE.CAPTION") /* Edit Table View */}</h2>
						</header>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="tab-description for-header">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<p>
										{t("PREFERENCES.TABLE.SUBHEADING", {
											tableName: t(
												"EVENTS." + resource.toUpperCase() + ".TABLE.CAPTION"
											),
										})}
									</p>
								</div>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="row">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="obj drag-available-column">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<h2>
													{
														t(
															"PREFERENCES.TABLE.AVAILABLE_COLUMNS"
														) /* Available Columns */
													}
												</h2>
											</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<ul className="drag-drop-items">
// @ts-expect-error TS(7006): Parameter 'column' implicitly has an 'any' type.
												{deactivatedCols.map((column, key) =>
													column ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<li className="drag-item" key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<div className="title">{t(column.label)}</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<button
																className="button-like-anchor move-item add"
																onClick={() => changeColumn(column, false)}
															/>
														</li>
													) : null
												)}
											</ul>
										</div>
									</div>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<div className="obj drag-selected-column">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<h2>
													{
														t(
															"PREFERENCES.TABLE.SELECTED_COLUMNS"
														) /* Selected Columns */
													}
												</h2>
											</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<ul className="drag-drop-items">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<Container
														dragHandleSelector=".drag-handle"
														lockAxis="y"
														onDrop={onDrop}
													>
// @ts-expect-error TS(7006): Parameter 'column' implicitly has an 'any' type.
														{activeCols.map((column, key) =>
															column ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																<Draggable className="drag-item" key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																	<div className="drag-handle">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<div className="title">
																			{t(column.label)}
																		</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
																		<button
																			className="button-like-anchor move-item remove"
																			onClick={() => changeColumn(column, true)}
																		/>
																	</div>
																</Draggable>
															) : null
														)}
													</Container>
												</li>
											</ul>
										</div>
									</div>
								</div>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="tab-description for-footer">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<footer>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="pull-left">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<button onClick={() => clearData()} className="cancel active">
									{t("CANCEL") /*Cancel*/}
								</button>
							</div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="pull-right">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<button onClick={() => save()} className="submit active">
									{t("SAVE") /* Save As Default */}
								</button>
							</div>
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
