import axios from "axios";
import { getAssetUploadOptions } from "../selectors/eventSelectors";
import { createAppAsyncThunk } from '../createAsyncThunkWithTypes';
import { UploadAssetOption } from "../slices/eventSlice";

// thunks for assets, especially for getting asset options

export const fetchAssetUploadOptions = createAppAsyncThunk('assets/fetchAssetUploadOptionsAsyncThunk', async (_, { getState }) => {
	// get old asset upload options
	const state = getState();
	const assetUploadOptions = getAssetUploadOptions(state);

	const sourcePrefix = "EVENTS.EVENTS.NEW.SOURCE.UPLOAD";
	const assetPrefix = "EVENTS.EVENTS.NEW.UPLOAD_ASSET.OPTION";
	const workflowPrefix = "EVENTS.EVENTS.NEW.UPLOAD_ASSET.WORKFLOWDEFID";

	// only fetch asset upload options, if they haven't been fetched yet
	if (!(assetUploadOptions.length !== 0 && assetUploadOptions.length !== 0)) {
		let workflow;
		let newAssetUploadOptions: UploadAssetOption[] = [];

		// request asset upload options from API
		await axios
			.get("/admin-ng/resources/eventUploadAssetOptions.json")
			.then((dataResponse) => {
				// iterate over response and only use non-comment lines
				for (const [optionKey, optionJson] of Object.entries(
					dataResponse.data
				)) {
					if (optionKey.charAt(0) !== "$") {
						const isSourceOption = optionKey.indexOf(sourcePrefix) >= 0;
						const isAssetOption = optionKey.indexOf(assetPrefix) >= 0;

						// if the line is a source upload option or additional asset upload option,
						// format it and add to upload options list
						if (isSourceOption || isAssetOption) {
							let option = JSON.parse(optionJson as string);

							option = {
								...option,
								title: !option.title ? optionKey : option.title,
								showAs: isSourceOption ? "source" : "uploadAsset",
							};

							newAssetUploadOptions.push(option);
						} else if (optionKey.indexOf(workflowPrefix) >= 0) {
							// if the line is the upload asset workflow id, set the asset upload workflow
							workflow = optionJson as string;
						}
					}
				}
			})

		return { workflow, newAssetUploadOptions };
	}
});
