import axios from "axios";

// get information about adopter
export const fetchAdopterRegistration = async () => {
	// fetch current information about adopter
	const response = await axios.get("/admin-ng/adopter/registration");

	return await response.data;
};

// get statistics information about adopter
export const fetchAdopterStatisticsSummary = async () => {
	const response = await axios.get("/admin-ng/adopter/summary");

	return await response.data;
};

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
	agreedToPolicy: boolean,
}

// post request for adopter information
export const postRegistration = async (
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
