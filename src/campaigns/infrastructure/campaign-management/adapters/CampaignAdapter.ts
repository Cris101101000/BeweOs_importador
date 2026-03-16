import { Result } from "@shared/domain/errors/Result";
import type {
	ICampaign,
	ICreateCampaignInput,
	IUpdateCampaignInput,
} from "@campaigns/domain/campaign-management/interfaces/Campaign";
import type { ICampaignPort } from "@campaigns/domain/campaign-management/ports/CampaignPort";
import { EnumCampaignStatus } from "@campaigns/domain/campaign-management/enums/EnumCampaignStatus";
import {
	CreateCampaignError,
	DeleteCampaignError,
	GetCampaignError,
	SendCampaignError,
	UpdateCampaignError,
} from "@campaigns/domain/campaign-management/errors/CampaignError";

/**
 * Adaptador para operaciones de campañas
 * Implementa el puerto ICampaignPort definido en el dominio
 */
export class CampaignAdapter implements ICampaignPort {
	private campaigns: ICampaign[] = [];

	async createCampaign(
		input: ICreateCampaignInput
	): Promise<Result<ICampaign, CreateCampaignError>> {
		try {
			await this.delay(500);

			const newCampaign: ICampaign = {
				id: this.generateId(),
				...input,
				status: EnumCampaignStatus.DRAFT,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			this.campaigns.push(newCampaign);
			return Result.Ok(newCampaign);
		} catch (error) {
			return Result.Err(new CreateCampaignError(error instanceof Error ? error.message : undefined));
		}
	}

	async updateCampaign(
		input: IUpdateCampaignInput
	): Promise<Result<ICampaign, UpdateCampaignError>> {
		try {
			await this.delay(400);

			const index = this.campaigns.findIndex((c) => c.id === input.id);
			if (index === -1) {
				return Result.Err(new UpdateCampaignError(`Campaign with id ${input.id} not found`));
			}

			const updatedCampaign: ICampaign = {
				...this.campaigns[index],
				...input,
				updatedAt: new Date(),
			};

			this.campaigns[index] = updatedCampaign;
			return Result.Ok(updatedCampaign);
		} catch (error) {
			return Result.Err(new UpdateCampaignError(error instanceof Error ? error.message : undefined));
		}
	}

	async getCampaignById(
		id: string
	): Promise<Result<ICampaign, GetCampaignError>> {
		try {
			await this.delay(300);
			const campaign = this.campaigns.find((c) => c.id === id);
			if (!campaign) {
				return Result.Err(new GetCampaignError(`Campaign with id ${id} not found`));
			}
			return Result.Ok(campaign);
		} catch (error) {
			return Result.Err(new GetCampaignError(error instanceof Error ? error.message : undefined));
		}
	}

	async getAllCampaigns(): Promise<Result<ICampaign[], GetCampaignError>> {
		try {
			await this.delay(400);
			return Result.Ok([...this.campaigns]);
		} catch (error) {
			return Result.Err(new GetCampaignError(error instanceof Error ? error.message : undefined));
		}
	}

	async deleteCampaign(
		id: string
	): Promise<Result<void, DeleteCampaignError>> {
		try {
			await this.delay(300);
			const initialLength = this.campaigns.length;
			this.campaigns = this.campaigns.filter((c) => c.id !== id);
			
			if (this.campaigns.length === initialLength) {
				return Result.Err(new DeleteCampaignError(`Campaign with id ${id} not found`));
			}
			
			return Result.Ok();
		} catch (error) {
			return Result.Err(new DeleteCampaignError(error instanceof Error ? error.message : undefined));
		}
	}

	async sendCampaign(id: string): Promise<Result<void, SendCampaignError>> {
		try {
			await this.delay(1000);

			const index = this.campaigns.findIndex((c) => c.id === id);
			if (index === -1) {
				return Result.Err(new SendCampaignError(`Campaign with id ${id} not found`));
			}

			this.campaigns[index] = {
				...this.campaigns[index],
				status: EnumCampaignStatus.SENT,
				sentAt: new Date(),
				updatedAt: new Date(),
			};

			return Result.Ok();
		} catch (error) {
			return Result.Err(new SendCampaignError(error instanceof Error ? error.message : undefined));
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
		return `campaign-${Date.now()}-${Math.random().toString(36).substring(7)}`;
	}
}
