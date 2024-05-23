import MeanRunTimeCell from "../../components/systems/partials/MeanRunTimeCell";
import MeanQueueTimeCell from "../../components/systems/partials/MeanQueueTimeCell";
import ServicesActionCell from "../../components/systems/partials/ServicesActionsCell";

/**
 * This map contains the mapping between the template strings above and the corresponding react component.
 * This helps to render different templates of cells more dynamically. Even empty needed, because Table component
 * uses template map.
 */
export const servicesTemplateMap = {
	MeanRunTimeCell: MeanRunTimeCell,
	MeanQueueTimeCell: MeanQueueTimeCell,
	ServicesActionsCell: ServicesActionCell,
};
