import type { IUserPort } from "../domain/ports/user.port";

export class DeleteUserUseCase {
	constructor(private readonly userPort: IUserPort) {}

	async execute(userId: string): Promise<void> {
		return this.userPort.deleteUser(userId);
	}
}
