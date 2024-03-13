import React, { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import MainNav from "../shared/MainNav";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import cn from "classnames";
import axios from 'axios';
import i18n from "../../i18n/i18n";


const Imprint: React.FC = () => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const [displayNavigation, setNavigation] = useState(false);
    const [imprintContent, setImprintContent] = useState<string>("");
	
	const toggleNavigation = () => {
		setNavigation(!displayNavigation);
	};

    useEffect(() => {
		axios.get("ui/config/admin-ui/imprint." + i18n.language + ".html")
			.then(response => {
				setImprintContent(response.data);
			})
			.catch(error => {
				axios.get("ui/config/admin-ui/imprint." + i18n.options.fallbackLng + ".html")
				.then(response => {
					setImprintContent(response.data);
				})
				.catch(error => {
					console.error('Fehler beim Laden des Inhalts:', error);
				});
			});
	}, []);

	return (
        <span>
			<Header />
            <section className="action-nav-bar">
				<MainNav isOpen={displayNavigation} toggleMenu={toggleNavigation} />
				<nav>
					<Link to="/about/imprint" className={cn({ active: true })} onClick={() => {}}>{t("IMPRINT")}</Link>
                    <Link to="/about/privacy" className={cn({ active: false })} onClick={() => {}}>{t("PRIVACY")}</Link>
                </nav>
            </section>
			<div className="about">
                <div dangerouslySetInnerHTML={{ __html: imprintContent }} ></div>
			</div>
			<Footer />
		</span>
    );
};

// @ts-expect-error TS(7006): Parameter 'state' implicitly has an 'any' type.
const mapStateToProps = (state) => ({});

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Imprint);
