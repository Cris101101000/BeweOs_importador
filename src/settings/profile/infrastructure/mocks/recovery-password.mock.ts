import type { IResponse } from "@shared/infrastructure/interfaces/response.interface";
import type { IRecoveryPasswordResponse } from "../../domain/interfaces/recovery-password.interface";

export const mockRecoveryPasswordResponse: IResponse<IRecoveryPasswordResponse> =
	{
		success: true,
		message: "Recovery password email sent successfully",
		data: {
			message:
				"We have sent you an email with instructions to reset your password.",
			timestamp: new Date().toISOString(),
		},
		timestamp: new Date().toISOString(),
	};
