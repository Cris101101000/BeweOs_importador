import type { IAuthPort } from "@auth/domain/ports/auth.port";
import {
	getAccessToken,
	getRefreshToken,
	isExpired,
	setAccessToken,
	setRefreshToken,
} from "@beweco/utils-js";

export interface RefreshSessionResult {
	needsLogin: boolean;
}

export class RefreshSessionUseCase {
	constructor(private readonly authPort: IAuthPort) {}

	async execute(): Promise<RefreshSessionResult> {
		const refreshToken = getRefreshToken();
		if (!refreshToken || isExpired(refreshToken)) return { needsLogin: true };

		const accessToken = getAccessToken();

		if ((accessToken && isExpired(accessToken)) || !accessToken) {
			const tokens = await this.authPort.refreshSession(refreshToken);
			setAccessToken(tokens.accessToken || "");
			setRefreshToken(tokens.refreshToken || "");
		}

		return { needsLogin: false };
	}
}
