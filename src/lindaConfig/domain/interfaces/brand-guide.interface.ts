/**
 * Brand Guide Interface
 *
 * Representa la guía de marca visual y de comunicación
 * para la generación de contenido en redes sociales y campañas
 */
export interface IBrandGuide {
	/**
	 * Identificador único de la guía de marca
	 */
	id: string;

	/**
	 * ID de la agencia propietaria
	 */
	agencyId: string;

	/**
	 * ID de la empresa/SMB asociada
	 */
	companyId: string;

	/**
	 * URL de origen de la guía de marca
	 */
	sourceUrl: string;

	/**
	 * URL del logo de la marca
	 */
	logoUrl: string;

	/**
	 * Color principal en formato hexadecimal (ej: #FF6B6B)
	 */
	primaryColor: string;

	/**
	 * Color secundario en formato hexadecimal (ej: #4ECDC4)
	 */
	secondaryColor: string;

	/**
	 * Color terciario en formato hexadecimal (ej: #95E1D3)
	 */
	tertiaryColor: string;

	/**
	 * Descripción del estilo visual
	 * Ej: "Modern minimalist with bold typography"
	 */
	visualStyle: string;

	/**
	 * Descripción de la paleta de colores y su uso
	 * Ej: "Primary red for CTAs, secondary teal for accents"
	 */
	colorPaletteDescription: string;

	/**
	 * Guía de composición y layout
	 * Ej: "Centered layouts with generous whitespace"
	 */
	composition: string;

	/**
	 * Mood/atmósfera de la marca
	 * Ej: "Professional yet approachable, energetic"
	 */
	mood: string;

	/**
	 * Elementos clave a incluir
	 * Ej: "Sans-serif fonts, flat design, high contrast"
	 */
	keyElements: string;

	/**
	 * Elementos a evitar
	 * Ej: "Gradients, drop shadows, ornate decorations"
	 */
	avoidElements: string;

	/**
	 * Descripción adicional agregada por el SMB
	 * Ej: "Somos una empresa tech moderna con enfoque en diseño minimalista"
	 */
	smbAddedDescription: string;

	/**
	 * Indica si la guía de marca está activa
	 */
	isActive: boolean;

	/**
	 * Fecha de creación en formato ISO 8601
	 */
	createdAt: string;

	/**
	 * Fecha de última actualización en formato ISO 8601
	 */
	updatedAt: string;
}
