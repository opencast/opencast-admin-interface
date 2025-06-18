import React from "react";
import { styleNavClosed, styleNavOpen } from "../utils/componentsUtils";

/**
 * Component that renders the main view
 */
const MainView: React.FC<{ open: boolean, children: React.ReactNode }> = ({ open, children }) => {
	return (
		<main
			className="main-view"
			style={open ? styleNavOpen : styleNavClosed}
			role="main"
		>
			{children}
		</main>
	);
};

export default MainView;
