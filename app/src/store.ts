import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import tableFilters from "./reducers/tableFilterReducers";
import tableFilterProfiles from "./reducers/tableFilterProfilesReducer";
import events from "./reducers/eventReducers";
import table from "./reducers/tableReducers";
import series from "./reducers/seriesReducer";
import recordings from "./reducers/recordingReducer";
import jobs from "./reducers/jobReducer";
import servers from "./reducers/serverReducer";
import services from "./reducers/serviceReducer";
import users from "./reducers/userReducers";
import groups from "./reducers/groupReducers";
import acls from "./slices/aclSlice";
import themes from "./reducers/themeReducers";
import health from "./reducers/healthReducers";
import { notifications } from "./reducers/notificationReducers";
import workflows from "./reducers/workflowReducers";
import eventDetails from "./reducers/eventDeatilsReducers";
import seriesDetails from "./reducers/seriesDetailsReducers";
import recordingDetails from "./reducers/recordingDetailsReducer";
import userDetails from "./reducers/userDetailsReducer";
import groupDetails from "./reducers/groupDetailsReducer";
import aclDetails from "./reducers/aclDetailsReducer";
import themeDetails from "./reducers/themeDetailsReducer";
import userInfo from "./reducers/userInfoReducer";
import statistics from "./reducers/statisticsReducers";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

/**
 * This File contains the configuration for the store used by the reducers all over the app
 */

// Configuration for persisting states in store
const eventsPersistConfig = { key: "events", storage, whitelist: ["columns"] }
const seriesPersistConfig = { key: "series", storage, whitelist: ["columns"] }
const recordingsPersistConfig = { key: "recordings", storage, whitelist: ["columns"] }
const jobsPersistConfig = { key: "jobs", storage, whitelist: ["columns"] }
const serversPersistConfig = { key: "servers", storage, whitelist: ["columns"] }
const servicesPersistConfig = { key: "services", storage, whitelist: ["columns"] }
const usersPersistConfig = { key: "users", storage, whitelist: ["columns"] }
const groupsPersistConfig = { key: "groups", storage, whitelist: ["columns"] }
const aclsPersistConfig = { key: "acls", storage, whitelist: ["columns"] }
const themesPersistConfig = { key: "themes", storage, whitelist: ["columns"] }

// form reducer and all other reducers used in this app
const reducers = combineReducers({
	tableFilters,
	tableFilterProfiles,
	events: persistReducer(eventsPersistConfig, events),
	series: persistReducer(seriesPersistConfig, series),
	table,
	recordings: persistReducer(recordingsPersistConfig, series),
	jobs: persistReducer(jobsPersistConfig, series),
	servers: persistReducer(serversPersistConfig, series),
	services: persistReducer(servicesPersistConfig, series),
	users: persistReducer(usersPersistConfig, series),
	groups: persistReducer(groupsPersistConfig, series),
	acls: persistReducer(aclsPersistConfig, series),
	themes: persistReducer(themesPersistConfig, series),
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
	key: "root",
	storage,
	stateReconciler: autoMergeLevel2,
	whitelist: ["tableFilters"],
};

// With updates to redux, persistReducer is not properly typed anymore, so
// this overwrites the typing with 'any's to avoid errors
const persistedReducer = persistReducer<any, any>(persistConfig, reducers);

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
