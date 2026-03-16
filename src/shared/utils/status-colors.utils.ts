/**
 * Utility for mapping status colors to Tailwind CSS classes.
 * This ensures that the full class names are present in the source code
 * for Tailwind's JIT compiler to detect and generate the corresponding CSS.
 */
export const BACKGROUND_COLOR_MAP: { [key: string]: string } = {
	green: "bg-green-100",
	purple: "bg-purple-100",
	blue: "bg-blue-100",
	red: "bg-red-100",
	orange: "bg-orange-100",
};
