import { Button, H3, IconComponent, P } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";

interface ClientsFilteredEmptyStateProps {
	/** Function to clear all filters */
	onClearFilters: () => void;
	/** Function to open filter modal */
	onOpenFilters: () => void;
}

/**
 * ClientsFilteredEmptyState Component
 *
 * Shows when no clients match the applied filters.
 * Provides options to clear filters or modify them.
 */
export const ClientsFilteredEmptyState: FC<ClientsFilteredEmptyStateProps> = ({
	onClearFilters,
	onOpenFilters,
}) => {
	const { t } = useTranslate();

	return (
		<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
			{/* Icon */}
			<div className="mb-6 p-4 rounded-full bg-default-100">
				<IconComponent
					icon="solar:magnifer-zoom-out-outline"
					className="w-12 h-12 text-default-400"
				/>
			</div>

			{/* Title */}
			<H3 className="mb-2 text-default-700">
				{t("clients_filtered_empty_title", "Tu búsqueda no tiene resultados")}
			</H3>

			{/* Description */}
			<P className="mb-6 text-default-500 max-w-md">
				{t(
					"clients_filtered_empty_description",
					"No encontramos contactos que coincidan con los filtros aplicados. Intenta ajustar los filtros o borrar algunos para ver más resultados."
				)}
			</P>

			{/* Action Buttons */}
			<div className="flex flex-col sm:flex-row gap-3">
				<Button
					variant="flat"
					color="default"
					size="sm"
					startContent={
						<IconComponent icon="solar:refresh-outline" size="sm" />
					}
					onPress={onClearFilters}
				>
					{t("clients_filtered_empty_clear", "Limpiar filtros")}
				</Button>

				<Button
					variant="flat"
					color="primary"
					size="sm"
					startContent={<IconComponent icon="solar:pen-2-outline" size="sm" />}
					onPress={onOpenFilters}
				>
					{t("clients_filtered_empty_modify", "Modificar filtros")}
				</Button>
			</div>

			{/* Help Text */}
			<P className="mt-6 text-tiny text-default-400">
				{t(
					"clients_filtered_empty_tip",
					"Tip: Puedes usar menos filtros específicos para obtener más resultados"
				)}
			</P>
		</div>
	);
};
