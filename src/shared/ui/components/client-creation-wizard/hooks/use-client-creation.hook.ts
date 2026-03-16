import { useAuraToast } from "@beweco/aurora-ui";
import { CreateClientUseCase } from "@clients/application/create-client.usecase";
import { STATUS_CLIENT } from "@clients/domain/constants/status-client.constants";
import type { EnumClientStatus } from "@clients/domain/enums/client-status.enum";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import type { IStatus } from "@clients/domain/interfaces/status.interface";
import { ClientAdapter } from "@clients/infrastructure/adapters/client.adapter";
import type { EnumErrorType } from "@shared/domain/enums/enum-error-type.enum";
import {
	configureErrorToastWithTranslation,
	configureSuccessToast,
} from "@shared/utils";
import { useTranslate } from "@tolgee/react";
import { useCallback, useState } from "react";
import type { IClientCreationFormData } from "../client-creation-wizard.types";

/**
 * Custom hook for handling client creation
 * Manages the creation process, loading states, and error handling
 */
export const useClientCreation = () => {
	const [isCreating, setIsCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { showToast } = useAuraToast();
	const { t } = useTranslate();

	/**
	 * Transform wizard form data to client domain model
	 */
	const transformFormDataToClient = useCallback(
		(formData: IClientCreationFormData): IClient => {
			return {
				firstName: formData.basicInfo.firstName,
				lastName: formData.basicInfo.lastName,
				email: formData.basicInfo.email,
				phones: [formData.basicInfo.phone], // Convert single phone to array
				status: STATUS_CLIENT[formData.status as EnumClientStatus] as IStatus,
				tags: formData.segment.tagsIA || [],
				createdChannel: formData.segment.creationChannel,
				birthdate: formData.segment.birthdate
					? String(formData.segment.birthdate)
					: undefined,
				gender: formData.segment.gender || undefined,
			};
		},
		[]
	);

	/**
	 * Create a new client using the use case
	 */
	const createClient = useCallback(
		async (formData: IClientCreationFormData): Promise<void> => {
			setIsCreating(true);
			setError(null);

			try {
				// Transform form data to domain model
				const clientData = transformFormDataToClient(formData);

				// Create use case instance with adapter
				const clientAdapter = new ClientAdapter();
				const createClientUseCase = new CreateClientUseCase(clientAdapter);

				// Execute creation
				await createClientUseCase.execute(clientData);

				// Show success toast
				showToast(
					configureSuccessToast(
						t("client_created_successfully", "Cliente creado exitosamente")
					)
				);
			} catch (error) {
				if (error instanceof Error) {
					showToast(
						configureErrorToastWithTranslation(
							error.message as EnumErrorType,
							t
						)
					);
				}
			} finally {
				setIsCreating(false);
			}
		},
		[transformFormDataToClient, showToast, t]
	);

	return {
		createClient,
		isCreating,
		error,
		clearError: useCallback(() => setError(null), []),
	};
};
