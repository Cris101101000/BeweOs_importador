export enum EnumFieldType {
	Text = "TEXT",
	Number = "NUMBER",
	Date = "DATE",
	Boolean = "BOOLEAN",
	Identification = "IDENTIFICATION",
	Select = "SELECT",
	MultiSelect = "MULTI_SELECT",
}

export const FIELD_TYPE_TO_FILTER_TYPE: Record<string, string> = {
	DATE: "date",
	NUMBER: "number",
	TEXT: "text",
};
