import React, { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import Events from "./components/events/Events";
import Recordings from "./components/recordings/Recordings";
import Jobs from "./components/systems/Jobs";
import Themes from "./components/configuration/Themes";
import Users from "./components/users/Users";
import Statistics from "./components/statistics/Statistics";
import Series from "./components/events/Series";
import Servers from "./components/systems/Servers";
import Services from "./components/systems/Services";
import Groups from "./components/users/Groups";
import Acls from "./components/users/Acls";
import { useAppDispatch } from "./store";
import { fetchOcVersion, fetchUserInfo } from "./slices/userInfoSlice";

function App() {
	const dispatch = useAppDispatch();
	useEffect(() => {
		// Load information about current user on mount
		dispatch(fetchUserInfo());
		// Load information about current opencast version on mount
		dispatch(fetchOcVersion());
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<HashRouter>
			<Routes>
				<Route path={"/"} element={<Events />} />

				<Route path={"/events/events"} element={<Events />} />

				<Route path={"/events/series"} element={<Series />} />

				<Route path={"/recordings/recordings"} element={<Recordings />} />

				<Route path={"/systems/jobs"} element={<Jobs />} />

				<Route path={"/systems/servers"} element={<Servers />} />

				<Route path={"/systems/services"} element={<Services />} />

				<Route path={"/users/users"} element={<Users />} />

				<Route path={"/users/groups"} element={<Groups />} />

				<Route path={"/users/acls"} element={<Acls />} />

				<Route path={"/configuration/themes"} element={<Themes />} />

				<Route path={"/statistics/organization"} element={<Statistics />} />

				<Route
					path={"*"}
					element={<Navigate to={"/events/events"} replace />}
				/>
			</Routes>
		</HashRouter>
	);
}

export default App;
