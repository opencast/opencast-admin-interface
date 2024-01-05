import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { initialFormValuesEditScheduledEvents } from "../../../../configs/modalConfig";
import WizardStepper from "../../../shared/wizard/WizardStepper";
import EditScheduledEventsGeneralPage from "../ModalTabsAndPages/EditScheduledEventsGeneralPage";
import EditScheduledEventsEditPage from "../ModalTabsAndPages/EditScheduledEventsEditPage";
import EditScheduledEventsSummaryPage from "../ModalTabsAndPages/EditScheduledEventsSummaryPage";
import {
	checkForSchedulingConflicts,
	updateScheduledEventsBulk,
} from "../../../../thunks/eventThunks";
import { connect } from "react-redux";
import { usePageFunctions } from "../../../../hooks/wizardHooks";
import { getRecordings } from "../../../../selectors/recordingSelectors";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { filterDevicesForAccess } from "../../../../utils/resourceUtils";
import {
	checkSchedulingConflicts,
	checkValidityUpdateScheduleEventSelection,
} from "../../../../utils/bulkActionUtils";
import { addNotification } from "../../../../thunks/notificationThunks";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { fetchRecordings } from "../../../../slices/recordingSlice";

/**
 * This component manages the pages of the edit scheduled bulk action
 */
const EditScheduledEventsModal = ({
// @ts-expect-error TS(7031): Binding element 'close' implicitly has an 'any' ty... Remove this comment to see the full error message
	close,
// @ts-expect-error TS(7031): Binding element 'updateScheduledEventsBulk' implic... Remove this comment to see the full error message
	updateScheduledEventsBulk,
// @ts-expect-error TS(7031): Binding element 'checkForSchedulingConflicts' impl... Remove this comment to see the full error message
	checkForSchedulingConflicts,
// @ts-expect-error TS(7031): Binding element 'addNotification' implicitly has a... Remove this comment to see the full error message
	addNotification,
// @ts-expect-error TS(7031): Binding element 'user' implicitly has an 'any' typ... Remove this comment to see the full error message
	user,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const inputDevices = useAppSelector(state => getRecordings(state));

	const initialValues = initialFormValuesEditScheduledEvents;

	const [
		snapshot,
		page,
		nextPage,
		previousPage,
		setPage,
		pageCompleted,
		setPageCompleted,
	] = usePageFunctions(0, initialValues);

	// for edit page: conflicts with other events
	const [conflicts, setConflicts] = useState([]);

	useEffect(() => {
		// Load recordings that can be used for input
		dispatch(fetchRecordings("inputs"));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const steps = [
		{
			translation: "BULK_ACTIONS.EDIT_EVENTS.GENERAL.CAPTION",
			name: "general",
		},
		{
			translation: "BULK_ACTIONS.EDIT_EVENTS.EDIT.CAPTION",
			name: "edit",
		},
		{
			translation: "BULK_ACTIONS.EDIT_EVENTS.SUMMARY.CAPTION",
			name: "summary",
		},
	];

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const validateFormik = (values) => {
		const errors = {};
		if (!checkValidityUpdateScheduleEventSelection(values, user)) {
// @ts-expect-error TS(2339): Property 'events' does not exist on type '{}'.
			errors.events = "Not all events editable!";
		}
		if (steps[page].name !== "general") {
			return checkSchedulingConflicts(
				values,
				setConflicts,
				checkForSchedulingConflicts,
				addNotification
			).then((result) => {
				const errors = {};
				if (!result) {
// @ts-expect-error TS(2339): Property 'editedEvents' does not exist on type '{}... Remove this comment to see the full error message
					errors.editedEvents = "Scheduling conflicts exist!";
				}
				return errors;
			});
		} else {
			return errors;
		}
	};

// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	const handleSubmit = (values) => {
		// Only update events if there are changes
		if (values.changedEvents.length > 0) {
			const response = updateScheduledEventsBulk(values);
			console.info(response);
		}
		close();
	};

	return (
		<>
			<div className="modal-animation modal-overlay" />
			<section className="modal wizard modal-animation">
				<header>
					<button className="button-like-anchor fa fa-times close-modal" onClick={() => close()} />
					<h2>{t("BULK_ACTIONS.EDIT_EVENTS.CAPTION")}</h2>
				</header>

				{/* Initialize overall form */}
				<Formik
					initialValues={snapshot}
					validate={(values) => validateFormik(values)}
					onSubmit={(values) => handleSubmit(values)}
				>
					{/* Render wizard pages depending on current value of page variable */}
					{(formik) => {
						// eslint-disable-next-line react-hooks/rules-of-hooks
						useEffect(() => {
							formik.validateForm().then();
							// eslint-disable-next-line react-hooks/exhaustive-deps
						}, [page]);

						return (
							<>
								{/* Stepper that shows each step of wizard as header */}
								<WizardStepper
									steps={steps}
									page={page}
									setPage={setPage}
									completed={pageCompleted}
									setCompleted={setPageCompleted}
									formik={formik}
								/>
								<div>
									{page === 0 && (
										<EditScheduledEventsGeneralPage
											formik={formik}
											nextPage={nextPage}
										/>
									)}
									{page === 1 && (
										<EditScheduledEventsEditPage
											formik={formik}
											nextPage={nextPage}
											previousPage={previousPage}
											conflictState={{ conflicts, setConflicts }}
											inputDevices={filterDevicesForAccess(user, inputDevices)}
											setPageCompleted={setPageCompleted}
										/>
									)}
									{page === 2 && (
										<EditScheduledEventsSummaryPage
											formik={formik}
											previousPage={previousPage}
										/>
									)}
								</div>
							</>
						);
					}}
				</Formik>
			</section>
		</>
	);
};

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	user: getUserInformation(state),
});

// Mapping actions to dispatch
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
// @ts-expect-error TS(7006): Parameter 'events' implicitly has an 'any' type.
	checkForSchedulingConflicts: (events) =>
		dispatch(checkForSchedulingConflicts(events)),
// @ts-expect-error TS(7006): Parameter 'type' implicitly has an 'any' type.
	addNotification: (type, key, duration, parameter, context) =>
		dispatch(addNotification(type, key, duration, parameter, context)),
// @ts-expect-error TS(7006): Parameter 'values' implicitly has an 'any' type.
	updateScheduledEventsBulk: (values) =>
		dispatch(updateScheduledEventsBulk(values)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditScheduledEventsModal);
