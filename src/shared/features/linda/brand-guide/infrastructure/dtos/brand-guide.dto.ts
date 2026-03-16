/**
 * DTO para la respuesta del endpoint GET /linda/brand-guide
 */
export interface GetBrandGuideResponseDto {
	id: string;
	agencyId: string;
	companyId: string;
	sourceUrl: string;
	logoUrl: string;
	primaryColor: string;
	secondaryColor: string;
	tertiaryColor: string;
	visualStyle: string;
	colorPaletteDescription: string;
	composition: string;
	mood: string;
	keyElements: string;
	avoidElements: string;
	smbAddedDescription: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

/**
 * DTO para la petición PUT /linda/brand-guide
 * Permite actualización parcial de la guía de marca
 */
export interface UpdateBrandGuideRequestDto {
	logoUrl?: string;
	primaryColor?: string;
	secondaryColor?: string;
	tertiaryColor?: string;
	visualStyle?: string;
	colorPaletteDescription?: string;
	composition?: string;
	mood?: string;
	keyElements?: string;
	avoidElements?: string;
	smbAddedDescription?: string;
	isActive?: boolean;
}

/**
 * DTO para la petición POST /linda/brand-guide/generate
 * Genera/regenera la guía de marca con los parámetros proporcionados
 */
export interface GenerateBrandGuideRequestDto {
	smbAddedDescription: string;
	primaryColor: string;
	secondaryColor: string;
	logoUrl?: string;
}

/**
 * DTO para la petición POST /linda/brand-guide/extract
 * Extrae brand guide desde URL o genera contenido desde la extracción existente
 */
export interface ExtractBrandGuideRequestDto {
	url?: string;
	generateContentFromBrandExtraction?: boolean;
}

/**
 * DTO para la petición POST /linda/brand-guide/extract-simple
 * Extrae datos básicos de marca usando solo Brandfetch (sin LLM)
 */
export interface ExtractSimpleBrandGuideRequestDto {
	url: string;
}

/**
 * DTO para la respuesta de POST /linda/brand-guide/extract-simple
 * Retorna datos básicos de marca extraídos directamente
 */
export interface ExtractSimpleBrandGuideResponseDto {
	logo: string;
	primaryColor: string;
	secondaryColor: string;
	description: string;
	companyId: string;
	active: boolean;
	createdAt: string;
	updatedAt: string;
}
