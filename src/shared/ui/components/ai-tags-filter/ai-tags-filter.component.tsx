import { Chip, P, SearchInput } from "@beweco/aurora-ui";
import type { IAiTag } from "@clients/domain/interfaces/ai-tag.interface";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";

interface AITagsFilterComponentProps {
	selectedTags: IAiTag[];
	tagSearchQuery: string;
	availableTags: IAiTag[];
	onTagToggle: (tag: IAiTag) => void;
	onTagSearch: (query: string) => void;
}

/**
 * AITagsFilterSection Component
 *
 * Sección de filtros por etiquetas de IA con búsqueda
 */
export const AITagsFilterComponent: FC<AITagsFilterComponentProps> = ({
	selectedTags,
	tagSearchQuery,
	availableTags,
	onTagToggle,
	onTagSearch,
}) => {
	const { t } = useTranslate();

	const isTagSelected = (tag: IAiTag) =>
		selectedTags.some(
			(selectedTag) =>
				selectedTag.value === tag.value ||
				(tag.id && selectedTag.id === tag.id)
		);

	// Etiquetas disponibles filtradas por búsqueda (excluyendo seleccionadas)
	const filteredAvailableTags = availableTags.filter(
		(tag) =>
			tag.value.toLowerCase().includes(tagSearchQuery.toLowerCase()) &&
			!isTagSelected(tag)
	);

	return (
		<div className="flex flex-col gap-2">
			{/* Etiquetas seleccionadas (arriba, con x para quitar) */}
			{selectedTags.length > 0 && (
				<div className="flex flex-wrap gap-2 bg-default-100 rounded-xl px-4 py-3">
					{selectedTags.map((tag) => (
						<Chip
							key={tag.id ?? tag.value}
							variant="shadow"
							color="primary"
							className="transition-all"
							onClose={() => onTagToggle(tag)}
						>
							{tag.value}
						</Chip>
					))}
				</div>
			)}

			{/* Búsqueda de etiquetas */}
			<SearchInput
				placeholder={t("clients_filter_tags_search")}
				value={tagSearchQuery}
				onValueChange={onTagSearch}
				variant="bordered"
				size="md"
				className="flex-1"
			/>

			{/* Etiquetas disponibles para seleccionar */}
			<div className="flex flex-wrap gap-2 max-h-[88px] overflow-y-auto bg-default-100 rounded-xl px-4 py-3">
				{filteredAvailableTags.length > 0 ? (
					filteredAvailableTags.map((tag) => (
						<Chip
							key={tag.id ?? tag.value}
							variant="flat"
							color="primary"
							className="cursor-pointer transition-all hover:scale-105"
							onClick={() => onTagToggle(tag)}
						>
							{tag.value}
						</Chip>
					))
				) : (
					<P className="text-tiny">
						{t("clients_filter_no_tags", "No se encontraron etiquetas")}
					</P>
				)}
			</div>
		</div>
	);
};
