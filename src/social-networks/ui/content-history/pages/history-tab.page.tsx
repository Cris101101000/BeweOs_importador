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
	Input,
	Pagination,
	type Selection,
	type SortDescriptor,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	useAuraToast,
} from "@beweco/aurora-ui";
import { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import { ImagePreviewComponent } from "@shared/ui/components";
import { ContentPreviewModal } from "@shared/ui/components";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils/toast-config.utils";
import { replaceVariables } from "@shared/utils/replace-variables.util";
import { useSession } from "@shared/ui/contexts/session-context/session-context";
import { useBusinessInfo } from "@shared/ui/hooks/use-business-info.hook";
import { deletePost } from "@social-networks/application";
import {
	EnumAIGenerationType,
	EnumChannel,
	EnumPostState,
	EnumPostType,
	type IPost,
} from "@social-networks/domain";
import { postsAdapter } from "@social-networks/infrastructure/adapters/posts.adapter";
import { useTranslate } from "@tolgee/react";
import { useCallback, useMemo, useState } from "react";
import { usePostsHistory } from "../hooks/use-posts-history.hook";
import { mapDrawerFiltersToPostsFilter } from "../mappers";

export function HistoryTabPage() {
	const { showToast } = useAuraToast();
	const { t } = useTranslate();
	const { user, agency } = useSession();
	const { businessInfo } = useBusinessInfo();

	const [searchTerm, setSearchTerm] = useState<string>("");

	// Table states
	const [page, setPage] = useState(1);
	const [rowsPerPage] = useState(10);
	const [selectedKeys, setSelectedKeys] = useState<Selection>(
		new Set<string | number>()
	);
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "date",
		direction: "descending",
	});

	// Filter states
	const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
	const [selectedState, setSelectedState] = useState<
		EnumPostState | EnumPostState[] | undefined
	>();
	const [selectedChannel, setSelectedChannel] = useState<
		EnumChannel | EnumChannel[] | undefined
	>();
	const [selectedPostType, setSelectedPostType] = useState<
		EnumPostType | EnumPostType[] | undefined
	>();

	// Delete states
	const [isDeleting, setIsDeleting] = useState(false);

	// Preview modal states
	const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
	const [selectedPostForPreview, setSelectedPostForPreview] =
		useState<IPost | null>(null);

	// Build order parameter for API
	const orderParam = useMemo(() => {
		if (!sortDescriptor.column) return undefined;
		const prefix = sortDescriptor.direction === "descending" ? "-" : "";
		return `${prefix}${sortDescriptor.column}`;
	}, [sortDescriptor]);

	// Build params object for API
	const apiParams = {
		limit: rowsPerPage,
		offset: (page - 1) * rowsPerPage,
		search: searchTerm || undefined,
		state: selectedState,
		channel: selectedChannel,
		postType: selectedPostType,
		order: orderParam,
	};

	// Log params for debugging
	console.log("🔍 Parámetros enviados a usePostsHistory:", apiParams);

	// Fetch posts from API
	const {
		posts,
		totalPosts,
		isLoadingPosts,
		isErrorPosts,
		errorPosts,
		refetchPosts,
	} = usePostsHistory(apiParams);

	// Calculate total pages
	const totalPages = Math.ceil(totalPosts / rowsPerPage) || 1;

	// DrawerFilters configuration
	const configDrawerFilters: DrawerFiltersConfig = useMemo(
		() => ({
			title: t("social_networks_history_filter_title"),
			description: t("social_networks_history_filter_description"),
			data: [
				{
					key: "state",
					title: t("social_networks_history_filter_state"),
					type: "multiselect",
					data: [
						{
							label: t("social_networks_history_state_published"),
							value: EnumPostState.PUBLISHED,
						},
						{
							label: t("social_networks_history_state_draft"),
							value: EnumPostState.DRAFT,
						},
						{
							label: t("social_networks_history_state_draft_ai"),
							value: EnumPostState.AI_GENERATED_DRAFT,
						},
						{
							label: t("social_networks_history_state_pending"),
							value: EnumPostState.PENDING,
						},
						{
							label: t("social_networks_history_state_failed"),
							value: EnumPostState.FAILED,
						},
						{
							label: t("social_networks_history_state_canceled"),
							value: EnumPostState.CANCELED,
						},
					],
				},
				{
					key: "channel",
					title: t("social_networks_history_filter_channel"),
					type: "multiselect",
					data: [
						{
							label: t("social_networks_history_channel_instagram"),
							value: EnumChannel.INSTAGRAM,
						},
						{
							label: t("social_networks_history_channel_facebook"),
							value: EnumChannel.FACEBOOK,
						},
						{
							label: t("social_networks_history_channel_tiktok"),
							value: EnumChannel.TIKTOK,
						},
						{
							label: t("social_networks_history_channel_twitter"),
							value: EnumChannel.TWITTER,
						},
						{
							label: t("social_networks_history_channel_linkedin"),
							value: EnumChannel.LINKEDIN,
						},
					],
				},
				{
					key: "postType",
					title: t("social_networks_history_filter_post_type"),
					type: "multiselect",
					data: [
						{
							label: t("social_networks_history_post_type_post"),
							value: EnumPostType.POST,
						},
						{
							label: t("social_networks_history_post_type_story"),
							value: EnumPostType.STORY,
						},
						{
							label: t("social_networks_history_post_type_reel"),
							value: EnumPostType.REEL,
						},
						{
							label: t("social_networks_history_post_type_video"),
							value: EnumPostType.VIDEO,
						},
					],
				},
			],
		}),
		[t]
	);

	// Helper functions to format data
	const getPostTypeLabel = useCallback(
		(type: EnumPostType) => {
			const labels: Record<EnumPostType, string> = {
				[EnumPostType.POST]: t("social_networks_history_post_type_post"),
				[EnumPostType.STORY]: t("social_networks_history_post_type_story"),
				[EnumPostType.REEL]: t("social_networks_history_post_type_reel"),
				[EnumPostType.VIDEO]: t("social_networks_history_post_type_video"),
			};
			return labels[type] ?? type;
		},
		[t]
	);

	const getStateLabel = useCallback(
		(state: EnumPostState) => {
			const labels: Record<EnumPostState, string> = {
				[EnumPostState.PUBLISHED]: t("social_networks_history_state_published"),
				[EnumPostState.DRAFT]: t("social_networks_history_state_draft"),
				[EnumPostState.AI_GENERATED_DRAFT]: t(
					"social_networks_history_state_draft_ai"
				),
				[EnumPostState.PENDING]: t("social_networks_history_state_pending"),
				[EnumPostState.FAILED]: t("social_networks_history_state_failed"),
				[EnumPostState.CANCELED]: t("social_networks_history_state_canceled"),
			};
			return labels[state] ?? state;
		},
		[t]
	);

	const getStateColor = useCallback(
		(state: EnumPostState): "success" | "warning" | "danger" | "default" => {
			const colors = {
				[EnumPostState.PUBLISHED]: "success" as const,
				[EnumPostState.DRAFT]: "warning" as const,
				[EnumPostState.AI_GENERATED_DRAFT]: "warning" as const,
				[EnumPostState.PENDING]: "default" as const,
				[EnumPostState.FAILED]: "danger" as const,
				[EnumPostState.CANCELED]: "danger" as const,
			};
			return colors[state] || "default";
		},
		[]
	);

	// Selection change handler
	const handleSelectionChange = useCallback((keys: Selection) => {
		setSelectedKeys(keys);
	}, []);

	// Sort change handler
	const handleSortChange = useCallback((descriptor: SortDescriptor) => {
		setSortDescriptor(descriptor);
		setPage(1); // Reset to first page when sorting changes
	}, []);

	// Apply filters handler
	const handleApplyFilters = useCallback((filters: Record<string, any>) => {
		console.log("📊 Filters RAW del DrawerFilters:", filters);

		// Usar el mapper para procesar los filtros correctamente
		const processedFilters = mapDrawerFiltersToPostsFilter(filters);

		console.log("📊 Filters PROCESADOS por mapper:", processedFilters);

		setSelectedState(processedFilters.state);
		setSelectedChannel(processedFilters.channel);
		setSelectedPostType(processedFilters.postType);
		setPage(1); // Reset to first page when filters change
		setIsFilterDrawerOpen(false);
	}, []);

	// Search change handler
	const handleSearchChange = useCallback((value: string) => {
		setSearchTerm(value);
		setPage(1); // Reset to first page when search changes
	}, []);

	// Open preview modal handler
	const handleOpenPreview = useCallback((post: IPost) => {
		setSelectedPostForPreview(post);
		setIsPreviewModalOpen(true);
	}, []);

	// Close preview modal handler
	const handleClosePreview = useCallback(() => {
		setIsPreviewModalOpen(false);
		setSelectedPostForPreview(null);
	}, []);

	// Row action handler - open preview
	const handleRowAction = useCallback((key: React.Key) => {
		const post = posts.find(p => p.id === String(key));
		if (post) {
			handleOpenPreview(post);
		}
	}, [posts, handleOpenPreview]);

	// Delete selected posts handler
	const handleDeleteSelected = useCallback(async () => {
		if (selectedKeys === "all" || selectedKeys.size === 0) {
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Validation,
					t,
					"Selecciona posts",
					"Por favor, selecciona los posts que deseas eliminar"
				)
			);
			return;
		}

		// Confirm deletion
		const postCount = selectedKeys.size;
		const confirmMessage =
			postCount === 1
				? "¿Estás seguro de que quieres eliminar este post?"
				: `¿Estás seguro de que quieres eliminar ${postCount} posts?`;

		if (!window.confirm(confirmMessage)) {
			return;
		}

		setIsDeleting(true);

		try {
			// Convert Selection to array of IDs
			const idsToDelete = Array.from(selectedKeys) as string[];

			// Delete all selected posts
			await Promise.all(idsToDelete.map((id) => deletePost(postsAdapter, id)));

			// Show success toast
			showToast(
				configureSuccessToast(
					"Posts eliminados",
					postCount === 1
						? "El post ha sido eliminado exitosamente"
						: `${postCount} posts han sido eliminados exitosamente`
				)
			);

			// Clear selection
			setSelectedKeys(new Set());

			// Refetch posts to update the list
			refetchPosts();
		} catch (error) {
			console.error("Error deleting posts:", error);

			// Show error toast
			showToast(
				configureErrorToastWithTranslation(
					EnumErrorType.Critical,
					t,
					"Error al eliminar",
					error instanceof Error
						? error.message
						: "No se pudieron eliminar los posts"
				)
			);
		} finally {
			setIsDeleting(false);
		}
	}, [selectedKeys, showToast, t, refetchPosts]);

	return (
		<>
			{/* Content History Section */}
			<div className="flex flex-col gap-4 mt-4">
				{/* Top Content Bar - Similar to clients table */}
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
							size="sm"
							value={searchTerm}
							onValueChange={handleSearchChange}
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
											isDisabled={isDeleting}
											isLoading={isDeleting}
										>
											{isDeleting ? "Eliminando..." : "Acciones"}
										</Button>
									</DropdownTrigger>
									<DropdownMenu
										aria-label="Acciones seleccionadas"
										onAction={(key) => {
											if (key === "delete") {
												handleDeleteSelected();
											}
										}}
									>
										<DropdownItem
											key="delete"
											className="text-danger"
											textValue="Eliminar"
											isDisabled={isDeleting}
										>
											{isDeleting ? "Eliminando..." : "Eliminar"}
										</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</>
						)}
					</div>

					{/* Right section: Table controls */}
					<div className="flex items-center gap-4">
						{/* Refresh button */}
						<Button
							variant="solid"
							className="bg-default-100 text-default-800"
							size="sm"
							onPress={() => refetchPosts()}
							isIconOnly
						>
							<IconComponent
								icon="solar:refresh-outline"
								className="text-default-800"
								size="sm"
							/>
						</Button>

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
						totalPages > 1 ? (
							<div className="flex w-full justify-center">
								<Pagination
									isCompact
									showControls
									showShadow
									color="primary"
									page={page}
									total={totalPages}
									onChange={(newPage) => setPage(newPage)}
								/>
							</div>
						) : null
					}
				>
					<TableHeader>
						<TableColumn key="name" allowsSorting>
							CONTENIDO
						</TableColumn>
						<TableColumn key="postType" allowsSorting>
							TIPO
						</TableColumn>
						<TableColumn key="state" allowsSorting>
							ESTADO
						</TableColumn>
						<TableColumn key="channel" allowsSorting>
							CANAL
						</TableColumn>
						<TableColumn
							key="aiGenerationType"
							className="bg-purple-50/70 text-purple-700 font-semibold"
						>
							GENERADO CON IA
						</TableColumn>
						<TableColumn key="date" allowsSorting>
							FECHA DE PUBLICACIÓN
						</TableColumn>
						<TableColumn key="engagement">ENGAGEMENT</TableColumn>
						<TableColumn key="actions" align="center">
							ACCIONES
						</TableColumn>
					</TableHeader>
					<TableBody
						items={posts}
						isLoading={isLoadingPosts}
						loadingContent={<Spinner size="lg" />}
						emptyContent={
							isErrorPosts
								? `Error al cargar posts: ${errorPosts?.message || "Error desconocido"}`
								: searchTerm
									? "No se encontraron contenidos que coincidan con tu búsqueda"
									: "No hay contenidos en el historial"
						}
					>
						{(post: IPost) => (
							<TableRow key={post.id} className="group/row">
								<TableCell>
									<div className="flex items-center gap-3">
										<ImagePreviewComponent
											images={{
												src: post.imageUrl,
												alt: post.name,
												id: post.id,
											}}
											size="micro"
											showRemoveButton={false}
										/>
										<div className="flex flex-col">
											<span className="font-semibold text-sm text-gray-900">
												{post.name}
											</span>
											<span className="text-xs text-gray-500 line-clamp-1">
												{post.description}
											</span>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<Chip
										size="sm"
										variant="flat"
										color="secondary"
										startContent={
											post.postType === EnumPostType.POST ? (
												<IconComponent
													icon="solar:gallery-bold"
													className="w-3.5 h-3.5"
												/>
											) : post.postType === EnumPostType.STORY ? (
												<IconComponent
													icon="solar:camera-bold"
													className="w-3.5 h-3.5"
												/>
											) : (
												<IconComponent
													icon="solar:videocamera-bold"
													className="w-3.5 h-3.5"
												/>
											)
										}
									>
										{getPostTypeLabel(post.postType)}
									</Chip>
								</TableCell>
								<TableCell>
									<Chip
										size="sm"
										variant="flat"
										color={getStateColor(post.state)}
									>
										{getStateLabel(post.state)}
									</Chip>
								</TableCell>
								<TableCell>
									<span className="text-sm capitalize text-gray-700">
										{post.channel}
									</span>
								</TableCell>
								<TableCell className="before:!bg-purple-50/60 bg-purple-50/30 group-hover/row:!bg-purple-100/50 group-hover/row:before:!bg-purple-100/60">
									{post.aiGenerationType !== EnumAIGenerationType.NO ? (
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
											{post.aiGenerationType === EnumAIGenerationType.CREATE
												? "Creado"
												: "Editado"}
										</Chip>
									) : (
										<span className="text-sm text-purple-400">No</span>
									)}
								</TableCell>
								<TableCell>
									<span className="text-sm text-gray-600">
										{new Date(post.date).toLocaleDateString("es-ES", {
											day: "2-digit",
											month: "short",
											year: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-3 text-sm text-gray-600">
										<div className="flex items-center gap-1">
											<IconComponent
												icon="solar:heart-bold"
												className="text-red-500 w-4 h-4"
											/>
											<span>{post.numLikes ?? 0}</span>
										</div>
										<div className="flex items-center gap-1">
											<IconComponent
												icon="solar:chat-round-dots-bold"
												className="text-blue-500 w-4 h-4"
											/>
											<span>{post.numComments ?? 0}</span>
										</div>
										<div className="flex items-center gap-1">
											<IconComponent
												icon="solar:share-bold"
												className="text-green-500 w-4 h-4"
											/>
											<span>{post.numShareds ?? 0}</span>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center justify-center">
										<Button
											isIconOnly
											size="sm"
											variant="light"
											onPress={() => handleOpenPreview(post)}
											aria-label="Ver vista previa"
										>
											<IconComponent
												icon="solar:eye-bold"
												className="text-primary w-5 h-5"
											/>
										</Button>
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				{/* Total count */}
				{!isLoadingPosts && !isErrorPosts && (
					<div className="text-sm text-gray-600 px-2">
						Mostrando {posts.length} de {totalPosts} posts
					</div>
				)}
			</div>

			{/* Filter Drawer */}
			<DrawerFilters
				config={configDrawerFilters}
				onApplyFilters={handleApplyFilters}
				isOpen={isFilterDrawerOpen}
				onOpenChange={setIsFilterDrawerOpen}
			/>

			{/* Preview Modal */}
			{selectedPostForPreview && (
				<ContentPreviewModal
					isOpen={isPreviewModalOpen}
					onClose={handleClosePreview}
					platform={selectedPostForPreview.channel as any}
					imageUrl={selectedPostForPreview.imageUrl}
					caption={replaceVariables(
						selectedPostForPreview.description ?? "",
						user ?? null,
						agency ?? null,
						businessInfo ?? null
					)}
					title={selectedPostForPreview.name}
					variant={
						selectedPostForPreview.postType === EnumPostType.STORY
							? "story"
							: "full"
					}
					showHeader={true}
				/>
			)}
		</>
	);
}
