import type {
	IIdeaBankRepository,
	IIdeaByIdPollingResponse,
} from "../domain/ports/idea-bank.port";

/**
 * Caso de uso: Obtener una idea por ID (para polling de estado de generación)
 */
export class GetIdeaByIdUseCase {
	constructor(private readonly repository: IIdeaBankRepository) {}

	async execute(id: string): Promise<IIdeaByIdPollingResponse> {
		return await this.repository.getIdeaById(id);
	}
}
