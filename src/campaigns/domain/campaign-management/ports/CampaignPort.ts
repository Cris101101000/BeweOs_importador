import type { Result } from "@shared/domain/errors/Result";
import type {
	ICampaign,
	ICreateCampaignInput,
	IUpdateCampaignInput,
} from "../interfaces/Campaign";
import type {
	CreateCampaignError,
	DeleteCampaignError,
	GetCampaignError,
	SendCampaignError,
	UpdateCampaignError,
} from "../errors/CampaignError";

/**
 * Puerto para operaciones de campañas
 * Define el contrato que debe cumplir el adaptador de infraestructura
 */
export interface ICampaignPort {
	/**
	 * Crea una nueva campaña
	 */
	createCampaign(
		input: ICreateCampaignInput
	): Promise<Result<ICampaign, CreateCampaignError>>;

	/**
	 * Actualiza una campaña existente
	 */
	updateCampaign(
		input: IUpdateCampaignInput
	): Promise<Result<ICampaign, UpdateCampaignError>>;

	/**
	 * Obtiene una campaña por ID
	 */
	getCampaignById(id: string): Promise<Result<ICampaign, GetCampaignError>>;

	/**
	 * Obtiene todas las campañas
	 */
	getAllCampaigns(): Promise<Result<ICampaign[], GetCampaignError>>;

	/**
	 * Elimina una campaña
	 */
	deleteCampaign(id: string): Promise<Result<void, DeleteCampaignError>>;

	/**
	 * Envía una campaña a la audiencia objetivo
	 */
	sendCampaign(id: string): Promise<Result<void, SendCampaignError>>;
}
