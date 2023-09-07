import React from "react";
import { render } from "@testing-library/react";
// @ts-expect-error TS(6142): Module './App' was resolved to '/home/arnewilken/I... Remove this comment to see the full error message
import App from "./App";

// @ts-expect-error TS(2582): Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
test("renders learn react link", () => {
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
	const { getByText } = render(<App />);
	const linkElement = getByText(/learn react/i);
// @ts-expect-error TS(2304): Cannot find name 'expect'.
	expect(linkElement).toBeInTheDocument();
});
