import { RootState } from "../store";

/**
 * This file contains selectors regarding information about the registration status
 */
export const getRegistrationLoaded = (state: RootState) => state.registration.registrationLoaded;
// Are we registered at all
export const getRegistration = (state: RootState) => state.registration.registration;

// Gather the system statistics reportable to the registration server
export const getStatistics = (state: RootState) => state.registration.statistics;

// Are we able to talk to register.opencast.org
export const getAbleToRegister = (state: RootState) => state.registration.registrationLoaded &&
                                                       state.registration.ableToRegister;
export const getAgreedLatestToU = (state: RootState) => state.registration.registrationLoaded &&
                                                        state.registration.registration != null && // this is correct because the *endpoint* returns a bare 'null' when the cluster isn't registered
                                                        state.registration.registration.termsVersionAgreed == state.registration.latestToU;
