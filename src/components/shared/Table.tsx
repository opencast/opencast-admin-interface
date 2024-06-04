import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import {
	getPageOffset,
	getTable,
	getTableDirection,
	getTablePages,
	getTablePagination,
	getTableRows,
	getTableSorting,
} from "../../selectors/tableSelectors";
import {
	reverseTable,
	setOffset,
	setSortBy,
	updatePageSize,
} from "../../actions/tableActions";
import {
	changeAllSelected,
	changeRowSelection,
	goToPage,
	updatePages,
} from "../../thunks/tableThunks";
import { connect } from "react-redux";
import cn from "classnames";

import EditTableViewModal from "../shared/EditTableViewModal";

import sortIcon from "../../img/tbl-sort.png";
import sortUpIcon from "../../img/tbl-sort-up.png";
import sortDownIcon from "../../img/tbl-sort-down.png";
import Notifications from "./Notifications";

const SortIcon = styled.i`
	float: right;
	margin: 12px 0 0 5px;
	top: auto;
	left: auto;
	width: 8px;
	height: 13px;
	background-image: url(${sortIcon});
`;

const SortActiveIcon = styled.i<{order: string}>`
    float: right;
    margin: 12px 0 0 5px;
    top: auto;
    left: auto;
    width: 8px;
    height: 13px;
    background-image: url(${(props: any) =>
			props.order === "ASC" ? sortUpIcon : sortDownIcon})};
`;

const containerPageSize = React.createRef();

/**
 * This component renders the table in the table views of resources
 */
const Table = ({
// @ts-expect-error TS(7031): Binding element 'table' implicitly has an 'any' ty... Remove this comment to see the full error message
	table,
// @ts-expect-error TS(7031): Binding element 'rowSelectionChanged' implicitly h... Remove this comment to see the full error message
	rowSelectionChanged,
// @ts-expect-error TS(7031): Binding element 'updatePageSize' implicitly has an... Remove this comment to see the full error message
	updatePageSize,
// @ts-expect-error TS(7031): Binding element 'templateMap' implicitly has an 'a... Remove this comment to see the full error message
	templateMap,
// @ts-expect-error TS(7031): Binding element 'pageOffset' implicitly has an 'an... Remove this comment to see the full error message
	pageOffset,
// @ts-expect-error TS(7031): Binding element 'pages' implicitly has an 'any' ty... Remove this comment to see the full error message
	pages,
// @ts-expect-error TS(7031): Binding element 'goToPage' implicitly has an 'any'... Remove this comment to see the full error message
	goToPage,
// @ts-expect-error TS(7031): Binding element 'updatePages' implicitly has an 'a... Remove this comment to see the full error message
	updatePages,
// @ts-expect-error TS(7031): Binding element 'setOffset' implicitly has an 'any... Remove this comment to see the full error message
	setOffset,
// @ts-expect-error TS(7031): Binding element 'changeSelectAll' implicitly has a... Remove this comment to see the full error message
	changeSelectAll,
// @ts-expect-error TS(7031): Binding element 'setSortBy' implicitly has an 'any... Remove this comment to see the full error message
	setSortBy,
// @ts-expect-error TS(7031): Binding element 'reverseTable' implicitly has an '... Remove this comment to see the full error message
	reverseTable,
// @ts-expect-error TS(7031): Binding element 'pagination' implicitly has an 'an... Remove this comment to see the full error message
	pagination,
// @ts-expect-error TS(7031): Binding element 'rows' implicitly has an 'any' typ... Remove this comment to see the full error message
	rows,
// @ts-expect-error TS(7031): Binding element 'rows' implicitly has an 'any' typ... Remove this comment to see the full error message
	sortBy,
// @ts-expect-error TS(7031): Binding element 'rows' implicitly has an 'any' typ... Remove this comment to see the full error message
	reverse,
}) => {
	// Size options for pagination
	const sizeOptions = [10, 20, 50, 100];

	const lengthDivStyle = {
		position: "absolute" as const,
		visibility: "hidden" as const,
		height: "auto",
		width: "auto",
		whiteSpace: "nowrap" as const,
	};
	const loadingTdStyle = {
		textAlign: "center" as const,
	};

	const directAccessible = getDirectAccessiblePages(pages, pagination);

	const { t } = useTranslation();

	// State of dropdown menu
	const [showPageSizes, setShowPageSizes] = useState(false);
	const [displayEditTableViewModal, setEditTableViewModal] = useState(false);

	useEffect(() => {
		// Function for handling clicks outside of an open dropdown menu
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
		const handleClickOutside = (e) => {
			if (
				containerPageSize.current &&
// @ts-expect-error TS(2571): Object is of type 'unknown'.
				!containerPageSize.current.contains(e.target)
			) {
				setShowPageSizes(false);
			}
		};

		// Event listener for handle a click outside of dropdown menu
		window.addEventListener("mousedown", handleClickOutside);

		return () => {
			window.removeEventListener("mousedown", handleClickOutside);
		};
	});

	// Select or deselect all rows on a page
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const onChangeAllSelected = (e) => {
		const selected = e.target.checked;
		changeSelectAll(selected);
	};

// @ts-expect-error TS(7006): Parameter 'size' implicitly has an 'any' type.
	const changePageSize = (size) => {
		updatePageSize(size);
		setOffset(0);
		updatePages();
	};

	// Navigation to previous page possible?
	const isNavigatePrevious = () => {
		return pageOffset > 0;
	};

	// Navigation to next page possible?
	const isNavigateNext = () => {
		return pageOffset < pages.length - 1;
	};

	const sortByColumn = (colName: string) => {
		setSortBy(colName);
		let direction = "ASC";
		if (reverse && reverse === "ASC") {
			direction = "DESC";
		}
		reverseTable(direction);
		updatePages();
	};

	const showEditTableViewModal = async () => {
		setEditTableViewModal(true);
	};

	const hideEditTableViewModal = () => {
		setEditTableViewModal(false);
	};

	return (
		<>
			<Notifications context="above_table" />
			<div className="action-bar">
				<ul>
					<li>
						<button
              onClick={() => showEditTableViewModal()}
              className="button-like-anchor"
            >
                {t("TABLE_EDIT")}
            </button>
					</li>
				</ul>
			</div>

			{/* Display modal for editing table view if table edit button is clicked */}
			<EditTableViewModal
				showModal={displayEditTableViewModal}
				handleClose={hideEditTableViewModal}
			/>

			<div id="length-div" style={lengthDivStyle}></div>
			<table className={"main-tbl highlight-hover"}>
				<thead>
					<tr>
						{/* Only show if multiple selection is possible */}
						{table.multiSelect ? (
							<th className="small">
								{/*Checkbox to select all rows*/}
								<input
									type="checkbox"
									onChange={(e) => onChangeAllSelected(e)}
								/>
							</th>
						) : null}

						{/* todo: if not column.deactivated*/}
{/* @ts-expect-error TS(7006): Parameter 'column' implicitly has an 'any' type. */}
						{table.columns.map((column, key) =>
							column.deactivated ? null : column.sortable ? ( // Check if column is sortable and render accordingly
								<th
									key={key}
									className={cn({
										"col-sort": !!sortBy && column.name === sortBy,
										sortable: true,
									})}
									onClick={() => sortByColumn(column.name)}
								>
									<span>
										<span>{t(column.label)}</span>
										{!!sortBy && column.name === sortBy ? (
											<SortActiveIcon order={reverse} />
										) : (
											<SortIcon />
										)}
									</span>
								</th>
							) : (
								<th key={key} className={cn({ sortable: false })}>
									<span>{t(column.label)}</span>
								</th>
							)
						)}
					</tr>
				</thead>
				<tbody>
					{table.loading && rows.length === 0 ? (
						<tr>
							<td colSpan={table.columns.length} style={loadingTdStyle}>
								<i className="fa fa-spinner fa-spin fa-2x fa-fw" />
							</td>
						</tr>
					) : !table.loading && rows.length === 0 ? (
						//Show if no results and table is not loading
						<tr>
							<td colSpan={table.columns.length}>{t("TABLE_NO_RESULT")}</td>
						</tr>
					) : (
						!table.loading &&
						//Repeat for each row in table.rows
// @ts-expect-error TS(2339):
						rows.map((row, key) => (
							<tr key={key}>
								{/* Show if multi selection is possible */}
								{/* Checkbox for selection of row */}
								{table.multiSelect && (
									<td>
										<input
											type="checkbox"
											checked={row.selected}
											onChange={() => rowSelectionChanged(row.id)}
										/>
									</td>
								)}
								{/* Populate table */}
{/* @ts-expect-error TS(7006): Parameter 'column' implicitly has an 'any' type. */}
								{table.columns.map((column, key) =>
									!column.template &&
									!column.translate &&
									!column.deactivated ? (
										<td key={key}>{row[column.name]}</td>
									) : !column.template &&
									  column.translate &&
									  !column.deactivated ? (
										//Show only if column not template, translate, not deactivated
										<td key={key}>{t(row[column.name])}</td>
									) : !!column.template &&
									  !column.deactivated &&
									  !!templateMap[column.template] ? (
										// if column has a template then apply it
										<td key={key}>
											<ColumnTemplate
												row={row}
												column={column}
												templateMap={templateMap}
											/>
										</td>
									) : !column.deactivated ? (
										<td />
									) : null
								)}
							</tr>
						))
					)}
				</tbody>
			</table>

			{/* Selection of page size */}
			<div id="tbl-view-controls-container">
				<div
					className="drop-down-container small flipped"
					onClick={() => setShowPageSizes(!showPageSizes)}
// @ts-expect-error TS(2322): Type 'RefObject<unknown>' is not assignable to typ... Remove this comment to see the full error message
					ref={containerPageSize}
				>
					<span>{pagination.limit}</span>
					{/* Drop down menu for selection of page size */}
					{showPageSizes && (
						<ul className="dropdown-ul">
							{sizeOptions.map((size, key) => (
								<li key={key}>
									<button
                    onClick={() => changePageSize(size)}
                    className="button-like-anchor"
                  >
                    {size}
                  </button>
								</li>
							))}
						</ul>
					)}
				</div>

				{/* Pagination and navigation trough pages */}
				<div className="pagination">
					<button
						className={"button-like-anchor " + cn("prev", { disabled: !isNavigatePrevious() })}
						onClick={() => goToPage(pageOffset - 1)}
					>
						<span class="sr-only">{t("EVENTS.EVENTS.TABLE.PREVIOUS")}</span>
					</button>
					{directAccessible.map((page, key) =>
						page.active ? (
							<button key={key} className="button-like-anchor active">
								{page.label}
							</button>
						) : (
							<button key={key} className="button-like-anchor" onClick={() => goToPage(page.number)}>
								{page.label}
							</button>
						)
					)}

					<button
						className={"button-like-anchor " + cn("next", { disabled: !isNavigateNext() })}
						onClick={() => goToPage(pageOffset + 1)}
					>
						<span class="sr-only">{t("EVENTS.EVENTS.TABLE.NEXT")}</span>
					</button>
				</div>
			</div>
		</>
	);
};

// get all pages directly accessible from current page
// @ts-expect-error TS(7006): Parameter 'pages' implicitly has an 'any' type.
const getDirectAccessiblePages = (pages, pagination) => {
	let startIndex = pagination.offset - pagination.directAccessibleNo,
		endIndex = pagination.offset + pagination.directAccessibleNo,
		directAccessible = [],
		i,
		pageToPush;

	if (startIndex < 0) {
		// Adjust range if selected range is too low
		endIndex = endIndex - startIndex;
		startIndex = 0;
	}

	if (endIndex >= pages.length) {
		// Adjust range if selected range is too high
		startIndex = startIndex - (endIndex - pages.length) - 1;
		endIndex = pages.length - 1;
	}

	// Adjust start and end index to numbers that are possible
	endIndex = Math.min(pages.length - 1, endIndex);
	startIndex = Math.max(0, startIndex);

	for (i = startIndex; i <= endIndex; i++) {
		if (i === startIndex && startIndex !== 0) {
			// Add first item if start index is not 0 (first page always direct accessible)
			pageToPush = pages[0];
		} else if (i === endIndex && endIndex !== pages.length - 1) {
			// Add last item if end index is not real end (last page always direct accessible)
			pageToPush = pages[pages.length - 1];
		} else if (
			(i === startIndex + 1 && startIndex !== 0) ||
			(i === endIndex - 1 && endIndex !== pages.length - 1)
		) {
			// Add .. at second or second last position if start or end index is not 0
			pageToPush = {
				number: i,
				label: "..",
				active: i === pagination.offset,
			};
		} else {
			pageToPush = pages[i];
		}
		directAccessible.push(pageToPush);
	}

	return directAccessible;
};

// Apply a column template and render corresponding components
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
const ColumnTemplate = ({ row, column, templateMap }) => {
	let Template = templateMap[column.template];
	return <Template row={row} />;
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	table: getTable(state),
	pageOffset: getPageOffset(state),
	pages: getTablePages(state),
	pagination: getTablePagination(state),
	rows: getTableRows(state),
	sortBy: getTableSorting(state),
	reverse: getTableDirection(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'id' implicitly has an 'any' type.
	rowSelectionChanged: (id, selected) =>
		dispatch(changeRowSelection(id, selected)),
// @ts-expect-error TS(7006): Parameter 'size' implicitly has an 'any' type.
	updatePageSize: (size) => dispatch(updatePageSize(size)),
// @ts-expect-error TS(7006): Parameter 'pageNumber' implicitly has an 'any' typ... Remove this comment to see the full error message
	goToPage: (pageNumber) => dispatch(goToPage(pageNumber)),
	updatePages: () => dispatch(updatePages()),
// @ts-expect-error TS(7006): Parameter 'pageNumber' implicitly has an 'any' typ... Remove this comment to see the full error message
	setOffset: (pageNumber) => dispatch(setOffset(pageNumber)),
// @ts-expect-error TS(7006): Parameter 'selected' implicitly has an 'any' type.
	changeSelectAll: (selected) => dispatch(changeAllSelected(selected)),
// @ts-expect-error TS(7006): Parameter 'order' implicitly has an 'any' type.
	reverseTable: (order) => dispatch(reverseTable(order)),
// @ts-expect-error TS(7006): Parameter 'column' implicitly has an 'any' type.
	setSortBy: (column) => dispatch(setSortBy(column)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Table);
