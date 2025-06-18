import axios from "axios";
import { getAssetUploadOptions, getSourceUploadOptions } from "../selectors/eventSelectors";
import { UploadOption } from "../slices/eventSlice";
import { createAppAsyncThunk } from "../createAsyncThunkWithTypes";
import { Publication } from "../slices/eventDetailsSlice";

// thunks for assets, especially for getting asset options

export const fetchAssetUploadOptions = createAppAsyncThunk("assets/fetchAssetUploadOptionsAsyncThunk", async (_, { getState }) => {
	// get old asset upload options
	const state = getState();
	const assetUploadOptions = getAssetUploadOptions(state);
	const assetSourceOptions = getSourceUploadOptions(state);

	const sourcePrefix = "EVENTS.EVENTS.NEW.SOURCE.UPLOAD";
	const assetPrefix = "EVENTS.EVENTS.NEW.UPLOAD_ASSET.OPTION";
	const workflowPrefix = "EVENTS.EVENTS.NEW.UPLOAD_ASSET.WORKFLOWDEFID";

	// only fetch asset upload options, if they haven't been fetched yet
	if (!(assetUploadOptions.length !== 0 && assetSourceOptions.length !== 0)) {
		let workflow;
		const newAssetUploadOptions: UploadOption[] = [];
		const newSourceUploadOptions: UploadOption[] = [];

		// request asset upload options from API
		await axios
			.get("/admin-ng/resources/eventUploadAssetOptions.json")
			.then(dataResponse => {
				// iterate over response and only use non-comment lines
				for (const [optionKey, optionJson] of Object.entries(
					dataResponse.data,
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

							if ((option.showForNewEvents !== undefined && (isAssetOption && option.showForNewEvents))
								|| (option.showForNewEvents === undefined && (isAssetOption))) {
									newAssetUploadOptions.push(option);
							}
							if ((option.showForNewEvents !== undefined && (isSourceOption && option.showForNewEvents))
								|| (option.showForNewEvents === undefined && (isSourceOption))) {
									newSourceUploadOptions.push(option);
							}
						} else if (optionKey.indexOf(workflowPrefix) >= 0) {
							// if the line is the upload asset workflow id, set the asset upload workflow
							workflow = optionJson as string;
						}
					}
				}
			});

		return { workflow, newAssetUploadOptions, newSourceUploadOptions };
	}
});

/**
 * Adds information from the publication list provider to publications.
 * The additional info is used for rendering purposes
 */
export const enrichPublications = createAppAsyncThunk("assets/enrichPublications", async (
	publications: {
		publications: {
			id: string,
			name: string,
			url: string,
		}[],
		"start-date"?: string,
		"end-date"?: string,
	},
) => {
	// get information about possible publication channels
	const data = await axios.get("/admin-ng/resources/PUBLICATION.CHANNELS.json");

	const publicationChannels: { [key: string]: string } = await data.data;

	const now = new Date();
	let combinedPublications: Publication[] = [];

	// fill publication objects with additional information
	publications.publications.forEach(publication => {
		const newPublication: Publication = {
			enabled: true,
			id: publication.id,
			name: publication.name,
			order: 0,
			url: publication.url,
		};
		newPublication.enabled = (publications["start-date"] && publications["end-date"]) ?
		!(
			publication.id === "engage-live" &&
			(now < new Date(publications["start-date"]) ||
				now > new Date(publications["end-date"]))
		)
		:
		true;

		if (publicationChannels[publication.id]) {
			const channel = JSON.parse(publicationChannels[publication.id]);

			if (channel.label) {
				newPublication.label = channel.label;
			}
			if (channel.icon) {
				newPublication.icon = channel.icon;
			}
			if (channel.hide) {
				newPublication.hide = channel.hide;
			}
			if (channel.description) {
				newPublication.description = channel.description;
			}
			if (channel.order) {
				newPublication.order = channel.order;
			}
		}
		combinedPublications.push(newPublication);
	});

	combinedPublications = combinedPublications.sort(({ order: a }, { order: b }) => a - b);

	return combinedPublications;
});
