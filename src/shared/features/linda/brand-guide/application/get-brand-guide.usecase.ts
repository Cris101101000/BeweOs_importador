import type { IBrandGuide } from "../domain/interfaces/brand-guide.interface";
import type { IBrandGuideRepository } from "../domain/ports/brand-guide.port";

/**
 * Caso de uso: Obtener la guía de marca
 *
 * Recupera la guía de marca activa para la generación de contenido
 * en redes sociales y campañas
 */
export class GetBrandGuideUseCase {
	constructor(private readonly repository: IBrandGuideRepository) {}

	/**
	 * Ejecuta el caso de uso
	 *
	 * @returns Promise con los datos de la guía de marca
	 * @throws BrandGuideError si hay error en la consulta
	 */
	async execute(): Promise<IBrandGuide> {
		return await this.repository.getBrandGuide();
	}
}
