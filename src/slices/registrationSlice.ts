import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { createAppAsyncThunk } from "../createAsyncThunkWithTypes";

export type Registration = {
  contactMe: boolean,
  systemType: string,
  allowsStatistics: boolean,
  allowsErrorReports: boolean,
  organisationName: string,
  departmentName: string,
  country: string,
  postalCode: string,
  city: string,
  firstName: string,
  lastName: string,
  street: string,
  streetNo: string,
  email: string,
  termsVersionAgreed: string,
  agreedToPolicy: boolean,
  dateModified: string,
  dateCreated: string,
};

// FIXME: This could be expanded to have all the fields, it's missing the nested host stuff
export type Statistics = {
  statistics: {
    /* the linter doesn't like these, but those are the names.  Should we change them?
    adopter_key: string,
    statistics_key: string,
    ca_count: number,
    event_count: number,
    job_count: number,
    series_count: number,
    tenant_count: number,
    total_minutes: number,
    user_count: number, */
    version: string,
  }
};

export type RegistrationState = {
  registrationLoaded: boolean,
  registration: Registration,
  statistics: Statistics,
  latestToU: string,
  ableToRegister: boolean,
  agreedToPolicy: boolean,
  error: boolean
};

// Initial state of health status in redux store
const initialState: RegistrationState = {
  registrationLoaded: false,
  registration: {
    contactMe: false,
    systemType: "",
    allowsStatistics: false,
    allowsErrorReports: false,
    organisationName: "",
    departmentName: "",
    country: "",
    postalCode: "",
    city: "",
    firstName: "",
    lastName: "",
    street: "",
    streetNo: "",
    email: "",
    termsVersionAgreed: "",
    agreedToPolicy: false,
    dateModified: "",
    dateCreated: "",
  },
  statistics: {
    statistics: {
      /* the linter doesn't like these, but those are the names.  Should we change them?
      adopter_key: "",
      statistics_key: "string",
      ca_count: -1,
      event_count: -1,
      job_count: -1,
      series_count: -1,
      tenant_count: -1,
      total_minutes: -1,
      user_count: -1,*/
      version: "",
    },
    /* There are other keys here, like so
    tobira: {
      insert arbitrary stats data
    },
    But these, and other keys, are not always present and depend *entirely* on local config
    Thus, we omit them here
    */
  },
  latestToU: "uninitialized",
  ableToRegister: false,
  agreedToPolicy: false,
  error: false,
};

interface ApiError {
  message: string,
  status: number,
}

// This is the registration itself
export const fetchRegistration = createAppAsyncThunk<Registration, void, { rejectValue: ApiError }>("registration/fetchRegistration", async (_, { rejectWithValue }) => {
  try {
  const res = await axios.get<Registration>("/admin-ng/adopter/registration");
  return res.data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    if (!error.response) {
      throw err; // Throws a generic network/runtime error if no response exists
    }
    return rejectWithValue(error.response.data);
  }
});

// This is the latest ToU ID.  It's a string like APRIL_2020.
export const fetchLatestToU = createAppAsyncThunk("registration/fetchLatestToU", async () => {
  const res = await axios.get<string>("/admin-ng/adopter/latestToU");
  return res.data;
});

// This is whether the core can talk to register.opencast.org.
export const fetchIsUpToDate = createAppAsyncThunk("registration/isUpToDate", async () => {
  const res = await axios.get<boolean>("/admin-ng/adopter/isUpToDate");
  return res.data;
});

// This is whether the statistics used in the registration modal.
export const fetchStatistics = createAppAsyncThunk("registration/statistics", async () => {
  const res = await axios.get<Statistics>("/admin-ng/adopter/statistics");
  return res.data;
});


// post request for adopter information
export const postAdopterRegistration = async (
  values: Registration,
) => {
  // build body
  const body = new URLSearchParams();
  body.append("contactMe", values.contactMe.toString());
  body.append("systemType", values.systemType);
  body.append("allowsStatistics", values.allowsStatistics.toString());
  body.append("allowsErrorReports", values.allowsErrorReports.toString());
  body.append("organisationName", values.organisationName);
  body.append("departmentName", values.departmentName);
  body.append("country", values.country);
  body.append("postalCode", values.postalCode);
  body.append("city", values.city);
  body.append("firstName", values.firstName);
  body.append("lastName", values.lastName);
  body.append("street", values.street);
  body.append("streetNo", values.streetNo);
  body.append("email", values.email);
  body.append("agreedToPolicy", values.agreedToPolicy.toString());
  body.append("registered", "true");

  // save adopter information and return next state
  await axios.post("/admin-ng/adopter/registration", body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

// delete adopter information
export const deleteAdopterRegistration = async () => {
  // delete adopter information
  await axios.delete("/admin-ng/adopter/registration", {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {},
  // These are used for thunks
  extraReducers: builder => {
    builder
      .addCase(fetchRegistration.fulfilled, (state, action: PayloadAction<
        Registration
      >) => {
        state.registration = action.payload;
        state.registrationLoaded = true;
      })
      .addCase(fetchRegistration.rejected, (state, action) => {
        // The endpoint returns 404 if there's no registration data
        if (action.payload?.status === 404) {
          state.registrationLoaded = true;
        } else {
          state.error = true;
        }
      })
      .addCase(fetchLatestToU.fulfilled, (state, action: PayloadAction<
        string
      >) => {
        state.latestToU = action.payload;
      })
      .addCase(fetchIsUpToDate.fulfilled, (state, action: PayloadAction<
        boolean
      >) => {
        // This is true if the core can talk to https://register.opencast.org/, false otherwise
        state.ableToRegister = action.payload;
      })
      .addCase(fetchStatistics.fulfilled, (state, action: PayloadAction<
        Statistics
      >) => {
        state.statistics = action.payload;
      });
  },
});

// Export the slice reducer as the default export
export default registrationSlice.reducer;
