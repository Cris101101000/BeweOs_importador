import type { IUser } from "../interfaces/user.interface";

/**
 * Defines the contract for user data operations.
 */
export interface IUserPort {
	getUsers(): Promise<IUser[]>;
	inviteUser(email: string, roles: string[]): Promise<void>;
	updateUser(userId: string, data: Partial<IUser>): Promise<void>;
	deleteUser(userId: string): Promise<void>;
}
