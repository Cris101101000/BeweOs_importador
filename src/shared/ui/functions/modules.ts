/* Iconos para mostrar dependiendo el modulo */

// Función para obtener el nombre del icono del módulo
export const getModuleIconByModuleId = (moduleName: string) => {
	const name = moduleName.toLowerCase().replace(/-/g, "_");
	const normalizedName = name.toLowerCase().replace(/[-\s]/g, "_");
	return moduleIcons[normalizedName] || "solar:chart-outline";
};

export const moduleIcons: Record<string, string> = {
	dashboard: "solar:chart-outline",
	clients: "solar:users-group-rounded-outline",
	catalog: "solar:box-outline",
	integrations: "solar:link-minimalistic-2-outline",
	pricing: "solar:dollar-minimalistic-outline",
	chatbot: "solar:dialog-2-outline",
	campaigns: "solar:chat-round-dots-outline",
	// biome-ignore lint/style/useNamingConvention: Module names come from backend with underscores
	smart_comms: "mage:stars-a",
	academy: "solar:square-academic-cap-outline",
	// biome-ignore lint/style/useNamingConvention: Module names come from backend with underscores
	catalog_services: "solar:box-outline",
	// biome-ignore lint/style/useNamingConvention: Module names come from backend with underscores
	catalog_products: "solar:box-outline",
};
