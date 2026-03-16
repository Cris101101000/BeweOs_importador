import type {
	IPricingConfig,
	IPricingFrequency,
	IPricingPlan,
} from "../../domain/interfaces/pricing.interface";
import { FrequencyEnum } from "../../domain/interfaces/pricing.interface";

export const frequencies: IPricingFrequency[] = [
	{
		key: FrequencyEnum.Monthly,
		label: "Mensual",
		priceSuffix: "mes",
	},
	{
		key: FrequencyEnum.Yearly,
		label: "Anual",
		priceSuffix: "año",
		discount: "Ahorra 25%",
	},
];

export const pricingPlans: IPricingPlan[] = [
	{
		id: "free",
		key: "free",
		title: "Free",
		description: "Perfecto para comenzar",
		price: "Gratis",
		priceSuffix: "siempre",
		features: [
			"Usuarios ilimitados",
			"Gestión de Clientes Inteligente",
			"Integración con WhatsApp",
			"Chatbot Web (50 conversaciones)",
			"Reportes Mensuales Inteligentes",
		],
		buttonText: "Comenzar Gratis",
		buttonVariant: "solid",
		href: "/register?plan=free",
		tag: "Más Popular",
		highlighted: true,
	},
	{
		id: "basic",
		key: "basic",
		title: "Básico",
		description: "Para negocios en crecimiento",
		price: {
			monthly: "26€",
			yearly: "20€",
		},
		priceSuffix: "mes",
		features: [
			"Todo del plan Free",
			"Chatbot Web y WhatsApp (100 conversaciones)",
			"100 notificaciones WhatsApp",
			"Soporte humano",
			"Reportes Semanales inteligentes",
		],
		buttonText: "Comenzar Prueba",
		buttonVariant: "bordered",
		href: "/register?plan=basic",
	},
	{
		id: "pro",
		key: "pro",
		title: "Pro",
		description: "Para empresas establecidas",
		price: {
			monthly: "60€",
			yearly: "45€",
		},
		priceSuffix: "mes",
		features: [
			"Todo del plan Básico",
			"Chatbot Web y WhatsApp (500 conversaciones)",
			"500 notificaciones WhatsApp",
			"Soporte prioritario",
		],
		buttonText: "Comenzar Prueba",
		buttonVariant: "solid",
		href: "/register?plan=pro",
		tag: "Recomendado",
		mostPopular: true,
	},
	{
		id: "enterprise",
		key: "enterprise",
		title: "Enterprise",
		description: "Soluciones a medida",
		price: "Personalizado",
		features: [
			"Todo ilimitado",
			"Integraciones personalizadas",
			"Soporte dedicado 24/7",
			"Onboarding personalizado",
			"SLA garantizado",
		],
		buttonText: "Contactar Ventas",
		buttonVariant: "bordered",
		href: "/contact-sales",
		tag: "Enterprise",
	},
];

export const addOns = [
	{
		id: "conversations",
		title: "Conversaciones Linda",
		description: "Amplía tu capacidad según tus necesidades exactas",
		baseQuantity: 50,
		maxQuantity: 400,
		recurringPrice: "4€/mes",
		flexiblePrice: "5€",
		unit: "conversaciones",
	},
	{
		id: "notifications",
		title: "Notificaciones WhatsApp",
		description: "Amplía tu capacidad según tus necesidades exactas",
		baseQuantity: 50,
		maxQuantity: 400,
		recurringPrice: "4€/mes",
		flexiblePrice: "5€",
		unit: "notificaciones",
	},
];

export const pricingConfig: IPricingConfig = {
	title: "Planes y Precios",
	subtitle: "Elige el plan perfecto para tu negocio",
	description:
		"Descubre características premium y potencia tu empresa con herramientas avanzadas",
	frequencies,
	plans: pricingPlans,
	footerText: "¿Eres desarrollador de código abierto?",
	footerLink: {
		text: "Obtén un descuento",
		href: "/open-source-discount",
	},
};
