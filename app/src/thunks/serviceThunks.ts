import axios from "axios";
import {
	loadServicesFailure,
	loadServicesInProgress,
	loadServicesSuccess,
} from "../actions/serviceActions";
import { getURLParams } from "../utils/resourceUtils";

// fetch services from server
// @ts-expect-error TS(7006): Parameter 'dispatch' implicitly has an 'any' type.
export const fetchServices = () => async (dispatch, getState) => {
	try {
		dispatch(loadServicesInProgress());

		const state = getState();
		let params = getURLParams(state);

		// /services.json?limit=0&offset=0&filter={filter}&sort={sort}
		let data = await axios.get("/admin-ng/services/services.json", {
			params: params,
		});

		const services = await data.data;
		dispatch(loadServicesSuccess(services));
	} catch (e) {
		dispatch(loadServicesFailure());
	}
};

// restarts a service after initiated by user
// @ts-expect-error TS(7006): Parameter 'host' implicitly has an 'any' type.
export const restartService = async (host, serviceType) => {
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
};
