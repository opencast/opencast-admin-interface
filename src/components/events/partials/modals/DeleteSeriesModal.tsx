import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getSelectedRows } from "../../../../selectors/tableSelectors";
import cn from "classnames";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
	deleteMultipleSeries,
	getSeriesConfig,
	hasEvents,
} from "../../../../slices/seriesSlice";
import { useHotkeys } from "react-hotkeys-hook";
import { availableHotkeys } from "../../../../configs/hotkeysConfig";
import { isSeries, Row } from "../../../../slices/tableSlice";

/**
 * This component manges the delete series bulk action
 */
const DeleteSeriesModal = ({
	close
}: {
	close: () => void
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const selectedRows = useAppSelector(state => getSelectedRows(state));
	const modifiedSelectedRows = selectedRows.map((row) => {
		return { ...row, hasEvents: false }
	})

	const [allChecked, setAllChecked] = useState(true);
	const [selectedSeries, setSelectedSeries] = useState(modifiedSelectedRows);
	const [deleteWithSeriesAllowed, setDeleteWithSeriesAllowed] = useState(false);

	useHotkeys(
		availableHotkeys.general.CLOSE_MODAL.sequence,
		() => close(),
		{ description: t(availableHotkeys.general.CLOSE_MODAL.description) ?? undefined },
		[close],
  	);

	useEffect(() => {
		async function fetchData() {
			// Query from backend if deletion of series with events allowed
			let response = await getSeriesConfig();
			setDeleteWithSeriesAllowed(response);

			// Check for each selected series if it has events
			let series: (Row & { hasEvents: any })[] = [];
			for (let i = 0; i < selectedSeries.length; i++) {
				const selectedSeriesInThisLoop = selectedSeries[i];
				if (selectedSeriesInThisLoop) {
					const events = isSeries(selectedSeriesInThisLoop) ? await hasEvents(selectedSeriesInThisLoop.id.toString()) : false;
					series.push({
						...selectedSeriesInThisLoop,
						hasEvents: events,
					});
				}
			}
			setSelectedSeries(series);
		}
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const deleteSelectedSeries = () => {
		// @ts-expect-error TS(7006): Type guarding array is hard
		dispatch(deleteMultipleSeries(selectedSeries));
		close();
	};

	// Select or deselect all rows in table
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const onChangeAllSelected = (e) => {
		const selected = e.target.checked;
		setAllChecked(selected);
		let changedSelection = selectedSeries.map((series) => {
			return {
				...series,
				selected: selected,
			};
		});
		setSelectedSeries(changedSelection);
	};

	// Handle change of checkboxes indicating which series to consider further
	const onChangeSelected = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
		const selected = e.target.checked;
		let changedSeries = selectedSeries.map((series) => {
			if (isSeries(series) && series.id === id) {
				return {
					...series,
					selected: selected,
				};
			} else {
				return series;
			}
		});
		setSelectedSeries(changedSeries);

		if (!selected) {
			setAllChecked(false);
		}
		if (changedSeries.every((series) => series.selected === true)) {
			setAllChecked(true);
		}
	};

	const isAllowed = () => {
		let allowed = true;
		if (!deleteWithSeriesAllowed) {
			selectedSeries.forEach((series) => {
				if (allowed && series.selected && series.hasEvents) {
					allowed = false;
				}
			});
		}
		return allowed;
	};

	// Check validity for activating delete button
	const checkValidity = () => {
		if (isAllowed()) {
			return !!selectedSeries.some((series) => series.selected === true);
		}
		return false;
	};

	return (
		<>
			<div className="modal-animation modal-overlay" />
			<section
				className="modal active modal-open"
				id="delete-series-status-modal"
				style={{ display: "block" }}
			>
				<header>
					<button onClick={() => close()} className="button-like-anchor fa fa-times close-modal" />
					<h2>{t("BULK_ACTIONS.DELETE.SERIES.CAPTION")}</h2>
				</header>

				<div className="modal-content">
					<div className="modal-body">
						<div className="modal-alert danger obj">
							<p>{t("BULK_ACTIONS.DELETE_SERIES_WARNING_LINE1")}</p>
							<p>{t("BULK_ACTIONS.DELETE_SERIES_WARNING_LINE2")}</p>
						</div>

						{/* Only show if series not allowed to be deleted */}
						{!isAllowed() && (
							<div className="alert sticky warning">
								<p>{t("BULK_ACTIONS.DELETE.SERIES.CANNOT_DELETE")}</p>
							</div>
						)}

						<div className="full-col">
							<div className="obj">
								<header>{t("EVENTS.SERIES.TABLE.CAPTION")}</header>
								<div className="obj-container">
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
												<th>{t("EVENTS.SERIES.TABLE.TITLE")}</th>
												<th>{t("EVENTS.SERIES.TABLE.ORGANIZERS")}</th>
												<th>{t("EVENTS.SERIES.TABLE.HAS_EVENTS")}</th>
											</tr>
										</thead>
										<tbody>
											{/* Repeat for each marked series */}
											{selectedSeries.map((series, key) => (
												<tr
													key={key}
													className={cn({
														error:
															!deleteWithSeriesAllowed &&
															series.selected &&
															series.hasEvents,
													})}
												>
													<td>
														<input
															type="checkbox"
															name="selection"
															checked={series.selected}
															onChange={(e) => onChangeSelected(e, isSeries(series) ?series.id : "")}
															className="child-cbox"
														/>
													</td>
													<td>{isSeries(series) && series.title}</td>
													<td>
														{/*Repeat for each creator*/}
{/* @ts-expect-error TS(7006): Parameter 'organizer' implicitly has an 'any' type */}
														{series.organizers.map((organizer, key) => (
															<span className="metadata-entry" key={key}>
																{organizer}
															</span>
														))}
													</td>
													{/* Only show check if row has events, else empty cell*/}
													<td>
														{series.hasEvents && <i className="fa fa-check" />}
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

				<footer>
					<button
						onClick={() => deleteSelectedSeries()}
						disabled={!checkValidity()}
						className={cn("danger", {
							active: checkValidity(),
							inactive: !checkValidity(),
						})}
					>
						{t("BULK_ACTIONS.DELETE.SERIES.BUTTON")}
					</button>
					<button className="cancel" onClick={() => close()}>
						{t("CANCEL")}
					</button>
				</footer>
			</section>
		</>
	);
};

export default DeleteSeriesModal;
