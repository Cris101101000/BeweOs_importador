export interface VariableDefinition {
	translationKey: string;
	value: string;
}

/**
 * Available text variables dictionary
 * The label is translated using the translationKey, but the value is what gets inserted
 * 
 * These match the variables supported by replace-variables.util.ts:
 * - company, phone, email, website, address, city, country, description, google_business
 */
export const VARIABLE_DEFINITIONS: VariableDefinition[] = [
	{
		translationKey: "variable_company",
		value: "company",
	},
	{
		translationKey: "variable_phone",
		value: "phone",
	},
	{
		translationKey: "variable_email",
		value: "email",
	},
	{
		translationKey: "variable_website",
		value: "website",
	},
	{
		translationKey: "variable_address",
		value: "address",
	},
	{
		translationKey: "variable_city",
		value: "city",
	},
	{
		translationKey: "variable_country",
		value: "country",
	},
	{
		translationKey: "variable_description",
		value: "description",
	},
	{
		translationKey: "variable_google_business",
		value: "google_business",
	},
];

