import { LifeCyclePolicy, TargetFilter } from "../slices/lifeCycleSlice";

export const parseTargetFiltersForSubmit = (
	targetFiltersArray: (TargetFilter & { filter: string })[]
) => {
	const targetFilters: LifeCyclePolicy["targetFilters"]  = {}
	for (const filter of targetFiltersArray) {
		targetFilters[filter.filter] = {
			value: filter.value,
			type: filter.type,
			must: filter.must
		}
	}

	return targetFilters;
}
