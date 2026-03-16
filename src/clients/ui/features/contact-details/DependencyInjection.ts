/**
 * DependencyInjection for Contact Details Feature
 *
 * This file provides factory functions that create use case instances
 * with their required adapters for the contact details functionality.
 */

import { CreateCommunicationUseCase } from "@clients/application/create-communication.usecase";
import { CreateNoteUseCase } from "@clients/application/create-note.usecase";
import { DeleteCommunicationUseCase } from "@clients/application/delete-communication.usecase";
import { DeleteNoteUseCase } from "@clients/application/delete-note.usecase";
import { GetClientByIdUseCase } from "@clients/application/get-client-by-id.usecase";
import { GetClientCommunicationsUseCase } from "@clients/application/get-client-communications.usecase";
import { GetClientNotesUseCase } from "@clients/application/get-client-notes.usecase";
import { UpdateClientUseCase } from "@clients/application/update-client.usecase";
import { UpdateCommunicationUseCase } from "@clients/application/update-communication.usecase";
import { UpdateNoteUseCase } from "@clients/application/update-note.usecase";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import type {
	ICreateCommunicationRequest,
	IUpdateCommunicationRequest,
} from "@clients/domain/interfaces/communication.interface";
import type {
	ICreateNoteRequest,
	IUpdateNoteRequest,
} from "@clients/domain/interfaces/note.interface";
import { ClientAdapter } from "@clients/infrastructure/adapters/client.adapter";
import { ClientHistoryAdapter } from "@clients/infrastructure/adapters/client-history.adapter";

// Singleton adapters
const clientAdapter = new ClientAdapter();
const historyAdapter = new ClientHistoryAdapter();

/**
 * Get client by ID
 */
export const GetClientById = (clientId: string) =>
	new GetClientByIdUseCase(clientAdapter).execute(clientId);

/**
 * Update client
 */
export const UpdateClient = (clientId: string, data: Partial<IClient>) =>
	new UpdateClientUseCase(clientAdapter).execute(clientId, data);

/**
 * Get client notes
 */
export const GetClientNotes = (clientId: string) =>
	new GetClientNotesUseCase(historyAdapter).execute(clientId);

/**
 * Create note
 */
export const CreateNote = (noteData: ICreateNoteRequest) =>
	new CreateNoteUseCase(historyAdapter).execute(noteData);

/**
 * Update note
 */
export const UpdateNote = (
	clientId: string,
	noteId: string,
	updates: IUpdateNoteRequest
) => new UpdateNoteUseCase(historyAdapter).execute(clientId, noteId, updates);

/**
 * Delete one or more notes
 */
export const DeleteNote = (clientId: string, noteIds: string[]) =>
	new DeleteNoteUseCase(historyAdapter).execute(clientId, noteIds);

/**
 * Get client communications
 */
export const GetClientCommunications = (clientId: string) =>
	new GetClientCommunicationsUseCase(historyAdapter).execute(clientId);

/**
 * Create communication
 */
export const CreateCommunication = (communicationData: ICreateCommunicationRequest) =>
	new CreateCommunicationUseCase(historyAdapter).execute(communicationData);

/**
 * Update communication
 */
export const UpdateCommunication = (
	communicationId: string,
	clientId: string,
	updates: IUpdateCommunicationRequest
) =>
	new UpdateCommunicationUseCase(historyAdapter).execute(
		communicationId,
		clientId,
		updates
	);

/**
 * Delete communication
 */
export const DeleteCommunication = (communicationId: string, clientId: string) =>
	new DeleteCommunicationUseCase(historyAdapter).execute(communicationId, clientId);
