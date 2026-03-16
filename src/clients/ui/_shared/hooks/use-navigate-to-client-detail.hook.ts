import { useAuraToast, useNavigationLoading } from "@beweco/aurora-ui";
import { GetClientByIdUseCase } from "@clients/application/get-client-by-id.usecase";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import { ClientAdapter } from "@clients/infrastructure/adapters/client.adapter";
import { EnumErrorType } from "@shared/domain/enums";
import { configureErrorToastWithTranslation } from "@shared/utils";
import { useTranslate } from "@tolgee/react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface UseNavigateToClientDetailResponse {
	navigateToClientDetail: (
		clientId: string,
		fallbackClientData?: IClient
	) => Promise<void>;
}

/**
 * Hook para navegar de forma segura al detalle de un cliente
 * Valida que el cliente exista antes de navegar, sino muestra error y permanece en la vista actual
 */
export const useNavigateToClientDetail =
	(): UseNavigateToClientDetailResponse => {
		const navigate = useNavigate();
		const { t } = useTranslate();
		const { showToast } = useAuraToast();

		const { showNavigationLoading, hideNavigationLoading } =
			useNavigationLoading();

		const useCase = useMemo(() => {
			const adapter = new ClientAdapter();
			return new GetClientByIdUseCase(adapter);
		}, []);

		/**
		 * Navega al detalle del cliente después de validar que existe
		 * @param clientId - ID del cliente
		 * @param fallbackClientData - Datos del cliente como fallback (opcional)
		 */
		const navigateToClientDetail = useCallback(
			async (clientId: string, fallbackClientData?: IClient): Promise<void> => {
				if (!clientId) {
					showToast(
						configureErrorToastWithTranslation(
							"Warning" as EnumErrorType,
							t,
							t("invalid_client_id", "ID de cliente no válido")
						)
					);
					return;
				}

				showNavigationLoading();

				try {
					// Intentar obtener los datos frescos del cliente
					const clientData = await useCase.execute(clientId);

					// Si es exitoso, navegar con los datos frescos
					navigate(`/clients/details/${clientId}`, {
						state: { clientData },
					});
				} catch (error) {
					// Si falla, mostrar toast de error y permanecer en la vista actual
					const errorMessage =
						error instanceof Error ? error.message : "Error desconocido";

					showToast(
						configureErrorToastWithTranslation(
							EnumErrorType.Critical,
							t,
							"client_not_found",
							"client_fetch_error_description"
						)
					);

					// Opcionalmente, si tenemos datos de fallback y el error no es crítico,
					// podríamos navegar con esos datos
					if (fallbackClientData && errorMessage.includes("network")) {
						console.log("Using fallback data due to network error");
						navigate(`/clients/details/${clientId}`, {
							state: { clientData: fallbackClientData },
						});
					}
				} finally {
					hideNavigationLoading();
				}
			},
			[
				useCase,
				navigate,
				showToast,
				t,
				showNavigationLoading,
				hideNavigationLoading,
			]
		);

		return {
			navigateToClientDetail,
		};
	};
