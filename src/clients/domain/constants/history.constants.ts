import {
	CommunicationStatus,
	CommunicationType,
} from "../interfaces/communication.interface";

/**
 * Configuration constants for client history component
 */
export const HISTORY_CONFIG = {
	tabs: {
		communications: "communications",
		communications2: "communications2",
		notes: "notes",
	},
	icons: {
		communicationsEmpty: "solar:chat-round-dots-outline",
		notesEmpty: "solar:document-outline",
		error: "solar:danger-circle-outline",
		view: "solar:eye-outline",
		edit: "solar:pen-outline",
		delete: "solar:trash-bin-minimalistic-outline",
	},
	animationDelays: {
		deleteSimulation: 1500,
	},
} as const;

/**
 * Communication type translation keys and labels mapping
 */
export const COMMUNICATION_TYPE_CONFIG = {
	[CommunicationType.Email]: {
		translationKey: "communication_type_email",
		defaultLabel: "Correo",
	},
	[CommunicationType.Call]: {
		translationKey: "communication_type_call",
		defaultLabel: "Llamada",
	},
	[CommunicationType.Whatsapp]: {
		translationKey: "communication_type_whatsapp",
		defaultLabel: "WhatsApp",
	},
	[CommunicationType.InPerson]: {
		translationKey: "communication_type_in_person",
		defaultLabel: "Presencial",
	},
	[CommunicationType.Message]: {
		translationKey: "communication_type_message",
		defaultLabel: "Mensaje",
	},
	[CommunicationType.Notification]: {
		translationKey: "communication_type_notification",
		defaultLabel: "Notificación",
	},
	[CommunicationType.Sms]: {
		translationKey: "communication_type_sms",
		defaultLabel: "SMS",
	},
} as const;

/**
 * Communication status translation keys, labels and colors mapping
 */
export const COMMUNICATION_STATUS_CONFIG = {
	[CommunicationStatus.Read]: {
		translationKey: "communication_status_read",
		defaultLabel: "Leído",
		color: "success" as const,
	},
	[CommunicationStatus.Answered]: {
		translationKey: "communication_status_answered",
		defaultLabel: "Contestado",
		color: "success" as const,
	},
	[CommunicationStatus.Pending]: {
		translationKey: "communication_status_pending",
		defaultLabel: "Pendiente",
		color: "orange" as const,
	},
	[CommunicationStatus.Sent]: {
		translationKey: "communication_status_sent",
		defaultLabel: "Enviado",
		color: "success" as const,
	},
	[CommunicationStatus.Delivered]: {
		translationKey: "communication_status_delivered",
		defaultLabel: "Entregado",
		color: "success" as const,
	},
	[CommunicationStatus.Failed]: {
		translationKey: "communication_status_failed",
		defaultLabel: "Fallado",
		color: "danger" as const,
	},
	[CommunicationStatus.Cancelled]: {
		translationKey: "communication_status_cancelled",
		defaultLabel: "Cancelado",
		color: "danger" as const,
	},
} as const;
