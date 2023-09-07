import React from "react";
import { useTranslation } from "react-i18next";

/**
 * This component renders the access table containing access rules provided by user before in wizard summary pages
 */
const AccessSummaryTable = ({
    policies,
    header
}: any) => {
	const { t } = useTranslation();

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="obj tbl-list">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<header className="no-expand">{t(header)}</header>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<table className="main-tbl">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					<tr>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<th className="fit">
							{t("EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.ROLE")}
						</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<th className="fit">
							{t("EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.READ")}
						</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<th className="fit">
							{t("EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.WRITE")}
						</th>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<th className="fit">
							{t("EVENTS.SERIES.NEW.ACCESS.ACCESS_POLICY.ADDITIONAL_ACTIONS")}
						</th>
					</tr>
				</thead>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<tbody>
					{/*Insert row for each policy user has provided*/}
// @ts-expect-error TS(7006): Parameter 'policy' implicitly has an 'any' type.
					{policies.map((policy, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
						<tr key={key}>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td>{policy.role}</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td className="fit">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<input type="checkbox" disabled checked={policy.read} />
							</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td className="fit">
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
								<input type="checkbox" disabled checked={policy.write} />
							</td>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
							<td className="fit">
								{/*repeat for each additional action*/}
// @ts-expect-error TS(7006): Parameter 'action' implicitly has an 'any' type.
								{policy.actions.map((action, key) => (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
									<div key={key}>{action}</div>
								))}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default AccessSummaryTable;
