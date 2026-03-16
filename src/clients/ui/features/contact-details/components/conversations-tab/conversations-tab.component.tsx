import { Chip, P, Select, SelectItem } from "@beweco/aurora-ui";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import type { ChatSessionStatus } from "@clients/domain/interfaces/chat-session.interface";
import { getClientFullName } from "@clients/domain/utils/client-name.utils";
import { useChatSessions } from "@clients/ui/features/contact-details/hooks/use-chat-sessions.hook";
import {
	EmptyState,
	ErrorState,
	LoadingState,
} from "@clients/ui/features/contact-details/components/list-states";
import {
	AccordionListComponent,
	type BaseAccordionItem,
} from "@shared/ui/components";
import { useTranslate } from "@tolgee/react";
import type { FC } from "react";
import { useState } from "react";

export interface ConversationsTabProps {
	client: IClient;
}

interface ConversationAccordionItem extends BaseAccordionItem {
	nameAssistant: string;
	channelName: string;
	totalMessages: number;
	status: ChatSessionStatus;
	lastMessage: string;
	createdAt: string;
}

/**
 * Contenido del tab "Conversaciones 2": muestra un AccordionList con conversaciones
 * agrupadas por canal con filtro por status
 */
export const ConversationsTab: FC<ConversationsTabProps> = ({ client }) => {
	const { t } = useTranslate();
	const [selectedStatus, setSelectedStatus] = useState<string>("all");

	const {
		chatSessions,
		isLoading,
		error,
		refetch,
		filterByStatus,
	} = useChatSessions(client.id ?? null, {
		autoFetch: true,
		// defaultStatus: ["awaiting_human"],
	});

	// Transformar chat sessions a items de accordion
	const conversationItems: ConversationAccordionItem[] = chatSessions.map(
		(session) => ({
			id: session.id,
			nameAssistant: session.nameAssistant,
			channelName: t(`channel_${session.channelName}`, session.channelName),
			totalMessages: session.totalMessages,
			status: session.status,
			lastMessage: session.lastMessage || t("no_messages", "Sin mensajes"),
			createdAt: session.createdAt,
		})
	);

	// Aplicar filtro cuando cambia el status
	const handleStatusChange = (keys: "all" | Set<string | number>) => {
		if (keys === "all") {
			setSelectedStatus("all");
			filterByStatus(undefined);
			return;
		}

		const selected = Array.from(keys)[0] as string;
		setSelectedStatus(selected);

		if (selected === "all") {
			filterByStatus(undefined);
		} else {
			filterByStatus([selected as ChatSessionStatus]);
		}
	};

	// Opciones de filtro de status
	const statusOptions = [
		{ key: "all", label: t("status_all", "Todos") },
		{ key: "active", label: t("status_active", "Activo") },
		{ key: "closed", label: t("status_closed", "Cerrado") },
		{ key: "expired", label: t("status_expired", "Expirado") },
		{
			key: "awaiting_human",
			label: t("status_awaiting_human", "Requiere atención"),
		},
	];

	const getStatusColor = (
		status: ChatSessionStatus
	): "success" | "warning" | "danger" | "default" => {
		switch (status) {
			case "active":
				return "success";
			case "awaiting_human":
				return "warning";
			case "expired":
				return "danger";
			case "closed":
			default:
				return "default";
		}
	};

	const getStatusLabel = (status: ChatSessionStatus): string => {
		const statusMap: Record<ChatSessionStatus, string> = {
			active: t("status_active", "Activo"),
			closed: t("status_closed", "Cerrado"),
			expired: t("status_expired", "Expirado"),
			awaiting_human: t("status_awaiting_human", "Requiere atención"),
		};
		return statusMap[status] || status;
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<P>
					{t(
						"conversations2_description",
						"Conversaciones agrupadas por canal con"
					)}{" "}
					{getClientFullName(client)}
				</P>
			</div>

			{/* Filtro por status */}
			<div className="w-full max-w-xs">
				<Select
					label={t("filter_by_status", "Filtrar por estado")}
					placeholder={t("select_status", "Selecciona un estado")}
					selectedKeys={[selectedStatus]}
					onSelectionChange={handleStatusChange}
					size="sm"
				>
					{statusOptions.map((option) => (
						<SelectItem key={option.key}>{option.label}</SelectItem>
					))}
				</Select>
			</div>

			{/* AccordionList */}
			<div className="flex flex-col gap-3">
				{isLoading ? (
					<LoadingState />
				) : error ? (
					<ErrorState
						errorKey="error_loading_conversations"
						defaultMessage="Error al cargar conversaciones"
						onRetry={refetch}
					/>
				) : conversationItems.length > 0 ? (
					<AccordionListComponent<ConversationAccordionItem>
						mode="accordion"
						items={conversationItems}
						sectionTitle={t(
							"conversations_by_channel",
							"Conversaciones por canal"
						)}
						sectionIcon="solar:chat-dots-outline"
						showCount
						accordionVariant="splitted"
						header={{
							getTitle: (item) =>{return t("created_by", "Creado por")+ ": " + item.nameAssistant},
							getSubtitle: (item) =>
								t("total_messages_count", `${item.totalMessages} mensajes`, {
									count: item.totalMessages,
								}),
							getMetadata: (item) => [
								{
									key: "status",
									label: getStatusLabel(item.status),
									color: getStatusColor(item.status),
									variant: "flat",
								},
								{
									key: "created_at",
									label: new Date(item.createdAt).toLocaleDateString("es", {
												year: "numeric",
												month: "short",
												day: "numeric",
											}),
									color: "default",
									variant: "flat",
								},
							],
						}}
						content={{
							render: (item) => (
								<div className="flex flex-col gap-3 p-2">
									{/* Fila superior: Creado por + Fecha */}
									<div className="flex items-center justify-between">
										<P className="text-sm text-default-500">
											{new Date(item.createdAt).toLocaleDateString("es", {
												year: "numeric",
												month: "short",
												day: "numeric",
											})}
										</P>
									</div>

									{/* Mensaje */}
									<P className="text-sm font-semibold text-default-600">
										{t("last_message", "Último mensaje")}:
									</P>
									<P className="text-sm text-default-700 line-clamp-3">
										{item.lastMessage}
									</P>

									{/* Canal */}
									<div>
										<Chip size="sm" variant="flat" color="primary">
											{item.channelName}
										</Chip>
									</div>
								</div>
							),
						}}
						emptyState={{
							icon: "solar:chat-dots-bold-duotone",
							title: t("no_conversations", "No hay conversaciones"),
							description: t(
								"no_conversations_description",
								"No se encontraron conversaciones para este cliente"
							),
						}}
					/>
				) : (
					<EmptyState
						icon="solar:chat-dots-bold-duotone"
						title="no_conversations_filtered"
						description="no_conversations_with_status"
					/>
				)}
			</div>
		</div>
	);
};
