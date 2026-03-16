import type {
	ICommunication,
	ICreateCommunicationRequest,
	IUpdateCommunicationRequest,
} from "@clients/domain/interfaces/communication.interface";
import type {
	ICreateNoteRequest,
	INote,
	IUpdateNoteRequest,
} from "@clients/domain/interfaces/note.interface";
import type {
	IClientHistoryPort,
	IClientNotesResult,
} from "@clients/domain/ports/client-history.port";
import { httpService } from "@http";
import type { IHttpClient } from "@http";
import type { CommunicationResponseDto } from "../dtos/create-communications.dto";
import type { GetClientCommunicationsResponseDto } from "../dtos/get-client-communications.dto";
import type {
	GetClientNotesPaginatedResponseDto,
	GetClientNotesResponseDto,
} from "../dtos/get-client-notes.dto";
import { CommunicationServiceMapper } from "../mappers/communication.mapper";
import { toCreateNoteRequestDto } from "../mappers/create-note.mapper";
import { GetClientCommunicationsResponseMapper } from "../mappers/get-client-communications-response.mapper";
import { GetClientNotesResponseMapper } from "../mappers/get-client-notes-response.mapper";
import { toUpdateNoteDto } from "../mappers/update-note.mapper";

export class ClientHistoryAdapter implements IClientHistoryPort {
	private readonly httpClient: IHttpClient = httpService;
	// Notes methods
	async getNotesByClientId(
		clientId: string,
		options?: { limit?: number; offset?: number }
	): Promise<IClientNotesResult> {
		const limit = options?.limit ?? 10;
		const offset = options?.offset ?? 0;
		const queryParams = new URLSearchParams({
			limit: String(limit),
			offset: String(offset),
			order: "-createdAt",
		});
		const url = `/clients/${clientId}/notes?${queryParams.toString()}`;
		const response =
			await this.httpClient.get<GetClientNotesPaginatedResponseDto>(url);

		if (response.success && response.data?.items) {
			const notes = GetClientNotesResponseMapper.toDomainList(
				response.data.items
			);
			return {
				notes,
				total: response.data.total,
				limit: response.data.limit,
				offset: response.data.offset,
			};
		}

		throw new Error(response.error?.code);
	}

	async createNote(noteData: ICreateNoteRequest): Promise<INote> {
		const url = `/clients/${noteData.clientId}/notes`;
		const body = toCreateNoteRequestDto(noteData);
		const response = await this.httpClient.post<GetClientNotesResponseDto>(
			url,
			body
		);

		if (!response.success || !response.data) {
			throw new Error(response.error?.code);
		}

		return GetClientNotesResponseMapper.toDomain(response.data);
	}

	async updateNote(
		clientId: string,
		noteId: string,
		updates: IUpdateNoteRequest
	): Promise<void> {
		const updateDto = toUpdateNoteDto(updates);
		const url = `/clients/${clientId}/notes/${noteId}`;
		const response = await this.httpClient.put<GetClientNotesResponseDto>(
			url,
			updateDto
		);

		if (!response.success) {
			throw new Error(response.error?.code);
		}

		return;
	}

	async deleteNotes(clientId: string, noteIds: string[]): Promise<void> {
		if (noteIds.length === 0) return;

		const queryParams = new URLSearchParams();
		for (const id of noteIds) {
			queryParams.append("ids", id);
		}
		const url = `/clients/${clientId}/notes?${queryParams.toString()}`;
		const response = await this.httpClient.delete(url);

		if (!response.success) {
			throw new Error(response.error?.code);
		}

		return;
	}

	// Communications methods
	async getCommunicationsByClientId(
		clientId: string
	): Promise<ICommunication[]> {
		const response = await this.httpClient.get<
			GetClientCommunicationsResponseDto[]
		>(`/clients/${clientId}/communications`);
		if (response.success && response.data) {
			return GetClientCommunicationsResponseMapper.toDomainList(response.data);
		}
		throw new Error(response.error?.code);
	}

	async createCommunication(
		communicationData: ICreateCommunicationRequest
	): Promise<ICommunication> {
		const response = await this.httpClient.post<CommunicationResponseDto>(
			`/clients/${communicationData.clientId}/communications`,
			CommunicationServiceMapper.toCreateCommunicationRequestDto(
				communicationData
			)
		);

		if (!response.success || !response.data) {
			throw new Error(response.error?.code);
		}

		return CommunicationServiceMapper.toDomainCommunication(response.data);
	}

	async updateCommunication(
		communicationId: string,
		clientId: string,
		updates: IUpdateCommunicationRequest
	): Promise<void> {
		const response = await this.httpClient.put<CommunicationResponseDto>(
			`/clients/${clientId}/communications/${communicationId}`,
			updates
		);

		if (!response.success) {
			throw new Error(response.error?.code);
		}

		return;
	}

	async deleteCommunication(
		communicationId: string,
		clientId: string
	): Promise<void> {
		const response = await this.httpClient.delete(
			`/clients/${clientId}/communications/${communicationId}`
		);

		if (!response.success) {
			throw new Error(response.error?.code);
		}

		return;
	}
}
