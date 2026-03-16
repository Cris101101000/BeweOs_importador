import { useAuraToast } from "@beweco/aurora-ui";
import { CreateCatalogItemUseCase } from "@catalog/application/create-catalog-item.usecase";
import { DeleteCatalogItemUseCase } from "@catalog/application/delete-catalog-item.usecase";
import { DeleteCatalogManyItemsUseCase } from "@catalog/application/delete-catalog-many-items.usecase";
import { UpdateCatalogItemUseCase } from "@catalog/application/update-catalog-item.usecase";
import type {
	ICatalogItem,
	ICreateCatalogItemRequest,
	IUpdateCatalogItemRequest,
} from "@catalog/domain/interfaces/catalog.interface";
import { CatalogAdapter } from "@catalog/infrastructure/adapters/catalog.adapter";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils";
import { useTranslate } from "@tolgee/react";
import { useCallback, useMemo } from "react";

interface UseServiceActionsResponse {
	createService: (data: ICreateCatalogItemRequest) => Promise<ICatalogItem>;
	updateService: (data: IUpdateCatalogItemRequest) => Promise<ICatalogItem>;
	deleteService: (serviceId: string) => Promise<void>;
	deleteServices: (serviceIds: string[]) => Promise<void>;
}

/**
 * React hook that provides service CRUD actions with built-in error handling and toast notifications
 */
export const useServiceActions = (): UseServiceActionsResponse => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();

	// Use CatalogAdapter for service operations
	const catalogAdapter = useMemo(() => new CatalogAdapter(), []);

	const createServiceUseCase = useMemo(
		() => new CreateCatalogItemUseCase(catalogAdapter),
		[catalogAdapter]
	);
	const updateServiceUseCase = useMemo(
		() => new UpdateCatalogItemUseCase(catalogAdapter),
		[catalogAdapter]
	);
	const deleteServiceUseCase = useMemo(
		() => new DeleteCatalogItemUseCase(catalogAdapter),
		[catalogAdapter]
	);
	const deleteManyServicesUseCase = useMemo(
		() => new DeleteCatalogManyItemsUseCase(catalogAdapter),
		[catalogAdapter]
	);

	const createService = useCallback(
		async (data: ICreateCatalogItemRequest): Promise<ICatalogItem> => {
			try {
				const created = await createServiceUseCase.execute(data);

				showToast(
					configureSuccessToast(
						t("catalog_service_created_success", "Servicio creado con éxito")
					)
				);

				return created;
			} catch (error) {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						"catalog_service_created_error",
						"try_again"
					)
				);
				throw error;
			}
		},
		[createServiceUseCase, showToast, t]
	);

	const updateService = useCallback(
		async (data: IUpdateCatalogItemRequest): Promise<ICatalogItem> => {
			try {
				const updated = await updateServiceUseCase.execute(data);

				showToast(
					configureSuccessToast(
						t(
							"catalog_service_updated_success",
							"Servicio actualizado con éxito"
						)
					)
				);

				return updated;
			} catch (error) {
				// Extract error message from backend response
				const errorMessage =
					error instanceof Error
						? error.message
						: "Error actualizando servicio";

				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Validation,
						t,
						"catalog_service_updated_error",
						errorMessage
					)
				);
				throw error;
			}
		},
		[updateServiceUseCase, showToast, t]
	);

	const deleteService = useCallback(
		async (serviceId: string): Promise<void> => {
			try {
				await deleteServiceUseCase.execute(serviceId);
				showToast(
					configureSuccessToast(
						t("catalog_service_deleted_success", "Servicio eliminado con éxito")
					)
				);
			} catch (error) {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						"catalog_service_deleted_error",
						"try_again"
					)
				);
				throw error;
			}
		},
		[deleteServiceUseCase, showToast, t]
	);

	const deleteServices = useCallback(
		async (serviceIds: string[]): Promise<void> => {
			try {
				// If only one item, use individual delete
				if (serviceIds.length === 1) {
					await deleteServiceUseCase.execute(serviceIds[0]);
				} else {
					// Use bulk delete endpoint for multiple items
					await deleteManyServicesUseCase.execute(serviceIds);
				}
				showToast(
					configureSuccessToast(
						t(
							"catalog_services_deleted_success",
							"Servicios eliminados con éxito"
						)
					)
				);
			} catch (error) {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						"catalog_services_deleted_error",
						"try_again"
					)
				);
				throw error;
			}
		},
		[deleteServiceUseCase, deleteManyServicesUseCase, showToast, t]
	);

	return {
		createService,
		updateService,
		deleteService,
		deleteServices,
	};
};
