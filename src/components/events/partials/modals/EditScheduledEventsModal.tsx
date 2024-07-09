import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { initialFormValuesEditScheduledEvents } from "../../../../configs/modalConfig";
import WizardStepper from "../../../shared/wizard/WizardStepper";
import EditScheduledEventsGeneralPage from "../ModalTabsAndPages/EditScheduledEventsGeneralPage";
import EditScheduledEventsEditPage from "../ModalTabsAndPages/EditScheduledEventsEditPage";
import EditScheduledEventsSummaryPage from "../ModalTabsAndPages/EditScheduledEventsSummaryPage";
import { usePageFunctions } from "../../../../hooks/wizardHooks";
import { getRecordings } from "../../../../selectors/recordingSelectors";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { filterDevicesForAccess } from "../../../../utils/resourceUtils";
import {
	checkSchedulingConflicts,
	checkValidityUpdateScheduleEventSelection,
} from "../../../../utils/bulkActionUtils";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
	checkForSchedulingConflicts,
	updateScheduledEventsBulk,
} from "../../../../slices/eventSlice";
import { fetchRecordings } from "../../../../slices/recordingSlice";
import { useHotkeys } from "react-hotkeys-hook";
import { availableHotkeys } from "../../../../configs/hotkeysConfig";

/**
 * This component manages the pages of the edit scheduled bulk action
 */
const EditScheduledEventsModal = ({
// @ts-expect-error TS(7031): Binding element 'close' implicitly has an 'any' ty... Remove this comment to see the full error message
	close,
}) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const inputDevices = useAppSelector(state => getRecordings(state));
	// TODO: Get rid of the wrappers when modernizing redux is done
	const checkForSchedulingConflictsWrapper = async(events: any) => {
		return dispatch(checkForSchedulingConflicts(events));
	}

	const initialValues = initialFormValuesEditScheduledEvents;

	const {
		snapshot,
		page,
		nextPage,
		previousPage,
		setPage,
		pageCompleted,
		setPageCompleted,
	} = usePageFunctions(0, initialValues);

	// for edit page: conflicts with other events
	const [conflicts, setConflicts] = useState([]);

	const user = useAppSelector(state => getUserInformation(state));

	useHotkeys(
		availableHotkeys.general.CLOSE_MODAL.sequence,
		() => close(),
		{ description: t(availableHotkeys.general.CLOSE_MODAL.description) ?? undefined },
		[close],
  	);

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
				checkForSchedulingConflictsWrapper,
				dispatch
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
			const response = dispatch(updateScheduledEventsBulk(values));
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
										// @ts-expect-error: Type-checking gets confused by redux-connect in the child
											formik={formik}
										// @ts-expect-error: Type-checking gets confused by redux-connect in the child
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

export default EditScheduledEventsModal;
