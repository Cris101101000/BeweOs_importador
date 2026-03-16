import { Result } from "@shared/domain/errors/Result";
import type { ITemplate } from "@campaigns/domain/templates/interfaces/Template";
import type { ITemplatePort } from "@campaigns/domain/templates/ports/TemplatePort";
import { GetTemplateError } from "@campaigns/domain/templates/errors/TemplateError";
import type { EnumCampaignContentType } from "@campaigns/domain/campaign-management/enums/EnumCampaignContentType";

/**
 * UseCase para obtener plantillas, opcionalmente filtradas por tipo de contenido
 */
export class GetAllTemplatesUseCase {
	constructor(private readonly templatePort: ITemplatePort) {}

	async execute(
		contentType?: EnumCampaignContentType
	): Promise<Result<ITemplate[], GetTemplateError>> {
		try {
			if (contentType) {
				return await this.templatePort.getTemplatesByContentType(contentType);
			}
			return await this.templatePort.getAllTemplates();
		} catch (error) {
			console.error("Error al obtener plantillas:", error);
			return Result.Err(
				new GetTemplateError(
					error instanceof Error ? error.message : "Error al obtener plantillas"
				)
			);
		}
	}
}
