import { useAuraToast } from "@beweco/aurora-ui";
import { GetClientByIdUseCase } from "@clients/application/get-client-by-id.usecase";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import { ClientAdapter } from "@clients/infrastructure/adapters/client.adapter";
import { EnumErrorType } from "@shared/domain/enums";
import { configureErrorToastWithTranslation } from "@shared/utils";
import { useTranslate } from "@tolgee/react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useClientDataFetch } from "./use-client-data-fetch.hook";

interface UseClientByIdOptions {
	clientData?: IClient | null;
	preventFetch?: boolean;
}

interface UseClientByIdResponse {
	client: IClient | null;
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
}

/**
 * React hook that retrieves a specific client by ID using the application use case
 * Uses the generic useClientDataFetch hook for consistent behavior and race condition handling
 *
 * @param clientId - The ID of the client to fetch
 * @param options - Configuration options
 * @param options.clientData - Pre-existing client data to use instead of fetching
 * @param options.preventFetch - If true, prevents API call when clientData is provided
 */
export const useClientById = (
	clientId: string | null,
	options: UseClientByIdOptions = {}
): UseClientByIdResponse => {
	const { showToast } = useAuraToast();
	const { t } = useTranslate();
	const navigate = useNavigate();
	const { clientData, preventFetch = false } = options;

	const useCase = useMemo(() => {
		const adapter = new ClientAdapter();
		return new GetClientByIdUseCase(adapter);
	}, []);

	const fetchFunction = useCallback(
		async (id: string) => {
			try {
				return await useCase.execute(id);
			} catch (error) {
				// Show error toast
				showToast(
					configureErrorToastWithTranslation(
						EnumErrorType.Critical,
						t,
						"client_not_found",
						"client_fetch_error_description"
					)
				);

				// Navigate back on error
				navigate(-1);

				// Re-throw to be handled by the generic hook
				throw error;
			}
		},
		[useCase, showToast, t, navigate]
	);

	// If client data is provided and we want to prevent fetch, use it directly
	const shouldPreventFetch = preventFetch && clientData;

	const {
		data: client,
		isLoading,
		error,
		refetch,
	} = useClientDataFetch({
		clientId: shouldPreventFetch ? null : clientId,
		fetchFunction,
		initialData: clientData || (null as IClient | null),
		resetOnClientChange: true,
	});

	// Return the provided client data if we're preventing fetch
	const finalClient = shouldPreventFetch ? clientData : client;

	return {
		client: finalClient,
		isLoading: shouldPreventFetch ? false : isLoading,
		error,
		refetch,
	};
};
