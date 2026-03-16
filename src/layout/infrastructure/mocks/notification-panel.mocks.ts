import { type INotification } from "src/shared/domain/interfaces/notification.interface";

export const mockNotificationPanel: INotification[] = [
	{
		id: "1",
		title: "Aviso importante: Activación pendiente",
		description: "Tu cuenta requiere activación inmediata para evitar la suspensión del servicio",
		type: "urgent",
		read: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 5),
		href: "/settings",
	},
	{
		id: "2",
		title: "Campaña fallida",
		description: "Tu campaña 'Promoción de verano' no pudo ser enviada debido a un error",
		type: "urgent",
		read: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 30),
		// Sin href - solo informativa
	},
	{
		id: "3",
		title: "Recordatorio de configuración",
		description: "Completa la información de tu negocio para mejorar tu perfil",
		type: "high",
		read: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 60),
		href: "/settings",
	},
	{
		id: "4",
		title: "Notificación de laguna detectada",
		description: "Se ha detectado información faltante en la configuración de Linda",
		type: "urgent",
		read: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
		// Sin href - solo informativa
	},
	{
		id: "5",
		title: "No se ha subido el catálogo",
		description: "Añade productos a tu catálogo para activar las campañas automáticas",
		type: "urgent",
		read: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
		href: "/catalog/products",
	},
	{
		id: "6",
		title: "Notificación de un nuevo lead",
		description: "Tienes un nuevo prospecto interesado en tus servicios",
		type: "low",
		read: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
		// Sin href - solo informativa
	},
	{
		id: "7",
		title: "Linda propone contenido",
		description: "Linda ha generado nuevo contenido para tus redes sociales",
		type: "normal",
		read: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
		href: "/social-networks",
	},
	{
		id: "8",
		title: "Tips post-onboarding",
		description: "Aprende cómo aprovechar al máximo las funcionalidades de BeweOS",
		type: "normal",
		read: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
		// Sin href - solo informativa
	},
	{
		id: "9",
		title: "Recordatorio: aún no hay contactos creados",
		description: "Crea tu primer contacto para empezar a gestionar tus clientes",
		type: "high",
		read: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
		href: "/contacts",
	},
	{
		id: "10",
		title: "Descubrimiento de insights",
		description: "Hemos identificado patrones interesantes en tu negocio",
		type: "normal",
		read: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
		// Sin href - solo informativa
	},
	{
		id: "11",
		title: "Última oportunidad",
		description: "Tu período de prueba finaliza hoy. Activa tu suscripción ahora",
		type: "urgent",
		read: false,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
		href: "/settings",
	},
	{
		id: "12",
		title: "Sugerencia de prueba de notificación",
		description: "Te recomendamos probar el sistema de notificaciones automáticas",
		type: "normal",
		read: true,
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
		// Sin href - solo informativa
	},
];
