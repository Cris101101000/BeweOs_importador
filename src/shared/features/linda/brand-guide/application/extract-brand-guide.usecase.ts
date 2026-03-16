import type { Result } from '@shared/domain/errors/Result';
import type { IBrandGuideRepository } from '../domain/ports/brand-guide.port';

export interface ExtractBrandGuideData {
	url?: string;
	generateContentFromBrandExtraction?: boolean;
}

/**
 * Caso de uso: Extraer brand guide desde URL o generar contenido desde extracción
 *
 * Llama a POST /linda/brand-guide/extract con dos posibles payloads:
 * - { url } → extrae brand guide desde la URL (Brandfetch-first)
 * - { generateContentFromBrandExtraction: true } → genera identidad de marca con IA
 */
export class ExtractBrandGuideUseCase {
	constructor(private readonly repository: IBrandGuideRepository) {}

	async execute(data: ExtractBrandGuideData): Promise<Result<void, Error>> {
		return await this.repository.extract(data);
	}
}
