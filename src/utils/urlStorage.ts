import { WebStorage } from "redux-persist";

// Custom storage engine for `redux-persist`
// to store (parts of) the application state in URL parameters.
// This allows users to share "deep links" to specific parts of the application.
const storage = {
	getItem: async (key: string) => withParams(params => params.get(key)),
	setItem: async (key: string, value: string) => updateParams(params => {
		params.set(key, value);
	}),
	removeItem: async (key: string) => updateParams(params => {
		params.delete(key);
	}),
} satisfies WebStorage;
export default storage;

// Helper functions to work with URL parameters
const withParams = <T>(fn: (params: URLSearchParams) => T): T => (
    fn(
        new URLSearchParams(window.location.search)
    )
);
const updateParams = (fn: (params: URLSearchParams) => void) => {
	withParams(params => {
		fn(params);
		window.history.pushState(null, "", `${
            window.location.pathname
        }?${
            params.toString()
        }${
            window.location.hash
        }`);
	});
};
