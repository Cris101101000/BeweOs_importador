import { EnumLanguage } from "@shared/domain/enums/enum-language.enum";
import type { EnumTheme } from "@shared/domain/enums/enum-theme.enum";
import type { IResponse } from "@shared/infrastructure/interfaces/response.interface";
import type {
	IUpdateProfileRequest,
	IUpdateProfileResponse,
} from "../../domain/interfaces/update-profile.interface";

export const mockUpdateProfile = async (
	userId: string,
	request: IUpdateProfileRequest
): Promise<IResponse<IUpdateProfileResponse>> => {
	// Simular delay de red
	await new Promise((resolve) => setTimeout(resolve, 800));

	// Mock data - simular respuesta exitosa
	const mockResponse: IUpdateProfileResponse = {
		id: userId,
		name: request.name || "Usuario Actualizado",
		phones: request.phones || [
			{
				code: "+57",
				country: "CO",
				number: "3001234567",
			},
		],
		language: request.language || EnumLanguage.Es,
		theme: request.theme || ("light" as EnumTheme),
	};

	// Simular ocasionalmente un error (10% de probabilidad)
	if (Math.random() < 0.1) {
		throw new Error("Simulated network error");
	}

	// Return the mock response in IResponse format
	return {
		success: true,
		message: "Perfil actualizado correctamente",
		data: mockResponse,
		timestamp: new Date().toISOString(),
	};
};
