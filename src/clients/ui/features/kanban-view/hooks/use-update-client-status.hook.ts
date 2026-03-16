import { useAuraToast } from "@beweco/aurora-ui";
import { UpdateClientUseCase } from "@clients/application/update-client.usecase";
import type { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import { STATUS_CLIENT } from "@clients/domain/constants/status-client.constants";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import { ClientAdapter } from "@clients/infrastructure/adapters/client.adapter";
import { useTranslate } from "@tolgee/react";
import { useCallback, useMemo } from "react";

interface UseUpdateClientStatusResponse {
	updateClientStatus: (
		clientId: string,
		newStatus: EnumClientStatus
	) => Promise<IClient>;
}

/**
 * Hook especializado para actualizar únicamente el status de un cliente.
 * Optimizado para operaciones de drag and drop en el Kanban.
 */
export const useUpdateClientStatus = (): UseUpdateClientStatusResponse => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();

	const adapter = useMemo(() => new ClientAdapter(), []);
	const updateClientUseCase = useMemo(
		() => new UpdateClientUseCase(adapter),
		[adapter]
	);

	const updateClientStatus = useCallback(
		async (clientId: string, newStatus: EnumClientStatus): Promise<IClient> => {
			const statusConfig = STATUS_CLIENT[newStatus as keyof typeof STATUS_CLIENT];

			if (!statusConfig) {
				throw new Error(`Invalid status: ${newStatus}`);
			}

			try {
				const updated = await updateClientUseCase.execute(clientId, {
					status: {
						translationKey: statusConfig.value,
						color: statusConfig.color,
						value: statusConfig.value,
					},
				});

				showToast({
					title: t(
						"client_status_updated_success",
						"Estado del cliente actualizado"
					),
					color: "success",
				});

				return updated;
			} catch (error) {
				showToast({
					title: t(
						"client_status_updated_error",
						"Error al actualizar el estado del cliente"
					),
					color: "danger",
				});
				throw error;
			}
		},
		[updateClientUseCase, showToast, t]
	);

	return {
		updateClientStatus,
	};
};
