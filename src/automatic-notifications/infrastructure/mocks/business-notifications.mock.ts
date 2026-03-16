import type { IBusinessNotification } from '../../domain/interfaces/business-notification.interface';
import { NotificationCategory } from '../../domain/interfaces/business-notification.interface';

export const mockBusinessNotifications: IBusinessNotification[] = [
	{
		id: 'pending-client-question',
		title: 'Pregunta pendiente de respuesta',
		description: 'Avisa cuando un cliente tiene una pregunta sin responder que requiere tu atención',
		icon: 'solar:question-circle-bold',
		isEnabled: true,
		category: NotificationCategory.SMB,
	},
	{
		id: 'direct-contact-request',
		title: 'Petición de contacto directo',
		description: 'Notificación cuando un cliente solicita comunicación directa contigo',
		icon: 'solar:phone-calling-rounded-bold',
		isEnabled: true,
		category: NotificationCategory.SMB,
	},
	{
		id: 'linda-monthly-report',
		title: 'Nuevo informe mensual de Linda',
		description: 'Aviso cuando esté disponible el informe mensual con estadísticas y métricas de Linda',
		icon: 'solar:document-text-bold',
		isEnabled: true,
		category: NotificationCategory.SMB,
	},
	{
		id: 'linda-knowledge-gap',
		title: 'Laguna de conocimiento pendiente',
		description: 'Avisa cuando Linda detecta una pregunta recurrente de clientes que requiere configuración de conocimiento en el sistema para responder correctamente',
		icon: 'solar:lightbulb-minimalistic-bold',
		isEnabled: true,
		category: NotificationCategory.SMB,
	},
	{
		id: 'campaign-activation-proposals',
		title: 'Propuestas de activación de campañas',
		description: 'Sugerencias inteligentes para activar campañas basadas en el comportamiento de tus clientes',
		icon: 'solar:rocket-2-bold',
		isEnabled: true,
		category: NotificationCategory.SMB,
	},
	{
		id: 'new-client-registration',
		title: 'Nuevos clientes registrados',
		description: 'Notificación cuando se registre un nuevo cliente en tu sistema',
		icon: 'solar:users-group-two-rounded-bold',
		isEnabled: true,
		category: NotificationCategory.SMB,
	},
];
