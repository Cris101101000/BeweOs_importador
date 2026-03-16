import type { IViewPort } from "../domain/ports/view.port";

/**
 * Caso de uso para eliminar una vista
 */
export class DeleteViewUseCase {
	constructor(private readonly viewPort: IViewPort) {}

	/**
	 * Ejecuta el caso de uso para eliminar una vista
	 * @param viewId - ID de la vista a eliminar
	 * @param userId - ID del usuario que realiza la eliminación
	 * @returns Promise<void>
	 */
	async execute(viewId: string, userId: string): Promise<void> {
		try {
			// Verificar que la vista existe y obtener sus datos
			const existingView = await this.viewPort.getViewById(viewId);

			// Verificar que el usuario tiene permisos para eliminar la vista
			if (existingView.userId !== userId) {
				throw new Error("You don't have permission to delete this view");
			}

			// // Lógica de negocio: No permitir eliminar la vista por defecto sin antes establecer otra
			// if (existingView.isDefault) {
			// 	const allViews = await this.viewPort.getViews(userId);

			// 	if (allViews.length <= 1) {
			// 		throw new Error(
			// 			"Cannot delete the only view. Create another view first."
			// 		);
			// 	}

			// 	// Nota: La lógica de establecer otra vista como por defecto
			// 	// debería manejarse en el adaptador o en el backend
			// 	console.warn(
			// 		"Deleting default view. Another view should be set as default."
			// 	);
			// }

			// Eliminar la vista
			await this.viewPort.deleteView(viewId);

			console.log(`View ${viewId} deleted successfully`);
		} catch (error) {
			console.error("Error in DeleteViewUseCase:", error);

			if (
				error instanceof Error &&
				(error.message.includes("not found") ||
					error.message.includes("permission") ||
					error.message.includes("Cannot delete"))
			) {
				throw error; // Re-throw specific errors as-is
			}

			throw new Error("Failed to delete view");
		}
	}
}
