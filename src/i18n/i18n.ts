import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import moment from "moment";

import Backend from "i18next-xhr-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// import language files
// @ts-expect-error TS(2307): Cannot find module './org/opencastproject/adminui/... Remove this comment to see the full error message
import enGBTrans from "./org/opencastproject/adminui/languages/lang-en_GB";
// @ts-expect-error TS(2307): Cannot find module './org/opencastproject/adminui/... Remove this comment to see the full error message
import enUSTrans from "./org/opencastproject/adminui/languages/lang-en_US";
// @ts-expect-error TS(2307): Cannot find module './org/opencastproject/adminui/... Remove this comment to see the full error message
import daDKTrans from "./org/opencastproject/adminui/languages/lang-da_DK";
// @ts-expect-error TS(2307): Cannot find module './org/opencastproject/adminui/... Remove this comment to see the full error message
import deDETrans from "./org/opencastproject/adminui/languages/lang-de_DE";
// @ts-expect-error TS(2307): Cannot find module './org/opencastproject/adminui/... Remove this comment to see the full error message
import elGRTrans from "./org/opencastproject/adminui/languages/lang-el_GR";
// @ts-expect-error TS(2307): Cannot find module './org/opencastproject/adminui/... Remove this comment to see the full error message
import esESTrans from "./org/opencastproject/adminui/languages/lang-es_ES";
// @ts-expect-error TS(2307): Cannot find module './org/opencastproject/adminui/... Remove this comment to see the full error message
import frFRTrans from "./org/opencastproject/adminui/languages/lang-fr_FR";
// @ts-expect-error TS(2307): Cannot find module './org/opencastproject/adminui/... Remove this comment to see the full error message
import glESTrans from "./org/opencastproject/adminui/languages/lang-gl_ES";
// @ts-expect-error TS(2307): Cannot find module './org/opencastproject/adminui/... Remove this comment to see the full error message
import heILTrans from "./org/opencastproject/adminui/languages/lang-he_IL";
// @ts-expect-error TS(2307): Cannot find module './org/opencastproject/adminui/... Remove this comment to see the full error message
import itITTrans from "./org/opencastproject/adminui/languages/lang-it_IT";
// @ts-expect-error TS(2307): Cannot find module './org/opencastproject/adminui/... Remove this comment to see the full error message
import nlNLTrans from "./org/opencastproject/adminui/languages/lang-nl_NL";
// @ts-expect-error TS(2307): Cannot find module './org/opencastproject/adminui/... Remove this comment to see the full error message
import plPLTrans from "./org/opencastproject/adminui/languages/lang-pl_PL";
// @ts-expect-error TS(2307): Cannot find module './org/opencastproject/adminui/... Remove this comment to see the full error message
import slSITrans from "./org/opencastproject/adminui/languages/lang-sl_SI";
// @ts-expect-error TS(2307): Cannot find module './org/opencastproject/adminui/... Remove this comment to see the full error message
import svSETrans from "./org/opencastproject/adminui/languages/lang-sv_SE";
// @ts-expect-error TS(2307): Cannot find module './org/opencastproject/adminui/... Remove this comment to see the full error message
import trTRTrans from "./org/opencastproject/adminui/languages/lang-tr_TR";
// @ts-expect-error TS(2307): Cannot find module './org/opencastproject/adminui/... Remove this comment to see the full error message
import zhZWTrans from "./org/opencastproject/adminui/languages/lang-zh_TW";

// Assignment of language code to translation file
// !!! If translation file of a new language is added, please add assignment here, too !!!
const resources = {
	"en-GB": { translation: enGBTrans },
	"en-US": { translation: enUSTrans },
	da: { translation: daDKTrans },
	de: { translation: deDETrans },
	el: { translation: elGRTrans },
	es: { translation: esESTrans },
	fr: { translation: frFRTrans },
	gl: { translation: glESTrans },
	he: { translation: heILTrans },
	it: { translation: itITTrans },
	nl: { translation: nlNLTrans },
	pl: { translation: plPLTrans },
	sl: { translation: slSITrans },
	sv: { translation: svSETrans },
	tr: { translation: trTRTrans },
	zh: { translation: zhZWTrans },
};

// Configuration of i18next
i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "en-GB",
		debug: true,

		interpolation: {
			escapeValue: false,
			format: function (value, format, lng) {
				if (value instanceof Date) {
					return moment(value).format(format);
				}

				return value;
			},
		},
		react: {
			useSuspense: false,
		},
	});

export default i18n;
