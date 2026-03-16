import { EnumFieldType } from "../types/data-type.type";

export const TYPE_FIELDS = [
	{
		key: "text",
		label: "clients_field_type_text",
		value: EnumFieldType.Text,
	},
	{
		key: "number",
		label: "clients_field_type_number",
		value: EnumFieldType.Number,
	},
	{
		key: "date",
		label: "clients_field_type_date",
		value: EnumFieldType.Date,
	},
	// {
	// 	key: "boolean",
	// 	label: "clients_field_type_boolean",
	// 	value: "boolean",
	// },
	{
		key: "identification",
		label: "clients_field_type_identification",
		value: EnumFieldType.Identification,
	},
];
