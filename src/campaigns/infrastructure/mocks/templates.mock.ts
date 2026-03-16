import type { ITemplate } from "@campaigns/domain";
import { EnumCampaignContentType } from "@campaigns/domain";

/**
 * Mock de plantillas de campañas
 */
export const MOCK_CAMPAIGN_TEMPLATES: ITemplate[] = [
	{
		id: "temp-1",
		name: "Bienvenida a Nuevos Clientes",
		description:
			"Mensaje de bienvenida personalizado para nuevos clientes con información de contacto y próximos pasos",
		contentType: EnumCampaignContentType.WHATSAPP,
		content:
			"¡Hola {{nombre}}! 👋\n\nTe damos la bienvenida a nuestra familia. Estamos emocionados de tenerte con nosotros.\n\n¿En qué podemos ayudarte hoy?",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=400&h=400&fit=crop",
		isDefault: false,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
	},
	{
		id: "temp-2",
		name: "Recordatorio de Cita",
		description:
			"Recordatorio automático de cita 24 horas antes con opción de confirmación o reagendamiento",
		contentType: EnumCampaignContentType.WHATSAPP,
		content:
			"Hola {{nombre}}, 📅\n\nTe recordamos tu cita para mañana a las {{hora}}.\n\n¿Confirmas tu asistencia? Responde SÍ para confirmar o NO para reagendar.",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400&h=400&fit=crop",
		isDefault: false,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
	},
	{
		id: "temp-3",
		name: "Seguimiento Post-Compra",
		description:
			"Mensaje de seguimiento después de la compra para solicitar feedback y ofrecer soporte",
		contentType: EnumCampaignContentType.WHATSAPP,
		content:
			"¡Hola {{nombre}}! 😊\n\nEsperamos que estés disfrutando de tu compra. ¿Cómo ha sido tu experiencia?\n\nCuéntanos, tu opinión es muy importante para nosotros.",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=400&fit=crop",
		isDefault: false,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
	},
	{
		id: "temp-4",
		name: "Promoción Especial",
		description: "Plantilla para anunciar promociones y ofertas limitadas",
		contentType: EnumCampaignContentType.WHATSAPP,
		content:
			"🎉 ¡OFERTA ESPECIAL! 🎉\n\nHola {{nombre}}, tenemos una promoción exclusiva para ti.\n\n{{descripcion_promocion}}\n\n¡No te lo pierdas!",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=400&fit=crop",
		isDefault: false,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
	},
	{
		id: "temp-5",
		name: "Newsletter Informativa",
		description:
			"Plantilla para enviar noticias y actualizaciones a tus clientes",
		contentType: EnumCampaignContentType.EMAIL,
		content:
			"📰 Novedades de {{nombre_empresa}}\n\nHola {{nombre}},\n\n{{contenido_newsletter}}\n\n¡Gracias por ser parte de nuestra comunidad!",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop",
		isDefault: false,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
	},
	{
		id: "temp-6",
		name: "Bienvenida Email",
		description: "Email de bienvenida profesional para nuevos suscriptores",
		contentType: EnumCampaignContentType.EMAIL,
		content:
			"Hola {{nombre}},\n\n¡Bienvenido/a a nuestra comunidad!\n\nEstamos muy felices de tenerte con nosotros. A partir de ahora, recibirás las últimas novedades, ofertas exclusivas y contenido de valor.\n\n¿Tienes alguna pregunta? No dudes en contactarnos.\n\n¡Saludos!",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=400&fit=crop",
		isDefault: false,
		createdAt: new Date("2024-01-01"),
		updatedAt: new Date("2024-01-01"),
	},
];
