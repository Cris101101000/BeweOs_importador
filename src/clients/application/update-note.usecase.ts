import type { IUpdateNoteRequest } from "@clients/domain/interfaces/note.interface";
import type { IClientHistoryPort } from "@clients/domain/ports/client-history.port";

export class UpdateNoteUseCase {
	constructor(private readonly clientHistoryPort: IClientHistoryPort) {}

	async execute(
		clientId: string,
		noteId: string,
		updates: IUpdateNoteRequest
	): Promise<void> {
		const newUpdates = {
			...updates,
			type: updates.type || "standard",
		};
		await this.clientHistoryPort.updateNote(clientId, noteId, newUpdates);
	}
}
