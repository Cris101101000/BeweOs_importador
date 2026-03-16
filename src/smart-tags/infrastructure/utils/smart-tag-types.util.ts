import { SMART_TAG_TYPES_CONFIG } from "../../domain/constants/smart-tag-types.config.ts";
import type { SmartTagType } from "../../domain/enums/smart-tag-type.enum.ts";

/**
 * Helper function to get the translation key for a SmartTagType
 * @param type - The SmartTagType enum value
 * @returns The translation key or undefined if not found
 */
export const getSmartTagTypeTranslationKey = (
	type: SmartTagType
): string | undefined => {
	const config = SMART_TAG_TYPES_CONFIG.find((item) => item.type === type);
	return config?.translationKey;
};

/**
 * Helper function to get the label for a SmartTagType (fallback, use translation in components)
 * @param type - The SmartTagType enum value
 * @returns The label string or 'Sin clasificar' if not found
 */
export const getSmartTagTypeLabel = (type: SmartTagType): string => {
	const config = SMART_TAG_TYPES_CONFIG.find((item) => item.type === type);
	return config?.label || "Sin clasificar";
};

/**
 * Helper function to get the chip color classes for a SmartTagType
 * @param type - The SmartTagType enum value
 * @returns The chip color classes string or default gray if not found
 */
export const getSmartTagTypeChipColor = (type: SmartTagType): string => {
	const config = SMART_TAG_TYPES_CONFIG.find((item) => item.type === type);
	return config?.chipColor || "bg-gray-50 text-gray-700 border-gray-200";
};

/**
 * Helper function to get the base color class for a SmartTagType
 * @param type - The SmartTagType enum value
 * @returns The base color class string or default gray if not found
 */
export const getSmartTagTypeColor = (type: SmartTagType): string => {
	const config = SMART_TAG_TYPES_CONFIG.find((item) => item.type === type);
	return config?.color || "bg-gray-500";
};
