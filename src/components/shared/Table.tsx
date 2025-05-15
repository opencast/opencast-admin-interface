import React, { JSX, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	getMultiSelect,
	getPageOffset,
	getTable,
	getTableDirection,
	getTablePages,
	getTablePagination,
	getTableRows,
	getTableSorting,
} from "../../selectors/tableSelectors";
import {
	Row,
	reverseTable,
	setOffset,
	setSortBy,
	updatePageSize,
	Page,
	Pagination,
	ReverseOptions,
} from "../../slices/tableSlice";
import {
	changeAllSelected,
	changeRowSelection,
	goToPage,
	updatePages,
} from "../../thunks/tableThunks";
import cn from "classnames";

import EditTableViewModal from "../shared/EditTableViewModal";

import sortIcon from "../../img/tbl-sort.png";
import sortUpIcon from "../../img/tbl-sort-up.png";
import sortDownIcon from "../../img/tbl-sort-down.png";
import Notifications from "./Notifications";
import { useAppDispatch, useAppSelector } from "../../store";
import { TableColumn } from "../../configs/tableConfigs/aclsTableConfig";
import ButtonLikeAnchor from "./ButtonLikeAnchor";
import { ModalHandle } from "./modals/Modal";
import { ParseKeys } from "i18next";

const containerPageSize = React.createRef<HTMLDivElement>();

type TemplateMap = {
	[key: string]: ({ row }: { row: any }) => JSX.Element | JSX.Element[]
}

/**
 * This component renders the table in the table views of resources
 */
const Table = ({
	templateMap,
}: {
	templateMap: TemplateMap
}) => {
	const dispatch = useAppDispatch();

	const table = useAppSelector(state => getTable(state));
	const pageOffset = useAppSelector(state => getPageOffset(state));
	const pages = useAppSelector(state => getTablePages(state));
	const pagination = useAppSelector(state => getTablePagination(state));
	const rows = useAppSelector(state => getTableRows(state));
	const sortBy = useAppSelector(state => getTableSorting(state));
	const reverse = useAppSelector(state => getTableDirection(state));
	const multiSelect = useAppSelector(state => getMultiSelect(state));

	// Size options for pagination
	const sizeOptions = [10, 20, 50, 100, 1000];

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
	const editTableViewModalRef = useRef<ModalHandle>(null);
	const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		// Function for handling clicks outside of an open dropdown menu
		const handleClickOutside = (e: MouseEvent) => {
			if (
				e && containerPageSize.current && !containerPageSize.current.contains(e.target as Node)
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
	const onChangeAllSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.checked;
		dispatch(changeAllSelected(selected));
	};

	const changePageSize = (size: number) => {
		dispatch(updatePageSize(size));
		dispatch(setOffset(0));
		dispatch(updatePages());
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
		// By sorting, any selected item has to be deselected!
		forceDeselectAll();
		dispatch(setSortBy(colName));
		let direction: ReverseOptions = "ASC";
		if (reverse && reverse === "ASC") {
			direction = "DESC";
		}
		dispatch(reverseTable(direction));
		dispatch(updatePages());
	};

	const forceDeselectAll = () => {
		dispatch(changeAllSelected(false));
		if (selectAllCheckboxRef.current?.checked) {
			selectAllCheckboxRef.current.checked = false;
		}
	}

	const showEditTableViewModal = async () => {
		editTableViewModalRef.current?.open()
	};

	const hideEditTableViewModal = () => {
		editTableViewModalRef.current?.close?.()
	};

	const tryToGetValueForKeyFromRowAsString = (row: Row, key: string) => {
		if (key in row) {
			const value = row[key as keyof Row];
			if (typeof value === "string") {
				return value;
			}
		}

		return "";
	}

	return (
		<>
			<Notifications context="above_table" />
			<div className="action-bar">
				<ul>
					<li>
						<ButtonLikeAnchor
							onClick={() => showEditTableViewModal()}
						>
							{t("TABLE_EDIT")}
						</ButtonLikeAnchor>
					</li>
				</ul>
			</div>

			{/* Display modal for editing table view if table edit button is clicked */}
			<EditTableViewModal
				close={hideEditTableViewModal}
				modalRef={editTableViewModalRef}
			/>

			<div id="length-div" style={lengthDivStyle}></div>
			<table className={"main-tbl highlight-hover"}>
				<thead>
					<tr>
						{/* Only show if multiple selection is possible */}
						{multiSelect ? (
							<th className="small">
								{/*Checkbox to select all rows*/}
								<input
									ref={selectAllCheckboxRef}
									type="checkbox"
									onChange={(e) => onChangeAllSelected(e)}
									aria-label={t("EVENTS.EVENTS.TABLE.SELECT_ALL")}
								/>
							</th>
						) : null}

						{/* todo: if not column.deactivated*/}
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
										<i style={{
											float: "right",
											margin: "12px 0 0 5px",
											top: "auto",
											left: "auto",
											width: 8,
											height: 13,
											backgroundImage: `url(${column.name === sortBy
												? reverse === "ASC"
													? sortUpIcon
													: sortDownIcon
												: sortIcon})`,
										}} />
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
					{table.status === 'loading' && rows.length === 0 ? (
						<tr>
							<td colSpan={table.columns.length} style={loadingTdStyle}>
								<i className="fa fa-spinner fa-spin fa-2x fa-fw" />
							</td>
						</tr>
					) : !(table.status === 'loading') && rows.length === 0 ? (
						//Show if no results and table is not loading
						<tr>
							<td colSpan={table.columns.length}>{t("TABLE_NO_RESULT")}</td>
						</tr>
					) : (
						!(table.status === 'loading') &&
						//Repeat for each row in table.rows
						rows.map((row, key) => (
							<tr key={key}>
								{/* Show if multi selection is possible */}
								{/* Checkbox for selection of row */}
								{multiSelect && "id" in row && (
									<td>
										<input
											type="checkbox"
											checked={row.selected}
											onChange={() => dispatch(changeRowSelection(row.id, false))}
											aria-label={t("EVENTS.EVENTS.TABLE.SELECT_EVENT", { title: "title" in row ? row.title : row.id })}
										/>
									</td>
								)}
								{/* Populate table */}
								{table.columns.map((column, key) =>
									!column.template &&
									!column.translate &&
									!column.deactivated ? (
										<td key={key}>{column.name in row ? row[column.name as keyof Row] : ""}</td>
									) : !column.template &&
									  column.translate &&
									  !column.deactivated ? (
										//Show only if column not template, translate, not deactivated
										<td key={key}>{t(tryToGetValueForKeyFromRowAsString(row, column.name) as ParseKeys)}</td>
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
					ref={containerPageSize}
					role="button"
					tabIndex={0}
				>
					<span>{pagination.limit}</span>
					{/* Drop down menu for selection of page size */}
					{showPageSizes && (
						<ul className="dropdown-ul">
							{sizeOptions.map((size, key) => (
								<li key={key}>
									<ButtonLikeAnchor
										onClick={() => changePageSize(size)}
									>
										{size}
									</ButtonLikeAnchor>
								</li>
							))}
						</ul>
					)}
				</div>

				{/* Pagination and navigation trough pages */}
				<div className="pagination">
					<ButtonLikeAnchor
						extraClassName={cn("prev", { disabled: !isNavigatePrevious() })}
						onClick={() => dispatch(goToPage(pageOffset - 1))}
					>
						<span className="sr-only">{t("TABLE_PREVIOUS")}</span>
					</ButtonLikeAnchor>
					{directAccessible.map((page, key) =>
						page.active ? (
							<ButtonLikeAnchor key={key} extraClassName="active">
								{page.label}
							</ButtonLikeAnchor>
						) : (
							<ButtonLikeAnchor key={key} onClick={() => dispatch(goToPage(page.number))}>
								{page.label}
							</ButtonLikeAnchor>
						)
					)}

					<ButtonLikeAnchor
						extraClassName={cn("next", { disabled: !isNavigateNext() })}
						onClick={() => dispatch(goToPage(pageOffset + 1))}
					>
						<span className="sr-only">{t("TABLE_NEXT")}</span>
					</ButtonLikeAnchor>
				</div>
			</div>
		</>
	);
};

// get all pages directly accessible from current page

const getDirectAccessiblePages = (pages: Page[], pagination: Pagination) => {
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
const ColumnTemplate = ({ row, column, templateMap }: {row: Row, column: TableColumn, templateMap: TemplateMap}) => {
	if (!column.template) {
		return <></>;
	}
	let Template = templateMap[column.template];
	return <Template row={row} />;
};

export default Table;
