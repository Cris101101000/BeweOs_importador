import { Alert, Tab, Tabs } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EnumCatalogType } from "../../domain/enums/catalog-type.enum";
import { BulkDeleteModal } from "../components/bulk-delete-modal";
import CatalogHeader from "../components/catalog-header/catalog-header.component";
import CatalogTable from "../components/catalog-table/catalog-table.component";
import { CreateProductModal } from "../components/create-product-modal";
import { CreateServiceModal } from "../components/create-service-modal";
import { ProductFilterModal } from "../components/product-filter-modal";
import { ServiceFilterModal } from "../components/service-filter-modal";
import { useCatalog } from "../hooks/use-catalog.hook";
import { useExportCatalogItems } from "../hooks/use-export-catalog-items.hook";

const ProductsServicesPage: FC = () => {
	const { t } = useTranslate();
	const navigate = useNavigate();
	const location = useLocation();

	// State for tabs and modals
	const [selectedTab, setSelectedTab] = useState<CatalogType>(
		EnumCatalogType.Product
	);
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
	const [currentCategoryFilter, setCurrentCategoryFilter] = useState<
		string | null
	>(null);
	const [currentMinPrice, setCurrentMinPrice] = useState<number | null>(null);
	const [currentMaxPrice, setCurrentMaxPrice] = useState<number | null>(null);
	const [currentStatusFilter, setCurrentStatusFilter] = useState<string | null>(
		null
	);
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [showLinda, setShowLinda] = useState(true);

	// Initialize selected tab from URL parameter
	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const typeParam = searchParams.get("type");
		if (typeParam === "service") {
			setSelectedTab(EnumCatalogType.Service);
		} else {
			setSelectedTab(EnumCatalogType.Product);
		}
	}, [location.search]);

	// Update URL when tab changes
	const handleTabChange = useCallback(
		(key: string | number) => {
			const newType = key as CatalogType;
			setSelectedTab(newType);

			// Update URL parameter without navigation
			const searchParams = new URLSearchParams(location.search);
			searchParams.set("type", newType);
			navigate(`${location.pathname}?${searchParams.toString()}`, {
				replace: true,
			});

			// Reset filters when changing tabs
			setCurrentCategoryFilter(null);
			setCurrentMinPrice(null);
			setCurrentMaxPrice(null);
			setCurrentStatusFilter(null);
			setSelectedItems([]);
		},
		[location.pathname, location.search, navigate]
	);

	// Use catalog hook with current selected type
	const {
		items,
		pagination,
		title: baseTitle,
		totalItems,
		isLoading,
		error,
		isCreateModalOpen,
		handleSearch,
		handlePageChange,
		handleCreateNew,
		handleCreateItem,
		handleEdit,
		handleDelete,
		handleView,
		handleExportCSV,
		handleCloseModals,
		setError,
		loadCatalogItems,
		filters: catalogFilters,
		searchValue,
	} = useCatalog({
		type: selectedTab,
		initialFilters: {
			categoryId: currentCategoryFilter,
			priceMin: currentMinPrice,
			priceMax: currentMaxPrice,
			status: currentStatusFilter,
		},
	});

	// Export hook
	const { exportCatalogItems } = useExportCatalogItems();

	// Dynamic title based on selected tab
	const title = useMemo(() => {
		return t("catalog_products_services_title", "Productos y Servicios");
	}, [t]);

	// Linda's message - same as Products page
	const lindaMessage = `Los clientes me están preguntando mucho por <strong>corte de barba</strong> y <strong>shampoo</strong> 💬`;

	// Filter handlers
	const handleOpenFilterModal = useCallback(() => {
		setIsFilterModalOpen(true);
	}, []);

	const handleCloseFilterModal = useCallback(() => {
		setIsFilterModalOpen(false);
	}, []);

	const handleApplyFilter = useCallback(
		(filters: {
			categoryId?: string;
			priceMin?: number;
			priceMax?: number;
			status?: string;
		}) => {
			setCurrentCategoryFilter(filters.categoryId || null);
			setCurrentMinPrice(filters.priceMin || null);
			setCurrentMaxPrice(filters.priceMax || null);
			setCurrentStatusFilter(filters.status || null);
			setIsFilterModalOpen(false);
		},
		[]
	);

	const getActiveFiltersCount = useCallback(() => {
		let count = 0;
		if (currentCategoryFilter) count++;
		if (currentMinPrice !== null) count++;
		if (currentMaxPrice !== null) count++;
		if (currentStatusFilter) count++;
		return count;
	}, [
		currentCategoryFilter,
		currentMinPrice,
		currentMaxPrice,
		currentStatusFilter,
	]);

	const getActiveFilters = useCallback(() => {
		const filters: Array<{ label: string; value: string }> = [];

		if (currentCategoryFilter) {
			filters.push({
				label: t("filter_category", "Categoría"),
				value: currentCategoryFilter,
			});
		}

		if (currentMinPrice !== null) {
			filters.push({
				label: t("filter_min_price", "Precio mín."),
				value: `${currentMinPrice}€`,
			});
		}

		if (currentMaxPrice !== null) {
			filters.push({
				label: t("filter_max_price", "Precio máx."),
				value: `${currentMaxPrice}€`,
			});
		}

		if (currentStatusFilter) {
			filters.push({
				label: t("filter_status", "Estado"),
				value:
					currentStatusFilter === "active"
						? t("status_active", "Activo")
						: t("status_inactive", "Inactivo"),
			});
		}

		return filters;
	}, [
		currentCategoryFilter,
		currentMinPrice,
		currentMaxPrice,
		currentStatusFilter,
		t,
	]);

	const handleRemoveFilter = useCallback(
		(filterLabel: string) => {
			if (filterLabel === t("filter_category", "Categoría")) {
				setCurrentCategoryFilter(null);
			} else if (filterLabel === t("filter_min_price", "Precio mín.")) {
				setCurrentMinPrice(null);
			} else if (filterLabel === t("filter_max_price", "Precio máx.")) {
				setCurrentMaxPrice(null);
			} else if (filterLabel === t("filter_status", "Estado")) {
				setCurrentStatusFilter(null);
			}
		},
		[t]
	);

	const handleClearAllFilters = useCallback(() => {
		setCurrentCategoryFilter(null);
		setCurrentMinPrice(null);
		setCurrentMaxPrice(null);
		setCurrentStatusFilter(null);
	}, []);

	// Selection handlers
	const handleSelectionChange = useCallback((selectedIds: string[]) => {
		setSelectedItems(selectedIds);
	}, []);

	// Bulk operations
	const handleBulkDelete = useCallback(() => {
		if (selectedItems.length > 0) {
			setIsBulkDeleteModalOpen(true);
		}
	}, [selectedItems]);

	const handleConfirmBulkDelete = useCallback(async () => {
		if (selectedItems.length === 0) return;

		try {
			setIsDeleting(true);
			// TODO: Implement bulk delete
			console.log("Deleting items:", selectedItems);

			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

			// Clear selection and close modal
			setSelectedItems([]);
			setIsBulkDeleteModalOpen(false);

			// Reload data
			await loadCatalogItems();
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: selectedTab === EnumCatalogType.Service
						? t("error_deleting_services", "Error eliminando servicios")
						: t("error_deleting_products", "Error eliminando productos")
			);
		} finally {
			setIsDeleting(false);
		}
	}, [selectedItems, selectedTab, t, setError, loadCatalogItems]);

	const handleBulkDuplicate = useCallback(async () => {
		if (selectedItems.length === 0) return;

		try {
			// TODO: Implement bulk duplicate
			console.log("Duplicating items:", selectedItems);

			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

			// Clear selection
			setSelectedItems([]);

			// Reload data
			await loadCatalogItems();
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: selectedTab === EnumCatalogType.Service
						? t("error_duplicating_services", "Error duplicando servicios")
						: t("error_duplicating_products", "Error duplicando productos")
			);
		}
	}, [selectedItems, selectedTab, t, setError, loadCatalogItems]);

	const handleBulkExportExcel = useCallback(
		async (selectedIds?: string[]) => {
			const idsToExport = selectedIds || selectedItems;
			if (idsToExport.length === 0) return;

			try {
				// Prepare filters with current search and filters
				const exportFilters: Record<string, any> = {
					...catalogFilters,
					...(searchValue && { search: searchValue }),
					...(selectedTab && { type: selectedTab }),
				};

				// Determine filename prefix based on type
				const filenamePrefix =
					selectedTab === EnumCatalogType.Service ? "servicios" : "productos";
				await exportCatalogItems(exportFilters, {
					type: selectedTab,
					filenamePrefix: `${filenamePrefix}_seleccionados`,
				});
				// Clear selection after export
				setSelectedItems([]);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: selectedTab === EnumCatalogType.Service
							? t("error_exporting_services", "Error exportando servicios")
							: t("error_exporting_products", "Error exportando productos")
				);
			}
		},
		[
			selectedItems,
			selectedTab,
			t,
			setError,
			exportCatalogItems,
			catalogFilters,
			searchValue,
		]
	);

	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Header */}
			<CatalogHeader
				title={title}
				totalItems={totalItems}
				isLoading={isLoading}
				onSearchChange={handleSearch}
				onCreateNew={handleCreateNew}
				onExportCSV={handleExportCSV}
				onFiltersToggle={handleOpenFilterModal}
				activeFiltersCount={getActiveFiltersCount()}
				activeFilters={getActiveFilters()}
				onRemoveFilter={handleRemoveFilter}
				onClearAllFilters={handleClearAllFilters}
			/>

			{/* Tabs for Product/Service Selection */}
			<div className="w-full">
				<Tabs
					selectedKey={selectedTab}
					onSelectionChange={handleTabChange}
					aria-label={t(
						"catalog_tabs_aria",
						"Selector de productos y servicios"
					)}
					color="primary"
					variant="underlined"
					className="w-full"
				>
					<Tab
						key={EnumCatalogType.Product}
						title={
							<div className="flex items-center gap-2">
								<span className="text-lg">🛍️</span>
								{t("catalog_products_tab", "Productos")}
							</div>
						}
					></Tab>
					<Tab
						key={EnumCatalogType.Service}
						title={
							<div className="flex items-center gap-2">
								<span className="text-lg">💼</span>
								{t("catalog_services_tab", "Servicios")}
							</div>
						}
					></Tab>
				</Tabs>
			</div>

			{/* Error Alert */}
			{error && (
				<Alert
					color="danger"
					title={t("error_title", "Error")}
					description={error}
					isClosable
					onClose={() => setError(null)}
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
				onDelete={handleDelete}
				onView={handleView}
				selectedItems={selectedItems}
				onSelectionChange={handleSelectionChange}
				onBulkDelete={handleBulkDelete}
				onBulkDuplicate={handleBulkDuplicate}
				onBulkExportExcel={handleBulkExportExcel}
				showDurationColumn={selectedTab === EnumCatalogType.Service}
			/>

			{/* Create Modals - Dynamic based on selected tab */}
			{selectedTab === EnumCatalogType.Product ? (
				<CreateProductModal
					isOpen={isCreateModalOpen}
					onClose={handleCloseModals}
					onSave={handleCreateItem}
					isLoading={isLoading}
				/>
			) : (
				<CreateServiceModal
					isOpen={isCreateModalOpen}
					onClose={handleCloseModals}
					onSave={handleCreateItem}
					isLoading={isLoading}
				/>
			)}

			{/* Filter Modals - Dynamic based on selected tab */}
			{selectedTab === EnumCatalogType.Product ? (
				<ProductFilterModal
					isOpen={isFilterModalOpen}
					onClose={handleCloseFilterModal}
					onApplyFilter={handleApplyFilter}
					currentCategoryId={currentCategoryFilter}
					currentMinPrice={currentMinPrice}
					currentMaxPrice={currentMaxPrice}
					currentStatus={currentStatusFilter}
				/>
			) : (
				<ServiceFilterModal
					isOpen={isFilterModalOpen}
					onClose={handleCloseFilterModal}
					onApplyFilter={handleApplyFilter}
					currentCategoryId={currentCategoryFilter}
					currentMinPrice={currentMinPrice}
					currentMaxPrice={currentMaxPrice}
					currentStatus={currentStatusFilter}
				/>
			)}

			{/* Bulk Delete Modal */}
			<BulkDeleteModal
				isOpen={isBulkDeleteModalOpen}
				onClose={() => setIsBulkDeleteModalOpen(false)}
				onConfirm={handleConfirmBulkDelete}
				selectedItems={items.filter((item) => selectedItems.includes(item.id))}
				isDeleting={isDeleting}
				type={selectedTab}
			/>
		</div>
	);
};

export default ProductsServicesPage;
