import type { IClientHistoryPort } from "@clients/domain/ports/client-history.port";

/**
 * Caso de uso para eliminar una o varias notas
 */
export class DeleteNoteUseCase {
	constructor(private readonly clientHistoryPort: IClientHistoryPort) {}

	/**
	 * Ejecuta el caso de uso para eliminar una o varias notas
	 * @param clientId - ID del cliente
	 * @param noteIds - IDs de las notas a eliminar
	 * @returns Promise<void>
	 */
	async execute(clientId: string, noteIds: string[]): Promise<void> {
		await this.clientHistoryPort.deleteNotes(clientId, noteIds);
	}
}
