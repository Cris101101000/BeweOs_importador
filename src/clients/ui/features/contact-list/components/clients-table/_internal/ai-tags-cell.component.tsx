import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";
import { TagsList } from "@clients/ui/_shared/components/tags-list";
import type { TagItem } from "@clients/ui/_shared/components/tags-list";
import type { FC } from "react";

interface AiTagsCellProps {
	tags?: IAiTag[];
	onEdit: () => void;
	/** Maximum number of tags to display before showing "+N" */
	maxVisible?: number;
}

/**
 * AiTagsCell Component
 *
 * Cell component for displaying AI tags in the clients table.
 * Uses the unified TagsList component for consistent styling.
 */
export const AiTagsCell: FC<AiTagsCellProps> = ({
	tags = [],
	onEdit,
	maxVisible = 2,
}) => {
	// Convert IAiTag to TagItem format
	const tagItems: TagItem[] = (tags || []).map((tag) => ({
		id: tag.id,
		label: tag.value,
		color: tag.color,
	}));

	return (
		<TagsList
			tags={tagItems}
			maxVisible={maxVisible}
			onEdit={onEdit}
			showEditButton
			variant="inline"
		/>
	);
};
