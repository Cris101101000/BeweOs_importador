import {
	Card,
	Radio,
	RadioGroup,
	themeColors,
	useThemeContext,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import type { PlatformColorManagerProps } from "./platform-color-manager.types";

/**
 * ColorSelector component
 *
 * This component renders a horizontal group of selectable color options (radio buttons)
 * for the user to choose the primary color of the platform. The available color options
 * are dynamically filtered based on the current theme mode (light or dark).
 *
 * Props:
 * - selectedColor: string - The currently selected color key.
 * - onColorChange: (color: string) => void - Callback invoked when the user selects a new color.
 *
 * Usage:
 * <ColorSelector
 *   selectedColor={selectedColor}
 *   onColorChange={onColorChange}
 * />
 */
const ColorSelector: React.FC<PlatformColorManagerProps> = ({
	selectedColor,
	onColorChange,
}) => {
	const { mode } = useThemeContext();

	/**
	 * Filters and maps the available theme colors to the current theme mode (light/dark).
	 * Each color option contains:
	 * - value: the theme name (e.g., "blue-light")
	 * - label: the base color name (e.g., "blue")
	 * - color: the primary color hex value
	 */
	const colorOptions = Object.entries(themeColors)
		.filter(([, themeData]) => {
			const themeMode = themeData.extend;
			return mode === "light" ? themeMode === "light" : themeMode === "dark";
		})
		.map(([themeName, theme]) => ({
			value: themeName,
			label: themeName.split("-")[0],
			color: theme.colors.primary.DEFAULT,
		}));

	return (
		<RadioGroup
			value={selectedColor}
			onValueChange={onColorChange}
			orientation="horizontal"
			className="flex flex-wrap !gap-2"
			classNames={{
				base: "flex flex-wrap !gap-2",
				wrapper: "flex flex-wrap !gap-2",
			}}
		>
			{colorOptions.map((color) => (
				<Radio
					key={color.value}
					value={color.label}
					className="p-0 m-0"
					classNames={{
						base: "p-0 m-0",
						wrapper: "hidden",
						labelWrapper: "p-0 m-0",
					}}
				>
					{/* 
						Circle representing the color option.
						- If selected, the border is highlighted and the circle is scaled up.
						- If not selected, the border is gray and the circle scales up on hover.
					*/}
					<div
						className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all ${
							selectedColor === color.label
								? "border-black border-opacity-20 scale-110"
								: "border-gray-200 hover:scale-105"
						}`}
						style={{ backgroundColor: color.color }}
						title={color.label}
					/>
				</Radio>
			))}
		</RadioGroup>
	);
};

/**
 * PlatformColorManager component
 *
 * This component provides a UI for managing the platform's primary color.
 * It displays a card with a title, description, and a color selector for the user
 * to choose the main color of the platform. The color selector is disabled/enabled
 * based on the parent logic.
 *
 * Props:
 * - selectedColor: string - The currently selected color key.
 * - onColorChange: (color: string) => void - Callback invoked when the user selects a new color.
 *
 * Usage:
 * <PlatformColorManager
 *   selectedColor={selectedColor}
 *   onColorChange={onColorChange}
 * />
 */
export const PlatformColorManager: React.FC<PlatformColorManagerProps> = ({
	selectedColor,
	onColorChange,
}) => {
	const { t } = useTranslate();

	return (
		<Card className="p-5 w-full gap-4 flex-grow">
			<div>
				{/* Title and description for the platform color section */}
				<h2 className="font-medium text-lg">
					{t("settings_business_platform_color_title")}
				</h2>
				<p className="text-default-500 text-sm">
					{t("settings_business_platform_color_description")}
				</p>
			</div>

			{/* Subtitle for the primary color selection */}
			<h2 className="font-medium text-base text-default-700">
				{t("settings_business_platform_color_primary")}
			</h2>
			{/* Color selection radio group */}
			<ColorSelector
				selectedColor={selectedColor}
				onColorChange={onColorChange}
			/>
		</Card>
	);
};
