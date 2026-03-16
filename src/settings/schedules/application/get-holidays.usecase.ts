import type { IHoliday } from "../domain/interfaces/holiday.interface";
import type { ICalendarPort } from "../domain/ports/calendar.port";

/**
 * Caso de uso para obtener festivos y vacaciones
 *
 * Responsabilidades:
 * - Obtener la lista de festivos y vacaciones desde el API
 * - Retornar los datos en formato del dominio
 */
export class GetHolidaysUseCase {
	constructor(private readonly calendarPort: ICalendarPort) {}

	/**
	 * Ejecuta el caso de uso para obtener holidays
	 * @returns Array de holidays en formato del dominio
	 */
	async execute(): Promise<IHoliday[]> {
		try {
			const holidays = await this.calendarPort.getHolidays();
			return holidays;
		} catch (error) {
			console.error("Error en GetHolidaysUseCase:", error);
			throw error;
		}
	}
}
