import type { GetClientNotesResponseDto } from "../dtos/get-client-notes.dto";

export const getClientNotesResponseMock: GetClientNotesResponseDto[] = [
	{
		id: "note-1",
		clientId: "client-123",
		companyId: "company-123",
		type: "follow-up",
		title: "Nota de seguimiento",
		content:
			"Cliente interesado en el paquete premium. Programar llamada de seguimiento para la próxima semana.",
		createdAt: "2024-12-11T10:30:00Z",
		updatedAt: "2024-12-11T10:30:00Z",
		createdBy: "user-456",
	},
	{
		id: "note-2",
		clientId: "client-123",
		companyId: "company-123",
		type: "meeting",
		title: "Reunión inicial",
		content:
			"Primera reunión con el cliente. Mostró interés en nuestros servicios de consultoría.",
		createdAt: "2024-12-10T14:15:00Z",
		updatedAt: "2024-12-10T14:15:00Z",
		createdBy: "user-456",
	},
];

export const getEmptyClientNotesResponseMock: GetClientNotesResponseDto[] = [];
