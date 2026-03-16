import { Accordion, AccordionItem, Chip, H3, cn } from "@beweco/aurora-ui";
import type { FC } from "react";
import type { FilterSectionProps } from "./filter-section.types";

/**
 * FilterSection Component
 *
 * Componente para mostrar una sección de filtros usando Accordion de Aurora UI
 * con indicadores de filtros activos
 */
export const FilterSection: FC<FilterSectionProps> = ({
	title,
	isExpanded = true,
	onToggleExpanded,
	children,
	activeFiltersCount = 0,
}) => {
	// Generar key única para el accordion item
	const accordionKey = title.toLowerCase().replace(/\s+/g, "-");

	return (
		<Accordion
			variant="splitted"
			selectedKeys={isExpanded ? [accordionKey] : []}
			onSelectionChange={(keys) => {
				if (onToggleExpanded) {
					const isOpen = Array.from(keys).includes(accordionKey);
					if (isOpen !== isExpanded) {
						onToggleExpanded();
					}
				}
			}}
		>
			<AccordionItem
				key={accordionKey}
				aria-label={title}
				title={
					<div className="flex items-center gap-3">
						<H3>{title}</H3>
						{activeFiltersCount > 0 && (
							<Chip color="default" size="sm">
								{activeFiltersCount}
							</Chip>
						)}
					</div>
				}
				classNames={{
					heading: cn("border-b-0", isExpanded && "border-b border-divider"),
					content: "py-3",
				}}
			>
				<div>{children}</div>
			</AccordionItem>
		</Accordion>
	);
};
