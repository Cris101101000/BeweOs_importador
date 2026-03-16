import {
	Button,
	DrawerFilters,
	type DrawerFiltersProps,
	IconComponent,
	Input,
} from "@beweco/aurora-ui";
import { PageHeader } from "@shared/ui/components/page-header";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { EnumCatalogType } from "../../../domain/enums/catalog-type.enum";
import type { ICatalogFilters } from "../../../domain/interfaces/catalog-filter.interface";
import {
	countActiveFiltersFlexible,
	mapDrawerFiltersToApiFormat,
} from "../../../infrastructure/mappers/catalog-filter.mapper";

interface CatalogHeaderProps {
	title: string;
	totalItems?: number;
	isLoading?: boolean;
	// Search props (separate from drawer filters)
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	onCreateNew?: () => void;
	// DrawerFilters integration props (excludes search)
	onApplyFilters?: (filters: any) => void;
	onClearFilters?: () => void;
	currentFilters?: ICatalogFilters | Record<string, any>;
	filtersConfig?: DrawerFiltersProps["config"];
	filtersLoading?: boolean;
	catalogType?: EnumCatalogType;
}

const CatalogHeader: FC<CatalogHeaderProps> = ({
	title,
	totalItems = 0,
	isLoading = false,
	searchValue = "",
	onSearchChange,
	onCreateNew,
	onApplyFilters,
	onClearFilters,
	currentFilters,
	filtersConfig,
	filtersLoading = false,
}) => {
	const { t } = useTranslate();

	const [isOpen, setIsOpen] = useState(false);

	// State for search functionality
	const [localSearchValue, setLocalSearchValue] = useState<string>(searchValue);

	// Ref para manejar debouncing de search
	const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	// Calculate active filters count (excludes search)
	// currentFilters can be either internal format or API format, so we need to handle both
	const activeFiltersCount = currentFilters
		? countActiveFiltersFlexible(currentFilters)
		: 0;

	// Función debounced para search
	const debouncedSearch = useCallback(
		(searchTerm: string) => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}

			searchTimeoutRef.current = setTimeout(() => {
				onSearchChange?.(searchTerm.trim() || "");
			}, 600);
		},
		[onSearchChange]
	);

	// Cleanup del timeout en unmount
	useEffect(() => {
		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, []);

	// Sincroniza el valor local con el valor externo (resetea al limpiar search)
	useEffect(() => {
		setLocalSearchValue(searchValue);
	}, [searchValue]);

	//Handles search input change with debouncing
	const handleSearchChange = useCallback(
		(value: string) => {
			setLocalSearchValue(value);
			debouncedSearch(value);
		},
		[debouncedSearch]
	);

	// Handle apply filters from DrawerFilters
	const handleApplyFilters = (drawerFilters: Record<string, any>) => {
		// Map directly to API format using filtersConfig
		const apiFilters = mapDrawerFiltersToApiFormat(drawerFilters);

		onApplyFilters?.(apiFilters);
	};

	// Handle clear filters from DrawerFilters
	const handleClearFilters = () => {
		onClearFilters?.();
		setIsOpen(false);
	};

	// Handle cancel from DrawerFilters
	const handleCancel = () => {
		setIsOpen(false);
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Title and Counter */}
			<PageHeader
				title={title}
				metadata={[
					{
						key: "total",
						label: isLoading ? "..." : String(totalItems),
						color: "default",
						variant: "flat",
					},
				]}
				actions={
					onCreateNew && (
						<Button
							variant="solid"
							color="primary"
							onPress={onCreateNew}
							size="sm"
							className="w-full sm:w-auto"
							aria-label={t("button_create_text_aria", "Crear nuevo")}
							endContent={<IconComponent icon="gridicons:create" size="sm" />}
						>
							{t("button_create_text", "Crear nuevo")}
						</Button>
					)
				}
			/>

			{/* DrawerFilters Integration */}
			{filtersConfig && (
				<DrawerFilters
					config={filtersConfig as DrawerFiltersProps["config"]}
					onApplyFilters={handleApplyFilters}
					onClearFilters={handleClearFilters}
					onCancel={handleCancel}
					isOpen={isOpen}
					onOpenChange={setIsOpen}
				/>
			)}

			{/* Controls */}
			<div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
				{/* Left Controls */}
				<div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
					{/* Search */}
					<Input
						className="w-full sm:flex-1 sm:max-w-xs sm:min-w-52"
						endContent={
							<IconComponent
								icon="solar:magnifer-outline"
								className="text-default-400"
								size="sm"
							/>
						}
						placeholder={t("catalog_search_placeholder", "Buscar...")}
						// size="sm"
						value={localSearchValue}
						onValueChange={handleSearchChange}
					/>
				</div>

				{/* Right Controls */}
				<div className="flex flex-col sm:flex-row flex-wrap gap-2 items-stretch sm:items-center w-full sm:w-auto">
					{/* Filters */}
					<Button
						variant="bordered"
						color="primary"
						size="sm"
						className="w-full sm:w-auto"
						aria-label={t("catalog_filters", "Filtros")}
						onPress={() => setIsOpen(true)}
						isDisabled={filtersLoading || !filtersConfig}
						startContent={
							activeFiltersCount > 0 && (
								<span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
									{activeFiltersCount}
								</span>
							)
						}
						endContent={
							<IconComponent
								icon="solar:tuning-2-outline"
								className="text-primary"
								size="sm"
							/>
						}
					>
						{t("catalog_filters", "Filtros")}
					</Button>

				</div>
			</div>
		</div>
	);
};

export default CatalogHeader;
