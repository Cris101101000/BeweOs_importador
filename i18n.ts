import { FormatIcu } from "@tolgee/format-icu";
import { DevTools, Tolgee } from "@tolgee/react";

import esCatalog from "./src/locales/es/catalog.json";
import esClients from "./src/locales/es/clients.json";
// Importar archivos JSON directamente
import esCommon from "./src/locales/es/common.json";
import esDashboard from "./src/locales/es/dashboard.json";
import esIntegrations from "./src/locales/es/integrations.json";
import esLindaConfiguration from "./src/locales/es/linda-configuration.json";
import esMenu from "./src/locales/es/menu.json";
import esNotifications from "./src/locales/es/notifications.json";
import esOnboarding from "./src/locales/es/onboarding.json";
import esPricing from "./src/locales/es/pricing.json";
import esSettings from "./src/locales/es/settings.json";
import esSmartTags from "./src/locales/es/smart-tags.json";

import enCatalog from "./src/locales/en/catalog.json";
import enClients from "./src/locales/en/clients.json";
import enCommon from "./src/locales/en/common.json";
import enDashboard from "./src/locales/en/dashboard.json";
import enIntegrations from "./src/locales/en/integrations.json";
import enLindaConfiguration from "./src/locales/en/linda-configuration.json";
import enMenu from "./src/locales/en/menu.json";
import enNotifications from "./src/locales/en/notifications.json";
import enOnboarding from "./src/locales/en/onboarding.json";
import enPricing from "./src/locales/en/pricing.json";
import enSettings from "./src/locales/en/settings.json";
import enSmartTags from "./src/locales/en/smart-tags.json";

// Combinar traducciones
const esTranslations = {
	...esCommon,
	...esSettings,
	...esMenu,
	...esCatalog,
	...esDashboard,
	...esIntegrations,
	...esPricing,
	...esClients,
	...esSmartTags,
	...esLindaConfiguration,
	...esNotifications,
	...esOnboarding,
};
const enTranslations = {
	...enCommon,
	...enSettings,
	...enMenu,
	...enCatalog,
	...enDashboard,
	...enIntegrations,
	...enPricing,
	...enClients,
	...enSmartTags,
	...enLindaConfiguration,
	...enNotifications,
	...enOnboarding,
};

// Función para detectar idioma del navegador
const getBrowserLanguage = (): string => {
	const browserLang = navigator.language || navigator.languages?.[0] || "en";
	const langCode = browserLang.split("-")[0]; // Obtener solo el código del idioma (ej: 'es' de 'es-ES')

	// Lista de idiomas soportados
	const supportedLanguages = ["es", "en"];

	// Si el idioma del navegador está soportado, usarlo; si no, usar inglés por defecto
	return supportedLanguages.includes(langCode) ? langCode : "en";
};

// Configuración completa con variables de entorno
export const tolgee = Tolgee()
	.use(DevTools())
	.use(FormatIcu())
	.init({
		language: getBrowserLanguage(),
		apiUrl: process.env.REACT_APP_TOLGEE_API_URL,
		apiKey: process.env.REACT_APP_TOLGEE_API_KEY,
		projectId: Number(process.env.REACT_APP_TOLGEE_PROJECT_ID),
		staticData: {
			es: esTranslations,
			en: enTranslations,
		},
		fallbackLanguage: "en",
	});
