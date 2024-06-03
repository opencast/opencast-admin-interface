// flag images imports
import DKFlag from "../img/lang/da_DK.svg?url";
import DEFlag from "../img/lang/de_DE.svg?url";
import GRFlag from "../img/lang/el_GR.svg?url";
import GBFlag from "../img/lang/en_GB.svg?url";
import USFlag from "../img/lang/en_US.svg?url";
import ESFlag from "../img/lang/es_ES.svg?url";
import FRFlag from "../img/lang/fr_FR.svg?url";
import ESFlag2 from "../img/lang/gl_ES.svg?url";
import ILFlag from "../img/lang/he_IL.svg?url";
import ITFlag from "../img/lang/it_IT.svg?url";
import NLFlag from "../img/lang/nl_NL.svg?url";
import PLFlag from "../img/lang/pl_PL.svg?url";
import SIFlag from "../img/lang/sl_SI.svg?url";
import SEFlag from "../img/lang/sv_SE.svg?url";
import TRFlag from "../img/lang/tr_TR.svg?url";
import CNFlag from "../img/lang/zh_CN.svg?url";

// Import date-fns locales
import { da } from "date-fns/locale/da";
import { de } from "date-fns/locale/de";
import { el } from "date-fns/locale/el";
import { enGB } from "date-fns/locale/en-GB";
import { enUS } from "date-fns/locale/en-US";
import { es } from "date-fns/locale/es";
import { fr } from "date-fns/locale/fr";
import { gl } from "date-fns/locale/gl";
import { he } from "date-fns/locale/he";
import { it } from "date-fns/locale/it";
import { nl } from "date-fns/locale/nl";
import { pl } from "date-fns/locale/pl";
import { sl } from "date-fns/locale/sl";
import { sv } from "date-fns/locale/sv";
import { tr } from "date-fns/locale/tr";
import { zhCN } from "date-fns/locale/zh-CN";

/*
 * JSON object that contains all available languages and the following information:
 * code: language code (has to be the same as in i18n.js)
 * long: name of the language
 * rtl: is the reading direction right to left?
 * flag: image of the flag (used as icon in language selection)
 * dateLocale: is needed for translation in datepicker
 *
 * !!! If a translation file of a new language was added, please insert these language here, too !!!
 *
 * */
const languages = [
	{
		code: "en-US",
		long: "English",
		rtl: false,
		flag: USFlag,
		dateLocale: enUS,
	},
	{
		code: "en-GB",
		long: "English",
		rtl: false,
		flag: GBFlag,
		dateLocale: enGB,
	},
	{ code: "da", long: "Dansk", rtl: false, flag: DKFlag, dateLocale: da },
	{ code: "de", long: "Deutsch", rtl: false, flag: DEFlag, dateLocale: de },
	{
		code: "el",
		long: "Ελληνικά",
		rtl: false,
		flag: GRFlag,
		dateLocale: el,
	},
	{ code: "es", long: "Español", rtl: false, flag: ESFlag, dateLocale: es },
	{
		code: "fr",
		long: "Français",
		rtl: false,
		flag: FRFlag,
		dateLocale: fr,
	},
	{ code: "gl", long: "Galego", rtl: false, flag: ESFlag2, dateLocale: gl },
	{ code: "he", long: "עברית", rtl: true, flag: ILFlag, dateLocale: he },
	{
		code: "it",
		long: "Italiano",
		rtl: false,
		flag: ITFlag,
		dateLocale: it,
	},
	{
		code: "nl",
		long: "Nederlands",
		rtl: false,
		flag: NLFlag,
		dateLocale: nl,
	},
	{ code: "pl", long: "Polski", rtl: false, flag: PLFlag, dateLocale: pl },
	{
		code: "sl",
		long: "Slovenščina",
		rtl: false,
		flag: SIFlag,
		dateLocale: sl,
	},
	{ code: "sv", long: "Svenska", rtl: false, flag: SEFlag, dateLocale: sv },
	{ code: "tr", long: "Türkçe", rtl: false, flag: TRFlag, dateLocale: tr },
	{ code: "zh", long: "中文", rtl: false, flag: CNFlag, dateLocale: zhCN },
];

export default languages;
