import { useAuraToast, useNavigationLoading } from "@beweco/aurora-ui";
import { GetCatalogItemByIdUseCase } from "@catalog/application/get-catalog-item-by-id.usecase";
import { EnumCatalogType } from "@catalog/domain/enums/catalog-type.enum";
import type { ICatalogItem } from "@catalog/domain/interfaces/catalog.interface";
import { CatalogAdapter } from "@catalog/infrastructure/adapters/catalog.adapter";
import { EnumErrorType } from "@shared/domain/enums";
import { configureErrorToastWithTranslation } from "@shared/utils";
import { useTranslate } from "@tolgee/react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface UseNavigateToCatalogDetailResponse {
	navigateToCatalogDetail: (
		itemId: string,
		type: EnumCatalogType,
		fallbackItemData?: ICatalogItem
	) => Promise<void>;
}

/**
 * Hook para navegar de forma segura al detalle de un producto o servicio del catálogo
 * Valida que el item exista antes de navegar, sino muestra error y permanece en la vista actual
 */
export const useNavigateToCatalogDetail =
	(): UseNavigateToCatalogDetailResponse => {
		const navigate = useNavigate();
		const { t } = useTranslate();
		const { showToast } = useAuraToast();

		const { showNavigationLoading, hideNavigationLoading } =
			useNavigationLoading();

		const useCase = useMemo(() => {
			const adapter = new CatalogAdapter();
			return new GetCatalogItemByIdUseCase(adapter);
		}, []);

		/**
		 * Navega al detalle del item del catálogo después de validar que existe
		 * @param itemId - ID del item (producto o servicio)
		 * @param type - Tipo del item (Product o Service)
		 * @param fallbackItemData - Datos del item como fallback (opcional)
		 */
		const navigateToCatalogDetail = useCallback(
			async (
				itemId: string,
				type: EnumCatalogType,
				fallbackItemData?: ICatalogItem
			): Promise<void> => {
				if (!itemId) {
					showToast(
						configureErrorToastWithTranslation(
							"Warning" as EnumErrorType,
							t,
							t("invalid_item_id", "ID de item no válido")
						)
					);
					return;
				}

				showNavigationLoading();

				try {
					// Obtener los datos frescos del item específico por ID
					const itemData = await useCase.execute(itemId);

					// Si es exitoso, navegar con los datos frescos
					const route =
						type === EnumCatalogType.Service
							? `/catalog/services/${itemId}`
							: `/catalog/products/${itemId}`;

					navigate(route, {
						state: { itemData },
					});
				} catch (error) {
					// Si falla, mostrar toast de error y permanecer en la vista actual
					const errorMessage =
						error instanceof Error ? error.message : "Error desconocido";

					showToast(
						configureErrorToastWithTranslation(
							EnumErrorType.Critical,
							t,
							"item_not_found",
							"item_fetch_error_description"
						)
					);

					// Opcionalmente, si tenemos datos de fallback y el error no es crítico,
					// podríamos navegar con esos datos
					if (fallbackItemData && errorMessage.includes("network")) {
						console.log("Using fallback data due to network error");
						const route =
							type === EnumCatalogType.Service
								? `/catalog/services/${itemId}`
								: `/catalog/products/${itemId}`;

						navigate(route, {
							state: { itemData: fallbackItemData },
						});
					}
				} finally {
					hideNavigationLoading();
				}
			},
			[
				useCase,
				navigate,
				showToast,
				t,
				showNavigationLoading,
				hideNavigationLoading,
			]
		);

		return {
			navigateToCatalogDetail,
		};
	};
