import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// @ts-expect-error TS(6142): Module '../../../shared/wizard/WizardNavigationBut... Remove this comment to see the full error message
import WizardNavigationButtons from "../../../shared/wizard/WizardNavigationButtons";
import { getMetadataCollectionFieldName } from "../../../../utils/resourceUtils";
import { connect } from "react-redux";
import { getSchedulingSeriesOptions } from "../../../../selectors/eventSelectors";

/**
 * This component renders the summary page of the edit scheduled bulk action
 */
const EditScheduledEventsSummaryPage = ({
// @ts-expect-error TS(7031): Binding element 'previousPage' implicitly has an '... Remove this comment to see the full error message
	previousPage,
// @ts-expect-error TS(7031): Binding element 'formik' implicitly has an 'any' t... Remove this comment to see the full error message
	formik,
// @ts-expect-error TS(7031): Binding element 'seriesOptions' implicitly has an ... Remove this comment to see the full error message
	seriesOptions,
}) => {
	const { t } = useTranslation();

	// Changes applied to events
	const [changes, setChanges] = useState([]);

	useEffect(() => {
		// Check on mount if changes on events where applied on page before
		checkForChanges();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const checkForChanges = () => {
		let changed = [];

		// Loop through each event selected for editing and compare original values and changed values
		for (let i = 0; i < formik.values.editedEvents.length; i++) {
			let event = formik.values.editedEvents[i];
			let eventChanges = {
				eventId: event.eventId,
				title: event.title,
				changes: [],
			};
			if (isChanged(event.title, event.changedTitle)) {
				eventChanges.changes.push({
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
					type: "EVENTS.EVENTS.DETAILS.METADATA.TITLE",
// @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
					previous: event.title,
// @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
					next: event.changedTitle,
				});
			}
			if (isChanged(event.series, event.changedSeries)) {
				eventChanges.changes.push({
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
					type: "EVENTS.EVENTS.DETAILS.METADATA.SERIES",
// @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
					previous: getMetadataCollectionFieldName(
						{ collection: seriesOptions },
						{ value: event.series }
					),
// @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
					next: getMetadataCollectionFieldName(
						{ collection: seriesOptions },
						{ value: event.changedSeries }
					),
				});
			}
			if (
				isChanged(
					event.startTimeHour + ":" + event.startTimeMinutes,
					event.changedStartTimeHour + ":" + event.changedStartTimeMinutes
				)
			) {
				eventChanges.changes.push({
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
					type: "EVENTS.EVENTS.TABLE.START",
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
					previous: event.startTimeHour + ":" + event.startTimeMinutes,
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
					next:
						event.changedStartTimeHour + ":" + event.changedStartTimeMinutes,
				});
			}
			if (
				isChanged(
					event.endTimeHour + ":" + event.endTimeMinutes,
					event.changedEndTimeHour + ":" + event.changedEndTimeMinutes
				)
			) {
				eventChanges.changes.push({
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
					type: "EVENTS.EVENTS.TABLE.END",
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
					previous: event.endTimeHour + ":" + event.endTimeMinutes,
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
					next: event.changedEndTimeHour + ":" + event.changedEndTimeMinutes,
				});
			}
			if (isChanged(event.location, event.changedLocation)) {
				eventChanges.changes.push({
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
					type: "EVENTS.EVENTS.TABLE.LOCATION",
// @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
					previous: event.location,
// @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
					next: event.changedLocation,
				});
			}
			/* the following six lines can be commented in, when the possibility of a selection of individual inputs is desired and the backend has been adapted to support it
            if (isArrayChanged(event.deviceInputs.split(','), event.changedDeviceInputs)){
                eventChanges.changes.push({
                    type: 'EVENTS.EVENTS.DETAILS.SOURCE.PLACEHOLDER.INPUTS',
                    previous: event.deviceInputs,
                    next: event.changedDeviceInputs.join(',')
                });
            }*/
			if (isChanged(event.weekday, event.changedWeekday)) {
				eventChanges.changes.push({
// @ts-expect-error TS(2322): Type 'string' is not assignable to type 'never'.
					type: "EVENTS.EVENTS.TABLE.WEEKDAY",
					previous: t("EVENTS.EVENTS.NEW.WEEKDAYSLONG." + event.weekday),
					next: t("EVENTS.EVENTS.NEW.WEEKDAYSLONG." + event.changedWeekday),
				});
			}

			// If there were changes push them to changed array
			if (eventChanges.changes.length > 0) {
				changed.push(eventChanges);
				// Keep ids of changed events (used later)
				formik.setFieldValue(
					"changedEvent",
					formik.values.changedEvents.push(event.eventId)
				);
			}
		}

		// Set changes state
// @ts-expect-error TS(2345): Argument of type '{ eventId: any; title: any; chan... Remove this comment to see the full error message
		setChanges(changed);
	};

	// Compare two values
// @ts-expect-error TS(7006): Parameter 'oldValue' implicitly has an 'any' type.
	const isChanged = (oldValue, newValue) => {
		return oldValue !== newValue;
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-content active">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="modal-body">
					{changes.length > 0 ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="full-col">
							{/*Repeat for each changed event*/}
							{changes.map((event, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<div key={key} className="obj tbl-list">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<header>
										{t(
											"BULK_ACTIONS.EDIT_EVENTS.SUMMARY.SINGLE_EVENT_CAPTION",
// @ts-expect-error TS(2339): Property 'title' does not exist on type 'never'.
											{ title: event.title }
										)}
									</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div className="obj-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
										<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
												<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<th className="fit">
														{t("BULK_ACTIONS.EDIT_EVENTS.SUMMARY.TYPE")}
													</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<th className="fit">
														{t("BULK_ACTIONS.EDIT_EVENTS.SUMMARY.PREVIOUS")}
													</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<th className="fit">
														{t("BULK_ACTIONS.EDIT_EVENTS.SUMMARY.NEXT")}
													</th>
												</tr>
											</thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
											<tbody>
												{/* Add table row with old value and new one if something has changed */}
// @ts-expect-error TS(2339): Property 'changes' does not exist on type 'never'.
												{event.changes.map((row, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
													<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td>{t(row.type)}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td>{row.previous}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
														<td className="highlighted-cell">{row.next}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							))}
						</div>
					) : (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<div className="row">
							{/* Show only if there no changes*/}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<div className="alert sticky warning">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<p>{t("BULK_ACTIONS.EDIT_EVENTS.GENERAL.NOCHANGES")}</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Navigation buttons */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<WizardNavigationButtons
				isLast
				formik={formik}
				previousPage={previousPage}
			/>
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	seriesOptions: getSchedulingSeriesOptions(state),
});

export default connect(mapStateToProps, null)(EditScheduledEventsSummaryPage);
