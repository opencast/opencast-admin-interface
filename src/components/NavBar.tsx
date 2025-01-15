import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { hasAccess } from "../utils/utils";
import { AppDispatch, useAppDispatch, useAppSelector } from "../store";
import { getUserInformation } from "../selectors/userInfoSelectors";
import cn from "classnames";
import { useTranslation } from "react-i18next";
import MainNav from "./shared/MainNav";
import { setOffset } from "../slices/tableSlice";
import NewResourceModal, { NewResource } from "./shared/NewResourceModal";
import { useHotkeys } from "react-hotkeys-hook";

/**
 * Component that renders the nav bar
 */
type LinkType = {
	path: string
	accessRole: string
	loadFn: (dispatch: AppDispatch) => void
	text: string
}

type CreateType = {
	accessRole: string
	onShowModal?: () => Promise<void>
	onHideModal?: () => void
	text: string
	isDisplay?: boolean
	resource: NewResource
	hotkeySequence?: string[]
	hotkeyDescription?: string
}

const NavBar = ({
	children,
	navAriaLabel,
	displayNavigation,
	setNavigation,
	links,
	create,
} : {
	children?: React.ReactNode
	navAriaLabel?: string
	displayNavigation: boolean
	setNavigation: React.Dispatch<React.SetStateAction<boolean>>
	links: LinkType[]
	create?: CreateType
}) => {

	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const location = useLocation();

	const user = useAppSelector(state => getUserInformation(state));

	const [displayNewResourceModal, setNewResourceModal] = useState(false);

	const showNewResourceModal = async () => {
		create && create.onShowModal && await create.onShowModal()
		setNewResourceModal(true);
	};

	const hideNewResourceModal = () => {
		create && create.onHideModal && create.onHideModal()
		setNewResourceModal(false);
	};

	const toggleNavigation = () => {
		setNavigation(!displayNavigation);
	};

	useHotkeys(
		(create && create.hotkeySequence) ?? [],
		() => showNewResourceModal(),
		{ description: t((create && create.hotkeyDescription) ?? "") ?? undefined },
		[showNewResourceModal]
	);

	return (
		<section className="action-nav-bar" role="navigation">
			{/* Display modal for new resource if add button is clicked */}
			{ create && (create.isDisplay === undefined || create.isDisplay) && displayNewResourceModal &&
				<NewResourceModal
					handleClose={hideNewResourceModal}
					resource={create.resource}
				/>
			}

			{/* Include Burger-button menu */}
			<MainNav isOpen={displayNavigation} toggleMenu={toggleNavigation} />

			<nav aria-label={navAriaLabel && t(navAriaLabel)}>
				{links.map((link) =>
					{return (hasAccess(link.accessRole, user) && (
						<Link
							to={link.path}
							className={cn({ active: location.pathname === link.path })}
							onClick={() => {
								if (location.pathname !== link.path) {
									// Reset the current page to first page
									dispatch(setOffset(0));
								}
								link.loadFn(dispatch)
							}}
						>
							{t(link.text)}
						</Link>
					))}
				)}
			</nav>

			{children}

			{create &&
				<div className="btn-group">
					{hasAccess(create.accessRole, user) && (
						<button
							className="add"
							onClick={showNewResourceModal}
						>
							<i className="fa fa-plus" />
							<span>{t(create.text)}</span>
						</button>
					)}
				</div>
			}
		</section>
	);
};

export default NavBar;
