import { Chip } from "@beweco/aurora-ui";
import type { FC } from "react";

export interface TagChipProps {
	/** Unique identifier for the tag */
	id?: string;
	/** Display text for the tag */
	label: string;
	/** Background/accent color for the tag (hex format) - optional */
	color?: string;
	/** Size of the chip */
	size?: "sm" | "md" | "lg";
	/** Click handler */
	onClick?: () => void;
}

/**
 * TagChip Component
 *
 * Unified component for displaying tags across the application.
 * Uses consistent flat/default styling matching the original implementation.
 */
export const TagChip: FC<TagChipProps> = ({ label, size = "sm", onClick }) => {
	return (
		<Chip
			size={size}
			variant="flat"
			color="default"
			radius="sm"
			onClick={onClick}
		>
			{label}
		</Chip>
	);
};
