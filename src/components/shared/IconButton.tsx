import { useTranslation } from "react-i18next";
import { getUserInformation } from "../../selectors/userInfoSelectors";
import { useAppSelector } from "../../store";
import { hasAccess } from "../../utils/utils"
import { Tooltip } from "./Tooltip";
import React from "react";

export const IconButton = ({
	callback,
	iconClassname,
	editAccessRole,
	tooltipText,
	children,
}: {
	callback: () => void
	iconClassname: string
	editAccessRole?: string
	tooltipText?: string
	children?: React.ReactNode
}) => {
	const { t } = useTranslation();

	const user = useAppSelector(state => getUserInformation(state));

	if (editAccessRole && !hasAccess(editAccessRole, user)) {
		return (<></>);
	}

	return (
		<Tooltip title={tooltipText ? t(tooltipText) : undefined}>
			<button
				onClick={() => callback()}
				className={"button-like-anchor " + iconClassname}
			>
				{children}
			</button>
		</Tooltip>
	);
}
