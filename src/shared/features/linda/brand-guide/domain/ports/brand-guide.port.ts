import type { Result } from "@shared/domain/errors/Result";
import type { IBrandGuide, ISimpleBrandGuide } from "../interfaces/brand-guide.interface";

/**
 * Repository Port para Brand Guide
 *
 * Define los contratos para operaciones relacionadas con la guía de marca
 * Implementado por adapters en la capa de infraestructura
 */
export interface IBrandGuideRepository {
	/**
	 * Obtiene la guía de marca activa
	 *
	 * @returns Promise con los datos de la guía de marca
	 * @throws BrandGuideError si hay error en la consulta
	 */
	getBrandGuide(): Promise<IBrandGuide>;

	/**
	 * Actualiza la guía de marca (PUT completo)
	 *
	 * @param data - Datos parciales de la guía de marca a actualizar
	 * @returns Promise que se resuelve cuando la actualización es exitosa
	 * @throws BrandGuideError si hay error en la actualización
	 */
	updateBrandGuide(data: Partial<IBrandGuide>): Promise<void>;

	/**
	 * Actualiza parcialmente la guía de marca (PATCH)
	 *
	 * @param data - Datos parciales de la guía de marca a actualizar
	 * @returns Promise que se resuelve cuando la actualización es exitosa
	 * @throws BrandGuideError si hay error en la actualización
	 */
	patchBrandGuide(data: Partial<IBrandGuide>): Promise<void>;

	/**
	 * Genera/regenera la guía de marca con descripción y colores
	 *
	 * @param data - Datos para generar la guía (smbAddedDescription, primaryColor, secondaryColor, logoUrl)
	 * @returns Promise que se resuelve cuando la generación es exitosa
	 * @throws BrandGuideError si hay error en la generación
	 */
	generateBrandGuide(data: {
		smbAddedDescription: string;
		primaryColor: string;
		secondaryColor: string;
		logoUrl?: string;
	}): Promise<void>;

	extract(data: { url?: string; generateContentFromBrandExtraction?: boolean }): Promise<Result<void, Error>>;

	/**
	 * Extrae datos básicos de marca usando solo Brandfetch (sin LLM)
	 *
	 * @param data - URL del sitio web a extraer
	 * @returns Promise con Result conteniendo los datos básicos de marca
	 */
	extractSimple(data: { url: string }): Promise<Result<ISimpleBrandGuide, Error>>;

	patchLogoFile(file: File): Promise<void>;
}
