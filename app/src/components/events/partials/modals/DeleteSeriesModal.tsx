import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getSelectedRows } from "../../../../selectors/tableSelectors";
import { connect } from "react-redux";
import cn from "classnames";
import {
	deleteMultipleSeries,
	getSeriesConfig,
	hasEvents,
} from "../../../../thunks/seriesThunks";

/**
 * This component manges the delete series bulk action
 */
// @ts-expect-error TS(7031): Binding element 'close' implicitly has an 'any' ty... Remove this comment to see the full error message
const DeleteSeriesModal = ({ close, selectedRows, deleteMultipleSeries }) => {
	const { t } = useTranslation();

	const [allChecked, setAllChecked] = useState(true);
	const [selectedSeries, setSelectedSeries] = useState(selectedRows);
	const [deleteWithSeriesAllowed, setDeleteWithSeriesAllowed] = useState(false);

	useEffect(() => {
		async function fetchData() {
			// Query from backend if deletion of series with events allowed
			let response = await getSeriesConfig();
			setDeleteWithSeriesAllowed(response);

			// Check for each selected series if it has events
			let series = [];
			for (let i = 0; i < selectedSeries.length; i++) {
				const events = await hasEvents(selectedSeries[i].id);
				series.push({
					...selectedSeries[i],
					hasEvents: events,
				});
			}
			setSelectedSeries(series);
		}
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const deleteSelectedSeries = () => {
		deleteMultipleSeries(selectedSeries);
		close();
	};

	// Select or deselect all rows in table
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const onChangeAllSelected = (e) => {
		const selected = e.target.checked;
		setAllChecked(selected);
// @ts-expect-error TS(7006): Parameter 'series' implicitly has an 'any' type.
		let changedSelection = selectedSeries.map((series) => {
			return {
				...series,
				selected: selected,
			};
		});
		setSelectedSeries(changedSelection);
	};

	// Handle change of checkboxes indicating which series to consider further
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const onChangeSelected = (e, id) => {
		const selected = e.target.checked;
// @ts-expect-error TS(7006): Parameter 'series' implicitly has an 'any' type.
		let changedSeries = selectedSeries.map((series) => {
			if (series.id === id) {
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
// @ts-expect-error TS(7006): Parameter 'series' implicitly has an 'any' type.
		if (changedSeries.every((series) => series: any.selected === true)) {
			setAllChecked(true);
		}
	};

	const isAllowed = () => {
		let allowed = true;
		if (!deleteWithSeriesAllowed) {
// @ts-expect-error TS(7006): Parameter 'series' implicitly has an 'any' type.
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
// @ts-expect-error TS(7006): Parameter 'series' implicitly has an 'any' type.
			return !!selectedSeries.some((series) => series.selected === true);
		}
		return false;
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-animation modal-overlay" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<section
				className="modal active modal-open"
				id="delete-series-status-modal"
				style={{ display: "block" }}
			>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button onClick={() => close()} className="button-like-anchor fa fa-times close-modal" />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<h2>{t("BULK_ACTIONS.DELETE.SERIES.CAPTION")}</h2>
				</header>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="modal-alert danger obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<p>{t("BULK_ACTIONS.DELETE_SERIES_WARNING_LINE1")}</p>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<p>{t("BULK_ACTIONS.DELETE_SERIES_WARNING_LINE2")}</p>
						</div>

						{/* Only show if series not allowed to be deleted */}
						{!isAllowed() && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="alert sticky warning">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<p>{t("BULK_ACTIONS.DELETE.SERIES.CANNOT_DELETE")}</p>
							</div>
						)}

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="full-col">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="obj">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<header>{t("EVENTS.SERIES.TABLE.CAPTION")}</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div className="obj-container">
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
												<th>{t("EVENTS.SERIES.TABLE.TITLE")}</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<th>{t("EVENTS.SERIES.TABLE.ORGANIZERS")}</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<th>{t("EVENTS.SERIES.TABLE.HAS_EVENTS")}</th>
											</tr>
										</thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<tbody>
											{/* Repeat for each marked series */}
// @ts-expect-error TS(7006): Parameter 'series' implicitly has an 'any' type.
											{selectedSeries.map((series, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<tr
													key={key}
													className={cn({
														error:
															!deleteWithSeriesAllowed &&
															series.selected &&
															series.hasEvents,
													})}
												>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<input
															type="checkbox"
															name="selection"
															checked={series.selected}
															onChange={(e) => onChangeSelected(e, series.id)}
															className="child-cbox"
														/>
													</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>{series.title}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>
														{/*Repeat for each creator*/}
// @ts-expect-error TS(7006): Parameter 'organizer' implicitly has an 'any' type... Remove this comment to see the full error message
														{series.organizers.map((organizer, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
															<span className="metadata-entry" key={key}>
																{organizer}
															</span>
														))}
													</td>
													{/* Only show check if row has events, else empty cell*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<footer>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button className="cancel" onClick={() => close()}>
						{t("CANCEL")}
					</button>
				</footer>
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
// @ts-expect-error TS(7006): Parameter 'selectedSeries' implicitly has an 'any'... Remove this comment to see the full error message
	deleteMultipleSeries: (selectedSeries) =>
		dispatch(deleteMultipleSeries(selectedSeries)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteSeriesModal);
