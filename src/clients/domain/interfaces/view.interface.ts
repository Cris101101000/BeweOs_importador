import type { IClientFilter } from "./client-filter.interface";

/**
 * Interfaz para representar una vista guardada de clientes
 */
export interface IView {
	/** ID único de la vista */
	id?: string;
	/** Nombre de la vista */
	name: string;
	/** Descripción de la vista */
	description?: string;
	/** Filtros aplicados en la vista */
	filters: Partial<IClientFilter>;
	/** ID de la compañía a la que pertenece la vista */
	companyId: string;
	/** ID del usuario que creó la vista */
	userId: string;
	/** Fecha de creación */
	createdAt: Date;
	/** Fecha de última actualización */
	updatedAt: Date;
	/** Si es la vista por defecto */
	isDefault?: boolean;
	/** Si está activo */
	isActive?: boolean;
	/** Entidad que corresponde en este caso es clientes */
	entityType: string;
}

/**
 * Interfaz para crear una nueva vista
 */
export interface ICreateView {
	/** Nombre de la vista */
	name: string;
	/** Descripción de la vista */
	description?: string;
	/** Filtros aplicados en la vista */
	filters: Partial<IClientFilter>;
	/** ID de la compañía a la que pertenece la vista */
	companyId: string;
	/** Si es la vista por defecto */
	isDefault?: boolean;
	/** Entidad que corresponde en este caso es clientes */
	entityType?: string;
}
