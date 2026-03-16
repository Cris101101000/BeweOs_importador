import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardAdapter } from "../../infrastructure/adapters/dashboard.adapter";
import { GetNotificationStatsUseCase } from "../../application/get-notification-stats.usecase";
import type {
	IGetNotificationStatsRequest,
	INotificationStats,
} from "../../domain/interfaces/dashboard.interface";

function getDefaultDateRange(): IGetNotificationStatsRequest {
	const now = new Date();
	const oneMonthAgo = new Date(now);
	oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
	oneMonthAgo.setHours(0, 0, 0, 0);

	const endOfToday = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		23,
		59,
		59,
		999
	);
	return {
		dateFrom: oneMonthAgo.toISOString(),
		dateTo: endOfToday.toISOString(),
	};
}

interface UseNotificationStatsResponse {
	data: INotificationStats | null;
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
}

/**
 * Hook que obtiene las estadísticas de notificaciones desde la API.
 * Si no se pasan fechas, usa por defecto el último mes (desde hoy hace un mes hasta hoy).
 */
export const useNotificationStats = (
	request?: IGetNotificationStatsRequest
): UseNotificationStatsResponse => {
	const [data, setData] = useState<INotificationStats | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	const params = useMemo<IGetNotificationStatsRequest>(() => {
		if (request?.dateFrom && request?.dateTo) return request;
		return getDefaultDateRange();
	}, [request?.dateFrom, request?.dateTo]);

	const useCase = useMemo(() => {
		const adapter = new DashboardAdapter();
		return new GetNotificationStatsUseCase(adapter);
	}, []);

	const fetchStats = useCallback(async () => {
		let isActive = true;

		try {
			setIsLoading(true);
			setError(null);

			const result = await useCase.execute(params);
			if (isActive) {
				setData(result);
			}
		} catch (err) {
			if (isActive) {
				setError(err as Error);
				setData(null);
			}
		} finally {
			if (isActive) {
				setIsLoading(false);
			}
		}

		return () => {
			isActive = false;
		};
	}, [params, useCase]);

	const refetch = useCallback(async () => {
		await fetchStats();
	}, [fetchStats]);

	useEffect(() => {
		fetchStats();
	}, [fetchStats]);

	return {
		data,
		isLoading,
		error,
		refetch,
	};
};
