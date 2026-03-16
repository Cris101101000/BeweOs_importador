import type {
	IOpenTimeDistribution,
	IOpenTimeDistributionInterval,
} from "../../domain/interfaces/dashboard.interface";
import type { GetOpenTimeDistributionDataDto } from "../dtos/get-open-time-distribution.dto";
import { mockOpenTimeDistribution } from "../mocks/dashboard-response.mock";

/**
 * Mapea la respuesta de la API al modelo de dominio open time distribution.
 */
export const toOpenTimeDistributionFromDto = (
	dto: GetOpenTimeDistributionDataDto
	): IOpenTimeDistribution => ({
		intervals: (dto.intervals ?? []).map(
			(interval): IOpenTimeDistributionInterval => ({
				key: interval.key,
				label: interval.label,
				email: interval.email ?? 0,
				whatsapp: interval.whatsapp ?? 0,
			})
		),
	});

// ): IOpenTimeDistribution => {
// 	// TODO: por ahora como no teneemos datosi reales los mockeamos
// 	return mockOpenTimeDistribution;
// };

/**
 * Convierte IOpenTimeDistribution al formato que espera LinearGraph (name, whatsapp, email).
 */
export const toLinearGraphDataFromOpenTimeDistribution = (
	distribution: IOpenTimeDistribution
): Array<{ name: string; whatsapp: number; email: number }> =>
	distribution.intervals.map((interval) => ({
		name: interval.label,
		whatsapp: interval.whatsapp,
		email: interval.email,
	}));
