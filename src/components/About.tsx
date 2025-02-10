import React, { useEffect, useState } from "react";
import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";
import MainNav from "./shared/MainNav";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import cn from "classnames";
import axios from 'axios';
import i18n from "../i18n/i18n";
import DOMPurify from "dompurify";

const About: React.FC = () => {
	const { t } = useTranslation();
	const location = useLocation();

	const [displayNavigation, setNavigation] = useState(false);
	const [aboutContent, setAboutContent] = useState<string>("");

	const toggleNavigation = () => {
		setNavigation(!displayNavigation);
	};

	useEffect(() => {
		const getURL = (language: string) => {
			return `/ui/config/admin-ui/${location.pathname.split("/").pop()}.${language}.html`;
		};

		axios.get(getURL(i18n.language))
			.then(response => {
				setAboutContent(response.data);
			})
			.catch(error => {
				axios.get(getURL(typeof i18n.options.fallbackLng === 'string' ? i18n.options.fallbackLng : 'en-US'))
					.then(response => {
						setAboutContent(response.data);
					})
					.catch(error => {
						console.error('Error while fetching data:', error);
						setAboutContent(t("ABOUT.NOCONTENT").toString());
					});
			});
           // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname]); // Listen to changes in pathname

	return (
		<span>
			<Header />
			<NavBar>
				<MainNav isOpen={displayNavigation} toggleMenu={toggleNavigation} />
				<nav>
					<Link to="/about/imprint" className={cn({ active: location.pathname === "/about/imprint" })} onClick={() => { }}>{t("ABOUT.IMPRINT")}</Link>
					<Link to="/about/privacy" className={cn({ active: location.pathname === "/about/privacy" })} onClick={() => { }}>{t("ABOUT.PRIVACY")}</Link>
				</nav>
			</NavBar>
			<div className="about">
				<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(aboutContent) }} ></div>
			</div>
			<Footer />
		</span>
	);
};

export default About;
