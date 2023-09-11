import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { useField } from "formik";

/**
 * This component renders the select container used for roles and user pages in new group and new user pages.
 */
const SelectContainer = ({
    resource,
    formikField,
    manageable = true
}: any) => {
	const { t } = useTranslation();

	// Formik hook for getting data of specific form field
	// DON'T delete field and meta, hook works with indices not variable names
	// eslint-disable-next-line no-unused-vars
	const [field, meta, helpers] = useField(formikField);

	// Search field for filter options/items
	const [searchField, setSearchField] = useState("");
	const [defaultItems, setDefaultItems] = useState([]);
	// arrays an item can be part of depending on its state
	const [items, setItems] = useState([]);
	const [selectedItems, setSelectedItems] = useState(field.value);
	const [markedForAddition, setMarkedForAddition] = useState([]);
	const [markedForRemoval, setMarkedForRemoval] = useState([]);

	let initialItems = resource.items;

	useEffect(() => {
		// Makes sure that options user already chosen are only shown in right select
		// when coming back again from other page
		// no field value yet --> skip for loop and use all provided items for left
		if (selectedItems.length > 0) {
			for (let i = 0; i < selectedItems.length; i++) {
				remove(selectedItems[i].name, initialItems);
			}
		}

		setItems(initialItems);
		setDefaultItems(initialItems);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const disabledStyle = {
		backgroundColor: "#eeeff0",
	};

	const disabledSelectStyle = {
		backgroundColor: "#eeeff0",
	};

	const clearSearchField = () => {
		setSearchField("");
		setItems(defaultItems);
	};

// @ts-expect-error TS(7006): Parameter 'input' implicitly has an 'any' type.
	const handleChangeSearch = async (input) => {
		const filtered = defaultItems.filter((item) => {
// @ts-expect-error TS(2339): Property 'name' does not exist on type 'never'.
			return item.name.toLowerCase().includes(input.toLowerCase());
		});
		setSearchField(input);
		setItems(filtered);
	};

// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const handleChangeAdd = (e) => {
		let options = e.target.options;
		let selectedOptions = [];

		// put marked options in array
		for (let i = 0; i < options.length; i++) {
			if (options[i].selected) {
				selectedOptions.push(options[i].value);
			}
		}

		// set currently chosen options
// @ts-expect-error TS(2345): Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
		setMarkedForAddition(selectedOptions);
	};

// @ts-expect-error TS(7006): Parameter 'e' implicitly has an 'any' type.
	const handleChangeRemove = (e) => {
		let options = e.target.options;
		let deselectedOptions = [];

		// put all marked options in array
		for (let i = 0; i < options.length; i++) {
			if (options[i].selected) {
				deselectedOptions.push(options[i].value);
			}
		}

		// mark currently marked options for removal
// @ts-expect-error TS(2345): Argument of type 'any[]' is not assignable to para... Remove this comment to see the full error message
		setMarkedForRemoval(deselectedOptions);
	};

	const handleClickAdd = () => {
		let editableItems = [...items];
		let editableSelectedItems = [...selectedItems];
		let editableDefaultItems = [...defaultItems];

		// move marked items to selected items
		for (let i = 0; i < markedForAddition.length; i++) {
			move(markedForAddition[i], editableItems, editableSelectedItems);

			// remove marked item from items considered for search bar
			remove(markedForAddition[i], editableDefaultItems);
		}

		// update state with current values
		setSelectedItems(editableSelectedItems);
		setItems(editableItems);
		setMarkedForAddition([]);
		// update items considered for search bar
		setDefaultItems(editableDefaultItems);
		//update formik field
		helpers.setValue(editableSelectedItems);
	};

	const handleClickRemove = () => {
		let editableItems = [...items];
		let editableSelectedItems = [...selectedItems];
		let editableDefaultItems = [...defaultItems];

		// move marked items from selected items back to items
		for (let i = 0; i < markedForRemoval.length; i++) {
			move(markedForRemoval[i], editableSelectedItems, editableItems);

			// add marked item to items considered for search bar if not already containing
			if (
// @ts-expect-error TS(2339): Property 'name' does not exist on type 'never'.
				!editableDefaultItems.some((item) => item.name === markedForRemoval[i])
			) {
// @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
				editableDefaultItems.push({
// @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
					id: !!markedForRemoval[i].id ? markedForRemoval.id : "",
					name: markedForRemoval[i],
				});
			}
		}

		// update state with current values
		setSelectedItems(editableSelectedItems);
		setItems(editableItems);
		setMarkedForRemoval([]);
		// update items considered for search bar
		setDefaultItems(editableDefaultItems);
		// update formik field
		helpers.setValue(editableSelectedItems);
	};

	// move item from one array to another when matching key
// @ts-expect-error TS(7006): Parameter 'key' implicitly has an 'any' type.
	const move = (key, from, to) => {
		for (let i = 0; i < from.length; i++) {
			if (from[i].name === key) {
				to.push(from[i]);
				from.splice(i, 1);
				return;
			}
		}
	};

	// remove item from array when matching key
// @ts-expect-error TS(7006): Parameter 'key' implicitly has an 'any' type.
	const remove = (key, compare) => {
		for (let i = 0; i < compare.length; i++) {
			if (compare[i].name === key) {
				compare.splice(i, 1);
				return;
			}
		}
	};

	return (
		<div className="row">
			<div className="multi-select-container offset-col-2">
				<div className="multi-select-col">
					<div className="row">
						<label>
							{t(resource.label + ".LEFT")}
							<i className="required" />
						</label>
						{/*Search*/}
						{resource.searchable && (
							<>
								{/* search bar */}
								<button className="button-like-anchor clear" onClick={() => clearSearchField()} />
								<input
									type="text"
									id="search"
									className="search"
									disabled={!manageable}
									style={manageable ? {} : disabledStyle}
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
									placeholder={t("TABLE_FILTERS.PLACEHOLDER")}
									onChange={(e) => handleChangeSearch(e.target.value)}
									value={searchField}
								/>
							</>
						)}
						{/*Select with options provided by backend*/}
						<select
							multiple
							className="available"
							disabled={!manageable}
							style={manageable ? { minHeight: "11em" } : disabledSelectStyle}
							value={markedForAddition}
							onChange={(e) => handleChangeAdd(e)}
						>
							{items.map((item, key) => (
// @ts-expect-error TS(2339): Property 'name' does not exist on type 'never'.
								<option key={key} value={item.name}>
{/* @ts-expect-error TS(2339): Property 'name' does not exist on type 'never'. */}
									{item.name}
								</option>
							))}
						</select>
					</div>
					<div className="row">
						<div className="button-container">
							<button
								className={cn("submit", {
									disabled: !markedForAddition.length || !manageable,
								})}
								onClick={() => handleClickAdd()}
							>
								{t(resource.label + ".ADD")}
							</button>
						</div>
					</div>
				</div>

				<div className="exchange-icon" />

				{/*Select with options chosen by user*/}
				<div className="multi-select-col">
					<div className="row">
						<label>{t(resource.label + ".RIGHT")}</label>
						<select
							multiple
							className="selected"
							disabled={!manageable}
							style={manageable ? { minHeight: "11em" } : disabledSelectStyle}
							onChange={(e) => handleChangeRemove(e)}
							value={markedForRemoval}
						>
{/* @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type. */}
							{selectedItems.map((item, key) => (
								<option key={key} value={item.name}>
									{item.name}
								</option>
							))}
						</select>
					</div>
					<div className="row">
						<div className="button-container">
							<button
								className={cn("remove", {
									disabled: !markedForRemoval.length || !manageable,
								})}
								onClick={() => handleClickRemove()}
							>
								{t(resource.label + ".REMOVE")}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SelectContainer;
