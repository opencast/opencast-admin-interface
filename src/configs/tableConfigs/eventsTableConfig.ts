import { TableConfig } from "./aclsTableConfig";

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
export const eventsTableConfig: TableConfig = {
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
		{
			name: "notes",
			template: "EventsNotesCell",
			label: "EVENTS.EVENTS.TABLE.ADMINUI_NOTES",
			translate: false,
			deactivated: true,
		},
	],
	caption: "EVENTS.EVENTS.TABLE.CAPTION",
	resource: "events",
	category: "events",
	multiSelect: true,
};
