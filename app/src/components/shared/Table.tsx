import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'styl... Remove this comment to see the full error message
import styled from "styled-components";
import {
	getPageOffset,
	getTable,
	getTablePages,
	getTablePagination,
	getTableRows,
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

// @ts-expect-error TS(6142): Module '../shared/EditTableViewModal' was resolved... Remove this comment to see the full error message
import EditTableViewModal from "../shared/EditTableViewModal";

// @ts-expect-error TS(2307): Cannot find module '../../img/tbl-sort.png' or its... Remove this comment to see the full error message
import sortIcon from "../../img/tbl-sort.png";
// @ts-expect-error TS(2307): Cannot find module '../../img/tbl-sort-up.png' or ... Remove this comment to see the full error message
import sortUpIcon from "../../img/tbl-sort-up.png";
// @ts-expect-error TS(2307): Cannot find module '../../img/tbl-sort-down.png' o... Remove this comment to see the full error message
import sortDownIcon from "../../img/tbl-sort-down.png";
// @ts-expect-error TS(6142): Module './Notifications' was resolved to '/home/ar... Remove this comment to see the full error message
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

const SortActiveIcon = styled.i`
    float: right;
    margin: 12px 0 0 5px;
    top: auto;
    left: auto;
    width: 8px;
    height: 13px;
    // @ts-expect-error TS(7006): Parameter 'props' implicitly has an 'any' type.
    background-image: url(${(props) =>
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
}) => {
	// Size options for pagination
	const sizeOptions = [10, 20, 50, 100];

	const lengthDivStyle = {
		position: "absolute",
		visibility: "hidden",
		height: "auto",
		width: "auto",
		whiteSpace: "nowrap",
	};
	const loadingTdStyle = {
		textAlign: "center",
	};

	const directAccessible = getDirectAccessiblePages(pages, pagination);

	const { t } = useTranslation();

	// State of dropdown menu
	const [showPageSizes, setShowPageSizes] = useState(false);
	const [displayEditTableViewModal, setEditTableViewModal] = useState(false);

	const { resources, requestSort, sortConfig } = useSortRows(rows);

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

// @ts-expect-error TS(7006): Parameter 'colName' implicitly has an 'any' type.
	const sortByColumn = (colName) => {
		const direction = requestSort(colName);
		setSortBy(colName);
		// Usually we could just use *sortConfig* here, but it seems that does not
		// get updated until the next rerender
		reverseTable(direction);
	};

	const showEditTableViewModal = async () => {
		setEditTableViewModal(true);
	};

	const hideEditTableViewModal = () => {
		setEditTableViewModal(false);
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<Notifications context="above_table" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="action-bar">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<ul>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<li>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<EditTableViewModal
				showModal={displayEditTableViewModal}
				handleClose={hideEditTableViewModal}
			/>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div id="length-div" style={lengthDivStyle}></div>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<table className={"main-tbl highlight-hover"}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<tr>
						{/* Only show if multiple selection is possible */}
						{table.multiSelect ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<th className="small">
								{/*Checkbox to select all rows*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<input
									type="checkbox"
									onChange={(e) => onChangeAllSelected(e)}
								/>
							</th>
						) : null}

						{/* todo: if not column.deactivated*/}
// @ts-expect-error TS(7006): Parameter 'column' implicitly has an 'any' type.
						{table.columns.map((column, key) =>
							column.deactivated ? null : column.sortable ? ( // Check if column is sortable and render accordingly
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<th
									key={key}
									className={cn({
// @ts-expect-error TS(2339): Property 'key' does not exist on type 'never'.
										"col-sort": !!sortConfig && column.name === sortConfig.key,
										sortable: true,
									})}
									onClick={() => sortByColumn(column.name)}
								>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<span>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<span>{t(column.label)}</span>
// @ts-expect-error TS(2339): Property 'key' does not exist on type 'never'.
										{!!sortConfig && column.name === sortConfig.key ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<SortActiveIcon order={sortConfig.direction} />
										) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<SortIcon />
										)}
									</span>
								</th>
							) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<th key={key} className={cn({ sortable: false })}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<span>{t(column.label)}</span>
								</th>
							)
						)}
					</tr>
				</thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<tbody>
					{table.loading && rows.length === 0 ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td colSpan={table.columns.length} style={loadingTdStyle}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<i className="fa fa-spinner fa-spin fa-2x fa-fw" />
							</td>
						</tr>
					) : !table.loading && rows.length === 0 ? (
						//Show if no results and table is not loading
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td colSpan={table.columns.length}>{t("TABLE_NO_RESULT")}</td>
						</tr>
					) : (
						!table.loading &&
						//Repeat for each row in table.rows
						resources.map((row, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<tr key={key}>
								{/* Show if multi selection is possible */}
								{/* Checkbox for selection of row */}
								{table.multiSelect && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<input
											type="checkbox"
											checked={row.selected}
											onChange={() => rowSelectionChanged(row.id)}
										/>
									</td>
								)}
								{/* Populate table */}
// @ts-expect-error TS(7006): Parameter 'column' implicitly has an 'any' type.
								{table.columns.map((column, key) =>
									!column.template &&
									!column.translate &&
									!column.deactivated ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<td key={key}>{row[column.name]}</td>
									) : !column.template &&
									  column.translate &&
									  !column.deactivated ? (
										//Show only if column not template, translate, not deactivated
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<td key={key}>{t(row[column.name])}</td>
									) : !!column.template &&
									  !column.deactivated &&
									  !!templateMap[column.template] ? (
										// if column has a template then apply it
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<td key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<ColumnTemplate
												row={row}
												column={column}
												templateMap={templateMap}
											/>
										</td>
									) : !column.deactivated ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<td />
									) : null
								)}
							</tr>
						))
					)}
				</tbody>
			</table>

			{/* Selection of page size */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div id="tbl-view-controls-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div
					className="drop-down-container small flipped"
					onClick={() => setShowPageSizes(!showPageSizes)}
// @ts-expect-error TS(2322): Type 'RefObject<unknown>' is not assignable to typ... Remove this comment to see the full error message
					ref={containerPageSize}
				>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<span>{pagination.limit}</span>
					{/* Drop down menu for selection of page size */}
					{showPageSizes && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<ul className="dropdown-ul">
							{sizeOptions.map((size, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<li key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="pagination">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button
						className={"button-like-anchor " + cn("prev", { disabled: !isNavigatePrevious() })}
						onClick={() => goToPage(pageOffset - 1)}
					/>
					{directAccessible.map((page, key) =>
						page.active ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<button key={key} className="button-like-anchor active">
								{page.label}
							</button>
						) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<button key={key} className="button-like-anchor" onClick={() => goToPage(page.number)}>
								{page.label}
							</button>
						)
					)}

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button
						className={"button-like-anchor " + cn("next", { disabled: !isNavigateNext() })}
						onClick={() => goToPage(pageOffset + 1)}
					/>
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

// @ts-expect-error TS(7006): Parameter 'resources' implicitly has an 'any' type... Remove this comment to see the full error message
const useSortRows = (resources, config = null) => {
	const [sortConfig, setSortConfig] = useState(config);

	const sortedResources = useMemo(() => {
		let sortableResources = [...resources];
		if (sortConfig !== null) {
			sortableResources.sort((a, b) => {
// @ts-expect-error TS(2339): Property 'key' does not exist on type 'never'.
				if (a[sortConfig.key] < b[sortConfig.key]) {
// @ts-expect-error TS(2339): Property 'direction' does not exist on type 'never... Remove this comment to see the full error message
					return sortConfig.direction === "ASC" ? -1 : 1;
				}
// @ts-expect-error TS(2339): Property 'key' does not exist on type 'never'.
				if (a[sortConfig.key] > b[sortConfig.key]) {
// @ts-expect-error TS(2339): Property 'direction' does not exist on type 'never... Remove this comment to see the full error message
					return sortConfig.direction === "ASC" ? 1 : -1;
				}
				return 0;
			});
		}
		return sortableResources;
	}, [resources, sortConfig]);

// @ts-expect-error TS(7006): Parameter 'key' implicitly has an 'any' type.
	const requestSort = (key) => {
		let direction = "ASC";
// @ts-expect-error TS(2339): Property 'key' does not exist on type 'never'.
		if (sortConfig && sortConfig.key && sortConfig.direction === "ASC") {
			direction = "DESC";
		}
// @ts-expect-error TS(2345): Argument of type '{ key: any; direction: string; }... Remove this comment to see the full error message
		setSortConfig({ key, direction });
		return direction;
	};

	return { resources: sortedResources, requestSort, sortConfig };
};

// Apply a column template and render corresponding components
// @ts-expect-error TS(7031): Binding element 'row' implicitly has an 'any' type... Remove this comment to see the full error message
const ColumnTemplate = ({ row, column, templateMap }) => {
	let Template = templateMap[column.template];
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
