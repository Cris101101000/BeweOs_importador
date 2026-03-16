import { useSession } from "@shared/ui/contexts/session-context/session-context";
import { useTranslate } from "@tolgee/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GetClientsByFilterUseCase } from "@clients/application/get-clients-by-filter.usecase";
import { STATUS_CLIENT } from "@clients/domain/constants/status-client.constants";
import type { IClientFilter } from "@clients/domain/interfaces/client-filter.interface";
import type { IClient } from "@clients/domain/interfaces/client.interface";
import { ClientAdapter } from "@clients/infrastructure/adapters/client.adapter";

interface ColumnData {
	id: string;
	title: string;
	color: string;
	order: number;
	clients: IClient[];
	isLoading: boolean;
	hasMore: boolean;
	page: number;
	total: number;
}

interface UseKanbanColumnsResponse {
	columns: ColumnData[];
	isInitialLoading: boolean;
	loadMoreClients: (columnId: string) => Promise<void>;
	refetchAllColumns: () => Promise<void>;
	moveClientBetweenColumns: (
		client: IClient,
		fromColumnId: string,
		toColumnId: string,
		toIndex: number
	) => void;
}

const PAGE_SIZE = 20;

/**
 * Hook personalizado para manejar las columnas del kanban con peticiones separadas por status
 */
export const useKanbanColumns = (
	baseFilter?: IClientFilter
): UseKanbanColumnsResponse => {
	const { t } = useTranslate();
	// Estados para cada columna - inicialización perezosa para evitar renders innecesarios
	const [columnsData, setColumnsData] = useState<Record<string, ColumnData>>(
		() => {
			// Inicializar todas las columnas con estado vacío
			const initialColumns: Record<string, ColumnData> = {};
			for (const [statusKey, statusConfig] of Object.entries(STATUS_CLIENT)) {
				initialColumns[statusKey] = {
					id: statusKey,
					title: t(
						statusConfig.translationKey,
						statusKey.charAt(0).toUpperCase() + statusKey.slice(1)
					),
					color: statusConfig.color,
					order: statusConfig.order,
					clients: [],
					isLoading: false,
					hasMore: false,
					page: 0,
					total: 0,
				};
			}
			return initialColumns;
		}
	);
	const [isInitialLoading, setIsInitialLoading] = useState(true);
	const { agency } = useSession();
	const companyId = agency?.id;
	const hasInitialized = useRef(false);
	const abortControllerRef = useRef<AbortController | null>(null);

	// Instancia del caso de uso
	const useCase = useMemo(() => {
		const adapter = new ClientAdapter();
		return new GetClientsByFilterUseCase(adapter);
	}, []);

	// Ref para mantener baseFilter actualizado sin causar recreación de callbacks
	const baseFilterRef = useRef(baseFilter);
	baseFilterRef.current = baseFilter;

	// Función para cargar clientes de una columna específica
	const loadClientsForColumn = useCallback(
		async (statusKey: string, page = 1, append = false) => {
			const statusConfig =
				STATUS_CLIENT[statusKey as keyof typeof STATUS_CLIENT];
			if (!statusConfig || !companyId) return;

			try {
				// Actualizar estado de loading para la columna
				setColumnsData((prev) => ({
					...prev,
					[statusKey]: {
						...prev[statusKey],
						isLoading: true,
					},
				}));

				const filters: IClientFilter = {
					...baseFilterRef.current,
					// Always scope this request to the specific status/column
					status: [statusConfig.value],
					limit: PAGE_SIZE,
					offset: (page - 1) * PAGE_SIZE,
				};

				const result = await useCase.execute(filters);

				setColumnsData((prev) => {
					const existingColumn = prev[statusKey];
					const newClients =
						append && existingColumn
							? [...existingColumn.clients, ...result.clients]
							: result.clients;

					return {
						...prev,
						[statusKey]: {
							...prev[statusKey],
							clients: newClients,
							isLoading: false,
							hasMore: result.clients.length === PAGE_SIZE,
							page: page,
							total: result.total,
						},
					};
				});
			} catch (error) {
				console.error(`Error loading clients for status ${statusKey}:`, error);
				setColumnsData((prev) => ({
					...prev,
					[statusKey]: {
						...prev[statusKey],
						isLoading: false,
						hasMore: false, // Stop trying to load more on error
					},
				}));
			}
		},
		[useCase, companyId]
	);

	// Función para cargar más clientes en una columna (scroll infinito)
	const loadMoreClients = useCallback(
		async (columnId: string) => {
			const column = columnsData[columnId];
			if (!column || column.isLoading || !column.hasMore) return;

			await loadClientsForColumn(columnId, column.page + 1, true);
		},
		[columnsData, loadClientsForColumn]
	);

	// Función para mover un cliente entre columnas (optimistic update)
	const moveClientBetweenColumns = useCallback(
		(
			client: IClient,
			fromColumnId: string,
			toColumnId: string,
			toIndex: number
		) => {
			setColumnsData((prev) => {
				const newColumns = { ...prev };

				// Obtener columnas origen y destino
				const fromColumn = newColumns[fromColumnId];
				const toColumn = newColumns[toColumnId];

				if (!fromColumn || !toColumn) return prev;

				// Remover cliente de la columna origen
				const updatedFromClients = fromColumn.clients.filter(
					(c) => c.id !== client.id
				);

				// Insertar cliente en la columna destino en la posición indicada
				const updatedToClients = [...toColumn.clients];
				updatedToClients.splice(toIndex, 0, client);

				return {
					...newColumns,
					[fromColumnId]: {
						...fromColumn,
						clients: updatedFromClients,
						total: fromColumn.total - 1,
					},
					[toColumnId]: {
						...toColumn,
						clients: updatedToClients,
						total: toColumn.total + 1,
					},
				};
			});
		},
		[]
	);

	// Función para recargar todas las columnas
	const refetchAllColumns = useCallback(async () => {
		// Cancelar peticiones anteriores si existen
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		// Crear nuevo controller para esta operación
		abortControllerRef.current = new AbortController();

		setIsInitialLoading(true);
		const statusKeys = Object.keys(STATUS_CLIENT);

		try {
			// Ejecutar todas las peticiones en paralelo para máximo performance
			await Promise.all(
				statusKeys.map((statusKey) => loadClientsForColumn(statusKey, 1, false))
			);
		} catch (error) {
			// Solo loggear si no fue cancelado intencionalmente
			if (error instanceof Error && error.name !== "AbortError") {
				console.error("Error refetching columns:", error);
			}
		} finally {
			setIsInitialLoading(false);
		}
	}, [loadClientsForColumn]);

	// Cargar datos iniciales y cuando cambian los filtros
	useEffect(() => {
		if (!companyId) return;

		// Evitar llamadas duplicadas si ya se está cargando
		if (!hasInitialized.current) {
			hasInitialized.current = true;
		}

		refetchAllColumns();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [companyId, JSON.stringify(baseFilter)]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	// Crear array de columnas ordenadas
	const columns = useMemo(() => {
		return Object.values(columnsData).sort((a, b) => a.order - b.order);
	}, [columnsData]);

	return {
		columns,
		isInitialLoading,
		loadMoreClients,
		refetchAllColumns,
		moveClientBetweenColumns,
	};
};
