import type { ICreateView, IView } from "../interfaces/view.interface";

/**
 * Puerto para la gestión de vistas de clientes
 */
export interface IViewPort {
	/**
	 * Crear una nueva vista
	 * @param viewData - Datos de la vista a crear
	 * @returns Promise<IView> - Vista creada
	 */
	createView(viewData: ICreateView): Promise<IView>;

	/**
	 * Obtener todas las vistas de una compañía
	 * @param companyId - ID de la compañía
	 * @param userId - ID del usuario (opcional, para filtrar por usuario)
	 * @param page - Página actual (opcional, por defecto 1)
	 * @param limit - Límite por página (opcional, por defecto 20)
	 * @returns Promise<IViewResponse> - Respuesta con las vistas
	 */
	getViews(page?: number, limit?: number): Promise<IView[]>;

	/**
	 * Obtener una vista por ID
	 * @param viewId - ID de la vista
	 * @returns Promise<IView> - Vista encontrada
	 */
	getViewById(viewId: string): Promise<IView>;

	/**
	 * Eliminar una vista
	 * @param viewId - ID de la vista a eliminar
	 * @returns Promise<void>
	 */
	deleteView(viewId: string): Promise<void>;
}
