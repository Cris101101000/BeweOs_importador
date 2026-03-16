import type { ContentGenerationStatus } from "../enums/content-generation-status.enum";
import type { ContentOrigin } from "../enums/content-origin.enum";
import type {
	IContentGeneration,
	IContentGenerationResponse,
} from "../interfaces/content-generation.interface";

export interface IContentGenerationRepository {
	getContentGenerations(
		filters?: ContentGenerationFilters
	): Promise<IContentGenerationResponse>;
	getContentGenerationById(id: string): Promise<IContentGeneration | null>;
	updateContentGenerationStatus(
		id: string,
		status: ContentGenerationStatus
	): Promise<IContentGeneration>;
	createContentGeneration(
		request: CreateContentGenerationRequest
	): Promise<IContentGeneration>;
	editImage(
		id: string,
		prompt: string,
		imageUrls?: string[]
	): Promise<EditImageResult>;
}

export interface EditImageResult {
	content: IContentGeneration;
	newImageUrl?: string;
}

export interface ContentGenerationFilters {
	status?: ContentGenerationStatus;
	page?: number;
	limit?: number;
	language?: string;
	category?: string;
	origins?: ContentOrigin | ContentOrigin[];
}

export interface CreateContentGenerationRequest {
	userInput: string;
	threadId: string;
	/** false para usar el logo por default, true para usar uno enviado por el usuario */
	forceUseLogo?: boolean;
	/** URL de filestack del nuevo logo */
	temporalLogoUrl?: string;
	/** Nueva descripción de marca que digitó el usuario */
	temporalVisualStyle?: string;
	/** Color primario que el usuario customizó */
	temporalPrimaryColor?: string;
	/** Color secundario que el usuario customizó */
	temporalSecondaryColor?: string;
}
