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
const EventDetailsTabHierarchyNavigation = ({
// @ts-expect-error TS(7031): Binding element 'openSubTab' implicitly has an 'an... Remove this comment to see the full error message
	openSubTab,
// @ts-expect-error TS(7031): Binding element 'hierarchyDepth' implicitly has an... Remove this comment to see the full error message
	hierarchyDepth,
	translationKey0 = "",
// @ts-expect-error TS(7031): Binding element 'subTabArgument0' implicitly has a... Remove this comment to see the full error message
	subTabArgument0,
	translationKey1 = "",
// @ts-expect-error TS(7031): Binding element 'subTabArgument1' implicitly has a... Remove this comment to see the full error message
	subTabArgument1,
	translationKey2 = "",
// @ts-expect-error TS(7031): Binding element 'subTabArgument2' implicitly has a... Remove this comment to see the full error message
	subTabArgument2,
}) => {
	const { t } = useTranslation();

	/* Hierarchy navigation */
	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<nav className="scope" style={style_nav}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<span style={style_nav_hierarchy_inactive}> > </span>
				)}
			</button>
			{hierarchyDepth > 0 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<span style={style_nav_hierarchy_inactive}> > </span>
					)}
				</button>
			)}
			{hierarchyDepth > 1 && (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
