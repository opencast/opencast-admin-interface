// @ts-expect-error TS(6142): Module '../../components/events/partials/EventActi... Remove this comment to see the full error message
import EventActionCell from "../../components/events/partials/EventActionCell";
// @ts-expect-error TS(6142): Module '../../components/events/partials/EventsDat... Remove this comment to see the full error message
import EventsDateCell from "../../components/events/partials/EventsDateCell";
// @ts-expect-error TS(6142): Module '../../components/events/partials/EventsPre... Remove this comment to see the full error message
import EventsPresentersCell from "../../components/events/partials/EventsPresentersCell";
// @ts-expect-error TS(6142): Module '../../components/events/partials/EventsSer... Remove this comment to see the full error message
import EventsSeriesCell from "../../components/events/partials/EventsSeriesCell";
// @ts-expect-error TS(6142): Module '../../components/events/partials/EventsSta... Remove this comment to see the full error message
import EventsStatusCell from "../../components/events/partials/EventsStatusCell";
// @ts-expect-error TS(6142): Module '../../components/events/partials/EventsTec... Remove this comment to see the full error message
import EventsTechnicalDateCell from "../../components/events/partials/EventsTechnicalDateCell";
// @ts-expect-error TS(6142): Module '../../components/events/partials/Published... Remove this comment to see the full error message
import PublishedCell from "../../components/events/partials/PublishedCell";
// @ts-expect-error TS(6142): Module '../../components/events/partials/EventsLoc... Remove this comment to see the full error message
import EventsLocationCell from "../../components/events/partials/EventsLocationCell";
// @ts-expect-error TS(6142): Module '../../components/events/partials/EventsEnd... Remove this comment to see the full error message
import EventsEndCell from "../../components/events/partials/EventsEndCell";
// @ts-expect-error TS(6142): Module '../../components/events/partials/EventsSta... Remove this comment to see the full error message
import EventsStartCell from "../../components/events/partials/EventsStartCell";

/**
 * Config that contains the columns and further information regarding events. These are the information that never or hardly changes.
 * That's why it is hard coded here and not fetched from server.
 * Information configured in this file:
 * - columns: names, labels, sortable, (template)
 * - caption for showing in table view
 * - resource type (here: events)
 * - category type (here: events)
 * - is multi select possible?
 */
export const eventsTableConfig = {
	columns: [
		{
			name: "title",
			label: "EVENTS.EVENTS.TABLE.TITLE",
			sortable: true,
			translate: false,
		},
		{
			template: "EventsPresentersCell",
			name: "presenter",
			label: "EVENTS.EVENTS.TABLE.PRESENTERS",
			sortable: true,
			translate: false,
		},
		{
			template: "EventsSeriesCell",
			name: "series_name",
			label: "EVENTS.EVENTS.TABLE.SERIES",
			sortable: true,
			translate: false,
		},
		{
			template: "EventsDateCell",
			name: "date",
			label: "EVENTS.EVENTS.TABLE.DATE",
			sortable: true,
			translate: false,
		},
		{
			template: "EventsStartCell",
			name: "start_date",
			label: "EVENTS.EVENTS.TABLE.START",
			sortable: true,
			translate: false,
		},
		{
			template: "EventsEndCell",
			name: "end_date",
			label: "EVENTS.EVENTS.TABLE.STOP",
			sortable: true,
			translate: false,
		},
		{
			template: "EventsLocationCell",
			name: "location",
			label: "EVENTS.EVENTS.TABLE.LOCATION",
			sortable: true,
			translate: false,
		},
		{
			name: "published",
			label: "EVENTS.EVENTS.TABLE.PUBLISHED",
			template: "PublishedCell",
			translate: false,
		},
		{
			template: "EventsStatusCell",
			name: "event_status",
			label: "EVENTS.EVENTS.TABLE.STATUS",
			sortable: true,
			translate: true,
		},
		{
			name: "actions",
			template: "EventActionsCell",
			label: "EVENTS.EVENTS.TABLE.ACTION",
			translate: false,
		},
	],
	caption: "EVENTS.EVENTS.TABLE.CAPTION",
	resource: "events",
	category: "events",
	multiSelect: true,
};

/**
 * This map contains the mapping between the template strings above and the corresponding react component.
 * This helps to render different templates of cells more dynamically
 */
export const eventsTemplateMap = {
	EventActionsCell: EventActionCell,
	EventsDateCell: EventsDateCell,
	EventsStartCell: EventsStartCell,
	EventsEndCell: EventsEndCell,
	EventsLocationCell: EventsLocationCell,
	EventsPresentersCell: EventsPresentersCell,
	EventsSeriesCell: EventsSeriesCell,
	EventsStatusCell: EventsStatusCell,
	EventsTechnicalDateCell: EventsTechnicalDateCell,
	PublishedCell: PublishedCell,
};
