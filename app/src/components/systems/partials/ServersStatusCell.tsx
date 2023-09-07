import React from "react";

/**
 * This component renders the status cells of servers in the table view
 */
const ServersStatusCell = ({
    row
}: any) => {
	return row.online && !row.maintenance ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="circle green" />
	) : row.online && row.maintenance ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="circle yellow" />
	) : !row.online ? (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<div className="circle red" />
	) : null;
};

export default ServersStatusCell;
