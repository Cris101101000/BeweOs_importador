import type { AudienceSegment } from "@campaigns/domain";

/**
 * Mock de segmentos inteligentes pre-configurados
 */
export const MOCK_INTELLIGENT_SEGMENTS: AudienceSegment[] = [
	{
		id: "segment-1",
		name: "Clientes Activos Premium",
		description: "Clientes con alta actividad y compras recientes",
		estimatedReach: 1250,
		expectedVisibility: 85,
		criteria: {
			statuses: ["client", "vip"],
			tags: ["tag-vip", "tag-high-value"],
		},
	},
	{
		id: "segment-2",
		name: "Nuevos Clientes Potenciales",
		description: "Clientes registrados en los últimos 30 días",
		estimatedReach: 890,
		expectedVisibility: 92,
		criteria: {
			statuses: ["prospect", "lead"],
			tags: ["tag-new"],
		},
	},
	{
		id: "segment-3",
		name: "Clientes Inactivos",
		description: "Clientes sin actividad en los últimos 60 días",
		estimatedReach: 2100,
		expectedVisibility: 65,
		criteria: {
			statuses: ["inactive"],
			excludeTags: ["tag-vip"],
		},
	},
	{
		id: "segment-4",
		name: "Clientes Frecuentes",
		description: "Clientes con compras recurrentes en el último mes",
		estimatedReach: 670,
		expectedVisibility: 88,
		criteria: {
			statuses: ["client"],
			tags: ["tag-returning", "Comprador Frecuente"],
		},
	},
	{
		id: "segment-5",
		name: "Prospectos Interesados",
		description: "Prospectos con alto nivel de interacción",
		estimatedReach: 1340,
		expectedVisibility: 78,
		criteria: {
			statuses: ["prospect"],
			tags: ["tag-interested"],
		},
	},
];
