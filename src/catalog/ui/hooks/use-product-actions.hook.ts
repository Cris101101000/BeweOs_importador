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

interface UseProductActionsResponse {
	createProduct: (data: ICreateCatalogItemRequest) => Promise<ICatalogItem>;
	updateProduct: (data: IUpdateCatalogItemRequest) => Promise<ICatalogItem>;
	deleteProduct: (productId: string) => Promise<void>;
	deleteProducts: (productIds: string[]) => Promise<void>;
}

/**
 * React hook that provides product CRUD actions with built-in error handling and toast notifications
 */
export const useProductActions = (): UseProductActionsResponse => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();

	// Use CatalogAdapter for product operations
	const catalogAdapter = useMemo(() => new CatalogAdapter(), []);

	const createProductUseCase = useMemo(
		() => new CreateCatalogItemUseCase(catalogAdapter),
		[catalogAdapter]
	);
	const updateProductUseCase = useMemo(
		() => new UpdateCatalogItemUseCase(catalogAdapter),
		[catalogAdapter]
	);
	const deleteProductUseCase = useMemo(
		() => new DeleteCatalogItemUseCase(catalogAdapter),
		[catalogAdapter]
	);
	const deleteManyProductsUseCase = useMemo(
		() => new DeleteCatalogManyItemsUseCase(catalogAdapter),
		[catalogAdapter]
	);

	const createProduct = useCallback(
		async (data: ICreateCatalogItemRequest): Promise<ICatalogItem> => {
			try {
				const created = await createProductUseCase.execute(data);

				showToast(
					configureSuccessToast(
						t("catalog_product_created_success", "Producto creado con éxito")
					)
				);

				return created;
			} catch (error) {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						"catalog_product_created_error",
						"try_again"
					)
				);
				throw error;
			}
		},
		[createProductUseCase, showToast, t]
	);

	const updateProduct = useCallback(
		async (data: IUpdateCatalogItemRequest): Promise<ICatalogItem> => {
			try {
				const updated = await updateProductUseCase.execute(data);

				showToast(
					configureSuccessToast(
						t(
							"catalog_product_updated_success",
							"Producto actualizado con éxito"
						)
					)
				);

				return updated;
			} catch (error) {
				// Extract error message from backend response
				const errorMessage =
					error instanceof Error ? error.message : "try_again";

				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Validation,
						t,
						"catalog_product_updated_error",
						errorMessage
					)
				);
				throw error;
			}
		},
		[updateProductUseCase, showToast, t]
	);

	const deleteProduct = useCallback(
		async (productId: string): Promise<void> => {
			try {
				await deleteProductUseCase.execute(productId);
				showToast(
					configureSuccessToast(
						t("catalog_product_deleted_success", "Producto eliminado con éxito")
					)
				);
			} catch (error) {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						"catalog_product_deleted_error",
						"try_again"
					)
				);
				throw error;
			}
		},
		[deleteProductUseCase, showToast, t]
	);

	const deleteProducts = useCallback(
		async (productIds: string[]): Promise<void> => {
			try {
				// If only one item, use individual delete
				if (productIds.length === 1) {
					await deleteProductUseCase.execute(productIds[0]);
				} else {
					// Use bulk delete endpoint for multiple items
					await deleteManyProductsUseCase.execute(productIds);
				}
				showToast(
					configureSuccessToast(
						t(
							"catalog_products_deleted_success",
							"Productos eliminados con éxito"
						)
					)
				);
			} catch (error) {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						"catalog_products_deleted_error",
						"try_again"
					)
				);
				throw error;
			}
		},
		[deleteProductUseCase, deleteManyProductsUseCase, showToast, t]
	);

	return {
		createProduct,
		updateProduct,
		deleteProduct,
		deleteProducts,
	};
};
