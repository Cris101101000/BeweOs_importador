import type { IIdeaBankResponse } from "../domain/interfaces/idea-bank.interface";
import type {
	IIdeaBankRepository,
	IdeaBankFilters,
} from "../domain/ports/idea-bank.port";

/**
 * Caso de uso: Obtener ideas del banco de ideas de Linda
 *
 * Este caso de uso encapsula la lógica de negocio para obtener
 * las ideas propuestas por Linda desde el banco de ideas.
 */
export class GetIdeaBankUseCase {
	constructor(private readonly repository: IIdeaBankRepository) {}

	/**
	 * Ejecuta el caso de uso para obtener ideas
	 * @param filters Filtros opcionales para la consulta
	 * @returns Respuesta paginada con las ideas
	 */
	async execute(filters?: IdeaBankFilters): Promise<IIdeaBankResponse> {
		return await this.repository.getIdeas(filters);
	}
}
