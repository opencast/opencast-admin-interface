import React, { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * This component renders the effective role tab of the user details modal
 */
const UserEffectiveRolesTab = ({
    formik
}: any) => {
	const { t } = useTranslation();

	const [searchField, setSearchField] = useState("");
	const [defaultItems] = useState(formik.values.roles);
	const [items, setItems] = useState(formik.values.roles);

	const clearSearchField = () => {
		setSearchField("");
		setItems(defaultItems);
	};

// @ts-expect-error TS(7006): Parameter 'input' implicitly has an 'any' type.
	const handleChangeSearch = async (input) => {
// @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
		const filtered = defaultItems.filter((item) => {
			return item.name.toLowerCase().includes(input.toLowerCase());
		});
		setSearchField(input);
		setItems(filtered);
	};

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="modal-content">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<div className="modal-body">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<div className="form-container multi-select-container">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<label>{t("USERS.USERS.DETAILS.TABS.EFFECTIVEROLES")}</label>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<p>{t("USERS.USERS.DETAILS.DESCRIPTION.EFFECTIVEROLES")}</p>

					{/* list  all roles a user got */}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<button className="button-like-anchor clear" onClick={() => clearSearchField()} />
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<input
						type="text"
						id="search_effective"
						className="search"
						value={searchField}
						onChange={(e) => handleChangeSearch(e.target.value)}
// @ts-expect-error TS(2322): Type 'DefaultTFuncReturn' is not assignable to typ... Remove this comment to see the full error message
						placeholder={t("TABLE_FILTERS.PLACEHOLDER")}
					/>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<select multiple style={{ height: "26em" }}>
// @ts-expect-error TS(7006): Parameter 'item' implicitly has an 'any' type.
						{items.map((item, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<option key={key} value={item.name}>
								{item.name}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
};

export default UserEffectiveRolesTab;
