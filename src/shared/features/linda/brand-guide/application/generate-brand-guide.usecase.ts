import type { IBrandGuideRepository } from '../domain/ports/brand-guide.port';

/**
 * Datos requeridos para generar la guía de marca
 */
export interface GenerateBrandGuideData {
	smbAddedDescription: string;
	primaryColor: string;
	secondaryColor: string;
	logoUrl?: string;
}

/**
 * Caso de uso: Generar/regenerar la guía de marca
 *
 * Llama al endpoint POST /linda/brand-guide/generate
 * para generar una nueva guía de marca con los parámetros proporcionados
 */
export class GenerateBrandGuideUseCase {
	constructor(private readonly repository: IBrandGuideRepository) {}

	/**
	 * Ejecuta el caso de uso
	 *
	 * @param data - Datos para generar la guía (smbAddedDescription, primaryColor, secondaryColor)
	 * @returns Promise que se resuelve cuando la generación es exitosa
	 * @throws BrandGuideError si hay error en la generación
	 */
	async execute(data: GenerateBrandGuideData): Promise<void> {
		return await this.repository.generateBrandGuide(data);
	}
}
