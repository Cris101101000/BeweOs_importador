import type { CreateClientResponseDto } from "../dtos/create-client.dto";

export const createClientResponseMock: CreateClientResponseDto = {
	id: "123e4567-e89b-12d3-a456-426614174000",
	firstname: "Juan",
	lastname: "Pérez",
	phone: [
		{
			code: "+57",
			country: "CO",
			number: "3001234567",
		},
	],
	email: "juan.perez@example.com",
	birthdate: "15/03/1990",
	status: "client",
};
