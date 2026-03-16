import type { IUser } from "../domain/interfaces/user.interface";
import type { IUserPort } from "../domain/ports/user.port";

export class UpdateUserUseCase {
	constructor(private readonly userPort: IUserPort) {}

	async execute(userId: string, data: Partial<IUser>): Promise<void> {
		return this.userPort.updateUser(userId, data);
	}
}
