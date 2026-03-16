import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";
import { AITagsFilterComponent } from "@shared/ui/components/ai-tags-filter/ai-tags-filter.component";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { FilterSection } from "../../filter-section/filter-section.component";

interface AITagsFilterSectionProps {
	selectedTags: IAiTag[];
	tagSearchQuery: string;
	availableTags: IAiTag[];
	isExpanded: boolean;
	activeFiltersCount: number;
	onToggleExpanded: () => void;
	onTagToggle: (tag: IAiTag) => void;
	onTagSearch: (query: string) => void;
}

/**
 * AITagsFilterSection Component
 *
 * Sección de filtros por etiquetas de IA con búsqueda
 */
export const AITagsFilterSection: FC<AITagsFilterSectionProps> = ({
	selectedTags,
	tagSearchQuery,
	availableTags,
	isExpanded,
	activeFiltersCount,
	onToggleExpanded,
	onTagToggle,
	onTagSearch,
}) => {
	const { t } = useTranslate();

	return (
		<FilterSection
			title={t("clients_filter_tags_title", "Etiquetas de IA")}
			isExpanded={isExpanded}
			onToggleExpanded={onToggleExpanded}
			activeFiltersCount={activeFiltersCount}
		>
			<div className="space-y-4">
				<AITagsFilterComponent
					selectedTags={selectedTags}
					tagSearchQuery={tagSearchQuery}
					availableTags={availableTags}
					onTagToggle={onTagToggle}
					onTagSearch={onTagSearch}
				/>
			</div>
		</FilterSection>
	);
};
