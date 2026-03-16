import {
	Button,
	Chip,
	Divider,
	DrawerFilters,
	type DrawerFiltersConfig,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	IconComponent,
	Image,
	Input,
	Pagination,
	type Selection,
	type SortDescriptor,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tooltip,
} from "@beweco/aurora-ui";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as CampaignManagementDI from '../DependencyInjection';
import { EnumCampaignContentType, EnumCampaignStatus } from "@campaigns/domain";
import { useTranslate } from "@tolgee/react";
import { useAuraToast } from "@beweco/aurora-ui";
import { configureErrorToastWithTranslation } from "@shared/utils/toast-config.utils";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";

// Content History data interface
interface ContentHistoryItem {
	id: string;
	title: string;
	type: "email" | "whatsapp";
	status: "Publicado" | "Programado" | "Borrador" | "Pendiente de aprobación";
	platform: string;
	publishedDate: string;
	imageUrl: string;
	isAIGenerated?: boolean;
	engagement?: {
		deliveryRate: number;
		openRate: number;
		clickRate: number;
	};
}

/**
 * Página de historial de campañas
 * Muestra una tabla con el historial de campañas publicadas y sus métricas
 */
export function CampaignHistoryTabPage() {
	const navigate = useNavigate();
	const { t } = useTranslate();
	const { showToast } = useAuraToast();

	const [searchTerm, setSearchTerm] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);
	const [contentHistory, setContentHistory] = useState<ContentHistoryItem[]>([]);

	// Table states
	const [page, setPage] = useState(1);
	const [rowsPerPage] = useState(10);
	const [selectedKeys, setSelectedKeys] = useState<Selection>(
		new Set<string | number>()
	);
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "publishedDate",
		direction: "descending",
	});

	// Filter states
	const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
	const [filterType, setFilterType] = useState<string[]>([]);
	const [filterStatus, setFilterStatus] = useState<string[]>([]);

	useEffect(() => {
		const loadCampaigns = async () => {
			setIsLoading(true);
			const result = await CampaignManagementDI.GetAllCampaigns().execute();
			
			if (result.isSuccess && result.value) {
				// Mapear el dominio al formato de la UI local por ahora
				const mapped: ContentHistoryItem[] = result.value.map(c => ({
					id: c.id,
					title: c.name,
					type: c.contentType === EnumCampaignContentType.WHATSAPP ? "whatsapp" as const : "email" as const,
					status: c.status === EnumCampaignStatus.SENT ? "Publicado" as const : "Borrador" as const,
					platform: c.contentType === EnumCampaignContentType.WHATSAPP ? "WhatsApp" : "Email",
					publishedDate: (c.sentAt || c.createdAt).toISOString(),
					imageUrl: c.imageUrl || "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop&crop=center",
					isAIGenerated: true,
					engagement: {
						deliveryRate: 98.5,
						openRate: 87.2,
						clickRate: 34.5,
					},
				}));
				setContentHistory(mapped);
			} else if (result.error) {
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						"error_loading_campaigns"
					)
				);
			}
			setIsLoading(false);
		};

		loadCampaigns();
	}, [t, showToast]);

	// DrawerFilters configuration for history
	const historyDrawerFiltersConfig: DrawerFiltersConfig = useMemo(
		() => ({
			title: "Filtros Avanzados",
			description: "Filtra contenidos por tipo, estado y fecha de publicación",
			data: [
				{
					key: "type",
					title: "Tipo de contenido",
					type: "multiselect",
					data: [
						{ label: "WhatsApp", value: "whatsapp" },
						{ label: "Email", value: "email" },
					],
				},
				{
					key: "status",
					title: "Estado",
					type: "multiselect",
					data: [
						{ label: "Publicado", value: "Publicado" },
						{
							label: "Pendiente de aprobación",
							value: "Pendiente de aprobación",
						},
					],
				},
				{
					key: "publishedDate",
					title: "Fecha de publicación",
					type: "date",
					data: {
						min: "2020-01-01",
						max: "2025-12-31",
						placeholder: "Seleccionar fecha",
					},
				},
			],
		}),
		[]
	);

	// Filter content history based on search term and filters
	const filteredContentHistory = useMemo(() => {
		let filtered = contentHistory;

		// Apply search filter
		if (searchTerm.trim()) {
			const searchLower = searchTerm.toLowerCase();
			filtered = filtered.filter((content) =>
				content.title.toLowerCase().includes(searchLower)
			);
		}

		// Apply type filter
		if (filterType.length > 0) {
			filtered = filtered.filter((content) =>
				filterType.includes(content.type)
			);
		}

		// Apply status filter
		if (filterStatus.length > 0) {
			filtered = filtered.filter((content) =>
				filterStatus.includes(content.status)
			);
		}

		return filtered;
	}, [contentHistory, searchTerm, filterType, filterStatus]);

	// Sort and paginate content history
	const sortedAndPaginatedContent = useMemo(() => {
		const sortedContent = [...filteredContentHistory];

		// Apply sorting
		if (sortDescriptor.column) {
			sortedContent.sort((a, b) => {
				const aValue = a[sortDescriptor.column as keyof ContentHistoryItem];
				const bValue = b[sortDescriptor.column as keyof ContentHistoryItem];

				let comparison = 0;

				if (sortDescriptor.column === "publishedDate") {
					const aDate = new Date(aValue as string).getTime();
					const bDate = new Date(bValue as string).getTime();
					comparison = aDate - bDate;
				} else if (typeof aValue === "string" && typeof bValue === "string") {
					comparison = aValue.localeCompare(bValue);
				}

				return sortDescriptor.direction === "descending"
					? -comparison
					: comparison;
			});
		}

		// Apply pagination
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;
		return sortedContent.slice(start, end);
	}, [filteredContentHistory, sortDescriptor, page, rowsPerPage]);

	// Calculate total pages
	const pages = Math.ceil(filteredContentHistory.length / rowsPerPage) || 1;

	// Selection change handler
	const handleSelectionChange = useCallback((keys: Selection) => {
		setSelectedKeys(keys);
	}, []);

	// Sort change handler
	const handleSortChange = useCallback((descriptor: SortDescriptor) => {
		setSortDescriptor(descriptor);
	}, []);

	// Row action handler - repeat campaign
	const handleRowAction = useCallback((key: React.Key) => {
		const content = contentHistory.find(c => c.id === String(key));
		if (content) {
			// Guardar el contenido en sessionStorage
			sessionStorage.setItem(
				"repeatCampaign",
				JSON.stringify({
					currentStep: 7,
					content: content,
					fromRepeat: true,
				})
			);

			// Navegar al wizard en el último paso (Alcance)
			navigate("/campaigns/create-campaign", {
				state: {
					currentStep: 7,
					content: content,
					fromRepeat: true,
				},
			});
		}
	}, [contentHistory, navigate]);

	return (
		<div className="space-y-4 pt-4">
			{/* Top Content Bar */}
			<div className="flex items-center gap-4 overflow-auto px-[6px] py-[4px] justify-between">
				{/* Left section: Search and Selection info */}
				<div className="flex items-center gap-3">
					<Input
						className="flex-1 max-w-xs min-w-52"
						endContent={
							<IconComponent
								icon="solar:magnifer-outline"
								className="text-default-400"
								size="sm"
							/>
						}
						placeholder="Buscar por título..."
						value={searchTerm}
						onValueChange={setSearchTerm}
					/>
					{(selectedKeys === "all" || selectedKeys.size > 0) && (
						<>
							<Divider className="h-5" orientation="vertical" />
							<div className="text-default-800 text-sm whitespace-nowrap">
								{selectedKeys === "all"
									? "Todos seleccionados"
									: `${selectedKeys.size} seleccionado${selectedKeys.size > 1 ? "s" : ""}`}
							</div>
							<Dropdown>
								<DropdownTrigger>
									<Button
										className="bg-default-100 text-default-800"
										endContent={
											<IconComponent
												className="text-default-400"
												icon="solar:alt-arrow-down-outline"
											/>
										}
										size="sm"
										variant="flat"
									>
										Acciones
									</Button>
								</DropdownTrigger>
								<DropdownMenu
									aria-label="Acciones seleccionadas"
									onAction={(key) => {
										if (key === "delete") {
											console.log("Eliminar seleccionados");
										}
									}}
								>
									<DropdownItem
										key="delete"
										className="text-danger"
										textValue="Eliminar"
									>
										Eliminar
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</>
					)}
				</div>

				{/* Right section: Table controls */}
				<div className="flex items-center gap-4">
					{/* Filter button */}
					<Button
						variant="solid"
						className="bg-default-100 text-default-800"
						size="sm"
						onPress={() => setIsFilterDrawerOpen(true)}
						startContent={
							<IconComponent
								icon="solar:tuning-2-outline"
								className="text-default-800"
								size="sm"
							/>
						}
					>
						Filtros
					</Button>
				</div>
			</div>

			{/* History Table */}
			<Table
				aria-label="Tabla de historial de contenidos"
				radius="none"
				selectionMode="multiple"
				selectedKeys={selectedKeys}
				onSelectionChange={handleSelectionChange}
				sortDescriptor={sortDescriptor}
				onSortChange={handleSortChange}
				onRowAction={handleRowAction}
				classNames={{
					td: "before:bg-transparent",
					wrapper: "border-none shadow-none p-1",
				}}
				bottomContent={
					pages > 1 ? (
						<div className="flex w-full justify-center">
							<Pagination
								isCompact
								showControls
								showShadow
								color="primary"
								page={page}
								total={pages}
								onChange={(newPage) => setPage(newPage)}
							/>
						</div>
					) : null
				}
			>
				<TableHeader>
					<TableColumn key="title" allowsSorting>
						CONTENIDO
					</TableColumn>
					<TableColumn key="type" allowsSorting>
						TIPO
					</TableColumn>
					<TableColumn key="status" allowsSorting>
						ESTADO
					</TableColumn>
					<TableColumn
						key="isAIGenerated"
						className="bg-purple-50/70 text-purple-700 font-semibold"
					>
						GENERADO CON IA
					</TableColumn>
					<TableColumn key="publishedDate" allowsSorting>
						FECHA DE PUBLICACIÓN
					</TableColumn>
					<TableColumn key="engagement">ENGAGEMENT</TableColumn>
					<TableColumn key="actions">ACCIONES</TableColumn>
				</TableHeader>
				<TableBody
					items={sortedAndPaginatedContent}
					emptyContent={
						searchTerm
							? "No se encontraron contenidos que coincidan con tu búsqueda"
							: "No hay contenidos en el historial"
					}
				>
					{(content) => (
						<TableRow key={content.id} className="group/row">
							<TableCell>
								<div className="flex items-center gap-3">
									<Image
										src={content.imageUrl}
										alt={content.title}
										className="w-12 h-12 object-cover rounded-lg"
										loading="lazy"
									/>
									<span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
										{content.title}
									</span>
								</div>
							</TableCell>
							<TableCell>
								<Chip
									size="sm"
									variant="flat"
									color={content.type === "whatsapp" ? "success" : "primary"}
									startContent={
										content.type === "whatsapp" ? (
											<IconComponent
												icon="ri:whatsapp-fill"
												className="w-3.5 h-3.5"
											/>
										) : (
											<IconComponent
												icon="solar:letter-bold"
												className="w-3.5 h-3.5"
											/>
										)
									}
								>
									{content.type === "whatsapp" ? "WhatsApp" : "Email"}
								</Chip>
							</TableCell>
							<TableCell>
								<Chip
									size="sm"
									variant="flat"
									color={
										content.status === "Publicado"
											? "success"
											: content.status === "Pendiente de aprobación"
												? "warning"
												: "default"
									}
								>
									{content.status}
								</Chip>
							</TableCell>
							<TableCell className="before:!bg-purple-50/60 bg-purple-50/30 group-hover/row:!bg-purple-100/50 group-hover/row:before:!bg-purple-100/60">
								{content.isAIGenerated ? (
									<Chip
										size="sm"
										variant="flat"
										className="bg-purple-100 text-purple-700"
										startContent={
											<IconComponent
												icon="solar:magic-stick-bold"
												className="w-3 h-3"
											/>
										}
									>
										Sí
									</Chip>
								) : (
									<span className="text-sm text-purple-400">No</span>
								)}
							</TableCell>
							<TableCell>
								<span className="text-sm text-gray-600 dark:text-gray-400">
									{new Date(content.publishedDate).toLocaleDateString("es-ES", {
										day: "2-digit",
										month: "short",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
							</TableCell>
							<TableCell>
								{content.engagement ? (
									<div className="flex items-center gap-3 text-xs">
										<Tooltip content="Tasa de Entrega" placement="top">
											<div className="flex flex-col items-center gap-0.5">
												<IconComponent
													icon="solar:check-circle-bold"
													className="w-3.5 h-3.5 text-success-500"
												/>
												<span className="font-medium text-gray-700 dark:text-gray-300">
													{content.engagement.deliveryRate}%
												</span>
											</div>
										</Tooltip>
										<Tooltip content="Tasa de Apertura" placement="top">
											<div className="flex flex-col items-center gap-0.5">
												<IconComponent
													icon="solar:letter-opened-bold"
													className="w-3.5 h-3.5 text-primary-500"
												/>
												<span className="font-medium text-gray-700 dark:text-gray-300">
													{content.engagement.openRate}%
												</span>
											</div>
										</Tooltip>
										<Tooltip content="Tasa de Clics" placement="top">
											<div className="flex flex-col items-center gap-0.5">
												<IconComponent
													icon="solar:cursor-bold"
													className="w-3.5 h-3.5 text-warning-500"
												/>
												<span className="font-medium text-gray-700 dark:text-gray-300">
													{content.engagement.clickRate}%
												</span>
											</div>
										</Tooltip>
									</div>
								) : (
									<span className="text-sm text-gray-400">-</span>
								)}
							</TableCell>
							<TableCell>
								<Tooltip content="Repetir campaña">
									<Button
										isIconOnly
										size="sm"
										variant="light"
										onPress={() => {
											console.log("=== REPETIR CAMPAÑA ===");
											console.log("Contenido:", content);

											// Guardar el contenido en sessionStorage
											sessionStorage.setItem(
												"repeatCampaign",
												JSON.stringify({
													currentStep: 7,
													content: content,
													fromRepeat: true,
												})
											);

											console.log("Navegando a crear-campana en el paso 7...");

											// Navegar al wizard en el último paso (Alcance)
											navigate("/campaigns/create-campaign", {
												state: {
													currentStep: 7,
													content: content,
													fromRepeat: true,
												},
											});
										}}
										aria-label="Repetir campaña"
									>
										<IconComponent
											icon="solar:restart-bold"
											className="w-4 h-4 text-primary"
										/>
									</Button>
								</Tooltip>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{/* Filter Drawer for History */}
			<DrawerFilters
				config={historyDrawerFiltersConfig}
				onApplyFilters={(filters) => {
					console.log("Filtros aplicados:", filters);
					// Apply filters to the history table
					if (filters.type) {
						setFilterType(
							Array.isArray(filters.type) ? filters.type : [filters.type]
						);
					} else {
						setFilterType([]);
					}
					if (filters.status) {
						setFilterStatus(
							Array.isArray(filters.status) ? filters.status : [filters.status]
						);
					} else {
						setFilterStatus([]);
					}
					// Handle date filter if needed
					setIsFilterDrawerOpen(false);
				}}
				isOpen={isFilterDrawerOpen}
				onOpenChange={setIsFilterDrawerOpen}
			/>
		</div>
	);
}
