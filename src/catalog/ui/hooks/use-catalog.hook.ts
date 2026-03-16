import { useTranslate } from "@tolgee/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EnumCatalogType } from "../../domain/enums/catalog-type.enum";
import type { ICatalogFilters } from "../../domain/interfaces/catalog-filter.interface";
import type {
	ICatalogItem,
	ICreateCatalogItemRequest,
	IUpdateCatalogItemRequest,
} from "../../domain/interfaces/catalog.interface";
import { useCatalogItemsByFilter } from "./use-catalog-items-by-filter.hook";
import { useExportCatalogItems } from "./use-export-catalog-items.hook";
import { useNavigateToCatalogDetail } from "./use-navigate-to-catalog-detail.hook";
import { useProductActions } from "./use-product-actions.hook";
import { useServiceActions } from "./use-service-actions.hook";

interface UseCatalogProps {
	type?: EnumCatalogType;
	initialFilters?: ICatalogFilters;
}

export const useCatalog = ({ type, initialFilters }: UseCatalogProps = {}) => {
	const { t } = useTranslate();
	const { navigateToCatalogDetail } = useNavigateToCatalogDetail();
	const [filters, setFilters] = useState<ICatalogFilters>(initialFilters || {});
	const [searchValue, setSearchValue] = useState<string>("");
	const [selectedItem, setSelectedItem] = useState<ICatalogItem | null>(null);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	// Use the new pagination hook
	const {
		result: catalogData,
		isLoading,
		error: catalogError,
		refetch: loadCatalogItems,
		setFilters: updateFilters,
		getPage,
	} = useCatalogItemsByFilter(filters);

	// Use appropriate actions hook based on type for CRUD operations with toast notifications
	const { createProduct, updateProduct, deleteProduct } = useProductActions();
	const { createService, updateService, deleteService } = useServiceActions();
	const { exportCatalogItems } = useExportCatalogItems();

	// Combine filters with search value and update the pagination hook
	const combinedFilters = useMemo(
		() => ({
			...filters,
			...(searchValue && { search: searchValue }),
		}),
		[filters, searchValue]
	);

	// Update filters when combined filters change
	useEffect(() => {
		updateFilters(combinedFilters);
	}, [combinedFilters, updateFilters]);

	// Crear elemento
	const handleCreateItem = useCallback(
		async (itemData: ICreateCatalogItemRequest) => {
			try {
				// Use appropriate action based on type
				if (type === EnumCatalogType.Service) {
					await createService(itemData);
				} else {
					await createProduct(itemData);
				}
				setIsCreateModalOpen(false);
				await loadCatalogItems();
			} catch (err) {
				throw err;
			}
		},
		[createProduct, createService, loadCatalogItems, type]
	);

	// Actualizar elemento
	const handleUpdateItem = useCallback(
		async (itemData: IUpdateCatalogItemRequest) => {
			try {
				// Use appropriate action based on type
				if (type === EnumCatalogType.Service) {
					await updateService(itemData);
				} else {
					await updateProduct(itemData);
				}
				setIsEditModalOpen(false);
				setSelectedItem(null);
				await loadCatalogItems();
			} catch (err) {
				throw err;
			}
		},
		[updateProduct, updateService, loadCatalogItems, type]
	);

	// Eliminar elemento
	const handleDeleteItem = useCallback(
		async (itemId: string) => {
			try {
				// Use appropriate action based on type
				if (type === EnumCatalogType.Service) {
					await deleteService(itemId);
				} else {
					await deleteProduct(itemId);
				}
				setIsDeleteModalOpen(false);
				setSelectedItem(null);
				await loadCatalogItems();
			} catch (err) {
				throw err;
			}
		},
		[deleteProduct, deleteService, loadCatalogItems, type]
	);

	// Handlers de UI
	const handleSearch = useCallback((search: string) => {
		// Search se maneja por separado, no se incluye en filters del drawer
		setSearchValue(search);
	}, []);

	const handleFilterChange = useCallback(
		(newFilters: Partial<ICatalogFilters> | Record<string, any>) => {
			console.log("newFilters", newFilters);
			// Send filters exactly as they come from DrawerFilters (excludes search)
			const { search, ...drawerFilters } = newFilters as ICatalogFilters;
			setFilters(drawerFilters);
		},
		[]
	);

	const handlePageChange = useCallback(
		(page: number) => {
			getPage(page, 10); // Always use page size of 10
		},
		[getPage]
	);

	const handleCreateNew = useCallback(() => {
		setIsCreateModalOpen(true);
	}, []);

	const handleEdit = useCallback((item: ICatalogItem) => {
		setSelectedItem(item);
		setIsEditModalOpen(true);
	}, []);

	const handleDelete = useCallback((item: ICatalogItem) => {
		setSelectedItem(item);
		setIsDeleteModalOpen(true);
	}, []);

	const handleView = useCallback(
		(item: ICatalogItem) => {
			navigateToCatalogDetail(item.id, type!, item);
		},
		[navigateToCatalogDetail, type]
	);

	const handleExportCSV = useCallback(async () => {
		try {
			const exportFilters: ICatalogFilters | Record<string, any> = {
				...filters,
				...(searchValue && { search: searchValue }),
				...(type && { type }),
			};

			const filenamePrefix =
				type === EnumCatalogType.Service ? "servicios" : "productos";

			await exportCatalogItems(exportFilters, {
				type,
				filenamePrefix,
			});
		} catch (error) {
			console.error(
				"🔴 handleExportCSV: Error exporting catalog items:",
				error
			);
		}
	}, [exportCatalogItems, filters, searchValue, type]);

	const handleCloseModals = useCallback(() => {
		setIsCreateModalOpen(false);
		setIsEditModalOpen(false);
		setIsDeleteModalOpen(false);
		setSelectedItem(null);
	}, []);

	// Effects are now handled by the useCatalogItemsByFilter hook

	// Actualizar filtros cuando cambien los initialFilters específicos
	useEffect(() => {
		if (initialFilters) {
			setFilters((prev) => ({
				...prev,
				...initialFilters,
				type, // Siempre incluir el type
			}));
		} else {
			// Si no hay initialFilters, solo setear el type
			setFilters((prev) => ({
				...prev,
				type,
			}));
		}
	}, [type, initialFilters]);

	// Valores computados
	const items = catalogData?.items || [];
	const pagination = catalogData?.pagination || {
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 1,
	};
	const error = catalogError?.message || null;

	const title = useMemo(() => {
		if (type === EnumCatalogType.Service) {
			return t("catalog_services_title", "Servicios");
		}
		if (type === EnumCatalogType.Product) {
			return t("catalog_products_title", "Productos");
		}
		return t("catalog_title", "Catálogo");
	}, [type, t]);

	const totalItems = catalogData?.pagination?.total || 0;

	return {
		// Data
		items,
		pagination,
		title,
		totalItems,
		filters,
		searchValue,
		selectedItem,

		// State
		isLoading,
		error,
		isCreateModalOpen,
		isEditModalOpen,
		isDeleteModalOpen,

		// Actions
		handleCreateItem,
		handleUpdateItem,
		handleDeleteItem,
		handleSearch,
		handleFilterChange,
		handlePageChange,
		handleCreateNew,
		handleEdit,
		handleDelete,
		handleView,
		handleExportCSV,
		handleCloseModals,

		// Utilities
		loadCatalogItems,

		// Modal state setters (for programmatic control)
		setIsCreateModalOpen,
	};
};
