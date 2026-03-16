import type {
	ICreateNoteRequest,
	INote,
} from "@clients/domain/interfaces/note.interface";
import type { IClientHistoryPort } from "@clients/domain/ports/client-history.port";

export class CreateNoteUseCase {
	constructor(private readonly clientHistoryPort: IClientHistoryPort) {}

	async execute(noteData: ICreateNoteRequest): Promise<INote> {
		if (!noteData.clientId || noteData.clientId.trim() === "") {
			throw new Error("Client ID is required");
		}

		if (!noteData.title || noteData.title.trim() === "") {
			throw new Error("Note title is required");
		}

		if (!noteData.description || noteData.description.trim() === "") {
			throw new Error("Note description is required");
		}

		try {
			const data = {
				...noteData,
				type: noteData.type || "general",
			};
			return await this.clientHistoryPort.createNote(noteData);
		} catch (error) {
			console.error("Error creating note:", error);
			throw new Error("failed_to_create_note");
		}
	}
}
