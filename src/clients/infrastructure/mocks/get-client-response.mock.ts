import type { GetClientResponseDto } from "../dtos/get-client.dto";

export const mockGetClientResponse: GetClientResponseDto = {
	id: "client-123",
	name: "Juan Pérez",
	phones: [
		{
			code: "+57",
			country: "CO",
			number: "3001234567",
		},
	],
	email: "juan.perez@example.com",
	birthdate: "15/03/1985",
	status: "client",
	potentialTier: "high",
	lastCommunication: "15/11/2024",
	creationChannel: "web",
};

export const mockGetClientResponseProspect: GetClientResponseDto = {
	id: "prospect-456",
	name: "María García",
	phones: [
		{
			code: "+57",
			country: "CO",
			number: "3009876543",
		},
	],
	email: "maria.garcia@example.com",
	birthdate: "22/08/1990",
	status: "prospect",
	potentialTier: "medium",
	lastCommunication: "08/11/2024",
	creationChannel: "web",
};
