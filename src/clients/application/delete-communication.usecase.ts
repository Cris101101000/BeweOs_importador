import type { IClientHistoryPort } from "@clients/domain/ports/client-history.port";

/**
 * Caso de uso para eliminar una comunicación
 */
export class DeleteCommunicationUseCase {
	constructor(private readonly clientHistoryPort: IClientHistoryPort) {}

	/**
	 * Ejecuta el caso de uso para eliminar una comunicación
	 * @param communicationId - ID de la comunicación a eliminar
	 * @param clientId - ID del cliente
	 * @returns Promise<void>
	 */
	async execute(communicationId: string, clientId: string): Promise<void> {
		await this.clientHistoryPort.deleteCommunication(communicationId, clientId);
	}
}
