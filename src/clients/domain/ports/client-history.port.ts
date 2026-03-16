import type {
	ICommunication,
	ICreateCommunicationRequest,
	IUpdateCommunicationRequest,
} from "../interfaces/communication.interface";
import type {
	ICreateNoteRequest,
	INote,
	IUpdateNoteRequest,
} from "../interfaces/note.interface";

export interface IClientNotesOptions {
	limit?: number;
	offset?: number;
}

export interface IClientNotesResult {
	notes: INote[];
	total: number;
	limit: number;
	offset: number;
}

export interface IClientHistoryPort {
	// Notes methods
	getNotesByClientId(
		clientId: string,
		options?: IClientNotesOptions
	): Promise<IClientNotesResult>;
	createNote(noteData: ICreateNoteRequest): Promise<INote>;
	updateNote(
		clientId: string,
		noteId: string,
		updates: IUpdateNoteRequest
	): Promise<void>;
	/** Delete one or more notes by ID. Uses query: /clients/:clientId/notes?ids=id1&ids=id2 */
	deleteNotes(clientId: string, noteIds: string[]): Promise<void>;

	// Communications methods
	getCommunicationsByClientId(clientId: string): Promise<ICommunication[]>;
	createCommunication(
		communicationData: ICreateCommunicationRequest
	): Promise<ICommunication>;
	updateCommunication(
		communicationId: string,
		clientId: string,
		updates: IUpdateCommunicationRequest
	): Promise<void>;
	deleteCommunication(communicationId: string, clientId: string): Promise<void>;
}
