/**
 * Interface de dominio para la guía de marca de Linda
 *
 * Define la estructura de datos de la guía de marca
 * que se utiliza para la generación de contenido en redes sociales y campañas
 */
export interface IBrandGuide {
	id: string;
	agencyId: string;
	companyId: string;
	sourceUrl: string;
	logoUrl: string;
	force_use_logo?: boolean;
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
 * Interface para los datos básicos de marca extraídos con Brandfetch (sin LLM)
 * Resultado de POST /linda/brand-guide/extract-simple
 */
export interface ISimpleBrandGuide {
	logo: string;
	primaryColor: string;
	secondaryColor: string;
	description: string;
	companyId: string;
	active: boolean;
	createdAt: string;
	updatedAt: string;
}
