import type { IUser } from "../domain/interfaces/user.interface";
import type { IUserPort } from "../domain/ports/user.port";

export class GetUsersUseCase {
	constructor(private readonly userPort: IUserPort) {}

	async execute(): Promise<IUser[]> {
		return this.userPort.getUsers();
	}
}
