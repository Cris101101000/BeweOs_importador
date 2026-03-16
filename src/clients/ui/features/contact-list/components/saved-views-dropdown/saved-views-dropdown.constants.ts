/**
 * Constants and configuration for SavedViewsDropdown component
 */

import type { SavedViewKey } from "./saved-views-dropdown.types";

/**
 * Default configuration values for the component
 */
export const DEFAULT_CONFIG = {
	/** Default selected view when none is specified */
	selectedView: "default" as SavedViewKey,

	/** Default button variant */
	variant: "flat" as const,

	/** Default button color */
	color: "default" as const,

	/** Default disabled state */
	disabled: false,

	/** Default CSS classes */
	className: "",
} as const;

/**
 * Translation keys used by the component
 *
 * These keys should be defined in your translation files (en.json, es.json, etc.)
 */
export const TRANSLATION_KEYS = {
	/** Main button aria label */
	buttonAria: "clients_saved_views_button_aria",

	/** Dropdown menu aria label */
	menuAria: "clients_saved_views_menu",

	/** Fallback text for button */
	fallbackText: "clients_saved_views",
} as const;
