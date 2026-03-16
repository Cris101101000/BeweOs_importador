import {
	COMMUNICATION_STATUS_CONFIG,
	COMMUNICATION_TYPE_CONFIG,
} from "../constants/history.constants";
import type {
	CommunicationStatus,
	CommunicationType,
} from "../interfaces/communication.interface";

/**
 * Business logic utilities for client history management
 */

/**
 * Gets the translated label for a communication type
 * @param type - Communication type enum value
 * @param t - Translation function
 * @returns Translated communication type label
 */
export const getCommunicationTypeLabel = (
	type: CommunicationType,
	t: (key: string, defaultValue: string) => string
): string => {
	const config = COMMUNICATION_TYPE_CONFIG[type];
	return t(config.translationKey, config.defaultLabel);
};

/**
 * Gets the translated label for a communication status
 * @param status - Communication status enum value
 * @param t - Translation function
 * @returns Translated communication status label
 */
export const getCommunicationStatusLabel = (
	status: CommunicationStatus,
	t: (key: string, defaultValue: string) => string
): string => {
	const config = COMMUNICATION_STATUS_CONFIG[status];
	return t(config.translationKey, config.defaultLabel);
};

/**
 * Gets the color for a communication status chip
 * @param status - Communication status enum value
 * @returns Color variant for the status chip
 */
export const getCommunicationStatusColor = (
	status: CommunicationStatus
): "success" | "orange" | "danger" => {
	const config = COMMUNICATION_STATUS_CONFIG[status];
	return config.color;
};

/**
 * Formats a date string to a localized date format
 * @param dateString - ISO date string
 * @param locale - Locale for formatting (optional, defaults to user's locale)
 * @returns Formatted date string
 */
export const formatHistoryDate = (
	dateString: string,
	locale?: string
): string => {
	try {
		return new Date(dateString).toLocaleDateString(locale);
	} catch {
		return dateString;
	}
};

/**
 * Gets the display name for a communication item
 * @param communication - Communication object
 * @returns Display name (title, phone, or email)
 */
export const getCommunicationDisplayName = (communication: {
	title?: string;
	recipientPhone?: string;
	recipientEmail?: string;
}): string => {
	return (
		communication.title ||
		communication.recipientPhone ||
		communication.recipientEmail ||
		""
	);
};

/**
 * Truncates text content for display in lists
 * @param content - Text content to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateContent = (content: string, maxLength = 100): string => {
	if (content.length <= maxLength) {
		return content;
	}
	return `${content.substring(0, maxLength)}...`;
};
