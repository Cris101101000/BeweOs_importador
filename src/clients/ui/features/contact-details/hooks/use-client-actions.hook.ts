import { useAuraToast } from "@beweco/aurora-ui";
import { DeleteClientUseCase } from "@clients/application/delete-client.usecase";
import { UpdateClientUseCase } from "@clients/application/update-client.usecase";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import { ClientAdapter } from "@clients/infrastructure/adapters/client.adapter";
import type { EditContactFormData } from "../types/edit-contact-form-data";
import { convertDateValueToString } from "@shared/utils/aurora-date.utils";
import { useTranslate } from "@tolgee/react";
import { useCallback, useMemo, useState } from "react";

interface UseClientActionsResponse {
	updateClient: (
		clientId: string,
		data: EditContactFormData
	) => Promise<IClient>;
	deleteClient: (clientId: string) => Promise<void>;
	isDeletingClient: boolean;
}

/**
 * React hook that provides client update and delete actions with built-in error handling and toast notifications
 */
export const useClientActions = (): UseClientActionsResponse => {
	const { t } = useTranslate();
	const { showToast } = useAuraToast();
	const [isDeletingClient, setIsDeletingClient] = useState(false);

	const adapter = useMemo(() => new ClientAdapter(), []);
	const updateClientUseCase = useMemo(
		() => new UpdateClientUseCase(adapter),
		[adapter]
	);
	const deleteClientUseCase = useMemo(
		() => new DeleteClientUseCase(adapter),
		[adapter]
	);

	const updateClient = useCallback(
		async (clientId: string, data: EditContactFormData): Promise<IClient> => {
			try {
				const updated = await updateClientUseCase.execute(clientId, {
					firstName: data.firstName,
					lastName: data.lastName,
					formattedAddress: data.address || undefined,
					...(data.address
						? { address: { address: data.address } }
						: {}),
					email: data.email,
					phones: data.phones,
					status: {
						translationKey: data.status,
						color: "default",
						value: data.status,
					},
					...(data.birthdate
						? { birthdate: convertDateValueToString(data.birthdate) }
						: {}),
					...(data.gender ? { gender: data.gender } : {}),
					...(data.createdChannel
						? { createdChannel: data.createdChannel }
						: {}),
				});

				showToast({
					title: t(
						"digital_contact_updated_success",
						"Contacto actualizado con éxito"
					),
					color: "success",
				});

				return updated;
			} catch (error) {
				showToast({
					title: t(
						"digital_contact_updated_error",
						"Error al actualizar el contacto"
					),
					color: "danger",
				});
				throw error;
			}
		},
		[updateClientUseCase, showToast, t]
	);

	const deleteClient = useCallback(
		async (clientId: string): Promise<void> => {
			setIsDeletingClient(true);
			try {
				await deleteClientUseCase.execute(clientId);
				showToast({
					title: t("client_deleted_success", "Cliente eliminado con éxito"),
					color: "success",
				});
			} catch (error) {
				showToast({
					title: t("toast_error_generic", "Ha ocurrido un error"),
					color: "danger",
				});
				throw error;
			} finally {
				setIsDeletingClient(false);
			}
		},
		[deleteClientUseCase, showToast, t]
	);

	return {
		updateClient,
		deleteClient,
		isDeletingClient,
	};
};
