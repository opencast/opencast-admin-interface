import { PayloadAction, SerializedError, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { jobsTableConfig } from '../configs/tableConfigs/jobsTableConfig';
import axios from 'axios';
import { getURLParams } from '../utils/resourceUtils';

/**
 * This file contains redux reducer for actions affecting the state of jobs
 */
type JobState = {
	status: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	error: SerializedError | null,
	results: any[],		 // TODO: proper typing
	columns: any,			 // TODO: proper typing, derive from `initialColumns`
	total: number,
	count: number,
	offset: number,
	limit: number,
}

// Fill columns initially with columns defined in jobsTableConfig
const initialColumns = jobsTableConfig.columns.map((column) => ({
	...column,
	deactivated: false,
}));

// Initial state of jobs in redux store
const initialState: JobState = {
	status: 'uninitialized',
	error: null,
	results: [],
	columns: initialColumns,
	total: 0,
	count: 0,
	offset: 0,
	limit: 0,
};

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (_, { getState }) => {
	const state = getState();
	let params = getURLParams(state);
	// Just make the async request here, and return the response.
	// This will automatically dispatch a `pending` action first,
	// and then `fulfilled` or `rejected` actions based on the promise.
	// /jobs.json?limit=0&offset=0&filter={filter}&sort={sort}
	const res = await axios.get("/admin-ng/job/jobs.json?n", { params: params });
	return res.data;
});

const jobSlice = createSlice({
	name: 'jobs',
	initialState,
	reducers: {
		setJobColumns(state, action: PayloadAction<{
			updatedColumns: JobState["columns"],
		}>) {
			state.columns = action.payload.updatedColumns;
		},
	},
	// These are used for thunks
	extraReducers: builder => {
		builder
			.addCase(fetchJobs.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchJobs.fulfilled, (state, action: PayloadAction<{
				total: JobState["total"],
				count: JobState["count"],
				limit: JobState["limit"],
				offset: JobState["offset"],
				results: JobState["results"],
			}>) => {
				state.status = 'succeeded';
				const jobs = action.payload;
				state.total = jobs.total;
				state.count = jobs.count;
				state.limit = jobs.limit;
				state.offset = jobs.offset;
				state.results = jobs.results;
			})
			.addCase(fetchJobs.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error;
			});
	}
});

export const { setJobColumns } = jobSlice.actions;

// Export the slice reducer as the default export
export default jobSlice.reducer;
