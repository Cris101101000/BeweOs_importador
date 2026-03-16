import type { ClientStatus } from "@campaigns/domain";

/**
 * Mock de estados de clientes para segmentación
 */
export const MOCK_CLIENT_STATUSES: ClientStatus[] = [
	{
		value: "client",
		label: "Cliente",
		color: "bg-green-100 text-green-800 border-green-300",
		count: 156,
	},
	{
		value: "prospect",
		label: "Prospecto",
		color: "bg-purple-100 text-purple-800 border-purple-300",
		count: 98,
	},
	{
		value: "lead",
		label: "Lead",
		color: "bg-blue-100 text-blue-800 border-blue-300",
		count: 54,
	},
	{
		value: "inactive",
		label: "Inactivo",
		color: "bg-red-100 text-red-800 border-red-300",
		count: 16,
	},
];

/**
 * Mock de estados para modales (formato simplificado)
 */
export const MOCK_CLIENT_STATUSES_SIMPLE: string[] = [
	"Activo",
	"Inactivo",
	"Potencial",
	"VIP",
	"Nuevo",
];
