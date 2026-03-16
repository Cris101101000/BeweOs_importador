import type { IAgency } from "@layout/domain/interfaces/agency.interface";
import type { IUser } from "@layout/domain/interfaces/user.interface";
import type { IBusinessInformation } from "@settings/bussinesConfig/domain/interfaces/business-information.interface";
import type { IPhone } from "@shared/domain/interfaces/phone.interface";

/**
 * Format phone number for display
 * Extracts the number from IPhone object and formats it
 */
function formatPhone(phone: IPhone | undefined): string {
	if (!phone || !phone.number) return "";

	// If phone has code, format with it
	if (phone.code) {
		return `${phone.code} ${phone.number}`;
	}

	return phone.number;
}

/**
 * Get the main phone number prioritizing user phones over agency phones
 * Priority order:
 * 1. User's sales phone (type = "sales")
 * 2. User's main phone (type = "main")
 * 3. User's first available phone
 * 4. Agency's sales phone (fallback if user has no phones)
 * 5. Agency's main phone (fallback)
 * 6. Agency's first available phone (fallback)
 *
 * @param userPhones - Array of user phones (priority)
 * @param agencyPhones - Array of agency phones (fallback)
 * @returns Formatted phone number or empty string if none available
 */
function getMainPhone(
	userPhones: IPhone[] | undefined,
	agencyPhones: IPhone[] | undefined
): string {
	// Try user phones first
	if (userPhones && userPhones.length > 0) {
		// Priority 1: User's sales phone
		const userSalesPhone = userPhones.find((phone) => phone.type === "sales");
		if (userSalesPhone) {
			return formatPhone(userSalesPhone);
		}

		// Priority 2: User's main phone
		const userMainPhone = userPhones.find((phone) => phone.type === "main");
		if (userMainPhone) {
			return formatPhone(userMainPhone);
		}

		// Priority 3: User's first available phone
		return formatPhone(userPhones[0]);
	}

	// Fallback to agency phones if user has no phones
	if (agencyPhones && agencyPhones.length > 0) {
		// Priority 4: Agency's sales phone
		const agencySalesPhone = agencyPhones.find(
			(phone) => phone.type === "sales"
		);
		if (agencySalesPhone) {
			return formatPhone(agencySalesPhone);
		}

		// Priority 5: Agency's main phone
		const agencyMainPhone = agencyPhones.find((phone) => phone.type === "main");
		if (agencyMainPhone) {
			return formatPhone(agencyMainPhone);
		}

		// Priority 6: Agency's first available phone
		return formatPhone(agencyPhones[0]);
	}

	return "";
}

/**
 * Variable replacement configuration
 * Maps variable names to data extractors that receive user, agency, and business info data
 */
interface VariableExtractor {
	[key: string]: (
		user: IUser | null,
		agency: IAgency | null,
		businessInfo?: IBusinessInformation | null
	) => string;
}

const variableExtractors: VariableExtractor = {
	// Basic company info
	company: (_user, agency, businessInfo) => {
		const value = businessInfo?.basicInfo?.name || agency?.name || "";
		console.log("🏢 Variable company:", {
			businessInfoName: businessInfo?.basicInfo?.name,
			agencyName: agency?.name,
			result: value,
		});
		return value;
	},

	// Contact info - Prioritizes user's phone over agency's phone
	phone: (user, agency) => getMainPhone(user?.phones, agency?.phones),
	email: (user) => user?.email || "",

	// Web presence - Prioritizes business info webDomain over agency webPage
	website: (_user, agency, businessInfo) => {
		const value = businessInfo?.basicInfo?.webDomain || agency?.webPage || "";
		console.log("🌐 Variable website:", {
			businessInfo: businessInfo?.basicInfo,
			webDomain: businessInfo?.basicInfo?.webDomain,
			agencyWebPage: agency?.webPage,
			result: value,
		});
		return value;
	},

	// Location - From business info contact address
	address: (_user, _agency, businessInfo) => {
		const value = businessInfo?.contactInfo?.address?.address || "";
		console.log("📍 Variable address:", {
			contactInfo: businessInfo?.contactInfo,
			address: businessInfo?.contactInfo?.address,
			addressValue: businessInfo?.contactInfo?.address?.address,
			result: value,
		});
		return value;
	},
	city: (_user, _agency, businessInfo) =>
		businessInfo?.contactInfo?.address?.city || "",
	country: (_user, agency, businessInfo) =>
		businessInfo?.contactInfo?.address?.country || agency?.country || "",

	// Business info
	description: (_user, agency, businessInfo) =>
		businessInfo?.brandConfig?.description || agency?.description || "",

	// Google Business
	google_business: (_user, agency, businessInfo) =>
		businessInfo?.contactInfo?.address?.urlGoogleMaps ||
		agency?.urlGoogleBusiness ||
		"",
};

/**
 * Replace variables in text with user, agency, and business information data
 *
 * Variables are defined using double curly braces: {{variable_name}}
 * All variables are in English.
 *
 * Supported variables:
 * - {{company}} - Business/Agency name (from businessInfo or agency)
 * - {{phone}} - Phone number with priority:
 *   1. User's sales phone (type = "sales")
 *   2. User's main phone (type = "main")
 *   3. User's first available phone
 *   4. Agency's sales phone (fallback)
 *   5. Agency's main phone (fallback)
 *   6. Agency's first available phone (fallback)
 * - {{email}} - User's email address
 * - {{website}} - Website URL (from digital contact config or agency)
 * - {{address}} - Business physical address (from location config)
 * - {{city}} - City (from location config)
 * - {{country}} - Country (from location config or agency)
 * - {{description}} - Business description (from brand config or agency)
 * - {{google_business}} - Google Business/Maps URL (from location config)
 *
 * @param text - Text containing variables to replace
 * @param user - User data to extract values from (priority for contact info)
 * @param agency - Agency data to extract values from (fallback)
 * @param businessInfo - Business information data (priority for business details)
 * @returns Text with variables replaced by actual values
 *
 * @example
 * const text = "Contact us at {{phone}} or visit {{website}}";
 * const result = replaceVariables(text, user, agency, businessInfo);
 * // Result: "Contact us at +57 3001234567 or visit https://example.com"
 *
 * @example
 * // Website priority: businessInfo.webDomain over agency.webPage
 * // If businessInfo has webDomain: "https://mysite.com"
 * // And agency has webPage: "https://oldsite.com"
 * // {{website}} will use "https://mysite.com" (businessInfo takes priority)
 */
export function replaceVariables(
	text: string,
	user: IUser | null,
	agency: IAgency | null,
	businessInfo?: IBusinessInformation | null
): string {
	if (!text) return text;

	// Find all variables in the text using regex: {{variable_name}}
	const variablePattern = /\{\{(\w+)\}\}/g;

	return text.replace(variablePattern, (match, variableName) => {
		// Convert variable name to lowercase for case-insensitive matching
		const normalizedVariableName = variableName.toLowerCase();

		// Get the extractor function for this variable
		const extractor = variableExtractors[normalizedVariableName];

		if (!extractor) {
			// Variable not found, return original placeholder
			console.warn(
				`Variable "${variableName}" not found in variable extractors`
			);
			return match;
		}

		// Extract and return the value
		const value = extractor(user, agency, businessInfo);
		return value || match; // If value is empty, keep the placeholder
	});
}

/**
 * Get all available variables for replacement
 * Useful for showing users what variables they can use
 *
 * @returns Array of variable names
 */
export function getAvailableVariables(): string[] {
	return Object.keys(variableExtractors);
}

/**
 * Check if text contains any variables
 *
 * @param text - Text to check
 * @returns true if text contains at least one variable
 */
export function hasVariables(text: string): boolean {
	if (!text) return false;
	const variablePattern = /\{\{(\w+)\}\}/;
	return variablePattern.test(text);
}
