import { useCallback, useState } from "react";
import type {
	ITemplate,
	EnumCampaignContentType,
} from "@campaigns/domain";
import { TemplatesDI } from "@campaigns/ui";

/**
 * Hook para gestionar plantillas y configuraciones de campaña
 * Actúa como adaptador entre la UI y la capa de aplicación
 */
export const useCampaignTemplates = () => {
	const [templates, setTemplates] = useState<ITemplate[]>([]);
	const [whatsappCtaTypes, setWhatsappCtaTypes] = useState<any[]>(
		[]
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Cargar plantillas por tipo de contenido
	 */
	const loadTemplatesByContentType = useCallback(
		async (contentType: EnumCampaignContentType) => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await TemplatesDI.GetAllTemplates().execute(contentType);
				if (result.isSuccess && result.value) {
					setTemplates(result.value);
				} else if (result.error) {
					setError(result.error.message);
				}
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Error al cargar plantillas";
				setError(errorMessage);
				console.error("Error loading templates:", err);
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	/**
	 * Cargar tipos de CTA de WhatsApp (Simulado por ahora)
	 */
	const loadWhatsAppCtaTypes = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			// Simulación por ahora ya que no hemos implementado el WhatsApp feature completo
			setWhatsappCtaTypes([
				{ key: 'CALL_NOW', label: 'Llamar ahora', requiresPhone: true },
				{ key: 'VISIT_WEBSITE', label: 'Visitar sitio web', requiresPhone: false },
			]);
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Error al cargar tipos de CTA";
			setError(errorMessage);
			console.error("Error loading CTA types:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	/**
	 * Cargar todos los datos necesarios para crear una campaña
	 */
	const loadAllCampaignData = useCallback(
		async (contentType: EnumCampaignContentType) => {
			setIsLoading(true);
			setError(null);

			try {
				// Simulación de carga paralela
				const templatesRes = await TemplatesDI.GetAllTemplates().execute(contentType);
				
				if (templatesRes.isSuccess && templatesRes.value) {
					setTemplates(templatesRes.value);
				}
				
				// CTA Types simulados
				setWhatsappCtaTypes([
					{ key: 'CALL_NOW', label: 'Llamar ahora', requiresPhone: true },
					{ key: 'VISIT_WEBSITE', label: 'Visitar sitio web', requiresPhone: false },
				]);
				
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Error al cargar datos de campaña";
				setError(errorMessage);
				console.error("Error loading campaign data:", err);
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return {
		// Data
		templates,
		whatsappCtaTypes,

		// State
		isLoading,
		error,

		// Actions
		loadTemplatesByContentType,
		loadWhatsAppCtaTypes,
		loadAllCampaignData,
	};
};
