import type { INotificationHistory } from "../../domain/interfaces/notification-history.interface";
import { NotificationHistoryStatus, NotificationChannel } from "../../domain/interfaces/notification-history.interface";

export const mockNotificationHistory: INotificationHistory[] = [
	{
		id: "1",
		type: "Recordatorio de cita",
		title: "Recordatorio: Cita mañana a las 10:00",
		recipient: "Juan Pérez",
		status: NotificationHistoryStatus.DELIVERED,
		sentAt: "2024-01-15T09:00:00Z",
		channel: NotificationChannel.WHATSAPP,
		content: "Hola Juan, te recordamos que tienes una cita mañana a las 10:00 AM. ¡Te esperamos!",
		isAiGenerated: true
	},
	{
		id: "2",
		type: "Confirmación de cita",
		title: "Confirmación: Nueva cita agendada",
		recipient: "María García",
		status: NotificationHistoryStatus.SENT,
		sentAt: "2024-01-14T16:30:00Z",
		channel: NotificationChannel.EMAIL,
		content: "Tu cita ha sido confirmada para el 16 de enero a las 14:00.",
		isAiGenerated: false
	},
	{
		id: "3",
		type: "Pregunta pendiente",
		title: "Nueva pregunta de cliente",
		recipient: "Admin",
		status: NotificationHistoryStatus.DELIVERED,
		sentAt: "2024-01-14T11:15:00Z",
		channel: NotificationChannel.PUSH,
		content: "El cliente Carlos López ha hecho una pregunta que requiere respuesta.",
		isAiGenerated: false
	},
	{
		id: "4",
		type: "Cancelación de cita",
		title: "Cita cancelada por el cliente",
		recipient: "Ana Martínez",
		status: NotificationHistoryStatus.FAILED,
		sentAt: "2024-01-13T14:20:00Z",
		channel: NotificationChannel.SMS,
		content: "Tu cita del 15 de enero ha sido cancelada.",
		errorMessage: "Número de teléfono no válido",
		isAiGenerated: true
	},
	{
		id: "5",
		type: "Recordatorio de cita",
		title: "Recordatorio: Cita en 1 hora",
		recipient: "Pedro Rodríguez",
		status: NotificationHistoryStatus.PENDING,
		sentAt: "2024-01-13T13:00:00Z",
		channel: NotificationChannel.WHATSAPP,
		content: "Hola Pedro, te recordamos que tienes una cita en 1 hora.",
		isAiGenerated: true
	},
	{
		id: "6",
		type: "Bienvenida",
		title: "Bienvenido a nuestro servicio",
		recipient: "Laura Sánchez",
		status: NotificationHistoryStatus.DELIVERED,
		sentAt: "2024-01-12T10:45:00Z",
		channel: NotificationChannel.EMAIL,
		content: "¡Bienvenida Laura! Gracias por confiar en nosotros.",
		isAiGenerated: true
	},
	{
		id: "7",
		type: "Promoción especial",
		title: "Oferta especial para ti",
		recipient: "Roberto Torres",
		status: NotificationHistoryStatus.SENT,
		sentAt: "2024-01-11T15:30:00Z",
		channel: NotificationChannel.WHATSAPP,
		content: "¡Aprovecha nuestra promoción especial del 20% de descuento!",
		isAiGenerated: true
	},
	{
		id: "8",
		type: "Encuesta de satisfacción",
		title: "¿Cómo fue tu experiencia?",
		recipient: "Carmen López",
		status: NotificationHistoryStatus.DELIVERED,
		sentAt: "2024-01-10T17:00:00Z",
		channel: NotificationChannel.EMAIL,
		content: "Nos gustaría conocer tu opinión sobre nuestro servicio.",
		isAiGenerated: false
	}
];
