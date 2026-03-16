/**
 * Type definitions for SavedViewsDropdown component
 */

import type { IView } from "@clients/domain/interfaces/view.interface";

/**
 * Props interface for the SavedViewsDropdown component
 */
export interface SavedViewsDropdownProps {
	/** Callback function executed when a view is selected from the dropdown */
	onViewSelect?: (viewKey: string) => void;

	/** Callback function executed when a view is deleted from the dropdown */
	onViewDelete?: (viewKey: string, viewName: string) => void;

	/** Currently selected view key - determines which view appears as active */
	selectedView?: string;

	/** Array of views to display in the dropdown */
	views?: IView[];

	/** Visual variant of the dropdown button */
	variant?: "flat" | "solid" | "bordered" | "light" | "ghost";

	/** Color theme of the dropdown button */
	color?:
		| "default"
		| "primary"
		| "secondary"
		| "success"
		| "warning"
		| "danger";

	/** Whether the dropdown is disabled and non-interactive */
	disabled?: boolean;

	/** Additional CSS classes to apply to the dropdown button */
	className?: string;
}

/**
 * Configuration object for a saved view option
 */
export interface SavedViewConfig {
	/** Unique identifier for the view */
	readonly key: string;

	/** Translation key for internationalization */
	readonly translationKey: string;

	/** Fallback text when translation is not available */
	readonly fallback: string;

	/** Optional description for the view */
	readonly description?: string;

	/** Optional icon for the view */
	readonly icon?: string;
}

/**
 * Available view keys as a union type for type safety
 */
export type SavedViewKey =
	| "default"
	| "last"
	| "active_clients"
	| "recent_leads";
