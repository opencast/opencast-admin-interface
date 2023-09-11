import React from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { getUserInformation } from "../../../selectors/userInfoSelectors";
import { connect } from "react-redux";
import { hasAccess } from "../../../utils/utils";

/**
 * This component renders the navigation in details modals
 */
const ModalNavigation = ({
    tabInformation,
    page,
    openTab,
    user
}: any) => {
	const { t } = useTranslation();

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

// Getting state data out of redux store
// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({
	user: getUserInformation(state),
});

export default connect(mapStateToProps)(ModalNavigation);
