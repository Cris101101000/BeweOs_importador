import { GrandFinalePhase } from "../enums/grand-finale-phase.enum";
import type { ISummarySlide } from "../interfaces/summary-slide.interface";

export const SUMMARY_SLIDES: ISummarySlide[] = [
	{
		id: GrandFinalePhase.ALWAYS_ON,
		icon: "🌙",
		title: "Linda nunca duerme",
		subtitle: "Tu asistente 24/7 en todos los canales",
		features: [
			"WhatsApp, Web e Instagram simultáneamente",
			"Respuestas instantáneas, incluso de madrugada",
			"Nunca pierdes una oportunidad de venta",
		],
		lindaSpeech: "Mientras tu descansas, yo sigo trabajando.",
		gradient: "from-primary-400 to-primary-600",
	},
	{
		id: GrandFinalePhase.SMART_CRM,
		icon: "📊",
		title: "Tu CRM inteligente",
		subtitle: "Organiza todo automáticamente",
		features: [
			"Tags inteligentes que se asignan solos",
			"Historial completo de cada conversación",
			"Segmentación perfecta para campañas",
		],
		lindaSpeech: "Yo organizo, tu solo vendes.",
		gradient: "from-primary-500 to-primary-700",
	},
	{
		id: GrandFinalePhase.AUTOMATION,
		icon: "🚀",
		title: "Automatización sin límites",
		subtitle: "Campañas que se ejecutan solas",
		features: [
			"Posts para Instagram cada semana",
			"Seguimientos automáticos a clientes",
			"Respuestas personalizadas en segundos",
		],
		lindaSpeech: "Configuras una vez, funciona para siempre.",
		gradient: "from-primary-300 to-primary-500",
	},
];

export const TOTAL_INTERNAL_SCREENS = 4;
export const MILESTONES = [1, 2, 3, 4];
