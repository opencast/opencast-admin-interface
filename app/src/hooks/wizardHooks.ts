import { useEffect, useState } from "react";

export const usePageFunctions = <initialValuesType>(initialPage: number, initialValues: initialValuesType) => {
	const [page, setPage] = useState(initialPage);
	const [snapshot, setSnapshot] = useState(initialValues);
	const [pageCompleted, setPageCompleted] = useState<{ [key: number]: boolean }>({});

	const nextPage = (values: initialValuesType) => {
		setSnapshot(values);

		// set page as completely filled out
		let updatedPageCompleted = pageCompleted;
		updatedPageCompleted[page] = true;
		setPageCompleted(updatedPageCompleted);

		setPage(page + 1);
	};

	const previousPage = (values: initialValuesType) => {
		setSnapshot(values);
		setPage(page - 1);
	};

	return {
		snapshot,
		page,
		nextPage,
		previousPage,
		setPage,
		pageCompleted,
		setPageCompleted,
	};
};

// @ts-expect-error TS(7006): Parameter 'formik' implicitly has an 'any' type.
export const useSelectionChanges = (formik, selectedRows) => {
	const [selectedEvents, setSelectedEvents] = useState(
		formik.values.events.length === 0 ? selectedRows : formik.values.events
	);
	const [allChecked, setAllChecked] = useState(
		formik.values.events.length === 0
			? true
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
			: formik.values.events.every((event) => event.selected === true)
	);

	// Select or deselect all rows in table
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const onChangeAllSelected = (e) => {
		const selected = e.target.checked;
		setAllChecked(selected);
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
		let changedSelection = selectedEvents.map((event) => {
			return {
				...event,
				selected: selected,
			};
		});
		setSelectedEvents(changedSelection);
		formik.setFieldValue("events", changedSelection);
	};

	// Handle change of checkboxes indicating which events to consider further
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const onChangeSelected = (e, id) => {
		const selected = e.target.checked;
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
		let changedEvents = selectedEvents.map((event) => {
			if (event.id === id) {
				return {
					...event,
					selected: selected,
				};
			} else {
				return event;
			}
		});
		setSelectedEvents(changedEvents);
		formik.setFieldValue("events", changedEvents);

		if (!selected) {
			setAllChecked(false);
		}
// @ts-expect-error TS(7006): Parameter 'event' implicitly has an 'any' type.
		if (changedEvents.every((event) => event.selected === true)) {
			setAllChecked(true);
		}
	};

	return [selectedEvents, allChecked, onChangeSelected, onChangeAllSelected];
};

// @ts-expect-error TS(7006): Parameter 'childRef' implicitly has an 'any' type.
export const useClickOutsideField = (childRef, isFirstField) => {
	// Indicator if currently edit mode is activated
	const [editMode, setEditMode] = useState(isFirstField);

	useEffect(() => {
		// Handle click outside the field and leave edit mode
// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
		const handleClickOutside = (e) => {
			if (childRef.current && !childRef.current.contains(e.target)) {
				setEditMode(false);
			}
		};

		// Focus current field
		if (childRef && childRef.current && editMode === true) {
			childRef.current.focus();
		}

		// Adding event listener for detecting click outside
		window.addEventListener("mousedown", handleClickOutside);

		return () => {
			window.removeEventListener("mousedown", handleClickOutside);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editMode]);

	return [editMode, setEditMode];
};
