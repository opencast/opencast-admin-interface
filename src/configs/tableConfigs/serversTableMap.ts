import ServersStatusCell from "../../components/systems/partials/ServersStatusCell";
import ServersMaintenanceCell from "../../components/systems/partials/ServersMaintenanceCell";

/**
 * This map contains the mapping between the template strings above and the corresponding react component.
 * This helps to render different templates of cells more dynamically. Even empty needed, because Table component
 * uses template map.
 */
export const serversTemplateMap = {
	ServersStatusCell: ServersStatusCell,
	ServersMaintenanceCell: ServersMaintenanceCell,
};
