import React from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { hasAccess } from "../../../utils/utils";
import { useAppSelector } from "../../../store";

/**
 * This component renders the navigation in details modals
 */
const ModalNavigation = ({
    tabInformation,
    page,
    openTab,
}: any) => {
	const { t } = useTranslation();

	const user = useAppSelector(state => getUserInformation(state));

	return (
		<nav className="modal-nav" id="modal-nav">
			{tabInformation.map(
// @ts-expect-error TS(7006): Parameter 'tab' implicitly has an 'any' type.
				(tab, key) =>
					hasAccess(tab.accessRole, user) && (
						<button
							key={key}
							className={"button-like-anchor " + cn({ active: page === key })}
							onClick={() => openTab(key)}
						>
							{t(tab.tabTranslation)}
						</button>
					)
			)}
		</nav>
	);
};

export default ModalNavigation;
