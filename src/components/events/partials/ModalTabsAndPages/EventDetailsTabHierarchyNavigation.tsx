import { useTranslation } from "react-i18next";
import {
	style_nav,
	style_nav_hierarchy,
	style_nav_hierarchy_inactive,
} from "../../../../utils/eventDetailsUtils";
import ButtonLikeAnchor from "../../../shared/ButtonLikeAnchor";
import { ParseKeys } from "i18next";

/**
 * This component renders the navigation hierarchy for the workflow details sub-tabs of event details modal
 */
const EventDetailsTabHierarchyNavigation = <T, >({
	openSubTab,
	hierarchyDepth,
	translationKey0,
	subTabArgument0,
	translationKey1,
	subTabArgument1,
	translationKey2,
	subTabArgument2,
}: {
	openSubTab: (tabType: T) => void,
	hierarchyDepth: number,
	translationKey0: ParseKeys,
	subTabArgument0: T,
	translationKey1?: ParseKeys,
	subTabArgument1?: T,
	translationKey2?: ParseKeys,
	subTabArgument2?: T,
}) => {
	const { t } = useTranslation();

	/* Hierarchy navigation */
	return (
		<nav className="scope" style={style_nav}>
			<ButtonLikeAnchor
				extraClassName="breadcrumb-link scope"
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
			</ButtonLikeAnchor>
			{hierarchyDepth > 0 && subTabArgument1 && (
				<ButtonLikeAnchor
					extraClassName="breadcrumb-link scope"
					style={
						hierarchyDepth === 1
							? style_nav_hierarchy
							: style_nav_hierarchy_inactive
					}
					onClick={() => openSubTab(subTabArgument1)}
				>
					{translationKey1 && t(translationKey1)}
					{hierarchyDepth > 1 && (
						<span style={style_nav_hierarchy_inactive}> </span>
					)}
				</ButtonLikeAnchor>
			)}
			{hierarchyDepth > 1 && subTabArgument2 && (
				<ButtonLikeAnchor
					extraClassName="breadcrumb-link scope"
					style={style_nav_hierarchy}
					onClick={() => openSubTab(subTabArgument2)}
				>
					{translationKey2 && t(translationKey2)}
				</ButtonLikeAnchor>
			)}
		</nav>
	);
};

export default EventDetailsTabHierarchyNavigation;
