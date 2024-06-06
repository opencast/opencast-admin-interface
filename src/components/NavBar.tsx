import React from "react";

/**
 * Component that renders the nav bar
 */
const NavBar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<section className="action-nav-bar" role="navigation">
			{children}
		</section>
	);
};

export default NavBar;
