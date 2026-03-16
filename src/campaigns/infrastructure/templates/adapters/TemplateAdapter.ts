import { Result } from "@shared/domain/errors/Result";
import type { ITemplate, ICreateTemplateInput } from "@campaigns/domain/templates/interfaces/Template";
import type { ITemplatePort } from "@campaigns/domain/templates/ports/TemplatePort";
import {
	GetTemplateError,
	CreateTemplateError,
	DeleteTemplateError,
} from "@campaigns/domain/templates/errors/TemplateError";
import type { EnumCampaignContentType } from "@campaigns/domain/campaign-management/enums/EnumCampaignContentType";
import { MOCK_CAMPAIGN_TEMPLATES } from "../../mocks";

/**
 * Adaptador para operaciones de plantillas de campañas
 * Implementa el puerto ITemplatePort definido en el dominio
 */
export class TemplateAdapter implements ITemplatePort {
	private templates: ITemplate[] = [...(MOCK_CAMPAIGN_TEMPLATES as any[])];

	async createTemplate(
		input: ICreateTemplateInput
	): Promise<Result<ITemplate, CreateTemplateError>> {
		try {
			await this.delay(500);

			const newTemplate: ITemplate = {
				id: this.generateId(),
				...input,
				isDefault: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			this.templates.push(newTemplate);
			return Result.Ok(newTemplate);
		} catch (error) {
			return Result.Err(new CreateTemplateError(error instanceof Error ? error.message : undefined));
		}
	}

	async getAllTemplates(): Promise<Result<ITemplate[], GetTemplateError>> {
		try {
			await this.delay(400);
			return Result.Ok([...this.templates]);
		} catch (error) {
			return Result.Err(new GetTemplateError(error instanceof Error ? error.message : undefined));
		}
	}

	async getTemplateById(id: string): Promise<Result<ITemplate, GetTemplateError>> {
		try {
			await this.delay(300);
			const template = this.templates.find((t) => t.id === id);
			if (!template) {
				return Result.Err(new GetTemplateError(`Template with id ${id} not found`));
			}
			return Result.Ok(template);
		} catch (error) {
			return Result.Err(new GetTemplateError(error instanceof Error ? error.message : undefined));
		}
	}

	async deleteTemplate(id: string): Promise<Result<void, DeleteTemplateError>> {
		try {
			await this.delay(300);
			const initialLength = this.templates.length;
			this.templates = this.templates.filter((t) => t.id !== id);
			
			if (this.templates.length === initialLength) {
				return Result.Err(new DeleteTemplateError(`Template with id ${id} not found`));
			}
			
			return Result.Ok();
		} catch (error) {
			return Result.Err(new DeleteTemplateError(error instanceof Error ? error.message : undefined));
		}
	}

	async getTemplatesByContentType(
		contentType: EnumCampaignContentType
	): Promise<Result<ITemplate[], GetTemplateError>> {
		try {
			await this.delay(400);
			const filtered = this.templates.filter(
				(t) => t.contentType === contentType
			);
			return Result.Ok(filtered);
		} catch (error) {
			return Result.Err(new GetTemplateError(error instanceof Error ? error.message : undefined));
		}
	}

	/**
	 * Utilidad para simular delay de red
	 */
	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Genera un ID único simple
	 */
	private generateId(): string {
		return `template-${Date.now()}-${Math.random().toString(36).substring(7)}`;
	}
}
