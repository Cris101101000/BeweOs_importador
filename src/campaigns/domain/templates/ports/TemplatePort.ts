import type { Result } from "@shared/domain/errors/Result";
import type { ITemplate, ICreateTemplateInput } from "../interfaces/Template";
import type { EnumCampaignContentType } from "../../campaign-management/enums/EnumCampaignContentType";
import type {
	CreateTemplateError,
	DeleteTemplateError,
	GetTemplateError,
} from "../errors/TemplateError";

/**
 * Puerto para operaciones de plantillas de campañas
 */
export interface ITemplatePort {
	/**
	 * Crea una nueva plantilla
	 */
	createTemplate(
		input: ICreateTemplateInput
	): Promise<Result<ITemplate, CreateTemplateError>>;

	/**
	 * Obtiene todas las plantillas
	 */
	getAllTemplates(): Promise<Result<ITemplate[], GetTemplateError>>;

	/**
	 * Obtiene una plantilla por ID
	 */
	getTemplateById(id: string): Promise<Result<ITemplate, GetTemplateError>>;

	/**
	 * Elimina una plantilla
	 */
	deleteTemplate(id: string): Promise<Result<void, DeleteTemplateError>>;

	/**
	 * Obtiene plantillas filtradas por tipo de contenido
	 */
	getTemplatesByContentType(
		contentType: EnumCampaignContentType
	): Promise<Result<ITemplate[], GetTemplateError>>;
}
