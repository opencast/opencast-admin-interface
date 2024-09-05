import React from "react";
import { useTranslation } from "react-i18next";
import {
	style_nav,
	style_nav_hierarchy,
	style_nav_hierarchy_inactive,
} from "../../../../utils/eventDetailsUtils";

/**
 * This component renders the navigation hierarchy for the workflow details sub-tabs of event details modal
 */
const EventDetailsTabHierarchyNavigation = <T,>({
	openSubTab,
	hierarchyDepth,
	translationKey0 = "",
	subTabArgument0,
	translationKey1 = "",
	subTabArgument1,
	translationKey2 = "",
	subTabArgument2,
}: {
	openSubTab: (tabType: T) => void,
	hierarchyDepth: number,
	translationKey0: string,
	subTabArgument0: T,
	translationKey1?: string,
	subTabArgument1?: T,
	translationKey2?: string,
	subTabArgument2?: T,
}) => {
	const { t } = useTranslation();

	/* Hierarchy navigation */
	return (
		<nav className="scope" style={style_nav}>
			<button
				className="button-like-anchor breadcrumb-link scope"
				style={
					hierarchyDepth === 0
						? style_nav_hierarchy
						: style_nav_hierarchy_inactive
				}
				onClick={() => openSubTab(subTabArgument0)}
			>
				{t(translationKey0)}
				{hierarchyDepth > 0 && (
					<span style={style_nav_hierarchy_inactive}> </span>
				)}
			</button>
			{hierarchyDepth > 0 && subTabArgument1 && (
				<button
					className="button-like-anchor breadcrumb-link scope"
					style={
						hierarchyDepth === 1
							? style_nav_hierarchy
							: style_nav_hierarchy_inactive
					}
					onClick={() => openSubTab(subTabArgument1)}
				>
					{t(translationKey1)}
					{hierarchyDepth > 1 && (
						<span style={style_nav_hierarchy_inactive}> </span>
					)}
				</button>
			)}
			{hierarchyDepth > 1 && subTabArgument2 && (
				<button
					className="button-like-anchor breadcrumb-link scope"
					style={style_nav_hierarchy}
					onClick={() => openSubTab(subTabArgument2)}
				>
					{t(translationKey2)}
				</button>
			)}
		</nav>
	);
};

export default EventDetailsTabHierarchyNavigation;
