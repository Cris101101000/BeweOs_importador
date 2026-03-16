/**
 * Type definitions for ColumnManager component
 */

import type { IField } from "@clients/domain/interfaces/field.interface";
import type { ReactNode } from "react";

/**
 * Props for the ColumnManager component
 */
export interface ColumnManagerProps {
	/** Array of field configurations from domain */
	fields: IField[];

	/** Callback when a field visibility changes */
	onFieldVisibilityChange?: (fieldKey: string, visible: boolean) => void;

	/** Custom trigger button element */
	trigger?: ReactNode;

	/** Whether the manager is disabled */
	disabled?: boolean;

	/** Custom CSS classes */
	className?: string;

	/** Button size */
	size?: "sm" | "md" | "lg";
}
