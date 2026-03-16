import type { ITokens } from "@auth/domain/interfaces/tokens.interface";
import type { IAuthPort } from "@auth/domain/ports/auth.port";
import type { IResponseApi } from "@beweco/utils-js";
import http from "@http";

export class AuthAdapter implements IAuthPort {
	async refreshSession(refreshToken: string): Promise<ITokens> {
		const response: IResponseApi<ITokens> = await http.post(
			"/auth/refresh-token",
			{
				refreshToken,
			}
		);

		if (!response.success || !response.data) {
			throw new Error(response.message || "Failed to refresh token");
		}

		return response.data;
	}
}
