import type { IResponse } from "@shared/infrastructure/interfaces/response.interface";
import type {
	IRecoveryPasswordRequest,
	IRecoveryPasswordResponse,
} from "../../domain/interfaces/recovery-password.interface";
import type { IRecoveryPasswordPort } from "../../domain/ports/recovery-password.port";
// import type { DtoRecoveryPasswordRequest } from "../dtos/recovery-password.dto";
// import { mapDomainToDto, mapDtoToDomain } from "../mappers/recovery-password.mapper";
import { mockRecoveryPasswordResponse } from "../mocks/recovery-password.mock";

export class RecoveryPasswordAdapter implements IRecoveryPasswordPort {
	private readonly baseUrl: string;

	constructor() {
		// Get the base URL from environment variables
		this.baseUrl =
			process.env.REACT_APP_BASE_URL_BACKEND || "http://localhost:3001";
	}

	async recoveryPassword(
		request: IRecoveryPasswordRequest
	): Promise<IResponse<IRecoveryPasswordResponse>> {
		try {
			// MOCK: Using mockRecoveryPasswordResponse instead of real API call
			// This simulates a successful response for testing purposes

			// Simulate some processing time like a real API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Return the mock response directly
			return mockRecoveryPasswordResponse;

			// ORIGINAL CODE (commented out for mock):
			/*
			const dtoRequest: DtoRecoveryPasswordRequest = mapDomainToDto(request);
			
			const response = await fetch(`${this.baseUrl}/users/${dtoRequest.userId}/recovery-password/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(dtoRequest),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			
			// Return the IResponse format with mapped data
			return {
				success: data.success,
				message: data.message,
				data: data.data ? mapDtoToDomain(data.data) : undefined,
				timestamp: data.timestamp,
				error: data.error,
			};
			*/
		} catch (error) {
			// Return error response in IResponse format
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Unknown error occurred",
				timestamp: new Date().toISOString(),
				error: {
					code: "RECOVERY_PASSWORD_ERROR",
					message:
						error instanceof Error ? error.message : "Unknown error occurred",
				},
			};
		}
	}
}
