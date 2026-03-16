import type { IClientPort } from "../domain/ports/client.port";

/**
 * DeleteClientsUseCase - Use case for deleting multiple clients
 *
 * This use case handles the deletion of multiple clients by their IDs.
 * It validates input parameters and delegates the deletion to the client port.
 *
 * @example
 * ```typescript
 * const deleteClients = new DeleteClientsUseCase(clientPort);
 * await deleteClients.execute(["client1", "client2", "client3"]);
 * ```
 */
export class DeleteClientsUseCase {
	constructor(private readonly clientPort: IClientPort) {}

	/**
	 * Executes the deletion of multiple clients
	 *
	 * @param clientIds - Array of client IDs to delete
	 * @returns Promise that resolves when all clients are deleted
	 * @throws Error if clientIds is empty or contains invalid IDs
	 */
	async execute(clientIds: string[]): Promise<void> {
		if (!clientIds || clientIds.length === 0) {
			throw new Error("At least one client ID is required");
		}

		// Validate that all IDs are non-empty strings
		const invalidIds = clientIds.filter((id) => !id || typeof id !== "string");
		if (invalidIds.length > 0) {
			throw new Error(`Invalid client IDs found: ${invalidIds.join(", ")}`);
		}

		// Use the deleteClients method that accepts the array directly
		await this.clientPort.deleteClients(clientIds);
	}
}
