import type { ISchedule } from "@settings/bussinesConfig/domain/interfaces/schedule.interface";
import type { ICalendarPort } from "../domain/ports/calendar.port";

/**
 * Caso de uso para actualizar los horarios de la empresa
 * Utiliza el endpoint POST /companies/schedules/bulk
 * El backend infiere agencyId y companyId del token de autenticación
 */
export class UpdateSchedulesUseCase {
	constructor(private readonly calendarPort: ICalendarPort) {}

	/**
	 * Ejecuta el caso de uso para actualizar los schedules
	 * @param schedule - Horarios completos a guardar (todos los días de la semana)
	 * @param timezone - Timezone a usar (ej: "America/Bogota")
	 */
	async execute(schedule: ISchedule, timezone: string): Promise<void> {
		console.log("UpdateSchedulesUseCase - Ejecutando...");
		console.log("Schedule:", schedule);
		console.log("Timezone:", timezone);

		await this.calendarPort.updateSchedules(schedule, timezone);

		console.log("UpdateSchedulesUseCase - Completado");
	}
}
