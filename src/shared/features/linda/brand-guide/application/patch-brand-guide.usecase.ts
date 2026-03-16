import type { IBrandGuide } from "../domain/interfaces/brand-guide.interface";
import type { IBrandGuideRepository } from "../domain/ports/brand-guide.port";

/**
 * Caso de uso: Actualizar parcialmente la guía de marca (PATCH)
 *
 * Permite actualizar campos específicos de la guía de marca
 * sin necesidad de enviar todos los campos
 */
export class PatchBrandGuideUseCase {
	constructor(private readonly repository: IBrandGuideRepository) {}

	/**
	 * Ejecuta el caso de uso
	 *
	 * @param data - Datos parciales de la guía de marca a actualizar
	 * @returns Promise que se resuelve cuando la actualización es exitosa
	 * @throws BrandGuideError si hay error en la actualización
	 */
	async execute(data: Partial<IBrandGuide>): Promise<void> {
		return await this.repository.patchBrandGuide(data);
	}
}
