import { Button, Card, Chip, IconComponent, Spinner } from "@beweco/aurora-ui";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import { useManageTagsModal } from "@clients/ui/_shared/contexts/manage-tags-modal.context";
import type { IEntityAssignedTag } from "@smart-tags/domain/interfaces/tag-assignment.interface";
import { AssignmentSmartTagAdapter } from "@smart-tags/infrastructure/adapters/assignment-smart-tags.adapter";
import { type FC, useCallback, useEffect, useState } from "react";
import { useTranslate } from "@tolgee/react";

interface ClientTagsCardProps {
	client: IClient;
	/** Increment to force refetch tags (e.g. after modal save) */
	tagsRefreshKey?: number;
}

/**
 * ClientTagsCard – Card independiente para etiquetas del cliente.
 * Muestra todas las etiquetas asignadas y permite actualizarlas mediante el modal de gestión.
 */
export const ClientTagsCard: FC<ClientTagsCardProps> = ({
	client,
	tagsRefreshKey = 0,
}) => {
	const { t } = useTranslate();
	const { openModal } = useManageTagsModal();
	const [tags, setTags] = useState<IEntityAssignedTag[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const fetchTags = useCallback(async () => {
		if (!client.id) return;

		setIsLoading(true);
		try {
			const adapter = new AssignmentSmartTagAdapter();
			const assignedTags = await adapter.getAssignmentsByEntity(
				"CLIENT",
				client.id
			);
			setTags(assignedTags);
		} catch (error) {
			console.error("Error fetching client tags:", error);
			setTags([]);
		} finally {
			setIsLoading(false);
		}
	}, [client.id]);

	useEffect(() => {
		fetchTags();
	}, [fetchTags, tagsRefreshKey]);

	const handleEdit = useCallback(() => {
		openModal(client);
	}, [client, openModal]);

	return (
		<Card radius="sm" className="flex flex-col gap-4 p-5 w-full">
			<div className="flex flex-row items-start justify-between gap-2">
				<div>
					<h2 className="font-medium text-lg text-foreground">
						{t("clients_column_tags", "Etiquetas")}
					</h2>
					<p className="text-default-500 text-sm mt-0.5">
						{t(
							"client_tags_card_description",
							"Gestiona las etiquetas asignadas a este cliente."
						)}
					</p>
				</div>
				<Button
					variant="light"
					color="primary"
					size="sm"
					onPress={handleEdit}
					startContent={
						<IconComponent icon="solar:pen-new-square-outline" size="sm" />
					}
				>
					{t("edit_tags", "Editar etiquetas")}
				</Button>
			</div>

			{isLoading ? (
				<div className="flex items-center gap-2 py-2">
					<Spinner size="sm" />
					<span className="text-sm text-default-500">
						{t("loading", "Cargando...")}
					</span>
				</div>
			) : tags.length === 0 ? (
				<p className="text-sm text-default-400">
					{t("client_tags_empty", "Sin etiquetas asignadas.")}
				</p>
			) : (
				<div className="flex flex-wrap gap-1.5">
					{tags.map((tag) => (
						<Chip
							key={tag.assignmentId ?? tag.tagId ?? tag.title}
							size="sm"
							variant="flat"
							radius="sm"
							color="primary"
							className="border-none"
						>
							{tag.title}
						</Chip>
					))}
				</div>
			)}
		</Card>
	);
};
