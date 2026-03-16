import {
	Button,
	Chip,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Pagination,
	type Selection,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tooltip,
	P,
	IconComponent,
} from "@beweco/aurora-ui";
import type { SortDescriptor } from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type { FC, Key } from "react";
import { useCallback, useEffect, useMemo, useState, type Key as ReactKey } from "react";
import { EnumCatalogStatus } from "../../../domain/enums/catalog-status.enum";
import type { ICatalogItem } from "../../../domain/interfaces/catalog.interface";
import { ViewSkeleton } from "@shared/ui/components/view-skeleton";

interface CatalogTableProps {
	items: ICatalogItem[];
	isLoading?: boolean;
	totalPages?: number;
	currentPage?: number;
	onPageChange?: (page: number) => void;
	onEdit?: (item: ICatalogItem) => void;
	onDelete?: (item: ICatalogItem) => void;
	onView?: (item: ICatalogItem) => void;
	selectedItems?: string[];
	onSelectionChange?: (selectedIds: string[]) => void;
	onBulkDelete?: (selectedIds: string[]) => void;
	onBulkDuplicate?: (selectedIds: string[]) => void;
	onBulkExportExcel?: (selectedIds: string[]) => void;
	showDurationColumn?: boolean; // Show duration column for services
}

const CatalogTable: FC<CatalogTableProps> = ({
	items,
	isLoading = false,
	totalPages: TotalPages = 1,
	currentPage = 1,
	onPageChange,
	onEdit,
	onDelete,
	onView,
	selectedItems = [],
	onSelectionChange,
	onBulkDelete,
	onBulkDuplicate,
	onBulkExportExcel,
	showDurationColumn = false,
}) => {
	const { t } = useTranslate();
	const [filterValue] = useState("");
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "name",
		direction: "ascending",
	});
	const [selectedKeys, setSelectedKeys] = useState<Selection>(
		new Set<string>(selectedItems)
	);

	// Sync selectedKeys with selectedItems prop
	useEffect(() => {
		setSelectedKeys(new Set<string>(selectedItems));
	}, [selectedItems]);

	const columns = useMemo(() => {
		const baseColumns = [
			{ key: "name", label: t("catalog_table_name", "Nombre"), sortable: true },
			// TODO: Uncomment this when the interest count is implemented
			// {
			// 	key: "interestCount",
			// 	label: t("catalog_table_interest", "Interés"),
			// 	sortable: true,
			// },
			{
				key: "category",
				label: t("catalog_table_category", "Categoría"),
				sortable: true,
			},
			{
				key: "price",
				label: t("catalog_table_price", "Precio"),
				sortable: true,
			},
		];

		// Add duration column for services
		if (showDurationColumn) {
			baseColumns.push({
				key: "duration",
				label: t("catalog_table_duration", "Duración"),
				sortable: true,
			});
		}

		baseColumns.push(
			{
				key: "status",
				label: t("catalog_table_status", "Estado"),
				sortable: true,
			}
		);

		return baseColumns;
	}, [t, showDurationColumn]);

	const filteredItems = useMemo(() => {
		let filtered = [...items];

		if (filterValue) {
			filtered = filtered.filter(
				(item) =>
					item.name.toLowerCase().includes(filterValue.toLowerCase()) ||
					item.category?.name.toLowerCase().includes(filterValue.toLowerCase())
			);
		}

		return filtered;
	}, [items, filterValue]);

	const sortedItems = useMemo(() => {
		return [...filteredItems].sort((a, b) => {
			const columnKey = sortDescriptor.column as keyof ICatalogItem;
			let first: string | number;
			let second: string | number;

			// Handle different column types
			switch (columnKey) {
				case "price":
					// Ensure numeric comparison for prices
					first = Number(a.price) || 0;
					second = Number(b.price) || 0;
					break;
				case "name":
					// Case-insensitive string comparison
					first = a.name.toLowerCase();
					second = b.name.toLowerCase();
					break;
				case "interestCount":
					// Numeric comparison for interest count
					first = Number(a.interestCount) || 0;
					second = Number(b.interestCount) || 0;
					break;
				case "duration":
					// Numeric comparison for duration
					first = Number(a.duration) || 0;
					second = Number(b.duration) || 0;
					break;
				case "category":
					// Handle category name comparison
					first = a.category?.name?.toLowerCase() || "";
					second = b.category?.name?.toLowerCase() || "";
					break;
				case "status":
					// Handle status comparison
					first = a.status;
					second = b.status;
					break;
				default:
					// Default comparison for other fields
					first = a[columnKey] as string | number;
					second = b[columnKey] as string | number;
					break;
			}

			const cmp = first < second ? -1 : first > second ? 1 : 0;
			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [filteredItems, sortDescriptor]);

	// Items are already paginated from server, so use sortedItems directly
	// No need for local pagination since server handles pagination
	const paginatedItems = sortedItems;

	// Handle selection changes
	const handleSelectionChange = useCallback(
		(keys: Selection) => {
			let resultKeys: Set<string | number>;

			if (keys === "all") {
				// Select all items on current page
				resultKeys = new Set<string | number>(
					paginatedItems.map((item) => String(item.id))
				);
			} else if (keys.size === 0) {
				resultKeys = new Set<string | number>();
			} else {
				// Handle individual selections
				const selectedValue: Set<string | number> =
					selectedKeys === "all"
						? new Set<string | number>(
								sortedItems.map((item) => String(item.id))
							)
						: (selectedKeys as Set<string | number>);

				resultKeys = new Set<string | number>();

				// Add new selections
				for (const key of keys) {
					resultKeys.add(key as string | number);
				}

				// Keep selections from other pages
				for (const key of selectedValue) {
					if (!paginatedItems.some((item) => String(item.id) === key)) {
						resultKeys.add(key);
					}
				}
			}

			setSelectedKeys(resultKeys);

			if (onSelectionChange) {
				const selectedIds = Array.from(resultKeys).map((key) => String(key));
				onSelectionChange(selectedIds);
			}
		},
		[paginatedItems, selectedKeys, sortedItems, onSelectionChange]
	);

	const selectedIds = useMemo(() => {
		if (selectedKeys === "all") {
			return items.map((item) => item.id);
		}
		if (selectedKeys.size > 0) {
			return Array.from(selectedKeys).map((key) => String(key));
		}
		return [];
	}, [selectedKeys, items]);

	// Handle bulk delete
	const handleBulkDelete = useCallback(() => {
		if (onBulkDelete && selectedIds.length > 0) {
			onBulkDelete(selectedIds);
		}
	}, [onBulkDelete, selectedIds]);

	// Handle bulk duplicate
	const handleBulkDuplicate = useCallback(() => {
		if (onBulkDuplicate && selectedIds.length > 0) {
			onBulkDuplicate(selectedIds);
		}
	}, [onBulkDuplicate, selectedIds]);

	// Handle bulk export to Excel
	const handleBulkExportExcel = useCallback(() => {
		if (onBulkExportExcel && selectedIds.length > 0) {
			onBulkExportExcel(selectedIds);
		}
	}, [onBulkExportExcel, selectedIds]);

	// Get selected count for display (currently unused but kept for future use)
	// const selectedCount = useMemo(() => {
	// 	if (selectedKeys === "all") return items.length;
	// 	return selectedKeys.size;
	// }, [selectedKeys, items.length]);

	const formatPrice = useCallback((price: number, currency: string) => {
		if (currency === "COP") {
			return `$${price.toLocaleString()}`;
		}
		return `${price} ${currency}`;
	}, []);

	const getStatusColor = useCallback((status: EnumCatalogStatus) => {
		switch (status) {
			case EnumCatalogStatus.Active:
				return "success";
			case EnumCatalogStatus.Inactive:
				return "danger";
			default:
				return "default";
		}
	}, []);

	const getStatusText = useCallback(
		(status: EnumCatalogStatus) => {
			switch (status) {
				case EnumCatalogStatus.Active:
					return t("catalog_status_active", "Activo");
				case EnumCatalogStatus.Inactive:
					return t("catalog_status_inactive", "Inactivo");
				default:
					return status;
			}
		},
		[t]
	);

	const getCategoryName = useCallback(
		(categoryId?: string, categoryName?: string) => {
			if (!categoryId) {
				return t("catalog_no_category", "Sin categoría");
			}
			return t(`category_${categoryId}`, categoryName);
		},
		[t]
	);

	const renderCell = useCallback(
		(item: ICatalogItem, columnKey: string | number) => {
			switch (columnKey) {
				case "name":
					const maxDescriptionLength = 60;
					const isDescriptionLong =
						item.description && item.description.length > maxDescriptionLength;
					const truncatedDescription = isDescriptionLong
						? `${item.description!.substring(0, maxDescriptionLength)}…`
						: item.description;

					return (
						<div className="flex flex-col">
							<P className="font-medium text-default-900">{item.name}</P>
							{item.description && (
								<Tooltip
									content={item.description}
									isDisabled={!isDescriptionLong}
									placement="top"
									showArrow
									delay={500}
									closeDelay={0}
									classNames={{
										content:
											"py-2 px-3 shadow-lg max-w-sm text-sm bg-content1 text-foreground border border-default-200 rounded-medium",
									}}
								>
									<P
										className={`text-sm text-default-500 ${isDescriptionLong ? "cursor-help" : "cursor-default"}`}
									>
										{truncatedDescription}
									</P>
								</Tooltip>
							)}
						</div>
					);
				case "interestCount":
					return (
						<span className="text-sm font-medium text-default-900">
							{item.interestCount || 0}
						</span>
					);
				case "category":
					return (
						<span className="text-sm text-default-700">
							{getCategoryName(item.category?.id || item.categoryId, item.category?.name)}
						</span>
					);
				case "price":
					return (
						<span className="font-semibold text-default-900">
							{formatPrice(item.price, item.currency)}
						</span>
					);
				case "duration":
					return (
						<span className="text-sm text-default-700">
							{String(item.metadata?.formattedDuration || "-")}
						</span>
					);
				case "status":
					return (
						<Chip size="sm" variant="flat" color={getStatusColor(item.status)}>
							{getStatusText(item.status)}
						</Chip>
					);
				default:
					return null;
			}
		},
		[onView, onEdit, onDelete, formatPrice, getStatusColor, getStatusText, getCategoryName, t]
	);

	const handleOnAction = useCallback((key: Key) => {
		const actions = {
			"delete": handleBulkDelete,
			"duplicate": handleBulkDuplicate,
			"export-excel": handleBulkExportExcel,
		}

		const action = actions[key as keyof typeof actions];

		action?.();

	}, [handleBulkDelete, handleBulkDuplicate, handleBulkExportExcel]);

	// Row action handler - view item details
	const handleRowAction = useCallback((key: ReactKey) => {
		const item = items.find(i => String(i.id) === String(key));
		if (item && onView) {
			onView(item);
		}
	}, [items, onView]);

	const topContent = useMemo(() => {
		return (
			<div className="flex items-center gap-4 overflow-auto px-[6px] py-[4px] justify-between">
				{/* Left section: Selection info and actions */}
				<div className="flex items-center gap-3">
					{(selectedKeys === "all" || selectedKeys.size > 0) && (
						<>
							<div className="text-default-800 text-sm whitespace-nowrap">
								{selectedKeys === "all"
									? t("catalog_all_selected", "Todos seleccionados")
									: t("catalog_selected_count", "{count} seleccionados", {
											count: selectedKeys.size || 0,
										})}
							</div>
							<Dropdown>
								<DropdownTrigger>
									<Button
										className="bg-default-100 text-default-800"
										endContent={
											<IconComponent
												icon="solar:alt-arrow-down-outline"
												size="sm"
											/>
										}
										size="sm"
										variant="flat">
										{t("catalog_selected_actions", "Acciones")}
									</Button>
								</DropdownTrigger>
								<DropdownMenu
									aria-label="Acciones seleccionadas"
									onAction={handleOnAction}
								>
									<DropdownItem key="export-excel">
										{t("catalog_action_export_excel", "Descargar Excel")}
									</DropdownItem>
									{/* <DropdownItem key="duplicate">
										{t("catalog_action_duplicate", "Duplicar")}
									</DropdownItem> */}
									<DropdownItem key="delete" className="text-danger">
										{t("catalog_action_delete", "Eliminar")}
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</>
					)}
				</div>

				{/* Right section: Empty for now */}
				<div className="flex items-center gap-4">
					{/* Could add additional controls here if needed */}
				</div>
			</div>
		);
	}, [
		selectedKeys,
		handleBulkDelete,
		handleBulkDuplicate,
		handleBulkExportExcel,
		t,
	]);

	const bottomContent = useMemo(() => {
		// Use totalPages from server-side pagination, not local calculation
		return (
			<div className="flex flex-col items-center justify-center gap-2 px-2 py-2 sm:flex-row">
				<Pagination
					isCompact
					showControls
					showShadow
					color="primary"
					page={currentPage}
					total={TotalPages}
					onChange={onPageChange}
				/>
			</div>
		);
	}, [currentPage, TotalPages, onPageChange]);

	// Show complete skeleton when loading
	if (isLoading) {
		return <ViewSkeleton variant="table" />;
	}

	return (
		<Table
			aria-label={t("catalog_table_aria_label", "Tabla de catálogo")}
			isHeaderSticky
			bottomContent={bottomContent}
			bottomContentPlacement="outside"
			classNames={{
				td: "before:bg-transparent",
				wrapper: "border-none shadow-none p-1",
			}}
			selectedKeys={selectedKeys}
			selectionMode="multiple"
			sortDescriptor={sortDescriptor}
			topContent={topContent}
			topContentPlacement="outside"
			onSelectionChange={handleSelectionChange}
			onSortChange={setSortDescriptor}
			onRowAction={handleRowAction}
		>
			<TableHeader columns={columns}>
				{(column: any) => (
					<TableColumn
						key={column.key}
						align="start"
						allowsSorting={column.sortable}
					>
						{column.label}
					</TableColumn>
				)}
			</TableHeader>
			<TableBody
				emptyContent={t("catalog_empty_state", "No se encontraron elementos")}
				items={paginatedItems}
			>
				{(item: any) => (
					<TableRow key={item.id} className="cursor-pointer">
						{columns.map((column: any) => (
							<TableCell key={column.key}>
								{renderCell(item, column.key)}
							</TableCell>
						))}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

export default CatalogTable;
