import type { IUpdateNoteRequest } from "../../domain/interfaces/note.interface";
import type { UpdateNoteDto } from "../dtos/update-note.dto";

export const toUpdateNoteDto = (request: IUpdateNoteRequest): UpdateNoteDto => {
	return {
		title: request.title || "",
		content: request.description || "",
		type: request.type || "",
	};
};
