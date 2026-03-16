import type { ITokens } from "../interfaces/tokens.interface";

export interface IAuthPort {
	refreshSession: (refreshToken: string) => Promise<ITokens>;
}
