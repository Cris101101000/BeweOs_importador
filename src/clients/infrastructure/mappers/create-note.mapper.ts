import type { ICreateNoteRequest } from "@clients/domain/interfaces/note.interface";
import type { CreateNoteRequestDto } from "../dtos/create-note.dto";

/** Mapea a body del API: content (requerido), title y type opcionales. clientId va en la URL. */
export const toCreateNoteRequestDto = (
	note: ICreateNoteRequest
): CreateNoteRequestDto => {
	const type = note.type === "quick" ? "quick" : "standard";
	return {
		content: note.description,
		...(note.title?.trim() && { title: note.title.trim() }),
		type,
	};
};
