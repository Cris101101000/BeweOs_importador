import type { IUser } from "../domain/interfaces/user.interface";
import type { IUserPort } from "../domain/ports/user.port";

export class GetUserUseCase {
	constructor(private readonly userPort: IUserPort) {}

	async execute(): Promise<IUser | null> {
		return await this.userPort.getUser();
	}
}
