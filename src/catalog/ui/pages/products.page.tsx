import { Alert } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EnumCatalogType } from "../../domain/enums/catalog-type.enum";
import type {
	IKnowledgeGapNavigationState,
	IProductInitialData,
} from "../../domain/interfaces/catalog-initial-data.interface";
import { mapKnowledgeGapToProduct } from "../../infrastructure/mappers/knowledge-gap-to-catalog.mapper";
import { BulkDeleteModal } from "../components/bulk-delete-modal";
import CatalogHeader from "../components/catalog-header/catalog-header.component";
import CatalogTable from "../components/catalog-table/catalog-table.component";
import { CreateProductModal } from "../components/create-product-modal";
import { useCatalogFiltersConfig } from "../hooks/use-catalog-filters-config.hook";
import { useCatalogFiltersData } from "../hooks/use-catalog-filters-data.hook";
import { useCatalog } from "../hooks/use-catalog.hook";
import { useExportCatalogItems } from "../hooks/use-export-catalog-items.hook";
import { useProductActions } from "../hooks/use-product-actions.hook";

const ProductsPage: FC = () => {
	const { t } = useTranslate();
	const location = useLocation();
	const navigate = useNavigate();
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	// State for pre-filled product data from knowledge gaps
	const [initialProductData, setInitialProductData] =
		useState<IProductInitialData | null>(null);

	const {
		items,
		pagination,
		title,
		totalItems,
		isLoading,
		error,
		isCreateModalOpen,
		searchValue,
		handleSearch,
		handlePageChange,
		handleCreateNew,
		handleCreateItem,
		handleEdit,
		handleDelete: HandleDeleteFromCatalog,
		handleView,
		handleCloseModals,
		loadCatalogItems,
		handleFilterChange,
		filters,
		setIsCreateModalOpen,
	} = useCatalog({
		type: EnumCatalogType.Product,
	});

	// Handle navigation state from knowledge gaps to auto-open modal with pre-filled data
	useEffect(() => {
		const state = location.state as IKnowledgeGapNavigationState | null;

		if (state?.knowledgeGap) {
			const productData = mapKnowledgeGapToProduct(state.knowledgeGap);
			setInitialProductData(productData);
			setIsCreateModalOpen(true);
			navigate(location.pathname, { replace: true, state: null });
		}
	}, [location.state, navigate, location.pathname, setIsCreateModalOpen]);

	// Use the new product actions hook for CRUD operations with toasts
	const { deleteProducts } = useProductActions();

	// Export hook for CSV download
	const { exportCatalogItems } = useExportCatalogItems();

	// Load filters data from API
	const {
		categories,
		brands,
		isLoading: filtersDataLoading,
	} = useCatalogFiltersData({
		type: EnumCatalogType.Product,
	});

	// Generate filters configuration
	const { filtersConfig } = useCatalogFiltersConfig({
		type: EnumCatalogType.Product,
		categories,
		brands,
	});

	// Handle filters from DrawerFilters - send directly as API format
	const handleApplyFilters = (apiFilters: any) => {
		console.log("Products page received API filters:", apiFilters);
		handleFilterChange(apiFilters);
	};

	// Handle clear filters from DrawerFilters - reset to empty object
	const handleClearFilters = () => {
		console.log("Clearing all filters in products page");
		handleFilterChange({});
		handleSearch("");
	};

	const handleSelectionChange = (selectedIds: string[]) => {
		setSelectedItems(selectedIds);
	};

	const handleBulkDelete = (selectedIds: string[]) => {
		if (selectedIds.length > 0) {
			setIsBulkDeleteModalOpen(true);
		}
	};

	const handleConfirmBulkDelete = async () => {
		try {
			setIsDeleting(true);

			// The deleteProducts hook handles single vs multiple items internally
			await deleteProducts(selectedItems);

			// Clear selection and close modal
			setSelectedItems([]);
			setIsBulkDeleteModalOpen(false);
			// Reload the catalog items after successful deletion
			await loadCatalogItems();
		} catch (error) {
			// Error is handled by the toast in the deleteProducts hook
			console.error("Error deleting products:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleCloseBulkDeleteModal = () => {
		setIsBulkDeleteModalOpen(false);
	};

	const handleBulkDuplicate = async (selectedIds: string[]) => {
		if (selectedIds.length === 0) return;

		try {
			setIsDeleting(true); // Reutilizamos el estado de loading

			// Obtener los items seleccionados
			const itemsToDuplicate = items.filter((item) =>
				selectedIds.includes(item.id)
			);

			// Duplicar cada item
			for (const item of itemsToDuplicate) {
				const duplicatedItem = {
					name: `${item.name} copia`,
					description: item.description,
					price: item.price,
					categoryId: item.categoryId,
					status: item.status,
					metadata: item.metadata ? { ...item.metadata } : undefined,
					pdfUrl: item.pdfUrl,
					pdfName: item.pdfName,
					currency: item.currency,
					type: item.type,
				};

				await handleCreateItem(duplicatedItem);
			}

			// Limpiar selección
			setSelectedItems([]);
		} catch (error) {
			console.error("Error duplicando productos:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleBulkExportExcel = async (selectedIds: string[]) => {
		if (selectedIds.length === 0) return;

		try {
			await exportCatalogItems(
				{
					...filters,
				},
				{
					type: EnumCatalogType.Product,
					filenamePrefix: "productos",
				}
			);

			// Limpiar selección después de exportar
			setSelectedItems([]);
		} catch (error) {
			console.error("❌ ProductsPage: Error exporting products to CSV", error);
		}
	};

	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Header */}
			<CatalogHeader
				title={title}
				totalItems={totalItems}
				isLoading={isLoading}
				searchValue={searchValue}
				onSearchChange={handleSearch}
				onCreateNew={handleCreateNew}
				onApplyFilters={handleApplyFilters}
				onClearFilters={handleClearFilters}
				currentFilters={filters}
				filtersConfig={filtersConfig}
				filtersLoading={filtersDataLoading}
				catalogType={EnumCatalogType.Product}
			/>

			{/* Error Alert */}
			{error && (
				<Alert
					color="danger"
					title={t("error_title", "Error")}
					description={error}
					isClosable
				/>
			)}

			{/* Table */}
			<CatalogTable
				items={items}
				isLoading={isLoading}
				totalPages={pagination.totalPages}
				currentPage={pagination.page}
				onPageChange={handlePageChange}
				onEdit={handleEdit}
				onDelete={HandleDeleteFromCatalog}
				onView={handleView}
				selectedItems={selectedItems}
				onSelectionChange={handleSelectionChange}
				onBulkDelete={handleBulkDelete}
				onBulkDuplicate={handleBulkDuplicate}
				onBulkExportExcel={handleBulkExportExcel}
			/>

			{/* Create Product Modal */}
			<CreateProductModal
				isOpen={isCreateModalOpen}
				onClose={() => {
					handleCloseModals();
					setInitialProductData(null);
				}}
				onSave={async (data) => {
					await handleCreateItem(data);
					setInitialProductData(null);
				}}
				isLoading={isLoading}
				initialData={initialProductData}
			/>

			{/* Bulk Delete Modal */}
			<BulkDeleteModal
				isOpen={isBulkDeleteModalOpen}
				onClose={handleCloseBulkDeleteModal}
				onConfirm={handleConfirmBulkDelete}
				selectedItems={items.filter((item) => selectedItems.includes(item.id))}
				isDeleting={isDeleting}
				type={EnumCatalogType.Product}
			/>
		</div>
	);
};

export default ProductsPage;
