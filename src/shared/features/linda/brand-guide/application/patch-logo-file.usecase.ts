import type { IBrandGuideRepository } from '../domain/ports/brand-guide.port';

/**
 * Caso de uso: Actualizar solo el logo del brand guide
 *
 * Llama a PATCH /linda/brand-guide con multipart/form-data
 */
export class PatchLogoFileUseCase {
	constructor(private readonly repository: IBrandGuideRepository) {}

	async execute(file: File): Promise<void> {
		return await this.repository.patchLogoFile(file);
	}
}
