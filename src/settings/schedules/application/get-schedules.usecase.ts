import type {
	ICalendarPort,
	IGetSchedulesResponse,
} from "../domain/ports/calendar.port";

/**
 * Caso de uso para obtener los horarios configurados de la empresa
 * El backend infiere agencyId y companyId del token de autenticación
 */
export class GetSchedulesUseCase {
	constructor(private readonly calendarPort: ICalendarPort) {}

	/**
	 * Ejecuta el caso de uso para obtener los schedules
	 * @returns Horarios configurados con el timezone
	 */
	async execute(): Promise<IGetSchedulesResponse> {
		console.log("GetSchedulesUseCase");
		console.log("calendarPort", this.calendarPort);
		const response = await this.calendarPort.getSchedules();
		console.log("response", response);
		return response;
	}
}
