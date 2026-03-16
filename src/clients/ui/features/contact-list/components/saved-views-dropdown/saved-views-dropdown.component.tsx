/**
 * SavedViewsDropdown Component
 *
 * A sophisticated dropdown component for managing saved client views that provides:
 *
 * ## Features
 * - 🎯 **Multiple View Options**: Predefined views for different client segments
 * - 🔄 **State Management**: Tracks and displays currently selected view
 * - ♿ **Accessibility**: Full WCAG 2.1 compliance with keyboard navigation
 * - 🌍 **Internationalization**: Complete i18n support with fallback texts
 * - 🎨 **Customizable**: Multiple variants, colors, and styling options
 * - 📱 **Responsive**: Adapts to different screen sizes and contexts
 *
 * ## Usage Patterns
 *
 * ### Basic Usage
 * ```tsx
 * <SavedViewsDropdown
 *   onViewSelect={(viewKey) => handleViewChange(viewKey)}
 * />
 * ```
 *
 * ### With State Management
 * ```tsx
 * const [currentView, setCurrentView] = useState('default');
 *
 * <SavedViewsDropdown
 *   selectedView={currentView}
 *   onViewSelect={setCurrentView}
 *   variant="solid"
 *   color="primary"
 * />
 * ```
 *
 * ### Custom Styling
 * ```tsx
 * <SavedViewsDropdown
 *   className="w-full md:w-auto"
 *   variant="bordered"
 *   disabled={isLoading}
 * />
 * ```
 *
 * @component
 * @example
 * ```tsx
 * import { SavedViewsDropdown } from '@clients/ui/components';
 *
 * function ClientsToolbar() {
 *   const [selectedView, setSelectedView] = useState('default');
 *
 *   const handleViewChange = (viewKey: string) => {
 *     setSelectedView(viewKey);
 *     // Apply view-specific filters
 *     applyViewFilters(viewKey);
 *   };
 *
 *   return (
 *     <div className="flex gap-4 items-center">
 *       <SavedViewsDropdown
 *         selectedView={selectedView}
 *         onViewSelect={handleViewChange}
 *         variant="flat"
 *         color="primary"
 *       />
 *     </div>
 *   );
 * }
 * ```
 */

import {
	Button,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	IconComponent,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import { type FC, type Key, useCallback, useMemo, useState } from "react";

// Import types and constants from separate files
import {
	DEFAULT_CONFIG,
	TRANSLATION_KEYS,
} from "./saved-views-dropdown.constants";
import type { SavedViewsDropdownProps } from "./saved-views-dropdown.types";

/**
 * SavedViewsDropdown component implementation
 *
 * @param props - Component props as defined in SavedViewsDropdownProps
 * @returns JSX element representing the dropdown component
 *
 * @remarks
 * This component uses React hooks for state management and event handling.
 * It automatically handles internationalization through the useTranslate hook
 * and provides full keyboard accessibility.
 *
 * @example
 * ```tsx
 * <SavedViewsDropdown
 *   selectedView="active_clients"
 *   onViewSelect={(key) => handleViewChange(key)}
 *   variant="solid"
 *   color="primary"
 * />
 * ```
 */
export const SavedViewsDropdown: FC<SavedViewsDropdownProps> = ({
	onViewSelect,
	onViewDelete,
	selectedView = DEFAULT_CONFIG.selectedView,
	views = [],
	variant = DEFAULT_CONFIG.variant,
	color = DEFAULT_CONFIG.color,
	disabled = DEFAULT_CONFIG.disabled,
	className = DEFAULT_CONFIG.className,
}) => {
	const { t } = useTranslate();

	// Controla la apertura/cierre del dropdown para poder cerrarlo programáticamente
	const [isOpen, setIsOpen] = useState(false);

	/**
	 * Handles view selection from dropdown menu
	 *
	 * @param key - The selected view key from the dropdown
	 *
	 * @remarks
	 * This callback is memoized to prevent unnecessary re-renders
	 * and is called when a user selects a view from the dropdown menu.
	 */
	const handleViewSelect = useCallback(
		(key: Key) => {
			const viewKey = key as string;
			onViewSelect?.(viewKey);
		},
		[onViewSelect]
	);

	/**
	 * Combines static views with real views data for dropdown display
	 */
	const dropdownItems = useMemo(() => {
		const realViews = views.map((view) => ({
			key: view.id || view.name,
			translationKey: "", // Real views don't have translation keys
			fallback: view.name,
			description: view.description,
			icon: "solar:bookmark-linear",
			isStatic: false,
		}));

		return [...realViews];
	}, [views]);

	/**
	 * Gets the display text for the currently selected view
	 *
	 * @returns Translated text for the selected view or fallback text
	 *
	 * @remarks
	 * This function finds the selected view in the combined items and returns
	 * its translated text. Falls back to default text if view is not found.
	 */
	const getSelectedViewText = useCallback(() => {
		const selectedViewConfig = dropdownItems.find(
			(item) => item.key === selectedView
		);

		if (selectedViewConfig) {
			return selectedViewConfig.isStatic
				? t(selectedViewConfig.translationKey, selectedViewConfig.fallback)
				: selectedViewConfig.fallback;
		}

		return t(TRANSLATION_KEYS.fallbackText, "Vistas guardadas");
	}, [selectedView, t, dropdownItems]);

	return (
		<Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
			<DropdownTrigger>
				<Button
					variant={variant}
					color={color}
					disabled={disabled}
					className={className}
					endContent={
						<IconComponent
							icon="solar:alt-arrow-down-linear"
							aria-hidden="true"
							size="sm"
						/>
					}
					size="sm"
					aria-label={t(
						TRANSLATION_KEYS.buttonAria,
						"Seleccionar vista guardada"
					)}
				>
					{getSelectedViewText()}
				</Button>
			</DropdownTrigger>
			<DropdownMenu
				aria-label={t(TRANSLATION_KEYS.menuAria, "Vistas guardadas")}
				selectedKeys={new Set([selectedView])}
				selectionMode="single"
				onSelectionChange={(keys) => {
					const selectedKey = Array.from(keys)[0] as string;
					if (selectedKey) {
						handleViewSelect(selectedKey);
					}
				}}
				className="w-60 max-h-80 overflow-y-auto"
			>
				{dropdownItems.map((item) => (
					<DropdownItem
						key={item.key}
						classNames={{
							title: "text-tiny whitespace-normal break-words",
							base: "group",
						}}
						endContent={
							<IconComponent
								icon="solar:trash-bin-minimalistic-outline"
								aria-hidden="true"
								color="red"
								size="sm"
								onClick={(e) => {
									e.stopPropagation();
									onViewDelete?.(item.key, item.fallback);
									setIsOpen(false);
								}}
								className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
							/>
						}
					>
						<span className="whitespace-normal break-words">
							{item.isStatic
								? t(item.translationKey, item.fallback)
								: item.fallback}
						</span>
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
};
