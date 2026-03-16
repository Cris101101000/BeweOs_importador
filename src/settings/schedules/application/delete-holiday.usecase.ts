import type { ICalendarPort } from "../domain/ports/calendar.port";

/**
 * Caso de uso para eliminar un festivo/vacación
 *
 * Responsabilidades:
 * - Eliminar un holiday específico por su ID
 * - Manejar errores durante la eliminación
 */
export class DeleteHolidayUseCase {
	constructor(private readonly calendarPort: ICalendarPort) {}

	/**
	 * Ejecuta el caso de uso para eliminar un holiday
	 * @param holidayId - ID del holiday a eliminar
	 */
	async execute(holidayId: string): Promise<void> {
		try {
			await this.calendarPort.deleteHoliday(holidayId);
		} catch (error) {
			console.error("Error en DeleteHolidayUseCase:", error);
			throw error;
		}
	}
}
