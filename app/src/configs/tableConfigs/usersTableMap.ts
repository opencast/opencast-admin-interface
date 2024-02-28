import UsersActionCell from "../../components/users/partials/UsersActionsCell";
import UsersRolesCell from "../../components/users/partials/UsersRolesCell";

/**
 * This map contains the mapping between the template strings above and the corresponding react component.
 * This helps to render different templates of cells more dynamically. Even empty needed, because Table component
 * uses template map.
 */
export const usersTemplateMap = {
	UsersActionsCell: UsersActionCell,
	UsersRolesCell: UsersRolesCell,
};
