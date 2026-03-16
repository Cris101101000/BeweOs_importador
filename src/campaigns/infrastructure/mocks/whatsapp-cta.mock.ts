import type { WhatsAppCtaConfig } from "@campaigns/domain";

/**
 * Mock de tipos de Call-To-Action para WhatsApp
 */
export const MOCK_WHATSAPP_CTA_TYPES: WhatsAppCtaConfig[] = [
	{ key: "CALL_NOW", label: "Llamar ahora", requiresPhone: true },
	{ key: "VISIT_WEBSITE", label: "Visitar sitio web", requiresPhone: false },
	{ key: "LEARN_MORE", label: "Más información", requiresPhone: false },
	{ key: "SHOP_NOW", label: "Comprar ahora", requiresPhone: false },
	{ key: "BOOK_NOW", label: "Reservar ahora", requiresPhone: false },
	{ key: "GET_QUOTE", label: "Solicitar presupuesto", requiresPhone: false },
	{ key: "SIGN_UP", label: "Registrarse", requiresPhone: false },
	{ key: "CONTACT_US", label: "Contáctanos", requiresPhone: false },
];
