import { PainPointId } from "../enums/pain-point.enum";
import type { IPainPoint } from "../interfaces/pain-point.interface";

export const PAIN_POINTS: IPainPoint[] = [
	{
		id: PainPointId.TIEMPO_RESPUESTA,
		emoji: "⏰",
		title: "Responder rápido a clientes",
		description: "Pierdo ventas porque no puedo responder a todos al instante",
	},
	{
		id: PainPointId.ORGANIZACION_CONTACTOS,
		emoji: "📋",
		title: "Organizar mis contactos",
		description: "Tengo clientes desperdigados en WhatsApp, Instagram y otras apps",
	},
	{
		id: PainPointId.SEGUIMIENTO_MANUAL,
		emoji: "🔄",
		title: "Dar seguimiento constante",
		description: "Se me olvida hacer seguimiento y pierdo oportunidades",
	},
	{
		id: PainPointId.CONTENIDO_REDES,
		emoji: "📱",
		title: "Crear contenido para redes",
		description: "No tengo tiempo para mantener mis redes activas",
	},
	{
		id: PainPointId.MENSAJES_MASIVOS,
		emoji: "💬",
		title: "Enviar campañas masivas",
		description: "Hacerlo uno por uno toma demasiado tiempo",
	},
];
