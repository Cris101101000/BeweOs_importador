import type { IUser } from "../interfaces/user.interface";

export interface IUserPort {
	getUser(): Promise<IUser | null>;
}
