import type { IdeaStatus } from "../domain/enums/idea-status.enum";
import type { IIdeaBankRepository } from "../domain/ports/idea-bank.port";

/**
 * Caso de uso: Actualizar el estado de una idea del banco de ideas
 *
 * Este caso de uso encapsula la lógica de negocio para actualizar
 * el estado de una idea (aprobar, rechazar, etc.)
 */
export class UpdateIdeaStatusUseCase {
	constructor(private readonly repository: IIdeaBankRepository) {}

	/**
	 * Ejecuta el caso de uso para actualizar el estado
	 * @param id ID de la idea
	 * @param status Nuevo estado
	 */
	async execute(id: string, status: IdeaStatus): Promise<void> {
		return await this.repository.updateIdeaStatus(id, status);
	}
}
