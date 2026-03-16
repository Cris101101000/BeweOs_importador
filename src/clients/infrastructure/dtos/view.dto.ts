import type { GetClientsByFilterRequestDto } from "./get-clients-by-filter.dto";

/**
 * DTO para crear una vista
 */
export interface CreateViewRequestDto {
	/** Nombre de la vista */
	name: string;
	/** Descripción de la vista */
	description?: string;
	/** Entidad que corresponde en este caso es clientes */
	entityType: string;
	/** Filtros aplicados en la vista (JSON string) */
	filterConfig: GetClientsByFilterRequestDto;
	/** Si es la vista por defecto */
	isDefault?: boolean;
}

/**
 * DTO para actualizar una vista
 */
export interface UpdateViewRequestDto {
	/** Nombre de la vista */
	name?: string;
	/** Filtros aplicados en la vista (JSON string) */
	filters?: GetClientsByFilterRequestDto;
	/** Si es la vista por defecto */
	isDefault?: boolean;
}

/**
 * DTO de respuesta para una vista
 */
export interface ViewResponseDto {
	/** ID único de la vista */
	id: string;
	/** Nombre de la vista */
	name: string;
	/** Descripción de la vista */
	description: string;
	/**Entidad que corresponde en este caso es clientes */
	entityType: string;
	/** Filtros aplicados en la vista (JSON string) */
	filterConfig: GetClientsByFilterRequestDto;
	/** ID de la compañía */
	companyId: string;
	/** ID del usuario */
	userId: string;
	/** Fecha de creación (ISO string) */
	createdAt: string;
	/** Fecha de última actualización (ISO string) */
	updatedAt: string;
	/** Si es la vista por defecto */
	isDefault?: boolean;
	/**Si la vista esta activa */
	isActive: boolean;
}
