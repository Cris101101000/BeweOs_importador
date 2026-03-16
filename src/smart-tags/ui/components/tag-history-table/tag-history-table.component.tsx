import {
	Avatar,
	Button,
	Chip,
	IconComponent,
	Pagination,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@beweco/aurora-ui";
import { useTranslate } from "@tolgee/react";
import type React from "react";
import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
	APPLICABLE_ENTITY_CONFIG,
	getEntityFromApiType,
	getEntityFromSubTabKey,
} from "../../../domain/constants/applicable-entity.config";
import { ViewSkeleton } from "@shared/ui/components/view-skeleton";
import type { TagHistoryTableProps } from "./tag-history-table.types";

/**
 * TagHistoryTable Component
 *
 * Tabla de historial de uso de etiquetas inteligentes.
 * Muestra las asignaciones de una etiqueta a clientes o conversaciones.
 */
export const TagHistoryTable: React.FC<TagHistoryTableProps> = ({
	assignments,
	isLoading,
	error,
	page,
	onPageChange,
	rowsPerPage = 10,
	historySubTab,
}) => {
	const navigate = useNavigate();
	const { t } = useTranslate();

	// Paginated assignments
	const paginatedAssignments = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;
		return assignments.slice(start, end);
	}, [assignments, page, rowsPerPage]);

	const totalPages = Math.ceil(assignments.length / rowsPerPage);

	// Loading state - show skeleton
	if (isLoading) {
		return <ViewSkeleton variant="table" />;
	}

	// Error state
	if (error) {
		return (
			<div className="p-8 bg-danger-50 dark:bg-danger-100 rounded-lg border border-danger-200 text-center">
				<IconComponent
					icon="solar:danger-circle-bold"
					className="text-danger-500 mx-auto mb-3"
					width={48}
					height={48}
				/>
				<p className="text-sm font-medium text-danger-700">
					{t(
						"smart_tags_detail_history_error_title",
						"Error al cargar asignaciones"
					)}
				</p>
				<p className="text-xs text-danger-500 mt-1">{error}</p>
			</div>
		);
	}

	// Get entity name for empty state based on sub-tab (dynamic from config)
	const getEntityName = () => {
		const entity = getEntityFromSubTabKey(historySubTab);
		if (entity) {
			const config = APPLICABLE_ENTITY_CONFIG[entity];
			return config?.singularTranslationKey
				? t(config.singularTranslationKey, historySubTab)
				: historySubTab;
		}
		return historySubTab;
	};

	// Empty state
	if (assignments.length === 0) {
		return (
			<div className="p-8 bg-default-50 dark:bg-default-100 rounded-lg border border-default-200 text-center">
				<IconComponent
					icon="solar:inbox-outline"
					className="text-default-400 mx-auto mb-3"
					width={48}
					height={48}
				/>
				<p className="text-sm font-medium text-default-700">
					{t("smart_tags_detail_history_empty_title", "Sin registros de uso")}
				</p>
				<p className="text-xs text-default-500 mt-1">
					{t("smart_tags_detail_history_empty_description", {
						entity: getEntityName(),
					})}
				</p>
			</div>
		);
	}
	// Get current tab config for dynamic header and actions visibility
	const currentTabEntity = getEntityFromSubTabKey(historySubTab);
	const currentTabConfig = currentTabEntity
		? APPLICABLE_ENTITY_CONFIG[currentTabEntity]
		: null;
	const contactColumnHeader = currentTabConfig?.contactColumnHeaderKey
		? t(currentTabConfig.contactColumnHeaderKey, "CONTACTO")
		: t("smart_tags_table_column_contact", "CONTACTO");
	const showActionsColumn = currentTabConfig?.showActions ?? true;

	// Row action handler - navigate to entity detail
	const handleRowAction = useCallback((key: React.Key) => {
		const item = paginatedAssignments.find(a => a.id === String(key));
		if (item) {
			const applicableEntity = getEntityFromApiType(item.assignment.entityType);
			const entityConfig = applicableEntity
				? APPLICABLE_ENTITY_CONFIG[applicableEntity]
				: null;
			
			if (entityConfig?.navigationPath) {
				const path = entityConfig.navigationPath.replace(
					"{entityId}",
					item.assignment.entityId
				);
				navigate(path);
			}
		}
	}, [paginatedAssignments, navigate]);

	return (
		<>
			<Table
				aria-label={t(
					"smart_tags_detail_history_aria",
					"Historial de uso de la etiqueta"
				)}
				classNames={{
					wrapper: "shadow-none border border-default-200 rounded-lg",
				}}
				onRowAction={handleRowAction}
			>
				<TableHeader>
					{[
						<TableColumn key="type">
							{t("smart_tags_table_column_type", "TIPO")}
						</TableColumn>,
						<TableColumn key="name">
							{t("smart_tags_table_column_name", "NOMBRE")}
						</TableColumn>,
						<TableColumn key="contact">{contactColumnHeader}</TableColumn>,
						<TableColumn key="date">
							{t(
								"smart_tags_table_column_assignment_date",
								"FECHA DE ASIGNACIÓN"
							)}
						</TableColumn>,
						...(showActionsColumn
							? [
									<TableColumn key="actions">
										{t("smart_tags_table_column_actions", "ACCIONES")}
									</TableColumn>,
								]
							: []),
					]}
				</TableHeader>
				<TableBody>
					{paginatedAssignments.map((item) => {
						const entityType = item.assignment.entityType;
						const assignedAt = new Date(item.createdAt);

						// Get config for this entity type (fully dynamic from config)
						const applicableEntity = getEntityFromApiType(entityType);
						const entityConfig = applicableEntity
							? APPLICABLE_ENTITY_CONFIG[applicableEntity]
							: null;

						// Render name column icon/avatar based on config
						const renderNameIcon = () => {
							if (entityConfig?.showAvatar) {
								return (
									<Avatar
										name={
											item.entityData?.name ||
											t("smart_tags_detail_history_no_name", "Sin nombre")
										}
										size="sm"
										src={item.entityData?.avatarUrl || undefined}
									/>
								);
							}
							// Show entity icon with background matching chip styles
							const bgClass =
								entityConfig?.chipStyles?.split(" ")[0] || "bg-default-100";
							const textClass =
								entityConfig?.chipStyles
									?.split(" ")[1]
									?.replace("text-", "text-") || "text-default-600";
							return (
								<div
									className={`w-8 h-8 rounded-full ${bgClass} flex items-center justify-center`}
								>
									<IconComponent
										icon={entityConfig?.icon || "solar:hashtag-square-bold"}
										className={textClass}
										size="sm"
									/>
								</div>
							);
						};

						// Render contact/context column based on config
						const renderContactColumn = () => {
							switch (entityConfig?.contactColumnType) {
								case "email_phone":
									return (
										<div className="flex flex-col gap-1">
											<span className="text-sm text-default-900">
												{item.entityData?.email || "-"}
											</span>
											<span className="text-xs text-default-500">
												{item.entityData?.phone || "-"}
											</span>
										</div>
									);
								case "context":
									return (
										<span className="text-sm text-default-600 line-clamp-2">
											{item.source?.context || "-"}
										</span>
									);
								case "last_message":
								default:
									return (
										<span className="text-sm text-default-600 line-clamp-1">
											{item.entityData?.lastMessage || "-"}
										</span>
									);
							}
						};

						// Handle navigation based on config
						const handleNavigation = () => {
							if (entityConfig?.navigationPath) {
								const path = entityConfig.navigationPath.replace(
									"{entityId}",
									item.assignment.entityId
								);
								navigate(path);
							}
						};

						return (
							<TableRow key={item.id}>
								{[
									/* Type Column */
									<TableCell key="type">
										<Chip
											size="sm"
											variant="flat"
											className={
												entityConfig?.chipStyles ||
												"bg-default-50 text-default-700 border-default-200"
											}
											startContent={
												<IconComponent
													icon={
														entityConfig?.icon || "solar:hashtag-square-bold"
													}
													size="sm"
												/>
											}
										>
											{entityConfig?.translationKey
												? t(entityConfig.translationKey, entityType)
												: entityType}
										</Chip>
									</TableCell>,

									/* Name Column */
									<TableCell key="name">
										<div className="flex items-center gap-3">
											{renderNameIcon()}
											<div className="flex flex-col">
												<span className="text-sm font-medium text-default-900">
													{item.entityData?.name ||
														t(
															"smart_tags_detail_history_no_name",
															"Sin nombre"
														)}
												</span>
												{item.entityData?.clientName && (
													<span className="text-xs text-default-500">
														{item.entityData.clientName}
													</span>
												)}
												{item.entityData?.messagesCount !== undefined && (
													<span className="text-xs text-default-500">
														{t("smart_tags_detail_history_messages_count", {
															count: item.entityData.messagesCount,
														})}
													</span>
												)}
											</div>
										</div>
									</TableCell>,

									/* Contact/Context Column - Dynamic based on config */
									<TableCell key="contact">{renderContactColumn()}</TableCell>,

									/* Date Column */
									<TableCell key="date">
										<span className="text-sm text-default-600">
											{assignedAt.toLocaleDateString("es-ES", {
												day: "2-digit",
												month: "short",
												year: "numeric",
											})}
										</span>
									</TableCell>,

									/* Actions Column - Only show if enabled for this entity type */
									...(showActionsColumn
										? [
												<TableCell key="actions">
													<Button
														size="sm"
														variant="light"
														color="primary"
														startContent={
															<IconComponent
																icon="solar:eye-outline"
																size="sm"
															/>
														}
														onPress={handleNavigation}
														isDisabled={!entityConfig?.navigationPath}
													>
														{t("smart_tags_detail_history_view_button", "Ver")}
													</Button>
												</TableCell>,
											]
										: []),
								]}
							</TableRow>
						);
					})}
				</TableBody>
			</Table>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex justify-center mt-4">
					<Pagination
						total={totalPages}
						page={page}
						onChange={onPageChange}
						showControls
					/>
				</div>
			)}
		</>
	);
};

export default TagHistoryTable;
