import { useCallback, useState } from "react";
import { GetIdeaBankUseCase } from "../../application/get-idea-bank.usecase";
import { GetIdeaByIdUseCase } from "../../application/get-idea-by-id.usecase";
import { UpdateIdeaStatusUseCase } from "../../application/update-idea-status.usecase";
import { IdeaStatus } from "../../domain/enums/idea-status.enum";
import type {
	IIdea,
	IIdeaBankResponse,
} from "../../domain/interfaces/idea-bank.interface";
import type {
	IdeaBankFilters,
	IIdeaByIdPollingResponse,
} from "../../domain/ports/idea-bank.port";
import { IdeaBankAdapter } from "../../infrastructure/adapters/idea-bank.adapter";

// Instanciar el repositorio y los casos de uso
const ideaBankRepository = new IdeaBankAdapter();
const getIdeaBankUseCase = new GetIdeaBankUseCase(ideaBankRepository);
const getIdeaByIdUseCase = new GetIdeaByIdUseCase(ideaBankRepository);
const updateIdeaStatusUseCase = new UpdateIdeaStatusUseCase(ideaBankRepository);

/**
 * Hook personalizado para gestionar el banco de ideas de Linda
 *
 * Proporciona:
 * - Estado de las ideas
 * - Estado de carga
 * - Manejo de errores
 * - Función para obtener ideas con filtros
 *
 * @example
 * ```typescript
 * const { ideas, loading, error, fetchIdeas } = useIdeaBank();
 *
 * useEffect(() => {
 *   fetchIdeas({ status: IdeaStatus.PENDING, limit: 50 });
 * }, []);
 * ```
 */
export function useIdeaBank() {
	const [ideas, setIdeas] = useState<IIdea[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	/**
	 * Obtiene las ideas del banco aplicando los filtros especificados
	 */
	const fetchIdeas = useCallback(async (filters?: IdeaBankFilters) => {
		setLoading(true);
		setError(null);

		try {
			const response: IIdeaBankResponse =
				await getIdeaBankUseCase.execute(filters);
			setIdeas(response.ideas);
			setTotal(response.total);

			// Console.log para debug según especificación
			console.log("🎨 Ideas del Banco de Linda:", {
				total: response.total,
				ideas: response.ideas,
				filtros: filters,
				timestamp: new Date().toISOString(),
			});
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Error desconocido al cargar las ideas";
			setError(errorMessage);
			console.error("Error fetching ideas:", err);
		} finally {
			setLoading(false);
		}
	}, []);

	/**
	 * Obtiene solo las ideas pendientes
	 */
	const fetchPendingIdeas = useCallback(
		async (limit = 50, offset = 0) => {
			return fetchIdeas({
				status: IdeaStatus.PENDING,
				limit,
				offset,
			});
		},
		[fetchIdeas]
	);

	/**
	 * Obtiene una idea por ID (para polling de content_generation_status)
	 */
	const getIdeaById = useCallback(
		async (id: string): Promise<IIdeaByIdPollingResponse> => {
			return await getIdeaByIdUseCase.execute(id);
		},
		[]
	);

	/**
	 * Actualiza el estado de una idea
	 */
	const updateIdeaStatus = useCallback(
		async (id: string, status: IdeaStatus) => {
			setLoading(true);
			setError(null);

			try {
				await updateIdeaStatusUseCase.execute(id, status);
				// Refrescar la lista de ideas después de actualizar
				await fetchIdeas();
			} catch (err) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "Error al actualizar el estado de la idea";
				setError(errorMessage);
				console.error("Error updating idea status:", err);
				throw err;
			} finally {
				setLoading(false);
			}
		},
		[fetchIdeas]
	);

	return {
		ideas,
		total,
		loading,
		error,
		fetchIdeas,
		fetchPendingIdeas,
		getIdeaById,
		updateIdeaStatus,
	};
}
