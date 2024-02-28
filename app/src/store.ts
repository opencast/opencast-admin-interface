import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'redu... Remove this comment to see the full error message
import autoMergeLevel2 from "redux-persist/lib";
import { combineReducers } from "redux";
import tableFilters from "./reducers/tableFilterReducers";
import tableFilterProfiles from "./reducers/tableFilterProfilesReducer";
import events from "./slices/eventSlice";
import table from "./reducers/tableReducers";
import series from "./slices/seriesSlice";
import recordings from "./reducers/recordingReducer";
import jobs from "./slices/jobSlice";
import servers from "./slices/serverSlice";
import services from "./slices/serviceSlice";
import users from "./reducers/userReducers";
import groups from "./slices/groupSlice";
import acls from "./slices/aclSlice";
import themes from "./slices/themeSlice";
import health from "./reducers/healthReducers";
import { notifications } from "./reducers/notificationReducers";
import workflows from "./slices/workflowSlice";
import eventDetails from "./reducers/eventDeatilsReducers";
import seriesDetails from "./reducers/seriesDetailsReducers";
import userDetails from "./slices/userDetailsSlice";
import recordingDetails from "./slices/recordingDetailsSlice";
import groupDetails from "./slices/groupDetailsSlice";
import aclDetails from "./slices/aclDetailsSlice";
import themeDetails from "./slices/themeDetailsSlice";
import userInfo from "./reducers/userInfoReducer";
import statistics from "./slices/statisticsSlice";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

/**
 * This File contains the configuration for the store used by the reducers all over the app
 */

// form reducer and all other reducers used in this app
const reducers = combineReducers({
	tableFilters,
	tableFilterProfiles,
	events,
	series,
	table,
	recordings,
	jobs,
	servers,
	services,
	users,
	groups,
	acls,
	themes,
	health,
	notifications,
	workflows,
	eventDetails,
	themeDetails,
	seriesDetails,
	recordingDetails,
	userDetails,
	groupDetails,
	aclDetails,
	userInfo,
	statistics,
});

// Configuration for persisting store
const persistConfig = {
	key: "opencast",
	storage,
	stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Initialize typescript type inference
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
