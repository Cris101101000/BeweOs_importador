/**
 * ColumnManager Component
 *
 * A dropdown component for managing table fields visibility that provides:
 *
 * ## Features
 * - 🏗️ **Field Visibility**: Show/hide individual table fields
 * - 🔒 **Required Fields**: Prevent hiding of essential fields
 * - 🎯 **Visual Indicators**: Icons and clear visual states
 * - ♿ **Accessibility**: Full WCAG 2.1 compliance with keyboard navigation
 * - 🌍 **Internationalization**: Complete i18n support with fallback texts
 * - 🎨 **Customizable**: Flexible trigger and styling options
 *
 * ## Usage Patterns
 *
 * ### Basic Usage
 * ```tsx
 * <ColumnManager
 *   fields={fields}
 *   onFieldVisibilityChange={handleToggle}
 * />
 * ```
 *
 * ### With Custom Trigger
 * ```tsx
 * <ColumnManager
 *   fields={fields}
 *   onFieldVisibilityChange={handleToggle}
 *   trigger={
 *     <Button variant="ghost" startContent={<SettingsIcon />}>
 *       Columnas
 *     </Button>
 *   }
 * />
 * ```
 *
 * @component
 * @example
 * ```tsx
 * import { ColumnManager } from '@clients/ui/components';
 *
 * function TableToolbar() {
 *   const [fields, setFields] = useState([]);
 *
 *   const handleToggle = (fieldKey: string, visible: boolean) => {
 *     setFields(prev => prev.map(f =>
 *       f.key === fieldKey ? { ...f, isVisible: visible } : f
 *     ));
 *   };
 *
 *   return (
 *     <div className="flex gap-2 items-center">
 *       <ColumnManager
 *         fields={fields}
 *         onFieldVisibilityChange={handleToggle}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */

import {
	Checkbox,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
	IconComponent,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { type FC, useCallback } from "react";

import { ResponsiveButton } from "@shared/ui/components/responsive-button";
// Import types and constants from separate files
import type { ColumnManagerProps } from "./column-manager.types";

/**
 * ColumnManager component implementation
 *
 * @param props - Component props as defined in ColumnManagerProps
 * @returns JSX element representing the column manager dropdown
 *
 * @remarks
 * This component manages table column visibility and provides options to add new columns.
 * It uses a dropdown interface with checkboxes for each column and maintains accessibility.
 *
 * @example
 * ```tsx
 * <ColumnManager
 *   columns={tableColumns}
 *   onColumnVisibilityChange={(key, visible) => updateColumn(key, visible)}
 *   onAddColumn={() => openColumnModal()}
 * />
 * ```
 */
export const ColumnManager: FC<ColumnManagerProps> = ({
	fields,
	onFieldVisibilityChange,
	trigger,
	disabled = false,
	className = "",
	size = "sm",
}) => {
	const { t } = useTranslate();

	/**
	 * Handles column visibility toggle
	 *
	 * @param columnKey - The key of the column to toggle
	 * @param visible - New visibility state
	 *
	 * @remarks
	 * This callback is memoized to prevent unnecessary re-renders
	 * and is called when a user toggles a column's visibility.
	 */
	const handleFieldToggle = useCallback(
		(fieldKey: string, visible: boolean) => {
			onFieldVisibilityChange?.(fieldKey, visible);
		},
		[onFieldVisibilityChange]
	);

	/**
	 * Default trigger button when none is provided
	 */
	const defaultTrigger = (
		<ResponsiveButton
			icon={"solar:sort-horizontal-outline"}
			text={t("clients_column_manager", "Columnas")}
			variant="flat"
			color="default"
			aria-label={t("clients_column_manager_aria", "Columnas")}
			iconClassName="text-default-800"
			disabled={disabled}
			className={className}
			size={size}
		/>
	);

	return (
		<Dropdown>
			<DropdownTrigger>{trigger || defaultTrigger}</DropdownTrigger>
			<DropdownMenu closeOnSelect={false}>
				<DropdownSection
					classNames={{
						heading: "text-sm text-default-800 font-medium",
					}}
					title={t("clients_column_manager_aria", "Gestionar columnas")}
				>
					{fields.map((field) => (
						<DropdownItem
							key={`toggle_${field.key}`}
							textValue={field.label}
							className="py-1"
						>
							<div className="flex items-center justify-between w-full gap-2">
								<div className="flex items-center gap-2 flex-1">
									{/* {field.icon && (
										<IconComponent
											icon={field.icon}
											className="text-default-500"
											size={size}
										/>
									)} */}
									<span className="text-tiny">
										{t(field.label, field.label)}
									</span>
								</div>
								<Checkbox
									isSelected={field.isVisible}
									isDisabled={field.canHide === false}
									onValueChange={(checked) => {
										handleFieldToggle(field.key, checked);
									}}
									aria-label={t(
										"clients_column_toggle_visibility_aria",
										`Alternar visibilidad de ${field.label}`
									)}
									size="sm"
									classNames={{
										base: " p-0",
									}}
								/>
							</div>
						</DropdownItem>
					))}
				</DropdownSection>
			</DropdownMenu>
		</Dropdown>
	);
};
