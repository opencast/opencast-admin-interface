import RecordingsActionCell from "../../components/recordings/partials/RecordingsActionCell";
import RecordingsNameCell from "../../components/recordings/partials/RecordingsNameCell";
import RecordingsStatusCell from "../../components/recordings/partials/RecordingsStatusCell";
import RecordingsUpdateCell from "../../components/recordings/partials/RecordingsUpdateCell";

/**
 * This map contains the mapping between the template strings above and the corresponding react component.
 * This helps to render different templates of cells more dynamically
 */
export const recordingsTemplateMap = {
	RecordingsActionCell: RecordingsActionCell,
	RecordingsNameCell: RecordingsNameCell,
	RecordingsStatusCell: RecordingsStatusCell,
	RecordingsUpdateCell: RecordingsUpdateCell,
};
