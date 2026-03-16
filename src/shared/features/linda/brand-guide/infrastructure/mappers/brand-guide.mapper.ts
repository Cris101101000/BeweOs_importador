import type { IBrandGuide } from '../../domain/interfaces/brand-guide.interface';
import type {
	GetBrandGuideResponseDto,
	UpdateBrandGuideRequestDto,
} from '../dtos/brand-guide.dto';

/**
 * Transforma un DTO de respuesta de Brand Guide a la interfaz de dominio
 *
 * @param dto - DTO recibido del backend
 * @returns Objeto IBrandGuide del dominio
 */
export function toBrandGuideFromDto(
	dto: GetBrandGuideResponseDto
): IBrandGuide {
	return {
		id: dto.id,
		agencyId: dto.agencyId,
		companyId: dto.companyId,
		sourceUrl: dto.sourceUrl,
		logoUrl: dto.logoUrl,
		primaryColor: dto.primaryColor,
		secondaryColor: dto.secondaryColor,
		tertiaryColor: dto.tertiaryColor,
		visualStyle: dto.visualStyle,
		colorPaletteDescription: dto.colorPaletteDescription,
		composition: dto.composition,
		mood: dto.mood,
		keyElements: dto.keyElements,
		avoidElements: dto.avoidElements,
		smbAddedDescription: dto.smbAddedDescription,
		isActive: dto.isActive,
		createdAt: dto.createdAt,
		updatedAt: dto.updatedAt,
	};
}

/**
 * Transforma datos parciales del dominio a un DTO de actualización
 *
 * @param data - Datos parciales de IBrandGuide a actualizar
 * @returns DTO para enviar al backend
 */
export function toBrandGuideDtoFromDomain(
	data: Partial<IBrandGuide>
): UpdateBrandGuideRequestDto {
	const dto: UpdateBrandGuideRequestDto = {};

	if (data.logoUrl !== undefined) dto.logoUrl = data.logoUrl;
	if (data.primaryColor !== undefined) dto.primaryColor = data.primaryColor;
	if (data.secondaryColor !== undefined)
		dto.secondaryColor = data.secondaryColor;
	if (data.tertiaryColor !== undefined) dto.tertiaryColor = data.tertiaryColor;
	if (data.visualStyle !== undefined) dto.visualStyle = data.visualStyle;
	if (data.colorPaletteDescription !== undefined)
		dto.colorPaletteDescription = data.colorPaletteDescription;
	if (data.composition !== undefined) dto.composition = data.composition;
	if (data.mood !== undefined) dto.mood = data.mood;
	if (data.keyElements !== undefined) dto.keyElements = data.keyElements;
	if (data.avoidElements !== undefined) dto.avoidElements = data.avoidElements;
	if (data.smbAddedDescription !== undefined)
		dto.smbAddedDescription = data.smbAddedDescription;
	if (data.isActive !== undefined) dto.isActive = data.isActive;

	return dto;
}
