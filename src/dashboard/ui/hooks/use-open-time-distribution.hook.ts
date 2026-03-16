import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardAdapter } from "../../infrastructure/adapters/dashboard.adapter";
import { GetOpenTimeDistributionUseCase } from "../../application/get-open-time-distribution.usecase";
import { toLinearGraphDataFromOpenTimeDistribution } from "../../infrastructure/mappers/open-time-distribution.mapper";
import type {
	IGetOpenTimeDistributionRequest,
	ILinearGraphDataPoint,
} from "../../domain/interfaces/dashboard.interface";

export type OpenTimeDistributionPeriod = "Mensual" | "Semanal";

function getEndOfToday(): Date {
	const now = new Date();
	return new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		23,
		59,
		59,
		999
	);
}

/** Calcula dateFrom/dateTo para el periodo del gráfico de tiempo de apertura */
export function getDateRangeForOpenTimePeriod(
	period: OpenTimeDistributionPeriod
): IGetOpenTimeDistributionRequest {
	const endOfToday = getEndOfToday();
	const start = new Date(endOfToday);
	if (period === "Semanal") {
		start.setDate(start.getDate() - 7);
	} else {
		start.setMonth(start.getMonth() - 1);
	}
	start.setHours(0, 0, 0, 0);
	return {
		dateFrom: start.toISOString(),
		dateTo: endOfToday.toISOString(),
	};
}

function getDefaultDateRange(): IGetOpenTimeDistributionRequest {
	return getDateRangeForOpenTimePeriod("Mensual");
}

interface UseOpenTimeDistributionResponse {
	data: ILinearGraphDataPoint[];
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
}

/**
 * Hook que obtiene la distribución de tiempo de apertura desde la API
 * y la devuelve en formato para AreaLineChart de Aurora (name, whatsapp, email).
 * Usa el mismo rango de fechas por defecto que useNotificationStats (último mes).
 */
export const useOpenTimeDistribution = (
	request?: IGetOpenTimeDistributionRequest
): UseOpenTimeDistributionResponse => {
	const [distributionData, setDistributionData] = useState<
		ILinearGraphDataPoint[]
	>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	const params = useMemo<IGetOpenTimeDistributionRequest>(() => {
		if (request?.dateFrom && request?.dateTo) return request;
		return getDefaultDateRange();
	}, [request?.dateFrom, request?.dateTo]);

	const useCase = useMemo(() => {
		const adapter = new DashboardAdapter();
		return new GetOpenTimeDistributionUseCase(adapter);
	}, []);

	const fetchDistribution = useCallback(async () => {
		let isActive = true;

		try {
			setIsLoading(true);
			setError(null);

			const result = await useCase.execute(params);
			if (isActive) {
				setDistributionData(
					toLinearGraphDataFromOpenTimeDistribution(result)
				);
			}
		} catch (err) {
			if (isActive) {
				setError(err as Error);
				setDistributionData([]);
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
		await fetchDistribution();
	}, [fetchDistribution]);

	useEffect(() => {
		fetchDistribution();
	}, [fetchDistribution]);

	return {
		data: distributionData,
		isLoading,
		error,
		refetch,
	};
};
