import type { IHoliday as DomainHoliday } from "@settings/schedules/domain/interfaces/holiday.interface";
import type { ICalendarPort } from "../domain/ports/calendar.port";

export class UpdateHolidaysUseCase {
	constructor(private readonly calendarPort: ICalendarPort) {}

	async execute(agencyId: string, holidays: DomainHoliday[]): Promise<void> {
		return this.calendarPort.updateCalendar(agencyId, { holidays });
	}
}
