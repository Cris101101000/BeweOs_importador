import type { IUserPort } from "../domain/ports/user.port";

export class InviteUserUseCase {
	constructor(private readonly userPort: IUserPort) {}

	async execute(email: string, roles: string[]): Promise<void> {
		return this.userPort.inviteUser(email, roles);
	}
}
