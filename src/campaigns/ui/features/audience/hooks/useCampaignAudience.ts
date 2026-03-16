import { useCallback, useState } from "react";
import type {
	IAudienceFilter,
	IAudienceSegment,
	IClientStatus,
	ISavedView,
	ITag,
} from "@campaigns/domain";
import { AudienceDI } from "@campaigns/ui";

/**
 * Hook para gestionar datos de audiencia y segmentación
 * Actúa como adaptador entre la UI y la capa de aplicación
 */
export const useCampaignAudience = () => {
	const [tags, setTags] = useState<ITag[]>([]);
	const [statuses, setStatuses] = useState<IClientStatus[]>([]);
	const [segments, setSegments] = useState<IAudienceSegment[]>([]);
	const [channels, setChannels] = useState<string[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
	const [savedViews, setSavedViews] = useState<ISavedView[]>([]);
	const [totalClientsCount, setTotalClientsCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Cargar todos los datos de audiencia
	 */
	const loadAudienceData = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const audienceData = AudienceDI.GetAudienceData();
			
			const [
				tagsRes,
				statusesRes,
				segmentsRes,
				channelsRes,
				categoriesRes,
				savedViewsRes,
				totalClientsRes,
			] = await Promise.all([
				audienceData.getTags(),
				audienceData.getClientStatuses(),
				audienceData.getIntelligentSegments(),
				audienceData.getCreationChannels(),
				audienceData.getClientCategories(),
				audienceData.getSavedViews(),
				audienceData.getTotalClientsCount(),
			]);

			if (tagsRes.isSuccess && tagsRes.value) setTags(tagsRes.value);
			if (statusesRes.isSuccess && statusesRes.value) setStatuses(statusesRes.value);
			if (segmentsRes.isSuccess && segmentsRes.value) setSegments(segmentsRes.value);
			if (channelsRes.isSuccess && channelsRes.value) setChannels(channelsRes.value);
			if (categoriesRes.isSuccess && categoriesRes.value) setCategories(categoriesRes.value);
			if (savedViewsRes.isSuccess && savedViewsRes.value) setSavedViews(savedViewsRes.value);
			if (totalClientsRes.isSuccess && totalClientsRes.value !== undefined) setTotalClientsCount(totalClientsRes.value);
			
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Error al cargar datos de audiencia";
			setError(errorMessage);
			console.error("Error loading audience data:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	/**
	 * Calcular tamaño de audiencia según filtros
	 */
	const calculateAudienceSize = useCallback(
		async (filter: IAudienceFilter): Promise<number> => {
			try {
				const result = await AudienceDI.CalculateAudienceSize().execute(filter);
				if (result.isSuccess && result.value !== undefined) {
					return result.value;
				}
				return 0;
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Error al calcular audiencia";
				setError(errorMessage);
				console.error("Error calculating audience size:", err);
				return 0;
			}
		},
		[]
	);

	/**
	 * Obtener tags adicionales si son necesarios (para campañas propuestas)
	 */
	const getTagsWithAdditional = useCallback(
		(requiredTags?: string[]): ITag[] => {
			if (!requiredTags || requiredTags.length === 0) {
				return tags;
			}

			const existingTagValues = new Set(tags.map((t) => t.value));
			const additionalTags = requiredTags
				.filter((tag) => !existingTagValues.has(tag))
				.map((tag) => ({
					value: tag,
					label: tag,
					color: "bg-purple-100 text-purple-800 border-purple-300",
					count: 0,
				}));

			return [...tags, ...additionalTags];
		},
		[tags]
	);

	return {
		// Data
		tags,
		statuses,
		segments,
		channels,
		categories,
		savedViews,
		totalClientsCount,

		// State
		isLoading,
		error,

		// Actions
		loadAudienceData,
		calculateAudienceSize,
		getTagsWithAdditional,
	};
};
