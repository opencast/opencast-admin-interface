import { PayloadAction, SerializedError, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { servicesTableConfig } from "../configs/tableConfigs/servicesTableConfig";
import axios from 'axios';
import { getURLParams } from '../utils/resourceUtils';

/**
 * This file contains redux reducer for actions affecting the state of services
 */
type Service = {
	completed: number,
	hostname: string,
	meanQueueTime: number,
	meanRunTime: number,
	name: string,
	nodeName: string,
	queued: number,
	running: number,
	status: string,
}

type ServiceState = {
	status: 'uninitialized' | 'loading' | 'succeeded' | 'failed',
	error: SerializedError | null,
	results: Service[],
	columns: any,			 // TODO: proper typing, derive from `initialColumns`
	total: number,
	count: number,
	offset: number,
	limit: number,
}

// Fill columns initially with columns defined in servicesTableConfig
const initialColumns = servicesTableConfig.columns.map((column) => ({
	...column,
	deactivated: false,
}));

// Initial state of services in redux store
const initialState: ServiceState = {
	status: 'uninitialized',
	error: null,
	results: [],
	columns: initialColumns,
	total: 0,
	count: 0,
	offset: 0,
	limit: 0,
};

// fetch services from server
export const fetchServices = createAsyncThunk('services/fetchServices', async (_, { getState }) => {
	const state = getState();
	let params = getURLParams(state);
	// Just make the async request here, and return the response.
	// This will automatically dispatch a `pending` action first,
	// and then `fulfilled` or `rejected` actions based on the promise.
	const res = await axios.get("/admin-ng/services/services.json", { params: params });
	return res.data;
});

// restarts a service after initiated by user
export const restartService = createAsyncThunk('services/fetchServices', async (params: {host: any, serviceType: any}) => {
	const { host, serviceType } = params
	let data = new URLSearchParams();
	data.append("host", host);
	data.append("serviceType", serviceType);

	axios
		.post("/services/sanitize", data)
		.then((response) => {
			console.log(response);
		})
		.catch((response) => {
			console.log(response);
		});
});

const serviceSlice = createSlice({
	name: 'services',
	initialState,
	reducers: {
		setServiceColumns(state, action: PayloadAction<{
			updatedColumns: ServiceState["columns"],
		}>) {
			state.columns = action.payload.updatedColumns;
		},
	},
	// These are used for thunks
	extraReducers: builder => {
		builder
			.addCase(fetchServices.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchServices.fulfilled, (state, action: PayloadAction<{
				total: ServiceState["total"],
				count: ServiceState["count"],
				limit: ServiceState["limit"],
				offset: ServiceState["offset"],
				results: ServiceState["results"],
			}>) => {
				state.status = 'succeeded';
				const acls = action.payload;
				state.total = acls.total;
				state.count = acls.count;
				state.limit = acls.limit;
				state.offset = acls.offset;
				state.results = acls.results;
			})
			.addCase(fetchServices.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error;
			});
	}
});

export const { setServiceColumns } = serviceSlice.actions;

// Export the slice reducer as the default export
export default serviceSlice.reducer;
