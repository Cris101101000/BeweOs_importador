import { Button, Chip, IconComponent, Tooltip } from "@beweco/aurora-ui";
import { TagChip } from "@clients/ui/_shared/components/tag-chip";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";

export interface TagItem {
	id?: string;
	/** Display text - supports both 'value' (IAiTag) and 'title' (IEntityAssignedTag) */
	label: string;
	color?: string;
}

export interface TagsListProps {
	/** Array of tags to display */
	tags: TagItem[];
	/** Maximum number of visible tags before showing "+N" */
	maxVisible?: number;
	/** Callback when edit button is clicked */
	onEdit?: () => void;
	/** Whether to show the edit button */
	showEditButton?: boolean;
	/** Size of the tag chips */
	size?: "sm" | "md" | "lg";
	/** Custom class for the container */
	className?: string;
}

/**
 * TagsList Component
 *
 * Unified component for displaying a list of tags with:
 * - Configurable max visible tags
 * - "+N" indicator for hidden tags
 * - Optional edit button
 * - Consistent flat/default styling matching the original implementation
 */
export const TagsList: FC<TagsListProps> = ({
	tags,
	maxVisible = 2,
	onEdit,
	showEditButton = true,
	size = "sm",
	className = "",
}) => {
	const { t } = useTranslate();

	// If no tags, show empty state with add button
	if (!tags || tags.length === 0) {
		if (!showEditButton || !onEdit) {
			return <span className="text-sm text-default-400">-</span>;
		}

		return (
			<div className="flex items-center justify-center">
				<Tooltip content={t("add_tags", "Agregar etiquetas")}>
					<Button
						isIconOnly
						size="sm"
						variant="flat"
						color="default"
						onPress={onEdit}
						aria-label="Add tags"
						radius="full"
						className="min-w-6 w-6 h-6"
						startContent={
							<IconComponent
								icon="solar:tag-outline"
								size="sm"
								className="w-3 h-3"
							/>
						}
					/>
				</Tooltip>
			</div>
		);
	}

	const visibleTags = tags.slice(0, maxVisible);
	const remainingCount = tags.length - maxVisible;

	return (
		<div className={`flex flex-wrap gap-1 ${className}`}>
			{visibleTags.map((tag, index) => (
				<TagChip key={tag.id || `tag-${index}`} label={tag.label} size={size} />
			))}

			{remainingCount > 0 && (
				<Chip size={size} variant="flat" color="default" radius="sm">
					+{remainingCount}
				</Chip>
			)}

			{showEditButton && onEdit && (
				<Tooltip content={t("edit_tags", "Editar etiquetas")}>
					<Button
						isIconOnly
						size="sm"
						variant="light"
						color="default"
						onPress={onEdit}
						aria-label="Edit tags"
						radius="full"
						className="min-w-5 w-5 h-5"
						startContent={
							<IconComponent
								icon="solar:pen-new-square-outline"
								size="sm"
								className="w-3 h-3"
							/>
						}
					/>
				</Tooltip>
			)}
		</div>
	);
};
