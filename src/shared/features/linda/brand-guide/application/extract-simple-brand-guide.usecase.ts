import type { Result } from '@shared/domain/errors/Result';
import type { ISimpleBrandGuide } from '../domain/interfaces/brand-guide.interface';
import type { IBrandGuideRepository } from '../domain/ports/brand-guide.port';

export interface ExtractSimpleBrandGuideData {
	url: string;
}

/**
 * Caso de uso: Extraer datos básicos de marca usando solo Brandfetch (sin LLM)
 *
 * Llama a POST /linda/brand-guide/extract-simple
 * Retorna datos básicos de marca (logo, colores, descripción) de forma inmediata
 */
export class ExtractSimpleBrandGuideUseCase {
	constructor(private readonly repository: IBrandGuideRepository) {}

	async execute(data: ExtractSimpleBrandGuideData): Promise<Result<ISimpleBrandGuide, Error>> {
		return await this.repository.extractSimple(data);
	}
}
