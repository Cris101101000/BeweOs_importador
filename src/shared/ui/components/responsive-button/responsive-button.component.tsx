import type { ButtonProps } from "@beweco/aurora-ui";
import { Button, IconComponent } from "@beweco/aurora-ui";
import { useBreakpoint } from "@shared/ui/hooks/useBreakpoint";

export interface ResponsiveButtonProps extends Omit<ButtonProps, "children"> {
	/**
	 * Icon to display in the button
	 */
	icon: string;

	/**
	 * Text to display on desktop version
	 */
	text: string;

	/**
	 * Additional className for styling
	 */
	className?: string;

	/**
	 * Button click handler
	 */
	onPress?: () => void;

	/**
	 * Button variant
	 */
	variant?: ButtonProps["variant"];

	/**
	 * Button color
	 */
	color?: ButtonProps["color"];

	/**
	 * Whether the button is disabled
	 */
	disabled?: boolean;

	/**
	 * ARIA label for accessibility
	 */
	ariaLabel?: string;

	/**
	 * Button size
	 */
	size?: "sm" | "md" | "lg";

	/**
	 * Icon class name
	 */
	iconClassName?: string;
}

/**
 * ResponsiveButton Component
 *
 * Renders a button that shows only an icon on mobile and icon + text on desktop.
 * Uses a single button with responsive text visibility instead of duplicating buttons.
 *
 * @example
 * ```tsx
 * <ResponsiveButton
 *   icon="solar:trash-bin-trash-bold"
 *   text="Eliminar"
 *   variant="bordered"
 *   color="danger"
 *   onPress={() => console.log("delete")}
 * />
 * ```
 */
export const ResponsiveButton = ({
	icon,
	text,
	className = "",
	onPress,
	variant = "flat",
	color = "default",
	disabled = false,
	ariaLabel,
	size = "sm",
	iconClassName = "",
	...props
}: ResponsiveButtonProps) => {
	const isDesktop = useBreakpoint("lg");

	return (
		<Button
			variant={variant}
			color={color}
			startContent={
				<IconComponent
					icon={icon}
					className={`xs:block lg:hidden ${iconClassName}`}
					size={size}
				/>
			}
			onPress={onPress}
			disabled={disabled}
			aria-label={ariaLabel || text}
			isIconOnly={!isDesktop}
			className={className}
			size={size}
			{...props}
		>
			{/* Mostrar texto solo en desktop (md y superior) */}
			{isDesktop && <span>{text}</span>}
		</Button>
	);
};
