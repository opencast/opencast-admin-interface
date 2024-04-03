import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// redux imports
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Provider } from "react-redux";
import store from "./store";

// import i18n (needs to be bundled)
import "./i18n/i18n";

// import css files for certain libraries
import "font-awesome/css/font-awesome.min.css";
import "react-datepicker/dist/react-datepicker.css";
import { HotkeysProvider } from "react-hotkeys-hook";
import { ThemeProvider } from "@mui/material";
import { createTheme } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getCurrentLanguageInformation } from "./utils/utils";

// todo: comment persistent stuff in, only out commented because for debugging purposes
const persistor = persistStore(store);

const theme = createTheme({
	zIndex: {
		modal: 2147483550,
	}
})

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={<div>loading...</div>} persistor={persistor}>
				<ThemeProvider theme={theme}>
					<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={getCurrentLanguageInformation()?.dateLocale}> {/*locale={getCurrentLanguageInformation()?.dateLocale}> */}
						<HotkeysProvider>
							<App />
						</HotkeysProvider>
					</LocalizationProvider>
				</ThemeProvider>
			</PersistGate>
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
