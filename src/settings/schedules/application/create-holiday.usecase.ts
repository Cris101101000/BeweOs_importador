import type { IHoliday } from "../domain/interfaces/holiday.interface";
import type { ICalendarPort } from "../domain/ports/calendar.port";

/**
 * Caso de uso para crear un festivo/vacación
 *
 * Responsabilidades:
 * - Crear un nuevo holiday en el sistema
 * - Retornar el holiday creado con su ID asignado
 */
export class CreateHolidayUseCase {
	constructor(private readonly calendarPort: ICalendarPort) {}

	/**
	 * Ejecuta el caso de uso para crear un holiday
	 * @param holiday - Holiday a crear (sin ID)
	 * @returns Holiday creado con ID asignado
	 */
	async execute(holiday: Omit<IHoliday, "id">): Promise<IHoliday> {
		try {
			const createdHoliday = await this.calendarPort.createHoliday(holiday);
			return createdHoliday;
		} catch (error) {
			console.error("Error en CreateHolidayUseCase:", error);
			throw error;
		}
	}
}
