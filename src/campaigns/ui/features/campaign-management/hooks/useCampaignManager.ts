import { useCallback, useState } from "react";
import type { ICampaign, ICreateCampaignInput } from "@campaigns/domain";
import { CampaignManagementDI } from "@campaigns/ui";

/**
 * Hook para gestionar operaciones de campañas
 * Actúa como adaptador entre la UI y la capa de aplicación
 */
export const useCampaignManager = () => {
	const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Cargar todas las campañas
	 */
	const loadCampaigns = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const result = await CampaignManagementDI.GetAllCampaigns().execute();
			if (result.isSuccess && result.value) {
				setCampaigns(result.value);
			} else if (result.error) {
				setError(result.error.message);
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Error al cargar campañas";
			setError(errorMessage);
			console.error("Error loading campaigns:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	/**
	 * Crear una nueva campaña
	 */
	const createCampaign = useCallback(
		async (input: ICreateCampaignInput): Promise<ICampaign> => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await CampaignManagementDI.CreateCampaign().execute(input);
				if (result.isSuccess && result.value) {
					setCampaigns((prev) => [...prev, result.value as ICampaign]);
					return result.value;
				}
				throw result.error || new Error("Error al crear campaña");
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Error al crear campaña";
				setError(errorMessage);
				console.error("Error creating campaign:", err);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	/**
	 * Enviar una campaña (TODO: Implementar SendCampaignUseCase if needed)
	 */
	const sendCampaign = useCallback(
		async (campaignId: string): Promise<void> => {
			setIsSending(true);
			setError(null);

			try {
				// Simulación por ahora ya que no hemos implementado el sendUseCase refactorizado
				await new Promise(resolve => setTimeout(resolve, 1000));
				
				// Actualizar el estado local de la campaña
				setCampaigns((prev) =>
					prev.map((c) =>
						c.id === campaignId
							? { ...c, sentAt: new Date(), updatedAt: new Date(), status: "sent" as any }
							: c
					)
				);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Error al enviar campaña";
				setError(errorMessage);
				console.error("Error sending campaign:", err);
				throw err;
			} finally {
				setIsSending(false);
			}
		},
		[]
	);

	return {
		// Data
		campaigns,

		// State
		isLoading,
		isSending,
		error,

		// Actions
		loadCampaigns,
		createCampaign,
		sendCampaign,
	};
};
