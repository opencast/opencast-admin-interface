import React, { useEffect } from "react";
import { connect } from "react-redux";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
// @ts-expect-error TS(6142): Module './components/events/Events' was resolved t... Remove this comment to see the full error message
import Events from "./components/events/Events";
// @ts-expect-error TS(6142): Module './components/recordings/Recordings' was re... Remove this comment to see the full error message
import Recordings from "./components/recordings/Recordings";
// @ts-expect-error TS(6142): Module './components/systems/Jobs' was resolved to... Remove this comment to see the full error message
import Jobs from "./components/systems/Jobs";
// @ts-expect-error TS(6142): Module './components/configuration/Themes' was res... Remove this comment to see the full error message
import Themes from "./components/configuration/Themes";
// @ts-expect-error TS(6142): Module './components/users/Users' was resolved to ... Remove this comment to see the full error message
import Users from "./components/users/Users";
// @ts-expect-error TS(6142): Module './components/statistics/Statistics' was re... Remove this comment to see the full error message
import Statistics from "./components/statistics/Statistics";
// @ts-expect-error TS(6142): Module './components/events/Series' was resolved t... Remove this comment to see the full error message
import Series from "./components/events/Series";
// @ts-expect-error TS(6142): Module './components/systems/Servers' was resolved... Remove this comment to see the full error message
import Servers from "./components/systems/Servers";
// @ts-expect-error TS(6142): Module './components/systems/Services' was resolve... Remove this comment to see the full error message
import Services from "./components/systems/Services";
// @ts-expect-error TS(6142): Module './components/users/Groups' was resolved to... Remove this comment to see the full error message
import Groups from "./components/users/Groups";
// @ts-expect-error TS(6142): Module './components/users/Acls' was resolved to '... Remove this comment to see the full error message
import Acls from "./components/users/Acls";
import { fetchOcVersion, fetchUserInfo } from "./thunks/userInfoThunks";

function App({
    loadingUserInfo,
    loadingOcVersion
}: any) {
	useEffect(() => {
		// Load information about current user on mount
		loadingUserInfo();
		// Load information about current opencast version on mount
		loadingOcVersion();
	}, [loadingOcVersion, loadingUserInfo]);

	return (
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
		<HashRouter>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
			<Routes>
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Route exact path={"/"} element={<Events />} />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Route exact path={"/events/events"} element={<Events />} />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Route exact path={"/events/series"} element={<Series />} />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Route exact path={"/recordings/recordings"} element={<Recordings />} />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Route exact path={"/systems/jobs"} element={<Jobs />} />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Route exact path={"/systems/servers"} element={<Servers />} />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Route exact path={"/systems/services"} element={<Services />} />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Route exact path={"/users/users"} element={<Users />} />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Route exact path={"/users/groups"} element={<Groups />} />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Route exact path={"/users/acls"} element={<Acls />} />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Route exact path={"/configuration/themes"} element={<Themes />} />

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Route
// @ts-expect-error TS(2322): Type '{ exact: true; path: string; element: Elemen... Remove this comment to see the full error message
					exact
					path={"/statistics/organization"}
// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
					element={<Statistics />}
				/>

// @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
				<Route
					path={"*"}
// @ts-expect-error TS(2322): Type '{ path: string; render: () => Element; }' is... Remove this comment to see the full error message
					render={() => <Navigate to={"/events/events"} replace />}
				/>
			</Routes>
		</HashRouter>
	);
}

// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
const mapDispatchToProps = (dispatch) => ({
	loadingUserInfo: () => dispatch(fetchUserInfo()),
	loadingOcVersion: () => dispatch(fetchOcVersion()),
});

export default connect(null, mapDispatchToProps)(App);
