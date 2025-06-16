import { t } from "i18next";
import ButtonLikeAnchor from "./ButtonLikeAnchor";


const SearchContainer = ({
	value,
	handleChange,
	clearSearchField,
	isExpand,
	isInModal,
	isDisabled,
	style,
}: {
	value: string
	handleChange: (value: string) => unknown
	clearSearchField: () => unknown
	isExpand?: boolean
	isInModal?: boolean
	isDisabled?: boolean
	style?: object
}) => {

	let containerClassName = "search-container";
	if (isExpand) {
		containerClassName = containerClassName + " expand";
	}
	if (isInModal) {
		containerClassName = containerClassName + " modal";
	}
	let inputClassName = "search";
		if (isDisabled) {
		inputClassName = inputClassName + " disabled"
	}
	if (!value) {
		inputClassName = inputClassName + " fullwidth";
	}
	let buttonClassName = "clear";
	if (isDisabled) {
		buttonClassName = buttonClassName + " disabled"
	}

	return (
		<div className={containerClassName} style={style}>
			{value && <ButtonLikeAnchor
				extraClassName={buttonClassName}
				onClick={() => clearSearchField()}
				disabled={isDisabled}
			/>}
			<input
				type="text"
				className={inputClassName}
				placeholder={t("TABLE_FILTERS.PLACEHOLDER")}
				onChange={(e) => handleChange(e.target.value)}
				name="textFilter"
				value={value}
				disabled={isDisabled}
			/>
		</div>
	);
};

export default SearchContainer;
