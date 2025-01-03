import { FormikProps } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * This component renders the effective role tab of the user details modal
 */
interface RequiredFormProps {
	roles: {
		name: string
	}[]
}

const UserEffectiveRolesTab = <T extends RequiredFormProps>({
	formik
}: {
	formik: FormikProps<T>
}) => {
	const { t } = useTranslation();

	const [searchField, setSearchField] = useState("");
	const [defaultItems] = useState(formik.values.roles);
	const [items, setItems] = useState(formik.values.roles);

	const clearSearchField = () => {
		setSearchField("");
		setItems(defaultItems);
	};

	const handleChangeSearch = async (input: string) => {
		const filtered = defaultItems.filter((item) => {
			return item.name.toLowerCase().includes(input.toLowerCase());
		});
		setSearchField(input);
		setItems(filtered);
	};

	return (
		<div className="modal-content">
			<div className="modal-body">
				<div className="form-container multi-select-container">
					<label>{t("USERS.USERS.DETAILS.TABS.EFFECTIVEROLES")}</label>
					<p>{t("USERS.USERS.DETAILS.DESCRIPTION.EFFECTIVEROLES")}</p>

					{/* list  all roles a user got */}
					<div className="search-container">
						<button className="button-like-anchor clear" onClick={() => clearSearchField()} />
						<input
							type="text"
							id="search_effective"
							className="search"
							value={searchField}
							onChange={(e) => handleChangeSearch(e.target.value)}
							placeholder={t("TABLE_FILTERS.PLACEHOLDER")}
						/>
					</div>

					<select multiple style={{ height: "26em" }}>
						{items.map((item, key) => (
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
